import type { Tx } from "@/lib/i18n";

export type Project = {
  /** Clave estable (lista, filtros, animaciones). */
  id: string;
  /** Los nombres propios de las apps no se traducen (mismo texto en es y en). */
  title: Tx;
  description: Tx;
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

// Capturas reales en public/images/proyectos/ (1280×800, webp 85) para los proyectos con demo;
// los demás muestran una portada ilustrada con su nombre y el ícono de su tecnología.
// Sin repositorio ni demo publicados todavía: StudyFlow y Library Management System (la tarjeta no muestra enlaces).
// Proyecto adicional: agrégalo al final de esta lista (se mostrará solo cuando exista).
export const projects: Project[] = [
  {
    id: "escudo-guardian",
    title: { es: "Escudo Guardián", en: "Escudo Guardián" },
    description: {
      es: "App de escritorio contra el fraude digital: Nilo, una criatura guardiana, analiza mensajes y enlaces y avisa con un semáforo.",
      en: "Desktop app against digital fraud: Nilo, a guardian creature, analyzes messages and links and warns you with a traffic light.",
    },
    tags: ["Electron", "React", "TypeScript", "Gemini"],
    github: `${GH}/DDIS-GUARDIAN-SHIELD`,
    status: "publicado",
    year: 2026,
  },
  {
    id: "brasa",
    title: { es: "Brasa", en: "Brasa" },
    description: {
      es: "Mascota de fuego para Wear OS que lee pasos y pulso para ayudarte a moverte, calmarte o descansar.",
      en: "A fire pet for Wear OS that reads your steps and heart rate to help you move, calm down or rest.",
    },
    tags: ["Kotlin", "Wear OS", "Compose"],
    github: `${GH}/brasa-wear-os`,
    status: "publicado",
    year: 2026,
  },
  {
    id: "reproductor",
    title: { es: "Reproductor de música", en: "Music player" },
    description: {
      es: "Reproductor interactivo cuya playlist es una lista doblemente enlazada: siguiente, anterior y orden en tiempo real.",
      en: "Interactive player whose playlist is a doubly linked list: next, previous and reordering in real time.",
    },
    tags: ["React", "TypeScript", "Estructuras de datos"],
    github: `${GH}/TALLER-REPRODUCTOR-DE-MUSICA-`,
    demo: "https://taller-reproductor-de-musica-psi.vercel.app",
    image: "/images/proyectos/reproductor-de-musica.webp",
    status: "publicado",
    year: 2026,
  },
  {
    id: "cazador",
    title: { es: "Cazador de Objetos", en: "Cazador de Objetos" },
    description: {
      es: "App móvil hecha con Expo que convierte la búsqueda de objetos en un juego.",
      en: "Mobile app built with Expo that turns looking for objects into a game.",
    },
    tags: ["Expo", "React Native", "TypeScript"],
    github: `${GH}/cazador-de-objetos`,
    status: "en-desarrollo",
    year: 2026,
  },
  {
    id: "studyflow",
    title: { es: "StudyFlow", en: "StudyFlow" },
    description: {
      es: "Organizador de estudio: tareas, sesiones de enfoque y progreso en un solo lugar.",
      en: "Study organizer: tasks, focus sessions and progress in one place.",
    },
    tags: ["React", "TypeScript", "Vite"],
    status: "publicado",
    year: 2025,
  },
  {
    id: "library",
    title: { es: "Library Management System", en: "Library Management System" },
    description: {
      es: "Sistema para gestionar una biblioteca: préstamos, inventario de libros y usuarios.",
      en: "System to manage a library: loans, book inventory and users.",
    },
    tags: ["Java", "SQL"],
    status: "publicado",
    year: 2024,
  },
];
