"use client";

import { Pause, Play } from "lucide-react";
import { setMotionPaused, useMotionPaused } from "@/lib/motion";
import { cn } from "@/lib/cn";

/** Pausar / reanudar todo el movimiento automático del sitio (WCAG 2.2.2). */
export function PauseButton({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const paused = useMotionPaused();
  const label = paused ? "Reanudar animaciones" : "Pausar animaciones";
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      aria-label={withLabel ? undefined : label}
      title={label}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[12px] border border-line-2 text-muted transition-colors hover:border-accent/60 hover:text-ink md:min-h-10",
        withLabel ? "px-3 text-small" : "size-11 md:size-10",
        className,
      )}
    >
      {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
      {withLabel && label}
    </button>
  );
}
