"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Expression, Eyes } from "@/data/avatar";
import { useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

/** Forma del ojo abierto según la expresión (viewBox 10×24). */
function OpenShape({ expression }: { expression: Expression }) {
  if (expression === "focus") return <rect x="1" y="9" width="8" height="12" rx="4" />;
  if (expression === "curious") return <rect x="0.5" y="-1.5" width="9" height="27" rx="4.5" />;
  return <rect x="1" y="0" width="8" height="24" rx="4" />;
}

function Eye({ expression, className, style }: { expression: Expression; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 10 24" className={cn("absolute top-0 h-full overflow-visible", className)} style={style}>
      <g className="eye-open">
        <OpenShape expression={expression} />
      </g>
      <path className="eye-happy" d="M1 17 Q5 4 9 17" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Ojos del robot dibujados por código dentro del visor (vidrio negro vacío de la imagen).
 * Siguen el cursor (--lx/--ly del contenedor, de -1 a 1), parpadean al azar, sonríen al
 * pasar el mouse por el personaje (.group:hover) y cambian de expresión por sección.
 */
export function RobotEyes({ eyes, expression = "neutral", className }: { eyes: Eyes; expression?: Expression; className?: string }) {
  const reduced = useReducedEffects();
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let t: number;
    let t2: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        t2 = window.setTimeout(() => setBlink(false), 130);
        loop();
      }, 2400 + Math.random() * 3200);
    };
    loop();
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  const { cx, cy, gap, w, h, rot, far } = eyes;
  const box = gap + w;
  const eyeW = `${(w / box) * 100}%`;

  return (
    <div
      aria-hidden="true"
      data-expr={expression}
      data-blink={blink}
      className={cn("robot-eyes pointer-events-none absolute text-accent", className)}
      style={{
        left: `${cx}%`,
        top: `${cy}%`,
        width: `${box}%`,
        height: `${h}%`,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
      }}
    >
      <div className="eyes-look absolute inset-0">
        {/* ojo lejano (la cabeza está girada 3/4 a la izquierda) */}
        <Eye expression={expression} className="eye-far left-0" style={{ width: eyeW, scale: `${far}` }} />
        <Eye expression={expression} className="eye-near right-0" style={{ width: eyeW }} />
      </div>
    </div>
  );
}
