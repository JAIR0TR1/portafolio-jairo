// Genera las texturas de la pantalla de la tablet en la intro (requiere `npm start` corriendo),
// una carpeta por idioma y tema (misma regla que introDir() en lib/keys.ts):
//   public/intro/            español · oscuro
//   public/intro/en/         inglés · oscuro
//   public/intro/light/      español · claro
//   public/intro/en-light/   inglés · claro
// En cada una:
//  - site.webp: el Hero actual a 2880×1800 (1440×900 con deviceScaleFactor 2, modo Jairo),
//    calidad 92. Es lo que se ve al final del zoom, cuando la pantalla llena el viewport: debe ser nítido.
//  - site-scroll.webp: la página completa para el scroll dentro de la pantalla.
//  - site-mobile.webp: el Hero móvil (390×844 a 3×) para la tablet vertical en celular.
// Uso: node scripts/make-intro-texture.mjs [url]   (después: reiniciar `npm start`, hay archivos nuevos en public/)
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const SCROLL_W = 1800; // nítida a mitad de la animación (la pantalla llega a ~900 px css × dpr 2)
const SCROLL_MAX_H = 6600; // misma porción de página que antes (≤ 8192, límite de textura de las GPU)

const VARIANTS = [
  { lang: "es", theme: "dark", dir: "" },
  { lang: "en", theme: "dark", dir: "en/" },
  { lang: "es", theme: "light", dir: "light/" },
  { lang: "en", theme: "light", dir: "en-light/" },
];

const out = (dir, name) => new URL(`../public/intro/${dir}${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

/** Página lista para capturar: sin intro, modo Jairo, tema e idioma fijados, imágenes decodificadas. */
async function open(browser, v, options) {
  const ctx = await browser.newContext({ ...options, reducedMotion: "reduce" });
  await ctx.addCookies([{ name: "jv-lang", value: v.lang, url: base }]);
  const page = await ctx.newPage();
  await page.addInitScript((theme) => {
    sessionStorage.setItem("jv-intro-visto", "1");
    try {
      localStorage.removeItem("jv-modo");
      localStorage.setItem("jv-tema", theme);
    } catch {}
  }, v.theme);
  await page.goto(`${base}${v.lang === "en" ? "/en" : "/"}`, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: ".hero-in{animation:none!important} *{transition:none!important}" });
  // espera a que todas las imágenes visibles (versión 2×) estén descargadas y decodificadas
  const visible = () => [...document.querySelectorAll("[data-hero-layer] img")].filter((i) => !i.closest("[data-hero-revealed]"));
  await page.waitForFunction(`(${visible})().every((i) => i.complete && i.naturalWidth > 0)`, null, { timeout: 30000 });
  await page.evaluate(`Promise.all((${visible})().map((i) => i.decode().catch(() => {})))`);
  await page.waitForTimeout(1500);
  return page;
}

const browser = await chromium.launch();
for (const v of VARIANTS) {
  await mkdir(new URL(`../public/intro/${v.dir}`, import.meta.url), { recursive: true });

  // 1) Hero (primera pantalla) a 2880×1800
  const page = await open(browser, v, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await sharp(await page.screenshot({ type: "png" })).webp({ quality: 92, effort: 6 }).toFile(out(v.dir, "site.webp"));

  // 2) Página completa para el scroll dentro de la tablet
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 350) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const full = await page.screenshot({ fullPage: true, type: "png" });
  const resized = await sharp(full).resize({ width: SCROLL_W }).toBuffer({ resolveWithObject: true });
  await sharp(resized.data)
    .extract({ left: 0, top: 0, width: resized.info.width, height: Math.min(resized.info.height, SCROLL_MAX_H) })
    .webp({ quality: 82, effort: 6 })
    .toFile(out(v.dir, "site-scroll.webp"));

  // 3) Hero móvil (390×844 a 3×) para la intro en celular
  const m = await open(browser, v, { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await sharp(await m.screenshot({ type: "png" })).webp({ quality: 92, effort: 6 }).toFile(out(v.dir, "site-mobile.webp"));

  console.log(`public/intro/${v.dir || ""}{site, site-scroll, site-mobile}.webp · ${v.lang} · ${v.theme}`);
}
await browser.close();
