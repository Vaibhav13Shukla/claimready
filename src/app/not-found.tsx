import Link from "next/link";

// Static (no "use client"/context dependency) — not-found can be hit for any
// bad URL before the app has any real state, so keep it simple and fast.
export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-6 sm:px-8 py-20 text-center">
      <div className="cr-badge mx-auto" style={{ display: "inline-flex" }}>
        <span className="cr-tick" />
        <span>404 · पृष्ठ नहीं मिला</span>
      </div>
      <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">
        We couldn&rsquo;t find that page.
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        यह पृष्ठ मौजूद नहीं है या स्थानांतरित हो गया है। अपने दावे की जांच वहीं से शुरू करें।
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/intake?tab=preflight" className="cr-btn cr-btn--primary">
          <span>Run a pre-flight check →</span>
        </Link>
        <Link href="/" className="cr-btn cr-btn--ghost">
          <span>← Back to home</span>
        </Link>
      </div>
    </div>
  );
}
