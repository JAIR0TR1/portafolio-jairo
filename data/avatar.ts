import type { ModeId } from "@/lib/mode";

/**
 * Imágenes en public/avatar/*.webp (530×952, mismo recorte → misma línea de piso y centro).
 * Se generan con `npm run avatars` desde assets/avatar/*.png.
 */
export const AVATAR_ASPECT = 530 / 952;

/**
 * Ojos dibujados por código dentro del visor del robot (el visor es vidrio negro vacío).
 * Todo en % de la imagen: centro entre los dos ojos (cx, cy), separación entre centros (gap),
 * tamaño de cada ojo (w respecto al ancho, h respecto al alto) y rotación de la cabeza (grados).
 * `far`: escala del ojo más lejano (la cabeza está girada 3/4 hacia la izquierda).
 */
export type Eyes = { cx: number; cy: number; gap: number; w: number; h: number; rot: number; far: number };

const EYES_A: Eyes = { cx: 43.2, cy: 16.9, gap: 9.6, w: 2.7, h: 3.7, rot: 0, far: 0.86 };
const EYES_B: Eyes = { cx: 43.4, cy: 18.1, gap: 9.6, w: 2.7, h: 3.7, rot: 0, far: 0.86 };

export type PoseId = "base" | "saludo" | "senala" | "laptop" | "pulgar";

export const poses: Record<PoseId, { src: string; eyes: Eyes; alt: string }> = {
  base: { src: "/avatar/robot.webp", eyes: EYES_A, alt: "Robot de Jairo" },
  saludo: { src: "/avatar/robot-saludo.webp", eyes: EYES_A, alt: "Robot de Jairo saludando" },
  senala: { src: "/avatar/robot-senala.webp", eyes: EYES_A, alt: "Robot de Jairo señalando el contenido" },
  laptop: { src: "/avatar/robot-laptop.webp", eyes: EYES_B, alt: "Robot de Jairo con una laptop" },
  pulgar: { src: "/avatar/robot-pulgar.webp", eyes: EYES_B, alt: "Robot de Jairo con el pulgar arriba" },
};

export const JAIRO_SRC = "/avatar/jairo.webp";

/** Cabeza del robot para el mini robot de móvil (recorte de robot.webp, ver prepare-avatars). */
export const HEAD = {
  src: "/avatar/robot-cabeza.webp",
  // mismos ojos, recalculados al recorte x 30–70 %, y 1–29 %
  eyes: { cx: 33, cy: 57.5, gap: 24, w: 6.8, h: 13.2, rot: 0, far: 0.86 } satisfies Eyes,
};

/**
 * Híbrido (modo IA): jairo.webp y robot.webp superpuestas. El robot se desplaza/escala
 * para alinear el centro de la cabeza con el de Jairo (% del ancho/alto de la imagen).
 */
export const HYBRID = { robot: { dx: -0.8, dy: 0.6, scale: 1 } };

export type Expression = "neutral" | "happy" | "curious" | "focus";

/** Pose y expresión del robot acompañante en cada sección. */
export const sectionRobot: Record<string, { pose: PoseId; expression: Expression }> = {
  "sobre-mi": { pose: "saludo", expression: "neutral" },
  proyectos: { pose: "senala", expression: "curious" },
  testimonios: { pose: "base", expression: "neutral" },
  experiencia: { pose: "laptop", expression: "focus" },
  contacto: { pose: "pulgar", expression: "happy" },
  habilidades: { pose: "laptop", expression: "focus" },
};

export type AvatarMode = {
  /** Palabra gigante detrás del personaje. */
  word: string;
  /** Línea de la columna derecha del Hero. */
  line: string;
  /** Nombre del grupo de anotaciones. */
  group: string;
  notes: string[];
  alt: string;
};

export const avatarModes: Record<ModeId, AvatarMode> = {
  jairo: {
    word: "Jairo",
    line: "Fuera del código: fotos, fútbol, anime y videojuegos.",
    group: "Hobbies",
    notes: ["Fotografía y video con iPhone", "Fútbol: LaLiga y Champions", "Anime (Naruto)", "Videojuegos (Black Myth: Wukong)"],
    alt: "Ilustración 3D de Jairo con sudadera negra",
  },
  dev: {
    word: "Código",
    line: "Escribo TypeScript, React, Next.js y Kotlin.",
    group: "Lenguajes",
    notes: ["TypeScript", "JavaScript", "React", "Next.js", "Kotlin", "HTML", "CSS", "Tailwind CSS"],
    alt: "Robot de Jairo con casco y visor",
  },
  ai: {
    word: "Humano+IA",
    line: "Construyo con Claude y Gemini, sin perder el criterio humano.",
    group: "IAs que uso",
    notes: ["Claude / Claude Code", "Google Gemini", "Gemini API (AI Studio)"],
    alt: "Jairo mitad humano y mitad robot",
  },
};
