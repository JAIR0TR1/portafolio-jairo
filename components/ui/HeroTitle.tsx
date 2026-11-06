"use client";

import { useEffect, useRef, useState } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";
import { useReducedEffects } from "@/lib/effects";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ+";
const SCRAMBLE_MS = 600;
/** Ancho condensado permitido (eje wdth de Archivo). Palabras cortas más anchas, largas más estrechas. */
const WDTH_MAX = 75;
const WDTH_MIN = 62;

function wdthFor(word: string) {
  return Math.max(WDTH_MIN, Math.min(WDTH_MAX, WDTH_MAX - ([...word].length - 5) * 3.5));
}

type Fit = { size: number; wdth: number } | null;

/**
 * Palabra gigante detrás del personaje (JAIRO / CÓDIGO / HUMANO+IA). Se mide con la fuente
 * real y se escala para ocupar EXACTAMENTE el ancho del contenedor. Al cambiar de modo, las
 * letras se mezclan (~600 ms). Decorativa: el h1 real es «Jairo Vallejo Burbano».
 */
export function HeroTitle() {
  const reduced = useReducedEffects();
  const index = useModeIndex();
  const word = avatarModes[MODES[index].id].word.toUpperCase();

  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(word);
  const [shown, setShown] = useState(word);
  const [fit, setFit] = useState<Fit>(null);

  // Ajuste exacto al ancho: se mide la palabra a 100px con su ancho condensado.
  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!wrap || !probe) return;
    let alive = true;
    const wdth = wdthFor(word);
    const compute = () => {
      if (!alive) return;
      probe.textContent = word;
      probe.style.fontStretch = `${wdth}%`;
      probe.style.fontVariationSettings = `"wdth" ${wdth}`;
      const natural = probe.getBoundingClientRect().width; // a 100px
      const T = wrap.clientWidth;
      if (natural && T) setFit({ size: (100 * T) / natural, wdth });
    };
    document.fonts.ready.then(compute);
    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    return () => {
      alive = false;
      ro.disconnect();
    };
  }, [word]);

  // Letras que se mezclan entre la palabra anterior y la nueva.
  useEffect(() => {
    const from = prev.current;
    prev.current = word;
    if (from === word) return;
    let raf = 0;
    if (reduced) {
      raf = requestAnimationFrame(() => setShown(word));
      return () => cancelAnimationFrame(raf);
    }
    const len = word.length;
    const th = Array.from({ length: len }, (_, i) => 0.15 + (i / len) * 0.55 + Math.random() * 0.3);
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / SCRAMBLE_MS);
      let out = "";
      for (let i = 0; i < len; i++) {
        if (p >= th[i]) out += word[i];
        else if (p >= th[i] * 0.35) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += from[i] ?? GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [word, reduced]);

  const wdth = fit?.wdth ?? wdthFor(word);
  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none relative w-full select-none">
      {/* sonda invisible para medir */}
      <span
        ref={probeRef}
        className="invisible absolute left-0 top-0 whitespace-nowrap font-display uppercase"
        style={{ fontSize: 100, fontWeight: 800, lineHeight: 1 }}
      />
      <p
        className="whitespace-nowrap text-center font-display font-extrabold uppercase leading-[0.8] text-[#e6e6e6]"
        style={{
          // antes de medir: tamaño aproximado para no saltar
          fontSize: fit ? `${fit.size}px` : "min(26vw, 22rem)",
          fontStretch: `${wdth}%`,
          fontVariationSettings: `"wdth" ${wdth}`,
        }}
      >
        {shown}
      </p>
    </div>
  );
}
