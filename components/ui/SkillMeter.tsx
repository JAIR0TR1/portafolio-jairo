import { levelLabel, type Skill } from "@/data/skills";
import { TechIcon } from "./TechIcon";
import { cn } from "@/lib/cn";

const steps = ["Aprendiendo", "Cómodo", "Fuerte"] as const;

/**
 * Medidor honesto de 3 tramos (Aprendiendo / Cómodo / Fuerte), no porcentajes.
 * Se llena con una animación CSS ligada al scroll (sin JS); sin soporte queda estático.
 */
export function SkillMeter({ skill }: { skill: Skill }) {
  const label = levelLabel(skill.level);
  const filled = steps.indexOf(label) + 1;
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[.04]">
        {skill.icon ? (
          <TechIcon name={skill.icon} className="size-4 text-ink/85" />
        ) : (
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[15px]">{skill.name}</span>
          <span className="shrink-0 font-mono text-xs text-muted">{label}</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1" role="img" aria-label={`Nivel: ${label} (${filled} de 3)`}>
          {steps.map((s, i) => (
            <span key={s} className="h-1.5 overflow-hidden rounded-full bg-white/[.08]">
              {i < filled ? (
                <span className={cn("meter-fill block h-full rounded-full bg-accent")} style={{ animationDelay: `${i * 40}ms` }} />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}
