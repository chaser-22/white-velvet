import { ImageResponse } from "next/og";

export const alt = "White Velvet — Professionell rengöring i Västerås";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #f3eee4 0%, #d1d4d1 58%, #727b7e 100%)",
          color: "#101417",
          padding: "72px 78px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 58,
              height: 58,
              border: "1px solid rgba(16,20,23,.35)",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            W
          </div>
          <div style={{ fontSize: 22, letterSpacing: 5 }}>WHITE VELVET</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 910 }}>
          <div style={{ fontFamily: "serif", fontSize: 92, lineHeight: 0.95, letterSpacing: -4 }}>
            Rent, på riktigt.
          </div>
          <div style={{ fontSize: 30, marginTop: 28, opacity: 0.72 }}>
            Professionell rengöring · Västerås
          </div>
        </div>
      </div>
    ),
    size,
  );
}
