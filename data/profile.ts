import type { Tx } from "@/lib/i18n";

export type SocialIcon = "github" | "instagram" | "mail" | "whatsapp";

export type SocialLink = {
  /** Nombre de la red: los nombres propios (GitHub, Instagram, WhatsApp) no se traducen. */
  label: Tx;
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
  role: { es: "Estudiante de Ingeniería de Software", en: "Software Engineering student" } satisfies Tx,
  university: "Universidad Cooperativa de Colombia",
  city: "Pasto",
  location: "Pasto, Nariño",
  /** Línea del Hero bajo el nombre. */
  heroRole: {
    es: "Estudiante de Ingeniería de Software · Universidad Cooperativa de Colombia, Pasto",
    en: "Software Engineering student · Universidad Cooperativa de Colombia, Pasto",
  } satisfies Tx,
  tagline: {
    es: "Código limpio. Interfaces claras. Ideas que se venden.",
    en: "Clean code. Clear interfaces. Ideas that sell.",
  } satisfies Tx,
  about: {
    es: "Estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia, enfocado en desarrollo frontend y diseño de interfaces. Combino bases sólidas de arquitectura y backend con una visión de producto que viene de dirigir mi propio emprendimiento: entiendo al usuario, priorizo lo que aporta valor y entrego soluciones claras, funcionales y bien construidas.",
    en: "Software Engineering student at Universidad Cooperativa de Colombia, focused on frontend development and interface design. I pair solid foundations in architecture and backend with a product mindset that comes from running my own business: I understand the user, prioritize what adds value and deliver clear, functional, well-built solutions.",
  } satisfies Tx,
  interests: {
    es: ["Videojuegos", "Emprendimiento", "Fútbol", "Programar"],
    en: ["Video games", "Entrepreneurship", "Soccer", "Coding"],
  } satisfies Tx<string[]>,
  /** Año en que empezó a programar (Ingeniería de Software). */
  codingSince: 2024,
  /** Foto real: si el archivo no existe en public/, el marco se oculta (ver About). */
  photo: "/images/jairo-foto.jpg",
  /** Hoja de vida: un solo archivo para todos los botones; se descarga con este nombre. */
  cv: { href: "/cv.pdf", fileName: "CV-Jairo-Vallejo.pdf" },
  email: "jairoval1000@gmail.com",
  whatsapp: WHATSAPP,
  whatsappHref: `https://wa.me/${WHATSAPP}?text=Hola%20Jairo%2C%20vi%20tu%20portafolio`,
  github: "https://github.com/JAIR0TR1",
  githubHandle: "@JAIR0TR1",
  instagram: "https://instagram.com/jairovende_",
  instagramHandle: "@jairovende_",
} as const;

/** Datos clave de «Sobre mí». */
export const keyFacts: { label: Tx; value: Tx }[] = [
  {
    label: { es: "Formación", en: "Education" },
    value: { es: `Ingeniería de Software, desde ${profile.codingSince}`, en: `Software Engineering, since ${profile.codingSince}` },
  },
  {
    label: { es: "Enfoque", en: "Focus" },
    value: { es: "Frontend, diseño de interfaces y backend", en: "Frontend, interface design and backend" },
  },
  { label: { es: "Ubicación", en: "Location" }, value: { es: profile.location, en: profile.location } },
];

const same = (s: string): Tx => ({ es: s, en: s });

/** Redes del sitio (menú y footer). Sin LinkedIn. */
export const socials: SocialLink[] = [
  { label: same("GitHub"), handle: profile.githubHandle, href: profile.github, icon: "github" },
  { label: same("Instagram"), handle: profile.instagramHandle, href: profile.instagram, icon: "instagram" },
  { label: { es: "Correo", en: "Email" }, handle: profile.email, href: `mailto:${profile.email}`, icon: "mail" },
];

/** Riel lateral del Hero: GitHub, Instagram, WhatsApp y correo. */
export const railLinks: SocialLink[] = [
  socials[0],
  socials[1],
  { label: same("WhatsApp"), handle: "+57 301 391 7671", href: profile.whatsappHref, icon: "whatsapp" },
  socials[2],
];

/**
 * Secciones en el orden EXACTO de app/[lang]/page.tsx (no cambiar ids).
 * `primary`: visibles siempre en el menú de escritorio; el resto va en «Más» en pantallas medianas.
 */
export const sections = [
  { id: "inicio", label: { es: "Inicio", en: "Home" }, primary: true },
  { id: "sobre-mi", label: { es: "Sobre mí", en: "About" }, primary: true },
  { id: "proyectos", label: { es: "Proyectos", en: "Projects" }, primary: true },
  { id: "experiencia", label: { es: "Experiencia", en: "Experience" }, primary: true },
  { id: "emprendimiento", label: { es: "Emprendimiento", en: "Business" }, primary: true },
  { id: "testimonios", label: { es: "Testimonios", en: "Testimonials" }, primary: false },
  { id: "trabaja-conmigo", label: { es: "Trabaja conmigo", en: "Work with me" }, primary: false },
  { id: "contacto", label: { es: "Contacto", en: "Contact" }, primary: false },
  { id: "habilidades", label: { es: "Habilidades", en: "Skills" }, primary: false },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Número de pestaña («0X / Sección») de cada sección. */
export function sectionIndex(id: SectionId) {
  return String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}
