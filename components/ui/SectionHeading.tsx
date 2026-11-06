import type { ReactNode } from "react";
import { Reveal, RevealItem } from "./Reveal";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  className?: string;
  align?: "left" | "center";
};

/** Encabezado de sección: número + etiqueta mono, título display y bajada opcional. */
export function SectionHeading({ index, eyebrow, title, description, id, className, align = "left" }: Props) {
  return (
    <Reveal
      stagger
      className={cn(
        "mb-12 flex flex-col gap-5 md:mb-16",
        align === "center" ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", align === "center" && "items-center")}>
        <RevealItem>
          <p className="text-eyebrow flex items-center gap-3 text-muted">
            <span className="text-ink">{index}</span> / 07
            <span aria-hidden="true" className="h-px w-8 bg-line" />
            {eyebrow}
          </p>
        </RevealItem>
        <RevealItem>
          <h2 id={id} className="text-display max-w-[16ch] text-[clamp(2.25rem,1.2rem+3.6vw,4rem)] text-balance">
            {title}
          </h2>
        </RevealItem>
      </div>
      {description ? (
        <RevealItem className={cn("max-w-md text-pretty text-muted md:text-lg", align === "center" && "mx-auto")}>
          {description}
        </RevealItem>
      ) : null}
    </Reveal>
  );
}
