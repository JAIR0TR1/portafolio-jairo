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
          background: "linear-gradient(135deg, #F2B8A0 0%, #E8D5B5 100%)",
          color: "#1E1C1A",
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
