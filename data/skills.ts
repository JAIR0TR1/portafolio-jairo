import type { Tx } from "@/lib/i18n";

export type Skill = {
  name: string;
  /** Clave del logo en components/ui/TechIcon.tsx (simple-icons). */
  icon: string;
};

export type SkillGroup = {
  id: string;
  title: Tx;
  skills: Skill[];
};

/** Habilidades por grupo, sin niveles ni porcentajes. */
export const skillGroups: SkillGroup[] = [
  {
    id: "lenguajes",
    title: { es: "Lenguajes", en: "Languages" },
    skills: [
      { name: "Java", icon: "java" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "Python", icon: "python" },
      { name: "SQL", icon: "sql" },
      { name: "Kotlin", icon: "kotlin" },
    ],
  },
  {
    id: "frontend",
    title: { es: "Frontend", en: "Frontend" },
    skills: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextdotjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "HTML", icon: "html5" },
      { name: "CSS", icon: "css" },
    ],
  },
  {
    id: "backend",
    title: { es: "Backend y datos", en: "Backend and data" },
    skills: [
      { name: "Spring Boot", icon: "springboot" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    id: "herramientas",
    title: { es: "Herramientas", en: "Tools" },
    skills: [
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Figma", icon: "figma" },
      { name: "Jira", icon: "jira" },
      { name: "Vercel", icon: "vercel" },
    ],
  },
  {
    id: "ia",
    title: { es: "IA en mi flujo", en: "AI in my workflow" },
    skills: [
      { name: "Claude", icon: "claude" },
      { name: "Gemini", icon: "googlegemini" },
    ],
  },
];

/** IAs que usa (cuenta real para la barra de cifras del Hero). */
export const aiTools = skillGroups.find((g) => g.id === "ia")?.skills ?? [];
