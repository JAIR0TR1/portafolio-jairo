import Image from "next/image";
import { BookOpen, GraduationCap, MapPin, Sparkles } from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { aboutTech } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TechIcon, tagToIcon } from "@/components/ui/TechIcon";

const facts = [
  { icon: MapPin, label: "Ubicación", value: profile.location },
  { icon: GraduationCap, label: "Universidad", value: profile.university },
  { icon: BookOpen, label: "Semestre", value: profile.semester },
  { icon: Sparkles, label: "Intereses", value: profile.interests.join(" · ") },
];

/** Web, móvil, escritorio y reloj (según los proyectos). TODO(Jairo): confirmar */
const platforms = 4;

export default function About() {
  return (
    <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="sobre-mi-title"
          index="01"
          eyebrow="Sobre mí"
          title={
            <>
              Diseño y código, en el <span className="serif-accent text-accent">mismo</span> lugar.
            </>
          }
        />

        <Reveal stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {/* Foto / ilustración — destino del avatar viajero (F3) */}
          <RevealItem className="lg:col-span-5 lg:row-span-2">
            <figure
              data-avatar-target
              className="glass spotlight relative h-full min-h-[360px] overflow-hidden md:min-h-[440px]"
            >
              {profile.photo ? (
                <Image
                  src={profile.photo}
                  alt={`Foto de ${profile.name}`}
                  fill
                  sizes="(min-width: 1024px) 460px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div aria-hidden="true" className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_110%,color-mix(in_oklab,var(--accent)_70%,transparent),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_20%_10%,rgb(124_92_255/.35),transparent)]" />
                  <span className="absolute inset-0 grid place-items-center font-serif text-[clamp(7rem,14vw,11rem)] italic leading-none tracking-tight text-ink/90 [text-shadow:0_10px_60px_var(--accent)]">
                    {profile.initials}
                  </span>
                </div>
              )}
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
                <span>
                  <span className="block text-sm font-medium">{profile.name}</span>
                  <span className="block font-mono text-xs text-muted">{profile.role}</span>
                </span>
                <MapPin aria-hidden="true" className="size-4 shrink-0 text-accent" />
              </figcaption>
            </figure>
          </RevealItem>

          {/* Párrafo */}
          <RevealItem className="md:order-first md:col-span-2 lg:order-none lg:col-span-7">
            <div className="glass spotlight flex h-full flex-col justify-between gap-8 p-6 md:p-8">
              <p className="text-pretty text-lg leading-relaxed text-ink/90 md:text-xl">{profile.about}</p>
              <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
                {[
                  { n: `${projects.length}`, l: "proyectos" },
                  { n: `${platforms}`, l: "plataformas" },
                  { n: "1", l: "emprendimiento" },
                ].map((s) => (
                  <div key={s.l}>
                    <dt className="sr-only">{s.l}</dt>
                    <dd className="font-mono text-3xl tracking-tight text-ink md:text-4xl">
                      {s.n}
                      <span className="text-accent">+</span>
                    </dd>
                    <dd className="mt-1 text-sm text-muted">{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealItem>

          {/* Datos rápidos */}
          <RevealItem className="lg:col-span-4">
            <div className="glass spotlight h-full p-6">
              <h3 className="text-eyebrow mb-5 text-muted">Datos rápidos</h3>
              <dl className="space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent" />
                    <div>
                      <dt className="font-mono text-xs text-muted">{label}</dt>
                      <dd className="text-[15px] text-ink">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </RevealItem>

          {/* Tecnologías */}
          <RevealItem className="md:col-span-2 lg:col-span-3">
            <div className="glass spotlight h-full p-6">
              <h3 className="text-eyebrow mb-5 text-muted">Con lo que trabajo</h3>
              <ul className="flex flex-wrap gap-2">
                {aboutTech.map((t) => (
                  <li key={t} className="chip">
                    {tagToIcon[t] ? <TechIcon name={tagToIcon[t]} className="size-3.5 text-ink/80" /> : null}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
