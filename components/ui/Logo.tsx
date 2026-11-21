import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Logotipo de Jairo Vallejo: monograma J+V en una placa de esquinas cortadas (la misma forma de
 * las pestañas del sitio). La J y la V comparten trazo: el brazo izquierdo de la V nace en el
 * remate de la J, sobre su asta. El brazo derecho de la V se corta y termina en una «chispa»
 * en degradado fuego (#FF5A1F→#FFB020).
 *
 * Variantes:
 *  - "mark": placa azul acero (#2F6BFF→#1D3D9E), trazo claro y chispa de fuego. Igual en ambos temas.
 *  - "lockup": la placa + «JAIRO VALLEJO» en Michroma (el texto toma currentColor: sigue al tema).
 *  - "mono": una sola tinta (currentColor) para fondos claros, impresión o sellos.
 * Retícula de 48 × 48 y trazo de 4.4 (2.2 px a 24 px). `animated`: el trazo se dibuja una vez al
 * cargar (CSS; nada con prefers-reduced-motion, «Reducir efectos» ni la pausa global).
 */
export type LogoVariant = "mark" | "lockup" | "mono";

/** Placa: esquinas superior izquierda e inferior derecha cortadas (como .tab-plate). */
export const LOGO_PLATE = "M9 0H48V39L39 48H0V9Z";
/** J: remate, asta y gancho. */
export const LOGO_J = "M12 12H19V29C19 36 11.5 37.5 9.5 32.5";
/** V: nace bajo el remate de la J, baja al vértice y sube hasta el corte. */
export const LOGO_V = "M19.6 13.4L28.5 35L35.6 18.6";
/** Chispa: el tramo del brazo derecho de la V después del corte. */
export const LOGO_SPARK = "M37.4 14.5L39.6 9.4";
export const LOGO_STROKE = 4.4;

export function Logo({
  variant = "mark",
  className,
  animated = false,
  title,
}: {
  variant?: LogoVariant;
  className?: string;
  animated?: boolean;
  /** Nombre accesible; sin él, el logo es decorativo (aria-hidden). */
  title?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const steel = `logo-steel-${uid}`;
  const fire = `logo-fire-${uid}`;
  const mono = variant === "mono";
  const lockup = variant === "lockup";
  const ink = mono ? "currentColor" : "#F5F3F0";
  const line = { fill: "none", stroke: ink, strokeWidth: LOGO_STROKE, strokeLinecap: "butt", strokeLinejoin: "miter" } as const;

  const mark = (
    <svg
      viewBox="0 0 48 48"
      className={cn("logo-mark shrink-0", animated && "logo-animated", lockup ? "h-full w-auto" : className)}
      role={title && !lockup ? "img" : undefined}
      aria-label={title && !lockup ? title : undefined}
      aria-hidden={title && !lockup ? undefined : true}
    >
      {!mono && (
        <defs>
          <linearGradient id={steel} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2F6BFF" />
            <stop offset="1" stopColor="#1D3D9E" />
          </linearGradient>
          <linearGradient id={fire} x1="37.4" y1="14.5" x2="39.6" y2="9.4" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF5A1F" />
            <stop offset="1" stopColor="#FFB020" />
          </linearGradient>
        </defs>
      )}
      {mono ? (
        <path d={LOGO_PLATE} fill="none" stroke="currentColor" strokeWidth="2.4" transform="translate(1.2 1.2) scale(0.95)" />
      ) : (
        <path d={LOGO_PLATE} fill={`url(#${steel})`} />
      )}
      <path className="logo-stroke logo-j" d={LOGO_J} pathLength={1} {...line} />
      <path className="logo-stroke logo-v" d={LOGO_V} pathLength={1} {...line} />
      <path className="logo-spark" d={LOGO_SPARK} {...line} stroke={mono ? "currentColor" : `url(#${fire})`} />
    </svg>
  );

  if (!lockup) return mark;
  return (
    <span role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} className={cn("inline-flex items-center gap-[0.5em]", className)}>
      {mark}
      <span className="font-hero whitespace-nowrap text-[0.36em] uppercase leading-none tracking-[0.04em] text-current">Jairo Vallejo</span>
    </span>
  );
}
