export type SocialIcon = "github" | "instagram" | "mail" | "whatsapp";

export type SocialLink = {
  label: string;
  /** Texto visible (usuario, correo…) */
  handle: string;
  href: string;
  icon: SocialIcon;
};

const WHATSAPP = "573013917671";

export const profile = {
  name: "Jairo Andrés Vallejo Burbano",
  shortName: "Jairo",
  initials: "JV",
  role: "Estudiante de Ingeniería de Software",
  university: "Universidad Cooperativa de Colombia",
  city: "Pasto",
  location: "Pasto, Nariño",
  /** Línea del Hero bajo el nombre. */
  heroRole: "Estudiante de Ingeniería de Software · Universidad Cooperativa de Colombia, Pasto",
  tagline: "Código limpio. Interfaces claras. Ideas que se venden.",
  about:
    "Estudio Ingeniería de Software en Pasto y vendo iPhone por mi cuenta. Lo segundo me enseñó lo que lo primero no: que nadie lee el manual. Por eso diseño interfaces que se entienden solas y escribo código que no hay que explicar dos veces.",
  interests: ["Videojuegos", "Emprendimiento", "Fútbol", "Programar"],
  /** Año en que empezó a programar (Ingeniería de Software). */
  codingSince: 2024,
  /** Foto real: si el archivo no existe en public/, el marco se oculta (ver About). */
  photo: "/images/jairo-foto.jpg",
  email: "jairoval1000@gmail.com",
  whatsapp: WHATSAPP,
  whatsappHref: `https://wa.me/${WHATSAPP}?text=Hola%20Jairo%2C%20vi%20tu%20portafolio`,
  github: "https://github.com/JAIR0TR1",
  githubHandle: "@JAIR0TR1",
  instagram: "https://instagram.com/jairovende_",
  instagramHandle: "@jairovende_",
} as const;

/** Datos clave de «Sobre mí». */
export const keyFacts = [
  { label: "Formación", value: `Ingeniería de Software, desde ${profile.codingSince}` },
  { label: "Enfoque", value: "Frontend, diseño de interfaces y backend" },
  { label: "Ubicación", value: profile.location },
] as const;

/** Redes del sitio (menú y footer). Sin LinkedIn. */
export const socials: SocialLink[] = [
  { label: "GitHub", handle: profile.githubHandle, href: profile.github, icon: "github" },
  { label: "Instagram", handle: profile.instagramHandle, href: profile.instagram, icon: "instagram" },
  { label: "Correo", handle: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
];

/** Riel lateral del Hero: GitHub, Instagram, WhatsApp y correo. */
export const railLinks: SocialLink[] = [
  socials[0],
  socials[1],
  { label: "WhatsApp", handle: "+57 301 391 7671", href: profile.whatsappHref, icon: "whatsapp" },
  socials[2],
];

/**
 * Secciones en el orden EXACTO de app/page.tsx (no cambiar ids).
 * `primary`: visibles siempre en el menú de escritorio; el resto va en «Más» en pantallas medianas.
 */
export const sections = [
  { id: "inicio", label: "Inicio", primary: true },
  { id: "sobre-mi", label: "Sobre mí", primary: true },
  { id: "proyectos", label: "Proyectos", primary: true },
  { id: "experiencia", label: "Experiencia", primary: true },
  { id: "emprendimiento", label: "Emprendimiento", primary: true },
  { id: "testimonios", label: "Testimonios", primary: false },
  { id: "trabaja-conmigo", label: "Trabaja conmigo", primary: false },
  { id: "contacto", label: "Contacto", primary: false },
  { id: "habilidades", label: "Habilidades", primary: false },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Número de pestaña («0X / Sección») de cada sección. */
export function sectionIndex(id: SectionId) {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}
