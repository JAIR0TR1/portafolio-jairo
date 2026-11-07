"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { INTRO_KEY } from "@/lib/keys";
import { cn } from "@/lib/cn";

// three / R3F solo se descargan si la intro 3D se va a mostrar.
const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false, loading: () => null });

const LEAVE_AT = 4.4; // s: empieza el fundido al Hero real
const GL_TIMEOUT = 6000; // ms: si la escena 3D no carga, se entra directo al sitio

// La escena se pide en cuanto este módulo carga (antes del primer render) si habrá intro.
if (typeof document !== "undefined" && document.documentElement.dataset.intro === "webgl") void import("./IntroScene");
const listeners = new Set<() => void>();

function readIntro() {
  const d = document.documentElement.dataset;
  return `${d.intro ?? "none"}|${d.introKind ?? "none"}`;
}
function setIntro(value?: string) {
  const d = document.documentElement.dataset;
  if (value) d.intro = value;
  else {
    delete d.intro;
    delete d.introKind;
    delete d.introMounted;
  }
  listeners.forEach((l) => l());
}
function useIntroState() {
  const snap = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readIntro,
    () => "none|none",
  );
  const [state] = snap.split("|");
  return { state };
}

/** Si algo falla en WebGL, se salta la intro sin romper la página. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Intro "La pantalla en la sala oscura" (3D). El contenido real ya está renderizado debajo;
 * esta capa se desmonta al terminar (libera la GPU). Mientras carga la escena se ve solo el
 * fondo del modo con un indicador discreto. Si WebGL falla o no carga a tiempo, se salta
 * directo al sitio. Saltar siempre visible; Entrar desde 2 s; Esc / Enter / Espacio / rueda.
 */
export function IntroGate() {
  const { state } = useIntroState();
  const active = state === "webgl";
  const leaving = state === "leaving";
  const [canEnter, setCanEnter] = useState(false);
  const [ready, setReady] = useState(false);
  const leavingRef = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  const finish = useCallback((fast = false) => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* sin storage */
    }
    setIntro("leaving");
    // Si la URL trae #ancla, al terminar la intro se va a esa sección.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    window.setTimeout(() => {
      setIntro(undefined);
      target?.scrollIntoView({ behavior: "instant", block: "start" });
    }, fast ? 300 : 650);
  }, []);

  const onTick = useCallback(
    (t: number) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, t / LEAVE_AT)})`;
      if (t >= LEAVE_AT) finish();
    },
    [finish],
  );

  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.introMounted = "1";
    skipRef.current?.focus({ preventScroll: true });
    const enterTimer = window.setTimeout(() => setCanEnter(true), 2000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish(e.key === "Escape");
      }
    };
    const onWheel = () => finish();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onWheel, { passive: true });
    return () => {
      window.clearTimeout(enterTimer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [active, finish]);

  // Si la escena no está lista a tiempo, se entra directo al sitio (nunca una pantalla borrosa).
  useEffect(() => {
    if (!active || ready) return;
    const t = window.setTimeout(() => finish(true), GL_TIMEOUT);
    return () => window.clearTimeout(t);
  }, [active, ready, finish]);

  if (!active && !leaving) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] bg-bg transition-opacity ease-out",
        leaving ? "pointer-events-none opacity-0 duration-500" : "opacity-100",
      )}
    >
      <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
        <SceneBoundary onError={() => finish(true)}>
          <IntroScene onTick={onTick} onFail={() => finish(true)} onReady={() => setReady(true)} />
        </SceneBoundary>
      </div>

      {/* Mientras carga la escena: solo el fondo con el nombre haciendo fade */}
      {!ready && (
        <p aria-hidden="true" className="intro-name absolute inset-0 grid place-items-center px-6 text-center font-hero text-[clamp(14px,2.2vw,22px)] uppercase tracking-[0.18em] text-ink">
          Jairo Andrés Vallejo Burbano
        </p>
      )}

      {/* Controles (heurística 03: control y libertad) */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
        <p className="hidden font-mono text-xs text-muted md:block">
          Jairo Andrés Vallejo Burbano <span className="text-accent">·</span> Portafolio
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => finish()}
            className={cn("btn btn-primary transition-opacity", canEnter ? "opacity-100" : "pointer-events-none opacity-0")}
            tabIndex={canEnter ? 0 : -1}
            aria-hidden={!canEnter}
          >
            Entrar
          </button>
          <button ref={skipRef} type="button" onClick={() => finish(true)} className="btn btn-secondary">
            Saltar intro <span className="font-mono text-[11px] text-muted">Esc</span>
          </button>
        </div>
      </div>
      {/* progreso de la intro (heurística 01) */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>
  );
}
