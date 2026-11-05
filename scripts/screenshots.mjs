// Capturas por sección en 390 / 768 / 1440 px.
// Uso: node scripts/screenshots.mjs [carpetaSalida] [url]
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = process.argv[2] ?? "docs/capturas";
const url = process.argv[3] ?? "http://localhost:3000";
const ids = ["inicio", "sobre-mi", "proyectos", "testimonios", "experiencia", "contacto", "habilidades", "footer"];
const widths = [390, 768, 1440];

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
  page.on("console", (m) => m.type() === "error" && errors.push(`[${w}] ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`[${w}] ${e.message}`));
  await page.addInitScript(() => sessionStorage.setItem("jv-intro-visto", "1"));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "no-preference" });

  // Recorre la página para disparar los reveals
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(90);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) errors.push(`[${w}] scroll horizontal de ${overflow}px`);

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
  for (const id of ids) {
    const box = await page.evaluate((id) => {
      const r = document.getElementById(id).getBoundingClientRect();
      return { x: 0, y: r.top + window.scrollY, width: window.innerWidth, height: r.height };
    }, id);
    await page.screenshot({ path: `${out}/${w}-${id}.png`, fullPage: true, clip: box });
  }
  await page.close();
}

await browser.close();
console.log(errors.length ? `Problemas:\n${errors.join("\n")}` : "Sin errores de consola ni scroll horizontal.");
