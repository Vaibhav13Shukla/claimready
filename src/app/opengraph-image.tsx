import { ImageResponse } from "next/og";

export const alt = "ClaimReady — Check your EPFO PF claim before it gets rejected";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 90px",
        background: "linear-gradient(135deg, #eaf3fb 0%, #ffffff 55%, #eef4fa 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 56,
            height: 56,
            background: "#1f6fe5",
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          CR
        </div>
        <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#1b1d20" }}>
          ClaimReady
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 15,
            fontWeight: 600,
            color: "#14449e",
            background: "rgba(31,111,229,0.1)",
            border: "1px solid rgba(31,111,229,0.25)",
            padding: "6px 12px",
            marginLeft: 6,
          }}
        >
          EPFO
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 62,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "#1b1d20",
          maxWidth: 980,
        }}
      >
        1 in 5 PF claims gets rejected.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 62,
          fontWeight: 600,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "#1f6fe5",
          maxWidth: 980,
          marginBottom: 32,
        }}
      >
        Catch yours before you file.
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#525252", maxWidth: 820 }}>
        A pre-flight check + rejection decoder for EPFO claims — independent hackathon prototype,
        not affiliated with EPFO.
      </div>
    </div>,
    { ...size },
  );
}
