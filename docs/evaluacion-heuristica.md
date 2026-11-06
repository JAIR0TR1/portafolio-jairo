# Evaluación heurística: Portafolio de Jairo Vallejo Burbano

Método del PDF "Cimientos de UX": (1) definir el alcance, (2) recorrer los flujos dos veces, (3) anotar cada problema con dónde pasa y qué heurística rompe, (4) asignar severidad, (5) priorizar y corregir.

**Escala de severidad:** 0 = no es un problema · 1 = cosmético · 2 = menor · 3 = mayor · 4 = crítico.

## 1. Alcance

| Flujo | Inicio | Meta |
| --- | --- | --- |
| A. Encontrar y abrir un proyecto | Llega al inicio (con o sin intro) | Abre el código o la demo de un proyecto filtrado por tecnología |
| B. Contactar a Jairo | Llega al inicio | Envía un mensaje o copia el correo |

Dispositivos: escritorio de 1440 px (mouse y teclado), tablet de 768 px y celular de 390 px (táctil). Además se probó con `prefers-reduced-motion` y con el interruptor «Reducir efectos».

## 2. Recorridos

- **Primera pasada:** exploración libre por cada flujo, anotando todo lo que generó duda o fricción.
- **Segunda pasada:** el mismo flujo con una lente distinta en cada caso: solo teclado (Tab, Enter, Esc), celular y reduced-motion.

## 3–4. Problemas encontrados y severidad

| # | Flujo | Qué pasa | Dónde | Heurística | Sev. |
| --- | --- | --- | --- | --- | --- |
| 1 | A | Los enlaces de GitHub y de demo son provisionales y llevan a páginas que no existen | Tarjetas de proyectos | 09 Recuperación de errores · 02 Mundo real | 4 |
| 2 | B | El correo, LinkedIn y GitHub son provisionales | Contacto, footer y menú | 05 Prevención de errores | 4 |
| 3 | A/B | Con reduced-motion, el contenido de las secciones quedaba **borroso y desplazado** | Todas las secciones con aparición | 01 Visibilidad · 09 Errores | 4 |
| 4 | A | Los testimonios dicen «[PENDIENTE]» y le restan credibilidad | Testimonios | 02 Mundo real · 08 Estética | 3 |
| 5 | A | Al filtrar no se ve cuántos proyectos quedan | Filtros de proyectos | 01 Visibilidad del estado | 2 |
| 6 | A | «Ver demo» indica que abre otra pestaña y «Código» no | Botones de las tarjetas | 04 Consistencia | 2 |
| 7 | B | «Escribir mensaje» baja al formulario, pero el foco del teclado se queda atrás | Banner de contacto | 07 Flexibilidad y eficiencia | 2 |
| 8 | A/B | «Reducir efectos» solo estaba en el footer, lejos de quien lo necesita en el celular | Global y menú móvil | 03 Control y libertad · 07 Eficiencia | 2 |
| 9 | A | «Datos rápidos» tenía una estructura de lista inválida para lectores de pantalla | Sobre mí | 02 Mundo real (accesibilidad) | 2 |
| 10 | A/B | La intro de unos 5 s retrasa la llegada al contenido en la primera visita | Inicio | 03 Control · 07 Eficiencia | 2 |
| 11 | B | Sin Formspree, el envío depende de la app de correo del usuario | Formulario | 09 Recuperación de errores | 2 |
| 12 | A | La etiqueta «Hug × 56» del marco Figma siempre visible es ruido para quien no usa Figma | Navbar | 08 Estética minimalista | 1 |
| 13 | A | El avatar cambiaba de modo mientras la intro lo tapaba | Hero | 01 Visibilidad | 1 |
| 14 | A | El logo de Next.js del fondo quedaba detrás de «Desliza» | Hero | 08 Estética | 1 |
| 15 | A | En Habilidades (sección fija) puede no ser obvio que hay que bajar | Habilidades | 10 Ayuda | 1 |

## 5. Priorización y correcciones (antes / después)

