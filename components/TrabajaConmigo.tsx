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

function validate(f: Fields): Partial<Record<Key, string>> {
  const e: Partial<Record<Key, string>> = {};
  if (f.name.trim().length < 2) e.name = "Escribe tu nombre (mínimo 2 letras).";
  if (!f.email.trim()) e.email = "Escribe tu correo para poder responderte.";
  else if (!EMAIL_RE.test(f.email.trim())) e.email = "Revisa el correo: debe verse como nombre@dominio.com.";
  if (!f.service) e.service = "Elige el servicio que necesitas.";
  if (!f.date) e.date = "Elige la fecha en que te gustaría empezar.";
  else if (f.date < today()) e.date = "La fecha no puede ser anterior a hoy.";
  if (f.description.trim().length < 10) e.description = "Cuéntame un poco más (mínimo 10 caracteres).";
  return e;
}

/** «2026-11-20» → «20 de noviembre de 2026». */
function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

function message(f: Fields) {
  const service = services.find((s) => s.id === f.service)?.title ?? f.service;
  const budget = f.budget ? ` Presupuesto: ${f.budget}.` : "";
  return `Hola Jairo, quiero agendar un trabajo: ${service} para ${longDate(f.date)}. ${f.description.trim()}${budget} — ${f.name.trim()}, ${f.email.trim()}`;
}

export default function TrabajaConmigo() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Key, boolean>>>({});
  const [sent, setSent] = useState<null | "whatsapp" | "correo">(null);
  const uid = useId();
  const errors = validate(fields);
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
    window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message(fields))}`, "_blank", "noopener,noreferrer");
    setSent("whatsapp");
  };

  const byEmail = (e: MouseEvent<HTMLButtonElement>) => {
    if (!check(e.currentTarget.form)) return;
    const service = services.find((s) => s.id === fields.service)?.title ?? "";
    const subject = encodeURIComponent(`Agendar trabajo: ${service}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${encodeURIComponent(message(fields))}`;
    setSent("correo");
  };

  return (
    <section id="trabaja-conmigo" aria-labelledby="trabaja-conmigo-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="trabaja-conmigo-title"
          index={sectionIndex("trabaja-conmigo")}
          eyebrow="Trabaja conmigo"
          title="¿Tienes un proyecto? Agendemos."
          description="Elige el servicio y la fecha; el mensaje me llega por WhatsApp o correo."
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
                      <h3 className="text-h3">{s.title}</h3>
                      <p className="mt-1 text-pretty text-small text-muted">{s.text}</p>
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
                    <p className="text-xl font-semibold">¡Listo! Tu solicitud está escrita.</p>
                    <p className="text-pretty text-muted">
                      {sent === "whatsapp"
                        ? "Se abrió WhatsApp con el mensaje armado: solo dale «Enviar» y te respondo pronto."
                        : `Se abrió tu app de correo con el mensaje armado: solo dale «Enviar». Si no se abrió, escríbeme a ${profile.email}.`}
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
                      Agendar otro trabajo
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" noValidate onSubmit={onSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 md:grid-cols-2">
                    <p className="text-small text-muted md:col-span-2">
                      Los campos con <span aria-hidden="true">*</span>
                      <span className="sr-only">asterisco</span> son obligatorios.
                    </p>
                    <Field id={id("name")} label="Nombre" error={show("name")} required>
                      <input id={id("name")} name="name" type="text" required minLength={2} autoComplete="name" placeholder="¿Cómo te llamas?" value={fields.name} onChange={set("name")} onBlur={blur("name")} className="field" {...aria("name")} />
                    </Field>
                    <Field id={id("email")} label="Correo" error={show("email")} required>
                      <input id={id("email")} name="email" type="email" required autoComplete="email" inputMode="email" placeholder="tu@correo.com" value={fields.email} onChange={set("email")} onBlur={blur("email")} className="field" {...aria("email")} />
                    </Field>
                    <Field id={id("service")} label="Servicio" error={show("service")} required>
                      <select id={id("service")} name="service" required value={fields.service} onChange={set("service")} onBlur={blur("service")} className="field" {...aria("service")}>
                        <option value="" disabled>
                          Elige un servicio
                        </option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id={id("date")} label="Fecha deseada" error={show("date")} required>
                      <input id={id("date")} name="date" type="date" required min={today()} value={fields.date} onChange={set("date")} onBlur={blur("date")} className="field" {...aria("date")} />
                    </Field>
                    <Field id={id("budget")} label="Presupuesto (opcional)" className="md:col-span-2">
                      <select id={id("budget")} name="budget" value={fields.budget} onChange={set("budget")} className="field">
                        <option value="">Prefiero no decirlo</option>
                        {budgets.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field id={id("description")} label="Descripción" error={show("description")} className="md:col-span-2" required>
                      <textarea id={id("description")} name="description" required minLength={10} rows={5} placeholder="¿Qué quieres construir? Objetivo, público y lo que ya tienes." value={fields.description} onChange={set("description")} onBlur={blur("description")} className="field resize-y" {...aria("description")} />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                      <button type="submit" className="btn btn-primary">
                        <WhatsappIcon /> Agendar por WhatsApp
                      </button>
                      <button type="button" onClick={byEmail} className="btn btn-secondary">
                        <Mail aria-hidden="true" /> Prefiero por correo
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
          <motion.p id={`${id}-e`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-small text-[#fca5a5]">
            <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
