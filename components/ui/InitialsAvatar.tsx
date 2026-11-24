import Image from "next/image";
import { cn } from "@/lib/cn";

const gradients = ["from-ink/20 to-ink/5", "from-ink/15 to-ink/[.03]", "from-ink/25 to-ink/[.06]"];

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
  photoAlt,
}: {
  name: string;
  /** Texto alternativo de la foto (ya traducido). */
  photoAlt: string;
  src?: string;
  index?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br font-mono text-sm font-semibold text-ink ring-1 ring-line-2",
        gradients[index % gradients.length],
        className,
      )}
    >
      {src ? <Image src={src} alt={photoAlt} fill sizes="48px" className="object-cover" /> : <span aria-hidden="true">{initialsOf(name)}</span>}
    </span>
  );
}
