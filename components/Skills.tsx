import { Layers, Monitor, Palette, Server } from "lucide-react";
import { skillCategories } from "@/data/skills";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { SkillMeter } from "@/components/ui/SkillMeter";
import { SkillsSwitch } from "@/components/ui/SkillsPinned";

const icons = { frontend: Layers, movil: Monitor, backend: Server, diseno: Palette } as const;

/** Versión lista (móvil, reduced-motion y sin JS). */
function SkillsList() {
  return (
    <div className="section-y container-x">
      <SectionHeading
        id="habilidades-title"
        index="07"
        eyebrow="Habilidades"
        title={
          <>
            Mi stack, por capas.
          </>
        }
        description="Niveles honestos: Aprendiendo, Cómodo o Fuerte. Sin porcentajes inventados."
      />

      <Reveal stagger className="grid gap-4 md:grid-cols-2">
        {skillCategories.map((cat, i) => {
          const Icon = icons[cat.id as keyof typeof icons] ?? Layers;
          return (
            <RevealItem key={cat.id}>
              <article className="glass spotlight h-full overflow-hidden p-6 md:p-8">
                <header className="relative mb-6 flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-[6px] border border-line-2 text-ink">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <p className="font-mono text-xs text-muted">Capa 0{i + 1}</p>
                    <h3 className="text-xl font-semibold tracking-[-0.02em]">{cat.title}</h3>
                    <p className="mt-1 text-sm text-muted">{cat.blurb}</p>
                  </div>
                </header>
                <ul className="relative space-y-4">
                  {cat.skills.map((s) => (
                    <SkillMeter key={s.name} skill={s} />
                  ))}
                </ul>
              </article>
            </RevealItem>
          );
        })}
      </Reveal>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="habilidades" aria-labelledby="habilidades-title" className="relative">
      <SkillsSwitch list={<SkillsList />} />
    </section>
  );
}
