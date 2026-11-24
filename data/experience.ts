import type { Tx } from "@/lib/i18n";

export type Item = {
  type: "academica" | "laboral";
  title: Tx;
  place: Tx;
  /** Texto visible con inicio y fin. */
  date: Tx;
  description: Tx;
  /** "AAAA-MM" para ordenar de lo más reciente a lo más antiguo; vacío = en curso, sin fecha confirmada. */
  start: string;
};

export const experience: Item[] = [
  {
    type: "laboral",
    title: { es: "Fundador · @jairovende_", en: "Founder · @jairovende_" },
    place: { es: "Emprendimiento propio · Pasto", en: "My own business · Pasto" },
    date: { es: "Finales de 2024 – actualidad", en: "Late 2024 – present" },
    description: {
      es: "Venta de celulares iPhone y Android y accesorios en Pasto: mercancía importada y sellada con garantía, crédito con ADDI, Sistecrédito y Banco de Bogotá, y atención directa por Instagram y WhatsApp.",
      en: "Selling iPhone and Android phones and accessories in Pasto: imported, factory-sealed stock with warranty, financing through ADDI, Sistecrédito and Banco de Bogotá, and direct service on Instagram and WhatsApp.",
    },
    start: "2024-11",
  },
  {
    type: "academica",
    title: { es: "Ingeniería de Software", en: "Software Engineering" },
    place: { es: "Universidad Cooperativa de Colombia · Pasto", en: "Universidad Cooperativa de Colombia · Pasto" },
    date: { es: "2024 – actualidad", en: "2024 – present" },
    description: {
      es: "Programación, estructuras de datos, patrones de diseño, bases de datos y diseño de interfaces.",
      en: "Programming, data structures, design patterns, databases and interface design.",
    },
    start: "2024-01",
  },
];

/** En curso sin fecha primero; luego de lo más reciente a lo más antiguo. */
export const sortedExperience = [...experience].sort((a, b) => (b.start || "9999").localeCompare(a.start || "9999"));
