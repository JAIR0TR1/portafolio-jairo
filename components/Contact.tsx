"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowUpRight, Check, Copy, Loader2, Mail, Send } from "lucide-react";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { profile, sectionIndex, socials, type SocialLink } from "@/data/profile";
import { SocialGlyph } from "@/components/ui/BrandIcons";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";
import { fmt, tx, type Dict } from "@/lib/i18n";
import { useI18n } from "@/components/ui/I18nProvider";

/** Formulario de contacto solo si existe el id de Formspree (si no, se oculta: «Trabaja conmigo» ya tiene formulario). */
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;
const MAX = 1000;

type Fields = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields, t: Dict["contact"]): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = t.errName;
  if (!f.email.trim()) e.email = t.errEmailEmpty;
  else if (!EMAIL_RE.test(f.email.trim())) e.email = t.errEmail;
  if (f.message.trim().length < 10) e.message = t.errMessage;
  else if (f.message.length > MAX) e.message = fmt(t.errMax, { max: MAX });
  return e;
}

const contactLinks: SocialLink[] = [
  socials.find((s) => s.icon === "mail")!,
  { label: { es: "WhatsApp", en: "WhatsApp" }, handle: "+57 301 391 7671", href: profile.whatsappHref, icon: "whatsapp" },
  ...socials.filter((s) => s.icon !== "mail"),
];

export default function Contact() {
  const { lang, t: dict } = useI18n();
  const t = dict.contact;
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentVia, setSentVia] = useState<"formspree" | "mailto">("formspree");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const uid = useId();

  const errors = validate(fields, t);
  const show = (k: keyof Fields) => (touched[k] ? errors[k] : undefined);

  const notify = (msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  };

  const copy = async (text: string, what: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(fmt(t.copied, { what }));
    } catch {
      notify(t.copyFail);
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
      const subject = encodeURIComponent(fmt(t.subject, { name: fields.name }));
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
        <SectionHeading
          id="contacto-title"
          index={sectionIndex("contacto")}
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="grid gap-4 lg:grid-cols-12">
          {/* Tarjetas de contacto */}
          <Reveal stagger as="ul" className={cn("grid grid-cols-1 gap-3", FORMSPREE_ID ? "lg:col-span-5" : "md:grid-cols-2 lg:col-span-12")}>
            {contactLinks.map((s) => {
              const isMail = s.icon === "mail";
              const copyValue = isMail ? profile.email : s.href;
              const label = tx(s.label, lang);
              return (
                <RevealItem as="li" key={s.icon} className={cn("min-w-0", isMail && !FORMSPREE_ID && "md:col-span-2")}>
                  <div className="glass spotlight flex items-center gap-4 p-4 md:p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border border-line-2 text-ink">
                      <SocialGlyph icon={s.icon} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-label text-muted">{label}</p>
                      <a
                        href={s.href}
                        target={isMail ? undefined : "_blank"}
                        rel={isMail ? undefined : "noopener noreferrer"}
                        className="block text-body underline-offset-4 [overflow-wrap:anywhere] hover:underline"
                      >
                        {s.handle}
                        {!isMail && <span className="sr-only"> {dict.common.newTab}</span>}
                      </a>
                    </div>
                    {isMail ? (
                      <button
                        type="button"
                        onClick={() => copy(copyValue, label)}
                        className="btn btn-secondary btn-sm shrink-0"
                        aria-label={t.copyEmail}
                      >
                        <Copy aria-hidden="true" /> <span className="max-[400px]:sr-only">{t.copy}</span>
                      </button>
                    ) : (
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm shrink-0" aria-label={fmt(t.openAria, { label })}>
                        {t.open} <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>

          {/* Formulario (solo con Formspree configurado) */}
          {FORMSPREE_ID && (
          <Reveal className="lg:col-span-7">
            <div id="formulario" className="glass scroll-mt-28 p-6 md:p-8">
              <h3 className="text-h3">{t.formTitle}</h3>
              <p className="mt-1 text-small text-muted">{t.formNote}</p>

              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="ok"
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mt-8 flex flex-col items-start gap-4 rounded-[12px] border border-line-2 bg-card p-6"
                  >
                    <span className="grid size-11 place-items-center rounded-[12px] bg-ink text-bg">
                      <Check aria-hidden="true" />
                    </span>
                    <p className="text-lg font-medium">{t.sentTitle}</p>
                    <p className="text-muted">
                      {sentVia === "formspree" ? t.sentFormspree : fmt(t.sentMailto, { email: profile.email })}
                    </p>
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setStatus("idle")}>
                      {t.sendAnother}
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
                    <Field id={fieldIds.name} label={t.name} error={show("name")}>
                      <input
                        id={fieldIds.name}
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        autoComplete="name"
                        placeholder={t.namePh}
                        value={fields.name}
                        onChange={update("name")}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        aria-invalid={!!show("name")}
                        aria-describedby={show("name") ? `${fieldIds.name}-e` : undefined}
                        className="field"
                      />
                    </Field>
                    <Field id={fieldIds.email} label={t.email} error={show("email")}>
                      <input
                        id={fieldIds.email}
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        inputMode="email"
                        placeholder={t.emailPh}
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
                      label={t.message}
                      error={show("message")}
                      className="md:col-span-2"
                      aside={
                        <span
                          className={cn("text-label", fields.message.length > MAX ? "text-danger" : "text-muted")}
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
                        placeholder={t.messagePh}
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
                        {t.honeypot}
                        <input type="text" name="empresa" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>

                    {status === "error" && (
                      <p
                        id={`${uid}-err`}
                        role="alert"
                        className="flex items-start gap-2 rounded-[12px] border border-danger/40 bg-danger/[.08] p-3 text-small md:col-span-2"
                      >
                        <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-danger" />
                        {fmt(t.errSend, { email: profile.email })}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                        {status === "sending" ? (
                          <>
                            <Loader2 aria-hidden="true" className="animate-spin" /> {t.sending}
                          </>
                        ) : status === "error" ? (
                          <>
                            {t.retry} <Send aria-hidden="true" />
                          </>
                        ) : (
                          <>
                            {t.send} <Send aria-hidden="true" />
                          </>
                        )}
                      </button>
                      <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                        <Mail aria-hidden="true" /> {t.writeEmail}
                      </a>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
          )}
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
              className="flex items-center gap-2 rounded-[12px] border border-line-2 bg-card px-4 py-2.5 text-small"
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
        <label htmlFor={id} className="text-small font-medium">
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
            className="flex items-center gap-1.5 text-small text-danger"
          >
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
