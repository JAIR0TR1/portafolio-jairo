"use client";

/**
 * Posición y tamaño de un elemento SIN leer el layout durante la animación.
 * Se mide cuando el layout ya está resuelto (ResizeObserver: al montar y al cambiar de
 * tamaño el elemento o la página) y se guarda en coordenadas de página; en cada evento o
 * frame solo se resta el scroll actual (scrollX/scrollY no fuerzan recálculo).
 * Así ningún pointermove ni requestAnimationFrame provoca un recálculo de estilo forzado.
 */
export function trackRect(el: HTMLElement) {
  const box = { left: 0, top: 0, width: 0, height: 0 };
  const read = () => {
    const r = el.getBoundingClientRect();
    box.left = r.left + window.scrollX;
    box.top = r.top + window.scrollY;
    box.width = r.width;
    box.height = r.height;
  };
  const ro = new ResizeObserver(read);
  ro.observe(el);
  ro.observe(document.body);
  read();
  return {
    /** Rectángulo actual en coordenadas de la ventana. */
    get: () => ({ left: box.left - window.scrollX, top: box.top - window.scrollY, width: box.width, height: box.height }),
    refresh: read,
    stop: () => ro.disconnect(),
  };
}
