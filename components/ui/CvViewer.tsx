"use client";

import { Eye, X } from "lucide-react";
import { useRef } from "react";
import { profile } from "@/data/profile";
import { fmt } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

/**
 * «Ver hoja de vida»: modal accesible (<dialog> nativo: foco atrapado, Esc cierra, el resto
 * de la página queda inerte) con el PDF embebido. En móvil abre el PDF en otra pestaña.
 */
export function CvViewer() {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();

  const open = () => ref.current?.showModal();

  return (
    <>
      {/* celular: enlace real que abre el PDF en pestaña nueva · escritorio: modal con el PDF */}
      <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary md:hidden">
        <Eye aria-hidden="true" /> {t.common.viewCv} <span className="sr-only">{t.common.newTab}</span>
      </a>
      <button type="button" onClick={open} className="btn btn-secondary max-md:hidden" aria-haspopup="dialog">
        <Eye aria-hidden="true" /> {t.common.viewCv}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="cv-title"
        className="cv-dialog m-auto w-[min(960px,calc(100vw-2rem))] rounded-[20px] border border-line-2 bg-card p-0 text-ink"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close(); // clic en el fondo
        }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
          <h2 id="cv-title" className="text-body font-semibold">
            {fmt(t.about.cvDialog, { name: profile.name })}
          </h2>
          <div className="flex items-center gap-2">
            <a href="/cv.pdf" download className="btn btn-primary btn-sm">
              {t.common.download}
            </a>
            <button type="button" onClick={() => ref.current?.close()} className="btn btn-secondary btn-sm" aria-label={t.about.cvClose}>
              <X aria-hidden="true" /> {t.common.close}
            </button>
          </div>
        </div>
        <iframe src="/cv.pdf#view=FitH" title={fmt(t.about.cvFrame, { name: profile.name })} className="block h-[min(78dvh,900px)] w-full bg-white" />
      </dialog>
    </>
  );
}
