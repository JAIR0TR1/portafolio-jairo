"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMediaQuery, useReducedEffects } from "@/lib/effects";
import { AvatarTraveler } from "./AvatarTraveler";
import { cn } from "@/lib/cn";

/**
 * Escenario del Hero. En escritorio con efectos: contenedor de 200vh con un sticky;
 * al bajar, el texto sube y se desvanece, el fondo pasa a obsidiana y el avatar viaja
 * a "Sobre mí". En móvil / reduced-motion: Hero normal.
 */
export function HeroStage({
  backdrop,
  text,
  visual,
  hint,
}: {
  backdrop: ReactNode;
  text: ReactNode;
  visual: ReactNode;
  hint: ReactNode;
}) {
  const reduced = useReducedEffects();
  const desktop = useMediaQuery("(min-width: 1024px) and (min-height: 680px)");
  const enabled = desktop && !reduced;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const textY = useTransform(p, [0, 0.45], [0, -160]);
  const textOpacity = useTransform(p, [0.02, 0.38], [1, 0]);
  const textBlur = useTransform(p, [0.02, 0.38], ["blur(0px)", "blur(10px)"]);
  const darken = useTransform(p, [0.1, 0.75], [0, 1]);

  // --hero-p: lo usan las tarjetas y chips del avatar para desvanecerse
  useMotionValueEvent(p, "change", (v) => {
    ref.current?.style.setProperty("--hero-p", enabled ? v.toFixed(3) : "0");
  });

  return (
    <div ref={ref} data-hero-stage className={cn("relative", enabled && "h-[150vh]")}>
      <div className={cn("relative isolate overflow-hidden", enabled && "sticky top-0 h-[100svh]")}>
        {backdrop}
        {enabled && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: darken }}
            className="pointer-events-none absolute inset-0 -z-[5] bg-bg"
          />
        )}
        <div className="container-x grid min-h-[100svh] items-center gap-6 pb-28 pt-[calc(var(--header-h)+1.5rem)] lg:grid-cols-12 lg:gap-8">
          <motion.div
            style={enabled ? { y: textY, opacity: textOpacity, filter: textBlur } : undefined}
            className="order-2 lg:order-1 lg:col-span-7"
          >
            {text}
          </motion.div>
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5">{visual}</div>
        </div>
        <motion.div style={enabled ? { opacity: textOpacity } : undefined}>{hint}</motion.div>
      </div>
      {enabled && <AvatarTraveler />}
    </div>
  );
}
