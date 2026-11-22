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
import { fmt, tx } from "@/lib/i18n";
import { useI18n } from "@/components/ui/I18nProvider";

/** Valor interno del filtro «todos» (la etiqueta visible sale del diccionario). */
const ALL = "*";

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
  const { lang, t } = useI18n();
  const published = project.status !== "en-desarrollo";
  const title = tx(project.title, lang);
  const description = tx(project.description, lang);
  const tagLabel = (tag: string) => (t.projects.tags as Record<string, string>)[tag] ?? tag;
  return (
    <article className="glass spotlight group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[19px] border-b border-line">
        <ProjectCover project={project} title={title} alt={fmt(t.projects.shotAlt, { title })} priority={index < 2} />
        <span
          className={cn(
            "chip absolute left-3 top-3 bg-bg/70 backdrop-blur-sm",
            published ? "text-ink" : "text-muted",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              published ? "bg-accent" : "border border-muted",
            )}
          />
          {published ? t.projects.published : t.projects.inProgress}
        </span>
        {project.year ? (
          <span className="chip absolute right-3 top-3 bg-bg/70 text-muted backdrop-blur-sm">
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
            {title}
          </h3>
        </div>
        <p className="min-h-[3.25em] text-pretty text-body text-muted">
          {description}
        </p>
        <ul className="flex flex-wrap gap-1.5" aria-label={t.projects.techs}>
          {project.tags.map((tag) => (
            <li key={tag} className="chip text-[11px]">
              {tagToIcon[tag] ? (
                <TechIcon name={tagToIcon[tag]} className="size-3 text-ink/75" />
              ) : null}
              {tagLabel(tag)}
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
              aria-label={fmt(t.projects.codeAria, { title })}
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
              aria-label={fmt(t.projects.demoAria, { title })}
            >
              {t.projects.demo} <ArrowUpRight aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const filters = useFilters();
  const { t } = useI18n();
  const [filter, setFilter] = useState(ALL);
  const list =
    filter === ALL ? projects : projects.filter((p) => p.tags.includes(filter));
  const label = (f: string) => (f === ALL ? t.projects.all : ((t.projects.tags as Record<string, string>)[f] ?? f));

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
          eyebrow={t.projects.eyebrow}
          title={t.projects.title}
          description={t.projects.description}
        />

        <div
          role="group"
          aria-label={t.projects.filter}
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
                    ? "border-transparent font-medium text-[var(--btn-fg)]"
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
                <span className="relative">{label(f)}</span>
              </button>
            );
          })}
          <p
            className="w-full self-center text-label text-muted sm:ml-auto sm:w-auto"
            aria-live="polite"
          >
            {fmt(t.projects.showing, { n: list.length, total: projects.length })}
            {filter === ALL ? "" : ` · ${label(filter)}`}
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
                  key={p.id}
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
            <p className="text-lg">{fmt(t.projects.empty, { filter: label(filter) })}</p>
            <p className="text-muted">{t.projects.emptyHint}</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFilter(ALL)}
            >
              {t.projects.seeAll}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
