import type { NextConfig } from "next";

// Fail the production build loudly rather than silently baking localhost (or an empty
// fallback) into the canonical URLs, sitemap, OG tags and JSON-LD that are prerendered.
const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL;
if (
  process.env.NODE_ENV === "production" &&
  (!siteUrlEnv || siteUrlEnv.includes("localhost"))
) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be set to the production domain (e.g. https://vilairena.com)",
  );
}

const isProd = process.env.NODE_ENV === "production";

// CSP is production-only: dev (HMR) needs eval + websocket connections that a strict
// policy would block. 'unsafe-inline' covers the server-generated JSON-LD <script> and
// Next's bootstrap; next/font is self-hosted; frame-src allows the consent-gated Maps iframe.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src https://www.google.com",
  "connect-src 'self' https://formsubmit.co",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(isProd
            ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
