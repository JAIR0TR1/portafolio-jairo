export type Skill = {
  name: string;
  /** Clave del logo en components/ui/TechIcon.tsx (simple-icons). */
  icon: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  skills: Skill[];
};

/** Habilidades por grupo, sin niveles ni porcentajes. */
export const skillGroups: SkillGroup[] = [
  {
    id: "lenguajes",
    title: "Lenguajes",
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
    title: "Frontend",
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
    title: "Backend y datos",
    skills: [
      { name: "Spring Boot", icon: "springboot" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MongoDB", icon: "mongodb" },
    ],
  },
  {
    id: "herramientas",
    title: "Herramientas",
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
    title: "IA en mi flujo",
    skills: [
      { name: "Claude", icon: "claude" },
      { name: "Gemini", icon: "googlegemini" },
    ],
  },
];

/** IAs que usa (cuenta real para la barra de cifras del Hero). */
export const aiTools = skillGroups.find((g) => g.id === "ia")?.skills ?? [];
