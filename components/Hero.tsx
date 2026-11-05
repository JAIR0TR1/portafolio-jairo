import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { HeroBackdrop } from "@/components/ui/HeroBackdrop";
import { HeroStage } from "@/components/ui/HeroStage";
import { JvSticker } from "@/components/ui/JvSticker";
import { HeroAvatar } from "@/components/ui/HeroAvatar";
import { ModeSubtitle } from "@/components/ui/ModeSubtitle";

export default function Hero() {
  return (
    <section id="inicio" aria-labelledby="hero-title" className="relative -mt-[var(--header-h)]">
      <HeroStage
        backdrop={<HeroBackdrop />}
        text={
          <>
            <p className="hero-in chip mb-7 border-white/10 bg-white/[.04] py-1.5 pl-2 pr-3" style={{ ["--i" as string]: 0 }}>
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative size-2 rounded-full bg-emerald-400" />
              </span>
              Disponible para proyectos
            </p>

            <h1 id="hero-title" className="flex flex-col">
              <span
                className="hero-in mb-4 text-[clamp(1.5rem,1rem+2.2vw,2.5rem)] font-medium tracking-[-0.03em] text-muted"
                style={{ ["--i" as string]: 1 }}
              >
                Hola, soy <span className="text-ink">{profile.name}</span>
              </span>
              <span
                className="hero-in text-display text-[clamp(2.25rem,1rem+4.6vw,4.6rem)] md:whitespace-nowrap"
                style={{ ["--i" as string]: 2 }}
              >
                Construyo interfaces
              </span>
              <span
                className="hero-in text-display relative w-fit pb-2 text-[clamp(2.25rem,1rem+4.6vw,4.6rem)] md:whitespace-nowrap"
                style={{ ["--i" as string]: 3 }}
              >
                <span className="fade-line">que se sienten </span>
                <span className="accent-word serif-accent">vivas.</span>
                <JvSticker className="absolute left-full top-1/2 ml-4 hidden -translate-y-1/2 md:grid" />
              </span>
            </h1>

            <p className="hero-in mt-6 font-mono text-sm text-ink/90" style={{ ["--i" as string]: 4 }}>
              {profile.role} <span className="text-accent">·</span> <ModeSubtitle />
            </p>
            <p className="hero-in mt-3 max-w-[46ch] text-pretty text-lg text-muted" style={{ ["--i" as string]: 5 }}>
              {profile.tagline}
            </p>

            <div className="hero-in mt-9 flex flex-wrap items-center gap-3" style={{ ["--i" as string]: 6 }}>
              <a href="/cv.pdf" download className="btn btn-primary">
                Descargar CV <ArrowDownToLine aria-hidden="true" />
              </a>
              <a href="#proyectos" className="btn btn-secondary">
                Ver proyectos <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </>
        }
        visual={
          <div className="hero-in w-full" style={{ ["--i" as string]: 2 }}>
            <HeroAvatar />
          </div>
        }
        hint={
          <a
            href="#sobre-mi"
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-eyebrow text-muted transition-colors hover:text-ink md:flex"
          >
            <span className="relative h-9 w-5 rounded-full border border-white/25">
              <span className="absolute left-1/2 top-1.5 h-2 w-0.5 -translate-x-1/2 animate-bounce rounded-full bg-accent" />
            </span>
            Desliza
          </a>
        }
      />
    </section>
  );
}
