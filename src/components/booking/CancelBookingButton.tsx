"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CancelBookingButtonProps = {
  bookingId: string;
};

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const router = useRouter();

  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) {
      return;
    }

    setIsCancelling(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      const data: {
        booking?: {
          id: string;
          status: string;
        };
        error?: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to cancel booking.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to cancel booking.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-red-600 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCancelling ? "Cancelling..." : "Cancel booking"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}