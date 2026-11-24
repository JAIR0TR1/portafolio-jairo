"use client";

import { useSyncExternalStore } from "react";
import { THEME_COLOR, THEME_KEY } from "./keys";

/**
 * Tema del sitio: oscuro (por defecto), claro o «sistema» (sigue prefers-color-scheme).
 * El script de arranque ya dejó data-theme y data-theme-pref en <html> antes del primer
 * pintado; aquí solo se cambia y se guarda. Todo el color sale de tokens CSS (globals.css).
 */
export type ThemePref = "dark" | "light" | "system";
export const THEME_PREFS: ThemePref[] = ["dark", "light", "system"];

const listeners = new Set<() => void>();

function read(): ThemePref {
  const p = document.documentElement.dataset.themePref;
  return p === "light" || p === "system" ? p : "dark";
}

function apply(pref: ThemePref) {
  const d = document.documentElement;
  const resolved = pref === "system" ? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark") : pref;
  // intercambio limpio: un frame sin transiciones para que nada quede a medio color
  d.dataset.themeSwitching = "";
  d.dataset.themePref = pref;
  d.dataset.theme = resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[resolved]);
  requestAnimationFrame(() => requestAnimationFrame(() => delete d.dataset.themeSwitching));
}

export function setThemePref(pref: ThemePref) {
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* almacenamiento bloqueado: solo dura esta visita */
  }
  apply(pref);
  listeners.forEach((l) => l());
}

export function useThemePref() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => "dark" as ThemePref,
  );
}
