"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, sections, socials, type SectionId } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle } from "@/components/ui/FooterControls";
import { EASE, useMediaQuery } from "@/lib/effects";
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
        "grid size-9 place-items-center rounded-full bg-[image:var(--grad-soft)] font-mono text-[13px] font-semibold tracking-tight text-[#0b1030]",
        className,
      )}
    >
      {profile.initials}
    </span>
  );
}

/** Enlace del menú: píldora con el degradado que se desliza (layoutId) + subrayado al hover. */
function NavLink({ id, label, active, className, onClick }: { id: string; label: string; active: boolean; className?: string; onClick?: () => void }) {
  return (
    <a
      href={`#${id}`}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "nav-link relative flex min-h-10 items-center whitespace-nowrap rounded-full px-3 text-[13.5px] font-medium transition-colors",
        active ? "text-[#0b1030]" : "text-muted hover:text-ink",
        className,
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          transition={{ type: "spring", stiffness: 420, damping: 36 }}
          className="absolute inset-0 -z-10 rounded-full bg-[image:var(--grad-soft)]"
        />
      )}
      <span className="nav-label relative">{label}</span>
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
      <header className="pointer-events-none sticky top-0 z-50 flex h-[var(--header-h)] items-center">
        <div className="container-x flex justify-center">
          <nav
            aria-label="Principal"
            className="nav-capsule pointer-events-auto flex w-full items-center justify-between gap-2 rounded-full p-1.5 lg:w-auto"
          >
            <a href="#inicio" className="flex min-h-10 items-center gap-2.5 rounded-full pl-0.5 pr-3" aria-label={`${profile.name}, ir al inicio`}>
              <Monogram />
              <span className="text-[15px] font-semibold tracking-tight">Jairo</span>
            </a>

            <ul className="isolate hidden items-center lg:flex">
              {(wide ? sections : primary).map((s) => (
                <li key={s.id}>
                  <NavLink id={s.id} label={s.label} active={active === s.id} />
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
                    className={cn(
                      "nav-link relative flex min-h-10 items-center gap-1 rounded-full px-3 text-[13.5px] font-medium transition-colors",
                      moreActive ? "text-[#0b1030]" : "text-muted hover:text-ink",
                    )}
                  >
                    {moreActive && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        className="absolute inset-0 -z-10 rounded-full bg-[image:var(--grad-soft)]"
                      />
                    )}
                    <span className="nav-label relative">{moreActive ? secondary.find((s) => s.id === active)?.label : "Más"}</span>
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
                                "flex min-h-10 items-center rounded-[10px] px-3 text-[14px] transition-colors",
                                active === s.id ? "bg-[image:var(--grad-soft)] font-medium text-[#0b1030]" : "text-muted hover:bg-white/[.06] hover:text-ink",
                              )}
                            >
                              {s.label}
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

            <div className="flex items-center gap-1.5">
              <a href="/cv.pdf" download className="btn btn-primary btn-sm rounded-full">
                CV <ArrowDownToLine aria-hidden="true" />
              </a>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-expanded={open}
                aria-controls="menu-movil"
                aria-label="Abrir menú"
                className="grid size-10 place-items-center rounded-full border border-line-2 lg:hidden"
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
            aria-label="Menú"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="menu-sheet fixed inset-0 z-[80] flex flex-col overflow-y-auto lg:hidden"
          >
            <div className="container-x relative flex h-[var(--header-h)] items-center justify-between">
              <span className="flex items-center gap-2.5 font-semibold">
                <Monogram /> Menú
              </span>
              <button
                type="button"
                onClick={() => close(true)}
                aria-label="Cerrar menú"
                className="grid size-11 place-items-center rounded-full border border-line-2"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <nav aria-label="Menú móvil" className="container-x relative flex-1 pt-4">
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
                      <span className={active === s.id ? "grad-text" : "text-ink/80"}>{s.label}</span>
                      <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="container-x relative pt-6">
              <ReduceEffectsToggle />
            </div>
            <div className="container-x relative flex flex-wrap items-center gap-2 pb-8 pt-2">
              <a href="/cv.pdf" download className="btn btn-primary">
                Descargar CV <ArrowDownToLine aria-hidden="true" />
              </a>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.icon === "mail" ? undefined : "_blank"}
                  rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                  className="btn btn-secondary"
                >
                  <SocialGlyph icon={s.icon} /> {s.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
