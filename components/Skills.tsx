import { Bot, Code2, Database, Layers, Wrench } from "lucide-react";
import { skillGroups } from "@/data/skills";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";

const icons = { lenguajes: Code2, frontend: Layers, backend: Database, herramientas: Wrench, ia: Bot } as const;

/** Habilidades por grupo, con logo y nombre (sin niveles, barras ni porcentajes). */
export default function Skills() {
  return (
    <section id="habilidades" aria-labelledby="habilidades-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="habilidades-title"
          index={sectionIndex("habilidades")}
          eyebrow="Habilidades"
          title="Mi stack, por capas."
          description="Lo que uso para diseñar, programar y publicar."
        />

        <Reveal stagger className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((g, gi) => {
            const Icon = icons[g.id as keyof typeof icons] ?? Layers;
            return (
              <RevealItem key={g.id} className={gi === skillGroups.length - 1 ? "md:col-span-2" : undefined}>
                <article className="glass spotlight h-full p-6">
                  <header className="mb-5 flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-[10px] border border-line-2 text-ink">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{g.title}</h3>
                  </header>
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
                    {g.skills.map((s) => (
                      <li key={s.name} className="skill-tile flex flex-col items-center gap-2 rounded-[10px] border border-line px-2 py-4 text-center">
                        <TechIcon name={s.icon} className="size-7" colored />
                        <span className="text-[13px] leading-tight text-ink">{s.name}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
