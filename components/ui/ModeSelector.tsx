"use client";

import { motion } from "motion/react";
import { MODES, chooseMode, holdCycle, useModeState } from "@/lib/mode";
import { usePlateMotion } from "@/lib/effects";
import { cn } from "@/lib/cn";
import { PauseButton } from "./PauseButton";
import { useI18n } from "./I18nProvider";

/**
 * Selector de modo: riel segmentado (heurísticas 3 y 6). El modo activo lleva la placa de
 * esquinas cortadas con el degradado del modo, que se desliza entre segmentos (layoutId,
 * transform); los demás muestran las esquinas [ ] al pasar el cursor o con el foco.
 * Etiquetas en JetBrains Mono; el número «01–03» solo en pantallas anchas.
 */
export function ModeSelector() {
  const { index } = useModeState();
  const plate = usePlateMotion();
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        role="group"
        aria-label={t.modes.group}
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
                  transition={plate}
                  className="tab-plate absolute inset-0 -z-10"
                />
              )}
              <span aria-hidden="true" className={cn("hidden text-[10px] sm:inline", on ? "opacity-70" : "text-muted opacity-60")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {t.modes[m.id]}
            </button>
          );
        })}
      </div>
      <PauseButton />
    </div>
  );
}
