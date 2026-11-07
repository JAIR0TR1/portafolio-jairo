"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Barra de progreso de lectura (heurística 01: visibilidad del estado). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-ink"
    />
  );
}
