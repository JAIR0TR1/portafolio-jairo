"use client";

import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { Component, useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { INTRO_KEY } from "@/lib/keys";
import { cn } from "@/lib/cn";
import { useI18n } from "@/components/ui/I18nProvider";
import type { Handoff } from "./IntroScene";

// three / R3F solo se descargan si la intro 3D se va a mostrar.
const IntroScene = dynamic(() => import("./IntroScene"), { ssr: false, loading: () => null });

/** Fin de la animación en s (= `total` de la geometría en IntroScene: escritorio 5.2 · celular 4.6). */
const endAt = () => (window.innerWidth < 768 ? 4.6 : 5.2); // = MOBILE/DESKTOP.total en IntroScene
/** La tarjeta con el nombre (mientras carga la escena) se ve como máximo 1.5 s; después se entra al sitio. */
const NAME_MAX = 1500;

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
    delete d.introHandoff;
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

/** El sitio real (envoltorio de la página en app/[lang]/layout.tsx). */
const site = () => document.getElementById("site");
function clearSite() {
  const el = site();
  if (!el) return;
  el.style.transform = "";
  el.style.transformOrigin = "";
  el.style.willChange = "";
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
 * Intro "La pantalla en la sala oscura" (3D). El contenido real ya está renderizado debajo,
 * en su posición final (sin saltos de layout).
 *
 * Continuidad (elemento compartido): en el zoom final la pantalla de la tablet se vuelve
 * transparente y deja ver EL SITIO REAL, al que se le aplica la misma escala que la pantalla en
 * cada frame. Cuando la pantalla llena la ventana, la escala es 1: la intro se retira sin
 * fundido porque lo que se ve ya es el sitio. Saltar siempre visible (Esc); Entrar desde 2 s
 * (Enter / Espacio / rueda). No se repite en la misma sesión.
 */
export function IntroGate() {
  const { state } = useIntroState();
  const { t } = useI18n();
  const active = state === "webgl";
  const leaving = state === "leaving";
  const [canEnter, setCanEnter] = useState(false);
  const [ready, setReady] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const leavingRef = useRef(false);
  const handoffRef = useRef(false);
  const barRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  /** instant: la animación llegó al final (ya se ve el sitio): se retira sin fundido. */
  const finish = useCallback((mode: "fade" | "fast" | "instant" = "fade") => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* sin storage */
    }
    clearSite();
    if (mode === "instant") {
      setIntro(undefined);
    } else {
      setIntro("leaving");
      window.setTimeout(() => setIntro(undefined), mode === "fast" ? 300 : 650);
    }
    // Si la URL trae #ancla, al terminar la intro se va a esa sección.
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const target = hash ? document.getElementById(hash) : null;
    if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant", block: "start" }));
  }, []);

  const onTick = useCallback(
    (time: number) => {
      const end = endAt();
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, time / end)})`;
      if (time >= end) finish("instant");
    },
    [finish],
  );

  /** Cada frame del zoom final: el sitio real toma la escala de la pantalla de la tablet. */
  const onHandoff = useCallback(({ scale }: Handoff) => {
    const el = site();
    // ya terminó (el último frame de la escena llega después de limpiar): no volver a escalar
    if (!el || leavingRef.current) return;
    if (!handoffRef.current) {
      handoffRef.current = true;
      document.documentElement.dataset.introHandoff = ""; // el Hero vuelve a animarse (lib/ticker.ts)
      // (will-change ya está puesto desde el montaje: el sitio quedó rasterizado a escala 1)
      el.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
      setHandoff(true);
    }
    el.style.transform = `scale(${scale.toFixed(5)})`;
  }, []);

  useEffect(() => {
    if (!active) return;
    document.documentElement.dataset.introMounted = "1";
    // El sitio se prepara en su propia capa A ESCALA 1 antes de achicarlo: así se ve nítido en
    // todo el zoom final (si se crea la capa ya pequeña, se rasteriza borroso y «enfoca» al final).
    const siteEl = site();
    if (siteEl) siteEl.style.willChange = "transform";
    skipRef.current?.focus({ preventScroll: true });
    const enterTimer = window.setTimeout(() => setCanEnter(true), 2000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finish("fast");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        finish("fade");
      }
    };
    const onWheel = () => finish("fade");
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

  // La tarjeta del nombre no se queda más de 1.5 s: si la escena no está lista, se entra al sitio.
  useEffect(() => {
    if (!active || ready) return;
    const timer = window.setTimeout(() => finish("fast"), NAME_MAX);
    return () => window.clearTimeout(timer);
  }, [active, ready, finish]);

  // Si se desmonta a mitad (navegación), el sitio nunca queda escalado.
  useEffect(() => () => clearSite(), []);

  if ((!active && !leaving) || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={cn(
        "intro-shell fixed inset-0 z-[200] transition-opacity ease-out",
        // fondo de la sala mientras carga; en el zoom final el canvas ya cubre todo salvo la pantalla
        !handoff && "bg-bg",
        leaving ? "pointer-events-none opacity-0 duration-500" : "opacity-100",
      )}
    >
      <div aria-hidden="true" className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
        <SceneBoundary onError={() => finish("fast")}>
          <IntroScene onTick={onTick} onFail={() => finish("fast")} onReady={() => setReady(true)} onHandoff={onHandoff} />
        </SceneBoundary>
      </div>

      {/* Mientras carga la escena (máx. 1.5 s): solo el fondo con el nombre */}
      {!ready && (
        <p aria-hidden="true" className="intro-name absolute inset-0 grid place-items-center px-6 text-center font-hero text-[clamp(14px,2.2vw,22px)] uppercase tracking-[0.18em] text-ink">
          Jairo Andrés Vallejo Burbano
        </p>
      )}

      {/* Controles (heurística 03: control y libertad); se apartan en el zoom final */}
      <div className={cn("absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 transition-opacity duration-300 md:p-8", handoff && "pointer-events-none opacity-0")}>
        <p className="hidden font-mono text-xs text-muted md:block">
          Jairo Andrés Vallejo Burbano <span className="text-accent">·</span> {t.intro.portfolio}
        </p>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => finish("fade")}
            className={cn("btn btn-primary transition-opacity", canEnter ? "opacity-100" : "pointer-events-none opacity-0")}
            tabIndex={canEnter ? 0 : -1}
            aria-hidden={!canEnter}
          >
            {t.intro.enter}
          </button>
          <button ref={skipRef} type="button" onClick={() => finish("fast")} className="btn btn-secondary">
            {t.intro.skip} <span className="font-mono text-[11px] text-muted">Esc</span>
          </button>
        </div>
      </div>
      {/* progreso de la intro (heurística 01) */}
      <div className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-white/5", handoff && "opacity-0")}>
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </div>,
    document.body,
  );
}
