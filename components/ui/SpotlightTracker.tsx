"use client";

import { useEffect } from "react";

/**
 * Un único listener global: actualiza --mx/--my en la tarjeta .spotlight bajo el cursor.
 * Solo en dispositivos con puntero fino (escritorio).
 */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!target) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - r.left}px`);
      target.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
