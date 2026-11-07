import { ArrowUpRight, BadgeCheck, Package, Smartphone } from "lucide-react";
import { business } from "@/data/business";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { Gallery } from "@/components/ui/Gallery";
import { publicImages } from "@/lib/publicImages";

const offerIcons = [Smartphone, BadgeCheck, Package];

// Se leen al compilar: si las carpetas están vacías, esos bloques no se muestran.
const products = publicImages(business.productsDir, "Producto de @jairovende_");
const clients = publicImages(business.clientsDir, "Cliente de @jairovende_");

/** Sección extra de la guía: el emprendimiento @jairovende_. */
export default function Emprendimiento() {
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
          <RevealItem className="lg:col-span-5">
            <div className="glass spotlight relative flex h-full flex-col justify-between gap-8 overflow-hidden p-6 md:p-8">
              <span aria-hidden="true" className="biz-glow" />
              <div className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">Fundador · Pasto, Nariño</p>
                <p className="mt-3 text-pretty text-lg leading-relaxed text-ink md:text-xl">{business.intro}</p>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <a href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <WhatsappIcon /> Escríbeme por WhatsApp
                  <span className="sr-only"> (abre en otra pestaña)</span>
                </a>
                <a href={business.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <InstagramIcon /> Ver en Instagram <ArrowUpRight aria-hidden="true" className="opacity-60" />
                  <span className="sr-only"> (abre en otra pestaña)</span>
                </a>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="lg:col-span-7">
            <ul className="grid h-full gap-3" aria-label="Qué vendo">
              {business.offer.map((o, i) => {
                const Icon = offerIcons[i];
                return (
                  <li key={o.title} className="glass spotlight flex items-center gap-4 p-5 md:p-6">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[12px] border border-line-2 text-ink">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-[-0.02em]">{o.title}</h3>
                      <p className="mt-0.5 text-pretty text-[15px] leading-relaxed text-muted">{o.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </RevealItem>
        </Reveal>

        {products.length > 0 && (
          <Reveal className="mt-12">
            <h3 className="text-eyebrow mb-4 text-muted">Productos</h3>
            <Gallery images={products} label="Productos de @jairovende_" />
          </Reveal>
        )}

        {clients.length > 0 && (
          <Reveal className="mt-12">
            <h3 className="text-eyebrow mb-4 text-muted">Clientes @jairovende_</h3>
            <Gallery images={clients} label="Entregas y reseñas de clientes de @jairovende_" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
