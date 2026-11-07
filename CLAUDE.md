# Portafolio — Jairo Andrés Vallejo Burbano

@AGENTS.md

Entrega del curso "Diseño de Interfaces" (UCC). Límite: 8 nov 2026. Se califica sobre todo el DISEÑO, pero la guía del curso se cumple al 100 %.

## Guía del curso (innegociable)
- Next.js 16 (App Router) + TypeScript + Tailwind v4 (`@theme` en `app/globals.css`) + Vercel desde repo público.
- `app/page.tsx` en este orden (decisión de Jairo, nov 2026): `<Navbar />` + `<main>` con Hero, About, Projects, Experience, Emprendimiento, Testimonials, TrabajaConmigo, Contact, Skills + `<Footer />`.
- Ids fijos: `inicio, sobre-mi, proyectos, experiencia, emprendimiento, testimonios, trabaja-conmigo, contacto, habilidades`, footer `footer`. `<html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">`. El orden y los números «0X» salen de `sections` en `data/profile.ts` (`sectionIndex`).
- Componentes en `components/*.tsx` (uno por sección); extras en `components/ui/` y `components/three/`. Datos tipados en `data/` (profile, projects, experience, testimonials, skills, business, services, avatar).
- Requisitos: Navbar sticky + hamburguesa; Hero con nombre grande, rol, avatar, frase, `<a href="/cv.pdf" download>` + botones secundarios; Sobre mí (párrafo, foto real tal cual 3/4, datos clave, intereses, hoja de vida con modal); Proyectos con `.map()`, imagen, tags, GitHub y Demo con `target="_blank" rel="noopener noreferrer"` (botón oculto si falta el enlace); ≥3 testimonios (tipo cliente/académico); experiencia académica Y laboral con fechas, línea vertical; Emprendimiento @jairovende_ (sección extra: flyers con lightbox y videos de clientes 9/16 de `public/videos/clientes/`); Trabaja conmigo (formulario validado → WhatsApp o correo, "use client"); contacto con correo (copiar), WhatsApp, GitHub, Instagram — SIN LinkedIn en todo el sitio; formulario de Contacto solo con `NEXT_PUBLIC_FORMSPREE_ID`; footer con nombre, © `new Date().getFullYear()`, redes, enlaces, volver arriba, "Hecho con Next.js + Tailwind"; Habilidades antes del footer, sin niveles ni porcentajes, con el anillo 3D de logos (`LogoRing`) como protagonista.

