import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import CancelBookingButton from "@/components/booking/CancelBookingButton";
import ReviewForm from "@/components/booking/ReviewForm";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatRupiah(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatBookingDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

type BookingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BookingDetailPage({
  params,
}: BookingDetailPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      customerId: session.user.id,
    },
    include: {
      service: true,
      barber: true,
      review: true,
    },
  });

  if (!booking) {
    notFound();
  }

  const canCancel =
    ["PENDING", "CONFIRMED"].includes(booking.status) &&
    booking.bookingDate >=
      new Date(
        new Date().toISOString().slice(0, 10) + "T00:00:00.000Z",
      );

  const canReview =
    booking.status === "COMPLETED" && booking.review === null;

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Booking Details
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Your appointment
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted">
          Review your appointment details and current booking status.
        </p>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-6 p-6">
            <span className="text-sm text-muted">Status</span>
            <span className="font-medium">{booking.status}</span>
          </div>

          <div className="flex items-center justify-between gap-6 p-6">
            <span className="text-sm text-muted">Service</span>

            <div className="text-right">
              <p className="font-medium">{booking.service.name}</p>
              <p className="mt-1 text-sm text-muted">
                {formatRupiah(booking.priceAtBooking)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 p-6">
            <span className="text-sm text-muted">Barber</span>
            <span className="font-medium">{booking.barber.name}</span>
          </div>

          <div className="flex items-center justify-between gap-6 p-6">
            <span className="text-sm text-muted">Date</span>
            <span className="font-medium">
              {formatBookingDate(booking.bookingDate)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-6 p-6">
            <span className="text-sm text-muted">Time</span>
            <span className="font-medium">{booking.appointmentSlot}</span>
          </div>
        </div>

        {canReview && <ReviewForm bookingId={booking.id} />}

        {booking.review && (
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Your Review
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {booking.review.rating}/5
            </h2>

            {booking.review.comment && (
              <p className="mt-3 text-sm leading-6 text-muted">
                {booking.review.comment}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium underline underline-offset-4"
          >
            Back to home
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {canCancel && <CancelBookingButton bookingId={booking.id} />}

            <Link
              href="/book"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Book another appointment
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}