import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import BarberStatusAction from "@/components/admin/BarberStatusAction";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminBarbersPage() {
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

  const barbers = await prisma.barber.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          bookings: true,
          schedules: true,
        },
      },
    },
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
              Barbers
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              Manage the barbers available for customer appointments.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-sm font-medium underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        {barbers.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">No barbers yet.</h2>

            <p className="mt-2 text-sm text-muted">
              Barbers added to Trimly will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {barber.name}
                    </h2>

                    {barber.slug && (
                      <p className="mt-1 text-sm text-muted">
                        /barbers/{barber.slug}
                      </p>
                    )}
                  </div>

                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                    {barber.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                {barber.bio && (
                  <p className="mt-5 text-sm leading-6 text-muted">
                    {barber.bio}
                  </p>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">
                      Bookings
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {barber._count.bookings}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border p-4">
                    <p className="text-xs text-muted">
                      Schedule Slots
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      {barber._count.schedules}
                    </p>
                  </div>
                </div>

                <BarberStatusAction
                  barberId={barber.id}
                  isActive={barber.isActive}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}