"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { EASE, useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

const DURATION = 7000;

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-4", i < rating ? "fill-ink text-ink" : "text-white/20")}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const reduced = useReducedEffects();
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const paused = userPaused || hoverPaused || reduced;
  const total = testimonials.length;

  const go = (next: number, d: number) => setState([(next + total) % total, d]);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setState(([i]) => [(i + 1) % total, 1]), DURATION);
    return () => window.clearTimeout(t);
  }, [index, paused, total]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(index + 1, 1);
    else if (info.offset.x > 60) go(index - 1, -1);
  };

  const t = testimonials[index];

  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="testimonios-title"
          index="04"
          eyebrow="Testimonios"
          title={
            <>
              Lo que dicen de trabajar conmigo.
            </>
          }
          description="Opiniones de docentes, compañeros y clientes, publicadas con su permiso."
        />

        <div
          role="region"
          aria-roledescription="carrusel"
          aria-label="Testimonios"
          onMouseEnter={() => setHoverPaused(true)}
          onMouseLeave={() => setHoverPaused(false)}
          onFocusCapture={() => setHoverPaused(true)}
          onBlurCapture={() => setHoverPaused(false)}
          className="grid gap-4 lg:grid-cols-12"
        >
          {/* Tarjeta destacada */}
          <div className="glass spotlight relative min-h-[340px] overflow-hidden p-6 md:p-10 lg:col-span-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-2 font-display text-[9rem] leading-[0.8] text-[#2a2a2a] select-none md:right-10 md:text-[12rem]"
            >
              ”
            </span>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                aria-roledescription="diapositiva"
                aria-label={`${index + 1} de ${total}`}
                initial={{ opacity: 0, x: reduced ? 0 : dir * 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: reduced ? 0 : dir * -40, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                className="relative flex h-full cursor-grab touch-pan-y flex-col justify-between gap-10 active:cursor-grabbing"
              >
                <div className="space-y-6">
                  <Stars rating={t.rating} />
                  <blockquote className="text-pretty text-[clamp(1.25rem,1rem+1.2vw,1.875rem)] leading-snug tracking-[-0.02em]">
                    “{t.text}”
                  </blockquote>
                </div>
                <figcaption className="flex items-center gap-4">
                  <InitialsAvatar name={t.name} src={t.avatar} index={index} />
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-sm text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Lista lateral (funciona como puntos con nombre) */}
          <div className="flex flex-col gap-3 lg:col-span-4">
            <ul className="flex gap-2 lg:flex-col lg:gap-3" aria-label="Elegir testimonio">
              {testimonials.map((item, i) => {
                const on = i === index;
                return (
                  <li key={item.name + i} className="flex-1 lg:flex-none">
                    <button
                      type="button"
                      onClick={() => go(i, i > index ? 1 : -1)}
                      aria-current={on ? "true" : undefined}
                      aria-label={`Testimonio ${i + 1}: ${item.name}`}
                      className={cn(
                        "relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-[6px] border p-2 text-left transition-colors lg:p-4",
                        on ? "border-white/15 bg-white/[.06]" : "border-line hover:bg-white/[.03]",
                      )}
                    >
                      <InitialsAvatar name={item.name} src={item.avatar} index={i} className="size-9 text-xs lg:size-11" />
                      <span className="hidden min-w-0 lg:block">
                        <span className="block truncate text-sm font-medium">{item.name}</span>
                        <span className="block truncate text-xs text-muted">{item.role}</span>
                      </span>
                      {on && (
                        <span
                          key={`${index}-${paused}`}
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink"
                          style={{
                            animation: paused ? "none" : `progress ${DURATION}ms linear forwards`,
                            transform: paused ? "scaleX(0)" : undefined,
                          }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="glass mt-auto flex items-center justify-between gap-2 p-2">
              <button type="button" onClick={() => go(index - 1, -1)} className="btn btn-ghost size-11 p-0" aria-label="Testimonio anterior">
                <ChevronLeft aria-hidden="true" />
              </button>
              <span className="font-mono text-sm text-muted" aria-live="polite">
                <span className="text-ink">{String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                className="btn btn-ghost size-11 p-0"
                aria-label={userPaused ? "Reanudar carrusel" : "Pausar carrusel"}
                aria-pressed={userPaused}
              >
                {userPaused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>
              <button type="button" onClick={() => go(index + 1, 1)} className="btn btn-ghost size-11 p-0" aria-label="Testimonio siguiente">
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
