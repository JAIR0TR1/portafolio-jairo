import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <main id="contenido" className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--accent)_45%,transparent),transparent)]"
      />
      <div>
        <p className="text-eyebrow text-accent">Error 404</p>
        <h1 className="text-display mt-4 text-[clamp(3rem,2rem+6vw,7rem)]">
          Esta página se perdió en la <span className="serif-accent accent-word">oscuridad</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">
          El enlace puede estar mal escrito o la página ya no existe. Vuelve al inicio para seguir explorando.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft aria-hidden="true" /> Volver al inicio
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn-secondary">
            <Mail aria-hidden="true" /> Avisarme del error
          </a>
        </div>
      </div>
    </main>
  );
}
