"use client";

import { useMemo, useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { CheckCircle2 } from "lucide-react";
import Button, { buttonStyles } from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import Textarea from "@/components/ui/Textarea";
import FormField, { fieldClass } from "@/components/ui/FormField";
import { ApiError, api, getErrorMessage } from "@/lib/api";
import { MAX_BOOKING_DAYS_AHEAD } from "@/lib/constants";
import { addDays, dayOfWeek, salonToday } from "@/lib/dates";
import { cn, formatDate } from "@/lib/utils";
import type { Service } from "@/types";

type Slot = { time: string; available: boolean };
type SlotsResult = { key: string; slots: Slot[]; error: string };

export default function BookingForm({
  service,
  onCancel,
}: {
  service: Service;
  onCancel: () => void;
}) {
  const { minDate, maxDate } = useMemo(() => {
    const today = salonToday();
    return { minDate: today, maxDate: addDays(today, MAX_BOOKING_DAYS_AHEAD) };
  }, []);

  const [date, setDate] = useState("");
  const [slotsResult, setSlotsResult] = useState<SlotsResult | null>(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ date?: string; slot?: string; message?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ date: string; time: string } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function dateProblem(value: string) {
    if (!value) return "Choose an appointment date";
    if (value < minDate) return "Appointment date cannot be in the past";
    if (value > maxDate) return `You can book up to ${MAX_BOOKING_DAYS_AHEAD} days ahead`;
    if (dayOfWeek(value) === 5) return "The salon is closed on Fridays. Please pick another day";
    return "";
  }

  const validDate = !!date && !dateProblem(date);
  const requestKey = `${date}|${reloadKey}`;

  // Load slot availability whenever the date (or a retry) changes
  useEffect(() => {
    if (!validDate) return;
    let cancelled = false;

    api<{ data: { slots: Slot[] } }>("/api/appointments/slots", {
      auth: true,
      query: { date },
    })
      .then((res) => {
        if (!cancelled) setSlotsResult({ key: requestKey, slots: res.data.slots, error: "" });
      })
      .catch((err) => {
        if (!cancelled) {
          setSlotsResult({
            key: requestKey,
            slots: [],
            error: getErrorMessage(err, "Could not load time slots"),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [validDate, date, requestKey]);

  // The stored result is only valid if it belongs to the current request
  const slotsReady = slotsResult?.key === requestKey;
  const slotsLoading = validDate && !slotsReady;
  const slots = slotsReady && slotsResult ? slotsResult.slots : [];
  const slotsError = slotsReady && slotsResult ? slotsResult.error : "";

  function handleDateChange(value: string) {
    setDate(value);
    setTimeSlot("");
    setErrors((e) => ({ ...e, date: dateProblem(value) || undefined, slot: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const next = {
      date: dateProblem(date) || undefined,
      slot: timeSlot ? undefined : "Choose an available time slot",
      message: message.length > 500 ? "Message must be 500 characters or fewer" : undefined,
    };
    setErrors(next);
    if (next.date || next.slot || next.message) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSubmitting(true);
    try {
      await api("/api/appointments", {
        method: "POST",
        auth: true,
        body: {
          serviceId: service._id,
          appointmentDate: date,
          timeSlot,
          message: message.trim(),
        },
      });
      toast.success("Appointment request submitted. Please wait for confirmation");
      setDone({ date, time: timeSlot });
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not submit your request"));
      if (err instanceof ApiError && err.status === 409) {
        // Someone took the slot first: refresh availability and clear the choice
        setTimeSlot("");
        setReloadKey((k) => k + 1);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-success" aria-hidden="true" />
        <h3 className="mt-3 text-lg font-semibold">Request sent</h3>
        <p className="mt-1 text-sm text-muted">
          {service.serviceName} on {formatDate(done.date)} at {done.time}. The salon will confirm
          it soon, and then you can pay from your dashboard.
        </p>
        <Link
          href="/dashboard/customer/appointments"
          className={buttonStyles({ className: "mt-5 w-full" })}
        >
          View My Appointments
        </Link>
      </div>
    );
  }

  const noneAvailable = slots.length > 0 && slots.every((s) => !s.available);

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField id="appointment-date" label="Appointment date" error={errors.date}>
        <input
          id="appointment-date"
          type="date"
          min={minDate}
          max={maxDate}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          aria-invalid={!!errors.date}
          className={fieldClass}
        />
      </FormField>

      <div>
        <p className="mb-1.5 text-sm font-medium">Available time slot</p>
        {!validDate ? (
          <p className="text-sm text-muted">Choose a valid date to see time slots.</p>
        ) : slotsLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Spinner className="h-4 w-4" /> Checking availability...
          </p>
        ) : slotsError ? (
          <p className="text-sm text-danger">
            {slotsError}{" "}
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="font-medium underline"
            >
              Retry
            </button>
          </p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Time slots">
              {slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  aria-pressed={timeSlot === s.time}
                  onClick={() => {
                    setTimeSlot(s.time);
                    setErrors((er) => ({ ...er, slot: undefined }));
                  }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-xs font-medium transition-colors sm:text-sm",
                    timeSlot === s.time
                      ? "border-primary bg-primary text-white"
                      : s.available
                        ? "border-border bg-surface hover:border-primary hover:text-primary"
                        : "cursor-not-allowed border-border bg-stone-100 text-muted line-through"
                  )}
                >
                  {s.time}
                </button>
              ))}
            </div>
            {noneAvailable && (
              <p className="mt-2 text-sm text-warning">All slots are booked. Try another date.</p>
            )}
          </>
        )}
        {errors.slot && <p className="mt-1 text-sm text-danger">{errors.slot}</p>}
      </div>

      <Textarea
        label="Additional message (optional)"
        rows={3}
        maxLength={500}
        placeholder="Anything the salon should know?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        error={errors.message}
        hint={`${message.length}/500`}
      />

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" loading={submitting}>
          {submitting ? "Sending..." : "Request Appointment"}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}