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
} from "simple-icons";

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
  SQL: "mysql",
  CSS: "css",
};

export function TechIcon({
  name,
  colored = false,
  ...props
}: { name: string; colored?: boolean } & SVGProps<SVGSVGElement>) {
  const icon = techIcons[name];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill={colored ? `#${icon.hex}` : "currentColor"} {...props}>
      <path d={icon.path} />
    </svg>
  );
}
