"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMediaQuery, useReducedEffects } from "@/lib/effects";
import { AvatarTraveler } from "./AvatarTraveler";
import { cn } from "@/lib/cn";

/**
 * Escenario del Hero «ficha técnica». En escritorio con efectos: contenedor de 150vh con
 * un sticky; al bajar, el título gigante y el pie se desvanecen, el halo se apaga y el
 * avatar viaja a «Sobre mí». En móvil / reduced-motion: Hero normal.
 */
export function HeroStage({
  meta,
  title,
  avatar,
  notes,
  bottom,
}: {
  meta: ReactNode;
  title: ReactNode;
  avatar: ReactNode;
  notes: ReactNode;
  bottom: ReactNode;
}) {
  const reduced = useReducedEffects();
  const desktop = useMediaQuery("(min-width: 1024px) and (min-height: 680px)");
  const enabled = desktop && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const fadeY = useTransform(p, [0, 0.45], [0, -120]);
  const fadeOpacity = useTransform(p, [0.02, 0.38], [1, 0]);
  const fadeBlur = useTransform(p, [0.02, 0.38], ["blur(0px)", "blur(10px)"]);
  const fade = enabled ? { y: fadeY, opacity: fadeOpacity, filter: fadeBlur } : undefined;

  // --hero-p: lo usan las anotaciones y el halo del avatar para desvanecerse
  useMotionValueEvent(p, "change", (v) => {
    ref.current?.style.setProperty("--hero-p", enabled ? v.toFixed(3) : "0");
  });

  return (
    <div ref={ref} data-hero-stage className={cn("hero-f relative", enabled && "h-[150vh]")}>
      <div className={cn("relative isolate overflow-hidden", enabled && "sticky top-0 h-[100svh]")}>
        <div className="container-x flex min-h-[100svh] flex-col pb-6 pt-[calc(var(--header-h)+0.5rem)] md:pb-8">
          <motion.div style={enabled ? { opacity: fadeOpacity } : undefined}>{meta}</motion.div>

          {/* Composición central: título gigante DETRÁS, avatar delante */}
          <div className="flex flex-1 flex-col justify-center pt-[calc(var(--f)*0.34)]">
            <div className="relative h-[calc(var(--f)*1.7)]">
              <motion.div style={fade} className="absolute inset-0">
                {title}
              </motion.div>
              <div className="absolute left-1/2 top-[calc(var(--f)*-0.3)] z-10 w-[calc(var(--f)*1.9)] -translate-x-1/2 lg:w-[calc(var(--f)*1.34)]">
                {avatar}
              </div>
            </div>
            {/* el avatar sobresale por debajo del título en pantallas pequeñas */}
            <div className="h-[calc(var(--f)*0.32)] lg:h-[calc(var(--f)*0.12)]" />
            {notes}
          </div>

          <motion.div style={fade}>{bottom}</motion.div>
        </div>
      </div>
      {enabled && <AvatarTraveler />}
    </div>
  );
}
