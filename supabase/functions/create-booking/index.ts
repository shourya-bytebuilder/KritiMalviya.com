// =============================================================================
// EDGE FUNCTION: CREATE BOOKING (create-booking)
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  // Handle CORS Preflight
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
    const {
      full_name,
      email,
      phone,
      whatsapp,
      country,
      preferred_contact,
      service_id,
      consultation_type,
      booking_date,
      start_time,
      duration_minutes,
      mode,
      short_description
    } = body;

    // 1. Strict Validation
    if (!full_name || typeof full_name !== "string" || full_name.trim().length < 2 || full_name.length > 100) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_NAME",
        message: "Please provide a valid full name (2-100 characters)."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_EMAIL",
        message: "Please provide a valid email address."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const cleanPhone = (phone || "").replace(/\s+/g, "");
    if (!cleanPhone || cleanPhone.length < 8 || cleanPhone.length > 20) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_PHONE",
        message: "Please provide a valid contact phone number (minimum 8 digits)."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!booking_date || !/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_DATE",
        message: "A valid consultation date (YYYY-MM-DD) is required."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!start_time || !/^\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?$/i.test(start_time.trim())) {
      return new Response(JSON.stringify({
        success: false,
        code: "INVALID_TIME",
        message: "A valid consultation time is required."
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Convert time to HH:MM:SS format
    let normalizedTime = start_time.trim();
    if (/AM|PM/i.test(normalizedTime)) {
      const match = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = match[2];
        const isPM = match[3].toUpperCase() === "PM";
        if (isPM && h < 12) h += 12;
        if (!isPM && h === 12) h = 0;
        normalizedTime = `${h < 10 ? "0" + h : h}:${m}:00`;
      }
    } else if (/^\d{1,2}:\d{2}$/.test(normalizedTime)) {
      normalizedTime = `${normalizedTime}:00`;
    }

    // Clean description to avoid excessive length
    const cleanDesc = (short_description || "").slice(0, 500);

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[Create Booking] Supabase service environment variables missing");
      return new Response(JSON.stringify({
        success: false,
        code: "SERVER_CONFIG_ERROR",
        message: "Backend service configuration error."
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. Call Atomic Database Procedure (create_consultation_booking)
    const { data, error } = await supabase.rpc("create_consultation_booking", {
      p_full_name: full_name.trim(),
      p_email: email.trim().toLowerCase(),
      p_phone: cleanPhone,
      p_whatsapp: whatsapp ? whatsapp.trim() : null,
      p_country: country ? country.trim() : null,
      p_preferred_contact: preferred_contact || "Email",
      p_service_slug_or_id: service_id || null,
      p_consultation_type: consultation_type || "LEGAL",
      p_booking_date: booking_date,
      p_start_time: normalizedTime,
      p_duration_minutes: parseInt(duration_minutes, 10) || 60,
      p_mode: mode || "Online Consultation",
      p_short_description: cleanDesc
    });

    if (error) {
      console.warn("[Create Booking] Procedure error:", error.message);
      let status = 400;
      let code = "BOOKING_ERROR";
      let message = "Could not reserve consultation slot.";

      if (error.message.includes("SLOT_UNAVAILABLE")) {
        code = "SLOT_UNAVAILABLE";
        message = "This consultation slot has just been reserved by another client. Please select another time.";
        status = 409;
      } else if (error.message.includes("DATE_BLOCKED")) {
        code = "DATE_BLOCKED";
        message = "Chambers are closed on the selected date.";
      } else if (error.message.includes("SCHEDULE_CLOSED") || error.message.includes("SCHEDULE_UNAVAILABLE")) {
        code = "OUTSIDE_HOURS";
        message = "Selected time falls outside chambers working hours.";
      }

      return new Response(JSON.stringify({
        success: false,
        code: code,
        message: message
      }), {
        status: status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Return booking reservation and token
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Create Booking] Exception:", msg);
    return new Response(JSON.stringify({
      success: false,
      code: "INTERNAL_ERROR",
      message: "An internal server error occurred while processing your booking."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
