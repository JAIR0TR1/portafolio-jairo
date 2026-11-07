"use client";

import { AnimatePresence, animate, motion, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, holdCycle, useModeState, type ModeId } from "@/lib/mode";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { heroJump, heroPointer } from "@/lib/heroMotion";
import { CircuitFigure, JairoAligned, ModeFigure, RobotAligned } from "./ModeAvatar";
import { HeroOrbit } from "./HeroOrbit";
import { cn } from "@/lib/cn";

const TILT = 6; // grados máximos de inclinación
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export type HeroVariant = "base" | "revealed";

/** Personaje de cada capa: A (base) por modo; B (dentro de la mancha) es «lo que hay detrás». */
function LayerFigure({ id, variant, priority }: { id: ModeId; variant: HeroVariant; priority?: boolean }) {
  if (variant === "base") return <ModeFigure id={id} priority={priority} className="h-full" />;
  if (id === "jairo") return <RobotAligned className="h-full" />; // Jairo → su robot
  if (id === "dev") return <JairoAligned className="h-full" />; // detrás del código, la persona
  return <CircuitFigure className="h-full" />; // el interior del híbrido
}

/**
 * Personaje del Hero DELANTE de la palabra gigante. Se renderiza dos veces:
 *  - variant="base": capa interactiva (ciclo de modos, puntero, saludo, costura del híbrido).
 *  - variant="revealed": capa clara dentro de la mancha líquida (pasiva, aria-hidden).
 * Ambas leen heroPointer/heroJump → misma inclinación, parallax y salto en cada frame.
 */
