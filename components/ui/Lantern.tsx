"use client";

import Image from "next/image";
import { poses } from "@/data/avatar";
import { AlignedRobot, AVATAR_QUALITY } from "./ModeAvatar";

/**
 * Linterna de «rayos X» sobre el personaje del Hero. El contenedor (HeroAvatar) define:
 *   --hx / --hy  posición del círculo (px dentro del personaje)
 *   --hr         radio (≈ 90 px → círculo de ~180 px)
 *   --ho         0 / 1 (aparece con fade al entrar el mouse o al tocar)
 * - "xray":    Jairo → revela el robot alineado debajo («mi parte robot»).
 * - "circuit": robot → revela una versión circuito hecha por código (filtros + rejilla + scanlines).
 */
export function Lantern({ kind }: { kind: "xray" | "circuit" }) {
  return (
    <div aria-hidden="true" className="lantern pointer-events-none absolute inset-0 z-[1]">
      <div className="lantern-reveal absolute inset-0">
        {kind === "xray" ? (
          <AlignedRobot sizes="(min-width: 1024px) 560px, 80vw" />
        ) : (
          <div className="absolute inset-0">
            <Image
              src={poses.base.src}
              alt=""
              fill
              quality={AVATAR_QUALITY}
              sizes="(min-width: 1024px) 560px, 80vw"
              className="object-contain [filter:grayscale(1)_contrast(1.7)_brightness(1.15)]"
            />
            {/* tinte, rejilla de 8 px y scanlines, recortados a la silueta */}
            <span className="circuit-tint absolute inset-0" />
            <span className="circuit-grid absolute inset-0" />
          </div>
        )}
        <span className="lantern-scan absolute inset-0" />
      </div>
      <span className="lantern-ring" />
    </div>
  );
}
