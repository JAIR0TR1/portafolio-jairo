"use client";

import { useSyncExternalStore } from "react";

/** Los 3 "modos" de Jairo: cada uno con su color (→ --accent de toda la página). */
export const MODES = [
  { id: "dev", label: "Desarrollador", short: "Desarrollo", color: "#2D7BFF" },
  { id: "design", label: "Diseñador UI", short: "Diseño UI", color: "#7C5CFF" },
  { id: "ai", label: "IA", short: "IA", color: "#FF3D9A" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];

let current = 0;
const listeners = new Set<() => void>();

export function setModeIndex(i: number) {
  current = ((i % MODES.length) + MODES.length) % MODES.length;
  const id = MODES[current].id;
  // El CSS (globals.css) mapea data-mode → --accent, que se anima con @property.
  if (id === "dev") delete document.documentElement.dataset.mode;
  else document.documentElement.dataset.mode = id;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useModeIndex() {
  return useSyncExternalStore(subscribe, () => current, () => 0);
}
