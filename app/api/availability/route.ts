import { NextResponse } from "next/server";
import { getBlockedRanges } from "@/lib/availability";

export const runtime = "nodejs";

// Dormant until an iCal feed is configured. While AIRBNB_ICAL_URL is unset this 404s
// so no mock data — and later, no real occupancy — is ever publicly exposed or CDN-cached.
export async function GET() {
  if (!process.env.AIRBNB_ICAL_URL) {
    return new Response(null, { status: 404 });
  }
  const payload = await getBlockedRanges();
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
