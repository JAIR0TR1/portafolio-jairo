"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE, useReducedEffects } from "@/lib/effects";

const full: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
};
const reduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
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
    ? { hidden: {}, show: { transition: { staggerChildren: r ? 0 : 0.08, delayChildren: delay } } }
    : r
      ? reduced
      : { hidden: full.hidden, show: { ...full.show, transition: { duration: 0.6, ease: EASE, delay } } };

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
