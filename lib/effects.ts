"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

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
  const d = document.documentElement.dataset;
  d.effects = value ? "reduced" : "full";
  // sincronizado con la pausa de animaciones: reducir efectos = pausar; quitarlo = reanudar
  if (value) {
    d.anim = "paused";
    delete d.animAuto;
  } else if (!window.matchMedia(RM_QUERY).matches) {
    delete d.anim;
    delete d.animAuto;
  } else d.animAuto = ""; // sigue la pausa automática por prefers-reduced-motion (el anillo gira lento)
  try {
    localStorage.setItem("jv-pausa", value ? "1" : "0");
  } catch {
    /* sin almacenamiento */
  }
  listeners.forEach((l) => l());
  window.dispatchEvent(new Event("jv-motion"));
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

/**
 * false durante los primeros instantes tras montar. Las placas de las pestañas (layoutId) no
 * se deslizan mientras la página se acomoda al hidratar (el menú pasa de «Más» a las 9
 * pestañas, el tema real reemplaza al del servidor…): aparecen ya en su sitio.
 */
export function useSettled(ms = 700) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(true), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return settled;
}

/** Transición de la placa activa: resorte corto; instantánea al cargar o con movimiento reducido. */
export function usePlateMotion() {
  const reduced = useReducedEffects();
  const settled = useSettled();
  return reduced || !settled ? { duration: 0 } : ({ type: "spring", stiffness: 420, damping: 36 } as const);
}
