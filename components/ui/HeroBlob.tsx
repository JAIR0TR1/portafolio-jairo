"use client";

import { useEffect, useRef } from "react";
import { useReducedEffects } from "@/lib/effects";
import { simplex3 } from "@/lib/simplex";

const POINTS = 40; // puntos del contorno
const FOLLOW = 0.12; // lerp hacia el puntero (por frame a 60 fps)

/**
 * «Mancha líquida» del Hero. Genera cada frame un contorno orgánico (ruido simplex en 40
 * puntos, suavizado Catmull-Rom → curvas Bézier), estirado en la dirección del movimiento
 * con una pequeña cola, que respira despacio cuando el mouse se detiene. Se aplica como
 * `clip-path: path(...)` a la capa revelada ([data-hero-revealed]), hermana dentro de la tarjeta.
 *
 * - Mouse: crece 0→1 al entrar en el Hero y se encoge al salir.
 * - Táctil: aparece donde se toca, sigue el dedo y se encoge al soltar.
 * - Se pausa si el Hero no está en pantalla o la pestaña está oculta.
 * - Con reduced-motion / «Reducir efectos»: desactivada (solo la capa base).
 */
export function HeroBlob() {
  const reduced = useReducedEffects();
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = anchor.current?.parentElement;
    const layer = card?.querySelector<HTMLElement>("[data-hero-revealed]");
    if (!card || !layer) return;

    // will-change solo mientras la mancha está viva (evita una capa de GPU del tamaño del Hero en reposo)
    const hide = () => {
      layer.style.clipPath = "circle(0px at 50% 50%)";
      layer.style.visibility = "hidden";
      layer.style.willChange = "auto";
    };
    hide();
    if (reduced) return;

    const st = {
      active: false,
      onScreen: true,
      cx: 0, // última posición del puntero (coordenadas de ventana)
      cy: 0,
      x: 0, // centro de la mancha (coordenadas de la tarjeta)
      y: 0,
      vx: 0,
      vy: 0,
      s: 0, // escala 0..1
      t: 0,
      z: 0, // tiempo del ruido (avanza más rápido al moverse)
      last: 0,
      raf: 0,
    };
    const xs = new Float32Array(POINTS);
    const ys = new Float32Array(POINTS);

    const radius = (w: number) => Math.min(230, Math.max(140, w * 0.15));

    const frame = (now: number) => {
      st.raf = 0;
      const dt = Math.min(0.05, st.last ? (now - st.last) / 1000 : 1 / 60);
      st.last = now;
      const f = dt * 60; // frames de 60 fps transcurridos
      st.t += dt;

      const r = card.getBoundingClientRect();
      const tx = st.cx - r.left;
      const ty = st.cy - r.top;

      // seguimiento con lerp independiente de los fps
      const k = 1 - Math.pow(1 - FOLLOW, f);
      const nx = st.x + (tx - st.x) * k;
      const ny = st.y + (ty - st.y) * k;
      const kv = 1 - Math.pow(0.8, f);
      st.vx += ((nx - st.x) / f - st.vx) * kv;
      st.vy += ((ny - st.y) / f - st.vy) * kv;
      st.x = nx;
      st.y = ny;

      // entrada / salida (crece algo más lento de lo que se encoge)
      const ks = 1 - Math.pow(st.active ? 0.9 : 0.86, f);
      st.s += ((st.active ? 1 : 0) - st.s) * ks;

      if (!st.active && st.s < 0.004) {
        st.s = 0;
        st.last = 0;
        hide();
        return; // bucle detenido hasta la próxima interacción
      }

      const speed = Math.hypot(st.vx, st.vy);
      const stretch = Math.min(speed / 28, 1);
      const ux = speed > 0.01 ? st.vx / speed : 0;
      const uy = speed > 0.01 ? st.vy / speed : 0;
      st.z += dt * (0.32 + stretch * 0.9);
      const breath = 1 + Math.sin(st.t * 1.5) * 0.035 * (1 - stretch);
      const R = radius(r.width) * st.s * breath;

      for (let i = 0; i < POINTS; i++) {
        const a = (i / POINTS) * Math.PI * 2;
        const c = Math.cos(a);
        const sn = Math.sin(a);
        const n = simplex3(c * 1.05, sn * 1.05, st.z) * 0.13 + simplex3(c * 2.4 + 7, sn * 2.4 + 7, st.z * 1.4) * 0.05;
        const rr = R * (1 + n);
        let px = c * rr;
        let py = sn * rr;
        if (stretch > 0.001) {
          // se alarga hacia donde va y deja una cola atrás
          let along = px * ux + py * uy;
          const perpX = px - along * ux;
          const perpY = py - along * uy;
          if (along >= 0) along *= 1 + 0.16 * stretch;
          else {
            const back = Math.min(1, -along / (rr || 1));
            along *= 1 + stretch * (0.3 + 0.85 * back * back * back);
          }
          const squeeze = 1 - 0.17 * stretch;
          px = along * ux + perpX * squeeze;
          py = along * uy + perpY * squeeze;
        }
        xs[i] = st.x + px;
        ys[i] = st.y + py;
      }

      // Catmull-Rom cerrado → Bézier cúbicas
      let d = `M${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
      for (let i = 0; i < POINTS; i++) {
        const i0 = (i - 1 + POINTS) % POINTS;
        const i2 = (i + 1) % POINTS;
        const i3 = (i + 2) % POINTS;
        const c1x = xs[i] + (xs[i2] - xs[i0]) / 6;
        const c1y = ys[i] + (ys[i2] - ys[i0]) / 6;
        const c2x = xs[i2] - (xs[i3] - xs[i]) / 6;
        const c2y = ys[i2] - (ys[i3] - ys[i]) / 6;
        d += `C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${xs[i2].toFixed(1)} ${ys[i2].toFixed(1)}`;
      }
      layer.style.clipPath = `path("${d}Z")`;
      layer.style.visibility = "visible";
      layer.style.willChange = "clip-path";

      if (st.onScreen && !document.hidden) st.raf = requestAnimationFrame(frame);
    };

    const run = () => {
      if (!st.raf && st.onScreen && !document.hidden) st.raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(st.raf);
      st.raf = 0;
      st.last = 0;
    };

    /** Activa la mancha en un punto (si estaba cerrada, nace ahí mismo). */
    const start = (x: number, y: number) => {
      st.cx = x;
      st.cy = y;
      if (st.s < 0.02) {
        const r = card.getBoundingClientRect();
        st.x = x - r.left;
        st.y = y - r.top;
        st.vx = st.vy = 0;
      }
      st.active = true;
      run();
    };
    const end = () => {
      st.active = false;
      run();
    };

    // Mouse
    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") start(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!st.active) start(e.clientX, e.clientY);
      st.cx = e.clientX;
      st.cy = e.clientY;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") end();
    };
    // Táctil (eventos touch: siguen llegando aunque la página haga scroll)
    // Táctil: aparece solo mientras el dedo toca/arrastra; si el gesto es vertical, gana el scroll.
    const touch0 = { x: 0, y: 0, decided: false };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touch0.x = t.clientX;
      touch0.y = t.clientY;
      touch0.decided = false;
      start(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      if (!touch0.decided) {
        const dx = Math.abs(t.clientX - touch0.x);
        const dy = Math.abs(t.clientY - touch0.y);
        if (dx > 8 || dy > 8) {
          touch0.decided = true;
          if (dy > dx) {
            end(); // desplazamiento vertical: la mancha se retira y la página hace scroll
            return;
          }
        }
      }
      if (!st.active) return;
      st.cx = t.clientX;
      st.cy = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) end();
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointermove", onMove, { passive: true });
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("touchstart", onTouchStart, { passive: true });
    card.addEventListener("touchmove", onTouchMove, { passive: true });
    card.addEventListener("touchend", onTouchEnd, { passive: true });
    card.addEventListener("touchcancel", onTouchEnd, { passive: true });

    const io = new IntersectionObserver(([entry]) => {
      st.onScreen = entry.isIntersecting;
      if (!st.onScreen) stop();
      else if (st.active || st.s > 0) run();
    });
    io.observe(card);
    const onVis = () => {
      if (document.hidden) stop();
      else if (st.active || st.s > 0) run();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("touchstart", onTouchStart);
      card.removeEventListener("touchmove", onTouchMove);
      card.removeEventListener("touchend", onTouchEnd);
      card.removeEventListener("touchcancel", onTouchEnd);
      hide();
    };
  }, [reduced]);

  return <span ref={anchor} hidden />;
}
