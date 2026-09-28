import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

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

export default async function BookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      customerId: session.user.id,
    },
    include: {
      service: true,
      barber: true,
    },
    orderBy: [
      {
        bookingDate: "desc",
      },
      {
        appointmentSlot: "desc",
      },
    ],
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-5xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Your Appointments
        </p>

        <div className="mt-3 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">
              My Bookings
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              View and manage your Trimly appointments.
            </p>
          </div>

          <Link
            href="/book"
            className="shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book appointment
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">No bookings yet.</h2>

            <p className="mt-2 text-sm leading-6 text-muted">
              Your appointments will appear here after you make a booking.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking.id}
                href={`/bookings/${booking.id}`}
                className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-primary"
              >
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold">
                        {booking.service.name}
                      </h2>

                      <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-muted">
                      with {booking.barber.name}
                    </p>

                    <p className="mt-4 text-sm font-medium">
                      {formatBookingDate(booking.bookingDate)} ·{" "}
                      {booking.appointmentSlot}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="font-medium">
                      {formatRupiah(booking.priceAtBooking)}
                    </p>

                    <p className="mt-2 text-sm text-muted">View details →</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}