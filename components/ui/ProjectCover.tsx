import Image from "next/image";
import type { Project } from "@/data/projects";
import { TechIcon, tagToIcon } from "./TechIcon";

/**
 * Portada del proyecto: captura real si existe (public/images/proyectos/); si no, una
 * ilustración con el nombre del proyecto y el ícono de su tecnología principal, en los
 * colores del modo y del tema (nunca una imagen rota ni un recuadro vacío).
 */
export function ProjectCover({
  project,
  title,
  alt,
  priority = false,
}: {
  project: Project;
  /** Nombre visible (ya en el idioma actual). */
  title: string;
  /** Texto alternativo de la captura (ya en el idioma actual). */
  alt: string;
  priority?: boolean;
}) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 460px, (min-width: 768px) 45vw, 100vw"
        quality={90}
        className="object-cover object-top"
        {...(priority ? { preload: true } : {})}
      />
    );
  }

  const icons = [...new Set(project.tags.map((t) => tagToIcon[t]).filter(Boolean))].slice(0, 3);
  const [main, ...rest] = icons;
  return (
    <div aria-hidden="true" className="project-art absolute inset-0 overflow-hidden bg-bg-2">
      {/* luz del modo + rejilla técnica */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_78%_30%,color-mix(in_srgb,var(--accent)_38%,transparent),transparent_70%),radial-gradient(ellipse_50%_60%_at_15%_100%,color-mix(in_srgb,var(--detail)_22%,transparent),transparent_70%)]" />
      <div className="project-grid absolute inset-0" />

      {/* ícono grande de la tecnología principal */}
      {main && (
        <span className="absolute right-[8%] top-1/2 grid aspect-square w-[34%] -translate-y-1/2 place-items-center rounded-[28px] border border-line-2 bg-ink/[.04] shadow-[var(--shadow)]">
          <TechIcon name={main} colored className="size-[46%]" />
        </span>
      )}

      {/* nombre del proyecto */}
      <div className="absolute inset-y-0 left-[7%] flex w-[52%] flex-col justify-center gap-3">
        <span className="font-hero text-[clamp(18px,3.2vw,28px)] uppercase leading-[1.1] tracking-[-0.01em] text-ink">{title}</span>
        {rest.length > 0 && (
          <span className="flex gap-2">
            {rest.map((n) => (
              <span key={n} className="grid size-8 place-items-center rounded-[10px] border border-line-2 bg-ink/[.04]">
                <TechIcon name={n} colored className="size-4" />
              </span>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}
