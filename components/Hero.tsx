import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { profile, socials } from "@/data/profile";
import { projects } from "@/data/projects";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { HeroAvatar } from "@/components/ui/HeroAvatar";
import { HeroBlob } from "@/components/ui/HeroBlob";
import { HeroAmbient } from "@/components/ui/HeroAmbient";
import { ModeLine } from "@/components/ui/HeroBits";
import { ModeSelector, NotesList } from "@/components/ui/ModeSelector";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { IntroGate } from "@/components/three/IntroGate";
import { RobotCompanion } from "@/components/ui/RobotCompanion";

// TODO(Jairo): confirmar las cifras
const stats = [
  { value: String(projects.length), label: "Proyectos" },
  { value: "4", label: "Plataformas" },
  { value: "1", label: "Emprendimiento" },
  { value: "3", label: "IAs en mi flujo" },
];

/**
 * Contenido completo del Hero. Se pinta DOS veces, alineado al píxel:
 *  - base (oscura, interactiva, con los ids reales);
 *  - revelada (clara e invertida, dentro de la mancha líquida): sin ids ni h1, aria-hidden e inert.
 */
function HeroContent({ revealed = false }: { revealed?: boolean }) {
  const Title = revealed ? "p" : "h1";
  return (
    <>
      {/* Riel vertical izquierdo: redes + indicador de scroll (escritorio ancho) */}
      <div className="absolute bottom-10 left-6 top-[calc(var(--header-h)+2rem)] z-20 hidden flex-col items-center gap-4 xl:flex">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.icon === "mail" ? undefined : "_blank"}
            rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
            aria-label={s.icon === "mail" ? `Escribir a ${s.handle}` : `${s.label} (abre en otra pestaña)`}
            tabIndex={revealed ? -1 : undefined}
            className="grid size-9 place-items-center rounded-[6px] border border-line-2 text-muted transition-colors hover:border-[#4a4a4a] hover:text-ink"
          >
            <SocialGlyph icon={s.icon} className="size-4" />
          </a>
        ))}
        <span aria-hidden="true" className="relative mt-2 w-px flex-1 overflow-hidden bg-line-2">
          <span className="rail-dot absolute left-0 top-0 h-8 w-px bg-ink" />
        </span>
        <span aria-hidden="true" className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted [writing-mode:vertical-rl]">
          Scroll
        </span>
      </div>

      <div className="container-x relative pb-8 pt-[calc(var(--header-h)+0.25rem)]">
        {/* Fila de ficha */}
        <div
          className="hero-in flex items-center justify-between gap-4 border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
          style={{ ["--i" as string]: 0 }}
        >
          <span>
            <span className="text-ink">01</span> / Inicio — Disponible<span className="hidden sm:inline"> para proyectos</span>
          </span>
          <span className="hidden md:inline">Mueve el mouse · toca la cabeza para saludar</span>
          <span className="md:hidden">Toca para saludar</span>
        </div>

        {/* Escenario. Capas fijas: palabra gigante (z-0) → personaje (z-10) → anotaciones → UI (z-30) */}
        <div className="relative isolate mt-4 h-[var(--sh)]">
          <div className="hero-in absolute inset-x-0 top-[36%] z-0 -translate-y-1/2" style={{ ["--i" as string]: 1 }}>
            {/* la palabra se mueve un poco en sentido contrario al personaje (profundidad) */}
            <div className="hero-word-parallax">
              <HeroTitle />
            </div>
          </div>
          <div className="hero-in absolute inset-0 z-10 flex justify-center" style={{ ["--i" as string]: 2 }}>
            <HeroAvatar variant={revealed ? "revealed" : "base"} />
          </div>
        </div>

        <NotesList className="mt-8 lg:hidden" />

        {/* Dos columnas simétricas a los lados de las piernas */}
        <div
          className="hero-in relative z-30 mt-6 grid gap-8 lg:-mt-[calc(var(--sh)*0.3)] lg:grid-cols-[1fr_calc(var(--sh)*0.4+2rem)_1fr] lg:items-end"
          style={{ ["--i" as string]: 3 }}
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Hola, soy {profile.shortName}</p>
            <Title id={revealed ? undefined : "hero-title"} className="text-display mt-3 text-[clamp(1.15rem,0.9rem+0.9vw,1.6rem)] leading-[1.15]">
              {profile.name}
            </Title>
            <p className="mt-2 max-w-[38ch] text-pretty text-[15px] leading-relaxed text-muted">{profile.role} en {profile.location}.</p>
            <a href="/cv.pdf" download tabIndex={revealed ? -1 : undefined} className="btn btn-primary mt-5">
              Descargar CV <ArrowDownToLine aria-hidden="true" />
            </a>
          </div>

          <div aria-hidden="true" className="hidden lg:block" />

          <div className="flex flex-col gap-3 lg:items-end lg:text-right">
            <ModeSelector />
            <p className="max-w-[38ch] text-pretty text-[15px] leading-relaxed text-muted">
              <ModeLine />
            </p>
            <a href="#proyectos" tabIndex={revealed ? -1 : undefined} className="btn btn-secondary w-fit">
              Ver proyectos <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Barra de cifras */}
        <dl className="hero-in relative z-30 mt-8 grid grid-cols-2 rounded-[6px] border border-line md:grid-cols-4" style={{ ["--i" as string]: 4 }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-baseline gap-3 px-5 py-4 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-mono text-2xl leading-none text-ink">{s.value}</dd>
              <dd className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-s relative -mt-[var(--header-h)] overflow-hidden px-2 pb-3 pt-2 md:px-4 md:pb-6 md:pt-3">
      <IntroGate />
      <RobotCompanion />
      {/* Luz ambiental: el personaje ampliado y desenfocado detrás de la tarjeta */}
      <HeroAmbient />

      {/* Tarjeta: capa oscura (base) + capa clara recortada por la mancha líquida */}
      <div className="hero-card relative overflow-hidden rounded-[22px] border border-white/[0.08] md:rounded-[28px]">
        {/* isolate: sus z-20/z-30 quedan dentro de esta capa y la revelada (encima) los cubre */}
        <div data-hero-layer className="hero-surface relative isolate">
          <HeroContent />
        </div>
        <div
          data-hero-layer
          data-hero-revealed
          aria-hidden="true"
          inert
          className="theme-light hero-surface hero-revealed pointer-events-none absolute inset-0 select-none"
        >
          <HeroContent revealed />
        </div>
        <HeroBlob />
      </div>
    </section>
  );
}
