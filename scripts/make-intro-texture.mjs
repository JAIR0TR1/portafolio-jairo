// Genera las texturas de la pantalla de la tablet en la intro (requiere `npm start` corriendo):
//  - public/intro/site.webp: el Hero actual a 2880×1800 (1440×900 con deviceScaleFactor 2, modo Jairo),
//    calidad 90. Es lo que se ve al final del zoom, cuando la pantalla llena el viewport: debe ser nítido.
//  - public/intro/site-scroll.webp: la página completa para el scroll dentro de la pantalla.
//  - public/intro/site-mobile.webp: el Hero móvil (390×844 a 3×) para la tablet vertical en celular.
// Uso: node scripts/make-intro-texture.mjs [url]
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const url = process.argv[2] ?? "http://localhost:3000";
const out = (name) => new URL(`../public/intro/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SCROLL_W = 1200;
const SCROLL_MAX_H = 4400; // solo la parte que recorre la intro: textura liviana, carga rápida

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage();
// sin intro y en modo Jairo
await page.addInitScript(() => {
  sessionStorage.setItem("jv-intro-visto", "1");
  try {
    localStorage.removeItem("jv-modo");
  } catch {}
});
await page.goto(url, { waitUntil: "networkidle" });
await page.addStyleTag({ content: ".hero-in{animation:none!important} *{transition:none!important}" });
// espera a que todas las imágenes visibles (versión 2×) estén descargadas y decodificadas
await page.waitForFunction(() => [...document.querySelectorAll("[data-hero-layer]:not([data-hero-revealed]) img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
await page.evaluate(() => Promise.all([...document.querySelectorAll("[data-hero-layer]:not([data-hero-revealed]) img")].map((i) => i.decode().catch(() => {}))));
await page.waitForTimeout(1500);
await mkdir(new URL("../public/intro/", import.meta.url), { recursive: true });

// 1) Hero (primera pantalla) a 2880×1800
const hero = await page.screenshot({ type: "png" });
await sharp(hero).webp({ quality: 90, effort: 6 }).toFile(out("site.webp"));
console.log("public/intro/site.webp → 2880×1800");

// 2) Página completa para el scroll dentro de la tablet
const h = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < h; y += 350) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
const full = await page.screenshot({ fullPage: true, type: "png" });

// 3) Hero móvil (390×844 a 3×) para la intro en celular
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const m = await mctx.newPage();
await m.addInitScript(() => {
  sessionStorage.setItem("jv-intro-visto", "1");
  try {
    localStorage.removeItem("jv-modo");
  } catch {}
});
await m.goto(url, { waitUntil: "networkidle" });
await m.addStyleTag({ content: ".hero-in{animation:none!important} *{transition:none!important}" });
await m.waitForFunction(() => [...document.querySelectorAll("[data-hero-layer]:not([data-hero-revealed]) img")].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 30000 });
await m.evaluate(() => Promise.all([...document.querySelectorAll("[data-hero-layer]:not([data-hero-revealed]) img")].map((i) => i.decode().catch(() => {}))));
await m.waitForTimeout(1500);
await sharp(await m.screenshot({ type: "png" })).webp({ quality: 90, effort: 6 }).toFile(out("site-mobile.webp"));
console.log("public/intro/site-mobile.webp → 1170×2532");
await browser.close();
const resized = await sharp(full).resize({ width: SCROLL_W }).toBuffer({ resolveWithObject: true });
await sharp(resized.data)
  .extract({ left: 0, top: 0, width: resized.info.width, height: Math.min(resized.info.height, SCROLL_MAX_H) })
  .webp({ quality: 82, effort: 6 })
  .toFile(out("site-scroll.webp"));
console.log(`public/intro/site-scroll.webp → ${resized.info.width}×${Math.min(resized.info.height, SCROLL_MAX_H)}`);
