"use client";

import { useSyncExternalStore } from "react";

/** Clave en localStorage del toggle "Reducir efectos" (heurística 03). */
import { EFFECTS_KEY } from "./keys";
export { EFFECTS_KEY };

const listeners = new Set<() => void>();
const RM_QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia(RM_QUERY);
  mq.addEventListener("change", cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", cb);
    window.removeEventListener("storage", cb);
  };
}

function readUserPref() {
  try {
    return localStorage.getItem(EFFECTS_KEY) === "1";
  } catch {
    return false;
  }
}

export function setReduceEffects(value: boolean) {
  try {
    localStorage.setItem(EFFECTS_KEY, value ? "1" : "0");
  } catch {
    /* modo privado: solo afecta a esta visita */
  }
  document.documentElement.dataset.effects = value ? "reduced" : "full";
  listeners.forEach((l) => l());
}

/** Preferencia guardada por el usuario (toggle del footer). */
export function useUserReducedEffects() {
  return useSyncExternalStore(subscribe, readUserPref, () => false);
}

/** prefers-reduced-motion del sistema. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(RM_QUERY).matches,
    () => false,
  );
}

/** true si hay que reducir efectos (sistema o toggle). Úsalo en todo efecto. */
export function useReducedEffects() {
  const user = useUserReducedEffects();
  const system = usePrefersReducedMotion();
  return user || system;
}

/** Media query reactiva (sin setState en efectos). */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const EASE = [0.22, 1, 0.36, 1] as const;
