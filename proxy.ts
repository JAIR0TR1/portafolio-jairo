import { NextResponse, type NextRequest } from "next/server";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;

/** Primer idioma soportado en Accept-Language, por orden de preferencia (q). Sin coincidencia: español. */
function browserLang(header: string | null): Lang {
  if (!header) return "es";
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { base: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.trim().slice(2)) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);
  for (const { base } of tags) if (base === "es" || base === "en") return base;
  return "es";
}

/**
 * Idioma por URL: español en «/» (se sirve internamente desde /es) e inglés en «/en».
 * En «/», la primera vez se usa el idioma del navegador y se recuerda en una cookie; si la
 * persona eligió un idioma con el selector, manda la cookie. «/es» redirige a «/».
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  if (pathname === "/es" || pathname === "/es/") {
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname.startsWith("/es/") || pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/") {
    const saved = request.cookies.get(LANG_COOKIE)?.value;
    const lang: Lang = saved === "en" || saved === "es" ? saved : browserLang(request.headers.get("accept-language"));
    let res: NextResponse;
    if (lang === "en") {
      url.pathname = "/en";
      res = NextResponse.redirect(url, 307);
    } else {
      url.pathname = "/es";
      res = NextResponse.rewrite(url);
    }
    if (!saved) res.cookies.set(LANG_COOKIE, lang, { path: "/", maxAge: YEAR, sameSite: "lax" });
    return res;
  }

  // cualquier otra ruta sin idioma: la versión en español (404 si no existe)
  url.pathname = `/es${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // sin archivos estáticos (con extensión), internos de Next ni íconos generados
  matcher: ["/((?!_next/|api/|icon|apple-icon|favicon|.*\\..*).*)"],
};