## Dirección de arte «Stone & Pastel» + «Jairo y su robot» (rama `minimal`)
- Tokens: `--bg #1E1C1A`, `--bg-2 #252320`, `--surface #2D2A26`, `--surface-2 #36322D`, `--border rgba(232,220,200,.12)`, `--text #F3EEE6`, `--muted #B5AC9F` (Tailwind: `bg`, `bg-2`, `card`, `card-2`, `line`, `ink`, `muted`). Sin violetas/magentas en ningún lado.
- Pastel por modo (`--grad-a → --grad-b`, `@property`, animadas): Jairo `#F2B8A0→#E8D5B5` (defecto), `[data-mode=dev]` `#9DB4C8→#A8C3A0`, `[data-mode=ai]` `#A8C3A0→#F2B8A0`. `--accent = --grad-a`; `--grad`; texto sobre pastel en `--bg` (AA ≥ 8).
- Sistema: espaciado ×8; secciones 72/96/128 px (`section-y`); contenido máx. 1200 px. Escala única: `text-h2` (Michroma 40/48), `text-h3` (24/32), `text-body` (17/28), `text-small` (14/22), `text-label` (mono 12/16, solo etiquetas y cifras); máx. 65–70 caracteres. Radios: 12 (botones, chips, campos) · 20 (tarjetas `.glass`) · 28 (Hero). Botones 48 px (44 móvil). Encabezado idéntico: `SectionHeading` (etiqueta «0X / Sección», H2, subtítulo de una línea).
- Menos es más: fuera del Hero solo entradas sutiles (`Reveal`: fade + 16 px, 400 ms, stagger 60 ms, una vez); `.spotlight` = borde pastel al hover. Sin logos de fondo, sin títulos que se decodifican, sin textos de instrucción.
- Fondo: `Aurora` (3 blobs pastel .10–.16, 21–28 s; oculto en móvil) + grano .04. Secciones impares a `--bg-2` con degradado.
- Navbar: cápsula de vidrio (blur 16, surface 70 %), píldora pastel (`layoutId="nav-pill"`), subrayado al hover; <1400 px secundarios en «Más»; móvil a pantalla completa. Riel del Hero: GitHub, Instagram, WhatsApp, correo.
- Tipos: Michroma (`font-hero`, `text-display`) para la palabra gigante y títulos; Archivo para párrafos; JetBrains Mono en mayúsculas para etiquetas y cifras. La Ó es el glifo nativo de Michroma (NFC) con `padding-top:.22em` en `.hero-word` (relleno metálico con reflejo del degradado).
- Imágenes: originales en `assets/avatar/*.png` (765×1024) → `npm run avatars` → `public/avatar/*.webp` q90 + `robot-cabeza.webp`. next/image `quality={90}`. Fotos/galerías se leen de `public/images/...` al compilar (`lib/publicImages.ts`, `existsSync`); si faltan, el bloque se oculta.
- `data/avatar.ts`: poses del robot con ojos en % (`Eyes`), `HYBRID`, textos/anotaciones por modo (Jairo: virtudes; Desarrollador: tecnologías; IA: IAs), pose por sección (`sectionRobot`).
- Hero en tarjeta (radio 28, borde `--border`) con luz ambiental (`HeroAmbient`, tinte `--grad`). Anotaciones: hasta 4 a la vez, rotan cada 4 s con reloj compartido entre capas. `HeroContent` se pinta DOS veces alineado al píxel: base (isolate, ids reales) y revelada `.theme-grad` (fondo `--grad` pastel, textos `--bg`; aria-hidden, inert, sin ids/h1) recortada por la «mancha líquida» (`HeroBlob`: simplex + Catmull-Rom → `clip-path: path()` por rAF; mouse y táctil; pausa fuera de pantalla; apagada con reduced). Personaje B: Jairo→robot, Desarrollador→Jairo, IA→`CircuitFigure`. Ambas capas comparten `heroPointer`/`heroJump`.
- Robot acompañante (`RobotCompanion`): ≥1024 px columna fija a la derecha (`--cw`) que las secciones dejan libre; <1024 px mini robot.
- Motion: `motion/react`, easing `[.22,1,.36,1]`. Modales con `<dialog>` nativo (`CvViewer`, `Gallery`).

## Reglas técnicas
- ids fijos · datos en `data/` tipados · cifras del Hero calculadas desde los datos.
- Todo efecto con fallback y reduced-motion: `useReducedEffects()` de `lib/effects.ts`. No `setState` síncrono en efectos: usa `useSyncExternalStore`.
- 3D con `next/dynamic` `ssr:false`, sin assets 3D externos, dpr [1,1.5].
- `cacheComponents` APAGADO en next.config (por `new Date()` del footer).
- Claves compartidas server/client en `lib/keys.ts`.
- Sin claves en el repo. Lo desconocido va como `TODO(Jairo)` y en PENDIENTES.md; nunca inventar testimonios ni datos. `npm run check:content -- --write` regenera la tabla de PENDIENTES.md.

## Fases
F1–F5 ✔ · mancha líquida ✔ · secciones nuevas ✔ · Stone & Pastel + pulido profesional ✔.
Notas: tras cualquier `npm run build`, reinicia `npm start` antes de capturas (hashes de CSS). R3F: regla react-hooks/immutability apagada solo en components/three. Móvil: sin hero-in, backdrop-filter, grano ni TechBackdrop (rendimiento).
Verificación: `npm run build`, `npm run lint`, `npx tsc --noEmit`, capturas con Playwright en 390/768/1024/1440, commit convencional en español. Nunca merge a `main` sin OK de Jairo.
