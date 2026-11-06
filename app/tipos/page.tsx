import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter_Tight, JetBrains_Mono, Manrope, Syne } from "next/font/google";
import { HeroAvatar } from "@/components/ui/HeroAvatar";
import { profile } from "@/data/profile";

// RUTA TEMPORAL para elegir tipografía. Se borra al elegir (ver PASO 1 del rediseño).
export const metadata: Metadata = { title: "Tipografías", robots: { index: false, follow: false } };

const interTight = Inter_Tight({ subsets: ["latin"], weight: ["200", "300", "400", "500"], display: "swap" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], display: "swap" });
const syne = Syne({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap" });

type Version = {
  key: string;
  name: string;
  recipe: string;
  display: string;
  body: string;
  title: CSSProperties;
  line1: string;
  line2: string;
};

const versions: Version[] = [
  {
    key: "A",
    name: "Suizo",
    recipe: "Inter Tight 200 (título) · 400 (texto) · JetBrains Mono (etiquetas)",
    display: interTight.className,
    body: interTight.className,
    title: { fontWeight: 200, letterSpacing: "-0.05em" },
    line1: "jairo",
    line2: "vallejo",
  },
  {
    key: "B",
    name: "Con carácter",
    recipe: "Bricolage Grotesque 200, ancho 75 y tamaño óptico 96 (título) · 400 (texto) · JetBrains Mono",
    display: bricolage.className,
    body: bricolage.className,
    title: {
      fontWeight: 200,
      fontStretch: "75%",
      fontVariationSettings: '"wdth" 75, "opsz" 96',
      letterSpacing: "-0.035em",
    },
    line1: "jairo",
    line2: "vallejo",
  },
  {
    key: "C",
    name: "Geométrica",
    recipe: "Syne 600 (título) · Manrope 400 (texto) · JetBrains Mono (etiquetas)",
    display: syne.className,
    body: manrope.className,
    title: { fontWeight: 600, letterSpacing: "-0.045em" },
    line1: "jairo",
    line2: "vallejo",
  },
];

function VersionBlock({ v }: { v: Version }) {
  return (
    <section aria-label={`Versión ${v.key}: ${v.name}`} className="relative border-b border-[#1F1F1F] bg-[#0A0A0A] text-[#EDEDED]">
      <div className="container-x py-8 md:py-10">
        {/* Cabecera de la versión */}
        <div className={`${mono.className} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#1F1F1F] pb-4 text-xs uppercase tracking-[0.12em] text-[#8A8A8A]`}>
          <span>
            <span className="text-[#EDEDED]">{v.key} / 3</span> — {v.name}
          </span>
          <span className="normal-case tracking-normal">{v.recipe}</span>
        </div>

        {/* Título gigante DETRÁS del avatar */}
        <div className="relative mt-6 grid place-items-center">
          <div
            aria-hidden="true"
            className={`${v.display} pointer-events-none col-start-1 row-start-1 select-none text-center text-[clamp(4.5rem,14vw,14rem)] leading-[0.82]`}
            style={v.title}
          >
            <span className="block text-[#EDEDED]">{v.line1}</span>
            <span className="block text-[#2A2A2A]">{v.line2}</span>
          </div>
          <div className="z-10 col-start-1 row-start-1 w-[min(100%,330px)] [&_.hero-fade.absolute]:!hidden">
            <HeroAvatar />
          </div>
        </div>

        {/* Pie del Hero: texto, botones y cifras */}
        <div className="mt-8 grid gap-8 border-t border-[#1F1F1F] pt-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className={`${mono.className} text-xs uppercase tracking-[0.12em] text-[#8A8A8A]`}>
              01 / 09 · {profile.role}
            </p>
            <h2 className={`${v.display} mt-3 text-2xl text-[#EDEDED]`} style={{ ...v.title, fontWeight: v.key === "C" ? 600 : 300, fontStretch: "100%", fontVariationSettings: undefined }}>
              {profile.name}
            </h2>
            <p className={`${v.body} mt-3 max-w-[46ch] text-base leading-relaxed text-[#8A8A8A]`} style={{ fontWeight: 400 }}>
              {profile.tagline}
            </p>
            <div className={`${v.body} mt-6 flex flex-wrap gap-3 text-sm`}>
              <span className="rounded-[5px] bg-[#EDEDED] px-4 py-2.5 font-medium text-[#0A0A0A]">Descargar CV</span>
              <span className="rounded-[5px] border border-[#2E2E2E] px-4 py-2.5 text-[#EDEDED]">Ver proyectos</span>
            </div>
          </div>
          <div className={`${mono.className} grid grid-cols-2 items-start gap-3 md:col-span-5`}>
            {[
              { n: "3+", l: "proyectos" },
              { n: "4", l: "tecnologías principales" },
            ].map((s) => (
              <div key={s.l} className="rounded-[6px] border border-[#1F1F1F] p-4">
                <div className="text-3xl font-light text-[#EDEDED]">{s.n}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#8A8A8A]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TiposPage() {
  return (
    <main className="bg-[#0A0A0A]">
      <header className={`${mono.className} sticky top-0 z-40 border-b border-[#1F1F1F] bg-[#0A0A0A]/95 px-4 py-3 text-xs uppercase tracking-[0.12em] text-[#8A8A8A]`}>
        Elige tipografía · <span className="text-[#EDEDED]">A Suizo</span> · <span className="text-[#EDEDED]">B Con carácter</span> ·{" "}
        <span className="text-[#EDEDED]">C Geométrica</span> — pasa el mouse por el avatar y cambia de modo para ver cómo se comporta
      </header>
      {versions.map((v) => (
        <VersionBlock key={v.key} v={v} />
      ))}
    </main>
  );
}
