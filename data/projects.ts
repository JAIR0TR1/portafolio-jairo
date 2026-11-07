export type Project = {
  title: string;
  description: string;
  tags: string[];
  /** Repositorio en GitHub. Si falta, no se muestra el botón. */
  github?: string;
  /** Demo publicada (Vercel). Si falta, no se muestra el botón. */
  demo?: string;
  /** Captura en public/images/proyectos/. Sin imagen se dibuja una portada por código. */
  image?: string;
  status?: "publicado" | "en-desarrollo";
  year?: number;
  accent?: string;
};

const GH = "https://github.com/JAIR0TR1";

// TODO(Jairo): capturas de cada proyecto en public/images/proyectos/ (campo image).
// TODO(Jairo): repositorio y demo de Cazador de Objetos, StudyFlow y Library Management System.
// Proyecto adicional: agrégalo al final de esta lista (se mostrará solo cuando exista).
export const projects: Project[] = [
  {
    title: "Escudo Guardián",
    description:
      "App de escritorio contra el fraude digital: Nilo, una criatura guardiana, analiza mensajes y enlaces y avisa con un semáforo.",
    tags: ["Electron", "React", "TypeScript", "Gemini"],
    github: `${GH}/DDIS-GUARDIAN-SHIELD`,
    status: "publicado",
    year: 2026,
    accent: "#9DB4C8",
  },
  {
    title: "Brasa",
    description:
      "Mascota de fuego para Wear OS que lee pasos y pulso para ayudarte a moverte, calmarte o descansar.",
    tags: ["Kotlin", "Wear OS", "Compose"],
    github: `${GH}/brasa-wear-os`,
    status: "publicado",
    year: 2026,
    accent: "#F2B8A0",
  },
  {
    title: "Reproductor de música",
    description:
      "Reproductor interactivo cuya playlist es una lista doblemente enlazada: siguiente, anterior y orden en tiempo real.",
    tags: ["React", "TypeScript", "Estructuras de datos"],
    github: `${GH}/TALLER-REPRODUCTOR-DE-MUSICA-`,
    demo: "https://taller-reproductor-de-musica-psi.vercel.app",
    status: "publicado",
    year: 2026,
    accent: "#E8D5B5",
  },
  {
    title: "Cazador de Objetos",
    description: "App móvil hecha con Expo que convierte la búsqueda de objetos en un juego.",
    tags: ["Expo", "React Native", "TypeScript"],
    status: "en-desarrollo",
    year: 2026,
    accent: "#A8C3A0",
  },
  {
    title: "StudyFlow",
    description: "Organizador de estudio: tareas, sesiones de enfoque y progreso en un solo lugar.",
    tags: ["React", "TypeScript", "Vite"],
    status: "publicado",
    year: 2025,
    accent: "#C9B79A",
  },
  {
    title: "Library Management System",
    description: "Sistema para gestionar una biblioteca: préstamos, inventario de libros y usuarios.",
    tags: ["Java", "SQL"],
    status: "publicado",
    year: 2024,
    accent: "#9DB4C8",
  },
];
