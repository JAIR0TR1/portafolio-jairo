"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { HoloIcon } from "@/components/ui/HoloIcon";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { TechIcon, tagToIcon } from "@/components/ui/TechIcon";
import { EASE } from "@/lib/effects";
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
  const published = project.status !== "en-desarrollo";
  return (
    <article className="glass spotlight group flex h-full flex-col overflow-hidden transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_var(--accent)]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[23px] border-b border-line">
        <ProjectCover project={project} priority={index < 2} />
        <span
          className={cn(
            "chip absolute left-3 top-3 bg-black/55 backdrop-blur-sm",
            published ? "text-emerald-300" : "text-amber-300",
          )}
        >
          <span className={cn("size-1.5 rounded-full", published ? "bg-emerald-400" : "bg-amber-400")} />
          {published ? "Publicado" : "En desarrollo"}
        </span>
        {project.year ? (
          <span className="chip absolute right-3 top-3 bg-black/55 text-muted backdrop-blur-sm">{project.year}</span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <HoloIcon label={project.title.slice(0, 1)} />
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{project.title}</h3>
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
            <GithubIcon /> Código
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
          index="02"
          eyebrow="Proyectos"
          title={
            <>
              Cosas que he <span className="serif-accent text-accent">construido</span>.
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
                  "relative min-h-11 rounded-full border px-4 text-sm transition-colors",
                  on ? "border-transparent text-bg" : "border-line text-muted hover:border-white/25 hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
          <p className="sr-only" aria-live="polite">
            {list.length} {list.length === 1 ? "proyecto" : "proyectos"} con el filtro {filter}
          </p>
        </div>

        {list.length ? (
          <motion.ul layout className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
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
