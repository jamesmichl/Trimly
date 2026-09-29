"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ReviewFormProps = {
  bookingId: string;
};

export default function ReviewForm({ bookingId }: ReviewFormProps) {
  const router = useRouter();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to submit review.");
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
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your Review
        </p>

        <h2 className="mt-2 text-xl font-semibold">
          How was your experience?
        </h2>

        <p className="mt-2 text-sm text-muted">
          Rate your appointment from 1 to 5.
        </p>
      </div>

      <div className="mt-6">
        <label
          htmlFor="rating"
          className="text-sm font-medium"
        >
          Rating
        </label>

        <select
          id="rating"
          value={rating}
          onChange={(event) => setRating(Number(event.target.value))}
          disabled={isSubmitting}
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Poor</option>
          <option value={1}>1 - Very Poor</option>
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="comment"
          className="text-sm font-medium"
        >
          Comment
        </label>

        <textarea
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={isSubmitting}
          maxLength={500}
          rows={4}
          placeholder="Tell us about your experience..."
          className="mt-2 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
        />

        <p className="mt-1 text-right text-xs text-muted">
          {comment.length}/500
        </p>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}