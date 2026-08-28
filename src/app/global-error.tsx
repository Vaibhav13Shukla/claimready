"use client"; // Error boundaries must be Client Components.

// global-error replaces the ENTIRE root layout when it fires (root layout
// itself crashed), so it can't rely on globals.css or any component from the
// normal tree being available — it defines its own <html>/<body> and uses
// only inline styles, deliberately dependency-free.
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
          background: "#ffffff",
          color: "#1b1d20",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
            PF X-Ray hit an unexpected error.
          </h1>
          <p style={{ fontSize: 14, color: "#525252", marginBottom: 24 }}>
            आपके दावे का कोई डेटा नहीं खोया। यह डेमो केवल आपके ब्राउज़र सत्र में चलता है। फिर से कोशिश
            करें, या पेज रीलोड करें।
          </p>
          <button
            onClick={() => retry()}
            style={{
              background: "#5196fe",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              fontSize: 15,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
