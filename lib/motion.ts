"use client";

import { useSyncExternalStore } from "react";
import { PAUSE_KEY } from "./keys";

/**
 * Pausa global del movimiento automático (WCAG 2.2.2): órbita de etiquetas, flotación y
 * respiración del avatar, anillo de logos, chispas del híbrido, robot flotante.
 * Estado en <html data-anim="paused"> (lo pone el script de arranque antes del primer pintado);
 * al pausar, todo queda quieto en su posición actual y al reanudar sigue desde ahí.
 */
const listeners = new Set<() => void>();

function read() {
  return document.documentElement.dataset.anim === "paused";
}

export function isMotionPaused() {
  return typeof document !== "undefined" && read();
}

export function setMotionPaused(paused: boolean, remember = true) {
  const d = document.documentElement.dataset;
  if (paused) d.anim = "paused";
  else delete d.anim;
  if (remember) {
    try {
      localStorage.setItem(PAUSE_KEY, paused ? "1" : "0");
    } catch {
      /* almacenamiento bloqueado: solo esta visita */
    }
  }
  listeners.forEach((l) => l());
}

export function useMotionPaused() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      window.addEventListener("jv-motion", cb); // cambios hechos desde «Reducir efectos»
      return () => {
        listeners.delete(cb);
        window.removeEventListener("jv-motion", cb);
      };
    },
    read,
    () => false,
  );
}
