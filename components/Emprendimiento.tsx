import { ArrowUpRight, BadgeCheck, CreditCard, Smartphone } from "lucide-react";
import { business } from "@/data/business";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Gallery } from "@/components/ui/Gallery";
import { ClientVideo } from "@/components/ui/ClientVideo";
import { publicImages, publicVideos } from "@/lib/publicImages";

const offerIcons = [Smartphone, BadgeCheck, CreditCard];

// Se leen al compilar: si las carpetas están vacías, esos bloques no se muestran.
const flyers = publicImages(business.flyersDir, "Flyer de @jairovende_", business.alts);
const clientPhotos = publicImages(business.clientsDir, "Cliente de @jairovende_");
const clientVideos = publicVideos(business.clientVideosDir);

/** Sección extra de la guía: el emprendimiento @jairovende_. */
export default function Emprendimiento() {
  const hasClients = clientVideos.length > 0 || clientPhotos.length > 0;
  return (
    <section id="emprendimiento" aria-labelledby="emprendimiento-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="emprendimiento-title"
          index={sectionIndex("emprendimiento")}
          eyebrow="Emprendimiento"
          title="@jairovende_"
          description={business.slogan}
        />

        <Reveal stagger className="grid gap-4 lg:grid-cols-12">
          <RevealItem className="lg:col-span-6">
            <div className="glass spotlight flex h-full flex-col justify-between gap-8 p-6 md:p-8">
              <div>
                <p className="text-label text-muted">Fundador · Pasto, Nariño</p>
                <p className="mt-4 max-w-[60ch] text-pretty text-body text-ink">{business.intro}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <InstagramIcon /> Ver en Instagram <ArrowUpRight aria-hidden="true" />
                  <span className="sr-only"> (abre en otra pestaña)</span>
                </a>
                <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <WhatsappIcon /> Escríbeme por WhatsApp
                  <span className="sr-only"> (abre en otra pestaña)</span>
                </a>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="lg:col-span-6">
            <ul className="grid h-full gap-4" aria-label="Qué ofrezco">
              {business.offer.map((o, i) => {
                const Icon = offerIcons[i];
                return (
                  <li key={o.title} className="glass spotlight flex items-center gap-4 p-6">
                    <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-line-2 text-accent">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-h3">{o.title}</h3>
                      <p className="mt-1 text-pretty text-small text-muted">{o.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </RevealItem>
        </Reveal>

        {(flyers.length > 0 || hasClients) && (
          <Reveal stagger className="mt-16 grid gap-x-4 gap-y-12 lg:grid-cols-3">
            {flyers.length > 0 && (
              <RevealItem>
                <h3 className="text-h3">Catálogo</h3>
                <p className="mt-1 text-small text-muted">Promociones y referencias disponibles.</p>
                <Gallery images={flyers} label="Flyers de @jairovende_" className="mt-6 grid gap-4" aspect="aspect-[9/16]" fit="object-contain" />
              </RevealItem>
            )}
            {hasClients && (
              <RevealItem className={flyers.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                <h3 className="text-h3">Lo que dicen mis clientes</h3>
                <p className="mt-1 text-small text-muted">Videos de clientes de @jairovende_.</p>
                {clientVideos.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-4">
                    {clientVideos.map((v, i) => (
                      <li key={v.src}>
                        <ClientVideo src={v.src} poster={v.poster} label={`Video de cliente ${i + 1} de @jairovende_`} />
                      </li>
                    ))}
                  </ul>
                )}
                {clientPhotos.length > 0 && (
                  <Gallery images={clientPhotos} label="Fotos de clientes de @jairovende_" className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3" />
                )}
              </RevealItem>
            )}
          </Reveal>
        )}
      </div>
    </section>
  );
}
