import { cn } from "@/lib/cn";

/** Ícono "holográfico": borde con gradiente cónico iridiscente (lima · magenta · cian · violeta). */
export function HoloIcon({ label, className }: { label: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "holo relative grid size-11 shrink-0 place-items-center rounded-[14px] p-px",
        className,
      )}
    >
      <span className="relative grid size-full place-items-center overflow-hidden rounded-[13px] bg-[#0d0d14] font-mono text-sm font-semibold text-ink">
        <span className="holo-shine absolute inset-0" />
        <span className="relative">{label}</span>
      </span>
    </span>
  );
}
