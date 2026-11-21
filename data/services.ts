import type { Tx } from "@/lib/i18n";

export type Service = { id: string; title: Tx; text: Tx };

/** Servicios de «Trabaja conmigo» (también son las opciones del formulario). */
export const services: Service[] = [
  {
    id: "landing",
    title: { es: "Landing pages y portafolios", en: "Landing pages and portfolios" },
    text: {
      es: "Páginas rápidas, claras y listas para compartir, con buen SEO básico.",
      en: "Fast, clear pages ready to share, with solid basic SEO.",
    },
  },
  {
    id: "apps",
    title: { es: "Apps web con React/Next.js", en: "Web apps with React/Next.js" },
    text: { es: "Aplicaciones a medida con TypeScript, desplegadas en Vercel.", en: "Custom apps in TypeScript, deployed on Vercel." },
  },
  {
    id: "uiux",
    title: { es: "Diseño de interfaces (UI/UX) en Figma", en: "Interface design (UI/UX) in Figma" },
    text: { es: "Del boceto al prototipo navegable, con criterios de usabilidad.", en: "From sketch to clickable prototype, guided by usability." },
  },
  {
    id: "backend",
    title: { es: "Backends con Spring Boot y bases de datos", en: "Backends with Spring Boot and databases" },
    text: { es: "APIs y modelos de datos con Java, Spring Boot y SQL.", en: "APIs and data models with Java, Spring Boot and SQL." },
  },
  {
    id: "negocios",
    title: { es: "Presencia digital para emprendimientos", en: "Online presence for small businesses" },
    text: { es: "Catálogo web con botón de WhatsApp para negocios pequeños.", en: "A web catalog with a WhatsApp button for small businesses." },
  },
];

/** Rangos de presupuesto (opcional), en pesos colombianos. */
export const budgets: Tx[] = [
  { es: "Menos de $500.000 COP", en: "Under $500,000 COP" },
  { es: "$500.000 – $1.500.000 COP", en: "$500,000 – $1,500,000 COP" },
  { es: "$1.500.000 – $3.000.000 COP", en: "$1,500,000 – $3,000,000 COP" },
  { es: "Más de $3.000.000 COP", en: "Over $3,000,000 COP" },
  { es: "Aún no lo sé", en: "I don't know yet" },
];