Se corrigió todo lo de severidad ≥ 3 que dependía del código, además de lo fácil. Lo que depende de contenido real quedó en `PENDIENTES.md`.

| # | Antes | Después | Estado |
| --- | --- | --- | --- |
| 3 | Con reduced-motion el texto quedaba borroso y movido | Las variantes reducidas reinician `y` y `blur` de forma explícita; solo hay fundido | ✔ Corregido |
| 5 | El conteo solo existía para lectores de pantalla | Texto visible «Mostrando N de 6 · filtro» (y `aria-live`) | ✔ Corregido |
| 6 | Íconos distintos en los dos botones | Ambos llevan ↗ y la etiqueta «(abre en otra pestaña)» | ✔ Corregido |
| 7 | El foco no se movía | El enlace baja al formulario y enfoca el campo «Nombre» | ✔ Corregido |
| 8 | Solo en el footer | También en el menú móvil; se guarda en localStorage | ✔ Corregido |
| 9 | `dl` con elementos no permitidos | `dt`/`dd` válidos (Lighthouse Accesibilidad 93 → 100) | ✔ Corregido |
| 10 | — | «Saltar intro» siempre visible, «Entrar» desde los 2 s, Esc/Enter/Espacio/rueda, una vez por sesión, nunca en móvil ni con reduced-motion | ✔ Mitigado |
| 11 | — | El mensaje de confirmación explica lo que pasó y muestra el correo; falta configurar `NEXT_PUBLIC_FORMSPREE_ID` | ◐ Mitigado / pendiente |
| 12 | Siempre visible | Aparece solo al pasar el mouse por la navegación | ✔ Corregido |
| 13 | El modo cambiaba bajo la intro | El ciclo se pausa mientras se ve la intro y fuera del Hero | ✔ Corregido |
| 14 | Se encimaba con «Desliza» | Logo reubicado | ✔ Corregido |
| 15 | — | Pista «Baja para recorrer cada capa» y puntos clicables con nombre | ✔ Mitigado |
| 1, 2, 4 | Contenido provisional | Requiere datos reales de Jairo (no se inventan) | ⏳ Pendiente (ver `PENDIENTES.md`) |

## 6. Checklist rápido de 10 preguntas

> Una pregunta por heurística, en el orden del PDF. TODO(Jairo): ajustar la redacción a la del PDF del curso.

| # | Pregunta | Respuesta |
| --- | --- | --- |
| 1 | ¿El usuario siempre sabe dónde está y qué está pasando? | Sí: scrollspy con `aria-current`, barra de progreso de lectura, progreso de la intro, estados del formulario (enviando/enviado/error), toast al copiar, modo activo del avatar y conteo de proyectos. |
| 2 | ¿Se usa el lenguaje del usuario? | Sí: español simple, sin tecnicismos en la interfaz, íconos siempre acompañados de etiqueta y niveles «Aprendiendo / Cómodo / Fuerte» en lugar de porcentajes. |
| 3 | ¿Puede deshacer o salir fácilmente? | Sí: «Saltar intro», Esc cierra el menú, pausa en el carrusel y en el avatar, «Reducir efectos» y el formulario conserva lo escrito si falla. |
| 4 | ¿Lo que se parece funciona igual? | Sí: un solo sistema de botones (primario/secundario/fantasma) y los mismos nombres y posiciones («Código», «Ver demo», «Descargar CV»). |
| 5 | ¿Se previenen los errores antes de que pasen? | Sí: validación en vivo, requisitos visibles, botón deshabilitado mientras envía y honeypot. Los enlaces externos abren en otra pestaña. |
| 6 | ¿El usuario reconoce en vez de recordar? | Sí: navegación siempre visible, filtros y modos a la vista, y etiquetas en todos los íconos. |
| 7 | ¿Hay atajos para usuarios con experiencia? | Sí: filtros rápidos, «Saltar al contenido», teclado completo, Esc/Enter en la intro y puntos clicables en Habilidades. |
| 8 | ¿El diseño muestra solo lo necesario? | Sí: una acción principal por sección, mucho aire y decoración que no tapa el texto (los logos de fondo quedan en los bordes y con baja opacidad). |
| 9 | ¿Los errores explican qué pasó y cómo arreglarlo? | Sí: mensajes junto a cada campo, error de envío con alternativa por correo, página 404 propia y fallback 2D si falla WebGL. |
| 10 | ¿Hay ayuda cuando hace falta? | Sí: pistas contextuales («Mueve el mouse · toca para saludar», «Baja para recorrer cada capa») y estado vacío en los filtros con un botón para ver todo. |

