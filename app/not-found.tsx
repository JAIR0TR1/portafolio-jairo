import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { profile } from "@/data/profile";

export const metadata: Metadata = { title: "Página no encontrada" };

export default function NotFound() {
  return (
    <main id="contenido" className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[34vw] font-medium leading-none tracking-[-0.06em] text-[#161616]"
      >
        404
      </p>
      <div>
        <p className="text-eyebrow text-muted">Error 404</p>
        <h1 className="text-display mt-4 text-[clamp(3rem,2rem+6vw,7rem)]">Esta página se perdió en la oscuridad.</h1>
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
