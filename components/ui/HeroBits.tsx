"use client";

import { AnimatePresence, motion } from "motion/react";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";
import { EASE } from "@/lib/effects";

/** Línea de la columna derecha que cambia con el modo. */
export function ModeLine() {
  const mode = MODES[useModeIndex()];
  return (
    <span className="relative block min-h-[3em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode.id}
          className="block"
          initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          {avatarModes[mode.id].line}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
