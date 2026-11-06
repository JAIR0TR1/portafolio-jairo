// Prepara las imágenes del avatar: assets/avatar/*.png (originales, fondo transparente)
// → public/avatar/*.webp con el MISMO recorte para todas, así comparten línea de piso,
// alto visual y centro horizontal (los cambios de pose no saltan).
// Uso: npm run avatars
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join } from "node:path";

const SRC = "assets/avatar";
const OUT = "public/avatar";
const PAD = 0.02; // margen alrededor de la caja común

const files = (await readdir(SRC)).filter((f) => f.endsWith(".png"));
if (!files.length) throw new Error(`No hay PNG en ${SRC}`);

// 1) Caja común (unión de las cajas por transparencia)
let W = 0;
let H = 0;
let x0 = Infinity;
let y0 = Infinity;
let x1 = -1;
let y1 = -1;
for (const f of files) {
  const { data, info } = await sharp(join(SRC, f)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  W = info.width;
  H = info.height;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (data[(y * W + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
}

// 2) Recorte simétrico respecto al centro del lienzo (los personajes están centrados en x = 50 %)
const cx = W / 2;
const half = Math.ceil(Math.max(cx - x0, x1 - cx) + W * PAD);
const left = Math.max(0, Math.floor(cx - half));
const width = Math.min(W - left, half * 2);
const top = Math.max(0, Math.floor(y0 - H * PAD));
const height = Math.min(H - top, Math.ceil(y1 + H * PAD) - top);

await mkdir(OUT, { recursive: true });
for (const f of files) {
  const out = join(OUT, f.replace(/\.png$/, ".webp"));
  const info = await sharp(join(SRC, f))
    .extract({ left, top, width, height })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(out);
  console.log(`${out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
}
console.log(`Recorte común: x ${left}–${left + width}, y ${top}–${top + height} (aspecto ${(width / height).toFixed(4)})`);

// Cabeza del robot para el mini robot de móvil (x 30–70 %, y 1–29 % de robot.webp)
const base = join(OUT, "robot.webp");
const meta = await sharp(base).metadata();
const head = await sharp(base)
  .extract({
    left: Math.round(meta.width * 0.3),
    top: Math.round(meta.height * 0.01),
    width: Math.round(meta.width * 0.4),
    height: Math.round(meta.height * 0.28),
  })
  .resize({ width: 160 })
  .webp({ quality: 86, alphaQuality: 90 })
  .toFile(join(OUT, "robot-cabeza.webp"));
console.log(`public/avatar/robot-cabeza.webp  ${head.width}×${head.height}`);
