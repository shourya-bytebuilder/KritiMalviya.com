-- =============================================================================
-- STEP 3 MIGRATION: PRODUCTION BOOKING, PAYMENT STATE & CONCURRENCY CONTROLS
-- Adv. Kriti Malviya Chambers (Kritimalviya.com)
-- =============================================================================

-- 1. Ensure required extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Schema Adjustments for bookings table
DO $$
BEGIN
    -- fee_snapshot: Authoritative immutable price snapshot at booking time
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'fee_snapshot'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN fee_snapshot NUMERIC(12,2) NOT NULL DEFAULT 1000.00;
    END IF;

    -- currency: Currency string (INR)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'currency'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN currency TEXT NOT NULL DEFAULT 'INR';
    END IF;

    -- confirmation_token: Cryptographic token for guest confirmation page access
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'confirmation_token'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN confirmation_token TEXT UNIQUE;
    END IF;

    -- confirmation_token_expires_at: Expiration for the confirmation token
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'confirmation_token_expires_at'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN confirmation_token_expires_at TIMESTAMPTZ;
    END IF;

    -- hold_expires_at: Temporary slot reservation duration during payment
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'bookings' AND column_name = 'hold_expires_at'
    ) THEN
        ALTER TABLE public.bookings ADD COLUMN hold_expires_at TIMESTAMPTZ DEFAULT (now() + interval '15 minutes');
    END IF;
END $$;

-- 3. Schema Adjustments for payments table
DO $$
BEGIN
    -- merchant_order_id: PhonePe merchantTransactionId
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'merchant_order_id'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN merchant_order_id TEXT UNIQUE;
    END IF;

    -- idempotency_key: Unique idempotency key preventing duplicate charges/records
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'idempotency_key'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN idempotency_key TEXT UNIQUE;
    END IF;

    -- verified_at: Timestamp when PhonePe status was verified server-side
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'verified_at'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN verified_at TIMESTAMPTZ;
    END IF;

    -- gateway: Default gateway name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'payments' AND column_name = 'gateway'
    ) THEN
        ALTER TABLE public.payments ADD COLUMN gateway TEXT DEFAULT 'PHONEPE';
    END IF;
END $$;

-- 4. Create email_logs Table for Idempotent Transactional Email Observability
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idempotency_key TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    provider TEXT NOT NULL DEFAULT 'RESEND',
    provider_message_id TEXT NULL,
    status TEXT NOT NULL DEFAULT 'SENT',
    error_message TEXT NULL,
    metadata JSONB NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_email_logs_key ON public.email_logs (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs (created_at DESC);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'email_logs' AND policyname = 'email_logs_admin_only'
    ) THEN
        CREATE POLICY email_logs_admin_only ON public.email_logs
            FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() 
                      AND role IN ('SUPER_ADMIN', 'ADMIN')
                )
            );
    END IF;
END $$;

-- 5. Helper Function: Server-Generated Unique Booking Reference (KM-YYYYMMDD-XXXX)
CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_date_part TEXT;
    v_random_part TEXT;
    v_ref TEXT;
    v_exists BOOLEAN;
    v_attempts INT := 0;
BEGIN
    -- Current date in Asia/Kolkata timezone: YYYYMMDD
    v_date_part := to_char(now() AT TIME ZONE 'Asia/Kolkata', 'YYYYMMDD');
    LOOP
        v_attempts := v_attempts + 1;
        IF v_attempts > 25 THEN
            RAISE EXCEPTION 'COLLISION_OVERFLOW: Unable to generate unique booking reference after 25 attempts.';
        END IF;

        -- Generate 4-character cryptographic alphanumeric uppercase string
        v_random_part := upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 4));
        v_ref := 'KM-' || v_date_part || '-' || v_random_part;

        SELECT EXISTS (
            SELECT 1 FROM public.bookings WHERE booking_reference = v_ref
        ) INTO v_exists;

        IF NOT v_exists THEN
            RETURN v_ref;
        END IF;
    END LOOP;
