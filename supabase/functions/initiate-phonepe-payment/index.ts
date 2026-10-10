// =============================================================================
// EDGE FUNCTION: INITIATE PHONEPE PAYMENT (initiate-phonepe-payment)
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { getPhonePeConfig, initiatePaymentWithPhonePe } from "../_shared/phonepe.ts";

Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();
    const { booking_reference, confirmation_token } = body;

    if (!booking_reference || !confirmation_token) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_REQUEST",
        message: "Booking reference and confirmation token are required."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Initialize Supabase Service Role Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({
        success: false,
        code: "SERVER_CONFIG_ERROR",
        message: "Backend configuration error."
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Fetch Authoritative Booking Details & Validate Ownership
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*, customers(*), services(*)")
      .eq("booking_reference", booking_reference.trim())
      .eq("confirmation_token", confirmation_token.trim())
      .single();

    if (bErr || !booking) {
      return new Response(JSON.stringify({
        success: false,
        code: "ACCESS_DENIED",
        message: "Invalid booking reference or expired confirmation access."
      }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if booking is already paid
    if (booking.status === "CONFIRMED" && booking.payment_status === "PAID") {
      return new Response(JSON.stringify({
        success: true,
        already_paid: true,
        redirectUrl: `${Deno.env.get("PUBLIC_SITE_URL") || ""}/confirmation.html?token=${confirmation_token}&ref=${booking_reference}`,
        message: "This consultation has already been paid and confirmed."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if slot hold has expired
    if (booking.hold_expires_at && new Date(booking.hold_expires_at) < new Date() && booking.status === "PENDING_PAYMENT") {
      // Refresh hold for active checkout attempt (15 minutes)
      await supabase
        .from("bookings")
        .update({ hold_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() })
        .eq("id", booking.id);
    }

    // Authoritative Payable Amount: Never trust frontend!
    const payableAmountInr = Number(booking.fee_snapshot || 1000.00);
    const amountPaise = Math.round(payableAmountInr * 100);

    // 3. Generate Merchant Transaction ID
    // Format: MT_<BookingRefClean>_<Timestamp>
    const cleanRef = booking.booking_reference.replace(/[^A-Za-z0-9]/g, "");
    const merchantTransactionId = `MT_${cleanRef}_${Date.now()}`;
    const idempotencyKey = `PAY_${booking.id}_${merchantTransactionId}`;

    // 4. Create Payment Row in Database with PENDING Status
    const { data: paymentRecord, error: pErr } = await supabase
      .from("payments")
      .insert({
        booking_id: booking.id,
        customer_id: booking.customer_id,
        gateway: "PHONEPE",
        merchant_order_id: merchantTransactionId,
        amount: payableAmountInr,
        currency: "INR",
        status: "PENDING",
        idempotency_key: idempotencyKey,
        gateway_response: { initiated_at: new Date().toISOString() }
      })
      .select()
      .single();

    if (pErr) {
      console.warn("[Initiate Payment] Payment insert issue:", pErr.message);
    }

    // 5. Construct Redirect & Callback URLs
    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || "https://kritimalviya.com";
    const redirectUrl = `${siteUrl}/payment.html?token=${encodeURIComponent(confirmation_token)}&ref=${encodeURIComponent(booking_reference)}&merchantTxId=${encodeURIComponent(merchantTransactionId)}`;
    const callbackUrl = `${supabaseUrl}/functions/v1/verify-phonepe-payment`;

    // 6. Invoke PhonePe Gateway
    const phonePeConfig = getPhonePeConfig();
    const phonePeRes = await initiatePaymentWithPhonePe({
      merchantTransactionId,
      merchantUserId: `CUST_${booking.customer_id.substring(0, 8)}`,
      amountPaise,
      redirectUrl,
      callbackUrl,
      mobileNumber: booking.customers?.phone || "9999999999",
      config: phonePeConfig
    });

    if (phonePeRes.success && phonePeRes.redirectUrl) {
      // Update payment record with initiation status
      await supabase
        .from("payments")
        .update({
          status: "PROCESSING",
          gateway_response: {
            initiated_at: new Date().toISOString(),
            redirect_url: phonePeRes.redirectUrl
          }
        })
        .eq("merchant_order_id", merchantTransactionId);

      return new Response(JSON.stringify({
        success: true,
        redirectUrl: phonePeRes.redirectUrl,
        merchantTransactionId: merchantTransactionId,
        bookingReference: booking.booking_reference,
        amount: payableAmountInr,
        currency: "INR"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // In sandbox / test environment, if PhonePe UAT returned a simulation URL or error
      console.warn("[Initiate Payment] PhonePe gateway response:", phonePeRes);

      // If sandbox test environment or live credentials pending:
      // Provide clean simulated redirect to payment verification URL for sandbox testing
      if (phonePeConfig.environment === "UAT" && !phonePeRes.redirectUrl) {
        // Safe UAT Sandbox simulation URL
        const sandboxSimUrl = `${redirectUrl}&simulated=true`;
        return new Response(JSON.stringify({
          success: true,
          redirectUrl: sandboxSimUrl,
          merchantTransactionId: merchantTransactionId,
          bookingReference: booking.booking_reference,
          amount: payableAmountInr,
          currency: "INR",
          mode: "UAT_SANDBOX_SIMULATION"
        }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify({
        success: false,
        code: "GATEWAY_ERROR",
        message: phonePeRes.error || "PhonePe gateway could not initiate payment session. Please try again."
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Initiate Payment] Exception:", msg);
    return new Response(JSON.stringify({
      success: false,
      code: "INTERNAL_ERROR",
      message: "An error occurred while communicating with the payment gateway."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
