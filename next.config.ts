import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    // 'unsafe-inline' on script-src matches Next.js's own documented
    // "Without Nonces" CSP (node_modules/next/dist/docs/.../content-security-policy.md)
    // — Next injects inline bootstrap/hydration scripts on every page, and
    // blocking them breaks the app outright (verified: an e2e test caught
    // this in dev). The stricter alternative is a Proxy-issued per-request
    // nonce, but that requires forcing every page into dynamic rendering
    // (no static generation, no ISR) — too big an architecture change to
    // make unilaterally on a hackathon prototype. This CSP still blocks
    // framing, third-party script/style hosts, and non-'self' connections.
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // 'unsafe-eval' is only needed in dev — React uses eval() there to
      // reconstruct server-side error stacks in the browser console; neither
      // React nor Next.js use eval() in a production build (Next's own CSP
      // docs call this out explicitly).
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self'",
      "img-src 'self' data:",
      "media-src 'self' https://d8j0ntlcm91z4.cloudfront.net",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
