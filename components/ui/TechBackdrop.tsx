"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery, useReducedEffects } from "@/lib/effects";
import { TechIcon } from "./TechIcon";
import { cn } from "@/lib/cn";

// TODO(Jairo): confirmar que usas cada tecnología (VS Code no está en simple-icons: se usa JavaScript)
const LOGOS = [
  { icon: "typescript", section: "inicio", x: 5, y: 24, size: 60, depth: 1.3 },
  { icon: "react", section: "inicio", x: 94, y: 78, size: 84, depth: 0.7 },
  { icon: "nextdotjs", section: "inicio", x: 95, y: 52, size: 52, depth: 1.7 },
  { icon: "git", section: "sobre-mi", x: 95, y: 16, size: 58, depth: 1.2 },
  { icon: "github", section: "sobre-mi", x: 3, y: 62, size: 76, depth: 0.8 },
  { icon: "javascript", section: "sobre-mi", x: 92, y: 88, size: 50, depth: 1.6 },
  { icon: "kotlin", section: "proyectos", x: 4, y: 14, size: 56, depth: 1.3 },
  { icon: "electron", section: "proyectos", x: 96, y: 36, size: 74, depth: 0.8 },
  { icon: "expo", section: "proyectos", x: 3, y: 80, size: 52, depth: 1.6 },
  { icon: "vite", section: "proyectos", x: 94, y: 86, size: 58, depth: 1.1 },
  { icon: "tailwindcss", section: "habilidades", x: 4, y: 30, size: 68, depth: 1 },
  { icon: "nodedotjs", section: "habilidades", x: 96, y: 20, size: 58, depth: 1.4 },
  { icon: "vercel", section: "habilidades", x: 93, y: 84, size: 50, depth: 0.9 },
  { icon: "figma", section: "habilidades", x: 6, y: 86, size: 46, depth: 1.7 },
] as const;

const SECTIONS = ["inicio", "sobre-mi", "proyectos", "habilidades"];

/**
 * Capa fija detrás del contenido con logos que "emergen" al entrar a su sección
 * y se mueven con parallax (scroll + puntero). Sin WebGL; nunca tapa el texto.
 */
export function TechBackdrop() {
  const desktop = useMediaQuery("(min-width: 768px)");
  return desktop ? <Backdrop /> : null;
}

function Backdrop() {
  const reduced = useReducedEffects();
  const [active, setActive] = useState<string | null>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);

  // Sección activa
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const current = SECTIONS.find((id) => seen.get(id)) ?? null;
        setActive(current);
      },
      { rootMargin: "-35% 0px -35% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Parallax por scroll y puntero (escribe transform directo, sin re-render)
  useEffect(() => {
    if (reduced || !active) return;
    const section = document.getElementById(active);
    if (!section) return;
    let frame = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      frame = 0;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      LOGOS.forEach((l, i) => {
        if (l.section !== active) return;
        const el = nodes.current[i];
        if (!el) return;
        const y = (0.5 - p) * 140 * l.depth + py * 10 * l.depth;
        const x = px * 12 * l.depth;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${(px * 10).toFixed(1)}deg)`;
      });
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onPointer = (e: PointerEvent) => {
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      request();
    };
    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(frame);
    };
  }, [active, reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [perspective:900px]">
      {LOGOS.map((l, i) => {
        const on = l.section === active;
        return (
          <div
            key={l.icon}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${l.x}%`, top: `${l.y}%` }}
          >
            <div
              className={cn(
                "transition-[opacity,scale,filter] duration-[900ms] ease-[var(--ease-out-expo)]",
                on ? "scale-100 opacity-[.07] blur-0 md:opacity-[.09]" : "scale-[.6] opacity-0 blur-md",
              )}
              style={{ transitionDelay: on ? `${(i % 4) * 90}ms` : "0ms" }}
            >
              <div ref={(el) => void (nodes.current[i] = el)} className="will-change-transform">
                <TechIcon
                  name={l.icon}
                  className="text-ink"
                  style={{ width: `clamp(${Math.round(l.size * 0.55)}px, ${l.size / 14}vw, ${l.size}px)`, height: "auto" }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
