"use client";

import { RotateCcw } from "lucide-react";
import { setReduceEffects, useUserReducedEffects } from "@/lib/effects";

import { INTRO_KEY, INTRO_REPLAY_KEY } from "@/lib/keys";

/** Toggle "Reducir efectos" (se guarda en localStorage). */
export function ReduceEffectsToggle() {
  const on = useUserReducedEffects();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setReduceEffects(!on)}
      className="group flex min-h-11 items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
    >
      <span
        aria-hidden="true"
        className={`relative h-6 w-10 rounded-full border transition-colors ${on ? "border-ink bg-ink/20" : "border-line bg-white/5"}`}
      >
        <span
          className={`absolute left-0 top-0.5 size-[18px] rounded-full bg-ink transition-transform duration-300 ${on ? "translate-x-[18px]" : "translate-x-0.5"}`}
        />
      </span>
      Reducir efectos
    </button>
  );
}

/** Vuelve a mostrar la intro (F4). */
export function ReplayIntroButton() {
  return (
    <button
      type="button"
      onClick={() => {
        try {
          sessionStorage.removeItem(INTRO_KEY);
          sessionStorage.setItem(INTRO_REPLAY_KEY, "1");
        } catch {
          /* sin storage */
        }
        window.scrollTo({ top: 0, behavior: "instant" });
        window.location.reload();
      }}
      className="flex min-h-11 items-center gap-3 text-sm text-muted transition-colors hover:text-ink"
    >
      <RotateCcw aria-hidden="true" className="size-4" /> Ver intro otra vez
    </button>
  );
}
