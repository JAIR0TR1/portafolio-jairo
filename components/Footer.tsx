import { ArrowUp } from "lucide-react";
import { profile, sections, socials } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle, ReplayIntroButton } from "@/components/ui/FooterControls";
import { PauseButton } from "@/components/ui/PauseButton";

function currentYear() {
  return new Date().getFullYear();
}

export default function Footer() {
  const year = currentYear();
  return (
    <footer id="footer" className="relative isolate overflow-hidden border-t border-line bg-[linear-gradient(180deg,transparent,rgb(8_12_38/.85))]">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 font-display text-lg font-medium tracking-[-0.02em]">
            <span className="grid size-10 place-items-center rounded-full bg-[image:var(--grad-soft)] font-mono text-small font-semibold text-white">{profile.initials}</span>
            {profile.name}
          </p>
          <p className="mt-4 max-w-sm text-pretty text-muted">
            {profile.tagline}
          </p>
          <a href="#inicio" className="btn btn-secondary mt-8">
            <ArrowUp aria-hidden="true" /> Volver arriba
          </a>
        </div>

        <nav aria-label="Enlaces rápidos" className="lg:col-span-4">
          <h2 className="text-label mb-4 text-muted">Enlaces rápidos</h2>
          <ul className="grid grid-cols-2 gap-x-6">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex min-h-10 items-center text-body text-ink/85 transition-colors hover:text-ink hover:underline hover:decoration-accent hover:underline-offset-4">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-label mb-4 text-muted">Redes</h2>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.icon === "mail" ? undefined : "_blank"}
                  rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                  className="btn btn-secondary btn-sm"
                >
                  <SocialGlyph icon={s.icon} /> {s.label}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="text-label mb-2 mt-8 text-muted">Preferencias</h2>
          <div className="flex flex-col">
            <ReduceEffectsToggle />
            <PauseButton withLabel className="mt-1 w-fit" />
            <ReplayIntroButton />
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-small text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name} · © {year}
        </p>
        <p>
          Hecho con <span className="text-ink">Next.js + Tailwind</span>
        </p>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-display font-medium leading-[0.8] tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgb(180_190_255/.12)] [font-size:clamp(4rem,17vw,15rem)] translate-y-[18%]"
      >
        Jairo Vallejo
      </p>
    </footer>
  );
}
