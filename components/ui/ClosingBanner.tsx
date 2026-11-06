import { ArrowDown } from "lucide-react";
import { FocusLink } from "./FocusLink";
import { DecodeText, SectionTab } from "./SectionTab";

/** Banner de cierre: piso de cuadrícula en perspectiva + orbe con el --accent actual. */
export function ClosingBanner() {
  return (
    <div className="relative isolate overflow-hidden rounded-[8px] border border-line bg-card px-6 pb-24 pt-20 text-center md:pb-36 md:pt-28">
      {/* piso en perspectiva */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] [perspective:520px]">
        <div className="grid-floor absolute inset-x-[-50%] bottom-[-10%] top-0 origin-bottom [transform:rotateX(62deg)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-card to-transparent" />

      <SectionTab index="06" label="Contacto" className="mb-6" />
      <h2 id="contacto-title" className="text-display mx-auto max-w-[14ch] text-[clamp(2.5rem,1.2rem+4.4vw,5rem)] text-balance">
        <DecodeText text="¿Tienes una idea grande? Hablemos." />
      </h2>
      <p className="mx-auto mt-6 max-w-md text-pretty text-lg text-muted">
        Cuéntame qué quieres construir y te respondo por correo.
      </p>
      <FocusLink target="formulario" className="btn btn-primary mt-10">
        Escribir mensaje <ArrowDown aria-hidden="true" />
      </FocusLink>
    </div>
  );
}
