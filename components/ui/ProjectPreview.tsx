"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { fmt } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

type Preview = NonNullable<Project["preview"]>;

/** Marco de la captura según el dispositivo: escritorio horizontal, reloj redondo, teléfono vertical. */
const FRAME: Record<Preview["shape"], string> = {
  // centradas un poco abajo: nunca tocan los chips de estado y año (arriba)
  desktop: "right-[5%] top-[58%] w-[66%] -translate-y-1/2 rounded-[12px]",
  watch: "right-[10%] top-[57%] h-[74%] -translate-y-1/2 rounded-full",
  phone: "right-[13%] top-[57%] h-[76%] -translate-y-1/2 rounded-[18px]",
};

/**
 * Vista previa de un proyecto destacado (ocupa la portada de la tarjeta): fondo con la luz del modo,
 * logo real de la app y su captura principal enmarcada. Clic en la captura → modal con la captura
 * ampliada (<dialog> nativo: Esc, botón cerrar o clic fuera); el fondo no hace scroll mientras tanto.
 */
export function ProjectPreview({ preview, title, priority = false }: { preview: Preview; title: string; priority?: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const alt = fmt(t.projects.shotAlt, { title });

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
    <div className="project-art absolute inset-0 overflow-hidden bg-bg-2">
      {/* misma luz del modo y rejilla técnica que las demás portadas */}
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_72%_45%,color-mix(in_srgb,var(--accent)_34%,transparent),transparent_70%),radial-gradient(ellipse_50%_60%_at_10%_100%,color-mix(in_srgb,var(--detail)_22%,transparent),transparent_70%)]" />
      <div aria-hidden="true" className="project-grid absolute inset-0" />

      {/* logo real de la app */}
      <Image
        src={preview.logo}
        alt={fmt(t.projects.logoAlt, { title })}
        width={256}
        height={256}
        sizes="72px"
        quality={90}
        className={cn(
          "absolute bottom-[9%] left-[6%] z-10 size-[clamp(48px,14%,72px)] border border-line-2 object-cover shadow-[var(--shadow)]",
          preview.shape === "watch" ? "rounded-full" : "rounded-[14px]",
        )}
      />

      {/* captura: abre el modal */}
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-label={fmt(t.projects.zoomShot, { title })}
        style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
        className={cn(
          "group/shot absolute overflow-hidden border border-line-2 bg-bg shadow-[var(--shadow)] transition-transform duration-300 hover:scale-[1.02]",
          FRAME[preview.shape],
        )}
      >
        <Image
          src={preview.shot}
          alt={alt}
          fill
          sizes={preview.shape === "desktop" ? "(min-width: 1024px) 340px, (min-width: 768px) 32vw, 70vw" : "(min-width: 768px) 220px, 45vw"}
          quality={90}
          className={cn("object-cover", preview.shape === "desktop" && "object-top")}
          {...(priority ? { preload: true } : {})}
        />
        <span
          aria-hidden="true"
          className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full border border-line-2 bg-bg/75 text-ink opacity-0 backdrop-blur-sm transition-opacity group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100"
        >
          <Maximize2 className="size-4" />
        </span>
      </button>

      <dialog
        ref={ref}
        aria-label={alt}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close(); // clic fuera
        }}
        className="cv-dialog m-auto max-h-[92dvh] w-[min(1100px,calc(100vw-1rem))] overflow-hidden rounded-[20px] border border-line-2 bg-card p-0 text-ink open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-5">
          <p className="min-w-0 truncate text-body font-semibold">{title}</p>
          <button type="button" onClick={() => ref.current?.close()} className="btn btn-secondary btn-sm" aria-label={t.projects.closeShot}>
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 place-items-center overflow-auto bg-bg-2 p-3 md:p-5">
          <Image
            src={preview.shot}
            alt={alt}
            width={preview.width}
            height={preview.height}
            sizes="(min-width: 1120px) 1060px, 100vw"
            quality={90}
            className={cn(
              "h-auto max-h-[calc(92dvh-7rem)] w-auto max-w-full object-contain",
              preview.shape === "watch" && "rounded-full",
              preview.shape === "phone" && "rounded-[18px]",
              preview.shape === "desktop" && "rounded-[10px]",
            )}
          />
        </div>
      </dialog>
    </div>
  );
}
