// =============================================================================
// RESEND TRANSACTIONAL EMAIL SERVICE MODULE
// Adv. Kriti Malviya Chambers (Kritimalviya.com)
// =============================================================================

export interface BookingEmailData {
  bookingReference: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceTitle: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  mode: string;
  amount: number;
  currency?: string;
  gatewayTransactionId?: string;
}

export function getResendApiKey(): string | null {
  return Deno.env.get("RESEND_API_KEY") || null;
}

export function getSenderEmail(): string {
  return Deno.env.get("RESEND_FROM_EMAIL") || "Adv. Kriti Malviya <onboarding@resend.dev>";
}

export function getAdminNotifyEmail(): string {
  return Deno.env.get("ADMIN_NOTIFY_EMAIL") || "contact@kritimalviya.com";
}

/**
 * Sends transactional email via Resend REST API
 */
export async function sendEmailWithResend(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = getResendApiKey();
  if (!apiKey) {
    console.warn("[Resend] RESEND_API_KEY is not configured in Edge Function secrets. Email skipped safely.");
    return { success: false, error: "RESEND_API_KEY_NOT_CONFIGURED" };
  }

  const fromEmail = getSenderEmail();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [params.to],
        subject: params.subject,
        html: params.html
      })
    });

    const data = await res.json();
    if (res.ok && data.id) {
      return { success: true, id: data.id };
    } else {
      console.error("[Resend] Delivery error:", data);
      return { success: false, error: data.message || "Email dispatch failed" };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Resend] Network exception:", msg);
    return { success: false, error: msg };
  }
}

/**
 * Luxury Editorial HTML Template: Client Booking Confirmation
 */
