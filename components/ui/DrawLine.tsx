"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";

/** Línea fina de 1px que se traza de izquierda a derecha al entrar en pantalla. */
export function DrawLine({ className }: { className?: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("block h-px w-full origin-left bg-line-2", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE }}
    />
  );
}
