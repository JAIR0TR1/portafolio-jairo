import type { Tx } from "@/lib/i18n";

export type Testimonial = {
  /** Nombre propio: no se traduce. */
  nombre: string;
  /** Relación con Jairo, p. ej. «Cliente de @jairovende_» o «Docente de Diseño de Interfaces». */
  relacion: Tx;
  /** Cita textual en español y su traducción fiel al inglés (sin agregar ni quitar nada). */
  texto: Tx;
  tipo: "cliente" | "academico";
  /** Foto opcional en public/images/testimonios/. Sin foto se muestran iniciales. */
  foto?: string;
};

// Testimonios reales que Jairo recibió (nov 2026), con ortografía corregida y sin cambiar lo que dicen.
// Si la lista queda vacía, la sección muestra 3 tarjetas «Próximamente».
export const testimonials: Testimonial[] = [
  {
    nombre: "Gabriel Guerrero",
    relacion: { es: "Compañero de Ingeniería de Software", en: "Software Engineering classmate" },
    texto: {
      es: "Bro, tu portafolio está muy chévere, eres muy bueno. Te voy a recomendar. ¡Trabajemos juntos en un proyecto!",
      en: "Bro, your portfolio is really cool, you're very good. I'm going to recommend you. Let's work together on a project!",
    },
    tipo: "academico",
  },
  {
    nombre: "Juan Quintero",
    relacion: { es: "Interesado en un portafolio web", en: "Interested in a portfolio website" },
    texto: {
      es: "Bro, necesito un portafolio como el tuyo, ¡muy chimba! ¿Cuánto vale?",
      en: "Bro, I need a portfolio like yours, it's awesome! How much does it cost?",
    },
    tipo: "cliente",
  },
  {
    nombre: "Diego Espinoza",
    relacion: { es: "Cliente de @jairovende_", en: "@jairovende_ customer" },
    texto: {
      es: "Muy chimba el iPhone, ¡recomendadísimo!",
      en: "The iPhone is awesome, highly recommended!",
    },
    tipo: "cliente",
  },
];
