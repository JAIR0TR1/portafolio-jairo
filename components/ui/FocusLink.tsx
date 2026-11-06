"use client";

import type { ReactNode } from "react";

/** Enlace a una sección que además mueve el foco al primer campo (útil con teclado). */
export function FocusLink({ target, className, children }: { target: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${target}`}
      className={className}
      onClick={(e) => {
        const el = document.getElementById(target);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${target}`);
        window.setTimeout(() => el.querySelector<HTMLElement>("input, textarea, button")?.focus({ preventScroll: true }), 650);
      }}
    >
      {children}
    </a>
  );
}
