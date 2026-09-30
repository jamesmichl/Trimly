import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import AddScheduleSlotForm from "@/components/admin/AddScheduleSlotForm";
import ScheduleSlotAction from "@/components/admin/ScheduleSlotAction";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const dayOrder = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

const dayLabels = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export default async function AdminSchedulesPage() {
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
      schedules: {
        orderBy: {
          slot: "asc",
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
              Schedules
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              Review and manage the fixed appointment slots available for each
              barber.
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
            <h2 className="text-xl font-semibold">
              No barbers yet.
            </h2>

            <p className="mt-2 text-sm text-muted">
              Barber schedules will appear here once barbers are available.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-8">
            {barbers.map((barber) => (
              <section
                key={barber.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {barber.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                      {barber.isActive
                        ? "Active barber"
                        : "Inactive barber"}
                    </p>
                  </div>

                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                    {barber.schedules.length} slots
                  </span>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {dayOrder.map((day) => {
                    const schedules = barber.schedules.filter(
                      (schedule) =>
                        schedule.dayOfWeek === day,
                    );

                    return (
                      <div
                        key={day}
                        className="rounded-xl border border-border p-4"
                      >
                        <h3 className="font-semibold">
                          {dayLabels[day]}
                        </h3>

                        {schedules.length === 0 ? (
                          <p className="mt-3 text-sm text-muted">
                            Closed
                          </p>
                        ) : (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {schedules.map((schedule) => (
                              <ScheduleSlotAction
                                key={schedule.id}
                                scheduleId={schedule.id}
                                slot={schedule.slot}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <AddScheduleSlotForm
                  barberId={barber.id}
                />
              </section>
            ))}
          </div>
        )}
      </main>
    </>
  );
}