"use client";

import { useEffect, useRef } from "react";
import { AvatarBot } from "./AvatarBot";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ASPECT = 460 / 400;

/**
 * Avatar "viajero" (elemento compartido): una capa fija que lleva el avatar del Hero
 * hasta la tarjeta de foto de "Sobre mí" según el scroll. Solo escritorio y con efectos.
 * Fases en <html data-avatar>: home → traveling → landed.
 */
export function AvatarTraveler() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const src = document.querySelector<HTMLElement>("[data-avatar-source]");
    const dst = document.querySelector<HTMLElement>("[data-avatar-target]");
    const stage = document.querySelector<HTMLElement>("[data-hero-stage]");
    if (!el || !src || !dst || !stage) return;
    const root = document.documentElement;
    const hasPhoto = dst.dataset.hasPhoto === "true";
    let phase = "";
    let frame = 0;

    const setPhase = (p: string) => {
      if (p === phase) return;
      phase = p;
      root.dataset.avatar = p;
    };

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      const stageTop = stage.getBoundingClientRect().top + y;
      const d = dst.getBoundingClientRect();
      const s0 = stageTop + vh * 0.18;
      const s1 = d.top + y - vh * 0.14;
      const t = s1 > s0 ? clamp((y - s0) / (s1 - s0)) : 0;

      if (t <= 0) {
        el.style.opacity = "0";
        setPhase("home");
        return;
      }

      // Origen: el avatar del Hero (fijo mientras dura el sticky; luego sube con la página)
      const s = src.getBoundingClientRect();
      const startTop = s.top;
      const sw = s.width;
      const sh = sw * ASPECT;

      // Destino: centrado en la tarjeta (mismo cálculo que el avatar dentro de la tarjeta)
      const ew = Math.min(d.width * 0.78, d.height * 0.8 / ASPECT);
      const eh = ew * ASPECT;
      const ex = d.left + d.width / 2 - ew / 2;
      const ey = d.top + d.height * 0.44 - eh / 2;

      const e = ease(t);
      const x = lerp(s.left, ex, e);
      const top = lerp(startTop, ey, e) - Math.sin(Math.PI * e) * 70; // pequeño arco
      const scale = lerp(1, ew / sw, e);

      el.style.width = `${sw}px`;
      el.style.height = `${sh}px`;
      el.style.transform = `translate3d(${x}px, ${top}px, 0) scale(${scale})`;

      if (t >= 1) {
        el.style.opacity = "0";
        setPhase("landed");
      } else {
        el.style.opacity = hasPhoto ? String(1 - clamp((t - 0.8) / 0.2)) : "1";
        setPhase("traveling");
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.avatar;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 origin-top-left opacity-0 will-change-transform"
    >
      <AvatarBot uid="traveler" className="h-full w-full" />
    </div>
  );
}
