"use client";

import Image from "next/image";
import { ArrowDownToLine, ArrowUpRight, Eye, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import { fmt } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

/** Vista previa del CV (public/cv-preview.webp, 1242×1756) que se muestra dentro del portafolio. */
const PREVIEW = { src: "/cv-preview.webp", width: 1242, height: 1756 };

/**
 * «Ver hoja de vida»: modal dentro de la página (<dialog> nativo: foco atrapado y Esc cierra) con la
 * imagen del CV a ancho completo y scroll propio. Arriba: «Descargar PDF», «Abrir PDF» (pestaña nueva) y
 * cerrar. También se cierra con clic fuera. Mientras está abierto, el fondo no hace scroll.
 */
export function CvViewer() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  // Bloquea el scroll del fondo mientras el modal está abierto (y lo restaura al cerrar).
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const show = () => {
    ref.current?.showModal();
    setOpen(true);
  };

  return (
    <>
      <button type="button" onClick={show} className="btn btn-secondary" aria-haspopup="dialog">
        <Eye aria-hidden="true" /> {t.common.viewCv}
      </button>
      <dialog
        ref={ref}
        aria-labelledby="cv-title"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close(); // clic fuera (en el fondo)
        }}
        className="cv-dialog m-auto max-h-[92dvh] w-[min(960px,calc(100vw-1rem))] overflow-hidden rounded-[20px] border border-line-2 bg-card p-0 text-ink open:flex open:flex-col"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3 md:px-5">
          <h2 id="cv-title" className="min-w-0 text-body font-semibold">
            {fmt(t.about.cvDialog, { name: profile.name })}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <a href={profile.cv.href} download="CV_Jairo_Vallejo.pdf" className="btn btn-primary btn-sm">
              <ArrowDownToLine aria-hidden="true" /> {t.about.cvDownloadPdf}
            </a>
            <a href={profile.cv.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
              <ArrowUpRight aria-hidden="true" /> {t.about.cvOpenPdf} <span className="sr-only">{t.common.newTab}</span>
            </a>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="btn btn-secondary btn-sm"
              aria-label={t.about.cvClose}
            >
              <X aria-hidden="true" />
            </button>
          </div>
        </div>
        {/* el CV a ancho completo; el scroll es del modal, no de la página */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white">
          <Image
            src={PREVIEW.src}
            width={PREVIEW.width}
            height={PREVIEW.height}
            alt={fmt(t.about.cvImage, { name: profile.name })}
            sizes="(min-width: 980px) 960px, 100vw"
            quality={90}
            className="block h-auto w-full"
          />
        </div>
      </dialog>
    </>
  );
}
