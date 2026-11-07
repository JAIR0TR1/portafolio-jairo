// Genera public/intro/site.webp: captura de página completa a 1440 px del propio portafolio,
// usada como textura de la pantalla en la intro. Requiere `npm start` corriendo.
// Uso: node scripts/make-intro-texture.mjs [url]
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] ?? "http://localhost:3000";
const MAX_H = 5600; // la intro solo recorre la parte alta; menos píxeles = carga y decodificación rápidas
const WIDTH = 800;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await page.addInitScript(() => sessionStorage.setItem("jv-intro-visto", "1"));
await page.goto(url, { waitUntil: "networkidle" });

// Recorre la página para que todos los reveals se muestren
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 350) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(160);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1500);
await page.addStyleTag({ content: ".hero-in{animation:none!important} *{transition:none!important}" });
await page.waitForTimeout(200);
const png = await page.screenshot({ fullPage: true });
await browser.close();

const img = sharp(png).resize({ width: WIDTH });
const { data, info } = await img.toBuffer({ resolveWithObject: true });
await mkdir(new URL("../public/intro/", import.meta.url), { recursive: true });
await sharp(data)
  .extract({ left: 0, top: 0, width: info.width, height: Math.min(info.height, MAX_H) })
  .webp({ quality: 68, effort: 6 })
  .toFile(new URL("../public/intro/site.webp", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
console.log(`public/intro/site.webp → ${info.width}×${Math.min(info.height, MAX_H)}`);
