# Pendientes de Jairo

Todo lo que necesito que confirmes o reemplaces. La tabla de abajo se regenera con:

```bash
npm run check:content -- --write
```

## Lo más importante (antes de entregar)

1. **3 testimonios reales con permiso** → `data/testimonials.ts` (campos `nombre`, `relacion`, `texto`, `tipo: "cliente" | "academico"`). La guía exige mínimo 3. Mientras la lista esté vacía, la sección muestra 3 tarjetas «Próximamente» (solo aceptable en la rama `minimal`).
2. **CV real** → reemplaza `public/cv.pdf` (el actual es de relleno: dice "CV pendiente"). Se usa en «Descargar CV» y en el modal «Ver hoja de vida».
3. **Proyecto adicional** → agrégalo al final de `projects` en `data/projects.ts` (no se muestran tarjetas vacías).
4. **Proyectos**:
   - Capturas en `public/images/proyectos/` y campo `image` en `data/projects.ts` (sin imagen se dibuja una portada por código).
   - Repositorio y demo de **Cazador de Objetos**, **StudyFlow** y **Library Management System** (no encontré repos con esos nombres en github.com/JAIR0TR1; por ahora no muestran botones). La guía pide GitHub y demo en cada proyecto.
   - Demos de Escudo Guardián y Brasa (son apps de escritorio y reloj: sirve un video o una landing en Vercel).
5. **Fotos de clientes** (opcional) → `public/images/clientes/` con permiso de cada cliente. Vacía = el bloque de fotos no se muestra (los 2 videos sí).
6. **Subtítulos de los videos de clientes** (accesibilidad, opcional) → archivos `.vtt` junto a cada video.
7. **Más flyers** → `public/images/negocio/`. Para un texto alternativo propio, agrégalo en `alts` de `data/business.ts` (si no, se usa el nombre del archivo).
8. **Formulario de Contacto (opcional)**: crea un formulario en formspree.io y agrega `NEXT_PUBLIC_FORMSPREE_ID` en Vercel. Sin esa variable, el formulario de Contacto se oculta; el de «Trabaja conmigo» (WhatsApp/correo) siempre está.
9. **Textura de la intro**: cada vez que cambies contenido visible, ejecuta `npm run build`, luego `npm start` y, en otra terminal, `npm run intro:texture`.
10. **Rendimiento real**: mide la vista previa de Vercel en https://pagespeed.web.dev (móvil). En local, Lighthouse dio Rendimiento 65–69 y Accesibilidad 100; el entorno local dibuja sin GPU y penaliza el LCP.
11. **Imagen del robot**: el visor del casco trae un brillo violeta propio de la imagen (no es código; se ve en los 3 modos). Si quieres quitarlo, edítalo en `assets/avatar/*.png` y corre `npm run avatars`.
12. **Publicar a producción**: la rama `minimal` tiene vista previa en Vercel; se une a `main` solo con tu autorización.

## Lista automática (archivo y línea)

<!-- AUTO:INICIO -->
| Archivo | Línea | Qué falta |
| --- | --- | --- |
| `data/projects.ts` | 18 | capturas de cada proyecto en public/images/proyectos/ (campo image). |
| `data/projects.ts` | 19 | repositorio y demo de Cazador de Objetos, StudyFlow y Library Management System. |
| `data/testimonials.ts` | 11 | agregar mínimo 3 testimonios REALES con permiso de cada persona (la guía lo exige). |
| `scripts/make-cv.mjs` | 1 | reemplazar por tu CV real. |
<!-- AUTO:FIN -->
