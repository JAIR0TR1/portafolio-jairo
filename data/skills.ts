export type Skill = {
  name: string;
  /** 0–100, solo para dibujar el medidor. Se muestra como Aprendiendo / Cómodo / Fuerte. */
  level: number;
  /** Clave del logo en components/ui/TechIcon.tsx */
  icon?: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
};

export type Level = "Aprendiendo" | "Cómodo" | "Fuerte";

export function levelLabel(level: number): Level {
  if (level >= 75) return "Fuerte";
  if (level >= 45) return "Cómodo";
  return "Aprendiendo";
}

// TODO(Jairo): confirmar tecnologías y niveles honestos de cada una.
export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Interfaces web rápidas, accesibles y con buen movimiento.",
    skills: [
      { name: "React", level: 80, icon: "react" },
      { name: "TypeScript", level: 70, icon: "typescript" },
      { name: "Next.js", level: 60, icon: "nextdotjs" },
      { name: "Tailwind CSS", level: 75, icon: "tailwindcss" },
    ],
  },
  {
    id: "movil",
    title: "Móvil y escritorio",
    blurb: "Apps que viven fuera del navegador: teléfono, reloj y PC.",
    skills: [
      { name: "Expo / React Native", level: 55, icon: "expo" },
      { name: "Kotlin · Wear OS", level: 50, icon: "kotlin" },
      { name: "Electron", level: 60, icon: "electron" },
    ],
  },
  {
    id: "backend",
    title: "Backend e IA",
    blurb: "Servidores sencillos y modelos de IA conectados a productos reales.",
    skills: [
      { name: "Node.js", level: 55, icon: "nodedotjs" },
      { name: "Gemini API", level: 60, icon: "googlegemini" },
      { name: "SQL", level: 50, icon: "mysql" },
      { name: "Vercel", level: 65, icon: "vercel" },
    ],
  },
  {
    id: "diseno",
    title: "Diseño",
    blurb: "Del boceto al prototipo, con criterio de usabilidad.",
    skills: [
      { name: "Figma", level: 70, icon: "figma" },
      { name: "Heurísticas de Nielsen", level: 65 },
      { name: "Prototipado", level: 60 },
    ],
  },
];

/** Chips de "Con lo que trabajo" en Sobre mí. TODO(Jairo): confirmar. */
export const aboutTech = ["React", "TypeScript", "Next.js", "Tailwind", "Kotlin", "Electron", "Expo", "Figma", "Git"];
