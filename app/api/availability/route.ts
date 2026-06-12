import { NextResponse } from "next/server";
import { getBlockedRanges } from "@/lib/availability";

export async function GET() {
  const payload = await getBlockedRanges();
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
