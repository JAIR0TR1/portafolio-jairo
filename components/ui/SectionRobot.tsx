"use client";

import { motion } from "motion/react";
import { sectionBubble, sectionRobot } from "@/data/avatar";
import { useReducedEffects } from "@/lib/effects";
import { RobotFigure } from "./ModeAvatar";

/**
 * Celular y tablet (< 1024 px): el robot aparece DENTRO de la sección, junto al encabezado,
 * con la pose de la sección y una burbuja corta. ~120 px de alto, completo, nunca tapa texto
 * (ocupa su propia fila). Entra con fade + subida + pequeño rebote y luego flota suave.
 * En escritorio lo reemplaza la columna fija (RobotCompanion).
 */
export function SectionRobot({ section }: { section: string }) {
  const reduced = useReducedEffects();
  const cfg = sectionRobot[section];
  const bubble = sectionBubble[section];
  if (!cfg) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="flex w-[132px] shrink-0 flex-col items-end gap-1 lg:hidden"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={reduced ? { duration: 0.3 } : { type: "spring", stiffness: 260, damping: 14, mass: 0.8 }}
    >
      {bubble && (
        <span className="max-w-[132px] rounded-[12px] rounded-br-[4px] border border-line-2 bg-card px-3 py-2 text-right text-[13px] font-medium leading-snug text-ink shadow-[var(--shadow)]">
          {bubble}
        </span>
      )}
      <div className="animate-float h-[120px] w-[90px]">
        <RobotFigure pose={cfg.pose} expression={cfg.expression} className="h-full" sizes="96px" shadow={false} />
      </div>
    </motion.div>
  );
}
