// Capturas por sección en 390 / 768 / 1440 px.
// Uso: node scripts/screenshots.mjs [carpetaSalida] [url] [png|jpg] [reduced]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const out = process.argv[2] ?? "docs/capturas";
const url = process.argv[3] ?? "http://localhost:3000";
const ext = process.argv[4] ?? "png"; // "jpg" para docs/capturas (más liviano)
// "reduced": layout estático (sin sticky/pin), útil para capturas de sección completas
const reduced = process.argv[5] === "reduced";
const ids = ["inicio", "sobre-mi", "proyectos", "testimonios", "experiencia", "contacto", "habilidades", "footer"];
const widths = [390, 768, 1440];

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: reduced ? "reduce" : "no-preference" });
  page.on("console", (m) => m.type() === "error" && errors.push(`[${w}] ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${w}] ${e.message}`));
  await page.addInitScript(() => sessionStorage.setItem("jv-intro-visto", "1"));
  await page.goto(url, { waitUntil: "networkidle" });

  // Recorre la página para disparar los reveals
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) errors.push(`[${w}] scroll horizontal de ${overflow}px`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
  // Una captura de página completa y recortes por sección (fullPage + clip deja zonas sin pintar)
  const boxes = await page.evaluate((ids) => ids.map((id) => {
    const r = document.getElementById(id).getBoundingClientRect();
    return { id, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  }), ids);
  // fullPage reevalúa media queries y reinicia animaciones de entrada: se congelan solo para la captura
  await page.addStyleTag({ content: ".hero-in{animation:none!important} *{transition:none!important}" });
  await page.waitForTimeout(200);
  const full = await page.screenshot({ fullPage: true });
  const meta = await sharp(full).metadata();
  for (const b of boxes) {
    const height = Math.min(b.height, meta.height - b.top);
    const img = sharp(full).extract({ left: 0, top: b.top, width: meta.width, height });
    await (ext === "jpg" ? img.jpeg({ quality: 78 }) : img.png()).toFile(`${out}/${w}-${b.id}.${ext}`);
  }
  await page.close();
}

await browser.close();
console.log(errors.length ? `Problemas:\n${errors.join("\n")}` : "Sin errores de consola ni scroll horizontal.");
