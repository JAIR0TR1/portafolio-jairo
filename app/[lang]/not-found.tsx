import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { langHome } from "@/lib/i18n";
import { getI18n } from "@/lib/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.notFound.metaTitle };
}

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <main id="contenido" className="relative isolate grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[34vw] font-medium leading-none tracking-[-0.06em] text-faint"
      >
        404
      </p>
      <div>
        <p className="text-eyebrow text-muted">{t.notFound.eyebrow}</p>
        <h1 className="text-display mt-4 text-[clamp(1.6rem,1rem+2.6vw,3.2rem)]">{t.notFound.title}</h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-muted">{t.notFound.text}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href={langHome(lang)} className="btn btn-primary">
            <ArrowLeft aria-hidden="true" /> {t.notFound.home}
          </Link>
          <a href={`mailto:${profile.email}`} className="btn btn-secondary">
            <Mail aria-hidden="true" /> {t.notFound.report}
          </a>
        </div>
      </div>
    </main>
  );
}
