# Portafolio — Jairo Vallejo Burbano

Portafolio personal de **Jairo Vallejo Burbano**, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia (Pasto). Entrega del curso **Diseño de Interfaces**.

> Dirección de arte **"Obsidian Aurora"**: negro obsidiana, luz azul, violeta y magenta usada como luz (glows, bordes, halos), vidrio y un 3D sutil.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 (tokens con `@theme`)
- [Motion](https://motion.dev) para animaciones de UI
- `lucide-react` y `simple-icons` para íconos
- Despliegue en Vercel

## Cómo correrlo

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # build de producción
npm run lint         # ESLint
npx tsc --noEmit     # tipos
npm run check:content  # lista los TODO(Jairo) pendientes
npm run shots -- docs/capturas   # capturas 390/768/1440 (con `npm start` corriendo)
```

Variable opcional (en Vercel → Settings → Environment Variables):

| Variable | Para qué |
| --- | --- |
| `NEXT_PUBLIC_FORMSPREE_ID` | Envío real del formulario con Formspree. Sin ella, el formulario abre la app de correo. |

## Estructura

```
app/
  layout.tsx · page.tsx · globals.css
  not-found.tsx · icon.tsx · opengraph-image.tsx
components/
  Navbar · Hero · About · Projects · Testimonials · Experience · Contact · Skills · Footer
  ui/      (Reveal, SectionHeading, AvatarBot, ProjectCover, HoloIcon, …)
data/
  profile.ts · projects.ts · testimonials.ts · experience.ts · skills.ts
lib/       (effects.ts: reduced-motion + toggle "Reducir efectos")
public/
  cv.pdf · images/ · avatar/
scripts/   (check-content, make-cv, screenshots)
```

El orden de `app/page.tsx` sigue la guía del curso: Navbar → Hero → Sobre mí → Proyectos → Testimonios → Experiencia → Contacto → Habilidades → Footer.

## Decisiones de diseño

- **Color como luz.** El fondo es plano (#06060A). El color solo aparece como glows, bordes y halos. `--accent` está registrada con `@property`, así que el cambio de color de toda la página se anima en CSS.
- **Tipografía.** Geist para títulos con tracking ajustado y tamaños fluidos (`clamp`), Instrument Serif cursiva para una sola palabra de acento por título y Geist Mono para etiquetas y números.
- **Un solo sistema de botones** (primario, secundario y fantasma) con los mismos nombres en todas partes: «Descargar CV», «Código», «Ver demo».
- **Movimiento con propósito.** Las secciones aparecen con un reveal (y + blur), las tarjetas tienen un spotlight que sigue al cursor y la línea de tiempo se dibuja con el scroll. Todo se reduce a un fundido simple con `prefers-reduced-motion` o con el interruptor «Reducir efectos» del footer.
- **Rendimiento.** El texto del Hero es el LCP (está en el DOM y entra con una animación CSS). Los glows usan radial-gradients en lugar de filtros blur, y `backdrop-blur` solo se usa en elementos pequeños.
- **Accesibilidad.** Enlace «Saltar al contenido», un solo `h1`, foco visible, `aria-current` en la navegación, objetivos táctiles de 44 px o más, menú móvil con foco atrapado y cierre con Esc, carrusel con pausa.
- **Heurísticas de Nielsen.** Ver `docs/evaluacion-heuristica.md` (fase final).

## Contenido pendiente

Ver [`PENDIENTES.md`](./PENDIENTES.md).
