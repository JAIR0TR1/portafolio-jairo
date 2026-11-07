import { existsSync, readdirSync } from "node:fs";
import { join, parse } from "node:path";

const IMG = /\.(jpe?g|png|webp|avif)$/i;

/** «iphone-13-azul_entrega.jpg» → «Iphone 13 azul entrega» (alt descriptivo a partir del nombre). */
function altFrom(file: string, prefix: string) {
  const words = parse(file).name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  return words ? `${prefix}: ${words.charAt(0).toUpperCase()}${words.slice(1)}` : prefix;
}

/**
 * Imágenes de una carpeta de public/ (se lee al compilar, en el servidor).
 * Si la carpeta no existe o está vacía, devuelve [] y la sección se oculta.
 */
export function publicImages(dir: string, altPrefix: string, alts: Record<string, string> = {}) {
  const abs = join(process.cwd(), "public", dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => IMG.test(f))
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((f) => ({ src: `/${dir}/${f}`, alt: alts[f] ?? altFrom(f, altPrefix) }));
}

/**
 * Videos .mp4 de una carpeta de public/ con su póster «nombre-poster.jpg» (si existe).
 * Se lee al compilar; carpeta vacía o inexistente → [].
 */
export function publicVideos(dir: string) {
  const abs = join(process.cwd(), "public", dir);
  if (!existsSync(abs)) return [];
  const files = readdirSync(abs);
  return files
    .filter((f) => /\.mp4$/i.test(f))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((f) => {
      const name = parse(f).name;
      const poster = files.find((p) => p.toLowerCase() === `${name.toLowerCase()}-poster.jpg`);
      return { src: `/${dir}/${f}`, poster: poster ? `/${dir}/${poster}` : undefined, name };
    });
}
