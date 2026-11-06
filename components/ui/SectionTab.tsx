"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

/** Pestaña numerada en mono («03 / Proyectos») que se ilumina cuando su sección está activa. */
export function SectionTab({ index, label, className }: { index: string; label: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const section = ref.current?.closest("section");
    if (!section) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "-40% 0px -55% 0px" });
    io.observe(section);
    return () => io.disconnect();
  }, []);
  return (
    <p
      ref={ref}
      className={cn(
        "inline-flex w-fit items-center gap-2 rounded-[4px] border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors duration-500",
        on ? "border-[#5a5a5a] text-ink" : "border-line-2 text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-[5px] rounded-full transition-colors duration-500", on ? "bg-accent" : "bg-[#3a3a3a]")} />
      {index} / {label}
    </p>
  );
}

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/** Texto que se decodifica letra por letra al entrar en pantalla (el HTML trae el texto final). */
export function DecodeText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedEffects();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(text);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const len = text.length;
        const th = Array.from({ length: len }, (_, i) => (i / len) * 0.7 + Math.random() * 0.3);
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / 750);
          let out = "";
          for (let i = 0; i < len; i++) {
            const c = text[i];
            out += p >= th[i] || c === " " || c === "." || c === "," ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setShown(out);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, reduced]);
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
