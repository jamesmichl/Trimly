"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BarberStatusActionProps = {
  barberId: string;
  isActive: boolean;
};

export default function BarberStatusAction({
  barberId,
  isActive,
}: BarberStatusActionProps) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/barbers/${barberId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: !isActive,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to update barber status.");
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
    <div className="mt-6">
      <button
        type="button"
        onClick={handleStatusChange}
        disabled={isSubmitting}
        className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Updating..."
          : isActive
            ? "Deactivate Barber"
            : "Activate Barber"}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}