---

## Anexo A: Checklist de la guía del curso (14 ítems)

| # | Ítem | ✔/✘ | Evidencia |
| --- | --- | --- | --- |
| 1 | Next.js + TypeScript | ✔ | `package.json` (Next 16.4, TS 5), `app/` |
| 2 | Tailwind CSS (responsive con `md:`/`lg:`) | ✔ | `app/globals.css` (`@theme`), clases `md:`/`lg:` en todos los componentes |
| 3 | Menú | ✔ | `components/Navbar.tsx`: sticky, anclas a las 7 secciones y hamburguesa en celular |
| 4 | Hero con «Descargar CV» | ✔ | `components/Hero.tsx`: `<a href="/cv.pdf" download>`; `public/cv.pdf` |
| 5 | Acerca de mí | ✔ | `components/About.tsx`: párrafo, foto/ilustración, tecnologías, datos rápidos |
| 6 | Proyectos con GitHub y Vercel | ✔* | `data/projects.ts` + `.map()` en `components/Projects.tsx`. *Los links son provisionales (ver `PENDIENTES.md`) |
| 7 | 3+ testimonios | ✔* | `data/testimonials.ts` (3). *Pendientes de reemplazar por testimonios reales |
| 8 | Experiencia académica y laboral | ✔ | `data/experience.ts`, línea de tiempo vertical de lo más reciente a lo más antiguo |
| 9 | Contactos con correo | ✔* | `components/Contact.tsx`: correo, LinkedIn, GitHub y formulario validado. *Datos provisionales |
| 10 | Footer con nombre y © año | ✔ | `components/Footer.tsx`: `new Date().getFullYear()`, redes, enlaces, volver arriba, crédito |
| 11 | Sección extra | ✔ | `components/Skills.tsx` (Habilidades), antes del footer |
| 12 | Se ve bien en celular | ✔ | `docs/capturas/390-*.jpg`, sin scroll horizontal (verificado con Playwright) |
| 13 | Código en GitHub con commits | ⏳ | Commits por fase listos; falta `git push` (comandos en el README) |
| 14 | Publicado en Vercel con URL pública | ⏳ | Falta importar el repo en Vercel (pasos en el README) |

## Anexo B: Dónde se aplica cada heurística

| Heurística | Dónde |
| --- | --- |
| 01 Visibilidad del estado | Scrollspy, barra de progreso, progreso de la intro, estados del formulario, toast, modo activo, «Mostrando N de 6» |
| 02 Mundo real | Español simple, fechas legibles, niveles en palabras, íconos con etiqueta |
| 03 Control y libertad | Saltar intro, Esc, pausa en carrusel y avatar, «Reducir efectos», el formulario conserva lo escrito |
| 04 Consistencia | Sistema único de botones; «Código» / «Ver demo» / «Descargar CV» iguales en todas partes |
| 05 Prevención de errores | Validación en vivo, requisitos visibles, botón deshabilitado al enviar, honeypot, `rel="noopener noreferrer"` |
| 06 Reconocer antes que recordar | Navegación siempre visible, filtros y modos visibles, etiquetas en íconos |
| 07 Flexibilidad y eficiencia | Filtros, «Saltar al contenido», teclado completo, foco al formulario, puntos en Habilidades |
| 08 Estética minimalista | Una acción principal por sección, color como luz, decoración que no tapa el texto |
| 09 Recuperación de errores | Mensajes junto al campo, alternativa por correo, 404 propia, fallbacks sin WebGL |
| 10 Ayuda | Pistas contextuales y estados vacíos que explican qué hacer |
