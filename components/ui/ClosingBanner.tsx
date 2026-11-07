import { WhatsappIcon } from "./BrandIcons";
import { DecodeText, SectionTab } from "./SectionTab";
import { profile, sectionIndex } from "@/data/profile";

/** Banner de cierre de Contacto: luz del degradado del modo detrás del título. */
export function ClosingBanner() {
  return (
    <div className="closing-banner relative isolate overflow-hidden rounded-[16px] border border-line px-6 pb-16 pt-16 text-center md:pb-24 md:pt-24">
      <SectionTab index={sectionIndex("contacto")} label="Contacto" className="mb-6" />
      <h2 id="contacto-title" className="text-display mx-auto max-w-[20ch] text-[clamp(1.6rem,1rem+2.4vw,2.9rem)] text-balance">
        <DecodeText text="Hablemos." />
      </h2>
      <p className="mx-auto mt-6 max-w-md text-pretty text-lg text-muted">
        Escríbeme por correo o WhatsApp, o sígueme en GitHub e Instagram.
      </p>
      <a href={profile.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-10">
        <WhatsappIcon /> Escríbeme por WhatsApp
        <span className="sr-only"> (abre en otra pestaña)</span>
      </a>
    </div>
  );
}
