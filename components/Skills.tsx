import { Bot, Code2, Database, Layers, Wrench } from "lucide-react";
import { skillGroups } from "@/data/skills";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import { LogoRing } from "@/components/ui/LogoRing";
import { fmt, tx } from "@/lib/i18n";
import { getI18n } from "@/lib/dictionaries";

const icons = { lenguajes: Code2, frontend: Layers, backend: Database, herramientas: Wrench, ia: Bot } as const;

/** Habilidades por grupo, con logo y nombre (sin niveles, barras ni porcentajes). */
export default async function Skills() {
  const { lang, t } = await getI18n();
  const all = skillGroups.flatMap((g) => g.skills);
  return (
    <section id="habilidades" aria-labelledby="habilidades-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="habilidades-title"
          index={sectionIndex("habilidades")}
          eyebrow={t.skills.eyebrow}
          title={t.skills.title}
          description={t.skills.description}
        />

        <Reveal className="mb-12">
          <LogoRing skills={all} label={fmt(t.skills.ring, { list: all.map((s) => s.name).join(", ") })} />
        </Reveal>

        <Reveal stagger className="grid gap-4 md:grid-cols-2">
          {skillGroups.map((g, gi) => {
            const Icon = icons[g.id as keyof typeof icons] ?? Layers;
            return (
              <RevealItem key={g.id} className={gi === skillGroups.length - 1 ? "md:col-span-2" : undefined}>
                <article className="glass spotlight h-full p-6">
                  <header className="mb-5 flex items-center gap-3">
                    <span className="grid size-12 place-items-center rounded-[12px] border border-line-2 text-accent">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <h3 className="text-h3">{tx(g.title, lang)}</h3>
                  </header>
                  <ul className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
                    {g.skills.map((s) => (
                      <li key={s.name} className="skill-tile flex flex-col items-center gap-2 rounded-[12px] border border-line px-2 py-4 text-center">
                        <TechIcon name={s.icon} className="size-7" colored />
                        <span className="text-small text-ink">{s.name}</span>
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
