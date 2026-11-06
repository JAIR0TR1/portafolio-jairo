"use client";

import { AnimatePresence, motion, useAnimate, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, holdCycle, nextMode, useModeState } from "@/lib/mode";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { ModeFigure } from "./ModeAvatar";
import { cn } from "@/lib/cn";

const CYCLE_MS = 6000;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Posición de cada anotación alrededor del personaje (en % de su caja). */
function notePlacement(i: number, n: number) {
  const side = i % 2 === 0 ? "left" : "right";
  const perSide = side === "left" ? Math.ceil(n / 2) : Math.floor(n / 2);
  const j = Math.floor(i / 2);
  const y = 8 + (j + 0.5) * (48 / perSide);
  const edge = y < 27 ? 33 : 25; // cabeza / sudadera
  return { side, x: side === "left" ? edge : 100 - edge, y } as const;
}

/** Anotación tipo medida de Figma: punto de acento + línea de 1px + etiqueta mono. */
function Note({ text, i, n, sx, sy }: { text: string; i: number; n: number; sx: MotionValue<number>; sy: MotionValue<number> }) {
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
            className={cn("h-px w-14 bg-line-2 xl:w-24", side === "left" ? "origin-right" : "origin-left")}
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

/**
 * Personaje del Hero (Jairo · robot · híbrido) delante de la palabra gigante.
 * Cambia de modo cada 6 s pasando por un orbe de luz; en IA, la costura entre Jairo y el
 * robot sigue al mouse (o se arrastra con el dedo, u oscila sola).
 */
export function HeroAvatar() {
  const reduced = useReducedEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { index, transitionId, userPaused, holds } = useModeState();
  const mode = MODES[index];
  const data = avatarModes[mode.id];
  const isHybrid = mode.id === "ai";

  const [deferTick, setDeferTick] = useState(0);
  const [nearTop, setNearTop] = useState(true);
  const [greeting, setGreeting] = useState(false);

  const figRef = useRef<HTMLDivElement>(null);
  const greetTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);
  const split = useRef({ target: 0.5, current: 0.5, lastInput: 0, dragging: false });
  const [jumpScope, animateJump] = useAnimate();

  // Puntero normalizado (-1..1) → inclinación y parallax de las anotaciones
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 16 });
  const sy = useSpring(py, { stiffness: 90, damping: 16 });
  const rotateY = useTransform(sx, (v) => v * 8);
  const rotateX = useTransform(sy, (v) => v * -5);

  // Cambio automático cada 6 s (pausa: botón, hover/foco, fuera del inicio, reduced-motion).
  const paused = userPaused || holds > 0 || reduced || !nearTop;
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      if (document.documentElement.dataset.intro) return setDeferTick((n) => n + 1);
      nextMode();
    }, CYCLE_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, deferTick]);

  useEffect(() => {
    const check = () => setNearTop(window.scrollY < window.innerHeight * 0.3);
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  useEffect(
    () => () => {
      if (hovering.current) holdCycle(false);
    },
    [],
  );

  // Ojos + inclinación + objetivo de la costura (un listener, sin re-render).
  useEffect(() => {
    if (reduced || !finePointer || !nearTop) return;
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const el = figRef.current;
      if (!el || !last) return;
      const r = el.getBoundingClientRect();
      const dx = last.clientX - (r.left + r.width / 2);
      const dy = last.clientY - (r.top + r.height * 0.17);
      el.style.setProperty("--lx", clamp(dx / (r.width * 1.4), -1, 1).toFixed(3));
      el.style.setProperty("--ly", clamp(dy / (r.height * 0.6), -1, 1).toFixed(3));
      px.set(clamp(dx / (window.innerWidth / 2), -1, 1));
      py.set(clamp(dy / (window.innerHeight / 2), -1, 1));
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
  }, [reduced, finePointer, nearTop, px, py]);

  // Costura del híbrido: suavizado hacia el objetivo; sin interacción, oscila lento.
  useEffect(() => {
    const el = figRef.current;
    if (!isHybrid || !el) return;
    if (reduced) {
      el.style.setProperty("--split", "50%");
      return;
    }
    let raf = 0;
    const s = split.current;
    const loop = (now: number) => {
      const idle = !s.dragging && now - s.lastInput > 1800;
      const target = idle ? 0.5 + Math.sin(now / 1500) * 0.12 : s.target;
      s.current += (target - s.current) * (idle ? 0.04 : 0.12);
      el.style.setProperty("--split", `${(s.current * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isHybrid, reduced]);

  // Arrastre con el dedo (móvil) en modo IA
  const onPointerDown = (e: React.PointerEvent) => {
    if (!isHybrid || e.pointerType === "mouse") return;
    split.current.dragging = true;
  };
  const onPointerMoveTouch = (e: React.PointerEvent) => {
    if (!split.current.dragging || !figRef.current) return;
    const r = figRef.current.getBoundingClientRect();
    split.current.target = clamp((e.clientX - r.left) / r.width, 0.18, 0.82);
    split.current.lastInput = performance.now();
  };
  const endDrag = () => {
    split.current.dragging = false;
    split.current.lastInput = performance.now();
  };

  const greet = () => {
    setGreeting(true);
    window.clearTimeout(greetTimer.current);
    greetTimer.current = window.setTimeout(() => setGreeting(false), 2600);
    if (!reduced && jumpScope.current) {
      animateJump(jumpScope.current, { y: [0, -14, 0] }, { duration: 0.5, ease: EASE });
    }
  };

  return (
    <div
      ref={figRef}
      className="group relative aspect-[530/952] h-full"
      style={{ touchAction: isHybrid ? "pan-y" : undefined }}
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        hovering.current = true;
        holdCycle(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        hovering.current = false;
        holdCycle(false);
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMoveTouch}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Halo de luz detrás de la cabeza (uno de los pocos lugares con color) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[22%] -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_34%,transparent),transparent)]"
      />

      {/* Anotaciones (escritorio) */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
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
            className="absolute left-[60%] top-[1%] z-30 origin-bottom-left whitespace-nowrap rounded-[6px] rounded-bl-none bg-ink px-3 py-1.5 text-[13px] font-semibold text-bg"
          >
            ¡Hola! Soy Jairo
          </motion.p>
        )}
      </AnimatePresence>

      {/* Personaje: flota, se inclina y cambia a través del orbe */}
      <div className={cn("h-full", !reduced && "md:animate-float")}>
        <motion.div style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1200 }} className="relative h-full">
          <div ref={jumpScope} role="img" aria-label={data.alt} className="absolute inset-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode.id}
                className="absolute inset-0 origin-[50%_20%]"
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
                <ModeFigure id={mode.id} priority={index === 0} className="h-full" sizes="(min-width: 1024px) 420px, 62vw" />
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
                className="pointer-events-none absolute left-1/2 top-[20%] aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: `radial-gradient(closest-side, #fff 0%, #fff 22%, color-mix(in oklab, ${mode.color} 70%, white) 45%, transparent 75%)`,
                  boxShadow: `0 0 80px 30px color-mix(in oklab, ${mode.color} 45%, transparent)`,
                }}
              />
            )}
          </div>

          {/* Clic en la cabeza = saludar (botón real, accesible con teclado) */}
          <button
            type="button"
            onClick={greet}
            aria-label="Saludar a Jairo"
            className="absolute left-[30%] top-[2%] z-10 h-[27%] w-[40%] cursor-pointer rounded-full"
          />
        </motion.div>
      </div>

      {/* Pies que se funden con el fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[-20%] bottom-0 h-[22%] bg-gradient-to-b from-transparent via-bg/70 to-bg" />

      {/* Pista del híbrido */}
      <AnimatePresence>
        {isHybrid && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[3%] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-line-2 bg-bg px-2 py-1 font-mono text-[11px] text-ink"
          >
            {finePointer ? "Mueve para ver mi lado IA" : "Desliza para ver mi lado IA"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
