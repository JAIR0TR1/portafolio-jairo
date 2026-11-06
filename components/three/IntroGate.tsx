"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { INTRO_KEY } from "@/lib/keys";
import { IntroCss } from "./IntroCss";
import { cn } from "@/lib/cn";

// three / R3F solo se descargan si la intro 3D se va a mostrar.
const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false, loading: () => null });

const LEAVE_AT = 4.4; // s: empieza el fundido al Hero real
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
  const [state, kind] = snap.split("|");
  return { state, kind };
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
 * Intro "La pantalla en la sala oscura". El contenido real ya está renderizado debajo;
 * esta capa se desmonta al terminar (libera la GPU). Saltar siempre visible; Entrar desde 2 s;
 * Esc / Enter / Espacio / rueda / deslizar también entran.
 */
export function IntroGate() {
  const { state, kind } = useIntroState();
  const active = state === "webgl" || state === "css";
  const leaving = state === "leaving";
  const [canEnter, setCanEnter] = useState(false);
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
    window.setTimeout(() => setIntro(undefined), fast ? 300 : 650);
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
    skipRef.current?.focus({ preventScroll: true });
    const enterTimer = window.setTimeout(() => setCanEnter(true), 2000);
    // Versión CSS: la línea de tiempo es CSS; aquí solo se mide el progreso.
    let raf = 0;
    if (kind === "css") {
      const t0 = performance.now();
      const loop = () => {
        onTick((performance.now() - t0) / 1000);
        if (!leavingRef.current) raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
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
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onWheel);
    };
  }, [active, kind, finish, onTick]);

  if (!active && !leaving) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[200] bg-bg transition-opacity ease-out",
        leaving ? "pointer-events-none opacity-0 duration-500" : "opacity-100",
      )}
    >
      <div aria-hidden="true" className="absolute inset-0">
        {kind === "webgl" ? (
          <SceneBoundary onError={() => finish(true)}>
            <IntroScene onTick={onTick} onFail={() => finish(true)} />
          </SceneBoundary>
        ) : (
          <IntroCss />
        )}
      </div>

      {/* Controles (heurística 03: control y libertad) */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-8">
        <p className="hidden font-mono text-xs text-muted md:block">
          Jairo Vallejo Burbano <span className="text-accent">·</span> Portafolio
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => finish()}
            className={cn("btn btn-primary btn-sm transition-opacity", canEnter ? "opacity-100" : "pointer-events-none opacity-0")}
            tabIndex={canEnter ? 0 : -1}
            aria-hidden={!canEnter}
          >
            Entrar
          </button>
          <button ref={skipRef} type="button" onClick={() => finish(true)} className="btn btn-secondary btn-sm">
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
