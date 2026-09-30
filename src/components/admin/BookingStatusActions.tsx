"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type BookingStatusActionsProps = {
  bookingId: string;
  status: BookingStatus;
  canComplete: boolean;
};

export default function BookingStatusActions({
  bookingId,
  status,
  canComplete,
}: BookingStatusActionsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: BookingStatus) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to update booking.",
        );
        return;
      }

      router.refresh();
    } catch {
      setError(
        "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (
    status === "COMPLETED" ||
    status === "CANCELLED"
  ) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap gap-2">
        {status === "PENDING" && (
          <button
            type="button"
            disabled={isLoading}
            onClick={() =>
              updateStatus("CONFIRMED")
            }
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Updating..." : "Confirm"}
          </button>
        )}

        {status === "CONFIRMED" &&
          canComplete && (
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                updateStatus("COMPLETED")
              }
              className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Updating..."
                : "Complete"}
            </button>
          )}

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            updateStatus("CANCELLED")
          }
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}