# Portafolio — Jairo Andrés Vallejo Burbano

@AGENTS.md

Entrega del curso "Diseño de Interfaces" (UCC). Límite: 8 nov 2026. Se califica sobre todo el DISEÑO, pero la guía del curso se cumple al 100 %.

## Guía del curso (innegociable)
- Next.js 16 (App Router) + TypeScript + Tailwind v4 (`@theme` en `app/globals.css`) + Vercel desde repo público.
- `app/page.tsx` en este orden (decisión de Jairo, nov 2026): `<Navbar />` + `<main>` con Hero, About, Projects, Experience, Emprendimiento, Testimonials, TrabajaConmigo, Contact, Skills + `<Footer />`.
- Ids fijos: `inicio, sobre-mi, proyectos, experiencia, emprendimiento, testimonios, trabaja-conmigo, contacto, habilidades`, footer `footer`. `<html lang="es" className="scroll-smooth" data-scroll-behavior="smooth">`. El orden y los números «0X» salen de `sections` en `data/profile.ts` (`sectionIndex`).
- Componentes en `components/*.tsx` (uno por sección); extras en `components/ui/` y `components/three/`. Datos tipados en `data/` (profile, projects, experience, testimonials, skills, business, services, avatar).
- Requisitos: Navbar sticky + hamburguesa; Hero con nombre grande, rol, avatar, frase, `<a href="/cv.pdf" download>` + botones secundarios; Sobre mí (párrafo, foto real tal cual 3/4, datos clave, intereses, hoja de vida con modal); Proyectos con `.map()`, imagen, tags, GitHub y Demo con `target="_blank" rel="noopener noreferrer"` (botón oculto si falta el enlace); ≥3 testimonios (tipo cliente/académico); experiencia académica Y laboral con fechas, línea vertical; Emprendimiento @jairovende_ (sección extra: flyers con lightbox y videos de clientes 9/16 de `public/videos/clientes/`); Trabaja conmigo (formulario validado → WhatsApp o correo, "use client"); contacto con correo (copiar), WhatsApp, GitHub, Instagram — SIN LinkedIn en todo el sitio; formulario de Contacto solo con `NEXT_PUBLIC_FORMSPREE_ID`; footer con nombre, © `new Date().getFullYear()`, redes, enlaces, volver arriba, "Hecho con Next.js + Tailwind"; Habilidades antes del footer, sin niveles ni porcentajes, con el anillo 3D de logos (`LogoRing`) como protagonista.

