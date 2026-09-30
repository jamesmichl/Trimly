import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ScheduleRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(
  _request: Request,
  { params }: ScheduleRouteProps,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 },
    );
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
    return NextResponse.json(
      { error: "Forbidden." },
      { status: 403 },
    );
  }

  const { id } = await params;

  const schedule = await prisma.barberSchedule.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!schedule) {
    return NextResponse.json(
      { error: "Schedule slot not found." },
      { status: 404 },
    );
  }

  const result = await prisma.barberSchedule.deleteMany({
    where: {
      id: schedule.id,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      {
        error:
          "Schedule slot changed while your request was being processed. Please refresh and try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    success: true,
  });
}