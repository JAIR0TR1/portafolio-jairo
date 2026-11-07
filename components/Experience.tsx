"use client";

import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Briefcase, GraduationCap } from "lucide-react";
import { useRef, useState } from "react";
import { sortedExperience, type Item } from "@/data/experience";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EASE, useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

type Filter = "todo" | Item["type"];
const options: { id: Filter; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "academica", label: "Académica" },
  { id: "laboral", label: "Laboral" },
];

export default function Experience() {
  const [filter, setFilter] = useState<Filter>("todo");
  const reduced = useReducedEffects();
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const items = filter === "todo" ? sortedExperience : sortedExperience.filter((i) => i.type === filter);

  return (
    <section id="experiencia" aria-labelledby="experiencia-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="experiencia-title"
          index={sectionIndex("experiencia")}
          eyebrow="Experiencia"
          title={
            <>
              Lo que he aprendido y hecho.
            </>
          }
          description="Formación académica y emprendimiento, de lo más reciente a lo más antiguo."
        />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <div
                role="radiogroup"
                aria-label="Tipo de experiencia"
                className="inline-flex rounded-full border border-line p-1"
              >
                {options.map((o) => {
                  const on = filter === o.id;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setFilter(o.id)}
                      className={cn(
                        "relative min-h-11 rounded-full px-4 text-sm transition-colors",
                        on ? "font-medium text-[#0b1030]" : "text-muted hover:text-ink",
                      )}
                    >
                      {on && (
                        <motion.span
                          layoutId="exp-seg"
                          className="absolute inset-0 rounded-full bg-[image:var(--grad-soft)]"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span className="relative">{o.label}</span>
                    </button>
                  );
                })}
              </div>
              <dl className="glass mt-6 grid grid-cols-2 divide-x divide-line overflow-hidden">
                {[
                  { icon: GraduationCap, label: "Académica", n: sortedExperience.filter((i) => i.type === "academica").length },
                  { icon: Briefcase, label: "Laboral", n: sortedExperience.filter((i) => i.type === "laboral").length },
                ].map(({ icon: Icon, label, n }) => (
                  <div key={label} className="p-5">
                    <dt className="flex items-center gap-2 text-sm text-muted">
                      <Icon aria-hidden="true" className="size-4 text-muted" /> {label}
                    </dt>
                    <dd className="mt-2 font-mono text-3xl tracking-tight">{String(n).padStart(2, "0")}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 hidden text-sm text-muted lg:block">
                Usa los filtros para ver solo un tipo. La línea se dibuja a medida que bajas.
              </p>
            </div>
          </div>

          <div ref={listRef} className="relative lg:col-span-8">
            {/* Línea vertical: base + trazo que se dibuja con el scroll */}
            <span aria-hidden="true" className="absolute bottom-2 left-[21px] top-2 w-px bg-line" />
            <motion.span
              aria-hidden="true"
              style={reduced ? undefined : { scaleY }}
              className="absolute bottom-2 left-[20px] top-2 w-[3px] origin-top rounded-full bg-gradient-to-b from-grad-a via-grad-b to-transparent"
            />

            <ol className="space-y-6">
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item) => {
                  const Icon = item.type === "academica" ? GraduationCap : Briefcase;
                  return (
                    <motion.li
                      key={item.title + item.start}
                      layout
                      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(6px)" }}
                      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="relative pl-16"
                    >
                      <span className="absolute left-0 top-5 grid size-11 place-items-center rounded-full bg-[image:var(--grad-soft)] text-[#0b1030] shadow-[0_0_0_6px_var(--color-bg)]">
                        <Icon aria-hidden="true" className="size-[18px]" />
                      </span>
                      <article className="glass spotlight p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                          <span className="chip text-muted">
                            <time>{item.date}</time>
                          </span>
                          <span className="font-mono text-xs uppercase tracking-[.14em] text-muted">
                            {item.type === "academica" ? "Académica" : "Laboral · Emprendimiento"}
                          </span>
                        </div>
                        <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                        <p className="mt-1 text-[15px] text-ink/80">{item.place}</p>
                        <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{item.description}</p>
                      </article>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
