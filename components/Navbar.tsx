"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, sections, socials, type SectionId } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle } from "@/components/ui/FooterControls";
import { LangSwitch, ThemeSwitch } from "@/components/ui/Prefs";
import { useI18n } from "@/components/ui/I18nProvider";
import { fmt, tx } from "@/lib/i18n";
import { EASE, useMediaQuery, usePlateMotion } from "@/lib/effects";
import { cn } from "@/lib/cn";

const ids = sections.map((s) => s.id);
const primary = sections.filter((s) => s.primary);
const secondary = sections.filter((s) => !s.primary);

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

function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 place-items-center rounded-full bg-[image:var(--grad-soft)] font-mono text-[13px] font-semibold tracking-tight text-[var(--btn-fg)]",
        className,
      )}
    >
      {profile.initials}
    </span>
  );
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
  const [more, setMore] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  // ≥1400 px caben los 9 enlaces; debajo, los secundarios van en «Más» (un solo dueño de la píldora)
  const wide = useMediaQuery("(min-width: 1400px)");
  const moreActive = !wide && secondary.some((s) => s.id === active);
  const plate = usePlateMotion();
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
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  // «Más»: cierra con Esc o clic fuera.
  useEffect(() => {
    if (!more) return;
    const onDown = (e: PointerEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMore(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMore(false);
        moreRef.current?.querySelector<HTMLElement>("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [more]);

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
              <Monogram />
              <span className="hidden text-[15px] font-semibold tracking-tight min-[360px]:inline">Jairo</span>
            </a>

            <ul className="isolate hidden items-center lg:flex">
              {(wide ? sections : primary).map((s) => (
                <li key={s.id}>
                  <NavLink id={s.id} label={tx(s.label, lang)} active={active === s.id} />
                </li>
              ))}
              {/* En pantallas medianas, los secundarios van en «Más» */}
              {!wide && (
              <li className="relative">
                <div ref={moreRef}>
                  <button
                    type="button"
                    aria-expanded={more}
                    aria-controls="menu-mas"
                    onClick={() => setMore((m) => !m)}
                    aria-current={moreActive ? "true" : undefined}
                    className={cn(
                      "tab flex min-h-10 items-center gap-1 px-3 text-[13.5px] font-medium transition-colors",
                      moreActive ? "text-[var(--btn-fg)]" : "text-muted hover:text-ink",
                    )}
                  >
                    {moreActive && <motion.span layoutId="nav-plate" transition={plate} className="tab-plate absolute inset-0 -z-10" />}
                    <span className="relative">{moreActive ? tx(secondary.find((s) => s.id === active)!.label, lang) : t.nav.more}</span>
                    <ChevronDown aria-hidden="true" className={cn("relative size-4 transition-transform", more && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {more && (
                      <motion.ul
                        id="menu-mas"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: EASE }}
                        className="nav-capsule nav-dropdown absolute right-0 top-[calc(100%+10px)] flex w-52 flex-col gap-1 rounded-[16px] p-1.5"
                      >
                        {secondary.map((s) => (
                          <li key={s.id}>
                            <a
                              href={`#${s.id}`}
                              onClick={() => setMore(false)}
                              aria-current={active === s.id ? "true" : undefined}
                              className={cn(
                                "tab isolate flex min-h-10 items-center justify-between gap-3 px-3 text-[14px] transition-colors",
                                active === s.id ? "font-medium text-[var(--btn-fg)]" : "text-muted hover:text-ink",
                              )}
                            >
                              {/* la placa va en una capa interna: el clip-path no recorta el anillo de foco */}
                              {active === s.id && <span aria-hidden="true" className="tab-plate absolute inset-0 -z-10" />}
                              {tx(s.label, lang)}
                              <span aria-hidden="true" className={cn("font-mono text-[10px]", active === s.id ? "opacity-70" : "text-muted")}>
                                {sectionNo(s.id)}
                              </span>
                            </a>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              </li>
              )}
            </ul>

            <div className="flex shrink-0 items-center gap-1.5">
              {/* tema e idioma: siempre a la vista en escritorio (en celular, dentro del menú) */}
              <div className="hidden items-center gap-1.5 lg:flex">
                <ThemeSwitch variant="compact" />
                <LangSwitch variant="compact" />
              </div>
              <a href="/cv.pdf" download className="btn btn-primary min-h-10 px-4" aria-label={t.common.downloadCv}>
                {t.nav.cv} <ArrowDownToLine aria-hidden="true" />
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label={t.nav.openMenu}
                className="grid size-10 place-items-center rounded-[12px] border border-line-2 bg-ink/[.06] text-ink lg:hidden"
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
            className="menu-sheet fixed inset-0 z-[80] flex flex-col overflow-y-auto lg:hidden"
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
              <ThemeSwitch variant="full" />
              <LangSwitch variant="full" />
              <ReduceEffectsToggle />
            </div>
            <div className="container-x relative flex flex-wrap items-center gap-2 pb-8 pt-2">
              <a href="/cv.pdf" download className="btn btn-primary">
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
