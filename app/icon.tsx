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
          background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
          color: "#0B1030",
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
