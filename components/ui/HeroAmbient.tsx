"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { JAIRO_SRC, poses } from "@/data/avatar";
import { MODES, useModeIndex } from "@/lib/mode";

const SRC = { jairo: JAIRO_SRC, dev: poses.base.src, ai: JAIRO_SRC } as const;

/**
 * Luz ambiental DETRÁS de la tarjeta del Hero: el personaje del modo actual muy ampliado,
 * desenfocado (40 px), oscurecido (.35) y teñido con --accent. Solo se ve en el margen que
 * rodea la tarjeta, como si el personaje iluminara la sala. Oculto en móvil (rendimiento).
 */
export function HeroAmbient() {
  const id = MODES[useModeIndex()].id;
  return (
    <div aria-hidden="true" className="hero-ambient pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={SRC[id]} alt="" fill sizes="320px" quality={75} className="hero-ambient-img object-contain" />
        </motion.div>
      </AnimatePresence>
      <span className="hero-ambient-tint absolute inset-0" />
    </div>
  );
}
