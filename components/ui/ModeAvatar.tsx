"use client";

import Image from "next/image";
import { HYBRID, JAIRO_SRC, poses, type Expression, type PoseId } from "@/data/avatar";
import type { ModeId } from "@/lib/mode";
import { AvatarBot } from "./AvatarBot";
import { RobotEyes } from "./RobotEyes";
import { cn } from "@/lib/cn";

/** Imágenes presentes en public/avatar al compilar (ver next.config.ts). Si falta una, respaldo SVG. */
const AVAILABLE: string[] = JSON.parse(process.env.NEXT_PUBLIC_AVATAR_IMAGES ?? "[]");
const has = (src: string) => AVAILABLE.includes(src.replace("/avatar/", ""));

type FigureProps = { className?: string; priority?: boolean; sizes?: string };
const SIZES = "(min-width: 1024px) 420px, 60vw";

/** Caja con la proporción de las imágenes (530×952). */
function Frame({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("relative aspect-[530/952]", className)}>{children}</div>;
}

export function RobotFigure({
  pose = "base",
  expression = "neutral",
  className,
  priority,
  sizes = SIZES,
}: FigureProps & { pose?: PoseId; expression?: Expression }) {
  const p = poses[pose];
  return (
    <Frame className={className}>
      {has(p.src) ? (
        <>
          <Image src={p.src} alt="" fill preload={priority} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-contain" />
          <RobotEyes eyes={p.eyes} expression={expression} />
        </>
      ) : (
        <AvatarBot uid={`fb-${pose}`} className="absolute inset-x-0 bottom-[6%] h-auto w-full" />
      )}
    </Frame>
  );
}

export function JairoFigure({ className, priority, sizes = SIZES }: FigureProps) {
  return (
    <Frame className={className}>
      {has(JAIRO_SRC) ? (
        <Image src={JAIRO_SRC} alt="" fill preload={priority} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-contain" />
      ) : (
        <AvatarBot uid="fb-jairo" className="absolute inset-x-0 bottom-[6%] h-auto w-full" />
      )}
    </Frame>
  );
}

/**
 * Híbrido por código: Jairo debajo y el robot encima con una máscara vertical.
 * A la izquierda de --split se ve Jairo, a la derecha el robot. La costura brilla con --accent.
 * El contenedor que lo usa actualiza --split (seguimiento del mouse / dedo / oscilación).
 */
export function HybridFigure({ className, priority, sizes = SIZES }: FigureProps) {
  const { dx, dy, scale } = HYBRID.robot;
  const robot = poses.base;
  return (
    <Frame className={cn("hybrid", className)}>
      <Image src={JAIRO_SRC} alt="" fill preload={priority} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-contain" />
      <div
        className="hybrid-robot absolute inset-0"
        style={{ transform: `translate(${dx}%, ${dy}%) scale(${scale})` }}
      >
        <Image src={robot.src} alt="" fill preload={priority} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-contain" />
        <RobotEyes eyes={robot.eyes} />
      </div>
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

/** Personaje de cada modo del Hero. */
export function ModeFigure({ id, ...props }: FigureProps & { id: ModeId }) {
  if (id === "jairo") return <JairoFigure {...props} />;
  if (id === "dev") return <RobotFigure pose="base" {...props} />;
  return <HybridFigure {...props} />;
}
