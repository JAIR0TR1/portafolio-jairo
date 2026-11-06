"use client";

import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { avatarModes } from "@/data/avatar";
import { MODES, holdCycle, setModeIndex, toggleUserPause, useModeState } from "@/lib/mode";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";

/** Selectores de modo como chips de borde fino (heurísticas 3 y 6). */
export function ModeSelector() {
  const { index, userPaused } = useModeState();
  return (
    <div
      role="group"
      aria-label="Elige un modo del avatar"
      className="flex flex-wrap items-center gap-2"
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
            onClick={() => setModeIndex(i)}
            className={cn(
              "flex min-h-10 items-center gap-2 rounded-[6px] border px-3 text-[13px] transition-colors",
              on ? "border-[#5a5a5a] text-ink" : "border-line-2 text-muted hover:border-[#4a4a4a] hover:text-ink",
            )}
          >
            <span
              aria-hidden="true"
              className={cn("size-[7px] rounded-full transition-colors", on ? "bg-accent" : "bg-[#3a3a3a]")}
            />
            {m.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={toggleUserPause}
        aria-pressed={userPaused}
        aria-label={userPaused ? "Reanudar cambio automático de modo" : "Pausar cambio automático de modo"}
        className="grid size-10 place-items-center rounded-[6px] border border-line-2 text-muted transition-colors hover:border-[#4a4a4a] hover:text-ink"
      >
        {userPaused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
      </button>
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
