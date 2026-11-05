export type Testimonial = {
  name: string;
  role: string;
  text: string;
  avatar?: string;
  rating?: number;
};

// TODO(Jairo): reemplazar los 3 por testimonios REALES con permiso de cada persona.
// No se inventan opiniones: el texto queda marcado como pendiente a propósito.
export const testimonials: Testimonial[] = [
  {
    name: "Nombre del docente", // TODO(Jairo)
    role: "Docente · Universidad Cooperativa de Colombia", // TODO(Jairo)
    text: "[PENDIENTE: testimonio real] Aquí irá la opinión de un docente sobre un proyecto o entrega de Jairo.",
    rating: 5,
  },
  {
    name: "Nombre de compañero/a", // TODO(Jairo)
    role: "Compañero/a de proyecto", // TODO(Jairo)
    text: "[PENDIENTE: testimonio real] Aquí irá la experiencia de alguien que trabajó con Jairo en equipo.",
    rating: 5,
  },
  {
    name: "Nombre de cliente", // TODO(Jairo)
    role: "Cliente · Emprendimiento de celulares", // TODO(Jairo)
    text: "[PENDIENTE: testimonio real] Aquí irá la opinión de un cliente sobre la atención y el servicio de Jairo.",
    rating: 5,
  },
];
