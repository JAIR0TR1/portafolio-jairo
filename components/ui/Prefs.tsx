"use client";

import { motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useId, useSyncExternalStore, type MouseEvent } from "react";
import { LANG_COOKIE, LANGS, langHome, type Lang } from "@/lib/i18n";
import { setThemePref, useThemePref, type ThemePref } from "@/lib/theme";
import { usePlateMotion } from "@/lib/effects";
import { cn } from "@/lib/cn";
import { useI18n } from "./I18nProvider";

/**
 * Selectores de tema e idioma con el mismo lenguaje de las pestañas (Fase 1): riel
 * segmentado, placa de esquinas cortadas que se desliza (layoutId → transform) y esquinas
 * [ ] al pasar el cursor o con el foco. Dos tamaños:
 *  - "compact": dentro de la cápsula del menú (escritorio), solo íconos / «ES·EN».
 *  - "full": menú del celular y footer, con el nombre de cada opción (táctil, 44 px).
 */
type Variant = "compact" | "full";

/** true después de hidratar: la placa del tema solo se pinta con el valor real (sin salto al cargar). */
const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

const railClass = (variant: Variant) =>
  cn(
    "mode-rail isolate inline-flex items-stretch border border-line-2",
    variant === "compact" ? "gap-0.5 rounded-[10px] p-0.5" : "gap-1 rounded-[12px] p-1",
  );

const itemClass = (variant: Variant, on: boolean) =>
  cn(
    "tab flex items-center justify-center font-mono uppercase transition-colors",
    variant === "compact" ? "h-8 min-w-8 px-2 text-[11px] tracking-[0.06em]" : "min-h-11 gap-2 px-2.5 text-[12px] tracking-[0.08em] min-[360px]:px-3",
    on ? "font-semibold text-[var(--btn-fg)]" : "text-muted hover:text-ink",
  );

const THEMES: { id: ThemePref; Icon: typeof Moon; key: "themeDark" | "themeLight" | "themeSystem" }[] = [
  { id: "dark", Icon: Moon, key: "themeDark" },
  { id: "light", Icon: Sun, key: "themeLight" },
  { id: "system", Icon: Monitor, key: "themeSystem" },
];

export function ThemeSwitch({ variant = "compact", className }: { variant?: Variant; className?: string }) {
  const { t } = useI18n();
  const pref = useThemePref();
  const hydrated = useHydrated();
  const plate = usePlateMotion();
  const plateId = useId();
  return (
    <div role="group" aria-label={t.prefs.theme} className={cn(railClass(variant), className)}>
      {THEMES.map(({ id, Icon, key }) => {
        const on = pref === id;
        const label = t.prefs[key];
        return (
          <button
            key={id}
            type="button"
            aria-pressed={on}
            aria-label={variant === "compact" ? label : undefined}
            title={label}
            onClick={() => setThemePref(id)}
            className={itemClass(variant, on)}
          >
            {on && hydrated && (
              <motion.span layoutId={`theme-${plateId}`} transition={plate} className="tab-plate absolute inset-0 -z-10" />
            )}
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {variant === "full" && label}
          </button>
        );
      })}
    </div>
  );
}

const LANG_NAMES: Record<Lang, string> = { es: "Español", en: "English" };

/** «#seccion» visible ahora mismo (la última cuyo borde superior pasó el 40 % de la ventana). */
function currentSection() {
  let id = "";
  for (const el of document.querySelectorAll<HTMLElement>("main > section[id]")) {
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) id = el.id;
  }
  return id && id !== "inicio" ? `#${id}` : "";
}

export function LangSwitch({ variant = "compact", className }: { variant?: Variant; className?: string }) {
  const { lang, t } = useI18n();
  const plate = usePlateMotion();
  const plateId = useId();

  /**
   * Guarda la elección (la cookie la lee el proxy en «/») y abre el otro idioma en la misma
   * sección (#ancla). Es una navegación completa a propósito: el script de arranque vuelve a
   * aplicar tema, modo y pausa en <html> antes del primer pintado (una navegación de cliente
   * entre /es y /en vuelve a montar <html> y los perdería).
   */
  const choose = (next: Lang) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // abrir en otra pestaña
    e.preventDefault();
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    if (next === lang) return;
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- navegación completa a propósito (ver arriba)
    window.location.assign(`${langHome(next)}${currentSection()}`);
  };

  return (
    <div role="group" aria-label={t.prefs.language} className={cn(railClass(variant), className)}>
      {LANGS.map((l) => {
        const on = l === lang;
        return (
          <a
            key={l}
            href={langHome(l)}
            hrefLang={l}
            lang={l}
            aria-current={on ? "true" : undefined}
            title={LANG_NAMES[l]}
            onClick={choose(l)}
            className={itemClass(variant, on)}
          >
            {on && <motion.span layoutId={`lang-${plateId}`} transition={plate} className="tab-plate absolute inset-0 -z-10" />}
            {variant === "compact" ? (
              <>
                <span aria-hidden="true">{l}</span>
                <span className="sr-only">{LANG_NAMES[l]}</span>
              </>
            ) : (
              LANG_NAMES[l]
            )}
          </a>
        );
      })}
    </div>
  );
}
