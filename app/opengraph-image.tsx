import { ImageResponse } from "next/og";

export const alt = "Jairo Andrés Vallejo Burbano — Código limpio. Interfaces claras. Ideas que se venden.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 78% 18%, rgba(255,90,31,.42), transparent 48%), radial-gradient(circle at 92% 40%, rgba(255,176,32,.22), transparent 40%), radial-gradient(circle at 8% 95%, rgba(47,107,255,.22), transparent 45%), #0B0B0D",
          color: "#F5F3F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#A3A1A8" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(120deg, #FF5A1F, #FFB020)",
              color: "#0B0B0D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            JV
          </div>
          Portafolio · Ingeniería de Software
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, color: "#A3A1A8" }}>Jairo Andrés Vallejo Burbano</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Código limpio.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Interfaces claras.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, color: "#FFB020" }}>Ideas que se venden.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#A3A1A8" }}>
          <span>Pasto, Nariño</span>
          <span style={{ color: "#FFB020" }}>·</span>
          <span>Frontend · Diseño UI · Backend · IA</span>
        </div>
      </div>
    ),
    size,
  );
}
