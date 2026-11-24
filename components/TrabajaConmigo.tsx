"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, Check, Code2, LayoutTemplate, Mail, PenTool, Server, Store } from "lucide-react";
import { useId, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { profile, sectionIndex } from "@/data/profile";
import { budgets, services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { EASE } from "@/lib/effects";
import { cn } from "@/lib/cn";
import { LOCALE, fmt, tx, type Dict, type Lang } from "@/lib/i18n";
import { useI18n } from "@/components/ui/I18nProvider";

const serviceIcons = [LayoutTemplate, Code2, PenTool, Server, Store];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fields = { name: string; email: string; service: string; date: string; budget: string; description: string };
type Key = keyof Fields;
const EMPTY: Fields = { name: "", email: "", service: "", date: "", budget: "", description: "" };

/** Hoy en formato AAAA-MM-DD (hora local) para el mínimo del campo de fecha. */
function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function validate(f: Fields, t: Dict["work"]): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {};
  if (f.name.trim().length < 2) e.name = t.errName;
  if (!f.email.trim()) e.email = t.errEmailEmpty;
  else if (!EMAIL_RE.test(f.email.trim())) e.email = t.errEmail;
  if (!f.service) e.service = t.errService;
  if (!f.date) e.date = t.errDate;
  else if (f.date < today()) e.date = t.errDatePast;
  if (f.description.trim().length < 10) e.description = t.errDescription;
  return e;
}

/** «2026-11-20» → «20 de noviembre de 2026» / «November 20, 2026». */
function longDate(iso: string, lang: Lang) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(LOCALE[lang], { day: "numeric", month: "long", year: "numeric" });
}

/** Valor del presupuesto elegido (se guarda el índice) en el idioma actual. */
const budgetLabel = (value: string, lang: Lang) => (value ? tx(budgets[Number(value)], lang) : "");

function message(f: Fields, t: Dict["work"], lang: Lang) {
  const found = services.find((s) => s.id === f.service);
  const service = found ? tx(found.title, lang) : f.service;
  const budget = f.budget ? fmt(t.messageBudget, { budget: budgetLabel(f.budget, lang) }) : "";
  return fmt(t.message, {
    service,
    date: longDate(f.date, lang),
    description: f.description.trim(),
    budget,
    name: f.name.trim(),
    email: f.email.trim(),
  });
}

