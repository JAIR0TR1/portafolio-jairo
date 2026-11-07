import type { ModeId } from "@/lib/mode";

/**
 * Imágenes en public/avatar/*.webp: 765×1024 a resolución completa (mismo lienzo → misma línea de piso y centro).
 * Se generan con `npm run avatars` desde assets/avatar/*.png.
 */
export const AVATAR_ASPECT = 765 / 1024;

/**
 * Ojos dibujados por código dentro del visor del robot (el visor es vidrio negro vacío).
 * Todo en % de la imagen: centro entre los dos ojos (cx, cy), separación entre centros (gap),
 * tamaño de cada ojo (w respecto al ancho, h respecto al alto) y rotación de la cabeza (grados).
 * `far`: escala del ojo más lejano (la cabeza está girada 3/4 hacia la izquierda).
 */
export type Eyes = { cx: number; cy: number; gap: number; w: number; h: number; rot: number; far: number };

const EYES_A: Eyes = { cx: 45.22, cy: 19.13, gap: 6.65, w: 1.87, h: 3.44, rot: 0, far: 0.86 };
const EYES_B: Eyes = { cx: 45.36, cy: 20.25, gap: 6.65, w: 1.87, h: 3.44, rot: 0, far: 0.86 };

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
  // mismos ojos, recalculados a la región x 276–488, y 45–311 px de robot.webp
  eyes: { cx: 33, cy: 56.7, gap: 24, w: 6.8, h: 13.2, rot: 0, far: 0.86 } satisfies Eyes,
};

/**
 * Robot alineado sobre Jairo (híbrido del modo IA y linterna de rayos X). Mismo lienzo y ancla en los pies.
 * jairo.webp y robot.webp superpuestas. El robot se desplaza/escala
 * para alinear el centro de la cabeza con el de Jairo (% del ancho/alto de la imagen).
 */
export const HYBRID = { robot: { dx: -0.55, dy: 0.56, scale: 1 } };

export type Expression = "neutral" | "happy" | "curious" | "focus";

/** Pose y expresión del robot acompañante en cada sección. */
export const sectionRobot: Record<string, { pose: PoseId; expression: Expression }> = {
  "sobre-mi": { pose: "saludo", expression: "neutral" },
  proyectos: { pose: "senala", expression: "curious" },
  experiencia: { pose: "laptop", expression: "focus" },
  emprendimiento: { pose: "pulgar", expression: "happy" },
  testimonios: { pose: "base", expression: "neutral" },
  "trabaja-conmigo": { pose: "senala", expression: "happy" },
  contacto: { pose: "pulgar", expression: "happy" },
  habilidades: { pose: "laptop", expression: "focus" },
};

export type AvatarMode = {
  /** Palabra gigante detrás del personaje. */
  word: string;
  /** Nombre del grupo de anotaciones. */
  group: string;
  notes: string[];
  alt: string;
};

export const avatarModes: Record<ModeId, AvatarMode> = {
  jairo: {
    word: "Jairo",
    group: "Cómo trabajo",
    notes: [
      "Aprendo rápido",
      "Pienso como el usuario",
      "Visión de negocio",
      "Detallista con el diseño",
      "Comunico claro",
      "Trabajo en equipo",
      "Constante hasta terminar",
      "Resuelvo problemas reales",
    ],
    alt: "Ilustración 3D de Jairo con sudadera negra",
  },
  dev: {
    word: "Código",
    group: "Lo que sé hacer",
    notes: [
      "Interfaces responsive",
      "APIs REST con Spring Boot",
      "Bases de datos SQL y NoSQL",
      "Componentes en React/Next.js",
      "Patrones de diseño",
      "Diseño UI en Figma",
      "Git y trabajo con ramas",
      "Despliegue en Vercel",
    ],
    alt: "Robot de Jairo con casco y visor",
  },
  ai: {
    word: "Humano+IA",
    group: "Cómo uso la IA",
    notes: [
      "Prototipo más rápido con Claude Code",
      "Investigo y comparo con Gemini",
      "Genero assets con IA",
      "Reviso y depuro código",
      "Integro APIs de IA",
      "Criterio humano en cada decisión",
    ],
    alt: "Jairo mitad humano y mitad robot",
  },
};
