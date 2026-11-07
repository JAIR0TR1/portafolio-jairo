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
            "radial-gradient(circle at 80% 15%, rgba(229,56,59,.35), transparent 50%), radial-gradient(circle at 10% 95%, rgba(229,56,59,.12), transparent 45%), #1C0A10",
          color: "#F5F2EE",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "rgba(245,242,238,.68)" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#DA3538",
              color: "#FFFFFF",
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
          <div style={{ fontSize: 40, color: "rgba(245,242,238,.68)" }}>Jairo Andrés Vallejo Burbano</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Código limpio.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05 }}>Interfaces claras.</div>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, color: "#FF8587" }}>Ideas que se venden.</div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "rgba(245,242,238,.68)" }}>
          <span>Pasto, Nariño</span>
          <span style={{ color: "#FF8587" }}>·</span>
          <span>Frontend · Diseño UI · Backend · IA</span>
        </div>
      </div>
    ),
    size,
  );
}
