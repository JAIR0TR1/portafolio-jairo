import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { ArrowDownToLine, FileText, GraduationCap, MapPin, Target } from "lucide-react";
import { keyFacts, profile, sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { CvViewer } from "@/components/ui/CvViewer";

const factIcons = [GraduationCap, Target, MapPin];

/** La foto real solo se muestra si el archivo existe en public/ (se comprueba al compilar). */
const hasPhoto = existsSync(join(process.cwd(), "public", profile.photo));

export default function About() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading id="sobre-mi-title" index={sectionIndex("sobre-mi")} eyebrow="Sobre mí" title="Diseño y código, en el mismo lugar." />

        <Reveal stagger className="grid gap-4 lg:grid-cols-12">
          {hasPhoto && (
            <RevealItem className="lg:col-span-4 lg:row-span-2">
              <figure className="photo-frame relative mx-auto aspect-[3/4] w-full max-w-[420px] overflow-hidden rounded-[20px] lg:max-w-none">
                <Image
                  src={profile.photo}
                  alt={`Foto de ${profile.name}`}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 768px) 420px, 100vw"
                  quality={90}
                  className="object-cover object-[50%_42%]"
                />
              </figure>
            </RevealItem>
          )}

          {/* Párrafo + intereses */}
          <RevealItem className={hasPhoto ? "lg:col-span-8" : "lg:col-span-7"}>
            <div className="glass spotlight flex h-full flex-col justify-between gap-8 p-6 md:p-8">
              <p className="max-w-[65ch] text-pretty text-body text-ink">{profile.about}</p>
              <div>
                <h3 className="text-label mb-3 text-muted">Fuera del código</h3>
                <ul className="flex flex-wrap gap-2">
                  {profile.interests.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealItem>

          {/* 3 datos clave */}
          <RevealItem className={hasPhoto ? "lg:col-span-8" : "lg:col-span-5"}>
            <dl className={hasPhoto ? "glass spotlight grid h-full gap-6 p-6 sm:grid-cols-3 md:p-8" : "glass spotlight grid h-full gap-6 p-6 md:p-8"}>
              {keyFacts.map(({ label, value }, i) => {
                const Icon = factIcons[i];
                return (
                  <div key={label}>
                    <dt className="flex flex-col gap-3 text-label text-muted">
                      <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-line-2 text-accent">
                        <Icon className="size-[18px]" />
                      </span>
                      {label}
                    </dt>
                    <dd className="mt-1 text-body text-ink">{value}</dd>
                  </div>
                );
              })}
            </dl>
          </RevealItem>

          {/* Hoja de vida */}
          <RevealItem className="lg:col-span-12">
            <div className="glass spotlight flex h-full flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-[12px] bg-[image:var(--grad-soft)] text-[#1e1c1a]">
                  <FileText aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-h3">Hoja de vida</h3>
                  <p className="mt-1 max-w-[52ch] text-pretty text-body text-muted">
                    Mi formación, proyectos y tecnologías, listos para revisar o descargar.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <CvViewer />
                <a href="/cv.pdf" download className="btn btn-primary">
                  Descargar CV <ArrowDownToLine aria-hidden="true" />
                </a>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
