# Portafolio — Jairo Andrés Vallejo Burbano

@AGENTS.md

Entrega del curso "Diseño de Interfaces" (UCC). Límite: 8 nov 2026. Se califica sobre todo el DISEÑO, pero la guía del curso se cumple al 100 %.

## Guía del curso (innegociable)
- Next.js 16 (App Router) + TypeScript + Tailwind v4 (`@theme` en `app/globals.css`) + Vercel desde repo público.
- `app/page.tsx` en este orden (decisión de Jairo, nov 2026): `<Navbar />` + `<main>` con Hero, About, Projects, Experience, Emprendimiento, Testimonials, TrabajaConmigo, Contact, Skills + `<Footer />`.
- Ids fijos: `inicio, sobre-mi, proyectos, experiencia, emprendimiento, testimonios, trabaja-conmigo, contacto, habilidades`, footer `footer`. `<html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">`. El orden y los números «0X» salen de `sections` en `data/profile.ts` (`sectionIndex`).
- Componentes en `components/*.tsx` (uno por sección); extras en `components/ui/` y `components/three/`. Datos tipados en `data/` (profile, projects, experience, testimonials, skills, business, services, avatar).
- Requisitos: Navbar sticky + hamburguesa; Hero con nombre grande, rol, avatar, frase, `<a href="/cv.pdf" download>` + botones secundarios; Sobre mí (párrafo, foto si existe, datos clave, intereses, hoja de vida con modal); Proyectos con `.map()`, imagen, tags, GitHub y Demo con `target="_blank" rel="noopener noreferrer"` (botón oculto si falta el enlace); ≥3 testimonios (tipo cliente/académico); experiencia académica Y laboral con fechas, línea vertical; Emprendimiento @jairovende_ (sección extra); Trabaja conmigo (formulario validado → WhatsApp o correo, "use client"); contacto con correo (copiar), WhatsApp, GitHub, Instagram — SIN LinkedIn en todo el sitio; formulario de Contacto solo con `NEXT_PUBLIC_FORMSPREE_ID`; footer con nombre, © `new Date().getFullYear()`, redes, enlaces, volver arriba, "Hecho con Next.js + Tailwind"; Habilidades antes del footer, sin niveles ni porcentajes.

## Dirección de arte «Midnight Aurora» + «Jairo y su robot» (rama `minimal`)
- Tokens: `--bg #0B1030`, `--bg-2 #10173F`, `--surface #151D4A`, `--surface-2 #1C2560`, `--border rgba(180,190,255,.12)`, `--text #F3F1FF`, `--muted #A8A6D9` (en Tailwind: `bg`, `bg-2`, `card`, `card-2`, `line`, `ink`, `muted`).
- Degradado por modo (`--grad-a → --grad-b`, registradas con `@property`, se animan): Jairo `#8B5CF6→#EC4899` (defecto), `html[data-mode=dev]` `#3B82F6→#22D3EE`, `[data-mode=ai]` `#EC4899→#F59E0B`. `--accent = --grad-a`. `--grad` (puro) y `--grad-soft` (aclarado 72 % para fondos con texto `#0B1030`: contraste AA ≥ 6.8). Utilidades `from-grad-a`, `bg-[image:var(--grad-soft)]`, `.grad-text`.
- Fondo: `Aurora` (3 blobs radiales con los colores del modo, 21–28 s, rejilla de puntos, viñeta) + grano `body::after` .05 + `TechBackdrop`. Secciones impares alternan a `--bg-2` con degradado (sin cortes duros).
- Tarjetas `.glass` (surface + borde) + `.spotlight` (luz del modo bajo el cursor y borde con `--grad` al hover). Botón primario `--grad-soft` con texto oscuro; secundario con borde. Radios: tarjetas 12, píldoras redondas, chips 4.
- Navbar: cápsula de vidrio (blur 16, surface 70 %), píldora activa con degradado (`layoutId="nav-pill"`), subrayado al hover, scroll-spy por posición; <1400 px los secundarios van en «Más»; móvil a pantalla completa con foco atrapado.
- Tipos: Michroma (`font-hero`, `text-display`) para la palabra gigante y títulos; Archivo para párrafos; JetBrains Mono en mayúsculas para etiquetas y cifras. La Ó es el glifo nativo de Michroma (NFC) con `padding-top:.22em` en `.hero-word` (relleno metálico con reflejo del degradado).
- Imágenes: originales en `assets/avatar/*.png` (765×1024) → `npm run avatars` → `public/avatar/*.webp` q90 + `robot-cabeza.webp`. next/image `quality={90}`. Fotos/galerías se leen de `public/images/...` al compilar (`lib/publicImages.ts`, `existsSync`); si faltan, el bloque se oculta.
- `data/avatar.ts`: poses del robot con ojos en % (`Eyes`), `HYBRID`, textos/anotaciones por modo (Jairo: virtudes; Desarrollador: tecnologías; IA: IAs), pose por sección (`sectionRobot`).
- Hero en tarjeta (radio 28, borde `--border`) con luz ambiental (`HeroAmbient`, tinte `--grad`). `HeroContent` se pinta DOS veces alineado al píxel: base (isolate, ids reales) y revelada `.theme-grad` (fondo `--grad`, textos `#0B1030`; aria-hidden, inert, sin ids/h1) recortada por la «mancha líquida» (`HeroBlob`: simplex + Catmull-Rom → `clip-path: path()` por rAF; mouse y táctil; pausa fuera de pantalla; apagada con reduced). Personaje B: Jairo→robot, Desarrollador→Jairo, IA→`CircuitFigure`. Ambas capas comparten `heroPointer`/`heroJump`.
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
F1–F5 ✔ · mancha líquida ✔ · Midnight Aurora + secciones nuevas ✔.
Notas: tras cualquier `npm run build`, reinicia `npm start` antes de capturas (hashes de CSS). R3F: regla react-hooks/immutability apagada solo en components/three. Móvil: sin hero-in, backdrop-filter, grano ni TechBackdrop (rendimiento).
Verificación: `npm run build`, `npm run lint`, `npx tsc --noEmit`, capturas con Playwright en 390/768/1024/1440, commit convencional en español. Nunca merge a `main` sin OK de Jairo.
