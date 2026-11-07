import Image from "next/image";
import { cn } from "@/lib/cn";

const gradients = ["from-[#2a3270] to-[#151d4a]", "from-[#3b2a7a] to-[#151d4a]", "from-[#1d3a7a] to-[#151d4a]"];

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/** Foto si existe; si no, iniciales sobre degradado. */
export function InitialsAvatar({
  name,
  src,
  index = 0,
  className,
}: {
  name: string;
  src?: string;
  index?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br font-mono text-sm font-semibold text-white ring-1 ring-line-2",
        gradients[index % gradients.length],
        className,
      )}
    >
      {src ? <Image src={src} alt={`Foto de ${name}`} fill sizes="48px" className="object-cover" /> : <span aria-hidden="true">{initialsOf(name)}</span>}
    </span>
  );
}
