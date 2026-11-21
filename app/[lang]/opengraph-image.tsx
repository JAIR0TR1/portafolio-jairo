import { ImageResponse } from "next/og";
import { isLang, type Lang } from "@/lib/i18n";
import { getDict } from "@/lib/dictionaries";
import { LOGO_J, LOGO_PLATE, LOGO_SPARK, LOGO_STROKE, LOGO_V } from "@/components/ui/Logo";

const size = { width: 1200, height: 630 };

async function langOf(params: Promise<{ lang: string }> | { lang: string }): Promise<Lang> {
  const { lang } = await params;
  return isLang(lang) ? lang : "es";
}

/** Una imagen por idioma, con su texto alternativo traducido. */
export async function generateImageMetadata({ params }: { params: Promise<{ lang: string }> | { lang: string } }) {
  const t = getDict(await langOf(params));
  return [{ id: "og", alt: t.meta.ogAlt, size, contentType: "image/png" }];
}

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const t = getDict(await langOf(params));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 78% 18%, rgba(255,90,31,.42), transparent 48%), radial-gradient(circle at 92% 40%, rgba(255,176,32,.22), transparent 40%), radial-gradient(circle at 8% 95%, rgba(47,107,255,.22), transparent 45%), #0B0B0D",
          color: "#F5F3F0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 28, color: "#A3A1A8" }}>
          {/* logotipo J+V (mismos trazos que components/ui/Logo.tsx) */}
          <svg width="64" height="64" viewBox="0 0 48 48">
            <defs>
              <linearGradient id="s" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#2F6BFF" />
                <stop offset="1" stopColor="#1D3D9E" />
              </linearGradient>
            </defs>
            <path d={LOGO_PLATE} fill="url(#s)" />
            <path d={LOGO_J} fill="none" stroke="#F5F3F0" strokeWidth={LOGO_STROKE} />
            <path d={LOGO_V} fill="none" stroke="#F5F3F0" strokeWidth={LOGO_STROKE} />
            <path d={LOGO_SPARK} fill="none" stroke="#FF8A1F" strokeWidth={LOGO_STROKE} />
          </svg>
          {t.meta.ogKicker}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, color: "#A3A1A8" }}>Jairo Andrés Vallejo Burbano</div>
          {t.meta.ogLines.map((line, i) => (
            <div
              key={line}
              style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.05, ...(i === 2 ? { color: "#FFB020" } : {}) }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 24, color: "#A3A1A8" }}>
          <span>{t.meta.ogPlace}</span>
          <span style={{ color: "#FFB020" }}>·</span>
          <span>{t.meta.ogFocus}</span>
        </div>
      </div>
    ),
    size,
  );
}
