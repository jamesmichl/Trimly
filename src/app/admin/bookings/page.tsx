import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import BookingStatusActions from "@/components/admin/BookingStatusActions";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { normalizeIndonesianPhoneNumber } from "@/lib/phone";
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

export default async function AdminBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      role: true,
    },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const bookings = await prisma.booking.findMany({
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      barber: true,
      service: true,
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

      <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Administration
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Bookings
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              Review and manage customer appointments.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-sm font-medium underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">No bookings yet.</h2>

            <p className="mt-2 text-sm text-muted">
              Customer appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            {bookings.map((booking) => {
              const whatsappNumber = booking.customer.phoneNumber
                ? normalizeIndonesianPhoneNumber(
                    booking.customer.phoneNumber,
                  )
                : null;

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-semibold">
                          {booking.service.name}
                        </h2>

                        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted">
                        {booking.customer.name} · {booking.customer.email}
                      </p>

                      <p className="mt-1 text-sm text-muted">
                        Phone:{" "}
                        {booking.customer.phoneNumber ?? "Not provided"}
                      </p>

                      {whatsappNumber && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4"
                        >
                          Contact via WhatsApp
                        </a>
                      )}

                      <p className="mt-4 text-sm font-medium">
                        {formatBookingDate(booking.bookingDate)} ·{" "}
                        {booking.appointmentSlot}
                      </p>

                      <p className="mt-1 text-sm text-muted">
                        Barber: {booking.barber.name}
                      </p>

                      <BookingStatusActions
                        bookingId={booking.id}
                        status={booking.status}
                      />
                    </div>

                    <div className="md:text-right">
                      <p className="font-medium">
                        {formatRupiah(booking.priceAtBooking)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}