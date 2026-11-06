"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { TechIcon, tagToIcon } from "@/components/ui/TechIcon";
import { EASE, useReducedEffects } from "@/lib/effects";
import { cn } from "@/lib/cn";

const ALL = "Todos";

/** Filtros = tecnologías más usadas (máx. 7), calculadas desde los datos. */
function useFilters() {
  return useMemo(() => {
    const count = new Map<string, number>();
    projects.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
    const top = [...count.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
      .slice(0, 7)
      .map(([t]) => t);
    return [ALL, ...top];
  }, []);
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedEffects();
  const published = project.status !== "en-desarrollo";
  return (
    <article className="glass spotlight group flex h-full flex-col overflow-hidden transition-colors duration-300 hover:border-[#3a3a3a]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[7px] border-b border-line grayscale">
        {/* La portada sale de la oscuridad con un barrido de luz al entrar en pantalla */}
        <motion.div
          className="absolute inset-0"
          initial={{ filter: "brightness(0.12) saturate(0.3)" }}
          animate={reduced ? { filter: "brightness(1) saturate(1)" } : undefined}
          whileInView={{ filter: "brightness(1) saturate(1)" }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
        >
          <ProjectCover project={project} priority={index < 2} />
        </motion.div>
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-[60%] w-[60%]"
          initial={reduced ? { opacity: 0 } : { x: "0%", opacity: 1 }}
          whileInView={{ x: "300%", opacity: [1, 1, 0] }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
        >
          <span className="block h-full w-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </motion.span>
        <span
          className={cn(
            "chip absolute left-3 top-3 bg-black/55 backdrop-blur-sm",
            published ? "text-ink" : "text-muted",
          )}
        >
          <span className={cn("size-1.5 rounded-full", published ? "bg-ink" : "border border-muted")} />
          {published ? "Publicado" : "En desarrollo"}
        </span>
        {project.year ? (
          <span className="chip absolute right-3 top-3 bg-black/55 text-muted backdrop-blur-sm">{project.year}</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[6px] border border-line-2 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-xl font-medium tracking-[-0.025em]">{project.title}</h3>
        </div>
        <p className="text-pretty text-[15px] leading-relaxed text-muted">{project.description}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologías">
          {project.tags.map((t) => (
            <li key={t} className="chip text-[11px]">
              {tagToIcon[t] ? <TechIcon name={tagToIcon[t]} className="size-3 text-ink/75" /> : null}
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            aria-label={`Código de ${project.title} en GitHub (abre en otra pestaña)`}
          >
            <GithubIcon /> Código <ArrowUpRight aria-hidden="true" className="opacity-60" />
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            aria-label={`Ver demo de ${project.title} (abre en otra pestaña)`}
          >
            Ver demo <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const filters = useFilters();
  const [filter, setFilter] = useState(ALL);
  const list = filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section id="proyectos" aria-labelledby="proyectos-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="proyectos-title"
          index="03"
          eyebrow="Proyectos"
          title={
            <>
              Cosas que he construido.
            </>
          }
          description="Apps de escritorio, móviles, para reloj y web. Filtra por tecnología y abre el código o la demo."
        />

        <div role="group" aria-label="Filtrar proyectos por tecnología" className="-mx-1 mb-8 flex flex-wrap gap-2 px-1">
          {filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative min-h-11 rounded-[6px] border px-4 text-sm transition-colors",
                  on ? "border-transparent text-bg" : "border-line text-muted hover:border-white/25 hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-[6px] bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
          <p className="ml-auto self-center font-mono text-xs text-muted" aria-live="polite">
            Mostrando <span className="text-ink">{list.length}</span> de {projects.length}
            {filter === ALL ? "" : ` · ${filter}`}
          </p>
        </div>

        {list.length ? (
          <motion.ul layout className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.title}
                  layout
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
                >
                  <ProjectCard project={p} index={i} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="glass flex flex-col items-center gap-4 px-6 py-16 text-center">
            <SearchX aria-hidden="true" className="size-8 text-muted" />
            <p className="text-lg">No hay proyectos con «{filter}» todavía.</p>
            <p className="text-muted">Prueba con otra tecnología o mira todos.</p>
            <button type="button" className="btn btn-secondary" onClick={() => setFilter(ALL)}>
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
