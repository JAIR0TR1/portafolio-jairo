import type { ReactNode } from "react";
import { Reveal, RevealItem } from "./Reveal";
import { SectionTab } from "./SectionTab";
import { cn } from "@/lib/cn";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  /** Subtítulo de una línea en --muted. */
  description?: ReactNode;
  id?: string;
  className?: string;
};

/** Encabezado idéntico en todas las secciones: «0X / SECCIÓN», título H2 y subtítulo de una línea. */
export function SectionHeading({ index, eyebrow, title, description, id, className }: Props) {
  return (
    <Reveal stagger className={cn("mb-12 flex max-w-[65ch] flex-col gap-4 md:mb-16", className)}>
      <RevealItem>
        <SectionTab index={index} label={eyebrow} />
      </RevealItem>
      <RevealItem>
        <h2 id={id} className="text-h2 text-balance">
          {title}
        </h2>
      </RevealItem>
      {description ? (
        <RevealItem>
          <p className="text-body text-pretty text-muted">{description}</p>
        </RevealItem>
      ) : null}
    </Reveal>
  );
}
