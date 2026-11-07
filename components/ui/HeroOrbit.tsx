"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

const ROTATE_MS = 8000; // si hay más etiquetas que lugares, las extra entran cada 8 s
const PERIOD = 55; // segundos por vuelta
const TILT = Math.cos((65 * Math.PI) / 180); // órbita inclinada ~65° (perspectiva 3D)
const REPEL = 120; // radio de repulsión del cursor (px)

/** Reloj compartido: mismo valor en las dos capas del Hero (no depende de cuándo montan). */
function useRotationTick(active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    let t = 0;
    const loop = () => {
      t = window.setTimeout(() => {
        setTick(Math.floor(Date.now() / ROTATE_MS));
        loop();
      }, ROTATE_MS - (Date.now() % ROTATE_MS) + 20);
    };
    loop();
    return () => window.clearTimeout(t);
  }, [active]);
  return tick;
}

/** Etiquetas visibles: hasta `max`; si hay más, la ventana avanza con el reloj. */
function visibleNotes(notes: string[], max: number, tick: number) {
  if (notes.length <= max) return notes;
  const start = (tick * max) % notes.length;
  return Array.from({ length: max }, (_, j) => notes[(start + j) % notes.length]);
}

/**
 * Anotaciones en órbita alrededor del personaje («sistema solar»): 2 órbitas elípticas
 * inclinadas que giran en sentidos opuestos (una vuelta cada ~55 s), etiquetas siempre
 * derechas; las que pasan detrás van más pequeñas, tenues y por debajo del personaje.
 * El cursor las aparta con un resorte y el hover pausa la órbita.
 *
 * Se pinta en las dos capas del Hero; SOLO la capa base corre el motor (un único
 * requestAnimationFrame) y mueve las etiquetas de ambas capas con los mismos valores.
 * Decorativas: aria-hidden y no enfocables (la lista completa está en Habilidades).
 */
