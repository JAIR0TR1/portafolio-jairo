"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, Copy, Loader2, Mail, Send } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { profile, socials, type SocialLink } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { ClosingBanner } from "@/components/ui/ClosingBanner";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID; // TODO(Jairo): crear en formspree.io y ponerlo en Vercel
const MAX = 1000;

type Fields = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Escribe tu nombre (mínimo 2 letras).";
  if (!f.email.trim()) e.email = "Escribe tu correo para poder responderte.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Revisa el correo: debe verse como nombre@dominio.com.";
  if (f.message.trim().length < 10) e.message = "Cuéntame un poco más (mínimo 10 caracteres).";
  else if (f.message.length > MAX) e.message = `Máximo ${MAX} caracteres.`;
  return e;
}

const contactLinks: SocialLink[] = [
  ...socials.filter((s) => s.icon === "mail"),
  ...(profile.whatsapp
    ? [{ label: "WhatsApp", handle: `+${profile.whatsapp}`, href: `https://wa.me/${profile.whatsapp}`, icon: "whatsapp" as const }]
    : []),
  ...socials.filter((s) => s.icon !== "mail"),
];

export default function Contact() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentVia, setSentVia] = useState<"formspree" | "mailto">("formspree");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const uid = useId();

  const errors = validate(fields);
  const show = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);

  const notify = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${what} copiado`);
    } catch {
      notify("No se pudo copiar. Selecciónalo y copia a mano.");
    }
  };

  const update = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const data = new FormData(e.currentTarget);
    if (Object.keys(errors).length) {
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    // Honeypot: si un bot lo llena, fingimos éxito y no enviamos nada.
    if (data.get("empresa")) {
      setStatus("sent");
      return;
    }
    setStatus("sending");

    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Mensaje desde el portafolio — ${fields.name}`);
      const body = encodeURIComponent(`${fields.message}\n\n— ${fields.name} (${fields.email})`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setSentVia("mailto");
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: fields.name, email: fields.email, message: fields.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSentVia("formspree");
      setStatus("sent");
      setFields({ name: "", email: "", message: "" });
      setTouched({});
    } catch {
      setStatus("error"); // lo escrito se conserva
    }
  }

  const fieldIds = { name: `${uid}-name`, email: `${uid}-email`, message: `${uid}-message` };

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="section-y relative">
      <div className="container-x">
        <Reveal>
          <ClosingBanner />
        </Reveal>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Tarjetas de contacto */}
          <Reveal stagger as="ul" className="flex flex-col gap-3 lg:col-span-5">
            {contactLinks.map((s) => {
              const isMail = s.icon === "mail";
              const copyValue = isMail ? profile.email : s.href;
              return (
                <RevealItem as="li" key={s.label}>
                  <div className="glass spotlight flex items-center gap-4 p-4 md:p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-[6px] border border-line-2 text-ink">
                      <SocialGlyph icon={s.icon} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs uppercase tracking-[.14em] text-muted">{s.label}</p>
                      <a
                        href={s.href}
                        target={isMail ? undefined : "_blank"}
                        rel={isMail ? undefined : "noopener noreferrer"}
                        className="block truncate text-[15px] underline-offset-4 hover:underline"
                      >
                        {s.handle}
                        {!isMail && <span className="sr-only"> (abre en otra pestaña)</span>}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => copy(copyValue, isMail ? "Correo" : `Enlace de ${s.label}`)}
                      className="btn btn-secondary btn-sm shrink-0"
                      aria-label={`Copiar ${isMail ? "correo" : `enlace de ${s.label}`}`}
                    >
                      <Copy aria-hidden="true" /> Copiar
                    </button>
                  </div>
                </RevealItem>
              );
            })}
            <RevealItem as="li">
              <p className="px-2 pt-2 text-sm text-muted">
                ¿Prefieres tu propia app?{" "}
                <a href={`mailto:${profile.email}`} className="text-ink underline underline-offset-4 hover:text-muted">
                  Escríbeme por correo
                </a>
                .
              </p>
            </RevealItem>
          </Reveal>

          {/* Formulario */}
          <Reveal className="lg:col-span-7">
            <div id="formulario" className="glass scroll-mt-28 p-6 md:p-8">
              <h3 className="text-2xl font-semibold tracking-[-0.03em]">Envíame un mensaje</h3>
              <p className="mt-1 text-sm text-muted">Todos los campos son obligatorios.</p>

              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="ok"
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-8 flex flex-col items-start gap-4 rounded-[8px] border border-line-2 bg-card p-6"
                  >
                    <span className="grid size-11 place-items-center rounded-[6px] bg-ink text-bg">
                      <Check aria-hidden="true" />
                    </span>
                    <p className="text-lg font-medium">¡Gracias! Tu mensaje está listo.</p>
                    <p className="text-muted">
                      {sentVia === "formspree"
                        ? "Lo recibí y te responderé a tu correo pronto."
                        : `Se abrió tu app de correo con el mensaje escrito; solo dale «Enviar». Si no se abrió, escríbeme a ${profile.email}.`}
                    </p>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatus("idle")}>
                      Enviar otro mensaje
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={onSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-8 grid gap-5 md:grid-cols-2"
                    aria-describedby={status === "error" ? `${uid}-err` : undefined}
                  >
                    <Field id={fieldIds.name} label="Nombre" error={show("name")}>
                      <input
                        id={fieldIds.name}
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder="¿Cómo te llamas?"
                        value={fields.name}
                        onChange={update("name")}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!show("name")}
                        aria-describedby={show("name") ? `${fieldIds.name}-e` : undefined}
                        className="field"
                      />
                    </Field>
                    <Field id={fieldIds.email} label="Correo" error={show("email")}>
                      <input
                        id={fieldIds.email}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder="nombre@dominio.com"
                        value={fields.email}
                        onChange={update("email")}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        aria-invalid={!!show("email")}
                        aria-describedby={show("email") ? `${fieldIds.email}-e` : undefined}
                        className="field"
                      />
                    </Field>
                    <Field
                      id={fieldIds.message}
                      label="Mensaje"
                      error={show("message")}
                      className="md:col-span-2"
                      aside={
                        <span
                          className={cn("font-mono text-xs", fields.message.length > MAX ? "text-[#ff8fa8]" : "text-muted")}
                          aria-live="polite"
                        >
                          {fields.message.length} / {MAX}
                        </span>
                      }
                    >
                      <textarea
                        id={fieldIds.message}
                        name="message"
                        required
                        minLength={10}
                        maxLength={MAX + 200}
                        rows={6}
                        placeholder="Cuéntame tu idea, el plazo y cómo te puedo ayudar (mínimo 10 caracteres)."
                        value={fields.message}
                        onChange={update("message")}
                        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                        aria-invalid={!!show("message")}
                        aria-describedby={show("message") ? `${fieldIds.message}-e` : undefined}
                        className="field resize-y"
                      />
                    </Field>

                    {/* Honeypot (invisible para personas) */}
                    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                      <label>
                        Empresa
                        <input type="text" name="empresa" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>

                    {status === "error" && (
                      <p
                        id={`${uid}-err`}
                        role="alert"
                        className="flex items-start gap-2 rounded-[6px] border border-[#ff6b8b]/40 bg-[#ff6b8b]/[.08] p-3 text-sm md:col-span-2"
                      >
                        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#ff8fa8]" />
                        No se pudo enviar (puede ser tu conexión). Tu mensaje sigue aquí: inténtalo de nuevo o
                        escríbeme a {profile.email}.
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                        {status === "sending" ? (
                          <>
                            <Loader2 aria-hidden="true" className="animate-spin" /> Enviando…
                          </>
                        ) : status === "error" ? (
                          <>
                            Reintentar <Send aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            Enviar mensaje <Send aria-hidden="true" />
                          </>
                        )}
                      </button>
                      <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                        <Mail aria-hidden="true" /> Escríbeme por correo
                      </a>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Toast */}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="flex items-center gap-2 rounded-[6px] border border-line-2 bg-card px-4 py-2.5 text-sm"
            >
              <Check aria-hidden="true" className="size-4 text-ink" /> {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  aside,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label} <span className="text-muted" aria-hidden="true">*</span>
        </label>
        {aside}
      </div>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-e`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 text-sm text-[#ff8fa8]"
          >
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
