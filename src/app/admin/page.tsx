import { headers } from "next/headers";
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
          Manage Trimly bookings, barbers, services, and schedules.
        </p>
      </main>
    </>
  );
}