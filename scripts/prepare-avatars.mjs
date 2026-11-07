// Prepara las imágenes del avatar: assets/avatar/*.png (originales 765×1024, fondo transparente)
// → public/avatar/*.webp a resolución completa (sin recorte: pies y aire debajo), calidad 90,
// con el halo claro del recorte limpio:
//   1) erosión de 1 px del canal alfa (quita la franja exterior de antialias con fondo claro)
//   2) elimina píxeles casi blancos semitransparentes del borde
// Todas comparten lienzo → misma línea de piso y centro (no hay que alinearlas).
// Además genera robot-cabeza.webp para el mini robot de móvil.
// Uso: npm run avatars
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";

const SRC = "assets/avatar";
const OUT = "public/avatar";
const QUALITY = 90;

async function defringe(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const out = Buffer.from(data);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const a = data[i + 3];
      if (a === 0) continue;
      // 1) erosión 3×3 del alfa
      let min = a;
      for (let dy = -1; dy <= 1 && min > 0; dy++) {
        const yy = y + dy;
        if (yy < 0 || yy >= H) { min = 0; break; }
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          if (xx < 0 || xx >= W) { min = 0; break; }
          const n = data[(yy * W + xx) * 4 + 3];
          if (n < min) min = n;
        }
      }
      let alpha = min;
      // 2) píxeles casi blancos y semitransparentes (restos del fondo claro)
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (alpha < 235 && r > 200 && g > 200 && b > 200) alpha = 0;
      out[i + 3] = alpha;
    }
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } });
}

const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));
if (!files.length) throw new Error(`No hay PNG en ${SRC}`);
await mkdir(OUT, { recursive: true });

for (const f of files) {
  const img = await defringe(join(SRC, f));
  const out = join(OUT, f.replace(/\.png$/, ".webp"));
  const info = await img.webp({ quality: QUALITY, alphaQuality: 100, effort: 6, smartSubsample: true }).toFile(out);
  console.log(`${out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}

// Cabeza del robot para el mini robot (región fija en px del lienzo 765×1024)
const head = await (await defringe(join(SRC, "robot.png")))
  .extract({ left: 276, top: 45, width: 212, height: 266 })
  .resize({ width: 192 })
  .webp({ quality: QUALITY, alphaQuality: 100 })
  .toFile(join(OUT, "robot-cabeza.webp"));
console.log(`public/avatar/robot-cabeza.webp  ${head.width}×${head.height}`);