END;
$$;

-- 6. Atomic Slot Reservation & Booking Creation Function
-- Enforces: Server-side fee, schedule validation, blocked date check, advisory lock,
-- and slot overlap protection.
CREATE OR REPLACE FUNCTION public.create_consultation_booking(
    p_full_name TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_whatsapp TEXT DEFAULT NULL,
    p_country TEXT DEFAULT NULL,
    p_preferred_contact TEXT DEFAULT 'Email',
    p_service_slug_or_id TEXT DEFAULT NULL,
    p_consultation_type TEXT DEFAULT 'LEGAL',
    p_booking_date DATE DEFAULT NULL,
    p_start_time TIME DEFAULT NULL,
    p_duration_minutes INT DEFAULT 30,
    p_mode TEXT DEFAULT 'Online Consultation',
    p_short_description TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_customer_id UUID;
    v_service RECORD;
    v_fee NUMERIC(12,2) := 1000.00;
    v_service_id UUID := NULL;
    v_service_title TEXT := 'General Consultation';
    v_end_time TIME;
    v_day_of_week INT;
    v_is_blocked BOOLEAN := FALSE;
    v_is_scheduled BOOLEAN := FALSE;
    v_is_occupied BOOLEAN := FALSE;
    v_booking_ref TEXT;
    v_booking_id UUID;
    v_confirmation_token TEXT;
    v_token_expires TIMESTAMPTZ;
    v_hold_expires TIMESTAMPTZ;
    v_lock_key BIGINT;
    v_today_ist DATE;
BEGIN
    -- Validate required input fields
    IF p_full_name IS NULL OR length(trim(p_full_name)) < 2 THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Full name is required (minimum 2 characters).';
    END IF;

    IF p_email IS NULL OR p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: A valid email address is required.';
    END IF;

    IF p_phone IS NULL OR length(trim(p_phone)) < 8 THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: A valid contact phone number is required.';
    END IF;

    IF p_booking_date IS NULL THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Consultation date is required.';
    END IF;

    IF p_start_time IS NULL THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Consultation start time is required.';
    END IF;

    -- Verify date is not in the past (Asia/Kolkata)
    v_today_ist := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
    IF p_booking_date < v_today_ist THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Cannot schedule a consultation in the past.';
    END IF;

    -- Duration normalization
    IF p_duration_minutes IS NULL OR p_duration_minutes NOT IN (30, 60) THEN
        p_duration_minutes := 30;
    END IF;
    v_end_time := p_start_time + (p_duration_minutes || ' minutes')::interval;

    -- Check Blocked Dates
    SELECT EXISTS (
        SELECT 1 FROM public.blocked_dates 
        WHERE blocked_date = p_booking_date
    ) INTO v_is_blocked;

    IF v_is_blocked THEN
        RAISE EXCEPTION 'DATE_BLOCKED: The chambers are unavailable on the selected date.';
    END IF;

    -- Check Weekly Schedule (0 = Sunday, 1 = Monday, etc.)
    v_day_of_week := EXTRACT(DOW FROM p_booking_date)::INT;
    IF v_day_of_week = 0 THEN
        RAISE EXCEPTION 'SCHEDULE_CLOSED: Chambers are closed on Sundays.';
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.availability 
        WHERE day_of_week = v_day_of_week 
          AND active = TRUE 
          AND start_time <= p_start_time 
          AND end_time >= v_end_time
    ) INTO v_is_scheduled;

    -- If availability records exist in DB, enforce them
    IF EXISTS (SELECT 1 FROM public.availability WHERE active = TRUE) AND NOT v_is_scheduled THEN
        RAISE EXCEPTION 'SCHEDULE_UNAVAILABLE: Selected time slot falls outside chamber working hours.';
    END IF;

    -- Concurrency Protection: Acquire Transaction Advisory Lock on Date + Slot
    v_lock_key := hashtext(p_booking_date::text || '_' || p_start_time::text);
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- Overlap Prevention: Check conflicting bookings
    -- Active states: CONFIRMED, PENDING, or PENDING_PAYMENT with active hold
    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE date = p_booking_date
          AND (
              status IN ('CONFIRMED', 'PENDING')
              OR (status = 'PENDING_PAYMENT' AND hold_expires_at > now())
          )
          AND (start_time < v_end_time AND end_time > p_start_time)
    ) INTO v_is_occupied;

    IF v_is_occupied THEN
        RAISE EXCEPTION 'SLOT_UNAVAILABLE: The selected slot has just been reserved. Please select another time.';
    END IF;

    -- Authoritative Service & Fee Resolution
    IF p_service_slug_or_id IS NOT NULL THEN
        SELECT * INTO v_service FROM public.services 
        WHERE (id::text = p_service_slug_or_id OR slug = p_service_slug_or_id OR title = p_service_slug_or_id)
          AND visible = TRUE
        LIMIT 1;

        IF FOUND THEN
            v_service_id := v_service.id;
            v_service_title := v_service.title;
            IF v_service.fee IS NOT NULL AND v_service.fee > 0 THEN
                v_fee := v_service.fee;
            END IF;
        END IF;
    END IF;

    -- Customer Resolution (Find or Create)
    SELECT id INTO v_customer_id FROM public.customers 
    WHERE lower(email) = lower(trim(p_email)) 
    LIMIT 1;

    IF v_customer_id IS NULL THEN
        INSERT INTO public.customers (
            full_name,
            email,
            phone,
            whatsapp,
            country,
            status,
            created_at,
            updated_at
        ) VALUES (
            trim(p_full_name),
            lower(trim(p_email)),
            trim(p_phone),
            p_whatsapp,
            p_country,
            'ACTIVE',
            now(),
            now()
        )
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE public.customers
        SET full_name = trim(p_full_name),
            phone = COALESCE(trim(p_phone), phone),
            whatsapp = COALESCE(p_whatsapp, whatsapp),
            country = COALESCE(p_country, country),
            updated_at = now()
        WHERE id = v_customer_id;
    END IF;

    -- Generate Booking Reference and Secure Confirmation Token
    v_booking_ref := public.generate_booking_reference();
    v_confirmation_token := encode(gen_random_bytes(24), 'hex');
    v_token_expires := now() + interval '48 hours';
    v_hold_expires := now() + interval '15 minutes';

    -- Insert Pending Booking
    INSERT INTO public.bookings (
        booking_reference,
        customer_id,
        service_id,
        consultation_type,
        date,
        start_time,
        end_time,
        duration_minutes,
        mode,
        short_description,
        preferred_contact,
        status,
        payment_status,
        fee_snapshot,
        currency,
        confirmation_token,
        confirmation_token_expires_at,
        hold_expires_at,
        created_at,
        updated_at
    ) VALUES (
        v_booking_ref,
        v_customer_id,
        v_service_id,
        COALESCE(p_consultation_type, 'LEGAL'),
        p_booking_date,
        p_start_time,
        v_end_time,
        p_duration_minutes,
        p_mode,
        p_short_description,
        p_preferred_contact,
        'PENDING_PAYMENT',
        'PENDING',
        v_fee,
        'INR',
        v_confirmation_token,
        v_token_expires,
        v_hold_expires,
        now(),
        now()
    )
    RETURNING id INTO v_booking_id;

    -- Return Safe Response
    RETURN jsonb_build_object(
        'success', TRUE,
        'booking_id', v_booking_id,
        'booking_reference', v_booking_ref,
        'service_title', v_service_title,
        'date', p_booking_date,
        'start_time', to_char(p_start_time, 'HH12:MI AM'),
        'duration_minutes', p_duration_minutes,
        'mode', p_mode,
        'fee', v_fee,
        'currency', 'INR',
        'confirmation_token', v_confirmation_token,
        'hold_expires_at', v_hold_expires
    );
