"use client";

/**
 * Un único requestAnimationFrame compartido para toda la animación por JS del Hero
 * (órbita, mancha líquida, costura del híbrido): en cada frame se llama a las tareas activas.
 * Sin setState por frame; cada tarea escribe estilos directamente.
 *
 * Degradación adaptativa: mide la duración de los frames mientras hay animación. Si el
 * promedio supera ~22 ms (menos de ~45 fps) durante unos 2 s, marca <html data-perf="lite">
 * y el CSS apaga efectos secundarios (grano, luz ambiental desenfocada, brillo de los ojos,
 * líneas de órbita). El robot, la órbita y la mancha no cambian. No vuelve atrás en la visita.
 */
type Fn = (now: number) => void;
const active = new Set<Fn>();
let raf = 0;

const SAMPLE = 120; // ~2 s a 60 fps
const SLOW_MS = 22;
let prev = 0;
let sum = 0;
let count = 0;

function measure(now: number) {
  if (prev) {
    const dt = now - prev;
    if (dt < 250) {
      // pausas largas (pestaña oculta, carga) no cuentan
      sum += dt;
      count++;
    }
  }
  prev = now;
  if (count < SAMPLE) return;
  if (sum / count > SLOW_MS && document.documentElement.dataset.perf !== "lite") {
    document.documentElement.dataset.perf = "lite";
  }
  sum = 0;
  count = 0;
}

function loop(now: number) {
  raf = 0;
  measure(now);
  active.forEach((fn) => fn(now));
  if (active.size) raf = requestAnimationFrame(loop);
  else prev = 0;
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
        prev = 0;
      }
    },
    get running() {
      return active.has(fn);
    },
  };
}
