# Portafolio — Jairo Vallejo Burbano

@AGENTS.md

Entrega del curso "Diseño de Interfaces" (UCC). Límite: 8 nov 2026. Se califica sobre todo el DISEÑO, pero la guía del curso se cumple al 100 %.

## Guía del curso (innegociable)
- Next.js 16 (App Router) + TypeScript + Tailwind v4 (`@theme` en `app/globals.css`) + Vercel desde repo público.
- `app/page.tsx` EXACTO: `<Navbar />` + `<main>` con Hero, About, Projects, Testimonials, Experience, Contact, Skills + `<Footer />`.
- Ids fijos: `inicio, sobre-mi, proyectos, testimonios, experiencia, contacto, habilidades`, footer `footer`. `<html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">`.
- Componentes en `components/*.tsx` (nombres fijos); extras en `components/ui/` y `components/three/`. Datos tipados en `data/`.
- Requisitos: Navbar sticky + hamburguesa; Hero con nombre grande, rol, avatar, frase, `<a href="/cv.pdf" download>` + botón secundario; Sobre mí (párrafo 3–5 líneas, foto, tecnologías, datos rápidos); Proyectos con `.map()`, imagen, tags, GitHub y Demo con `target="_blank" rel="noopener noreferrer"`, grid 1→2–3 col; ≥3 testimonios; experiencia académica Y laboral con fechas, línea vertical, reciente→antiguo; contacto con correo, LinkedIn, GitHub, formulario (required, type=email, confirmación, "use client"); footer con nombre, © `new Date().getFullYear()`, redes, enlaces, volver arriba, "Hecho con Next.js + Tailwind"; Habilidades antes del footer.

## Dirección de arte "Jairo y su robot" (rama `minimal`; refs Metaverse + ChainGPT)
- Monocromo: bg `#0A0A0A`, card `#0F0F0F`, ink `#EDEDED`, muted `#8A8A8A`, faint `#2A2A2A` (solo decorativo), líneas `#1F1F1F`/`#2E2E2E`.
- `--accent` (registrada con `@property`) por modo: Jairo violeta (defecto), `html[data-mode=dev]` azul, `[data-mode=ai]` magenta. Solo en halo del personaje, punto del modo activo, puntos de anotaciones, ojos del robot, costura del híbrido, indicador del menú/pestañas y foco.
- Prohibido: mallas de color, vidrio, glows en tarjetas/botones, cursivas, píldoras grandes. Radios 6–8 px (chips 4 px).
- Tipos: Michroma (`font-hero`, `text-display`) para la palabra gigante y títulos de sección, en mayúsculas; Archivo para párrafos; JetBrains Mono en mayúsculas (tracking .12em) para etiquetas, cifras y anotaciones. La Ó es el glifo nativo de Michroma (NFC); `.hero-word` lleva `padding-top:.22em` para que la tilde quede dentro del degradado. Pestañas «0X / Sección» (`SectionTab`) y títulos que se decodifican (`DecodeText`).
- Imágenes: originales en `assets/avatar/*.png` (765×1024) → `npm run avatars` genera `public/avatar/*.webp` a resolución completa, calidad 90, con el halo del recorte limpio, + `robot-cabeza.webp`. next/image con `quality={90}` (permitido en `images.qualities`). Si falta una, respaldo `AvatarBot` (SVG).
- `data/avatar.ts`: poses del robot con la caja de los ojos en % (`Eyes`), desfase del híbrido (`HYBRID`), textos por modo, pose/expresión por sección (`sectionRobot`).
- Hero en tarjeta (radio 28, borde blanco .08) con luz ambiental detrás (`HeroAmbient`: personaje ampliado, blur 40, brillo .35, tinte --accent; ≥768). `HeroContent` se pinta DOS veces alineado al píxel: base oscura (isolate, ids reales) y revelada `.theme-light` (aria-hidden, inert, sin ids/h1) recortada por la «mancha líquida» (`HeroBlob`: simplex en 40 puntos + Catmull-Rom → `clip-path: path()` por rAF, lerp .12, estiramiento con cola, respiración; mouse y táctil; pausa con IO/pestaña oculta; apagada con reduced). Personaje B por modo: Jairo→robot alineado, Desarrollador→Jairo alineado (HYBRID inverso), IA→`CircuitFigure`. Ambas capas comparten `heroPointer`/`heroJump` (`lib/heroMotion.ts`) y el scramble determinista.
- Hero (`Hero.tsx`): palabra gigante ATRÁS ajustada EXACTO al ancho (`HeroTitle`: Michroma, scramble), personaje ADELANTE (`HeroAvatar` variant base/revealed: modos, orbe, anotaciones, saludo, híbrido con costura que sigue al mouse), dos columnas, barra de cifras, riel izquierdo (xl).
- Fondos: tarjeta con degradado #0A0A0A→#111, viñeta, retícula de puntos .04 y grano .05 (overlay); secciones alternan #0A0A0A/#0E0E0E con separador de 1 px.
- Robot acompañante (`RobotCompanion`): ≥1024 px columna fija a la derecha (`--cw`); las secciones dejan libre esa columna (regla en globals.css) y nunca la tapan; <1024 px mini robot de 56 px que se aparta si hay contenido debajo.
- Tarjetas `.glass`: esquinas [ ] y borde superior que se dibujan (scroll-driven); `DrawLine` bajo cada encabezado.
- Motion: `motion/react`, easing `[.22,1,.36,1]`. Imágenes con `preload` (en Next 16 `priority` está obsoleto).

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
