import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
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

  const [
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        status: "PENDING",
      },
    }),
    prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    }),
    prisma.booking.count({
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.booking.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  const stats = [
    {
      label: "Total Bookings",
      value: totalBookings,
    },
    {
      label: "Pending",
      value: pendingBookings,
    },
    {
      label: "Confirmed",
      value: confirmedBookings,
    },
    {
      label: "Completed",
      value: completedBookings,
    },
    {
      label: "Cancelled",
      value: cancelledBookings,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Administration
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-sm leading-6 text-muted">
          Monitor Trimly booking activity and day-to-day operations.
        </p>

        <section className="mt-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <p className="text-sm text-muted">
                  {stat.label}
                </p>

                <p className="mt-3 text-3xl font-semibold tracking-tight">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Management
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Manage Trimly
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/bookings"
              className="rounded-2xl border border-border bg-surface p-6 transition-opacity hover:opacity-80"
            >
              <h3 className="text-lg font-semibold">
                Bookings
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Review appointments, update booking statuses, and contact
                customers.
              </p>

              <p className="mt-5 text-sm font-medium text-primary">
                Manage bookings →
              </p>
            </Link>

            <Link
              href="/admin/barbers"
              className="rounded-2xl border border-border bg-surface p-6 transition-opacity hover:opacity-80"
            >
              <h3 className="text-lg font-semibold">
                Barbers
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Review barber information and control booking availability.
              </p>

              <p className="mt-5 text-sm font-medium text-primary">
                Manage barbers →
              </p>
            </Link>

            <Link
              href="/admin/services"
              className="rounded-2xl border border-border bg-surface p-6 transition-opacity hover:opacity-80"
            >
              <h3 className="text-lg font-semibold">
                Services
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted">
                Review service pricing and control which services customers
                can book.
              </p>

              <p className="mt-5 text-sm font-medium text-primary">
                Manage services →
              </p>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}