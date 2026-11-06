"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { MapPin, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile, socials } from "@/data/profile";
import { projects } from "@/data/projects";
import { MODES, setModeIndex, useModeIndex } from "@/lib/mode";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { AvatarBot } from "./AvatarBot";
import { SocialGlyph } from "./BrandIcons";
import { TechIcon } from "./TechIcon";
import { cn } from "@/lib/cn";

const CYCLE_MS = 6000;
const tools = [
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Figma", icon: "figma" },
  { name: "Gemini", icon: "googlegemini" },
];
const tips = ["Next.js", "Figma", "Gemini"];

/** Elemento con parallax según el puntero (depth = cuánto se mueve). */
function Depth({
  x,
  y,
  depth,
  className,
  children,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const tx = useTransform(x, (v) => v * depth * 18);
  const ty = useTransform(y, (v) => v * depth * 14);
  return (
    <motion.div style={{ x: tx, y: ty }} className={cn("hero-fade", className)}>
      {children}
    </motion.div>
  );
}

function Tooltip({ x, y, label, i }: { x: MotionValue<number>; y: MotionValue<number>; label: string; i: number }) {
  const sx = useSpring(x, { stiffness: 260 - i * 70, damping: 24 });
  const oy = useTransform(y, (v) => v + i * 30);
  const sy = useSpring(oy, { stiffness: 260 - i * 70, damping: 24 });
  return (
    <motion.span
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.06 } }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="pointer-events-none absolute left-0 top-0 z-30 whitespace-nowrap rounded-lg border border-white/10 bg-[#0c0c12]/90 px-2 py-1 font-mono text-[11px] text-ink shadow-lg"
    >
      <span className="mr-1.5 inline-block size-1.5 rounded-full bg-accent align-middle" />
      {label}
    </motion.span>
  );
}