END;
$$;

-- 7. Payment Verification & Atomic State Transition Function
CREATE OR REPLACE FUNCTION public.verify_and_update_payment(
    p_merchant_order_id TEXT,
    p_gateway_transaction_id TEXT,
    p_status TEXT, -- 'PAID', 'FAILED', 'CANCELLED', 'VERIFICATION_PENDING'
    p_amount NUMERIC,
    p_gateway_response JSONB DEFAULT NULL,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_payment RECORD;
    v_booking RECORD;
    v_customer RECORD;
    v_service RECORD;
BEGIN
    -- Locate existing payment record by merchant_order_id
    SELECT * INTO v_payment FROM public.payments 
    WHERE merchant_order_id = p_merchant_order_id 
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'PAYMENT_NOT_FOUND: No payment transaction matches merchant order %', p_merchant_order_id;
    END IF;

    -- Locate corresponding booking
    SELECT * INTO v_booking FROM public.bookings 
    WHERE id = v_payment.booking_id 
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'BOOKING_NOT_FOUND: Booking record % missing for payment.', v_payment.booking_id;
    END IF;

    -- Locate customer
    SELECT * INTO v_customer FROM public.customers WHERE id = v_booking.customer_id;

    -- Locate service
    SELECT * INTO v_service FROM public.services WHERE id = v_booking.service_id;

    -- IDEMPOTENCY CHECK: If already marked PAID, return existing success state
    IF v_payment.status = 'PAID' AND v_booking.status = 'CONFIRMED' THEN
        RETURN jsonb_build_object(
            'success', TRUE,
            'idempotent', TRUE,
            'booking_reference', v_booking.booking_reference,
            'payment_status', 'PAID',
            'booking_status', 'CONFIRMED',
            'amount', v_payment.amount,
            'client_name', v_customer.full_name,
            'client_email', v_customer.email
        );
    END IF;

    -- Process PAID outcome
    IF p_status = 'PAID' THEN
        -- Amount validation: verify amount matches authoritative fee snapshot
        IF p_amount IS NOT NULL AND ABS(p_amount - v_booking.fee_snapshot) > 0.01 THEN
            RAISE EXCEPTION 'AMOUNT_MISMATCH: Paid amount % does not match expected booking fee %', p_amount, v_booking.fee_snapshot;
        END IF;

        -- Update payments table
        UPDATE public.payments
        SET status = 'PAID',
            gateway_transaction_id = COALESCE(p_gateway_transaction_id, gateway_transaction_id),
            gateway_response = COALESCE(p_gateway_response, gateway_response),
            verified_at = now(),
            updated_at = now()
        WHERE id = v_payment.id;

        -- Update bookings table
        UPDATE public.bookings
        SET status = 'CONFIRMED',
            payment_status = 'PAID',
            confirmed_at = now(),
            updated_at = now()
        WHERE id = v_booking.id;

        -- Create Administrative Notification for Chambers
        INSERT INTO public.notifications (
            recipient_id,
            type,
            title,
            message,
            created_at,
            read
        )
        SELECT 
            p.id,
            'BOOKING',
            'New Confirmed Consultation: ' || v_booking.booking_reference,
            'Client ' || v_customer.full_name || ' confirmed ' || COALESCE(v_service.title, 'Consultation') || ' on ' || v_booking.date || ' at ' || to_char(v_booking.start_time, 'HH12:MI AM') || ' (Paid ₹' || v_booking.fee_snapshot || ' via PhonePe).',
            now(),
            FALSE
        FROM public.profiles p
        WHERE p.role IN ('SUPER_ADMIN', 'ADMIN')
        LIMIT 5;

        RETURN jsonb_build_object(
            'success', TRUE,
            'idempotent', FALSE,
            'booking_reference', v_booking.booking_reference,
            'confirmation_token', v_booking.confirmation_token,
            'payment_status', 'PAID',
            'booking_status', 'CONFIRMED',
            'amount', v_booking.fee_snapshot,
            'date', v_booking.date,
            'start_time', to_char(v_booking.start_time, 'HH12:MI AM'),
            'mode', v_booking.mode,
            'service_title', COALESCE(v_service.title, 'Consultation'),
            'client_name', v_customer.full_name,
            'client_email', v_customer.email,
            'client_phone', v_customer.phone
        );

    ELSIF p_status IN ('FAILED', 'CANCELLED') THEN
        -- Mark payment failed/cancelled
        UPDATE public.payments
        SET status = p_status,
            gateway_response = COALESCE(p_gateway_response, gateway_response),
            updated_at = now()
        WHERE id = v_payment.id;

        -- Mark booking payment state (slot hold is automatically freed after expiry or failure)
        UPDATE public.bookings
        SET payment_status = p_status,
            updated_at = now()
        WHERE id = v_booking.id;

        RETURN jsonb_build_object(
            'success', FALSE,
            'idempotent', FALSE,
            'booking_reference', v_booking.booking_reference,
            'payment_status', p_status,
            'booking_status', v_booking.status,
            'message', 'Payment was ' || lower(p_status) || ' by gateway.'
        );

    ELSE
        -- Verification Pending
        UPDATE public.payments
        SET status = 'VERIFICATION_PENDING',
            updated_at = now()
        WHERE id = v_payment.id;

        UPDATE public.bookings
        SET payment_status = 'VERIFICATION_PENDING',
            updated_at = now()
        WHERE id = v_booking.id;

        RETURN jsonb_build_object(
            'success', TRUE,
            'idempotent', FALSE,
            'booking_reference', v_booking.booking_reference,
            'payment_status', 'VERIFICATION_PENDING',
            'booking_status', v_booking.status
        );
    END IF;
END;
$$;

-- 8. Secure Token-Based Confirmation Inspector
-- Prevents IDOR by validating cryptographic confirmation token
CREATE OR REPLACE FUNCTION public.get_confirmed_booking_by_token(
    p_token TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_booking RECORD;
    v_customer RECORD;
    v_service RECORD;
    v_payment RECORD;
BEGIN
    IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
        RAISE EXCEPTION 'INVALID_TOKEN: Valid confirmation token required.';
    END IF;

    SELECT * INTO v_booking FROM public.bookings
    WHERE confirmation_token = trim(p_token)
      AND (confirmation_token_expires_at IS NULL OR confirmation_token_expires_at > now())
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'TOKEN_EXPIRED_OR_NOT_FOUND: The booking token is invalid or has expired.';
    END IF;

    SELECT * INTO v_customer FROM public.customers WHERE id = v_booking.customer_id;
    SELECT * INTO v_service FROM public.services WHERE id = v_booking.service_id;
    SELECT * INTO v_payment FROM public.payments WHERE booking_id = v_booking.id ORDER BY created_at DESC LIMIT 1;

    RETURN jsonb_build_object(
        'success', TRUE,
        'booking_reference', v_booking.booking_reference,
        'service_title', COALESCE(v_service.title, 'General Consultation'),
        'date', v_booking.date,
        'start_time', to_char(v_booking.start_time, 'HH12:MI AM'),
        'duration_minutes', v_booking.duration_minutes,
        'mode', v_booking.mode,
        'amount', v_booking.fee_snapshot,
        'currency', v_booking.currency,
        'booking_status', v_booking.status,
        'payment_status', v_booking.payment_status,
        'client_name', v_customer.full_name,
        'client_email', v_customer.email,
        'gateway', COALESCE(v_payment.gateway, 'PHONEPE'),
        'created_at', v_booking.created_at
    );
END;
$$;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.generate_booking_reference() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_consultation_booking(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, DATE, TIME, INT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_and_update_payment(TEXT, TEXT, TEXT, NUMERIC, JSONB, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_confirmed_booking_by_token(TEXT) TO anon, authenticated, service_role;