export function HeroAvatar({ variant = "base" }: { variant?: HeroVariant }) {
  const isBase = variant === "base";
  const reduced = useReducedEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { index, transitionId } = useModeState();
  const mode = MODES[index];
  const data = avatarModes[mode.id];
  const isHybrid = mode.id === "ai";

  const [nearTop, setNearTop] = useState(true);
  const [greeting, setGreeting] = useState(false);

  const figRef = useRef<HTMLDivElement>(null);
  const greetTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);
  const split = useRef({ target: 0.5, current: 0.5, lastInput: 0, dragging: false });

  // Puntero compartido → inclinación con resorte (mismos parámetros en ambas capas)
  const sx = useSpring(heroPointer.x, { stiffness: 80, damping: 15 });
  const sy = useSpring(heroPointer.y, { stiffness: 80, damping: 15 });
  const rotateY = useTransform(sx, (v) => v * TILT);
  const rotateX = useTransform(sy, (v) => v * -TILT);

  /** Publica el puntero en las dos capas (motion values) y en la sección (CSS vars). */
  const setParallax = (nx: number, ny: number) => {
    heroPointer.x.set(nx);
    heroPointer.y.set(ny);
    const sec = figRef.current?.closest<HTMLElement>("#inicio");
    sec?.style.setProperty("--px", nx.toFixed(3));
    sec?.style.setProperty("--py", ny.toFixed(3));
  };

  // El modo solo cambia cuando el usuario pulsa Jairo / Desarrollador / IA (sin ciclo automático).

  useEffect(() => {
    if (!isBase) return;
    const check = () => setNearTop(window.scrollY < window.innerHeight * 0.3);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [isBase]);

  useEffect(
    () => () => {
      if (hovering.current) holdCycle(false);
    },
    [],
  );


  // Mouse: ojos, inclinación, parallax y costura (solo escucha la capa base; un listener).
  useEffect(() => {
    if (!isBase || reduced || !finePointer || !nearTop) return;
    const fig = figRef.current;
    const sec = fig?.closest<HTMLElement>("#inicio");
    if (!fig || !sec) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      if (!last) return;
      const r = fig.getBoundingClientRect();
      const dx = last.clientX - (r.left + r.width / 2);
      const dy = last.clientY - (r.top + r.height * 0.2);
      sec.style.setProperty("--lx", clamp(dx / (r.width * 1.4), -1, 1).toFixed(3));
      sec.style.setProperty("--ly", clamp(dy / (r.height * 0.6), -1, 1).toFixed(3));
      setParallax(clamp(dx / (window.innerWidth / 2), -1, 1), clamp(dy / (window.innerHeight / 2), -1, 1));
      split.current.target = clamp((last.clientX - r.left) / r.width, 0.18, 0.82);
      split.current.lastInput = performance.now();
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
    // setParallax solo usa refs y motion values estables
     
  }, [isBase, reduced, finePointer, nearTop]);

  // Móvil: parallax con el giroscopio si está disponible (si no, solo idle).
  useEffect(() => {
    if (!isBase || reduced || finePointer || !nearTop) return;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      setParallax(clamp(e.gamma / 30, -1, 1), clamp((e.beta - 45) / 30, -1, 1));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
     
  }, [isBase, reduced, finePointer, nearTop]);

  // Costura del híbrido (capa base): suavizado hacia el objetivo; sin interacción, oscila lento.
  useEffect(() => {
    const el = figRef.current;
    if (!isBase || !isHybrid || !el) return;
    if (reduced) {
      el.style.setProperty("--split", "50%");
      return;
    }
    let raf = 0;
    const s = split.current;
    const loop = (now: number) => {
      const idle = !s.dragging && now - s.lastInput > 1800;
      const paused = document.documentElement.dataset.anim === "paused";
      const target = idle ? (paused ? s.current : 0.5 + Math.sin(now / 1500) * 0.12) : s.target;
      s.current += (target - s.current) * (idle ? 0.04 : 0.12);
      el.style.setProperty("--split", `${(s.current * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isBase, isHybrid, reduced]);

  // Táctil: arrastrar sobre el personaje mueve la costura del híbrido.
  const touchAt = (e: ReactPointerEvent) => {
    const el = figRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    split.current.target = clamp((e.clientX - r.left) / r.width, 0.18, 0.82);
    split.current.lastInput = performance.now();
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" || reduced) return;
    split.current.dragging = true;
    touchAt(e);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (split.current.dragging) touchAt(e);
  };
  const endDrag = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    split.current.dragging = false;
    split.current.lastInput = performance.now();
  };

  const greet = () => {
    setGreeting(true);
    window.clearTimeout(greetTimer.current);
    greetTimer.current = window.setTimeout(() => setGreeting(false), 2600);
    if (!reduced) animate(heroJump, [0, -14, 0], { duration: 0.5, ease: EASE });
  };


  const handlers = isBase
    ? {
        onPointerEnter: (e: ReactPointerEvent) => {
          if (e.pointerType !== "mouse") return;
          hovering.current = true;
          holdCycle(true);
        },
        onPointerLeave: (e: ReactPointerEvent) => {
          if (e.pointerType !== "mouse") return;
          hovering.current = false;
          holdCycle(false);
        },
        onPointerDown,
        onPointerMove,
        onPointerUp: endDrag,
        onPointerCancel: endDrag,
      }
    : {};

  return (
    <div
      ref={figRef}
      data-hero-figure={isBase ? "" : undefined}
      className="group relative aspect-[765/1024] h-[70%] md:h-full"
      style={{ touchAction: "pan-y" }}
      {...handlers}
    >
      {/* Luz del acento detrás del personaje */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[30%] -z-10 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_18%,transparent),transparent)]"
      />

      {/* Anotaciones en órbita alrededor del personaje (detrás: z-5 · delante: z-20) */}
      <HeroOrbit notes={data.notes} modeId={mode.id} isBase={isBase} />

      {/* Globo de saludo (solo la capa base) */}
      <AnimatePresence>
        {isBase && greeting && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="absolute left-[58%] top-[3%] z-30 origin-bottom-left whitespace-nowrap rounded-[6px] rounded-bl-none bg-ink px-3 py-1.5 text-[13px] font-semibold text-bg"
          >
            ¡Hola! Soy Jairo
          </motion.p>
        )}
      </AnimatePresence>

      {/* Personaje: idle continuo (flota, respira, se balancea) + inclinación con resorte */}
      <div className={cn("relative z-10 h-full", !reduced && "idle-float")}>
        <div className={cn("h-full", !reduced && "idle-breathe")}>
          <div className={cn("h-full", !reduced && "idle-sway")}>
            <motion.div style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1100 }} className="relative h-full">
              <motion.div
                style={{ y: heroJump }}
                role={isBase ? "img" : undefined}
                aria-label={isBase ? data.alt : undefined}
                className="absolute inset-0"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mode.id}
                    className="absolute inset-0 origin-[50%_22%]"
                    initial={reduced ? { opacity: 0 } : { scale: 0.25, opacity: 0, filter: "blur(10px) brightness(3)" }}
                    animate={
                      reduced
                        ? { opacity: 1, transition: { duration: 0.3 } }
                        : {
                            scale: 1,
                            opacity: 1,
                            filter: "blur(0px) brightness(1)",
                            transition: {
                              delay: 0.12,
                              scale: { type: "spring", stiffness: 240, damping: 17, mass: 0.9 },
                              default: { duration: 0.4, ease: EASE },
                            },
                          }
                    }
                    exit={
                      reduced
                        ? { opacity: 0, transition: { duration: 0.2 } }
                        : { scale: 0.25, opacity: 0, filter: "blur(10px) brightness(3)", transition: { duration: 0.34, ease: [0.55, 0, 0.75, 0] } }
                    }
                  >
                    <LayerFigure id={mode.id} variant={variant} priority={isBase && index === 0} />
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
                    className="pointer-events-none absolute left-1/2 top-[22%] aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{
                      background: `radial-gradient(closest-side, #fff 0%, #fff 22%, color-mix(in oklab, ${mode.color} 70%, white) 45%, transparent 75%)`,
                      boxShadow: `0 0 80px 30px color-mix(in oklab, ${mode.color} 45%, transparent)`,
                    }}
                  />
                )}
              </motion.div>

              {/* Clic en la cabeza = saludar (botón real, accesible con teclado; solo capa base) */}
              {isBase && (
                <button
                  type="button"
                  onClick={greet}
                  aria-label="Saludar a Jairo"
                  className="absolute left-[37%] top-[5%] z-10 h-[23%] w-[26%] cursor-pointer rounded-full"
                />
              )}
            </motion.div>
          </div>
        </div>
      </div>

    </div>
  );
}
