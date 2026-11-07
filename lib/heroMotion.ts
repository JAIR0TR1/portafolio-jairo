"use client";

import { motionValue } from "motion/react";

/**
 * Valores compartidos por las DOS capas del Hero (base y revelada dentro de la mancha).
 * Al ser los mismos valores, la inclinación, el parallax y el salto del saludo de ambas
 * capas son idénticos en cada frame y nunca se desalinean.
 */
export const heroPointer = {
  x: motionValue(0),
  y: motionValue(0),
};

/** Desplazamiento vertical del saludo (salto), compartido por ambas capas. */
export const heroJump = motionValue(0);

/** Pseudoaleatorio determinista (mismo resultado en ambas capas para el mismo instante). */
export function hash01(n: number) {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}