export function buildClientConfirmationEmailHtml(b: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Consultation Confirmed — Adv. Kriti Malviya</title>
</head>
<body style="margin:0; padding:0; background-color:#FAF8F5; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#18181B; line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5; padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF; border:1px solid #E4E0D7; border-radius:8px; overflow:hidden; max-width:600px;">
          
          <!-- Header -->
          <tr>
            <td style="background-color:#18181B; padding:32px; text-align:center;">
              <div style="font-size:11px; letter-spacing:3px; color:#BFA267; text-transform:uppercase; margin-bottom:8px;">LEGAL COUNSELLING & MEDIATION</div>
              <h1 style="margin:0; font-family:Georgia, serif; font-size:24px; color:#FFFFFF; font-weight:normal; letter-spacing:1px;">ADV. KRITI MALVIYA</h1>
            </td>
          </tr>

          <!-- Notice Banner -->
          <tr>
            <td style="background-color:#F5F2EB; padding:16px 32px; border-bottom:1px solid #E4E0D7; text-align:center;">
              <span style="font-size:12px; font-weight:600; color:#2E7D32; letter-spacing:1.5px; text-transform:uppercase;">✓ APPOINTMENT CONFIRMED & PAYMENT VERIFIED</span>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="font-size:16px; margin:0 0 16px; color:#18181B;">Dear <strong>${escapeHtml(b.clientName)}</strong>,</p>
              <p style="font-size:14px; margin:0 0 24px; color:#52525B;">
                Your consultation appointment with Adv. Kriti Malviya has been scheduled and confirmed following successful payment verification via PhonePe.
              </p>

              <!-- Order ID Highlight -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F5; border:1px dashed #BFA267; border-radius:6px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px; text-align:center;">
                    <div style="font-size:11px; letter-spacing:2px; color:#71717A; text-transform:uppercase;">OFFICIAL ORDER ID / REFERENCE</div>
                    <div style="font-size:20px; font-family:monospace; font-weight:bold; color:#18181B; margin-top:4px;">${escapeHtml(b.bookingReference)}</div>
                  </td>
                </tr>
              </table>

              <!-- Appointment Dossier Table -->
              <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse; margin-bottom:28px; font-size:13px;">
                <tr style="border-bottom:1px solid #F0ECE1;">
                  <td style="color:#71717A; width:40%;">Consultation Focus</td>
                  <td style="color:#18181B; font-weight:600;">${escapeHtml(b.serviceTitle)}</td>
                </tr>
                <tr style="border-bottom:1px solid #F0ECE1;">
                  <td style="color:#71717A;">Date & Time</td>
                  <td style="color:#18181B; font-weight:600;">${escapeHtml(b.date)} at ${escapeHtml(b.startTime)} (IST)</td>
                </tr>
                <tr style="border-bottom:1px solid #F0ECE1;">
                  <td style="color:#71717A;">Duration & Mode</td>
                  <td style="color:#18181B; font-weight:600;">${b.durationMinutes} Minutes · ${escapeHtml(b.mode)}</td>
                </tr>
                <tr style="border-bottom:1px solid #F0ECE1;">
                  <td style="color:#71717A;">Settlement Amount</td>
                  <td style="color:#18181B; font-weight:600;">₹${b.amount.toLocaleString("en-IN")} (PAID VIA PHONEPE)</td>
                </tr>
              </table>

              <!-- Next Steps Box -->
              <div style="background-color:#FAF8F5; border-left:3px solid #BFA267; padding:16px 20px; margin-bottom:28px; border-radius:0 4px 4px 0;">
                <h4 style="margin:0 0 8px; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#18181B;">Next Steps & Preparation</h4>
                <ul style="margin:0; padding-left:18px; font-size:13px; color:#52525B;">
                  <li style="margin-bottom:6px;">If you selected <strong>Online Consultation</strong>, a private, secure meeting invitation link will be transmitted to this email address prior to the consultation.</li>
                  <li style="margin-bottom:6px;">Please keep any relevant case papers, agreements, or chronologies accessible for review during your discussion.</li>
                  <li>All discussions and disclosures remain protected by strict professional confidentiality.</li>
                </ul>
              </div>

              <p style="font-size:13px; color:#71717A; margin:0;">
                For rescheduling inquiries or administrative queries, contact the chambers directly at <a href="mailto:contact@kritimalviya.com" style="color:#BFA267; text-decoration:none;">contact@kritimalviya.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#18181B; padding:24px; text-align:center; color:#A1A1AA; font-size:11px;">
              <div>&copy; 2026 Adv. Kriti Malviya Chambers. All rights reserved.</div>
              <div style="margin-top:4px; color:#71717A;">Confidential Legal & Personal Counselling Services</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Luxury Editorial HTML Template: Chamber Admin Notification
 */
export function buildAdminBookingEmailHtml(b: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:'Helvetica Neue', Arial, sans-serif; background:#FAF8F5; padding:24px; color:#18181B;">
  <div style="max-width:600px; margin:0 auto; background:#FFFFFF; border:1px solid #E4E0D7; border-radius:8px; padding:32px;">
    <div style="font-size:11px; letter-spacing:2px; color:#BFA267; text-transform:uppercase; margin-bottom:4px;">CHAMBER NOTIFICATION</div>
    <h2 style="margin:0 0 16px; font-family:Georgia, serif;">New Confirmed Consultation Appointment</h2>
    <p style="font-size:14px; color:#52525B;">A new consultation has been booked and paid through the website.</p>
    
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:13px; margin:20px 0;">
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Order ID</strong></td><td>${escapeHtml(b.bookingReference)}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Client Name</strong></td><td>${escapeHtml(b.clientName)}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Client Email</strong></td><td>${escapeHtml(b.clientEmail)}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Client Phone</strong></td><td>${escapeHtml(b.clientPhone || "--")}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Service</strong></td><td>${escapeHtml(b.serviceTitle)}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Scheduled Date</strong></td><td>${escapeHtml(b.date)} at ${escapeHtml(b.startTime)} (IST)</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Duration & Mode</strong></td><td>${b.durationMinutes} Min · ${escapeHtml(b.mode)}</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>Amount</strong></td><td>₹${b.amount.toLocaleString("en-IN")} (PAID VIA PHONEPE)</td></tr>
      <tr style="border-bottom:1px solid #E4E0D7;"><td><strong>PhonePe Tx ID</strong></td><td>${escapeHtml(b.gatewayTransactionId || "--")}</td></tr>
    </table>

    <div style="font-size:12px; color:#71717A; border-top:1px solid #E4E0D7; padding-top:16px;">
      This appointment is synchronized with the Master Control Center database.
    </div>
  </div>
</body>
</html>
  `;
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
