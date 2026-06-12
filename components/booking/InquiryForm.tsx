"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { MAX_GUESTS } from "@/lib/config";

const inputClass =
  "w-full rounded-xl border border-stone/70 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint/70 transition-colors duration-200 focus:border-olive focus:outline-none focus:ring-2 focus:ring-olive/25";

function ConsentLabel({
  template,
  linkLabel,
  locale,
}: {
  template: string;
  linkLabel: string;
  locale: Locale;
}): ReactNode {
  const [before, after] = template.split("{privacyLink}");
  return (
    <>
      {before}
      <a
        href={`/${locale}/privacy`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 transition-colors hover:text-olive"
      >
        {linkLabel}
      </a>
      {after}
    </>
  );
}

export function InquiryForm({
  form,
  locale,
  checkIn,
  checkOut,
  onSuccess,
}: {
  form: Dictionary["form"];
  locale: Locale;
  checkIn: string | null;
  checkOut: string | null;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const datesMissing = !checkIn || !checkOut;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = form.errorName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = form.errorEmail;
    if (!consent) nextErrors.consent = form.errorConsent;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || datesMissing) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          guests,
          checkIn,
          checkOut,
          message: message.trim(),
          consent,
          locale,
          website,
        }),
      });
      if (res.ok) {
        onSuccess();
      } else if (res.status === 429) {
        setServerError(form.errorRateLimited);
      } else {
        setServerError(form.errorGeneric);
      }
    } catch {
      setServerError(form.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative">
      <h3 className="font-display text-2xl text-ink">{form.title}</h3>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="inq-name" className="mb-1.5 block text-sm font-medium text-ink-soft">
            {form.name}
          </label>
          <input
            id="inq-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
          />
          {errors.name && <p className="mt-1.5 text-xs text-terracotta">{errors.name}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="inq-email" className="mb-1.5 block text-sm font-medium text-ink-soft">
              {form.email}
            </label>
            <input
              id="inq-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={inputClass}
            />
            {errors.email && <p className="mt-1.5 text-xs text-terracotta">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="inq-phone" className="mb-1.5 block text-sm font-medium text-ink-soft">
              {form.phone}
            </label>
            <input
              id="inq-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="inq-guests" className="mb-1.5 block text-sm font-medium text-ink-soft">
            {form.guests}
          </label>
          <select
            id="inq-guests"
            name="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className={inputClass}
          >
            {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {form.guestsSuffix}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="inq-message" className="mb-1.5 block text-sm font-medium text-ink-soft">
            {form.message}
          </label>
          <textarea
            id="inq-message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={form.messagePlaceholder}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Honeypot: visually hidden, real users never fill it. */}
        <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
          <label htmlFor="inq-website">Website</label>
          <input
            id="inq-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            className="mt-0.5 size-4 shrink-0 accent-olive"
          />
          <span>
            <ConsentLabel
              template={form.consent}
              linkLabel={form.privacyLinkLabel}
              locale={locale}
            />
          </span>
        </label>
        {errors.consent && <p className="text-xs text-terracotta">{errors.consent}</p>}

        {datesMissing && <p className="text-sm text-ink-faint">{form.datesRequired}</p>}
        {serverError && (
          <p role="alert" className="text-sm font-medium text-terracotta">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || datesMissing}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-olive-deep px-7 py-3.5 text-[15px] font-medium text-cream shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:bg-olive-ink hover:shadow-(--shadow-card-hover) disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
        >
          {submitting && <Loader2 aria-hidden className="size-4 animate-spin" />}
          {submitting ? form.submitting : form.submit}
        </button>
      </div>
    </form>
  );
}
