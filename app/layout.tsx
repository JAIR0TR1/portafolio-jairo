import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono, Michroma } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { Providers } from "@/components/ui/Providers";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Aurora } from "@/components/ui/Aurora";
import { bootScript } from "@/lib/keys";

// Archivo (variable, eje de ancho 62–125) para todo el sitio · JetBrains Mono para etiquetas
// Michroma: palabra gigante del Hero y títulos grandes de sección
const michroma = Michroma({ variable: "--font-michroma", subsets: ["latin"], weight: "400" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "Portafolio de Jairo Andrés Vallejo Burbano, estudiante de Ingeniería de Software en la Universidad Cooperativa de Colombia (Pasto). Interfaces web, diseño UI, backend e IA aplicada; fundador de @jairovende_.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · Ingeniería de Software y Diseño UI`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: "Portafolio Jairo Andrés Vallejo Burbano",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: ["Jairo Andrés Vallejo Burbano", "jairovende", "portafolio", "ingeniería de software", "diseño UI", "Next.js", "React", "Pasto", "Colombia"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Jairo Andrés Vallejo Burbano",
    title: `${profile.name} · Portafolio`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} · Portafolio`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1C0A10",
  colorScheme: "dark",
};


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`scroll-smooth ${michroma.variable} ${archivo.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#contenido"
          className="btn btn-primary fixed left-4 top-4 z-[100] -translate-y-24 focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <ScrollProgress />
        <Aurora />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
