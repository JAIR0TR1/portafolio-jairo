"use client";

import { AnimatePresence, motion, useAnimate, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { avatarModes } from "@/data/avatar";
import { MODES, holdCycle, nextMode, useModeState } from "@/lib/mode";
import { EASE, useMediaQuery, useReducedEffects } from "@/lib/effects";
import { ModeFigure } from "./ModeAvatar";
import { Lantern } from "./Lantern";
import { cn } from "@/lib/cn";

const CYCLE_MS = 6000;
const TILT = 6; // grados máximos de inclinación
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

type Slot = { side: "left" | "right"; y: number }; // y en % del personaje
type Band = { top: number; bottom: number; limit: number; h: number }; // px dentro del personaje

/**
 * Huecos libres para las anotaciones: SOLO en la franja de arriba y la de abajo de la
 * palabra gigante (nunca encima de las letras). Si no caben, no se muestran.
 */
function freeSlots(band: Band | null): Slot[] {
  if (!band) return [];
  const ROW = 30;
  const rows: number[] = [];
  for (let k = 0; k < 2; k++) {
    const yt = band.top - 18 - k * ROW;
    if (yt >= 14) rows.push(yt);
    const yb = band.bottom + 18 + k * ROW;
    if (yb <= band.limit) rows.push(yb);
  }
  return rows.flatMap((y) => [
    { side: "left" as const, y: (y / band.h) * 100 },
    { side: "right" as const, y: (y / band.h) * 100 },
  ]);
}

/** Borde del personaje a una altura dada (cabeza / torso / piernas), en % del ancho. */
function edgeAt(y: number) {
  if (y < 27) return 38;
  if (y < 60) return 29;
  return 36;
}

/** Anotación tipo medida de Figma: punto de acento + línea guía de 1px + etiqueta mono. */
function Note({ text, i, slot, sx, sy }: { text: string; i: number; slot: Slot; sx: MotionValue<number>; sy: MotionValue<number> }) {
  const x = slot.side === "left" ? edgeAt(slot.y) : 100 - edgeAt(slot.y);
  const depth = 0.6 + (i % 3) * 0.35;
  const px = useTransform(sx, (v) => v * depth * 10);
  const py = useTransform(sy, (v) => v * depth * 4);
  const left = slot.side === "left";
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${slot.y}%`, x: px, y: py }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.25 + i * 0.07, duration: 0.35 } }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
    >
      <div className="note-float" style={{ animationDelay: `${-i * 0.8}s` }}>
        <div className={cn("flex -translate-y-1/2 items-center", left ? "-translate-x-full flex-row-reverse" : "")}>
          <span className={cn("size-[7px] shrink-0 rounded-full bg-accent", left ? "translate-x-1/2" : "-translate-x-1/2")} />
          <motion.span
            className={cn("h-px w-12 bg-line-2 xl:w-20", left ? "origin-right" : "origin-left")}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { delay: 0.3 + i * 0.07, duration: 0.45, ease: EASE } }}
          />
          <motion.span
            className="whitespace-nowrap rounded-[4px] border border-line-2 bg-bg px-2 py-1 font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-ink"
            initial={{ opacity: 0, x: left ? 8 : -8 }}
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
 * Personaje del Hero (Jairo · robot · híbrido), DELANTE de la palabra gigante.
 * Idle continuo, inclinación con el mouse (giroscopio en móvil), linterna de rayos X,
 * cambio de modo cada 6 s a través de un orbe de luz y costura del híbrido en modo IA.
 */
export function HeroAvatar() {
  const reduced = useReducedEffects();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const { index, transitionId, userPaused, holds } = useModeState();
  const mode = MODES[index];
  const data = avatarModes[mode.id];
  const isHybrid = mode.id === "ai";
  const lantern = mode.id === "jairo" ? "xray" : mode.id === "dev" ? "circuit" : null;

  const [deferTick, setDeferTick] = useState(0);
  const [nearTop, setNearTop] = useState(true);
  const [greeting, setGreeting] = useState(false);
  const [band, setBand] = useState<Band | null>(null);

  const figRef = useRef<HTMLDivElement>(null);
  const greetTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);
  const split = useRef({ target: 0.5, current: 0.5, lastInput: 0, dragging: false });
  const [jumpScope, animateJump] = useAnimate();

  // Puntero normalizado (-1..1) → inclinación con resorte
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 15 });
  const sy = useSpring(py, { stiffness: 80, damping: 15 });
  const rotateY = useTransform(sx, (v) => v * TILT);
  const rotateX = useTransform(sy, (v) => v * -TILT);

  /** Publica el puntero normalizado en la sección (la palabra gigante se mueve al revés). */
  const setParallax = (nx: number, ny: number) => {
    px.set(nx);
    py.set(ny);
    const sec = figRef.current?.closest<HTMLElement>("#inicio");
    sec?.style.setProperty("--px", nx.toFixed(3));
    sec?.style.setProperty("--py", ny.toFixed(3));
  };

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

  // Franjas libres arriba/abajo de la palabra gigante (para colocar las anotaciones).
  useEffect(() => {
    const fig = figRef.current;
    const word = fig?.closest("#inicio")?.querySelector<HTMLElement>("[data-hero-word]");
    if (!fig || !word) return;
    const measure = () => {
      const f = fig.getBoundingClientRect();
      const w = word.getBoundingClientRect();
      if (!f.height) return;
      setBand({ top: w.top - f.top, bottom: w.bottom - f.top, limit: f.height * 0.66, h: f.height });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(fig);
    ro.observe(word);
    measure();
    return () => ro.disconnect();
  }, []);

  // Mouse: ojos, inclinación, parallax, linterna y costura (un listener, sin re-render).
  useEffect(() => {
    if (reduced || !finePointer || !nearTop) return;
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
      fig.style.setProperty("--lx", clamp(dx / (r.width * 1.4), -1, 1).toFixed(3));
      fig.style.setProperty("--ly", clamp(dy / (r.height * 0.6), -1, 1).toFixed(3));
      const inside = last.clientX >= r.left + r.width * 0.15 && last.clientX <= r.right - r.width * 0.15 && last.clientY >= r.top && last.clientY <= r.bottom;
      fig.style.setProperty("--ho", inside ? "1" : "0");
      fig.style.setProperty("--hx", `${(last.clientX - r.left).toFixed(1)}px`);
      fig.style.setProperty("--hy", `${(last.clientY - r.top).toFixed(1)}px`);
      setParallax(clamp(dx / (window.innerWidth / 2), -1, 1), clamp(dy / (window.innerHeight / 2), -1, 1));
      split.current.target = clamp((last.clientX - r.left) / r.width, 0.18, 0.82);
      split.current.lastInput = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const hide = () => fig.style.setProperty("--ho", "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    sec.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      sec.removeEventListener("pointerleave", hide);
      cancelAnimationFrame(frame);
    };
    // setParallax solo usa refs y motion values estables
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, finePointer, nearTop]);

  // Móvil: parallax con el giroscopio si está disponible (si no, solo idle).
  useEffect(() => {
    if (reduced || finePointer || !nearTop) return;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      setParallax(clamp(e.gamma / 30, -1, 1), clamp((e.beta - 45) / 30, -1, 1));
    };
    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, finePointer, nearTop]);

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

  // Táctil: tocar y arrastrar sobre el personaje (linterna en Jairo/Desarrollador, costura en IA).
  const touchAt = (e: ReactPointerEvent) => {
    const el = figRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${(e.clientX - r.left).toFixed(1)}px`);
    el.style.setProperty("--hy", `${(e.clientY - r.top).toFixed(1)}px`);
    split.current.target = clamp((e.clientX - r.left) / r.width, 0.18, 0.82);
    split.current.lastInput = performance.now();
  };
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse" || reduced) return;
    split.current.dragging = true;
    figRef.current?.style.setProperty("--ho", "1");
    touchAt(e);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (split.current.dragging) touchAt(e);
  };
  const endDrag = (e: ReactPointerEvent) => {
    if (e.pointerType === "mouse") return;
    split.current.dragging = false;
    split.current.lastInput = performance.now();
    figRef.current?.style.setProperty("--ho", "0");
  };

  const greet = () => {
    setGreeting(true);
    window.clearTimeout(greetTimer.current);
    greetTimer.current = window.setTimeout(() => setGreeting(false), 2600);
    if (!reduced && jumpScope.current) {
      animateJump(jumpScope.current, { y: [0, -14, 0] }, { duration: 0.5, ease: EASE });
    }
  };

  const slots = freeSlots(band);
  const notes = data.notes.slice(0, slots.length);

  return (
    <div
      ref={figRef}
      data-hero-figure
      className="group relative aspect-[765/1024] h-full"
      style={{ touchAction: "pan-y" }}
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
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {/* Brillo del acento detrás de la cabeza */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[24%] -z-10 aspect-square w-[110%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_34%,transparent),transparent)]"
      />

      {/* Anotaciones (escritorio): solo en las franjas libres, nunca sobre las letras */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div key={mode.id} className="absolute inset-0" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
              {notes.map((t, i) => (
                <Note key={t} text={t} i={i} slot={slots[i]} sx={sx} sy={sy} />
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
              <div ref={jumpScope} role="img" aria-label={data.alt} className="absolute inset-0">
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
                    <ModeFigure id={mode.id} priority={index === 0} className="h-full" />
                    {lantern && !reduced && <Lantern kind={lantern} />}
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
              </div>

              {/* Clic en la cabeza = saludar (botón real, accesible con teclado) */}
              <button
                type="button"
                onClick={greet}
                aria-label="Saludar a Jairo"
                className="absolute left-[37%] top-[5%] z-10 h-[23%] w-[26%] cursor-pointer rounded-full"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pista del híbrido: DEBAJO de la sombra, sin tapar los zapatos */}
      <AnimatePresence>
        {isHybrid && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 top-[100%] z-20 -translate-x-1/2 whitespace-nowrap pt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted"
          >
            {finePointer ? "Mueve para ver el lado IA" : "Desliza para ver el lado IA"}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
