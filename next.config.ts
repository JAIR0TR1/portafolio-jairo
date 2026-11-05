import type { NextConfig } from "next";

// Sitio 100 % estático. `cacheComponents` se deja apagado a propósito:
// la guía pide `new Date().getFullYear()` en el footer.
const nextConfig: NextConfig = {
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
