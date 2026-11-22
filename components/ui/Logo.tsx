import { useId } from "react";
import { cn } from "@/lib/cn";
import geometry from "./logo-geometry.json";

/**
 * Logo «JV · Forja» de Jairo Vallejo (kit completo en brand/, guía en brand/GUIA-DE-USO.md).
 * La J de acero y una V de dos hojas a 75° que no llegan a tocarse; donde se encontrarían, salta la
 * chispa. Colores: J y nombre = currentColor (siguen al tema) · V = azul acero · chispa = fuego.
 *
 *  - size "sm" (por defecto): corte pequeño, trazo más grueso y chispa más grande. Para 40 px o menos
 *    (encabezado, menú, footer, favicon).
 *  - size "lg": maestro; en tema oscuro cambia solo a la versión un 3 % más fina (irradiación).
 *  - variant "lockup": símbolo + «JAIRO VALLEJO» (Michroma convertida a trazos).
 *  - animated: entrada única (hojas → J → chispa), solo transform/opacity; nada con
 *    prefers-reduced-motion, «Reducir efectos» ni la pausa global (globals.css).
 */
type Geo = { J: string; VL: string; VR: string; spark: string; box: number[] };
const G = geometry as { master: Geo; reversed: Geo; small: Geo; wordmark: { d: string; width: number; capH: number } };

export function Logo({
  variant = "mark",
  size = "sm",
  className,
  animated = false,
  title,
}: {
  variant?: "mark" | "lockup";
  size?: "sm" | "lg";
  className?: string;
  animated?: boolean;
  /** Nombre accesible; sin él, el logo es decorativo (aria-hidden). */
  title?: string;
}) {
  const uid = useId().replaceAll(":", "");
  const fire = `jv-fire-${uid}`;
  const base = size === "sm" ? G.small : G.master;
  const [x0, y0, w, h] = base.box;
  const pad = h * 0.04;
  const lockup = variant === "lockup";
  // nombre: altura de mayúscula = 38 % del monograma, centrado en su cuerpo; separación = 1.3 × asta
  const cap = h * 0.38;
  const wmScale = cap / G.wordmark.capH;
  const gap = 40;
  const totalW = w + (lockup ? gap + G.wordmark.width * wmScale : 0);
  const viewBox = `${x0 - pad} ${y0 - pad} ${totalW + 2 * pad} ${h + 2 * pad}`;

  const shapes = (g: Geo, cls?: string) => (
    <g className={cls}>
      <path className="logo-j" fill="currentColor" d={g.J} />
      <path className="logo-vl" fill="var(--logo-steel, #2F6BFF)" d={g.VL} />
      <path className="logo-vr" fill="var(--logo-steel, #2F6BFF)" d={g.VR} />
      <path className="logo-spark" fill={`url(#${fire})`} d={g.spark} />
    </g>
  );

  return (
    <svg
      viewBox={viewBox}
      className={cn("logo-jv shrink-0", animated && "logo-animated", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={fire} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#FF5A1F" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
      </defs>
      {size === "lg" ? (
        <>
          {shapes(G.master, "logo-on-light")}
          {shapes(G.reversed, "logo-on-dark")}
        </>
      ) : (
        shapes(G.small)
      )}
      {lockup && (
        <path
          className="logo-name"
          fill="currentColor"
          transform={`translate(${x0 + w + gap} ${y0 + (h - cap) / 2}) scale(${wmScale.toFixed(5)})`}
          d={G.wordmark.d}
        />
      )}
    </svg>
  );
}
