import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";
import { Providers } from "@/components/ui/Providers";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SpotlightTracker } from "@/components/ui/SpotlightTracker";
import { bootScript } from "@/lib/keys";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "Portafolio de Jairo Vallejo Burbano, estudiante de Ingeniería de Software en Pasto, Colombia. Interfaces web, apps móviles y de escritorio, diseño UI e IA aplicada.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · Ingeniería de Software y Diseño UI`,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: "Portafolio Jairo Vallejo",
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: ["Jairo Vallejo Burbano", "portafolio", "ingeniería de software", "diseño UI", "Next.js", "React", "Pasto", "Colombia"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Jairo Vallejo Burbano",
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
  themeColor: "#06060A",
  colorScheme: "dark",
};


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`scroll-smooth ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
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
        <SpotlightTracker />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