export default function TrabajaConmigo() {
  const { lang, t: dict } = useI18n();
  const t = dict.work;
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [sent, setSent] = useState<null | "whatsapp" | "correo">(null);
  const uid = useId();
  const errors = validate(fields, t);
  const show = (k: Key) => (touched[k] ? errors[k] : undefined);
  const id = (k: Key) => `${uid}-${k}`;

  const set = (k: Key) => (e: { target: { value: string } }) => setFields((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k: Key) => () => setTouched((t) => ({ ...t, [k]: true }));
  const aria = (k: Key) => ({
    "aria-invalid": !!show(k),
    "aria-describedby": show(k) ? `${id(k)}-e` : undefined,
  });

  /** Valida; si hay errores, los muestra y enfoca el primero. */
  const check = (form: HTMLFormElement | null) => {
    setTouched({ name: true, email: true, service: true, date: true, description: true });
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => form?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return false;
    }
    return true;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check(e.currentTarget)) return;
    window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message(fields, t, lang))}`, "_blank", "noopener,noreferrer");
    setSent("whatsapp");
  };

  const byEmail = (e: MouseEvent<HTMLButtonElement>) => {
    if (!check(e.currentTarget.form)) return;
    const found = services.find((s) => s.id === fields.service);
    const subject = encodeURIComponent(fmt(t.subject, { service: found ? tx(found.title, lang) : "" }));
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message(fields, t, lang))}`;
    setSent("correo");
  };

  return (
    <section id="trabaja-conmigo" aria-labelledby="trabaja-conmigo-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="trabaja-conmigo-title"
          index={sectionIndex("trabaja-conmigo")}
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
        />

        <div className="grid gap-4 lg:grid-cols-12">
          <Reveal stagger as="ul" className="grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {services.map((s, i) => {
              const Icon = serviceIcons[i];
              return (
                <RevealItem as="li" key={s.id}>
                  <div className="glass spotlight flex h-full items-start gap-4 p-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-[12px] border border-line-2 text-ink">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <div>
                      <h3 className="text-h3">{tx(s.title, lang)}</h3>
                      <p className="mt-1 text-pretty text-small text-muted">{tx(s.text, lang)}</p>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </Reveal>

          <Reveal className="lg:col-span-7">
            <div className="glass p-6 md:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.div
                    key="ok"
                    role="status"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="flex flex-col items-start gap-4"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-[image:var(--grad-soft)] text-[var(--btn-fg)]">
                      <Check aria-hidden="true" />
                    </span>
                    <p className="text-xl font-semibold">{t.doneTitle}</p>
                    <p className="text-pretty text-muted">
                      {sent === "whatsapp" ? t.doneWhatsapp : fmt(t.doneEmail, { email: profile.email })}
                    </p>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSent(null);
                        setFields(EMPTY);
                        setTouched({});
                      }}
                    >
                      {t.again}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 md:grid-cols-2">
                    <p className="text-small text-muted md:col-span-2">
                      {t.requiredBefore} <span aria-hidden="true">*</span>
                      <span className="sr-only">{t.requiredSr}</span> {t.requiredAfter}
                    </p>
                    <Field id={id("name")} label={t.name} error={show("name")} required>
                      <input id={id("name")} name="name" type="text" required minLength={2} autoComplete="name" placeholder={t.namePh} value={fields.name} onChange={set("name")} onBlur={blur("name")} className="field" {...aria("name")} />
                    </Field>
                    <Field id={id("email")} label={t.email} error={show("email")} required>
                      <input id={id("email")} name="email" type="email" required autoComplete="email" inputMode="email" placeholder={t.emailPh} value={fields.email} onChange={set("email")} onBlur={blur("email")} className="field" {...aria("email")} />
                    </Field>
                    <Field id={id("service")} label={t.service} error={show("service")} required>
                      <select id={id("service")} name="service" required value={fields.service} onChange={set("service")} onBlur={blur("service")} className="field" {...aria("service")}>
                        <option value="" disabled>
                          {t.servicePh}
                        </option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {tx(s.title, lang)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id={id("date")} label={t.date} error={show("date")} required>
                      <input id={id("date")} name="date" type="date" required min={today()} value={fields.date} onChange={set("date")} onBlur={blur("date")} className="field" {...aria("date")} />
                    </Field>
                    <Field id={id("budget")} label={t.budget} className="md:col-span-2">
                      <select id={id("budget")} name="budget" value={fields.budget} onChange={set("budget")} className="field">
                        <option value="">{t.budgetNone}</option>
                        {budgets.map((b, i) => (
                          <option key={b.es} value={String(i)}>
                            {tx(b, lang)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id={id("description")} label={t.details} error={show("description")} className="md:col-span-2" required>
                      <textarea id={id("description")} name="description" required minLength={10} rows={5} placeholder={t.detailsPh} value={fields.description} onChange={set("description")} onBlur={blur("description")} className="field resize-y" {...aria("description")} />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                      <button type="submit" className="btn btn-primary">
                        <WhatsappIcon /> {t.sendWhatsapp}
                      </button>
                      <button type="button" onClick={byEmail} className="btn btn-secondary">
                        <Mail aria-hidden="true" /> {t.sendEmail}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, error, required, className, children }: { id: string; label: string; error?: string; required?: boolean; className?: string; children: ReactNode }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-small font-medium">
        {label} {required && <span className="text-muted" aria-hidden="true">*</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p id={`${id}-e`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-small text-danger">
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
