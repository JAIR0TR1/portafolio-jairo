"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile, sections, socials, type SectionId } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ReduceEffectsToggle } from "@/components/ui/FooterControls";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";

function useScrollSpy(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-9 place-items-center rounded-[6px] bg-ink font-mono text-[13px] font-semibold tracking-tight text-bg",
        className,
      )}
    >
      {profile.initials}
    </span>
  );
}

const ids = sections.map((s) => s.id);

export default function Navbar() {
  const active = useScrollSpy(ids) as SectionId;
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => toggleRef.current?.focus());
  }, []);

  // Bloquea el scroll, Esc cierra y foco atrapado dentro de la hoja móvil.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const first = sheetRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();

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

  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 flex h-[var(--header-h)] items-center">
        <div className="container-x flex justify-center">
          {/* Marco de "selección de Figma" */}
          <div className="figma-frame group/nav pointer-events-auto relative w-full lg:w-auto">
            <span
              aria-hidden="true"
              className="absolute -inset-[7px] hidden rounded-[6px] border border-dashed border-line-2 lg:block"
            >
              {["-left-[4px] -top-[4px]", "-right-[4px] -top-[4px]", "-left-[4px] -bottom-[4px]", "-right-[4px] -bottom-[4px]"].map(
                (pos) => (
                  <span key={pos} className={cn("absolute size-[7px] border border-[#4a4a4a] bg-bg", pos)} />
                ),
              )}
              <span className="absolute -bottom-[19px] left-1/2 -translate-x-1/2 rounded-[3px] bg-line-2 opacity-0 transition-opacity group-hover/nav:opacity-100 px-1.5 py-px font-mono text-[9.5px] leading-[14px] tracking-wider text-ink">
                Hug × 56
              </span>
            </span>

            <nav
              aria-label="Principal"
              className="flex items-center justify-between gap-2 rounded-[8px] border border-line bg-bg/95 p-1.5"
            >
              <a
                href="#inicio"
                className="flex min-h-11 items-center gap-2.5 rounded-[6px] pl-1 pr-3 font-medium tracking-tight"
                aria-label={`${profile.name}, ir al inicio`}
              >
                <Monogram />
                <span className="font-display text-[15px] font-medium">Jairo</span>
              </a>

              <ul className="hidden items-center lg:flex">
                {sections.map((s) => {
                  const isActive = active === s.id;
                  return (
                    <li key={s.id} className="relative">
                      <a
                        href={`#${s.id}`}
                        aria-current={isActive ? "true" : undefined}
                        className={cn(
                          "relative z-10 flex min-h-11 items-center rounded-[6px] px-3.5 text-[14px] transition-colors",
                          isActive ? "text-ink" : "text-muted hover:text-ink",
                        )}
                      >
                        {s.label}
                      </a>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                          className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-accent"
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-1.5">
                <a href="/cv.pdf" download className="btn btn-primary btn-sm">
                  CV <ArrowDownToLine aria-hidden="true" />
                </a>
                <button
                  ref={toggleRef}
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-expanded={open}
                  aria-controls="menu-movil"
                  aria-label="Abrir menú"
                  className="grid size-11 place-items-center rounded-[6px] border border-line-2 lg:hidden"
                >
                  <Menu aria-hidden="true" className="size-5" />
                </button>
              </div>
            </nav>
          </div>
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
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-bg lg:hidden"
          >
            <div className="container-x relative flex h-[var(--header-h)] items-center justify-between">
              <span className="flex items-center gap-2.5 font-medium">
                <Monogram /> Menú
              </span>
              <button
                type="button"
                onClick={() => close(true)}
                aria-label="Cerrar menú"
                className="grid size-11 place-items-center rounded-[6px] border border-line-2"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <nav aria-label="Menú móvil" className="container-x relative flex-1 pt-6">
              <ul className="flex flex-col">
                {sections.map((s, i) => (
                  <motion.li
                    key={s.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: EASE }}
                    className="border-b border-line"
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={() => close(false)}
                      aria-current={active === s.id ? "true" : undefined}
                      className="group flex min-h-16 items-center justify-between py-3 font-display text-[clamp(1.75rem,8vw,2.5rem)] font-medium tracking-[-0.035em]"
                    >
                      <span className={active === s.id ? "text-ink" : "text-ink/75"}>{s.label}</span>
                      <span className="font-mono text-xs text-muted">0{i + 1}</span>
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
