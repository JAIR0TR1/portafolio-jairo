"use client";

import { useEffect, useRef, useState } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";
import { useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz+·";
const SCRAMBLE_MS = 600;
/** Tracking permitido (em) para que cada línea llene el ancho sin deformarse. */
const LS_MIN = -0.06;
const LS_MAX = 0.3;
/** Una palabra corta puede crecer un poco para igualar el ancho de la otra línea. */
const SCALE_MAX = 1.2;

type Fit = { scale: number; ls: number };
const NO_FIT: Fit = { scale: 1, ls: 0 };

let canvas: HTMLCanvasElement | null = null;

/** Calcula tracking (y si hace falta, escala) para que `text` mida `target` px a tamaño base `F`. */
function fitLine(ctx: CanvasRenderingContext2D, text: string, F: number, target: number): Fit {
  const n = [...text].length || 1;
  const w100 = ctx.measureText(text).width; // ancho a 100px, sin tracking
  const natural = (w100 * F) / 100;
  const lsPx = (target - natural) / n;
  if (lsPx > LS_MAX * F) {
    const up = Math.min(SCALE_MAX, target / (F * (w100 / 100 + n * LS_MAX)));
    return { scale: up, ls: LS_MAX };
  }
  if (lsPx >= LS_MIN * F) return { scale: 1, ls: lsPx / F };
  // Demasiado larga incluso con el tracking mínimo: se reduce el tamaño de esa línea.
  const scale = Math.min(1, target / (F * (w100 / 100 + n * LS_MIN)));
  return { scale, ls: LS_MIN };
}

/**
 * Título gigante detrás del avatar. Cada línea ocupa casi todo el ancho del contenedor;
 * al cambiar de modo las letras se mezclan (scramble) hasta formar el nuevo texto.
 * Es decorativo (aria-hidden): el h1 real es el nombre completo.
 */
export function HeroTitle() {
  const reduced = useReducedEffects();
  const index = useModeIndex();
  const target = avatarModes[MODES[index].id].title;

  const wrapRef = useRef<HTMLDivElement>(null);
  const prev = useRef(target);
  const [shown, setShown] = useState<string[]>(() => [...target]);
  const [fits, setFits] = useState<Fit[]>([NO_FIT, NO_FIT]);

  // Ajuste al ancho: al montar, al cargar la fuente, al cambiar de tamaño y de modo.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let alive = true;
    const compute = () => {
      if (!alive) return;
      const cs = getComputedStyle(el);
      const F = parseFloat(cs.fontSize);
      const T = el.clientWidth * 0.985;
      canvas ??= document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx || !F || !T) return;
      ctx.font = `500 100px ${cs.fontFamily}`;
      setFits(target.map((t) => fitLine(ctx, t, F, T)));
    };
    document.fonts.ready.then(compute);
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [target]);

  // Scramble de ~600 ms entre el texto anterior y el nuevo.
  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    if (from === target) return;
    let raf = 0;
    if (reduced) {
      raf = requestAnimationFrame(() => setShown([...target]));
      return () => cancelAnimationFrame(raf);
    }
    const thresholds = target.map((t, li) => {
      const len = Math.max(t.length, from[li].length);
      return Array.from({ length: len }, (_, i) => 0.15 + (i / len) * 0.55 + Math.random() * 0.3);
    });
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / SCRAMBLE_MS);
      setShown(
        target.map((t, li) => {
          let out = "";
          thresholds[li].forEach((th, i) => {
            const to = t[i] ?? "";
            if (p >= th) out += to;
            else if (p >= th * 0.35) out += to === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            else out += from[li][i] ?? "";
          });
          return out;
        }),
      );
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none select-none font-display text-center"
      style={{ fontSize: "var(--f)", fontWeight: 500, lineHeight: 0.85 }}
    >
      {shown.map((line, i) => (
        <span
          key={i}
          className={cn("flex h-[0.85em] items-center justify-center whitespace-nowrap", i === 0 ? "text-ink" : "text-faint")}
        >
          <span
            className="inline-block"
            style={{
              fontSize: `${fits[i].scale}em`,
              letterSpacing: `${fits[i].ls}em`,
              // compensa el tracking que el navegador agrega tras la última letra
              marginLeft: `${fits[i].ls}em`,
            }}
          >
            {line || " "}
          </span>
        </span>
      ))}
    </div>
  );
}
