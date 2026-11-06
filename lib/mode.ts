"use client";

import { useSyncExternalStore } from "react";

/** Los 3 modos del avatar. Cada uno cambia el acento (--accent) de toda la página. */
export const MODES = [
  { id: "jairo", label: "Jairo", color: "#7C5CFF" },
  { id: "dev", label: "Desarrollador", color: "#2D7BFF" },
  { id: "ai", label: "IA", color: "#FF3D9A" },
] as const;

export type ModeId = (typeof MODES)[number]["id"];

type State = {
  index: number;
  /** Sube en cada cambio de modo: dispara el orbe de luz y el scramble del título. */
  transitionId: number;
  /** Pausa explícita del usuario (botón ⏸). */
  userPaused: boolean;
  /** Pausas temporales: hover sobre el avatar, foco en los selectores… */
  holds: number;
};

const INITIAL: State = { index: 0, transitionId: 0, userPaused: false, holds: 0 };
let state: State = INITIAL;
const listeners = new Set<() => void>();

function emit(next: Partial<State>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setModeIndex(i: number) {
  const n = ((i % MODES.length) + MODES.length) % MODES.length;
  if (n === state.index) return;
  // El CSS (globals.css) mapea data-mode → --accent, que se anima con @property.
  if (n === 0) delete document.documentElement.dataset.mode;
  else document.documentElement.dataset.mode = MODES[n].id;
  emit({ index: n, transitionId: state.transitionId + 1 });
}

export const nextMode = () => setModeIndex(state.index + 1);
export const toggleUserPause = () => emit({ userPaused: !state.userPaused });
export const holdCycle = (on: boolean) => emit({ holds: Math.max(0, state.holds + (on ? 1 : -1)) });

export function useModeState() {
  return useSyncExternalStore(subscribe, () => state, () => INITIAL);
}

export function useModeIndex() {
  return useModeState().index;
}
