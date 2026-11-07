import type { Skill } from "@/data/skills";
import { TechIcon } from "./TechIcon";

/**
 * Anillo 3D de logos (CSS, sin WebGL) que gira despacio; recuperado de la versión anterior.
 * Se pausa al pasar el mouse y queda quieto con reduced-motion / «Reducir efectos».
 */
export function LogoRing({ skills }: { skills: Skill[] }) {
  const step = 360 / skills.length;
  return (
    <div
      role="img"
      aria-label={`Tecnologías: ${skills.map((s) => s.name).join(", ")}`}
      className="logo-ring-stage relative grid h-[260px] place-items-center overflow-hidden [perspective:1100px] md:h-[300px]"
    >
      {/* luz pastel desde abajo */}
      <div aria-hidden="true" className="absolute bottom-[10%] left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--grad-a)_22%,transparent),transparent)]" />
      <div aria-hidden="true" className="[transform-style:preserve-3d] [transform:rotateX(-10deg)]">
        <div className="logo-ring relative">
          {skills.map((s, i) => (
            <div
              key={s.name}
              className="logo-ring-item absolute -left-8 -top-8 grid size-16 place-items-center rounded-[12px] border border-line-2 bg-card"
              style={{ transform: `rotateY(${i * step}deg) translateZ(var(--ring-r))` }}
            >
              <TechIcon name={s.icon} colored className="size-7" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
