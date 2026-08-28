// Minimal fixed-window rate limiter for the two OpenAI-backed API routes.
//
// Honest limitation: this is an in-memory counter, so it resets whenever a
// serverless instance recycles and doesn't share state across concurrently
// warm instances on Vercel. It will not stop a determined, distributed
// attacker. What it DOES stop cheaply: a single script/browser tab hammering
// an endpoint in a loop, which is the realistic risk for a public hackathon
// demo (unwanted OpenAI spend), without adding an external dependency or
// a Redis/Upstash account for a prototype. Revisit with a durable store
// (Upstash Ratelimit, Vercel Edge Config) before this ever handles real
// traffic.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 20;

const hits = new Map<string, { count: number; windowStart: number }>();

// Bound memory: drop the oldest entries if the map grows unreasonably large
// (e.g. under a distributed-IP flood), rather than leaking forever.
const MAX_TRACKED_KEYS = 5000;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    if (hits.size >= MAX_TRACKED_KEYS) hits.clear();
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_REQUESTS_PER_WINDOW;
}

export function clientKeyFromRequest(req: Request): string {
  // Vercel/most proxies set x-forwarded-for; fall back to a constant bucket
  // (better than throwing) when it's absent, e.g. local dev.
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}
