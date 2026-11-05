"use client";

import { AnimatePresence, motion } from "motion/react";
import { MODES, useModeIndex } from "@/lib/mode";
import { EASE } from "@/lib/effects";

/** Parte del subtítulo del Hero que cambia con el modo del avatar. */
export function ModeSubtitle() {
  const mode = MODES[useModeIndex()];
  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={mode.id}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="text-accent"
        >
          {mode.short}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
