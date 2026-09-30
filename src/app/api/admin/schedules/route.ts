import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const validDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

type DayOfWeek = (typeof validDays)[number];

type CreateScheduleBody = {
  barberId?: string;
  dayOfWeek?: DayOfWeek;
  slot?: string;
};

export async function POST(request: Request) {
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

  let body: CreateScheduleBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { barberId, dayOfWeek, slot } = body;

  if (!barberId || !dayOfWeek || !slot) {
    return NextResponse.json(
      {
        error: "barberId, dayOfWeek, and slot are required.",
      },
      { status: 400 },
    );
  }

  if (!validDays.includes(dayOfWeek)) {
    return NextResponse.json(
      { error: "Invalid day of week." },
      { status: 400 },
    );
  }

  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(slot)) {
    return NextResponse.json(
      {
        error: "Slot must use HH:MM format.",
      },
      { status: 400 },
    );
  }

  const barber = await prisma.barber.findUnique({
    where: {
      id: barberId,
    },
    select: {
      id: true,
    },
  });

  if (!barber) {
    return NextResponse.json(
      { error: "Barber not found." },
      { status: 404 },
    );
  }

  try {
    const schedule = await prisma.barberSchedule.create({
      data: {
        barberId: barber.id,
        dayOfWeek,
        slot,
      },
      select: {
        id: true,
        barberId: true,
        dayOfWeek: true,
        slot: true,
      },
    });

    return NextResponse.json(
      { schedule },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error: "This schedule slot already exists.",
        },
        { status: 409 },
      );
    }

    console.error("Failed to create schedule slot:", error);

    return NextResponse.json(
      { error: "Unable to create schedule slot." },
      { status: 500 },
    );
  }
}