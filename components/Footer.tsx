import { ArrowUp } from "lucide-react";
import { profile, sections, socials } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle, ReplayIntroButton } from "@/components/ui/FooterControls";

function currentYear() {
  return new Date().getFullYear();
}

export default function Footer() {
  const year = currentYear();
  return (
    <footer id="footer" className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-80 w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_22%,transparent),transparent)]"
      />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 text-lg font-semibold tracking-[-0.02em]">
            <span className="grid size-10 place-items-center rounded-full bg-ink font-mono text-sm text-bg">{profile.initials}</span>
            {profile.name}
          </p>
          <p className="mt-4 max-w-sm text-pretty text-muted">
            {profile.role} en {profile.location}. Diseño y programo interfaces.
          </p>
          <a href="#inicio" className="btn btn-secondary mt-8">
            <ArrowUp aria-hidden="true" /> Volver arriba
          </a>
        </div>

        <nav aria-label="Enlaces rápidos" className="lg:col-span-3">
          <h2 className="text-eyebrow mb-4 text-muted">Enlaces rápidos</h2>
          <ul className="grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex min-h-11 items-center text-[15px] text-ink/85 transition-colors hover:text-accent">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-4">
          <h2 className="text-eyebrow mb-4 text-muted">Redes</h2>
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
          <h2 className="text-eyebrow mb-2 mt-8 text-muted">Preferencias</h2>
          <div className="flex flex-col">
            <ReduceEffectsToggle />
            <ReplayIntroButton />
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {profile.name}. Todos los derechos reservados.
        </p>
        <p>
          Hecho con <span className="text-ink">Next.js + Tailwind</span>
        </p>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none select-none whitespace-nowrap text-center font-semibold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/.08)] [font-size:clamp(4rem,17vw,15rem)] translate-y-[18%]"
      >
        Jairo Vallejo
      </p>
    </footer>
  );
}
