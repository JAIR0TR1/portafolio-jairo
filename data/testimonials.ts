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

// TODO(Jairo): agregar mínimo 3 testimonios REALES con permiso de cada persona (la guía lo exige).
// Mientras la lista esté vacía, la sección muestra 3 tarjetas «Próximamente».
export const testimonials: Testimonial[] = [];
