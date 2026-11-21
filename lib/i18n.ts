/**
 * Idiomas del sitio (sin "use client": lo usan el servidor, el cliente y el proxy).
 * Español en «/» (por defecto) e inglés en «/en». Los textos de la interfaz están en
 * i18n/es.json e i18n/en.json; el contenido de data/ trae sus dos versiones ({ es, en }).
 */
import type esDict from "@/i18n/es.json";

export const LANGS = ["es", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";
/** Cookie con el idioma elegido (la lee el proxy en «/»). */
export const LANG_COOKIE = "jv-lang";

export type Dict = typeof esDict;

export const isLang = (v: unknown): v is Lang => v === "es" || v === "en";

/** Ruta de inicio de cada idioma. */
export const langHome = (lang: Lang) => (lang === "es" ? "/" : "/en");

/** Locale para fechas y orden alfabético. */
export const LOCALE: Record<Lang, string> = { es: "es-CO", en: "en-US" };

/** Texto de contenido en los dos idiomas (data/). */
export type Tx<T = string> = { es: T; en: T };
export const tx = <T>(v: Tx<T>, lang: Lang): T => v[lang];

/** «Mostrando {n} de {total}» → «Mostrando 3 de 6». */
export function fmt(s: string, vars: Record<string, string | number>) {
  return s.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? `{${k}}`));
}
