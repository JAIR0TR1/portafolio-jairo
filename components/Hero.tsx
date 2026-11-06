import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { HeroStage } from "@/components/ui/HeroStage";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { HeroAvatar } from "@/components/ui/HeroAvatar";
import { ModeSelector, NotesList } from "@/components/ui/ModeSelector";
import { IntroGate } from "@/components/three/IntroGate";

// TODO(Jairo): confirmar las cifras
const stats = [
  { value: String(projects.length), label: "proyectos" },
  { value: "4", label: "tecnologías principales" },
];

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative -mt-[var(--header-h)]">
      <IntroGate />
      <HeroStage
        meta={
          <div
            className="hero-in flex items-center justify-between gap-4 border-b border-line pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted"
            style={{ ["--i" as string]: 0 }}
          >
            <span>
              <span className="text-ink">01</span> / 07 — Disponible<span className="hidden sm:inline"> para proyectos</span>
            </span>
            <span className="hidden md:inline">Mueve el mouse · toca el avatar</span>
            <span className="md:hidden">Toca el avatar</span>
          </div>
        }
        title={
          <div className="hero-in" style={{ ["--i" as string]: 1 }}>
            <HeroTitle />
          </div>
        }
        avatar={
          <div className="hero-in" style={{ ["--i" as string]: 2 }}>
            <HeroAvatar />
          </div>
        }
        notes={<NotesList className="mt-4 lg:hidden" />}
        bottom={
          <div
            className="hero-in mt-6 grid gap-6 border-t border-line pt-5 lg:grid-cols-12 lg:items-end"
            style={{ ["--i" as string]: 3 }}
          >
            <div className="lg:col-span-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Hola, soy {profile.brand}</p>
              <h1 id="hero-title" className="text-display mt-2 text-[clamp(1.6rem,1.1rem+1.2vw,2.1rem)]">
                {profile.name}
              </h1>
              <p className="mt-2 max-w-[42ch] text-pretty text-[15px] leading-relaxed text-muted">
                {profile.role}. {profile.tagline}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5">
              <ModeSelector />
              <div className="flex flex-wrap gap-3">
                <a href="/cv.pdf" download className="btn btn-primary">
                  Descargar CV <ArrowDownToLine aria-hidden="true" />
                </a>
                <a href="#proyectos" className="btn btn-secondary">
                  Ver proyectos <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 lg:col-span-3">
              {stats.map((s) => (
                <div key={s.label} className="rounded-[6px] border border-line p-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-3xl font-medium leading-none text-ink">{s.value}</dd>
                  <dd className="mt-2 font-mono text-[10.5px] uppercase leading-snug tracking-[0.12em] text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />
    </section>
  );
}
