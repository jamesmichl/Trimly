"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TipFormProps = {
  bookingId: string;
};

const tipOptions = [10000, 20000, 50000];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TipForm({ bookingId }: TipFormProps) {
  const router = useRouter();

  const [amount, setAmount] = useState<number>(20000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/tip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to add tip.");
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
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-2xl border border-border bg-surface p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Tip Your Barber
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        Show your appreciation
      </h2>

      <p className="mt-2 text-sm leading-6 text-muted">
        Choose a tip amount for your barber. This is a simulated tip for the
        Trimly MVP and does not process a real payment.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {tipOptions.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isSubmitting}
            onClick={() => setAmount(option)}
            className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${
              amount === option
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border"
            }`}
          >
            {formatRupiah(option)}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Adding Tip..."
          : `Add ${formatRupiah(amount)} Tip`}
      </button>
    </form>
  );
}