export function HeroAvatar() {
  const reduced = useReducedEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const index = useModeIndex();
  const mode = MODES[index];

  const [transitionId, setTransitionId] = useState(0);
  const [deferTick, setDeferTick] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [blink, setBlink] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const greetTimer = useRef<number | undefined>(undefined);
  const [jumpScope, animateJump] = useAnimate();

  // Puntero normalizado (-1..1) → inclinación 3D y parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 16 });
  const sy = useSpring(py, { stiffness: 90, damping: 16 });
  const rotateY = useTransform(sx, (v) => v * 14);
  const rotateX = useTransform(sy, (v) => v * -10);
  // Posición del puntero dentro del avatar (tooltips)
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);

  const changeMode = (i: number) => {
    if (i === index) return;
    setModeIndex(i);
    setTransitionId((t) => t + 1);
  };

  // Cambio automático cada 6 s (solo si se ve el Hero y no está en pausa).
  const paused = userPaused || hoverPaused || reduced || !inView;
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      // Mientras se ve la intro, no cambia (el Hero está tapado): se reprograma.
      if (document.documentElement.dataset.intro) return setDeferTick((n) => n + 1);
      setModeIndex(index + 1);
      setTransitionId((n) => n + 1);
    }, CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, deferTick]);

  // Solo cicla cerca del inicio de la página (no durante el viaje del avatar ni más abajo).
  useEffect(() => {
    const check = () => setInView(window.scrollY < window.innerHeight * 0.15);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Parpadeo aleatorio
  useEffect(() => {
    if (reduced) return;
    let t: number;
    let t2: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        t2 = window.setTimeout(() => setBlink(false), 140);
        loop();
      }, 2600 + Math.random() * 2600);
    };
    loop();
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [reduced]);

  // Ojos que siguen al cursor + inclinación (un listener, sin re-render).
  useEffect(() => {
    if (reduced || !finePointer || !inView) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const el = visualRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.45;
      const dx = last.clientX - cx;
      const dy = last.clientY - cy;
      el.style.setProperty("--lx", String(Math.max(-12, Math.min(12, dx / 28))));
      el.style.setProperty("--ly", String(Math.max(-8, Math.min(8, dy / 36))));
      px.set(Math.max(-1, Math.min(1, dx / (window.innerWidth / 2))));
      py.set(Math.max(-1, Math.min(1, dy / (window.innerHeight / 2))));
      tx.set(last.clientX - r.left + 16);
      ty.set(last.clientY - r.top + 12);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [reduced, finePointer, inView, px, py, tx, ty]);

  const greet = () => {
    setGreeting(true);
    window.clearTimeout(greetTimer.current);
    greetTimer.current = window.setTimeout(() => setGreeting(false), 2600);
    if (!reduced && jumpScope.current) {
      animateJump(jumpScope.current, { y: [0, -18, 0], rotate: [0, -4, 3, 0] }, { duration: 0.6, ease: EASE });
    }
  };

  const avatarSrc = profile.avatars[mode.id];
  const showExtras = !reduced;

  return (
    <div ref={rootRef} className="relative mx-auto flex w-full max-w-[460px] flex-col items-center">
      <div
        data-avatar-source
        className="relative w-[min(64vw,250px)] md:w-[320px] lg:w-full"
        onPointerEnter={() => {
          setHovering(true);
          setHoverPaused(true);
        }}
        onPointerLeave={() => {
          setHovering(false);
          setHoverPaused(false);
        }}
      >
        {/* Tarjetas y chips flotantes (escritorio) */}
        {showExtras && (
          <>
            <Depth x={sx} y={sy} depth={1.4} className="absolute -left-16 bottom-[2%] z-20 hidden xl:-left-24 lg:block">
              <div className="w-44 rounded-2xl border border-white/10 bg-[#0d0d14]/80 p-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/.9)] backdrop-blur-md">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted">Herramientas</p>
                <ul className="space-y-1.5">
                  {tools.map((t) => (
                    <li key={t.name} className="flex items-center gap-2 text-[13px]">
                      <span className="grid size-6 place-items-center rounded-md bg-white/[.06]">
                        <TechIcon name={t.icon} className="size-3.5" />
                      </span>
                      {t.name}
                    </li>
                  ))}
                </ul>
              </div>
            </Depth>
            <Depth x={sx} y={sy} depth={1.8} className="absolute -right-10 bottom-[18%] z-20 hidden xl:-right-16 lg:block">
              <div className="w-44 rounded-2xl border border-white/10 bg-[#0d0d14]/80 p-3 shadow-[0_20px_40px_-20px_rgb(0_0_0/.9)] backdrop-blur-md">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[.16em] text-muted">Redes</p>
                <ul className="space-y-0.5">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.icon === "mail" ? undefined : "_blank"}
                        rel={s.icon === "mail" ? undefined : "noopener noreferrer"}
                        className="-mx-1 flex min-h-8 items-center gap-2 rounded-md px-1 text-[13px] transition-colors hover:bg-white/[.06]"
                      >
                        <SocialGlyph icon={s.icon} className="size-3.5 text-accent" />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Depth>
            <Depth x={sx} y={sy} depth={0.8} className="absolute right-0 top-[6%] z-20 hidden md:block">
              <span className="chip border-white/15 bg-[#0d0d14]/80 backdrop-blur-md">
                <span className="text-accent">●</span> {projects.length}+ proyectos
              </span>
            </Depth>
            <Depth x={sx} y={sy} depth={1.1} className="absolute left-0 top-[24%] z-20 hidden md:block">
              <span className="chip border-white/15 bg-[#0d0d14]/80 backdrop-blur-md">
                <MapPin aria-hidden="true" className="size-3 text-accent" /> Pasto, CO
              </span>
            </Depth>
          </>
        )}

        {/* Globo de saludo */}
        <AnimatePresence>
          {greeting && (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className="absolute right-[54%] top-[3%] z-30 origin-bottom-right whitespace-nowrap rounded-2xl rounded-br-sm bg-ink px-4 py-2 text-sm font-semibold text-bg shadow-[0_10px_30px_-8px_var(--accent)]"
            >
              ¡Hola! Soy Jairo
            </motion.p>
          )}
        </AnimatePresence>

        {/* Visual: flota, se inclina y cambia de personaje a través del orbe */}
        <div className={cn(!reduced && "md:animate-float")}>
          <motion.div
            ref={visualRef}
            style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
            className="relative aspect-[400/460] w-full"
          >
            <div
              ref={jumpScope}
              role="img"
              aria-label={`Avatar de Jairo en modo ${mode.label}: un personaje con casco y ojos de luz`}
              className="absolute inset-0"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode.id}
                  className="absolute inset-0 origin-[50%_45%]"
                  initial={reduced ? { opacity: 0 } : { scale: 0.2, opacity: 0, filter: "blur(10px) brightness(3)" }}
                  animate={
                    reduced
                      ? { opacity: 1, transition: { duration: 0.3 } }
                      : {
                          scale: 1,
                          opacity: 1,
                          filter: "blur(0px) brightness(1)",
                          transition: {
                            delay: 0.12,
                            scale: { type: "spring", stiffness: 240, damping: 15, mass: 0.9 },
                            default: { duration: 0.4, ease: EASE },
                          },
                        }
                  }
                  exit={
                    reduced
                      ? { opacity: 0, transition: { duration: 0.2 } }
                      : {
                          scale: 0.2,
                          opacity: 0,
                          filter: "blur(10px) brightness(3)",
                          transition: { duration: 0.34, ease: [0.55, 0, 0.75, 0] },
                        }
                  }
                >
                  {avatarSrc ? (
                    <Image src={avatarSrc} alt="" fill sizes="(min-width: 1024px) 440px, 320px" className="object-contain" />
                  ) : (
                    <AvatarBot uid={`hero-${mode.id}`} color={mode.color} blinking={blink} className="h-full w-full" />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Orbe de luz blanca entre personajes */}
              {!reduced && transitionId > 0 && (
                <motion.span
                  key={transitionId}
                  aria-hidden="true"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0.1, 0.8, 0.95, 0.6, 0], opacity: [0, 1, 1, 0.9, 0] }}
                  transition={{ duration: 0.95, times: [0, 0.3, 0.5, 0.7, 1], ease: "easeInOut" }}
                  className="pointer-events-none absolute left-1/2 top-[45%] size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: `radial-gradient(closest-side, #fff 0%, #fff 22%, color-mix(in oklab, ${mode.color} 70%, white) 45%, transparent 75%)`,
                    boxShadow: `0 0 80px 30px color-mix(in oklab, ${mode.color} 45%, transparent)`,
                  }}
                />
              )}
            </div>

            {/* Clic = saludar (botón real, accesible con teclado) */}
            <button
              type="button"
              onClick={greet}
              aria-label="Saludar a Jairo"
              className="absolute inset-[12%] z-10 cursor-pointer rounded-full"
            />

            {/* Mini‑etiquetas que siguen al cursor */}
            <AnimatePresence>
              {hovering && finePointer && !reduced
                ? tips.map((t, i) => <Tooltip key={t} label={t} i={i} x={tx} y={ty} />)
                : null}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Selector de modo (visible: heurísticas 3 y 6) */}
      <div className="hero-fade relative z-20 mt-5 flex flex-col items-center gap-3">
        <div
          role="group"
          aria-label="Elige un modo"
          className="flex items-center gap-1 rounded-full border border-line bg-[#0c0c12]/80 p-1 backdrop-blur-md"
          onFocusCapture={() => setHoverPaused(true)}
          onBlurCapture={() => setHoverPaused(false)}
        >
          {MODES.map((m, i) => {
            const on = i === index;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => changeMode(i)}
                className={cn(
                  "relative flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] transition-colors",
                  on ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="mode-pill"
                    className="absolute inset-0 rounded-full border border-white/10 bg-white/[.08]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span
                  aria-hidden="true"
                  className="relative size-2 rounded-full"
                  style={{ background: m.color, boxShadow: on ? `0 0 10px ${m.color}` : undefined }}
                />
                <span className="relative">{m.label}</span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Reanudar cambio automático de modo" : "Pausar cambio automático de modo"}
            className="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            {userPaused ? <Play aria-hidden="true" className="size-3.5" /> : <Pause aria-hidden="true" className="size-3.5" />}
          </button>
        </div>
        <p className="font-mono text-[11px] text-muted">
          {finePointer ? "Mueve el mouse · toca para saludar" : "Toca el avatar para saludar"}
        </p>
      </div>
    </div>
  );
}

