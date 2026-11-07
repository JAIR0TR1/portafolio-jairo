import type { NextConfig } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Imágenes del avatar (public/avatar/*.webp, generadas con `npm run avatars`).
// Se detectan al compilar: si falta alguna, ese personaje usa el robot SVG de respaldo.
const avatarImages = [
  "jairo.webp",
  "robot.webp",
  "robot-saludo.webp",
  "robot-senala.webp",
  "robot-laptop.webp",
  "robot-pulgar.webp",
  "robot-cabeza.webp",
].filter((f) =>
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
    // 90 para el personaje (nítido en retina); 75 para el resto
    qualities: [75, 90],
  },
};

export default nextConfig;