## Dirección de arte «Tres mundos» + «Jairo y su robot» (rama `minimal`)
- El modo define el color de TODO el sitio (variables registradas con `@property`, 600 ms): Jairo `--bg #1C0A10 · --bg-2 #24101A · --surface #2E1520 · --accent #E5383B` (defecto) · `[data-mode=dev]` `#0A1430 · #0F1B3D · #15244D · #2F6BFF` · `[data-mode=ai]` `#04221B · #072D24 · #0B3A2F · #10B981`. Comunes: `--text #F5F2EE`, `--muted` (texto 68 %), `--border` (blanco 10 %), `--accent-soft` (16 %). `--accent-strong` = botones/píldoras con texto blanco (AA ≥ 4.6); `--accent-text` = acento para texto (Tailwind `text-accent`, AA ≥ 6.5). Sin café, beige, pastel, violeta ni magenta.
- El modo SOLO cambia cuando el usuario pulsa Jairo / Desarrollador / IA (sin ciclo automático); `chooseMode` lo guarda en localStorage (`MODE_KEY`) y el script de arranque lo aplica antes del primer pintado.
- Intro: solo 3D (`IntroGate` + `IntroScene`); mientras carga, fondo del modo + indicador «Cargando»; si WebGL no existe, falla o no está lista en 6 s, se entra directo al sitio. Texturas: `intro/site.webp` (Hero 2880×1800, q90, se ve al final del zoom) y `intro/site-scroll.webp` (página, scroll dentro de la tablet), filtrado lineal + anisotropía máxima, precargadas por el script de arranque. Regenerar con `npm run intro:texture` (servidor reiniciado tras crear archivos nuevos en public/).
- Pausa global (WCAG 2.2.2): `PauseButton` (junto a los modos y en el footer) + `lib/motion.ts`; `<html data-anim="paused">` detiene órbita, avatar, anillo de logos, chispas y robot flotante en su posición actual. Se guarda en localStorage (`PAUSE_KEY`) e inicia en pausa con «Reducir efectos» o prefers-reduced-motion.
- Primer render: `.hero-in` solo anima transform; la palabra gigante ya sale ajustada al ancho con unidades de contenedor (`NATURAL` en HeroTitle). La Ó de «CÓDIGO» es O + `.hero-acute` (la tilde nativa de Michroma quedaba alta y suelta).
- Mancha líquida: dentro todo es claro (`.theme-grad`: fondo #F7F5F0, texto #12161C, palabra en metal oscuro, chips/secundarios oscuros, primario con el acento).
- Anotaciones en órbita (`HeroOrbit`): 2 elipses inclinadas (~65°) en sentidos opuestos, 55 s por vuelta, hasta 12 etiquetas (6 y una órbita en móvil) que rotan cada 8 s; detrás: escala .85, opacidad .35, z-5; repulsión del cursor con resorte; hover pausa. Un solo rAF en la capa base mueve las etiquetas de ambas capas.
- Modo IA: la palabra gigante es «JAIRO.IA».
- Sistema: espaciado ×8; secciones 72/96/128 px (`section-y`); contenido máx. 1200 px. Escala única: `text-h2` (Michroma 40/48), `text-h3` (24/32), `text-body` (17/28), `text-small` (14/22), `text-label` (mono 12/16, solo etiquetas y cifras); máx. 65–70 caracteres. Radios: 12 (botones, chips, campos) · 20 (tarjetas `.glass`) · 28 (Hero). Botones 48 px (44 móvil). Encabezado idéntico: `SectionHeading` (etiqueta «0X / Sección», H2, subtítulo de una línea).
- Menos es más: fuera del Hero solo entradas sutiles (`Reveal`: fade + 16 px, 400 ms, stagger 60 ms, una vez); `.spotlight` = borde del acento al hover. Sin logos de fondo, sin títulos que se decodifican, sin textos de instrucción.
- Fondo: radial del acento detrás del personaje (.22), viñeta, grano .04 y rejilla de puntos tenue (`Aurora` sin auroras).
- Navbar: cápsula de vidrio (blur 16, surface 70 %), píldora del acento (`layoutId="nav-pill"`), subrayado al hover; <1400 px secundarios en «Más»; móvil a pantalla completa. Riel del Hero: GitHub, Instagram, WhatsApp, correo.
- Tipos: Michroma (`font-hero`, `text-display`) para la palabra gigante y títulos; Archivo para párrafos; JetBrains Mono en mayúsculas para etiquetas y cifras. La Ó es el glifo nativo de Michroma (NFC) con `padding-top:.22em` en `.hero-word` (relleno metálico con reflejo del degradado).
- Imágenes: originales en `assets/avatar/*.png` (765×1024) → `npm run avatars` → `public/avatar/*.webp` q90 + `robot-cabeza.webp`. next/image `quality={90}`. Fotos/galerías se leen de `public/images/...` al compilar (`lib/publicImages.ts`, `existsSync`); si faltan, el bloque se oculta.
- `data/avatar.ts`: poses del robot con ojos en % (`Eyes`), `HYBRID`, textos/anotaciones por modo (Jairo: virtudes; Desarrollador: tecnologías; IA: IAs), pose por sección (`sectionRobot`).
- Hero en tarjeta (radio 28, borde `--border`) con luz ambiental (`HeroAmbient`, tinte `--grad`). `HeroContent` se pinta DOS veces alineado al píxel: base (isolate, ids reales) y revelada `.theme-grad` (fondo #F7F5F0, textos #12161C; aria-hidden, inert, sin ids/h1) recortada por la «mancha líquida» (`HeroBlob`: simplex + Catmull-Rom → `clip-path: path()` por rAF; mouse y táctil; pausa fuera de pantalla; apagada con reduced). Personaje B: Jairo→robot, Desarrollador→Jairo, IA→`CircuitFigure`. Ambas capas comparten `heroPointer`/`heroJump`.
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
F1–F5 ✔ · mancha líquida ✔ · secciones nuevas ✔ · pulido profesional ✔ · Tres mundos + órbitas ✔.
Notas: tras cualquier `npm run build`, reinicia `npm start` antes de capturas (hashes de CSS). R3F: regla react-hooks/immutability apagada solo en components/three. Móvil: sin hero-in, backdrop-filter, grano ni TechBackdrop (rendimiento).
Verificación: `npm run build`, `npm run lint`, `npx tsc --noEmit`, capturas con Playwright en 390/768/1024/1440, commit convencional en español. Nunca merge a `main` sin OK de Jairo.
