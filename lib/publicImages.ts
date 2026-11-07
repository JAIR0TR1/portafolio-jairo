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
export function publicImages(dir: string, altPrefix: string) {
  const abs = join(process.cwd(), "public", dir);
  if (!existsSync(abs)) return [];
  return readdirSync(abs)
    .filter((f) => IMG.test(f))
    .sort((a, b) => a.localeCompare(b, "es"))
    .map((f) => ({ src: `/${dir}/${f}`, alt: altFrom(f, altPrefix) }));
}
