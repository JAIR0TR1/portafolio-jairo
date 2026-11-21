import type { Metadata } from "next";
import { Logo, type LogoVariant } from "@/components/ui/Logo";

/** Página temporal para elegir el logo (Fase 3). Se elimina cuando Jairo elija. */
export const metadata: Metadata = { title: "Logo · vista previa", robots: { index: false, follow: false } };

const VARIANTS: { id: LogoVariant; name: string; note: string }[] = [
  { id: "mark", name: "A · Monograma", note: "Placa azul acero, trazo claro y chispa de fuego. Encabezado, favicon e ícono." },
  { id: "lockup", name: "B · Monograma + nombre", note: "La placa con «JAIRO VALLEJO» en Michroma; el texto sigue al tema." },
  { id: "mono", name: "C · Una tinta", note: "Todo en currentColor: fondos claros, impresión, sellos." },
];

const SIZES = [24, 32, 48, 96, 200];

function Row({ variant, surface }: { variant: LogoVariant; surface: "dark" | "light" }) {
  const dark = surface === "dark";
  return (
    <div
      className="flex flex-wrap items-end gap-8 rounded-[20px] border p-6"
      style={{ background: dark ? "#0B0B0D" : "#F5EFE6", color: dark ? "#F5F3F0" : "#1A1512", borderColor: dark ? "rgb(255 255 255 / .08)" : "rgb(26 21 18 / .1)" }}
    >
      {SIZES.map((s) => (
        <figure key={s} className="flex flex-col items-start gap-2">
          <div style={{ height: s, fontSize: variant === "lockup" ? s : undefined }} className="flex items-center">
            <Logo variant={variant} className={variant === "lockup" ? "h-full" : "h-full w-auto"} />
          </div>
          <figcaption className="font-mono text-[11px] opacity-60">{s}px</figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function LogoPreview() {
  return (
    <main id="contenido" className="container-x py-16">
      <p className="text-label text-muted">Fase 3 · temporal</p>
      <h1 className="text-h2 mt-3">Logo · vista previa</h1>
      <p className="mt-3 max-w-[60ch] text-muted">
        Tres variantes a 24, 32, 48, 96 y 200 px, sobre el fondo oscuro y el claro. Recomendada: A en el encabezado y el
        favicon, B en el footer.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <Logo variant="mark" animated className="size-20" />
        <span className="text-small text-muted">Animación de carga (recarga la página para verla)</span>
      </div>
      {VARIANTS.map((v) => (
        <section key={v.id} className="mt-12">
          <h2 className="text-h3">{v.name}</h2>
          <p className="mt-1 text-small text-muted">{v.note}</p>
          <div className="mt-5 grid gap-4">
            <Row variant={v.id} surface="dark" />
            <Row variant={v.id} surface="light" />
          </div>
        </section>
      ))}
    </main>
  );
}
