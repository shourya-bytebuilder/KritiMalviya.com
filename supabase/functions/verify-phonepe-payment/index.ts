// =============================================================================
// EDGE FUNCTION: VERIFY PHONEPE PAYMENT & WEBHOOK (verify-phonepe-payment)
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import {
  getPhonePeConfig,
  checkPhonePeStatus,
  verifyWebhookSignature
} from "../_shared/phonepe.ts";
import {
  sendEmailWithResend,
  buildClientConfirmationEmailHtml,
  buildAdminBookingEmailHtml,
  getAdminNotifyEmail
} from "../_shared/resend.ts";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const phonePeConfig = getPhonePeConfig();

    let merchantTransactionId = "";
    let rawGatewayResponse: Record<string, unknown> = {};
    let isWebhook = false;

    // Detect if Webhook callback or Browser verification request
    const xVerifyHeader = req.headers.get("x-verify");

    if (xVerifyHeader) {
      // Direct Webhook Callback from PhonePe
      isWebhook = true;
      const body = await req.json();
      const base64Response = body.response;

      if (!base64Response) {
        return new Response(JSON.stringify({ error: "Missing webhook response payload" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Verify webhook signature
      const isValidSig = await verifyWebhookSignature(base64Response, xVerifyHeader, phonePeConfig);
      if (!isValidSig) {
        console.warn("[Verify Payment] Invalid webhook signature detected");
        return new Response(JSON.stringify({ error: "Invalid gateway signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const decodedJson = JSON.parse(atob(base64Response));
      merchantTransactionId = decodedJson.data?.merchantTransactionId || "";
      rawGatewayResponse = decodedJson;
    } else {
      // Browser Verification Request from payment.html return flow
      const body = await req.json();
      merchantTransactionId = body.merchant_transaction_id || body.merchantTransactionId;
      const confirmationToken = body.confirmation_token || body.token;

      if (!merchantTransactionId) {
        return new Response(JSON.stringify({
          success: false,
          code: "MISSING_TX_ID",
          message: "Merchant transaction identifier is required."
        }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // If simulated parameter passed in UAT sandbox
      if (body.simulated === true && phonePeConfig.environment === "UAT") {
        rawGatewayResponse = { simulated: true, note: "PhonePe UAT Sandbox verified" };
      }
    }

    // 1. Fetch Payment & Booking from Database
    const { data: payment, error: pErr } = await supabase
      .from("payments")
      .select("*, bookings(*, customers(*), services(*))")
      .eq("merchant_order_id", merchantTransactionId.trim())
      .single();

    if (pErr || !payment) {
      console.warn("[Verify Payment] Transaction not found in DB:", merchantTransactionId);
      return new Response(JSON.stringify({
        success: false,
        code: "ORDER_NOT_FOUND",
        message: "Payment transaction record not found."
      }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const booking = payment.bookings;
    const customer = booking?.customers;
    const service = booking?.services;

    // 2. IDEMPOTENCY CHECK: If already confirmed and paid, return success immediately
    if (payment.status === "PAID" && booking?.status === "CONFIRMED") {
      return new Response(JSON.stringify({
        success: true,
        idempotent: true,
        booking_reference: booking.booking_reference,
        payment_status: "PAID",
        booking_status: "CONFIRMED",
        confirmation_token: booking.confirmation_token,
        amount: payment.amount,
        message: "Consultation appointment is already verified and confirmed."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Query PhonePe Server-Side Status API (Unless UAT simulation)
    let paymentStatus: "PAID" | "FAILED" | "PENDING" | "UNKNOWN" = "UNKNOWN";
    let gatewayTxId = payment.gateway_transaction_id || "";

    if (rawGatewayResponse.simulated === true && phonePeConfig.environment === "UAT") {
      paymentStatus = "PAID";
      gatewayTxId = `SIM_PP_${Date.now()}`;
    } else {
      const statusRes = await checkPhonePeStatus({
        merchantTransactionId,
        config: phonePeConfig
      });

      paymentStatus = statusRes.status;
      if (statusRes.gatewayTransactionId) {
        gatewayTxId = statusRes.gatewayTransactionId;
      }
      rawGatewayResponse = Object.assign({}, rawGatewayResponse, statusRes.rawResponse || {});
    }

    // 4. Atomic Database Procedure: verify_and_update_payment
    const { data: updateResult, error: uErr } = await supabase.rpc("verify_and_update_payment", {
      p_merchant_order_id: merchantTransactionId,
      p_gateway_transaction_id: gatewayTxId,
      p_status: paymentStatus === "PAID" ? "PAID" : (paymentStatus === "FAILED" ? "FAILED" : "VERIFICATION_PENDING"),
      p_amount: payment.amount,
      p_gateway_response: rawGatewayResponse,
      p_idempotency_key: payment.idempotency_key
    });

    if (uErr) {
      console.error("[Verify Payment] Procedure error:", uErr.message);
      return new Response(JSON.stringify({
        success: false,
        code: "DATABASE_UPDATE_ERROR",
        message: "Could not record payment state update."
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 5. Trigger Resend Transactional Emails upon Successful Verification
    if (paymentStatus === "PAID" && !updateResult?.idempotent && customer?.email) {
      const emailPayload = {
        bookingReference: booking.booking_reference,
        clientName: customer.full_name || "Valued Client",
        clientEmail: customer.email,
        clientPhone: customer.phone,
        serviceTitle: service?.title || "Legal Consultation",
        date: booking.date,
        startTime: booking.start_time,
        durationMinutes: booking.duration_minutes || 30,
        mode: booking.mode || "Online Consultation",
        amount: Number(payment.amount),
        gatewayTransactionId: gatewayTxId
      };

      // Check if email was already sent (Deduplication)
      const clientEmailKey = `EMAIL_CONFIRM_${booking.booking_reference}`;
      const { data: existingLog } = await supabase
        .from("email_logs")
        .select("id")
        .eq("idempotency_key", clientEmailKey)
        .single();

      if (!existingLog) {
        // Send Client Confirmation Email
        const clientHtml = buildClientConfirmationEmailHtml(emailPayload);
        const clientMailRes = await sendEmailWithResend({
          to: customer.email,
          subject: `Consultation Confirmed (${booking.booking_reference}) — Adv. Kriti Malviya`,
          html: clientHtml
        });

        // Record in email_logs
        await supabase.from("email_logs").insert({
          idempotency_key: clientEmailKey,
          type: "BOOKING_CONFIRMED_CLIENT",
          recipient: customer.email,
          subject: `Consultation Confirmed (${booking.booking_reference})`,
          provider: "RESEND",
          provider_message_id: clientMailRes.id || null,
          status: clientMailRes.success ? "SENT" : "FAILED",
          error_message: clientMailRes.error || null,
          metadata: { booking_reference: booking.booking_reference }
        });

        // Send Chamber Admin Notification Email
        const adminEmail = getAdminNotifyEmail();
        const adminHtml = buildAdminBookingEmailHtml(emailPayload);
        const adminMailRes = await sendEmailWithResend({
          to: adminEmail,
          subject: `[New Appointment] ${booking.booking_reference} — ${customer.full_name}`,
          html: adminHtml
        });

        await supabase.from("email_logs").insert({
          idempotency_key: `EMAIL_ADMIN_${booking.booking_reference}`,
          type: "BOOKING_CONFIRMED_ADMIN",
          recipient: adminEmail,
          subject: `[New Appointment] ${booking.booking_reference}`,
          provider: "RESEND",
          provider_message_id: adminMailRes.id || null,
          status: adminMailRes.success ? "SENT" : "FAILED",
          error_message: adminMailRes.error || null,
          metadata: { booking_reference: booking.booking_reference }
        });
      }
    }

    // 6. Return Structured Response
    return new Response(JSON.stringify({
      success: paymentStatus === "PAID",
      status: paymentStatus,
      booking_reference: booking.booking_reference,
      confirmation_token: booking.confirmation_token,
      payment_status: paymentStatus,
      booking_status: paymentStatus === "PAID" ? "CONFIRMED" : booking.status,
      amount: payment.amount,
      service_title: service?.title || "Consultation",
      date: booking.date,
      start_time: booking.start_time,
      mode: booking.mode,
      client_name: customer?.full_name,
      gateway_transaction_id: gatewayTxId
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Verify Payment] Exception:", msg);
    return new Response(JSON.stringify({
      success: false,
      code: "INTERNAL_ERROR",
      message: "An internal server error occurred while verifying payment status."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
