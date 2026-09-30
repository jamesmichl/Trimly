"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AddScheduleSlotFormProps = {
  barberId: string;
};

const days = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

export default function AddScheduleSlotForm({
  barberId,
}: AddScheduleSlotFormProps) {
  const router = useRouter();

  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [slot, setSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barberId,
          dayOfWeek,
          slot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to add schedule slot.",
        );
        return;
      }

      setSlot("");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-xl border border-border p-4"
    >
      <p className="text-sm font-semibold">
        Add Schedule Slot
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="flex min-w-40 flex-col gap-2">
          <span className="text-xs text-muted">
            Day
          </span>

          <select
            value={dayOfWeek}
            onChange={(event) =>
              setDayOfWeek(event.target.value)
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {days.map((day) => (
              <option
                key={day.value}
                value={day.value}
              >
                {day.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-40 flex-col gap-2">
          <span className="text-xs text-muted">
            Time
          </span>

          <input
            type="time"
            value={slot}
            onChange={(event) =>
              setSlot(event.target.value)
            }
            required
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Adding..." : "Add Slot"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}