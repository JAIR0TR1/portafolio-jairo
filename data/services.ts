export type Service = { id: string; title: string; text: string };

/** Servicios de «Trabaja conmigo» (también son las opciones del formulario). */
export const services: Service[] = [
  { id: "landing", title: "Landing pages y portafolios", text: "Páginas rápidas, claras y listas para compartir, con buen SEO básico." },
  { id: "apps", title: "Apps web con React/Next.js", text: "Aplicaciones a medida con TypeScript, desplegadas en Vercel." },
  { id: "uiux", title: "Diseño de interfaces (UI/UX) en Figma", text: "Del boceto al prototipo navegable, con criterios de usabilidad." },
  { id: "backend", title: "Backends con Spring Boot y bases de datos", text: "APIs y modelos de datos con Java, Spring Boot y SQL." },
  {
    id: "negocios",
    title: "Presencia digital para emprendimientos",
    text: "Catálogo web con botón de WhatsApp para negocios pequeños.",
  },
];

/** Rangos de presupuesto (opcional), en pesos colombianos. */
export const budgets = [
  "Menos de $500.000 COP",
  "$500.000 – $1.500.000 COP",
  "$1.500.000 – $3.000.000 COP",
  "Más de $3.000.000 COP",
  "Aún no lo sé",
];
