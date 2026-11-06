"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { skillCategories } from "@/data/skills";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { LogoRing } from "./LogoRing";
import { DecodeText, SectionTab } from "./SectionTab";
import { SkillMeter } from "./SkillMeter";
import { cn } from "@/lib/cn";

const n = skillCategories.length;

/** Sección fija: el título queda arriba y la tarjeta cambia de categoría con el scroll. */
function Pinned() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + scrollable * ((i + 0.5) / n), behavior: "smooth" });
  };

  const cat = skillCategories[active];

  return (
    <div ref={ref} className="relative" style={{ height: `${n * 80 + 100}vh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-10 pt-[calc(var(--header-h)+1.5rem)]">
        <div className="container-x flex min-h-0 flex-1 flex-col">
          <header className="mb-8 flex items-end justify-between gap-8">
            <div>
              <SectionTab index="07" label="Habilidades" />
              <h2 id="habilidades-title" className="text-display mt-4 text-[clamp(2.25rem,1.2rem+3.2vw,3.5rem)]">
                <DecodeText text="Mi stack, por capas." />
              </h2>
            </div>
            <p className="max-w-xs text-pretty text-muted">
              Niveles honestos: Aprendiendo, Cómodo o Fuerte. Baja para recorrer cada capa.
            </p>
          </header>

          <div className="flex min-h-0 flex-1 gap-6">
            <div className="glass relative min-h-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="grid h-full grid-cols-2 gap-8 p-8 xl:p-10"
                >
                  <div className="flex min-h-0 flex-col justify-center">
                    <p className="font-mono text-sm text-muted">
                      Capa <span className="text-ink">0{active + 1}</span> / 0{n}
                    </p>
                    <h3 className="mt-2 text-4xl font-semibold tracking-[-0.03em]">{cat.title}</h3>
                    <p className="mt-2 max-w-sm text-muted">{cat.blurb}</p>
                    <ul className="mt-8 max-w-md space-y-4">
                      {cat.skills.map((s) => (
                        <SkillMeter key={s.name} skill={s} />
                      ))}
                    </ul>
                  </div>
                  <LogoRing skills={cat.skills} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicador lateral con puntos clicables */}
            <nav aria-label="Capas de habilidades" className="flex flex-col justify-center">
              <ol className="flex flex-col gap-2">
                {skillCategories.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active ? "step" : undefined}
                      aria-label={`Ir a ${c.title}`}
                      className="group flex min-h-11 items-center gap-3"
                    >
                      <span
                        className={cn(
                          "w-1.5 rounded-full transition-all duration-500",
                          i === active ? "h-10 bg-ink" : "h-3 bg-white/20 group-hover:bg-white/40",
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-xs transition-colors",
                          i === active ? "text-ink" : "text-muted group-hover:text-ink",
                        )}
                      >
                        {c.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Escritorio con efectos → versión fija; móvil / reduced-motion → lista normal. */
export function SkillsSwitch({ list }: { list: ReactNode }) {
  const reduced = useReducedEffects();
  const desktop = useMediaQuery("(min-width: 1024px) and (min-height: 680px)");
  return desktop && !reduced ? <Pinned /> : <>{list}</>;
}
