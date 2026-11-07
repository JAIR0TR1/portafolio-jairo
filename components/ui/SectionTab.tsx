import { cn } from "@/lib/cn";

/**
 * Etiqueta de sección en mono: «02 / Sobre mí». El número alterna entre el color dominante
 * del modo y el de detalle (multicolor pero ordenado).
 */
export function SectionTab({ index, label, className }: { index: string; label: string; className?: string }) {
  const even = Number(index) % 2 === 0;
  return (
    <p className={cn("text-label text-muted", className)}>
      <span className={even ? "text-detail" : "text-accent"}>{index}</span> / {label}
    </p>
  );
}
