import { ArrowDown } from "lucide-react";
import { FocusLink } from "./FocusLink";

/** Banner de cierre: piso de cuadrícula en perspectiva + orbe con el --accent actual. */
export function ClosingBanner() {
  return (
    <div className="relative isolate overflow-hidden rounded-[32px] border border-line bg-[#07070c] px-6 pb-24 pt-20 text-center md:pb-36 md:pt-28">
      {/* orbe */}
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[86%] -z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="size-[420px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_60%,transparent),transparent)] opacity-80 md:size-[680px]" />
        <div className="absolute left-1/2 top-1/2 size-20 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft rounded-full bg-[radial-gradient(closest-side,#fff,color-mix(in_oklab,var(--accent)_80%,white)_40%,transparent)] md:size-28" />
      </div>
      {/* piso en perspectiva */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] [perspective:520px]">
        <div className="grid-floor absolute inset-x-[-50%] bottom-[-10%] top-0 origin-bottom [transform:rotateX(62deg)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-1/2 bg-gradient-to-b from-[#07070c] to-transparent" />

      <p className="text-eyebrow mb-6 flex items-center justify-center gap-3 text-muted">
        <span className="text-accent">05</span>
        <span aria-hidden="true" className="h-px w-8 bg-line" />
        Contacto
      </p>
      <h2 id="contacto-title" className="text-display mx-auto max-w-[14ch] text-[clamp(2.5rem,1.2rem+5vw,5.5rem)] text-balance">
        ¿Tienes una idea grande? <span className="serif-accent accent-word">Hablemos.</span>
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
