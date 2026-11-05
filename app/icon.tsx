import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          borderRadius: 16,
          background: "radial-gradient(circle at 50% 120%, #2D7BFF 0%, #7C5CFF 35%, #06060A 75%)",
          color: "#F4F3FA",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        JV
      </div>
    ),
    size,
  );
}
