export type Item = {
  type: "academica" | "laboral";
  title: string;
  place: string;
  /** Texto visible con inicio y fin, en español. */
  date: string;
  description: string;
  /** "AAAA-MM" para ordenar de lo más reciente a lo más antiguo; vacío = en curso, sin fecha confirmada. */
  start: string;
};

export const experience: Item[] = [
  {
    type: "laboral",
    title: "Fundador · @jairovende_",
    place: "Emprendimiento propio · Pasto",
    date: "Actualidad", // TODO(Jairo): fecha de inicio del emprendimiento (p. ej. «2023 – actualidad»)
    description:
      "Venta de iPhone y accesorios en Pasto: atención directa a clientes, revisión de cada equipo, inventario y ventas por Instagram y WhatsApp.",
    start: "",
  },
  {
    type: "academica",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    date: "2024 – actualidad",
    description:
      "Programación, estructuras de datos, patrones de diseño, bases de datos y diseño de interfaces.",
    start: "2024-01",
  },
];

/** En curso sin fecha primero; luego de lo más reciente a lo más antiguo. */
export const sortedExperience = [...experience].sort((a, b) => (b.start || "9999").localeCompare(a.start || "9999"));
