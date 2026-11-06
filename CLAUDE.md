# Portafolio — Jairo Vallejo Burbano

@AGENTS.md

Entrega del curso "Diseño de Interfaces" (UCC). Límite: 8 nov 2026. Se califica sobre todo el DISEÑO, pero la guía del curso se cumple al 100 %.

## Guía del curso (innegociable)
- Next.js 16 (App Router) + TypeScript + Tailwind v4 (`@theme` en `app/globals.css`) + Vercel desde repo público.
- `app/page.tsx` EXACTO: `<Navbar />` + `<main>` con Hero, About, Projects, Testimonials, Experience, Contact, Skills + `<Footer />`.
- Ids fijos: `inicio, sobre-mi, proyectos, testimonios, experiencia, contacto, habilidades`, footer `footer`. `<html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">`.
- Componentes en `components/*.tsx` (nombres fijos); extras en `components/ui/` y `components/three/`. Datos tipados en `data/`.
- Requisitos: Navbar sticky + hamburguesa; Hero con nombre grande, rol, avatar, frase, `<a href="/cv.pdf" download>` + botón secundario; Sobre mí (párrafo 3–5 líneas, foto, tecnologías, datos rápidos); Proyectos con `.map()`, imagen, tags, GitHub y Demo con `target="_blank" rel="noopener noreferrer"`, grid 1→2–3 col; ≥3 testimonios; experiencia académica Y laboral con fechas, línea vertical, reciente→antiguo; contacto con correo, LinkedIn, GitHub, formulario (required, type=email, confirmación, "use client"); footer con nombre, © `new Date().getFullYear()`, redes, enlaces, volver arriba, "Hecho con Next.js + Tailwind"; Habilidades antes del footer.

## Dirección de arte "Obsidian Aurora"
- Negro obsidiana `#06060A`; el color es LUZ (glows, bordes, halos), no relleno. Vidrio sin backdrop-blur grande. Grano sutil.
- Tokens: ink `#F4F3FA`, muted `#9A98AD`, line `rgb(255 255 255/.1)`, blue `#2D7BFF`, violet `#7C5CFF`, magenta `#FF3D9A`. `--accent` (registrada con `@property`) cambia por modo: `html[data-mode=design|ai]`.
- Tipos: Geist (display, tracking −0.045em), Instrument Serif cursiva solo 1 palabra por título (`serif-accent`), Geist Mono para etiquetas (`text-eyebrow`).
- Utilidades propias: `container-x`, `section-y`, `glass`, `spotlight` (+ `SpotlightTracker` global), `glow-accent`, `.btn .btn-primary|secondary|ghost`, `.chip`, `.field`.
- Motion: `motion/react`, easing `[.22,1,.36,1]`, `<Reveal>`/`<RevealItem>` (y24, blur8, 0.6 s, stagger 0.08). Hover lift −4 px + glow.

## Reglas técnicas
- Orden/nombres de page.tsx intocables · ids fijos · datos en `data/` tipados.
- Todo efecto con fallback y reduced-motion: usa `useReducedEffects()` de `lib/effects.ts` (sistema + toggle del footer, guardado en localStorage). No `setState` síncrono en efectos (lint de React Compiler): usa `useSyncExternalStore`.
- 3D con `next/dynamic` `ssr:false`, sin assets 3D externos, dpr [1,1.5].
- `cacheComponents` APAGADO en next.config (por `new Date()` del footer).
- Claves compartidas server/client en `lib/keys.ts` (no importar constantes desde archivos "use client" en server components).
- Sin claves en el repo. `NEXT_PUBLIC_FORMSPREE_ID` opcional (sin él, el form usa mailto).
- Lo desconocido va como `TODO(Jairo)`; nunca inventar testimonios ni datos de contacto. `npm run check:content -- --write` regenera la tabla de PENDIENTES.md.

## Fases
F1 base ✔ → F2 avatar + modos ✔ → F3 storytelling ✔ → F4 intro 3D ✔ → F5 logos de fondo + auditoría UX + pulido ✔. (P2 paleta Ctrl+K: no hecha.)
Notas: tras cualquier `npm run build`, reinicia `npm start` antes de capturas (hashes de CSS). R3F: regla react-hooks/immutability apagada solo en components/three. Móvil: sin hero-in, backdrop-filter, grano ni TechBackdrop (rendimiento).
Cada fase: `npm run build`, `npm run lint`, `npx tsc --noEmit`, capturas `npm run shots -- <dir>` (con `npm start` corriendo) en 390/768/1440, 2 rondas, commit convencional en español.
