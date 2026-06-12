"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import type { BlockedRange } from "@/lib/ical";
import { MIN_NIGHTS } from "@/lib/config";
import { isValidCheckIn, isValidCheckOut } from "@/lib/booking-logic";
import { todayISO } from "@/lib/dates";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { InquiryForm } from "./InquiryForm";
import { StaySummary } from "./StaySummary";
import { SuccessPanel } from "./SuccessPanel";

type AvailabilityState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; blocked: BlockedRange[] };

export function BookingSection({
  booking,
  form,
  success,
  locale,
}: {
  booking: Dictionary["booking"];
  form: Dictionary["form"];
  success: Dictionary["success"];
  locale: Locale;
}) {
  const [availability, setAvailability] = useState<AvailabilityState>({ status: "loading" });
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const today = useMemo(() => todayISO(), []);

  const load = useCallback(async () => {
    setAvailability({ status: "loading" });
    try {
      const res = await fetch("/api/availability");
      if (!res.ok) throw new Error(`availability ${res.status}`);
      const data = (await res.json()) as { blocked: BlockedRange[] };
      setAvailability({ status: "ready", blocked: data.blocked });
    } catch {
      setAvailability({ status: "error" });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const blocked = availability.status === "ready" ? availability.blocked : [];

  const onDayClick = useCallback(
    (date: string) => {
      if (checkIn && !checkOut) {
        if (date === checkIn) {
          setCheckIn(null);
          return;
        }
        if (isValidCheckOut(checkIn, date, blocked, MIN_NIGHTS)) {
          setCheckOut(date);
          return;
        }
        if (isValidCheckIn(date, blocked, today)) {
          setCheckIn(date);
        }
        return;
      }
      if (isValidCheckIn(date, blocked, today)) {
        setCheckIn(date);
        setCheckOut(null);
      }
    },
    [checkIn, checkOut, blocked, today],
  );

  const clearDates = useCallback(() => {
    setCheckIn(null);
    setCheckOut(null);
  }, []);

  const resetAll = useCallback(() => {
    clearDates();
    setSubmitted(false);
  }, [clearDates]);

  return (
    <section id="booking" className="bg-sand py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <SectionHeading eyebrow={booking.eyebrow} title={booking.title} align="center" />
          <p className="mx-auto mt-5 max-w-2xl text-center leading-relaxed text-ink-soft">
            {booking.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="grid gap-10 rounded-3xl border border-stone/50 bg-white p-6 shadow-(--shadow-card) md:p-10 lg:grid-cols-[7fr_5fr] lg:gap-12">
            <div>
              {availability.status === "error" ? (
                <div className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl bg-sand/60 p-8 text-center">
                  <p className="text-ink-soft">{booking.error}</p>
                  <button
                    type="button"
                    onClick={() => void load()}
                    className="rounded-full bg-olive-deep px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-olive-ink"
                  >
                    {booking.retry}
                  </button>
                </div>
              ) : (
                <AvailabilityCalendar
                  booking={booking}
                  locale={locale}
                  today={today}
                  blocked={blocked}
                  loading={availability.status === "loading"}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onDayClick={onDayClick}
                />
              )}
              <p className="mt-6 text-xs leading-relaxed text-ink-faint">
                {booking.availabilityNote}
              </p>
            </div>

            <div className="flex flex-col">
              <StaySummary
                booking={booking}
                locale={locale}
                checkIn={checkIn}
                checkOut={checkOut}
                onClear={clearDates}
              />
              <div className="mt-6 flex-1">
                {submitted ? (
                  <SuccessPanel success={success} onAgain={resetAll} />
                ) : (
                  <InquiryForm
                    form={form}
                    locale={locale}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onSuccess={() => setSubmitted(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
