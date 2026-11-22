import { ArrowUp } from "lucide-react";
import { profile, sections, socials } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle, ReplayIntroButton } from "@/components/ui/FooterControls";
import { LangSwitch, ThemeSwitch } from "@/components/ui/Prefs";
import { Logo } from "@/components/ui/Logo";
import { tx } from "@/lib/i18n";
import { getI18n } from "@/lib/dictionaries";

function currentYear() {
  return new Date().getFullYear();
}

export default async function Footer() {
  const year = currentYear();
  const { lang, t } = await getI18n();
  return (
    <footer id="footer" className="footer-surface relative isolate overflow-hidden border-t border-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-3 font-display text-lg font-medium tracking-[-0.02em]">
            <Logo className="h-8 w-auto" />
            {profile.name}
          </p>
          <p className="mt-4 max-w-sm text-pretty text-muted">
            {tx(profile.tagline, lang)}
          </p>
          <a href="#inicio" className="btn btn-secondary mt-8">
            <ArrowUp aria-hidden="true" /> {t.footer.backTop}
          </a>
        </div>

        <nav aria-label={t.footer.links} className="lg:col-span-4">
          <h2 className="text-label mb-4 text-muted">{t.footer.links}</h2>
          <ul className="grid grid-cols-2 gap-x-6">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex min-h-10 items-center text-body text-ink/85 transition-colors hover:text-ink hover:underline hover:decoration-accent hover:underline-offset-4">
                  {tx(s.label, lang)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-2 lg:col-span-3">
          <h2 className="text-label mb-4 text-muted">{t.footer.social}</h2>
          <ul className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.icon}>
                <a
                  href={s.href}
                  target={s.icon === "mail" ? undefined : "_blank"}
                  rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                  className="btn btn-secondary btn-sm"
                >
                  <SocialGlyph icon={s.icon} /> {tx(s.label, lang)}
                </a>
              </li>
            ))}
          </ul>
          <h2 className="text-label mb-3 mt-8 text-muted">{t.prefs.title}</h2>
          <div className="flex flex-col items-start gap-3">
            {/* celular y tablet: con nombres · escritorio (columna angosta): compactos, como en el menú */}
            <ThemeSwitch variant="full" className="lg:hidden" />
            <LangSwitch variant="full" className="lg:hidden" />
            <div className="flex gap-1.5 max-lg:hidden">
              <ThemeSwitch variant="compact" />
              <LangSwitch variant="compact" />
            </div>
            <div className="flex flex-col">
              <ReduceEffectsToggle />
              <ReplayIntroButton />
            </div>
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-line py-6 text-small text-muted md:flex-row md:items-center md:justify-between">
        <p>
          {profile.name} · © {year}
        </p>
        <p>
          {t.footer.madeWith} <span className="text-ink">Next.js + Tailwind</span>
        </p>
      </div>

      <p
        aria-hidden="true"
        className="footer-stroke pointer-events-none select-none whitespace-nowrap text-center font-display font-medium leading-[0.8] tracking-[-0.05em] text-transparent [font-size:clamp(4rem,17vw,15rem)] translate-y-[18%]"
      >
        Jairo Vallejo
      </p>
    </footer>
  );
}
