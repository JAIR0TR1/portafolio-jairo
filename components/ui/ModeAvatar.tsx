"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { HYBRID, JAIRO_SRC, poses, type Expression, type PoseId } from "@/data/avatar";
import type { ModeId } from "@/lib/mode";
import { AvatarBot } from "./AvatarBot";
import { RobotEyes } from "./RobotEyes";
import { cn } from "@/lib/cn";

/** Imágenes presentes en public/avatar al compilar (ver next.config.ts). Si falta una, respaldo SVG. */
const AVAILABLE: string[] = JSON.parse(process.env.NEXT_PUBLIC_AVATAR_IMAGES ?? "[]");
const has = (src: string) => AVAILABLE.includes(src.replace("/avatar/", ""));

/** Calidad de las imágenes del personaje (permitida en next.config images.qualities). */
export const AVATAR_QUALITY = 90;

type FigureProps = { className?: string; priority?: boolean; sizes?: string; shadow?: boolean };
/** El personaje mide ~0.75 × el alto del escenario; en retina se pide el doble (máx. 765 px de origen). */
const SIZES = "(min-width: 1024px) 560px, 80vw";

/** Props de carga de next/image (en Next 16 `priority` pasó a llamarse `preload`). */
function load(priority?: boolean) {
  return priority ? ({ preload: true, loading: "eager", fetchPriority: "high" } as const) : {};
}

/** Caja con la proporción de las imágenes (765×1024) y sombra de contacto bajo los pies. */
function Frame({ className, shadow = true, children }: { className?: string; shadow?: boolean; children: ReactNode }) {
  return (
    <div className={cn("relative aspect-[765/1024]", className)}>
      {shadow && <span aria-hidden="true" className="contact-shadow" />}
      {children}
    </div>
  );
}

export function RobotFigure({
  pose = "base",
  expression = "neutral",
  className,
  priority,
  sizes = SIZES,
  shadow,
}: FigureProps & { pose?: PoseId; expression?: Expression }) {
  const p = poses[pose];
  return (
    <Frame className={className} shadow={shadow}>
      {has(p.src) ? (
        <>
          <Image src={p.src} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="object-contain" {...load(priority)} />
          <RobotEyes eyes={p.eyes} expression={expression} />
        </>
      ) : (
        <AvatarBot uid={`fb-${pose}`} className="absolute inset-x-[12%] bottom-[6%] h-auto" />
      )}
    </Frame>
  );
}

export function JairoFigure({ className, priority, sizes = SIZES, shadow }: FigureProps) {
  return (
    <Frame className={className} shadow={shadow}>
      {has(JAIRO_SRC) ? (
        <Image src={JAIRO_SRC} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="object-contain" {...load(priority)} />
      ) : (
        <AvatarBot uid="fb-jairo" className="absolute inset-x-[12%] bottom-[6%] h-auto" />
      )}
    </Frame>
  );
}

/** Capa del robot alineada sobre Jairo (mismo lienzo, ajuste fino de la cabeza en data/avatar.ts). */
export function AlignedRobot({
  sizes = SIZES,
  priority,
  eyes = true,
  className,
}: {
  sizes?: string;
  priority?: boolean;
  eyes?: boolean;
  className?: string;
}) {
  const { dx, dy, scale } = HYBRID.robot;
  return (
    <div className={cn("absolute inset-0", className)} style={{ transform: `translate(${dx}%, ${dy}%) scale(${scale})` }}>
      <Image src={poses.base.src} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="object-contain" {...load(priority)} />
      {eyes && <RobotEyes eyes={poses.base.eyes} />}
    </div>
  );
}

/**
 * Híbrido por código: Jairo debajo y el robot encima con una máscara vertical.
 * A la izquierda de --split se ve Jairo, a la derecha el robot. La costura brilla con --accent.
 */
export function HybridFigure({ className, priority, sizes = SIZES, shadow }: FigureProps) {
  return (
    <Frame className={cn("hybrid", className)} shadow={shadow}>
      <Image src={JAIRO_SRC} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="object-contain" {...load(priority)} />
      <AlignedRobot sizes={sizes} priority={priority} className="hybrid-robot" />
      {/* costura de luz recortada a la silueta */}
      <div aria-hidden="true" className="hybrid-seam pointer-events-none absolute inset-0">
        <span className="hybrid-line" />
        {[14, 24, 37, 49, 62, 76].map((top, i) => (
          <span key={top} className="hybrid-spark" style={{ top: `${top}%`, animationDelay: `${i * -0.37}s`, ["--dir" as string]: i % 2 ? 1 : -1 }} />
        ))}
      </div>
    </Frame>
  );
}

/* ───── Personajes «B» (los que revela la mancha líquida del Hero) ───── */

/** Robot alineado al encuadre de Jairo (Jairo → su robot). */
export function RobotAligned({ className, sizes = SIZES, shadow }: FigureProps) {
  return (
    <Frame className={className} shadow={shadow}>
      <AlignedRobot sizes={sizes} />
    </Frame>
  );
}

/** Jairo alineado al encuadre del robot (desfase inverso de HYBRID): Desarrollador → la persona. */
export function JairoAligned({ className, sizes = SIZES, shadow }: FigureProps) {
  const { dx, dy, scale } = HYBRID.robot;
  return (
    <Frame className={className} shadow={shadow}>
      <div className="absolute inset-0" style={{ transform: `scale(${1 / scale}) translate(${-dx}%, ${-dy}%)` }}>
        <Image src={JAIRO_SRC} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="object-contain" />
      </div>
    </Frame>
  );
}

/**
 * Robot «circuito» hecho por código (IA → su interior): escala de grises con contraste,
 * tinte del acento, rejilla de 8 px y scanlines, todo recortado a la silueta del robot
 * y alineado como en el híbrido.
 */
export function CircuitFigure({ className, sizes = SIZES, shadow }: FigureProps) {
  const { dx, dy, scale } = HYBRID.robot;
  return (
    <Frame className={className} shadow={shadow}>
      <div className="absolute inset-0" style={{ transform: `translate(${dx}%, ${dy}%) scale(${scale})` }}>
        <Image src={poses.base.src} alt="" fill quality={AVATAR_QUALITY} sizes={sizes} className="circuit-img object-contain" />
        <span className="circuit-tint absolute inset-0" />
        <span className="circuit-grid absolute inset-0" />
        <span className="circuit-scan absolute inset-0" />
      </div>
    </Frame>
  );
}

/** Personaje de cada modo del Hero. */
export function ModeFigure({ id, ...props }: FigureProps & { id: ModeId }) {
  if (id === "jairo") return <JairoFigure {...props} />;
  if (id === "dev") return <RobotFigure pose="base" {...props} />;
  return <HybridFigure {...props} />;
}
