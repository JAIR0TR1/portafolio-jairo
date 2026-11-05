import { ImageResponse } from "next/og";

export const alt = "Jairo Vallejo Burbano — Construyo interfaces que se sienten vivas";
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
            "radial-gradient(circle at 85% 10%, rgba(45,123,255,.55), transparent 45%), radial-gradient(circle at 10% 90%, rgba(255,61,154,.35), transparent 45%), radial-gradient(circle at 50% 50%, rgba(124,92,255,.25), transparent 60%), #06060A",
          color: "#F4F3FA",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#9A98AD" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#F4F3FA",
              color: "#06060A",
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
          <div style={{ fontSize: 40, color: "#9A98AD" }}>Jairo Vallejo Burbano</div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Construyo interfaces</div>
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05, color: "rgba(244,243,250,.55)" }}>
            que se sienten vivas.
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#9A98AD" }}>
          <span>Pasto, Colombia</span>
          <span style={{ color: "#2D7BFF" }}>·</span>
          <span>Desarrollo · Diseño UI · IA</span>
        </div>
      </div>
    ),
    size,
  );
}
