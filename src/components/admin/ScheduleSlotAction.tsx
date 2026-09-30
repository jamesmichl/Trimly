"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ScheduleSlotActionProps = {
  scheduleId: string;
  slot: string;
};

export default function ScheduleSlotAction({
  scheduleId,
  slot,
}: ScheduleSlotActionProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/schedules/${scheduleId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to remove schedule slot.",
        );
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isSubmitting}
        className="rounded-full border border-border px-3 py-1 text-xs transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Removing..." : `${slot} ×`}
      </button>

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}