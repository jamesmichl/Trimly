import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import ServiceStatusAction from "@/components/admin/ServiceStatusAction";
import Navbar from "@/components/layout/Navbar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function AdminServicesPage() {
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

  const services = await prisma.service.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          bookings: true,
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
              Services
            </h1>

            <p className="mt-4 text-sm leading-6 text-muted">
              Manage the services available for customer bookings.
            </p>
          </div>

          <Link
            href="/admin"
            className="text-sm font-medium underline underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-surface p-8">
            <h2 className="text-xl font-semibold">
              No services yet.
            </h2>

            <p className="mt-2 text-sm text-muted">
              Services added to Trimly will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {service.name}
                    </h2>

                    <p className="mt-2 text-sm font-medium">
                      {formatRupiah(service.price)}
                    </p>
                  </div>

                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
                    {service.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                {service.description && (
                  <p className="mt-5 text-sm leading-6 text-muted">
                    {service.description}
                  </p>
                )}

                <div className="mt-6 rounded-xl border border-border p-4">
                  <p className="text-xs text-muted">
                    Bookings
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {service._count.bookings}
                  </p>
                </div>

                <ServiceStatusAction
                  serviceId={service.id}
                  isActive={service.isActive}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}