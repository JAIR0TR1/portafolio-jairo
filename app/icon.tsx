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
          background: "linear-gradient(135deg, #FF5A1F 0%, #FFB020 100%)",
          color: "#0B0B0D",
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
