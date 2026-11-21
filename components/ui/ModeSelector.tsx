"use client";

import { AnimatePresence, motion } from "motion/react";
import { avatarModes } from "@/data/avatar";
import { MODES, chooseMode, holdCycle, useModeState } from "@/lib/mode";
import { EASE, useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";
import { PauseButton } from "./PauseButton";

/**
 * Selector de modo: riel segmentado (heurísticas 3 y 6). El modo activo lleva la placa de
 * esquinas cortadas con el degradado del modo, que se desliza entre segmentos (layoutId,
 * transform); los demás muestran las esquinas [ ] al pasar el cursor o con el foco.
 * Etiquetas en JetBrains Mono; el número «01–03» solo en pantallas anchas.
 */
export function ModeSelector() {
  const { index } = useModeState();
  const reduced = useReducedEffects();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label="Elige un modo del avatar"
        className="mode-rail isolate inline-flex items-stretch gap-1 rounded-[12px] border border-line-2 p-1"
        onFocusCapture={() => holdCycle(true)}
        onBlurCapture={() => holdCycle(false)}
      >
        {MODES.map((m, i) => {
          const on = i === index;
          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              onClick={() => chooseMode(i)}
              className={cn(
                "tab flex min-h-11 items-center gap-1.5 px-3.5 font-mono text-[12px] uppercase tracking-[0.08em] transition-colors md:min-h-9",
                on ? "font-semibold text-[var(--btn-fg)]" : "text-muted hover:text-ink",
              )}
            >
              {on && (
                <motion.span
                  layoutId="mode-plate"
                  transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }}
                  className="tab-plate absolute inset-0 -z-10"
                />
              )}
              <span aria-hidden="true" className={cn("hidden text-[10px] sm:inline", on ? "opacity-70" : "text-muted opacity-60")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {m.label}
            </button>
          );
        })}
      </div>
      <PauseButton />
    </div>
  );
}

/** En pantallas pequeñas las anotaciones van como lista (no caben alrededor del avatar). */
export function NotesList({ className }: { className?: string }) {
  const { index } = useModeState();
  const data = avatarModes[MODES[index].id];
  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={MODES[index].id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{data.group}</p>
          <ul className="flex flex-wrap gap-1.5">
            {data.notes.map((t) => (
              <li key={t} className="chip text-[11px]">
                <span aria-hidden="true" className="size-[5px] rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
