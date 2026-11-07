"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE, useReducedEffects } from "@/lib/effects";

/** Entrada sutil y única: fade + 16 px, 400 ms (stagger 60 ms). */
const full: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};
// Reinicia y/blur de forma explícita: el SSR usa las variantes completas y, tras hidratar
// con reduced-motion, sin esto el contenido se quedaría desplazado y borroso.
const reduced: Variants = {
  hidden: { opacity: 0, y: 0 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Si es true, los hijos <RevealItem> entran escalonados (0.08 s). */
  stagger?: boolean;
  as?: "div" | "ul" | "ol" | "li" | "header";
};

export function Reveal({ children, className, delay = 0, stagger = false, as = "div" }: Props) {
  const r = useReducedEffects();
  const Comp = motion[as];
  const variants: Variants = stagger
    ? { hidden: {}, show: { transition: { staggerChildren: r ? 0 : 0.06, delayChildren: delay } } }
    : r
      ? reduced
      : { hidden: full.hidden, show: { ...full.show, transition: { duration: 0.4, ease: EASE, delay } } };

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={variants}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const r = useReducedEffects();
  const Comp = motion[as];
  return (
    <Comp className={className} variants={r ? reduced : full}>
      {children}
    </Comp>
  );
}
