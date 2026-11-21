/**
 * Diccionarios en el servidor. Los componentes de servidor obtienen el idioma de la ruta
 * (app/[lang]) con next/root-params, sin pasarlo por props.
 */
import { lang as rootLang } from "next/root-params";
import es from "@/i18n/es.json";
import en from "@/i18n/en.json";
import { DEFAULT_LANG, isLang, type Dict, type Lang } from "./i18n";

const dictionaries: Record<Lang, Dict> = { es, en };

export const getDict = (lang: Lang) => dictionaries[lang];

/** Idioma de la ruta actual + su diccionario (Server Components). */
export async function getI18n() {
  const value = await rootLang();
  const lang: Lang = isLang(value) ? value : DEFAULT_LANG;
  return { lang, t: dictionaries[lang] };
}
