"use client"; // Error boundaries must be Client Components.

import { useEffect } from "react";
import Link from "next/link";

// Deliberately does NOT depend on useLanguage()/context — an error boundary
// should stay simple and self-contained rather than lean on the same app
// state that may have been involved in whatever broke. Bilingual text is
// hardcoded directly instead.
export default function ErrorBoundary({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error("[ClaimReady] Unhandled error in a route segment:", error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto px-6 sm:px-8 py-20 text-center">
      <div className="cr-badge mx-auto" style={{ display: "inline-flex" }}>
        <span className="cr-tick" />
        <span>Something went wrong · कुछ गड़बड़ हुई</span>
      </div>
      <h1 className="mt-6 text-2xl sm:text-3xl font-semibold tracking-[-0.03em]">
        This page hit an unexpected error.
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        यह पृष्ठ लोड करते समय एक अनपेक्षित त्रुटि हुई। आपके दावे का कोई डेटा सहेजा नहीं गया है, क्योंकि
        सब कुछ केवल आपके ब्राउज़र सत्र में है — कोशिश फिर से करें।
      </p>
      <p className="mt-2 text-xs text-neutral-500">
        No claim data was lost — everything in this demo lives only in your browser session.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button onClick={() => retry()} className="cr-btn cr-btn--primary">
          <span>Try again · फिर कोशिश करें</span>
        </button>
        <Link href="/" className="cr-btn cr-btn--ghost">
          <span>← Back to home</span>
        </Link>
      </div>
    </div>
  );
}
