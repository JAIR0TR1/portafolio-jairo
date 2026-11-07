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
            "radial-gradient(circle at 85% 10%, rgba(242,184,160,.28), transparent 45%), radial-gradient(circle at 10% 95%, rgba(168,195,160,.2), transparent 45%), radial-gradient(circle at 55% 55%, rgba(157,180,200,.14), transparent 60%), #1E1C1A",
          color: "#F3EEE6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#B5AC9F" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(120deg, #F2B8A0, #E8D5B5)",
              color: "#1E1C1A",
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
          <div style={{ fontSize: 40, color: "#B5AC9F" }}>Jairo Andrés Vallejo Burbano</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Código limpio.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Interfaces claras.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, color: "#F2B8A0" }}>Ideas que se venden.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#B5AC9F" }}>
          <span>Pasto, Nariño</span>
          <span style={{ color: "#F2B8A0" }}>·</span>
          <span>Frontend · Diseño UI · Backend · IA</span>
        </div>
      </div>
    ),
    size,
  );
}
