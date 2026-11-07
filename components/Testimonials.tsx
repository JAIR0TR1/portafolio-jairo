"use client";

import { ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import { useRef, useState } from "react";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitialsAvatar } from "@/components/ui/InitialsAvatar";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const TYPE_LABEL: Record<Testimonial["tipo"], string> = { cliente: "Cliente", academico: "Académico" };

function Card({ t, i }: { t: Testimonial; i: number }) {
  return (
    <figure className="glass spotlight flex h-full flex-col justify-between gap-8 p-6 md:p-7">
      <div className="space-y-5">
        <span className="chip">
          <span aria-hidden="true" className="size-[5px] rounded-full bg-accent" />
          {TYPE_LABEL[t.tipo]}
        </span>
        <blockquote className="text-pretty text-[17px] leading-relaxed text-ink">“{t.texto}”</blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        <InitialsAvatar name={t.nombre} src={t.foto} index={i} className="size-11 text-xs" />
        <span>
          <span className="block font-medium">{t.nombre}</span>
          <span className="block text-sm text-muted">{t.relacion}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Mientras no haya testimonios reales: 3 tarjetas discretas (solo en la rama de diseño). */
function Placeholder() {
  return (
    <div className="flex h-full flex-col items-start justify-between gap-10 rounded-[12px] border border-dashed border-line-2 p-6 md:p-7">
      <MessageSquareQuote aria-hidden="true" className="size-6 text-muted" />
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Próximamente</p>
        <p className="mt-2 text-[15px] text-muted">Opiniones de clientes y docentes, publicadas con su permiso.</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  const empty = testimonials.length === 0;
  const total = empty ? 3 : testimonials.length;

  // Carrusel (móvil): scroll-snap nativo + botones; el índice sale de la posición del scroll.
  const go = (n: number) => {
    const track = trackRef.current;
    const item = track?.children[(n + total) % total] as HTMLElement | undefined;
    item?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };
  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const w = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 1;
    setCurrent(Math.round(track.scrollLeft / (w + 16)));
  };

  return (
    <section id="testimonios" aria-labelledby="testimonios-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="testimonios-title"
          index={sectionIndex("testimonios")}
          eyebrow="Testimonios"
          title="Lo que dicen de trabajar conmigo."
          description="Clientes de @jairovende_ y compañeros o docentes de la universidad."
        />

        <Reveal stagger>
          <ul
            ref={trackRef}
            onScroll={onScroll}
            aria-roledescription="carrusel"
            aria-label="Testimonios"
            className="testimonial-track -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3"
          >
            {Array.from({ length: total }, (_, i) => (
              <RevealItem
                as="li"
                key={empty ? i : testimonials[i].nombre + i}
                className="w-[85%] shrink-0 snap-start md:w-auto"
              >
                <div aria-roledescription="diapositiva" aria-label={`${i + 1} de ${total}`} className="h-full">
                  {empty ? <Placeholder /> : <Card t={testimonials[i]} i={i} />}
                </div>
              </RevealItem>
            ))}
          </ul>
        </Reveal>

        {/* Controles del carrusel (solo móvil) */}
        <div className="mt-4 flex items-center justify-between md:hidden">
          <button type="button" onClick={() => go(current - 1)} className="btn btn-secondary btn-sm size-11 p-0" aria-label="Testimonio anterior">
            <ChevronLeft aria-hidden="true" />
          </button>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => (
              <span key={i} className={cn("h-1.5 rounded-full transition-all", i === current ? "w-6 bg-accent" : "w-1.5 bg-line-2")} />
            ))}
          </div>
          <button type="button" onClick={() => go(current + 1)} className="btn btn-secondary btn-sm size-11 p-0" aria-label="Testimonio siguiente">
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
        <p className="sr-only" aria-live="polite">
          Testimonio {current + 1} de {total}
        </p>
      </div>
    </section>
  );
}
