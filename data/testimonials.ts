export type Testimonial = {
  nombre: string;
  /** Relación con Jairo, p. ej. «Cliente de @jairovende_» o «Docente de Diseño de Interfaces». */
  relacion: string;
  texto: string;
  tipo: "cliente" | "academico";
  /** Foto opcional en public/images/testimonios/. Sin foto se muestran iniciales. */
  foto?: string;
};

// TODO(Jairo): agregar mínimo 3 testimonios REALES con permiso de cada persona (la guía lo exige).
// Mientras la lista esté vacía, la sección muestra 3 tarjetas «Próximamente».
export const testimonials: Testimonial[] = [];
