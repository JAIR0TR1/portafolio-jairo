export type Item = {
  type: "academica" | "laboral";
  title: string;
  place: string;
  /** Texto visible con inicio y fin, en español (es-CO). */
  date: string;
  description: string;
  /** "AAAA-MM" para ordenar de lo más reciente a lo más antiguo. */
  start: string;
};

// TODO(Jairo): confirmar fechas, nombres y logros de cada ítem.
export const experience: Item[] = [
  {
    type: "academica",
    title: "Curso de Diseño de Interfaces",
    place: "Universidad Cooperativa de Colombia",
    date: "2026 – 2026", // TODO(Jairo): meses exactos
    description:
      "Diseño centrado en el usuario, heurísticas de Nielsen y prototipado. Este portafolio es la entrega final.",
    start: "2026-08",
  },
  {
    type: "laboral",
    title: "Fundador · Compra y venta de celulares",
    place: "Emprendimiento propio · Pasto", // TODO(Jairo): nombre del emprendimiento
    date: "[año] – actualidad", // TODO(Jairo): año de inicio
    description:
      "Atiendo clientes, reviso el estado de cada equipo y gestiono inventario y ventas por redes sociales.", // TODO(Jairo): logros concretos
    start: "2023-01",
  },
  {
    type: "academica",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    date: "[año] – actualidad", // TODO(Jairo): año de inicio y semestre
    description:
      "Programación, bases de datos, ingeniería de requisitos y desarrollo web, móvil y de escritorio.",
    start: "2022-02",
  },
  {
    type: "academica",
    title: "Curso complementario", // TODO(Jairo): nombre del curso o certificación
    place: "[Plataforma o institución]", // TODO(Jairo)
    date: "[año]", // TODO(Jairo)
    description: "Describe en una línea qué aprendiste o qué construiste.", // TODO(Jairo)
    start: "2021-06",
  },
];

export const sortedExperience = [...experience].sort((a, b) => b.start.localeCompare(a.start));
