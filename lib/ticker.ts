"use client";

/**
 * Un único requestAnimationFrame compartido para toda la animación por JS del Hero
 * (órbita, mancha líquida, costura del híbrido): en cada frame se llama a las tareas activas.
 * Sin setState por frame; cada tarea escribe estilos directamente.
 */
type Fn = (now: number) => void;
const active = new Set<Fn>();
let raf = 0;

function loop(now: number) {
  raf = 0;
  active.forEach((fn) => fn(now));
  if (active.size) raf = requestAnimationFrame(loop);
}

export function createTask(fn: Fn) {
  return {
    start() {
      active.add(fn);
      if (!raf) raf = requestAnimationFrame(loop);
    },
    stop() {
      active.delete(fn);
      if (!active.size && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    get running() {
      return active.has(fn);
    },
  };
}
