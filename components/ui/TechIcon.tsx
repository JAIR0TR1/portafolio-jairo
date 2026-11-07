import type { SVGProps } from "react";
import {
  siElectron,
  siExpo,
  siFigma,
  siGit,
  siGithub,
  siGooglegemini,
  siJavascript,
  siKotlin,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siReact,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  siVscodium,
  siOpenjdk,
  siCss,
  siPython,
  siSpringboot,
  siPostgresql,
  siMongodb,
  siJira,
  siClaude,
  siHtml5,
  siInstagram,
} from "simple-icons";

/** SQL no tiene logo propio: un cilindro de base de datos genérico. */
const sql = { title: "SQL", hex: "A8A6D9", path: "M12 2C7.03 2 3 3.57 3 5.5v13C3 20.43 7.03 22 12 22s9-1.57 9-3.5v-13C21 3.57 16.97 2 12 2zm0 2c4.42 0 7 1.33 7 1.5S16.42 7 12 7 5 5.67 5 5.5 7.58 4 12 4zM5 8.08C6.62 8.67 9.18 9 12 9s5.38-.33 7-.92V12c0 .17-2.58 1.5-7 1.5S5 12.17 5 12V8.08zm0 6.5c1.62.59 4.18.92 7 .92s5.38-.33 7-.92v3.92c0 .17-2.58 1.5-7 1.5s-7-1.33-7-1.5v-3.92z" };

type SI = { title: string; path: string; hex: string };

export const techIcons: Record<string, SI> = {
  electron: siElectron,
  expo: siExpo,
  figma: siFigma,
  git: siGit,
  github: siGithub,
  googlegemini: siGooglegemini,
  javascript: siJavascript,
  kotlin: siKotlin,
  mysql: siMysql,
  nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs,
  react: siReact,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  vercel: siVercel,
  vite: siVite,
  vscode: siVscodium, // simple-icons ya no incluye el logo de VS Code
  java: siOpenjdk,
  css: siCss,
  python: siPython,
  springboot: siSpringboot,
  postgresql: siPostgresql,
  mongodb: siMongodb,
  jira: siJira,
  claude: siClaude,
  html5: siHtml5,
  instagram: siInstagram,
  sql,
};

/** Nombre visible → clave del logo (para chips de etiquetas). */
export const tagToIcon: Record<string, string> = {
  React: "react",
  "React Native": "react",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Next.js": "nextdotjs",
  Tailwind: "tailwindcss",
  "Tailwind CSS": "tailwindcss",
  Kotlin: "kotlin",
  "Wear OS": "kotlin",
  Electron: "electron",
  Expo: "expo",
  Figma: "figma",
  Git: "git",
  Gemini: "googlegemini",
  Vercel: "vercel",
  Vite: "vite",
  "Node.js": "nodedotjs",
  Java: "java",
  SQL: "sql",
  Python: "python",
  "Spring Boot": "springboot",
  HTML: "html5",
  Claude: "claude",
  CSS: "css",
};

/** Logos muy oscuros (Next.js, GitHub, Vercel…) se pintan con el color del texto para verse sobre el fondo azul noche. */
function readable(hex: string) {
  const n = parseInt(hex, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 70 ? `#${hex}` : "currentColor";
}

export function TechIcon({
  name,
  colored = false,
  ...props
}: { name: string; colored?: boolean } & SVGProps<SVGSVGElement>) {
  const icon = techIcons[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={colored ? readable(icon.hex) : "currentColor"} {...props}>
      <path d={icon.path} />
    </svg>
  );
}
