"use client";

import { useEffect, useRef } from "react";

/**
 * Póster de la intro: se renderiza en el HTML (SSR) y se ve desde el primer pintado, antes
 * de que cargue el JS; la escena 3D lo reemplaza si está lista en menos de 2 s.
 * Versión 2D de la intro (sin WebGL / móvil): pantalla en perspectiva CSS con el sitio
 * haciendo scroll adentro, rayo de luz sobre el piso y el mismo zoom final.
 */
export function IntroCss() {
  const deviceRef = useRef<HTMLDivElement>(null);

  // Escala final para que la pantalla cubra el viewport
  useEffect(() => {
    const el = deviceRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cover = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.08;
    el.style.setProperty("--cover", cover.toFixed(3));
  }, []);

  return (
    <div className="intro-css-scene absolute inset-0 overflow-hidden bg-bg [perspective:1400px]">
      {/* piso de concreto */}
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(ellipse_at_50%_0%,#1a1b22,#0b0b0f_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[45%] opacity-40 mix-blend-overlay [background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='.55' numOctaves='4'/></filter><rect width='100%' height='100%' filter='url(%23c)'/></svg>&quot;)]" />
      {/* rayo de luz duro */}
      <div className="intro-css-beam absolute -left-[20%] top-[58%] h-16 w-[140%] bg-[linear-gradient(90deg,transparent,rgb(255_255_255/.18)_40%,rgb(255_240_250/.32)_55%,transparent)] blur-[2px]" />

      <div
        ref={deviceRef}
        className="intro-css-device absolute left-1/2 top-1/2 aspect-[16/10] w-[min(86vw,900px)] rounded-[clamp(14px,2vw,28px)] border border-white/15 bg-[#121318] p-[1.1%] shadow-[0_40px_120px_-30px_rgb(0_0_0/.9),0_0_0_1px_rgb(255_210_234/.08),inset_0_1px_0_rgb(255_220_240/.35)] [transform-style:preserve-3d]"
      >
        <div className="relative h-full w-full overflow-hidden rounded-[clamp(10px,1.4vw,20px)] bg-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/intro/site.webp" alt="" loading="lazy" decoding="async" className="intro-css-scroll absolute inset-x-0 top-0 w-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/intro/site.webp" alt="" loading="lazy" decoding="async" className="intro-css-top absolute inset-x-0 top-0 w-full" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgb(255_255_255/.1),transparent_35%)]" />
        </div>
      </div>
    </div>
  );
}
