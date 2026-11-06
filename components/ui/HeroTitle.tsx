"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";
import { useReducedEffects } from "@/lib/effects";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ+";
const SCRAMBLE_MS = 600;

/** Estilo común de la palabra y de la sonda que la mide (deben ser idénticos). */
const TYPE: CSSProperties = { fontSize: 100, lineHeight: 0.9, letterSpacing: "-0.02em" };

/**
 * Palabra gigante detrás del personaje (JAIRO / CÓDIGO / HUMANO+IA) en Michroma.
 * Se mide con la fuente real y se escala para ocupar EXACTAMENTE el ancho del contenedor.
 * Al cambiar de modo, las letras se mezclan (~600 ms) sin cambiar de capa.
 * Decorativa: el h1 real es «Jairo Vallejo Burbano».
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
      probe.textContent = word.replaceAll("Ó", "O");
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

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none relative w-full select-none">
      <span ref={probeRef} className="invisible absolute left-0 top-0 whitespace-nowrap font-hero uppercase" style={TYPE} />
      <p
        data-hero-word
        className="hero-word mx-auto w-fit whitespace-nowrap font-hero uppercase"
        style={{ ...TYPE, fontSize: size ? `${size}px` : "min(15vw, 13rem)" }}
      >
        {[...shown].map((c, i) =>
          c === "Ó" ? (
            <span key={i} className="hero-word relative inline-block">
              O<span aria-hidden="true" className="hero-acute" />
            </span>
          ) : (
            c
          ),
        )}
      </p>
    </div>
  );
}