export function HeroOrbit({ notes, modeId, isBase }: { notes: string[]; modeId: string; isBase: boolean }) {
  const reduced = useReducedEffects();
  const mobile = useMediaQuery("(max-width: 767px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const tick = useRotationTick(!reduced);
  const max = mobile ? 6 : 12;
  const shown = visibleNotes(notes, max, tick);
  const rootRef = useRef<HTMLDivElement>(null);
  const hot = useRef({ index: -1 });

  useEffect(() => {
    if (!isBase) return;
    const root = rootRef.current;
    const fig = root?.parentElement;
    const stage = fig?.parentElement;
    const hero = root?.closest<HTMLElement>("#inicio");
    if (!root || !fig || !stage || !hero) return;

    const n = shown.length;
    const rings = mobile ? 1 : 2;
    const inner = rings === 1 ? n : Math.round(n * 0.42);
    const springs = Array.from({ length: n }, () => ({ ox: 0, oy: 0, vx: 0, vy: 0 }));
    const geo = { W: 0, H: 0, SW: 0, off: 0, cx: 0, cy: 0, rx: [0, 0], ry: [0, 0] };
    const cursor = { x: -9999, y: -9999 };
    let t = 0;
    let last = 0;
    let raf = 0;
    let onScreen = true;

    const measure = () => {
      geo.W = fig.clientWidth;
      geo.H = fig.clientHeight;
      geo.SW = stage.clientWidth;
      geo.off = (geo.SW - geo.W) / 2;
      geo.cx = geo.W / 2;
      // móvil: órbita pequeña a la altura de las piernas (debajo de la palabra gigante)
      geo.cy = geo.H * (mobile ? 0.66 : 0.42);
      const outer = Math.max(70, Math.min(geo.W * (mobile ? 0.62 : 1.02), geo.SW / 2 - (mobile ? 70 : 70)));
      geo.rx = rings === 1 ? [outer, outer] : [outer * 0.64, outer];
      // la elipse nunca baja hasta el nombre y los botones (escritorio: hasta el 64 % del escenario)
      const maxRy = geo.H * (mobile ? 0.13 : 0.22);
      geo.ry = geo.rx.map((r) => Math.min(r * (mobile ? 0.75 : TILT), maxRy * (r / geo.rx[1])));
      // líneas de órbita (en ambas capas)
      hero.querySelectorAll<HTMLElement>("[data-orbit-line]").forEach((el) => {
        const k = Number(el.dataset.orbitLine);
        if (k >= rings) {
          el.style.display = "none";
          return;
        }
        el.style.display = "";
        el.style.width = `${geo.rx[k] * 2}px`;
        el.style.height = `${geo.ry[k] * 2}px`;
        el.style.left = `${geo.cx - geo.rx[k]}px`;
        el.style.top = `${geo.cy - geo.ry[k]}px`;
      });
    };

    const place = () => {
      const groups: HTMLElement[][] = Array.from({ length: n }, () => []);
      hero.querySelectorAll<HTMLElement>("[data-orbit-i]").forEach((el) => {
        const i = Number(el.dataset.orbitI);
        if (i < n) groups[i].push(el);
      });
      const r = fig.getBoundingClientRect();
      const omega = (2 * Math.PI) / PERIOD;
      for (let i = 0; i < n; i++) {
        const ring = i < inner ? 0 : 1;
        const count = ring === 0 ? inner : n - inner;
        const j = ring === 0 ? i : i - inner;
        const dir = ring === 0 ? 1 : -1;
        const theta = (j / count) * Math.PI * 2 + (ring ? 0.35 : 0) + dir * omega * t;
        const sin = Math.sin(theta);
        let x = geo.cx + geo.rx[ring] * Math.cos(theta);
        const y = geo.cy + geo.ry[ring] * sin;
        // que la etiqueta quepa completa en el escenario
        const w = groups[i][0]?.offsetWidth ?? 0;
        const minX = -geo.off + w / 2 + 4;
        const maxX = geo.SW - geo.off - w / 2 - 4;
        x = Math.min(maxX, Math.max(minX, x));
        // repulsión del cursor (resorte)
        const s = springs[i];
        let tx = 0;
        let ty = 0;
        if (!reduced && finePointer && !mobile) {
          const dx = r.left + x + s.ox - cursor.x;
          const dy = r.top + y + s.oy - cursor.y;
          const d = Math.hypot(dx, dy);
          if (d < REPEL && d > 0.1) {
            tx = (dx / d) * (REPEL - d) * 0.7;
            ty = (dy / d) * (REPEL - d) * 0.7;
          }
        }
        s.vx = (s.vx + (tx - s.ox) * 0.12) * 0.78;
        s.vy = (s.vy + (ty - s.oy) * 0.12) * 0.78;
        s.ox += s.vx;
        s.oy += s.vy;
        const depth = (sin + 1) / 2; // 0 = detrás, 1 = delante
        const scale = 0.85 + 0.15 * depth;
        const opacity = 0.45 + 0.55 * depth;
        const isHot = hot.current.index === i;
        for (const el of groups[i]) {
          el.style.transform = `translate3d(${(x + s.ox).toFixed(1)}px, ${(y + s.oy).toFixed(1)}px, 0) translate(-50%, -50%) scale(${(isHot ? 1.06 : scale).toFixed(3)})`;
          el.style.setProperty("--o", isHot ? "1" : opacity.toFixed(3));
          el.style.zIndex = sin < 0 && !isHot ? "5" : "20";
          if (isHot) el.dataset.hot = "";
          else delete el.dataset.hot;
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      // quieta si el usuario pausó las animaciones o hay una etiqueta bajo el cursor
      if (hot.current.index < 0 && document.documentElement.dataset.anim !== "paused") t += dt;
      place();
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const run = () => {
      if (reduced) {
        place();
        requestAnimationFrame(place); // la capa revelada puede montar un frame después
        return;
      }
      if (!raf && onScreen && !document.hidden) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    // arranque: el reloj sale de la hora real para que las dos capas coincidan siempre
    t = reduced ? 0 : (Date.now() / 1000) % PERIOD;
    measure();
    place();
    run();

    const ro = new ResizeObserver(() => {
      measure();
      if (reduced) place();
    });
    ro.observe(fig);
    ro.observe(stage);
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) run();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(fig);
    const onVis = () => {
      if (!document.hidden) run();
    };
    const onMove = (e: PointerEvent) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
    // shown.join: cambia el conjunto visible (modo o rotación)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBase, reduced, mobile, finePointer, shown.join("|")]);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span data-orbit-line="0" className="orbit-line" />
      <span data-orbit-line="1" className="orbit-line" />
      {shown.map((text, i) => (
        <span
          key={`${modeId}-${text}`}
          data-orbit-i={i}
          className={cn("orbit-label", isBase && "pointer-events-auto")}
          onPointerEnter={isBase ? () => (hot.current.index = i) : undefined}
          onPointerLeave={isBase ? () => (hot.current.index = -1) : undefined}
        >
          {text}
        </span>
      ))}
    </div>
  );
}
