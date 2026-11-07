"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { sectionIndex } from "@/data/profile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { TechIcon, tagToIcon } from "@/components/ui/TechIcon";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";

const ALL = "Todos";

/** Filtros = tecnologías más usadas (máx. 7), calculadas desde los datos. */
function useFilters() {
  return useMemo(() => {
    const count = new Map<string, number>();
    projects.forEach((p) =>
      p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)),
    );
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
    <article className="glass spotlight group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[19px] border-b border-line">
        <ProjectCover project={project} priority={index < 2} />
        <span
          className={cn(
            "chip absolute left-3 top-3 bg-black/50 backdrop-blur-sm",
            published ? "text-ink" : "text-muted",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              published ? "bg-accent" : "border border-muted",
            )}
          />
          {published ? "Publicado" : "En desarrollo"}
        </span>
        {project.year ? (
          <span className="chip absolute right-3 top-3 bg-black/50 text-muted backdrop-blur-sm">
            {project.year}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-line-2 text-label text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-display text-xl font-medium tracking-[-0.025em]">
            {project.title}
          </h3>
        </div>
        <p
          className="line-clamp-2 min-h-[3.25em] text-pretty text-body text-muted"
          title={project.description}
        >
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Tecnologías">
          {project.tags.map((t) => (
            <li key={t} className="chip text-[11px]">
              {tagToIcon[t] ? (
                <TechIcon name={tagToIcon[t]} className="size-3 text-ink/75" />
              ) : null}
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              aria-label={`Código de ${project.title} en GitHub (abre en otra pestaña)`}
            >
              <GithubIcon /> GitHub{" "}
              <ArrowUpRight aria-hidden="true" className="opacity-60" />
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              aria-label={`Ver demo de ${project.title} (abre en otra pestaña)`}
            >
              Ver demo <ArrowUpRight aria-hidden="true" />
            </a>
          )}
          {!project.github && !project.demo && (
            <span className="text-label text-muted">
              Enlaces próximamente
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const filters = useFilters();
  const [filter, setFilter] = useState(ALL);
  const list =
    filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));

  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-title"
      className="section-y relative"
    >
      <div className="container-x">
        <SectionHeading
          id="proyectos-title"
          index={sectionIndex("proyectos")}
          eyebrow="Proyectos"
          title={<>Cosas que he construido.</>}
          description="Apps de escritorio, para reloj y web, con su código y su demo."
        />

        <div
          role="group"
          aria-label="Filtrar proyectos por tecnología"
          className="-mx-1 mb-8 flex flex-wrap gap-2 px-1"
        >
          {filters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f)}
                className={cn(
                  "relative min-h-11 rounded-full border px-4 text-small transition-colors",
                  on
                    ? "border-transparent font-medium text-white"
                    : "border-line text-muted hover:border-accent/50 hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-[image:var(--grad-soft)]"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                <span className="relative">{f}</span>
              </button>
            );
          })}
          <p
            className="ml-auto self-center text-label text-muted"
            aria-live="polite"
          >
            Mostrando <span className="text-ink">{list.length}</span> de{" "}
            {projects.length}
            {filter === ALL ? "" : ` · ${filter}`}
          </p>
        </div>

        {list.length ? (
          <motion.ul
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.title}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE,
                    delay: (i % 3) * 0.08,
                  }}
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
            <p className="text-muted">
              Prueba con otra tecnología o mira todos.
            </p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFilter(ALL)}
            >
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
