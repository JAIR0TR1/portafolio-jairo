import type { Skill } from "@/data/skills";
import { TechIcon } from "./TechIcon";

/** Anillo de logos en perspectiva 3D (CSS, sin WebGL) iluminado desde abajo con el --accent. */
export function LogoRing({ skills }: { skills: Skill[] }) {
  const base = skills.length ? skills : [{ name: "?", level: 0 }];
  const items = Array.from({ length: 8 }, (_, i) => base[i % base.length]);
  const step = 360 / items.length;

  return (
    <div aria-hidden="true" className="relative grid h-full min-h-[300px] place-items-center [perspective:1000px]">
      {/* luz desde abajo */}
      <div className="absolute bottom-[8%] left-1/2 h-24 w-[80%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_70%,transparent),transparent)] blur-md" />
      <div className="absolute bottom-[14%] left-1/2 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
      {/* núcleo */}
      <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_35%,#fff,color-mix(in_oklab,var(--accent)_75%,white)_30%,color-mix(in_oklab,var(--accent)_40%,transparent)_60%,transparent_72%)] opacity-90" />

      <div className="[transform-style:preserve-3d] [transform:rotateX(-16deg)]">
        <div className="logo-ring relative">
          {items.map((s, i) => (
            <div
              key={i}
              className="absolute -left-8 -top-8 grid size-16 place-items-center rounded-2xl border border-white/15 bg-[#11111a]/90 shadow-[0_0_30px_-10px_var(--accent),inset_0_1px_0_rgb(255_255_255/.12)]"
              style={{ transform: `rotateY(${i * step}deg) translateZ(clamp(130px, 14vw, 190px))` }}
            >
              {s.icon ? (
                <TechIcon name={s.icon} className="size-7 text-ink" />
              ) : (
                <span className="font-mono text-xs text-ink">{s.name.slice(0, 2)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
