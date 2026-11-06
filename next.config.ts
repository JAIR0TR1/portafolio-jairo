import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Imágenes del avatar por modo (public/avatar/jairo.png, robot.png, hibrido.png).
// Se detectan al compilar: las que existan se usan; si falta alguna, ese modo usa el robot SVG.
const avatarImages = ["jairo.png", "robot.png", "hibrido.png"].filter((f) =>
  existsSync(join(process.cwd(), "public", "avatar", f)),
);

// Sitio 100 % estático. `cacheComponents` se deja apagado a propósito:
// la guía pide `new Date().getFullYear()` en el footer.
const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_AVATAR_IMAGES: JSON.stringify(avatarImages),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
