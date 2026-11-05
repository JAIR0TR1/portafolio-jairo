export type SocialIcon = "github" | "linkedin" | "mail" | "whatsapp";

export type SocialLink = {
  label: string;
  /** Texto visible (usuario, correo…) */
  handle: string;
  href: string;
  icon: SocialIcon;
};

export const profile = {
  name: "Jairo Vallejo Burbano",
  shortName: "Jairo",
  initials: "JV",
  role: "Estudiante de Ingeniería de Software",
  university: "Universidad Cooperativa de Colombia",
  location: "Pasto, Colombia",
  semester: "Semestre [N]", // TODO(Jairo): semestre actual, ej. "7.º semestre"
  interests: ["Diseño de interfaces", "IA aplicada", "Apps móviles"], // TODO(Jairo): confirmar intereses
  tagline: "Diseño y programo interfaces claras, rápidas y con detalles que se sienten.",
  about:
    "Soy Jairo, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto. Me gusta convertir ideas en interfaces claras y rápidas, cuidando cada detalle. He creado apps de escritorio, móviles y para smartwatch, y ahora exploro cómo la IA puede hacerlas más útiles. Busco proyectos donde el diseño y el código trabajen juntos.", // TODO(Jairo): revisar el párrafo
  photo: undefined as string | undefined, // TODO(Jairo): foto en /public/images/jairo.webp y poner aquí la ruta
  available: true,
  email: "correo@ejemplo.com", // TODO(Jairo): correo real
  /** Sin el signo +, solo dígitos con indicativo (57…). Vacío = no se muestra. */
  whatsapp: "", // TODO(Jairo): número de WhatsApp (opcional)
  github: "https://github.com/TODO-usuario", // TODO(Jairo): URL de tu GitHub
  githubHandle: "@TODO-usuario", // TODO(Jairo)
  linkedin: "https://www.linkedin.com/in/TODO-usuario", // TODO(Jairo): URL de tu LinkedIn
  linkedinHandle: "in/TODO-usuario", // TODO(Jairo)
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", handle: profile.githubHandle, href: profile.github, icon: "github" },
  { label: "LinkedIn", handle: profile.linkedinHandle, href: profile.linkedin, icon: "linkedin" },
  { label: "Correo", handle: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
];

/** Secciones en el orden EXACTO de app/page.tsx (no cambiar ids). */
export const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "proyectos", label: "Proyectos" },
  { id: "testimonios", label: "Testimonios" },
  { id: "experiencia", label: "Experiencia" },
  { id: "contacto", label: "Contacto" },
  { id: "habilidades", label: "Habilidades" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
