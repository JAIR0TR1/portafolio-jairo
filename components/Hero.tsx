import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { profile, socials } from "@/data/profile";
import { projects } from "@/data/projects";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { HeroAvatar } from "@/components/ui/HeroAvatar";
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

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-s relative -mt-[var(--header-h)] overflow-hidden">
      <IntroGate />
      <RobotCompanion />

      {/* Riel vertical izquierdo: redes + indicador de scroll (escritorio ancho) */}
      <div className="absolute bottom-10 left-6 top-[calc(var(--header-h)+2rem)] z-20 hidden flex-col items-center gap-4 xl:flex">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target={s.icon === "mail" ? undefined : "_blank"}
            rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
            aria-label={s.icon === "mail" ? `Escribir a ${s.handle}` : `${s.label} (abre en otra pestaña)`}
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

      <div className="container-x relative pb-8 pt-[calc(var(--header-h)+0.75rem)]">
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

        {/* Escenario: palabra gigante ATRÁS, personaje ADELANTE */}
        <div className="relative mt-4 h-[var(--sh)]">
          <div className="hero-in absolute inset-x-0 top-[36%] -translate-y-1/2" style={{ ["--i" as string]: 1 }}>
            <HeroTitle />
          </div>
          <div className="hero-in absolute inset-0 flex justify-center" style={{ ["--i" as string]: 2 }}>
            <HeroAvatar />
          </div>
        </div>

        <NotesList className="mt-4 lg:hidden" />

        {/* Dos columnas simétricas a los lados de las piernas */}
        <div
          className="hero-in relative z-10 mt-6 grid gap-8 lg:-mt-[calc(var(--sh)*0.3)] lg:grid-cols-[1fr_calc(var(--sh)*0.5567+3rem)_1fr] lg:items-end"
          style={{ ["--i" as string]: 3 }}
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Hola, soy {profile.brand}</p>
            <h1 id="hero-title" className="text-display mt-2 text-[clamp(1.7rem,1.2rem+1.3vw,2.4rem)]">
              {profile.name}
            </h1>
            <p className="mt-2 max-w-[38ch] text-pretty text-[15px] leading-relaxed text-muted">{profile.role} en {profile.location}.</p>
            <a href="/cv.pdf" download className="btn btn-primary mt-5">
              Descargar CV <ArrowDownToLine aria-hidden="true" />
            </a>
          </div>

          <div aria-hidden="true" className="hidden lg:block" />

          <div className="flex flex-col gap-3 lg:items-end lg:text-right">
            <ModeSelector />
            <p className="max-w-[38ch] text-pretty text-[15px] leading-relaxed text-muted">
              <ModeLine />
            </p>
            <a href="#proyectos" className="btn btn-secondary w-fit">
              Ver proyectos <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Barra de cifras */}
        <dl className="hero-in mt-8 grid grid-cols-2 rounded-[6px] border border-line md:grid-cols-4" style={{ ["--i" as string]: 4 }}>
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`flex items-baseline gap-3 px-5 py-4 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-2xl font-semibold leading-none text-ink">{s.value}</dd>
              <dd className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
