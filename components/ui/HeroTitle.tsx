"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";
import { useReducedEffects } from "@/lib/effects";
import { hash01 } from "@/lib/heroMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ+";
const SCRAMBLE_MS = 600;

/** Estilo común de la palabra y de la sonda que la mide (deben ser idénticos). */
const TYPE: CSSProperties = { fontSize: 100, lineHeight: 0.9, letterSpacing: "-0.02em" };

/**
 * Palabra gigante detrás del personaje (JAIRO / CÓDIGO / HUMANO+IA) en Michroma.
 * Se mide con la fuente real y se escala para ocupar EXACTAMENTE el ancho del contenedor.
 * Al cambiar de modo, las letras se mezclan (~600 ms) sin cambiar de capa.
 * Decorativa: el h1 real es el nombre completo.
 */
export function HeroTitle() {
  const reduced = useReducedEffects();
  const index = useModeIndex();
  const word = avatarModes[MODES[index].id].word.toUpperCase();

  const wrapRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const prev = useRef(word);
  const [shown, setShown] = useState(word);
  const [size, setSize] = useState<number | null>(null);

  // Ajuste exacto al ancho: se mide la palabra a 100px y se escala.
  useEffect(() => {
    const wrap = wrapRef.current;
    const probe = probeRef.current;
    if (!wrap || !probe) return;
    let alive = true;
    const compute = () => {
      if (!alive) return;
      probe.textContent = word;
      const natural = probe.getBoundingClientRect().width;
      const T = wrap.clientWidth;
      if (natural && T) setSize((100 * T) / natural);
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
    const seed = word.length * 31 + word.charCodeAt(0);
    const th = Array.from({ length: len }, (_, i) => 0.15 + (i / len) * 0.55 + hash01(seed + i) * 0.3);
    const glyph = (i: number, step: number) => GLYPHS[Math.floor(hash01(seed * 7 + i * 13 + step * 101) * GLYPHS.length)];
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / SCRAMBLE_MS);
      let out = "";
      for (let i = 0; i < len; i++) {
        const step = Math.floor(p * 24); // cambia de letra 24 veces en 600 ms, igual en ambas capas
        if (p >= th[i]) out += word[i];
        else if (p >= th[i] * 0.35) out += glyph(i, step);
        else out += from[i] ?? glyph(i, step);
      }
      setShown(out);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [word, reduced]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none relative w-full select-none">
      <span ref={probeRef} className="invisible absolute left-0 top-0 whitespace-nowrap font-hero uppercase" style={TYPE} />
      <p
        data-hero-word
        className="hero-word mx-auto w-fit whitespace-nowrap font-hero uppercase"
        style={{ ...TYPE, fontSize: size ? `${size}px` : "min(15vw, 13rem)" }}
      >
        {shown.normalize("NFC")}
      </p>
    </div>
  );
}
