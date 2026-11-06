"use client";

import Image from "next/image";
import { avatarModes } from "@/data/avatar";
import { MODES, useModeIndex, type ModeId } from "@/lib/mode";
import { AvatarBot } from "./AvatarBot";
import { cn } from "@/lib/cn";

/** Imágenes presentes en public/avatar al compilar (ver next.config.ts). */
const AVAILABLE: string[] = JSON.parse(process.env.NEXT_PUBLIC_AVATAR_IMAGES ?? "[]");

export function avatarImage(id: ModeId) {
  const file = avatarModes[id].image;
  return AVAILABLE.includes(file) ? `/avatar/${file}` : null;
}

/** Personaje de un modo: su imagen si existe; si no, el robot SVG en el color del modo. */
export function AvatarFigure({
  id,
  color,
  blinking,
  uid,
  className,
  priority,
}: {
  id: ModeId;
  color?: string;
  blinking?: boolean;
  uid: string;
  className?: string;
  priority?: boolean;
}) {
  const src = avatarImage(id);
  if (src) {
    return (
      <div className={cn("relative", className)}>
        <Image src={src} alt="" fill priority={priority} sizes="(min-width: 1024px) 400px, 45vw" className="object-contain" />
      </div>
    );
  }
  return <AvatarBot uid={uid} color={color} blinking={blinking} className={className} />;
}

/** Avatar del modo activo (lo usan el avatar viajero y la tarjeta de «Sobre mí»). */
export function ModeAvatar({ uid, className }: { uid: string; className?: string }) {
  const mode = MODES[useModeIndex()];
  return <AvatarFigure id={mode.id} uid={uid} className={className} />;
}
