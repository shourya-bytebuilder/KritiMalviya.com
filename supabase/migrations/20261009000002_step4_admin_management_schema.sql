-- =============================================================================
-- STEP 4 MIGRATION: MASTER ADMIN CONTROL CENTER SECURITY & MANAGEMENT PROCEDURES
-- Adv. Kriti Malviya Chambers (Kritimalviya.com)
-- =============================================================================

-- 1. Helper function: Get calling user's authoritative role from profiles table
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_auth_role() TO authenticated, anon, service_role;

-- 2. Secure Activity Logging RPC
CREATE OR REPLACE FUNCTION public.admin_log_activity(
    p_action TEXT,
    p_target_type TEXT DEFAULT NULL,
    p_target_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_user_id UUID;
    v_log_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'UNAUTHORIZED: Authentication required to log administrative activity.';
    END IF;

    INSERT INTO public.activity_logs (
        admin_id,
        action,
        target_type,
        target_id,
        metadata,
        created_at
    ) VALUES (
        v_user_id,
        trim(p_action),
        p_target_type,
        p_target_id,
        COALESCE(p_metadata, '{}'::jsonb),
        now()
    )
    RETURNING id INTO v_log_id;

    RETURN v_log_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_log_activity(TEXT, TEXT, UUID, JSONB) TO authenticated, service_role;

-- 3. Secure Booking Status Mutation RPC
-- Enforces allowed transitions: PENDING_PAYMENT, CONFIRMED, COMPLETED, CANCELLED
-- Enforces RBAC: Only SUPER_ADMIN and ADMIN may alter bookings
CREATE OR REPLACE FUNCTION public.admin_update_booking_status(
    p_booking_id UUID,
    p_new_status TEXT,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
    v_booking RECORD;
    v_valid_statuses TEXT[] := ARRAY['PENDING_PAYMENT', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
BEGIN
    v_role := public.get_auth_role();
    IF v_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'FORBIDDEN: Administrative clearance required to modify consultation bookings.';
    END IF;

    IF p_new_status NOT IN ('PENDING_PAYMENT', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') THEN
        RAISE EXCEPTION 'INVALID_STATUS: The requested booking status "%" is not permitted.', p_new_status;
    END IF;

    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking record does not exist.';
    END IF;

    -- Enforce legal state transitions
    IF v_booking.status = 'COMPLETED' AND p_new_status = 'PENDING' THEN
        RAISE EXCEPTION 'INVALID_TRANSITION: A completed consultation cannot be reverted to pending.';
    END IF;

    UPDATE public.bookings
    SET status = p_new_status,
        confirmed_at = CASE WHEN p_new_status = 'CONFIRMED' AND confirmed_at IS NULL THEN now() ELSE confirmed_at END,
        completed_at = CASE WHEN p_new_status = 'COMPLETED' THEN now() ELSE completed_at END,
        cancelled_at = CASE WHEN p_new_status = 'CANCELLED' THEN now() ELSE cancelled_at END,
        cancelled_by = CASE WHEN p_new_status = 'CANCELLED' THEN auth.uid() ELSE cancelled_by END,
        updated_at = now()
    WHERE id = p_booking_id;

    -- Log to activity audit trail
    PERFORM public.admin_log_activity(
        'UPDATE_BOOKING_STATUS',
        'bookings',
        p_booking_id,
        jsonb_build_object(
            'previous_status', v_booking.status,
            'new_status', p_new_status,
            'booking_reference', v_booking.booking_reference,
            'note', p_note
        )
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'booking_id', p_booking_id,
        'booking_reference', v_booking.booking_reference,
        'previous_status', v_booking.status,
        'status', p_new_status,
        'updated_at', now()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_booking_status(UUID, TEXT, TEXT) TO authenticated, service_role;

-- 4. Concurrency-Safe Booking Rescheduling RPC
-- Enforces: caller role, blocked date check, slot conflict check, and atomic update
CREATE OR REPLACE FUNCTION public.admin_reschedule_booking(
    p_booking_id UUID,
    p_new_date DATE,
    p_new_time TIME,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
    v_booking RECORD;
    v_new_end_time TIME;
    v_is_blocked BOOLEAN := FALSE;
    v_is_occupied BOOLEAN := FALSE;
    v_today_ist DATE;
    v_lock_key BIGINT;
BEGIN
    v_role := public.get_auth_role();
    IF v_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'FORBIDDEN: Administrative clearance required to reschedule bookings.';
    END IF;

    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Booking record does not exist.';
    END IF;

    IF v_booking.status IN ('CANCELLED', 'COMPLETED') THEN
        RAISE EXCEPTION 'INVALID_ACTION: Cannot reschedule a booking that is %.', v_booking.status;
    END IF;

    -- Validate target date
    v_today_ist := (now() AT TIME ZONE 'Asia/Kolkata')::DATE;
    IF p_new_date < v_today_ist THEN
        RAISE EXCEPTION 'VALIDATION_ERROR: Target date cannot be in the past.';
    END IF;

    -- Check if target date is blocked
    SELECT EXISTS (
        SELECT 1 FROM public.blocked_dates WHERE blocked_date = p_new_date
    ) INTO v_is_blocked;

    IF v_is_blocked THEN
        RAISE EXCEPTION 'DATE_BLOCKED: The chambers are blocked/unavailable on %.', p_new_date;
    END IF;

    v_new_end_time := p_new_time + (v_booking.duration_minutes || ' minutes')::interval;

    -- Concurrency Protection: Acquire advisory transaction lock for the day
    v_lock_key := ('x' || substr(md5(p_new_date::text), 1, 15))::bit(64)::bigint;
    PERFORM pg_advisory_xact_lock(v_lock_key);

    -- Check Slot Overlap against other active bookings
    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE date = p_new_date
          AND id != p_booking_id
          AND status IN ('CONFIRMED', 'PENDING', 'PENDING_PAYMENT')
          AND (
              (p_new_time >= start_time AND p_new_time < end_time) OR
              (v_new_end_time > start_time AND v_new_end_time <= end_time) OR
              (p_new_time <= start_time AND v_new_end_time >= end_time)
          )
    ) INTO v_is_occupied;

    IF v_is_occupied THEN
        RAISE EXCEPTION 'SLOT_OCCUPIED: The slot % on % conflicts with an existing booking.', p_new_time, p_new_date;
    END IF;

    -- Update booking
    UPDATE public.bookings
    SET date = p_new_date,
        start_time = p_new_time,
        end_time = v_new_end_time,
        status = 'CONFIRMED',
        updated_at = now()
    WHERE id = p_booking_id;

    -- Audit trail
    PERFORM public.admin_log_activity(
        'RESCHEDULE_BOOKING',
        'bookings',
        p_booking_id,
        jsonb_build_object(
            'booking_reference', v_booking.booking_reference,
            'previous_date', v_booking.date,
            'previous_time', v_booking.start_time,
            'new_date', p_new_date,
            'new_time', p_new_time,
            'note', p_note
        )
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'booking_id', p_booking_id,
        'booking_reference', v_booking.booking_reference,
        'new_date', p_new_date,
        'new_start_time', to_char(p_new_time, 'HH12:MI AM'),
        'updated_at', now()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_reschedule_booking(UUID, DATE, TIME, TEXT) TO authenticated, service_role;

-- 5. Privileged User Role Management RPC
-- Enforces:
-- - Only SUPER_ADMIN can alter roles
-- - Caller cannot alter their own role (prevents accidental lockout or self-demotion)
-- - Last SUPER_ADMIN cannot be demoted/removed
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
    p_target_user_id UUID,
    p_new_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_role TEXT;
    v_target RECORD;
    v_super_count INT;
BEGIN
    v_caller_role := public.get_auth_role();
    IF v_caller_role != 'SUPER_ADMIN' THEN
        RAISE EXCEPTION 'FORBIDDEN: Only a SUPER_ADMIN may modify administrative user roles.';
    END IF;

    IF auth.uid() = p_target_user_id THEN
        RAISE EXCEPTION 'PREVENT_SELF_MUTATION: You cannot modify your own administrative role.';
    END IF;

    IF p_new_role NOT IN ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER') THEN
        RAISE EXCEPTION 'INVALID_ROLE: Role "%" is not a valid administrative role.', p_new_role;
    END IF;

    SELECT * INTO v_target FROM public.profiles WHERE id = p_target_user_id LIMIT 1;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'NOT_FOUND: Target user profile not found.';
    END IF;

    -- Prevent demoting the last SUPER_ADMIN
    IF v_target.role = 'SUPER_ADMIN' AND p_new_role != 'SUPER_ADMIN' THEN
        SELECT count(*) INTO v_super_count FROM public.profiles WHERE role = 'SUPER_ADMIN';
        IF v_super_count <= 1 THEN
            RAISE EXCEPTION 'CANNOT_REMOVE_LAST_SUPER_ADMIN: The system must retain at least one SUPER_ADMIN account.';
        END IF;
    END IF;

    UPDATE public.profiles
    SET role = p_new_role,
        updated_at = now()
    WHERE id = p_target_user_id;

    -- Audit trail
    PERFORM public.admin_log_activity(
        'CHANGE_ADMIN_ROLE',
        'profiles',
        p_target_user_id,
        jsonb_build_object(
            'target_email', v_target.email,
            'previous_role', v_target.role,
            'new_role', p_new_role
        )
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'user_id', p_target_user_id,
        'email', v_target.email,
        'previous_role', v_target.role,
        'new_role', p_new_role,
        'updated_at', now()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, TEXT) TO authenticated, service_role;

-- 6. Error Resolution RPC
CREATE OR REPLACE FUNCTION public.admin_resolve_error(
    p_error_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_role TEXT;
BEGIN
    v_role := public.get_auth_role();
    IF v_role NOT IN ('SUPER_ADMIN', 'ADMIN') THEN
        RAISE EXCEPTION 'FORBIDDEN: Administrative clearance required to resolve system errors.';
    END IF;

    UPDATE public.error_logs
    SET resolved = TRUE,
        resolved_at = now(),
        resolved_by = auth.uid()
    WHERE id = p_error_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'error_id', p_error_id,
        'resolved', TRUE,
        'resolved_at', now()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_resolve_error(UUID) TO authenticated, service_role;

-- 7. Daily Business Report Aggregation Procedure
CREATE OR REPLACE FUNCTION public.generate_daily_business_report(
    p_report_date DATE DEFAULT ((now() AT TIME ZONE 'Asia/Kolkata')::DATE - 1)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_visitors INT := 0;
    v_page_views INT := 0;
    v_new_cust INT := 0;
    v_total_bookings INT := 0;
    v_confirmed_bookings INT := 0;
    v_completed_bookings INT := 0;
    v_payments_count INT := 0;
    v_revenue NUMERIC(12,2) := 0.00;
    v_new_blogs INT := 0;
    v_errors_count INT := 0;
    v_report_id UUID;
BEGIN
    -- Aggregations for the given IST day
    SELECT count(DISTINCT session_id), count(*) 
    INTO v_visitors, v_page_views
    FROM public.analytics_events
    WHERE (timestamp AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date;

    SELECT count(*) INTO v_new_cust
    FROM public.customers
    WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date;

    SELECT 
        count(*),
        count(*) FILTER (WHERE status = 'CONFIRMED'),
        count(*) FILTER (WHERE status = 'COMPLETED')
    INTO v_total_bookings, v_confirmed_bookings, v_completed_bookings
    FROM public.bookings
    WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date;

    -- Revenue from PAID payments only
    SELECT count(*), COALESCE(sum(amount), 0.00)
    INTO v_payments_count, v_revenue
    FROM public.payments
    WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date
      AND status = 'PAID';

    SELECT count(*) INTO v_new_blogs
    FROM public.blog_posts
    WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date;

    SELECT count(*) INTO v_errors_count
    FROM public.error_logs
    WHERE (created_at AT TIME ZONE 'Asia/Kolkata')::DATE = p_report_date;

    -- Upsert report
    INSERT INTO public.daily_reports (
        report_date,
        visitors,
        page_views,
        new_customers,
        consultations,
        confirmed_consultations,
        completed_consultations,
        payments_count,
        revenue,
        new_blog_posts,
        gallery_changes,
        system_errors,
        created_at,
        updated_at
    ) VALUES (
        p_report_date,
        v_visitors,
        v_page_views,
        v_new_cust,
        v_total_bookings,
        v_confirmed_bookings,
        v_completed_bookings,
        v_payments_count,
        v_revenue,
        v_new_blogs,
        0,
        v_errors_count,
        now(),
        now()
    )
    ON CONFLICT (report_date) DO UPDATE
    SET visitors = EXCLUDED.visitors,
        page_views = EXCLUDED.page_views,
        new_customers = EXCLUDED.new_customers,
        consultations = EXCLUDED.consultations,
        confirmed_consultations = EXCLUDED.confirmed_consultations,
        completed_consultations = EXCLUDED.completed_consultations,
        payments_count = EXCLUDED.payments_count,
        revenue = EXCLUDED.revenue,
        new_blog_posts = EXCLUDED.new_blog_posts,
        system_errors = EXCLUDED.system_errors,
        updated_at = now()
    RETURNING id INTO v_report_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'report_id', v_report_id,
        'report_date', p_report_date,
        'revenue', v_revenue,
        'consultations', v_total_bookings,
        'page_views', v_page_views
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_daily_business_report(DATE) TO authenticated, service_role;
