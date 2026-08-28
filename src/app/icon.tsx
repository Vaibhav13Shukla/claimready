import { ImageResponse } from "next/og";

// The bundled favicon.ico was a generic unbranded placeholder (a black
// circle with a white triangle) — not ClaimReady's actual mark. This
// generates the real one: the same blue "CR" square used in Navbar.tsx,
// so the browser tab/bookmark icon actually matches the app.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#006cd2",
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        CR
      </div>
    ),
    { ...size }
  );
}
