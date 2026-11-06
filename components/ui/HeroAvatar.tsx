"use client";

import { AnimatePresence, motion, useAnimate, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, holdCycle, nextMode, useModeState } from "@/lib/mode";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { AvatarFigure } from "./ModeAvatar";
import { cn } from "@/lib/cn";

const CYCLE_MS = 6000;

/** Posición de cada anotación alrededor del avatar (en % de la caja del avatar). */
function notePlacement(i: number, n: number) {
  const side = i % 2 === 0 ? "left" : "right";
  const perSide = side === "left" ? Math.ceil(n / 2) : Math.floor(n / 2);
  const j = Math.floor(i / 2);
  const y = 12 + (j + 0.5) * (76 / perSide);
  const edge = y < 66 ? 24 : 19; // cabeza / hombros
  return { side, x: side === "left" ? edge : 100 - edge, y } as const;
}

/** Anotación tipo medida de Figma: punto de acento + línea de 1px + etiqueta mono. */
function Note({
  text,
  i,
  n,
  sx,
  sy,
}: {
  text: string;
  i: number;
  n: number;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const { side, x, y } = notePlacement(i, n);
  const depth = 0.8 + (i % 3) * 0.45;
  const px = useTransform(sx, (v) => v * depth * 14);
  const py = useTransform(sy, (v) => v * depth * 10);
  return (
    <motion.div
      className="absolute z-20"
      style={{ left: `${x}%`, top: `${y}%`, x: px, y: py }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.25 + i * 0.07, duration: 0.35 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <div className="note-float" style={{ animationDelay: `${-i * 0.8}s` }}>
        <div className={cn("flex -translate-y-1/2 items-center", side === "left" ? "-translate-x-full flex-row-reverse" : "")}>
          <span className={cn("size-[7px] shrink-0 rounded-full bg-accent", side === "left" ? "translate-x-1/2" : "-translate-x-1/2")} />
          <motion.span
            className={cn("h-px w-16 bg-line-2 xl:w-24", side === "left" ? "origin-right" : "origin-left")}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { delay: 0.3 + i * 0.07, duration: 0.45, ease: EASE } }}
          />
          <motion.span
            className="whitespace-nowrap rounded-[4px] border border-line-2 bg-bg px-2 py-1 font-mono text-[11px] leading-none text-ink"
            initial={{ opacity: 0, x: side === "left" ? 8 : -8 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.4 + i * 0.07, duration: 0.4, ease: EASE } }}
          >
            {text}
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroAvatar() {
  const reduced = useReducedEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { index, transitionId, userPaused, holds } = useModeState();
  const mode = MODES[index];
  const data = avatarModes[mode.id];

  const [deferTick, setDeferTick] = useState(0);
  const [nearTop, setNearTop] = useState(true);
  const [greeting, setGreeting] = useState(false);
  const [blink, setBlink] = useState(false);

  const visualRef = useRef<HTMLDivElement>(null);
  const greetTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);
  const [jumpScope, animateJump] = useAnimate();

  // Puntero normalizado (-1..1) → inclinación 3D y parallax de las anotaciones
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 16 });
  const sy = useSpring(py, { stiffness: 90, damping: 16 });
  const rotateY = useTransform(sx, (v) => v * 14);
  const rotateX = useTransform(sy, (v) => v * -10);

  // Cambio automático cada 6 s (pausa: botón, hover/foco, fuera del inicio, reduced-motion).
  const paused = userPaused || holds > 0 || reduced || !nearTop;
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      // Mientras se ve la intro, no cambia (el Hero está tapado): se reprograma.
      if (document.documentElement.dataset.intro) return setDeferTick((n) => n + 1);
      nextMode();
    }, CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, deferTick]);

  useEffect(() => {
    const check = () => setNearTop(window.scrollY < window.innerHeight * 0.15);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  // Si se desmonta con el mouse encima, libera la pausa.
  useEffect(
    () => () => {
      if (hovering.current) holdCycle(false);
    },
    [],
  );

  // Parpadeo aleatorio (robot SVG)
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
    if (reduced || !finePointer || !nearTop) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const el = visualRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      const dx = last.clientX - (r.left + r.width / 2);
      const dy = last.clientY - (r.top + r.height * 0.45);
      el.style.setProperty("--lx", String(Math.max(-12, Math.min(12, dx / 28))));
      el.style.setProperty("--ly", String(Math.max(-8, Math.min(8, dy / 36))));
      px.set(Math.max(-1, Math.min(1, dx / (window.innerWidth / 2))));
      py.set(Math.max(-1, Math.min(1, dy / (window.innerHeight / 2))));
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
  }, [reduced, finePointer, nearTop, px, py]);

  const greet = () => {
    setGreeting(true);
    window.clearTimeout(greetTimer.current);
    greetTimer.current = window.setTimeout(() => setGreeting(false), 2600);
    if (!reduced && jumpScope.current) {
      animateJump(jumpScope.current, { y: [0, -18, 0], rotate: [0, -4, 3, 0] }, { duration: 0.6, ease: EASE });
    }
  };

  return (
    <div
      data-avatar-source
      className="relative w-full"
      onPointerEnter={() => {
        hovering.current = true;
        holdCycle(true);
      }}
      onPointerLeave={() => {
        hovering.current = false;
        holdCycle(false);
      }}
    >
      {/* Halo de luz detrás del avatar (uno de los pocos lugares con color) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[44%] -z-10 size-[135%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_30%,transparent),transparent)]"
      />

      {/* Anotaciones (escritorio) */}
      {!reduced && (
        <div className="hero-fade pointer-events-none absolute inset-0 hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div key={mode.id} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              {data.notes.map((t, i) => (
                <Note key={t} text={t} i={i} n={data.notes.length} sx={sx} sy={sy} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Globo de saludo */}
      <AnimatePresence>
        {greeting && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            className="absolute left-[56%] top-[4%] z-30 origin-bottom-left whitespace-nowrap rounded-[6px] rounded-bl-none bg-ink px-3 py-1.5 text-[13px] font-semibold text-bg"
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
          <div ref={jumpScope} role="img" aria-label={data.alt} className="absolute inset-0">
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
                    : { scale: 0.2, opacity: 0, filter: "blur(10px) brightness(3)", transition: { duration: 0.34, ease: [0.55, 0, 0.75, 0] } }
                }
              >
                <AvatarFigure id={mode.id} uid={`hero-${mode.id}`} color={mode.color} blinking={blink} className="h-full w-full" priority={index === 0} />
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
        </motion.div>
      </div>

      {/* Nombre del grupo de anotaciones (escritorio) */}
      <p className="hero-fade mt-2 hidden text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted lg:block">
        {data.group}
      </p>
    </div>
  );
}
