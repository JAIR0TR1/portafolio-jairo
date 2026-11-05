# Pendientes de Jairo

Todo lo que necesito que confirmes o reemplaces. La tabla de abajo se regenera con:

```bash
npm run check:content -- --write
```

## Lo más importante (antes de entregar)

1. **Correo, GitHub y LinkedIn reales** → `data/profile.ts` (no inventé direcciones).
2. **CV real** → reemplaza `public/cv.pdf` (el actual dice "CV pendiente").
3. **3 testimonios reales con permiso** → `data/testimonials.ts` (hoy dicen `[PENDIENTE: testimonio real]`).
4. **Links de GitHub y demo de cada proyecto** → `data/projects.ts`. La guía exige ambos: si un proyecto no tiene web, usa un video (YouTube/Drive) o una landing en Vercel.
5. **Foto** → guárdala en `public/images/jairo.webp` y pon `photo: "/images/jairo.webp"` en `data/profile.ts`.
6. **Avatares PNG** (fondo transparente) → `public/avatar/dev.png`, `design.png`, `ai.png`. Mientras no estén, se usa un avatar SVG provisional original.
7. **Formulario**: crea un formulario gratis en formspree.io y en Vercel agrega la variable `NEXT_PUBLIC_FORMSPREE_ID`. Sin ella, el formulario abre la app de correo (mailto).
8. **Experiencia**: nombre del emprendimiento, años, semestre, cursos.
9. **Habilidades y niveles**: confirma que sean honestos (`data/skills.ts`).

## Lista automática (archivo y línea)

<!-- AUTO:INICIO -->
| Archivo | Línea | Qué falta |
| --- | --- | --- |
| `components/About.tsx` | 17 | confirmar |
| `components/Contact.tsx` | 13 | crear en formspree.io y ponerlo en Vercel |
| `components/ui/AvatarBot.tsx` | 15 | reemplazar por los PNG de /public/avatar (dev.png, design.png, ai.png). |
| `data/experience.ts` | 12 | confirmar fechas, nombres y logros de cada ítem. |
| `data/experience.ts` | 18 | meses exactos |
| `data/experience.ts` | 26 | nombre del emprendimiento |
| `data/experience.ts` | 27 | año de inicio |
| `data/experience.ts` | 29 | logros concretos |
| `data/experience.ts` | 36 | año de inicio y semestre |
| `data/experience.ts` | 43 | nombre del curso o certificación |
| `data/experience.ts` | 44 | completar: place: "[Plataforma o institución]", |
| `data/experience.ts` | 45 | completar: date: "[año]", |
| `data/experience.ts` | 46 | completar: description: "Describe en una línea qué aprendiste o qué construiste." |
| `data/profile.ts` | 18 | semestre actual, ej. "7.º semestre" |
| `data/profile.ts` | 19 | confirmar intereses |
| `data/profile.ts` | 22 | revisar el párrafo |
| `data/profile.ts` | 25 | "/avatar/dev.png" |
| `data/profile.ts` | 26 | "/avatar/design.png" |
| `data/profile.ts` | 27 | "/avatar/ai.png" |
| `data/profile.ts` | 29 | foto en /public/images/jairo.webp y poner aquí la ruta |
| `data/profile.ts` | 31 | correo real |
| `data/profile.ts` | 33 | número de WhatsApp (opcional) |
| `data/profile.ts` | 34 | URL de tu GitHub |
| `data/profile.ts` | 35 | completar: githubHandle: "@TODO-usuario", |
| `data/profile.ts` | 36 | URL de tu LinkedIn |
| `data/profile.ts` | 37 | completar: linkedinHandle: "in/TODO-usuario", |
| `data/projects.ts` | 13 | confirmar descripciones, etiquetas, años, estados y enlaces de cada proyecto. |
| `data/projects.ts` | 15 | tu usuario de GitHub |
| `data/projects.ts` | 23 | completar: github: ${GH}/escudo-guardian, |
| `data/projects.ts` | 24 | demo real o video |
| `data/projects.ts` | 34 | completar: github: ${GH}/brasa, |
| `data/projects.ts` | 35 | demo real o video |
| `data/projects.ts` | 45 | completar: github: ${GH}/cazador-de-objetos, |
| `data/projects.ts` | 46 | demo real o video |
| `data/projects.ts` | 56 | completar: github: ${GH}/studyflow, |
| `data/projects.ts` | 57 | completar: demo: "https://studyflow.vercel.app", |
| `data/projects.ts` | 67 | completar: github: ${GH}/library-management-system, |
| `data/projects.ts` | 68 | completar: demo: "https://library-management-system.vercel.app", |
| `data/projects.ts` | 78 | completar: github: ${GH}/reproductor-musica, |
| `data/projects.ts` | 79 | completar: demo: "https://reproductor-musica.vercel.app", |
| `data/skills.ts` | 24 | confirmar tecnologías y niveles honestos de cada una. |
| `data/skills.ts` | 70 | confirmar. |
| `data/testimonials.ts` | 9 | reemplazar los 3 por testimonios REALES con permiso de cada persona. |
| `data/testimonials.ts` | 13 | completar: name: "Nombre del docente", |
| `data/testimonials.ts` | 14 | completar: role: "Docente · Universidad Cooperativa de Colombia", |
| `data/testimonials.ts` | 19 | completar: name: "Nombre de compañero/a", |
| `data/testimonials.ts` | 20 | completar: role: "Compañero/a de proyecto", |
| `data/testimonials.ts` | 25 | completar: name: "Nombre de cliente", |
| `data/testimonials.ts` | 26 | completar: role: "Cliente · Emprendimiento de celulares", |
| `scripts/make-cv.mjs` | 1 | reemplazar por tu CV real. |
<!-- AUTO:FIN -->
