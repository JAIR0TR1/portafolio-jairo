"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dict, Lang } from "@/lib/i18n";

const I18nContext = createContext<{ lang: Lang; t: Dict } | null>(null);

/** El layout pasa solo el diccionario del idioma actual (el otro no llega al navegador). */
export function I18nProvider({ lang, t, children }: { lang: Lang; t: Dict; children: ReactNode }) {
  return <I18nContext.Provider value={{ lang, t }}>{children}</I18nContext.Provider>;
}

/** Idioma y textos en componentes de cliente. */
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n fuera de <I18nProvider>");
  return ctx;
}
