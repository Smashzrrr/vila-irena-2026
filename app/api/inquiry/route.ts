import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { inquirySchema, type InquiryPayload } from "@/lib/inquiry-schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { nightsBetween } from "@/lib/dates";
import { MIN_NIGHTS } from "@/lib/config";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Strip CR/LF so a crafted name cannot inject additional email headers.
function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]/g, " ").trim();
}

function buildEmail(data: InquiryPayload) {
  const nights = nightsBetween(data.checkIn, data.checkOut);
  const subject = `Booking inquiry ${data.checkIn} to ${data.checkOut} (${nights} nights) - ${sanitizeHeader(data.name)}`;
  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "-"],
    ["Guests", String(data.guests)],
    ["Check-in", data.checkIn],
    ["Check-out", data.checkOut],
    ["Nights", String(nights)],
    ["Language", data.locale],
    ["Message", data.message || "-"],
  ];
  const html = `<h2 style="font-family:Georgia,serif;">New booking inquiry, Vila Irena</h2>
<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#666;vertical-align:top;">${k}</td><td style="padding:6px 0;"><strong>${escapeHtml(v)}</strong></td></tr>`,
  )
  .join("\n")}
</table>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;">Reply directly to this email to answer the guest.</p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  return { subject, html, text };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  // Honeypot: bots that fill the hidden field get a fake success and nothing happens.
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    (body as Record<string, unknown>).website
  ) {
    return NextResponse.json({ ok: true, tier: "none" });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success || parsed.data.checkOut <= parsed.data.checkIn) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const data = parsed.data;
  if (nightsBetween(data.checkIn, data.checkOut) < MIN_NIGHTS) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }
  const { subject, html, text } = buildEmail(data);

  // Tier 1: Resend email to the owner.
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.INQUIRY_TO_EMAIL;
    const from = process.env.INQUIRY_FROM_EMAIL;
    if (!apiKey || !to || !from) throw new Error("Resend env vars not configured");
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true, tier: "resend" });
  } catch (error) {
    console.error("INQUIRY_TIER1_RESEND_FAILED", error);
  }

  // Tier 2: FormSubmit (free, no API key — env-driven destination email).
  try {
    const fsEmail = process.env.FORMSUBMIT_EMAIL;
    if (!fsEmail) throw new Error("FormSubmit env var not configured");
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(fsEmail)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: subject,
        _captcha: "false",
        _template: "table",
        name: data.name,
        email: data.email,
        message: text,
      }),
    });
    if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`);
    return NextResponse.json({ ok: true, tier: "formsubmit" });
  } catch (error) {
    console.error("INQUIRY_TIER2_FORMSUBMIT_FAILED", error);
  }

  // Tier 3: Web3Forms fallback delivery.
  try {
    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) throw new Error("Web3Forms env var not configured");
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject,
        from_name: data.name,
        email: data.email,
        message: text,
      }),
    });
    if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
    return NextResponse.json({ ok: true, tier: "web3forms" });
  } catch (error) {
    console.error("INQUIRY_TIER2_WEB3FORMS_FAILED", error);
  }

  // Tier 4: record only that a lead was lost — never log PII (name/email/phone/message)
  // to host logs (GDPR storage-limitation; matches the "no database" privacy claim).
  console.error(
    "INQUIRY_FALLBACK",
    JSON.stringify({
      receivedAt: new Date().toISOString(),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests,
      locale: data.locale,
    }),
  );
  return NextResponse.json({ ok: true, tier: "logged" });
}
