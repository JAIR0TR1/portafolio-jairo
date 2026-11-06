import type { ModeId } from "@/lib/mode";

export type AvatarMode = {
  /** Título gigante detrás del avatar: [línea clara, línea oscura]. */
  title: [string, string];
  /** Nombre del grupo de anotaciones. */
  group: string;
  /** Anotaciones alrededor del avatar. */
  notes: string[];
  /** Imagen en public/avatar/ (si no existe, se usa el robot SVG). */
  image: string;
  /** Descripción para lectores de pantalla. */
  alt: string;
};

export const avatarModes: Record<ModeId, AvatarMode> = {
  jairo: {
    title: ["jairo", "vallejo"],
    group: "Hobbies",
    notes: ["Fotografía y video con iPhone", "Fútbol: LaLiga y Champions", "Anime (Naruto)", "Videojuegos (Black Myth: Wukong)"],
    image: "jairo.png",
    alt: "Avatar de Jairo",
  },
  dev: {
    title: ["código", "con intención"],
    group: "Lenguajes",
    notes: ["TypeScript", "JavaScript", "React", "Next.js", "Kotlin", "HTML", "CSS", "Tailwind CSS"],
    image: "robot.png",
    alt: "Avatar de Jairo en modo desarrollador: un robot",
  },
  ai: {
    title: ["humano", "+ ia"],
    group: "IAs que uso",
    notes: ["Claude / Claude Code", "Google Gemini", "Gemini API (AI Studio)"],
    image: "hibrido.png",
    alt: "Avatar de Jairo en modo IA: mitad humano, mitad robot",
  },
};
