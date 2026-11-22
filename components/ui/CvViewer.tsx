"use client";

import { Eye } from "lucide-react";
import { profile } from "@/data/profile";
import { useI18n } from "./I18nProvider";

/** «Ver hoja de vida»: abre el PDF en otra pestaña (visor del navegador, en cualquier tamaño). */
export function CvViewer() {
  const { t } = useI18n();
  return (
    <a href={profile.cv.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
      <Eye aria-hidden="true" /> {t.common.viewCv} <span className="sr-only">{t.common.newTab}</span>
    </a>
  );
}
