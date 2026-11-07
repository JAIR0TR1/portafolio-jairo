import { ArrowDownToLine, ArrowRight, CalendarCheck } from "lucide-react";
import { profile, railLinks } from "@/data/profile";
import { projects } from "@/data/projects";
import { aiTools } from "@/data/skills";
import { HeroTitle } from "@/components/ui/HeroTitle";
import { HeroAvatar, type HeroVariant } from "@/components/ui/HeroAvatar";
import { HeroBlob } from "@/components/ui/HeroBlob";
import { HeroAmbient } from "@/components/ui/HeroAmbient";
import { ModeSelector } from "@/components/ui/ModeSelector";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { IntroGate } from "@/components/three/IntroGate";
import { RobotCompanion } from "@/components/ui/RobotCompanion";

/** Cifras reales: se calculan desde data/. */
const stats = [
  { value: String(projects.length), label: "Proyectos" },
  { value: `Desde ${profile.codingSince}`, label: "Programando" },
  { value: "1", label: "Emprendimiento" },
  { value: String(aiTools.length), label: "IAs en mi flujo" },
];

/** Escena: palabra gigante (atrás) + personaje con su órbita (adelante). */
function Scene({ variant }: { variant: HeroVariant }) {
  return (
    <>
      <div className="hero-in absolute inset-x-0 top-[36%] z-0 -translate-y-1/2" style={{ ["--i" as string]: 1 }}>
        {/* la palabra se mueve un poco en sentido contrario al personaje (profundidad) */}
        <div className="hero-word-parallax">
          <HeroTitle />
        </div>
      </div>
      <div className="hero-in absolute inset-0 z-10 flex items-end justify-center md:items-stretch" style={{ ["--i" as string]: 2 }}>
        <HeroAvatar variant={variant} />
      </div>
    </>
  );
}

/**
 * Hero en dos capas:
 *  (A) ESCENA — palabra, personaje y órbita. Aquí vive la mancha líquida: la copia revelada
 *      (solo visual, aria-hidden, inert, sin enlaces ni botones) está DENTRO del escenario,
 *      así que nunca puede cubrir la interfaz.
 *  (B) INTERFAZ — textos y controles, por encima del escenario, siempre interactivos.
 * En celular el orden es: escena → chips de modo y pausa → saludo, nombre, rol, frase →
 * botones a ancho completo → cifras.
 */
export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="hero-s relative -mt-[var(--header-h)] overflow-hidden px-2 pb-3 pt-2 md:px-4 md:pb-6 md:pt-3">
      <IntroGate />
      <RobotCompanion />
      {/* Luz ambiental: el personaje ampliado y desenfocado detrás de la tarjeta */}
      <HeroAmbient />

      <div className="hero-card relative overflow-hidden rounded-[22px] border border-line [contain:layout_paint] md:rounded-[28px]">
        <div data-hero-layer className="hero-surface relative isolate">
          {/* Riel vertical izquierdo: redes (escritorio ancho) */}
          <div className="absolute left-6 top-[calc(var(--header-h)+2rem)] z-20 hidden flex-col items-center gap-3 xl:flex">
            {railLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.icon === "mail" ? undefined : "_blank"}
                rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                aria-label={s.icon === "mail" ? `Escribir a ${s.handle}` : `${s.label} (abre en otra pestaña)`}
                className="grid size-11 place-items-center rounded-[12px] border border-line-2 text-muted transition-colors hover:border-accent/60 hover:text-ink"
              >
                <SocialGlyph icon={s.icon} className="size-4" />
              </a>
            ))}
          </div>

          <div className="container-x relative pb-8 pt-[calc(var(--header-h)+0.25rem)]">
            {/* Fila de ficha */}
            <div className="hero-in flex items-center gap-4 border-b border-line pb-3 text-label text-muted" style={{ ["--i" as string]: 0 }}>
              <span>
                <span className="text-accent">01</span> / Inicio — Disponible<span className="hidden sm:inline"> para proyectos</span>
              </span>
            </div>

            {/* (A) Escena: aquí y solo aquí vive la mancha líquida */}
            <div data-hero-stage className="relative isolate mt-4 h-[var(--sh)]">
              <Scene variant="base" />
              <div
                data-hero-revealed
                aria-hidden="true"
                inert
                className="theme-grad hero-surface hero-revealed pointer-events-none absolute inset-0 z-[15] select-none [&_*]:pointer-events-none"
              >
                <Scene variant="revealed" />
              </div>
              <HeroBlob />
            </div>

            {/* (B) Interfaz: por encima de la escena (z-30), siempre interactiva */}
            <div
              className="hero-in relative z-30 mt-6 flex flex-col gap-3 lg:-mt-[calc(var(--sh)*0.3)] lg:grid lg:grid-cols-[1fr_calc(var(--sh)*0.4+2rem)_1fr] lg:items-end lg:gap-8"
              style={{ ["--i" as string]: 3 }}
            >
              <div className="max-lg:contents">
                <p className="text-label text-muted max-lg:order-2 max-lg:mt-5">Hola, soy {profile.shortName}</p>
                <h1 id="hero-title" className="text-display text-[clamp(1.15rem,0.9rem+0.9vw,1.6rem)] leading-[1.15] max-lg:order-3 lg:mt-3">
                  {profile.name}
                </h1>
                <p className="max-w-[44ch] text-pretty text-body text-muted max-lg:order-4 lg:mt-2">{profile.heroRole}</p>
                <div className="grid gap-2 max-lg:order-6 max-lg:mt-3 sm:flex sm:flex-wrap lg:mt-5">
                  <a href="/cv.pdf" download className="btn btn-primary">
                    Descargar CV <ArrowDownToLine aria-hidden="true" />
                  </a>
                  <a href="#trabaja-conmigo" className="btn btn-secondary">
                    Agendar trabajo <CalendarCheck aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div aria-hidden="true" className="hidden lg:block" />

              <div className="max-lg:contents lg:flex lg:flex-col lg:items-end lg:gap-3 lg:text-right">
                {/* chips de modo + pausa: en celular, justo debajo del avatar */}
                <div className="max-lg:order-1">
                  <ModeSelector />
                </div>
                <p className="max-w-[34ch] text-pretty text-body font-medium text-ink max-lg:order-5">{profile.tagline}</p>
                <a href="#proyectos" className="btn btn-secondary w-full max-lg:order-7 sm:w-fit">
                  Ver proyectos <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Barra de cifras */}
            <dl className="hero-in relative z-30 mt-8 grid grid-cols-2 rounded-[20px] border border-line md:grid-cols-4" style={{ ["--i" as string]: 4 }}>
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-4 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-xl leading-none text-ink md:text-2xl">{s.value}</dd>
                  <dd className="text-label text-muted">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
