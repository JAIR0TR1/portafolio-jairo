"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRef, useState } from "react";

export type GalleryImage = { src: string; alt: string };

/**
 * Galería con lightbox accesible (<dialog> nativo: foco atrapado y Esc cierra).
 * Flechas del teclado para pasar de imagen.
 */
export function Gallery({ images, label }: { images: GalleryImage[]; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(0);
  const go = (n: number) => setI((n + images.length) % images.length);
  const current = images[i];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-label={label}>
        {images.map((img, n) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => {
                setI(n);
                ref.current?.showModal();
              }}
              className="group relative block aspect-square w-full overflow-hidden rounded-[12px] border border-line"
              aria-label={`Ampliar: ${img.alt}`}
            >
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 220px, 45vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-label={label}
        className="cv-dialog m-auto w-[min(1000px,calc(100vw-2rem))] rounded-[16px] border border-line-2 bg-card p-0 text-ink"
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(i + 1);
          if (e.key === "ArrowLeft") go(i - 1);
        }}
      >
        {current && (
          <figure>
            <div className="relative h-[min(72vh,760px)] w-full bg-[#0b1030]">
              <Image src={current.src} alt={current.alt} fill sizes="1000px" className="object-contain" />
            </div>
            <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
              <span className="text-sm text-muted">
                {current.alt} · {i + 1} / {images.length}
              </span>
              <span className="flex gap-2">
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => go(i - 1)} className="btn btn-secondary btn-sm" aria-label="Imagen anterior">
                      <ChevronLeft aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => go(i + 1)} className="btn btn-secondary btn-sm" aria-label="Imagen siguiente">
                      <ChevronRight aria-hidden="true" />
                    </button>
                  </>
                )}
                <button type="button" onClick={() => ref.current?.close()} className="btn btn-secondary btn-sm" aria-label="Cerrar">
                  <X aria-hidden="true" /> Cerrar
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
