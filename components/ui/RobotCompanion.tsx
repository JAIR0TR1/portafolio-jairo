"use client";

import { useEffect, useRef, useState } from "react";
import { poses, sectionRobot, type PoseId } from "@/data/avatar";
import { sections } from "@/data/profile";
import { useMediaQuery, useReducedEffects } from "@/lib/effects";
import { RobotFigure } from "./ModeAvatar";
import { cn } from "@/lib/cn";

const POSE_IDS = Object.keys(poses) as PoseId[];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Sección activa (la que cruza el centro de la ventana) + si el Hero o el footer están a la vista. */
function useScrollState() {
  const [state, setState] = useState({ active: "inicio", afterHero: false, atFooter: false, dir: 0 });
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    const read = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      let active = "inicio";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) active = s.id;
      }
      const hero = document.getElementById("inicio")?.getBoundingClientRect();
      const footer = document.getElementById("footer")?.getBoundingClientRect();
      // el Hero ya salió por completo (bajo el header): la columna nunca tapa su contenido
      const afterHero = !!hero && hero.bottom < 96;
      const atFooter = !!footer && footer.top < window.innerHeight * 0.8;
      const y = window.scrollY;
      const dir = Math.sign(y - lastY);
      lastY = y;
      setState((p) =>
        p.active === active && p.afterHero === afterHero && p.atFooter === atFooter && p.dir === dir
          ? p
          : { active, afterHero, atFooter, dir },
      );
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(frame);
    };
  }, []);
  return state;
}

/** Escritorio: columna fija a la derecha, reservada solo para el robot (nunca tapa contenido). */
function DesktopCompanion() {
  const reduced = useReducedEffects();
  const { active, afterHero, atFooter } = useScrollState();
  const figRef = useRef<HTMLDivElement>(null);
  const visible = afterHero && !atFooter;
  const cfg = sectionRobot[active] ?? { pose: "base" as PoseId, expression: "neutral" as const };
  const pose: PoseId = reduced ? "base" : cfg.pose;
  const expression = reduced ? "neutral" : cfg.expression;

  // Se inclina levemente hacia el cursor y los ojos lo siguen.
  useEffect(() => {
    if (reduced || !visible) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const el = figRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      const dx = last.clientX - (r.left + r.width / 2);
      const dy = last.clientY - (r.top + r.height * 0.17);
      el.style.setProperty("--lx", clamp(dx / (r.width * 2), -1, 1).toFixed(3));
      el.style.setProperty("--ly", clamp(dy / (r.height * 0.8), -1, 1).toFixed(3));
      el.style.setProperty("--tilt", clamp(dx / window.innerWidth, -1, 1).toFixed(3));
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced, visible]);


  return (
    <aside
      aria-hidden="true"
      className={cn(
        "companion pointer-events-none fixed bottom-0 right-0 top-[var(--header-h)] z-30 hidden w-[var(--cw)] flex-col items-center justify-center lg:flex",
        "transition-[opacity,translate] duration-700 ease-[var(--ease-out-expo)]",
        visible ? "translate-x-0 opacity-100" : "invisible translate-x-8 opacity-0",
      )}
    >
      {/* halo */}
      <div className="absolute left-1/2 top-[36%] aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_20%,transparent),transparent)]" />

      {/* alto limitado para que el ancho del lienzo (0.747 × alto) nunca supere la columna */}
      {/* margen de 40 px: la inclinación 3D y las poses con brazo extendido nunca se salen del viewport */}
      <div className={cn("relative h-[min(64vh,calc((var(--cw)-40px)/0.747))]", !reduced && "animate-float")}>
        <div
          ref={figRef}
          className={cn("companion-tilt group relative aspect-[765/1024] h-full", visible && "pointer-events-auto")}
        >
          {POSE_IDS.map((p) => (
            <div
              key={p}
              className={cn(
                "absolute inset-0 transition-[opacity,scale] duration-500 ease-[var(--ease-out-expo)]",
                p === pose ? "scale-100 opacity-100" : "scale-[.96] opacity-0",
              )}
            >
              <RobotFigure pose={p} expression={p === pose ? expression : "neutral"} className="h-full" sizes="(min-width: 1024px) 360px, 1px" />
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}

/** El robot acompaña al navegar: columna fija en escritorio (en celular vive dentro de cada sección: SectionRobot). */
export function RobotCompanion() {
  const desktop = useMediaQuery("(min-width: 1024px)");
  return desktop ? <DesktopCompanion /> : null;
}
