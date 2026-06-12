/**
 * Rate limiting for the public inquiry endpoint.
 * With UPSTASH_REDIS_REST_URL/TOKEN set: distributed sliding window (5 / 10 min / IP).
 * Without: in-memory per-instance fallback. On serverless this is best-effort only
 * (each instance has its own map); the honeypot + validation remain the primary
 * abuse defense until Upstash env vars are configured.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED_IPS = 1000;

let upstash: Ratelimit | null | undefined;

function getUpstash(): Ratelimit | null {
  if (upstash !== undefined) return upstash;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  upstash =
    url && token
      ? new Ratelimit({
          redis: new Redis({ url, token }),
          limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
          prefix: "vila-irena:inquiry",
        })
      : null;
  return upstash;
}

const hits = new Map<string, number[]>();

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const limiter = getUpstash();
  if (limiter) {
    try {
      const { success } = await limiter.limit(ip);
      return { allowed: success };
    } catch (error) {
      console.error("RATE_LIMIT_UPSTASH_ERROR", error);
      // fall through to in-memory
    }
  }

  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    hits.set(ip, recent);
    return { allowed: false };
  }
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > MAX_TRACKED_IPS) {
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  return { allowed: true };
}
