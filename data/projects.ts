export type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  image?: string;
  status?: "publicado" | "en-desarrollo";
  year?: number;
  accent?: string;
};

// TODO(Jairo): confirmar descripciones, etiquetas, años, estados y enlaces de cada proyecto.
// La guía exige link de GitHub Y de Vercel/Demo en todos: si no hay web, usa un video o landing.
const GH = "https://github.com/TODO-usuario"; // TODO(Jairo): tu usuario de GitHub

export const projects: Project[] = [
  {
    title: "Escudo Guardián",
    description:
      "App de escritorio con un asistente de IA (Gemini) integrado. Interfaz hecha en React y TypeScript sobre Electron.",
    tags: ["Electron", "React", "TypeScript", "Gemini"],
    github: `${GH}/escudo-guardian`, // TODO(Jairo)
    demo: "https://escudo-guardian.vercel.app", // TODO(Jairo): demo real o video
    status: "publicado",
    year: 2025,
    accent: "#2D7BFF",
  },
  {
    title: "Brasa",
    description:
      "App para smartwatch Wear OS escrita en Kotlin, con un servidor en Vercel que conecta funciones de IA.",
    tags: ["Kotlin", "Wear OS", "Vercel", "IA"],
    github: `${GH}/brasa`, // TODO(Jairo)
    demo: "https://brasa.vercel.app", // TODO(Jairo): demo real o video
    status: "publicado",
    year: 2025,
    accent: "#FF7A3D",
  },
  {
    title: "Cazador de Objetos",
    description:
      "App móvil hecha con Expo que convierte la búsqueda de objetos en un juego. Todavía en desarrollo.",
    tags: ["Expo", "React Native", "TypeScript"],
    github: `${GH}/cazador-de-objetos`, // TODO(Jairo)
    demo: "https://cazador-de-objetos.vercel.app", // TODO(Jairo): demo real o video
    status: "en-desarrollo",
    year: 2026,
    accent: "#C6FF3D",
  },
  {
    title: "StudyFlow",
    description:
      "Organizador de estudio: tareas, sesiones de enfoque y progreso en un solo lugar.",
    tags: ["React", "TypeScript", "Vite"],
    github: `${GH}/studyflow`, // TODO(Jairo)
    demo: "https://studyflow.vercel.app", // TODO(Jairo)
    status: "publicado",
    year: 2025,
    accent: "#7C5CFF",
  },
  {
    title: "Library Management System",
    description:
      "Sistema para gestionar una biblioteca: préstamos, inventario de libros y usuarios.",
    tags: ["Java", "SQL"],
    github: `${GH}/library-management-system`, // TODO(Jairo)
    demo: "https://library-management-system.vercel.app", // TODO(Jairo)
    status: "publicado",
    year: 2024,
    accent: "#3DE8FF",
  },
  {
    title: "Reproductor de música",
    description:
      "Reproductor con lista de canciones, controles y una interfaz pensada para usarse con una mano.",
    tags: ["React", "JavaScript", "CSS"],
    github: `${GH}/reproductor-musica`, // TODO(Jairo)
    demo: "https://reproductor-musica.vercel.app", // TODO(Jairo)
    status: "publicado",
    year: 2024,
    accent: "#FF3D9A",
  },
];
