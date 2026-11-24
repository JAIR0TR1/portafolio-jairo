import type { ModeId } from "@/lib/mode";
import type { Tx } from "@/lib/i18n";

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
  base: { src: "/avatar/robot.webp", eyes: EYES_A, alt: "Mi robot" },
  saludo: { src: "/avatar/robot-saludo.webp", eyes: EYES_A, alt: "Mi robot saludando" },
  senala: { src: "/avatar/robot-senala.webp", eyes: EYES_A, alt: "Mi robot señalando el contenido" },
  laptop: { src: "/avatar/robot-laptop.webp", eyes: EYES_B, alt: "Mi robot con una laptop" },
  pulgar: { src: "/avatar/robot-pulgar.webp", eyes: EYES_B, alt: "Mi robot con el pulgar arriba" },
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
export const sectionBubble: Record<string, Tx> = {
  "sobre-mi": { es: "¡Hola! Soy Jairo", en: "Hi! I'm Jairo" },
  proyectos: { es: "Esto es lo que he construido", en: "Here's what I've built" },
  experiencia: { es: "Este es mi recorrido", en: "Here's my journey" },
  emprendimiento: { es: "Mi negocio en Pasto", en: "My business in Pasto" },
  testimonios: { es: "Lo que dicen de mí", en: "What people say about me" },
  "trabaja-conmigo": { es: "¿Agendamos tu proyecto?", en: "Shall we book your project?" },
  contacto: { es: "Aquí me encuentras", en: "Here's how to reach me" },
  habilidades: { es: "Mi stack, por capas", en: "My stack, layer by layer" },
};

export type AvatarMode = {
  /** Palabra gigante detrás del personaje. */
  word: Tx;
  /** Nombre del grupo de anotaciones. */
  group: Tx;
  notes: Tx<string[]>;
  alt: Tx;
};

export const avatarModes: Record<ModeId, AvatarMode> = {
  jairo: {
    word: { es: "Jairo", en: "Jairo" },
    group: { es: "Cómo trabajo", en: "How I work" },
    notes: {
      es: [
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
      en: [
        "Self-directed learning",
        "Critical thinking",
        "Problem solving",
        "Clear communication",
        "Teamwork",
        "Product vision",
        "User focus",
        "Time management",
        "Leadership",
        "Adaptability",
        "Attention to detail",
        "Entrepreneurial mindset",
      ],
    },
    alt: { es: "Yo, en ilustración 3D con sudadera negra", en: "Me, as a 3D illustration in a black hoodie" },
  },
  dev: {
    word: { es: "Código", en: "Code" },
    group: { es: "Lo que sé hacer", en: "What I can do" },
    notes: {
      es: [
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
      en: [
        "Java",
        "OOP",
        "Spring Boot",
        "REST APIs",
        "React",
        "Next.js",
        "TypeScript",
        "SQL",
        "PostgreSQL",
        "MongoDB",
        "Design patterns (GoF)",
        "Software architecture",
        "UI/UX in Figma",
        "Git",
        "GitHub Flow",
        "Scrum",
        "Jira",
        "UML modeling",
        "Python",
        "Flask",
        "Deploying on Vercel",
      ],
    },
    alt: { es: "Mi robot con casco y visor", en: "My robot with a helmet and visor" },
  },
  ai: {
    word: { es: "Jairo.IA", en: "Jairo.AI" },
    group: { es: "Cómo uso la IA", en: "How I use AI" },
    notes: {
      es: [
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
      en: [
        "Prompt engineering",
        "Claude Code (agents)",
        "Gemini API",
        "Rapid prototyping with AI",
        "AI-assisted code review",
        "Workflow automation",
        "Asset generation",
        "AI API integration",
        "Data analysis with AI",
        "Human judgment and ethics",
      ],
    },
    alt: { es: "Jairo.IA: yo, mitad persona y mitad robot", en: "Jairo.AI: me, half human and half robot" },
  },
};
