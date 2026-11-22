"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, sections, socials, type SectionId } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle } from "@/components/ui/FooterControls";
import { LangSwitch, ThemeSwitch } from "@/components/ui/Prefs";
import { Logo } from "@/components/ui/Logo";
import { useI18n } from "@/components/ui/I18nProvider";
import { fmt, tx } from "@/lib/i18n";
import { EASE, usePlateMotion } from "@/lib/effects";
import { cn } from "@/lib/cn";

const ids = sections.map((s) => s.id);

/** Sección activa = la última cuyo borde superior pasó el 40 % de la ventana. */
function useScrollSpy() {
  const [active, setActive] = useState<SectionId>("inicio");
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current: SectionId = "inicio";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // al final de la página, la última sección
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = ids[ids.length - 1];
      setActive((p) => (p === current ? p : current));
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

/** Logotipo J+V (variante «mark»): decorativo, el enlace lleva el nombre accesible. */
function Monogram({ className, animated }: { className?: string; animated?: boolean }) {
  return <Logo animated={animated} className={cn("h-7 w-auto", className)} />;
}

/** Número de sección «01…09» (orden de la página). */
const sectionNo = (id: string) => String(ids.indexOf(id as SectionId) + 1).padStart(2, "0");

/** Pestaña del menú: placa de esquinas cortadas que se desliza (layoutId) + esquinas [ ] al hover. */
function NavLink({ id, label, active, className, onClick }: { id: string; label: string; active: boolean; className?: string; onClick?: () => void }) {
  const plate = usePlateMotion();
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "tab flex min-h-10 items-center whitespace-nowrap pl-3 pr-4 text-[13.5px] font-medium transition-colors",
        active ? "text-[var(--btn-fg)]" : "text-muted hover:text-ink",
        className,
      )}
    >
      {active && <motion.span layoutId="nav-plate" transition={plate} className="tab-plate absolute inset-0 -z-10" />}
      <span className="relative">{label}</span>
      <span aria-hidden="true" className="tab-idx">
        {sectionNo(id)}
      </span>
    </a>
  );
}

export default function Navbar() {
  const active = useScrollSpy();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { lang, t } = useI18n();

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // Menú móvil: bloquea el scroll, Esc cierra y el foco queda atrapado dentro.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    sheetRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;
      const f = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"));
      if (!f.length) return;
      const [a, z] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        z.focus();
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault();
        a.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Si se agranda la ventana con la hoja abierta, se cierra sola.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1400px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);


  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 flex h-[calc(var(--header-h)+env(safe-area-inset-top))] items-center pt-[env(safe-area-inset-top)]">
        {/* más ancho que el contenido: caben las 9 pestañas y los selectores de tema e idioma */}
        <div className="container-x flex justify-center xl:max-w-[1440px]!">
          <nav
            aria-label={t.nav.label}
            className="nav-capsule pointer-events-auto flex w-full min-w-0 items-center justify-between gap-2 rounded-[16px] p-1.5 lg:w-auto"
          >
            <a href="#inicio" className="flex min-h-10 min-w-0 items-center gap-2.5 rounded-full pl-0.5 pr-2" aria-label={fmt(t.nav.home, { name: profile.name })}>
              <Monogram animated />
              <span className="hidden text-[15px] font-semibold tracking-tight min-[360px]:inline">Jairo</span>
            </a>

            <ul className="isolate hidden items-center lg:flex">
              {/* ≥ 1400 px: todas las secciones en línea. 1024–1399 px: las principales en línea y el resto en el
                  botón de menú (la misma hoja del celular). Lo decide CSS: sin saltos de ancho al hidratar (CLS). */}
              {sections.map((s) => (
                <li key={s.id} className={s.primary ? undefined : "hidden min-[1400px]:block"}>
                  <NavLink id={s.id} label={tx(s.label, lang)} active={active === s.id} />
                </li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-1.5">
              {/* tema e idioma: siempre a la vista en escritorio (en celular, dentro del menú) */}
              <div className="hidden items-center gap-1.5 lg:flex">
                <ThemeSwitch variant="compact" />
                <LangSwitch variant="compact" />
              </div>
              <a href={profile.cv.href} download={profile.cv.fileName} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-10 px-4" aria-label={t.common.downloadCv}>
                {t.nav.cv} <ArrowDownToLine aria-hidden="true" />
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label={t.nav.openMenu}
                className="grid size-10 place-items-center rounded-[12px] border border-line-2 bg-ink/[.06] text-ink min-[1400px]:hidden"
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={sheetRef}
            id="menu-movil"
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.menu}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="menu-sheet fixed inset-0 z-[80] flex flex-col overflow-y-auto min-[1400px]:hidden"
          >
            <div className="container-x relative flex h-[var(--header-h)] items-center justify-between">
              <span className="flex items-center gap-2.5 font-semibold">
                <Monogram /> {t.nav.menu}
              </span>
              <button
                type="button"
                onClick={() => close(true)}
                aria-label={t.nav.closeMenu}
                className="grid size-11 place-items-center rounded-[12px] border border-line-2"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <nav aria-label={t.nav.mobileNav} className="container-x relative flex-1 pt-4">
              <ul className="flex flex-col">
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 + i * 0.04, duration: 0.45, ease: EASE }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={() => close(false)}
                      aria-current={active === s.id ? "true" : undefined}
                      className="flex min-h-14 items-center justify-between py-2 text-[clamp(1.4rem,6.5vw,2.1rem)] font-semibold tracking-[-0.03em]"
                    >
                      <span className={active === s.id ? "text-ink" : "text-ink/80"}>{tx(s.label, lang)}</span>
                      <span
                        className={cn(
                          "font-mono text-xs",
                          active === s.id ? "tab-plate px-2.5 py-1.5 font-semibold text-[var(--btn-fg)]" : "px-2.5 text-muted",
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="container-x relative flex flex-col items-start gap-3 pt-6">
              <p className="text-label text-muted">{t.prefs.title}</p>
              {/* celular y tablet: aquí · escritorio: ya están en el encabezado */}
              <ThemeSwitch variant="full" className="lg:hidden" />
              <LangSwitch variant="full" className="lg:hidden" />
              <ReduceEffectsToggle />
            </div>
            <div className="container-x relative flex flex-wrap items-center gap-2 pb-8 pt-2">
              <a href={profile.cv.href} download={profile.cv.fileName} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                {t.common.downloadCv} <ArrowDownToLine aria-hidden="true" />
              </a>
              {socials.map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  target={s.icon === "mail" ? undefined : "_blank"}
                  rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                  className="btn btn-secondary"
                >
                  <SocialGlyph icon={s.icon} /> {tx(s.label, lang)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
