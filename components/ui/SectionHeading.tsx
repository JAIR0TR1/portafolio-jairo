import { isValidElement, type ReactNode } from "react";
import { Reveal, RevealItem } from "./Reveal";
import { DecodeText, SectionTab } from "./SectionTab";
import { DrawLine } from "./DrawLine";
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

/** Texto plano de un título (string o fragmento con un string). */
function plain(node: ReactNode): string | null {
  if (typeof node === "string") return node;
  if (isValidElement<{ children?: ReactNode }>(node) && typeof node.props.children === "string") return node.props.children;
  return null;
}

/** Encabezado de sección: pestaña numerada, título que se decodifica y línea fina que se dibuja. */
export function SectionHeading({ index, eyebrow, title, description, id, className, align = "left" }: Props) {
  const text = plain(title);
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <Reveal
        stagger
        className={cn(
          "flex flex-col gap-5",
          align === "center" ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between",
        )}
      >
        <div className={cn("flex flex-col gap-4", align === "center" && "items-center")}>
          <RevealItem>
            <SectionTab index={index} label={eyebrow} />
          </RevealItem>
          <RevealItem>
            <h2 id={id} className="text-display max-w-[16ch] text-[clamp(2.25rem,1.2rem+3.4vw,3.75rem)] text-balance">
              {text ? <DecodeText text={text} /> : title}
            </h2>
          </RevealItem>
        </div>
        {description ? (
          <RevealItem className={cn("max-w-md text-pretty text-muted md:text-lg", align === "center" && "mx-auto")}>
            {description}
          </RevealItem>
        ) : null}
      </Reveal>
      <DrawLine className="mt-8" />
    </div>
  );
}
