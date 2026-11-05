import { cn } from "@/lib/cn";

/** Sticker circular con monograma JV y texto que gira lento. */
export function JvSticker({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "place-items-center size-[clamp(3.25rem,2.4rem+3vw,5.25rem)] -rotate-12 rounded-full border border-white/15 bg-[#101018] align-middle shadow-[0_10px_30px_-8px_color-mix(in_oklab,var(--accent)_70%,transparent),inset_0_1px_0_rgb(255_255_255/.15)]",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id="jv-circle" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
        </defs>
        <text className="fill-muted font-mono text-[9.5px] uppercase tracking-[.28em]">
          <textPath href="#jv-circle">diseño · código · ia · </textPath>
        </text>
      </svg>
      <span className="font-serif text-[clamp(1rem,.8rem+1vw,1.6rem)] italic tracking-tight text-ink">JV</span>
    </span>
  );
}
