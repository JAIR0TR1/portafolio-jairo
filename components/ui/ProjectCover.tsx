import Image from "next/image";
import type { Project } from "@/data/projects";

/**
 * Portada del proyecto. Si no hay imagen, genera un mock de pantalla con CSS
 * en el color del proyecto (nunca una imagen rota).
 */
export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  const accent = project.accent ?? "var(--accent)";
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={`Captura de ${project.title}`}
        fill
        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        className="object-cover"
        {...(priority ? { preload: true } : {})}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-[#24211d]"
      style={{ ["--p" as string]: accent }}
    >
      {/* glow del color del proyecto, iluminado desde abajo */}
      <div className="absolute -bottom-1/2 left-1/2 h-full w-[120%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--p)_55%,transparent),transparent)] opacity-70 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(rgb(255_255_255/.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.04)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* ventana */}
      <div className="absolute inset-x-[12%] top-[16%] bottom-[-8%] rounded-t-2xl border border-white/10 bg-[#2d2a26]/95 shadow-[0_-20px_60px_-30px_var(--p)]">
        <div className="flex items-center gap-1.5 border-b border-white/[.06] px-3 py-2">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/10" />
          <span className="ml-3 h-2 w-24 rounded-full bg-white/[.06]" />
        </div>
        <div className="grid grid-cols-[1fr_1.4fr] gap-3 p-3">
          <div className="space-y-2">
            <span className="block h-2.5 w-4/5 rounded-full" style={{ background: accent }} />
            <span className="block h-2 w-full rounded-full bg-white/10" />
            <span className="block h-2 w-3/4 rounded-full bg-white/10" />
            <span className="mt-3 block h-6 w-16 rounded-full border border-white/10" />
          </div>
          <div
            className="aspect-[4/3] rounded-xl border border-white/10"
            style={{
              background: `radial-gradient(circle at 30% 30%, color-mix(in oklab, ${accent} 70%, white), transparent 55%), radial-gradient(circle at 70% 80%, color-mix(in oklab, ${accent} 50%, transparent), #252320 70%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
