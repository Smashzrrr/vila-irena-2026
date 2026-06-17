"use client";

import { useCallback, useMemo, useState } from "react";
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

// Availability is intentionally NOT published on the site: no platform calendar is
// accessible to sync, and bookings are confirmed personally. So the calendar is a pure
// date picker (nothing marked blocked) and the host verifies each inquiry by email.
const NO_BLOCKED: BlockedRange[] = [];

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
  const [checkIn, setCheckIn] = useState<string | null>(null);
  const [checkOut, setCheckOut] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const today = useMemo(() => todayISO(), []);

  const onDayClick = useCallback(
    (date: string) => {
      if (checkIn && !checkOut) {
        if (date === checkIn) {
          setCheckIn(null);
          return;
        }
        if (isValidCheckOut(checkIn, date, NO_BLOCKED, MIN_NIGHTS)) {
          setCheckOut(date);
          return;
        }
        if (isValidCheckIn(date, NO_BLOCKED, today)) {
          setCheckIn(date);
        }
        return;
      }
      if (isValidCheckIn(date, NO_BLOCKED, today)) {
        setCheckIn(date);
        setCheckOut(null);
      }
    },
    [checkIn, checkOut, today],
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
              <AvailabilityCalendar
                booking={booking}
                locale={locale}
                today={today}
                blocked={NO_BLOCKED}
                checkIn={checkIn}
                checkOut={checkOut}
                onDayClick={onDayClick}
              />
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
