import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, JetBrains_Mono, Michroma } from "next/font/google";
import "../globals.css";
import { profile } from "@/data/profile";
import { Providers } from "@/components/ui/Providers";
import { I18nProvider } from "@/components/ui/I18nProvider";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Aurora } from "@/components/ui/Aurora";
import { bootScript, THEME_COLOR } from "@/lib/keys";
import { LANGS, langHome } from "@/lib/i18n";
import { getDict, getI18n } from "@/lib/dictionaries";

// Archivo (variable, eje de ancho 62–125) para todo el sitio · JetBrains Mono para etiquetas
// Michroma: palabra gigante del Hero y títulos grandes de sección
const michroma = Michroma({ variable: "--font-michroma", subsets: ["latin"], weight: "400" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/** Español en «/» e inglés en «/en», ambas páginas estáticas. */
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { lang, t } = await getI18n();
  const url = langHome(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.titleDefault, template: `%s · ${profile.name}` },
    description: t.meta.description,
    applicationName: t.meta.applicationName,
    authors: [{ name: profile.name }],
    creator: profile.name,
    keywords: t.meta.keywords,
    alternates: { canonical: url, languages: { es: "/", en: "/en", "x-default": "/" } },
    openGraph: {
      type: "website",
      locale: t.meta.locale,
      alternateLocale: [getDict(lang === "es" ? "en" : "es").meta.locale],
      url,
      siteName: profile.name,
      title: t.meta.titleShort,
      description: t.meta.description,
    },
    twitter: { card: "summary_large_image", title: t.meta.titleShort, description: t.meta.description },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  // el script de arranque la ajusta al tema elegido
  themeColor: THEME_COLOR.dark,
  colorScheme: "dark light",
  viewportFit: "cover", // zonas seguras del iPhone (env(safe-area-inset-*))
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const { lang, t } = await getI18n();
  return (
    <html
      lang={lang}
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
          {t.common.skip}
        </a>
        <ScrollProgress />
        <Aurora />
        <I18nProvider lang={lang} t={t}>
          {/* #site: la página entera; la intro la escala hasta que coincide con la pantalla de la tablet */}
          <Providers>
            <div id="site">{children}</div>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
