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

/** Pose y expresión del robot en cada sección (columna fija en escritorio; junto al encabezado en celular). */
export const sectionRobot: Record<string, { pose: PoseId; expression: Expression }> = {
  "sobre-mi": { pose: "saludo", expression: "happy" },
  proyectos: { pose: "senala", expression: "curious" },
  experiencia: { pose: "laptop", expression: "focus" },
  emprendimiento: { pose: "base", expression: "happy" },
  testimonios: { pose: "base", expression: "neutral" },
  "trabaja-conmigo": { pose: "pulgar", expression: "happy" },
  contacto: { pose: "pulgar", expression: "happy" },
  habilidades: { pose: "laptop", expression: "focus" },
};

/** Burbuja corta del robot en cada sección (celular). */
export const sectionBubble: Record<string, string> = {
  "sobre-mi": "¡Hola! Este es Jairo",
  proyectos: "Esto es lo que he construido",
  experiencia: "Aquí está el recorrido",
  emprendimiento: "Su negocio en Pasto",
  testimonios: "Lo que dicen de él",
  "trabaja-conmigo": "¿Agendamos tu proyecto?",
  contacto: "Aquí lo encuentras",
  habilidades: "Su stack, por capas",
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
      "Aprendizaje autónomo",
      "Pensamiento crítico",
      "Resolución de problemas",
      "Comunicación efectiva",
      "Trabajo en equipo",
      "Visión de producto",
      "Orientación al usuario",
      "Gestión del tiempo",
      "Liderazgo",
      "Adaptabilidad",
      "Atención al detalle",
      "Mentalidad emprendedora",
    ],
    alt: "Ilustración 3D de Jairo con sudadera negra",
  },
  dev: {
    word: "Código",
    group: "Lo que sé hacer",
    notes: [
      "Java",
      "POO",
      "Spring Boot",
      "APIs REST",
      "React",
      "Next.js",
      "TypeScript",
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Patrones de diseño (GoF)",
      "Arquitectura de software",
      "UI/UX en Figma",
      "Git",
      "GitHub Flow",
      "Scrum",
      "Jira",
      "Modelado UML",
      "Python",
      "Flask",
      "Despliegue en Vercel",
    ],
    alt: "Robot de Jairo con casco y visor",
  },
  ai: {
    word: "Jairo.IA",
    group: "Cómo uso la IA",
    notes: [
      "Prompt engineering",
      "Claude Code (agentes)",
      "Gemini API",
      "Prototipado rápido con IA",
      "Revisión de código asistida",
      "Automatización de flujos",
      "Generación de assets",
      "Integración de APIs de IA",
      "Análisis de datos con IA",
      "Criterio humano y ética",
    ],
    alt: "Jairo.IA: Jairo mitad persona y mitad robot",
  },
};
