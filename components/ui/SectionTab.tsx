import { cn } from "@/lib/cn";

/** Etiqueta de sección en mono: «02 / Sobre mí» (el número en el pastel del modo). */
export function SectionTab({ index, label, className }: { index: string; label: string; className?: string }) {
  return (
    <p className={cn("text-label text-muted", className)}>
      <span className="text-accent">{index}</span> / {label}
    </p>
  );
}
