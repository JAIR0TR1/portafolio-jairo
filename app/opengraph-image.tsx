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
            "radial-gradient(circle at 85% 10%, rgba(139,92,246,.6), transparent 45%), radial-gradient(circle at 10% 95%, rgba(236,72,153,.4), transparent 45%), radial-gradient(circle at 55% 55%, rgba(59,130,246,.22), transparent 60%), #0B1030",
          color: "#F3F1FF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#A8A6D9" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(120deg, #B79CFA, #F28DC0)",
              color: "#0B1030",
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
          <div style={{ fontSize: 40, color: "#A8A6D9" }}>Jairo Andrés Vallejo Burbano</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Código limpio.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Interfaces claras.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, color: "#F28DC0" }}>Ideas que se venden.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#A8A6D9" }}>
          <span>Pasto, Nariño</span>
          <span style={{ color: "#8B5CF6" }}>·</span>
          <span>Frontend · Diseño UI · Backend · IA</span>
        </div>
      </div>
    ),
    size,
  );
}
