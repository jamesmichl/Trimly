import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CreateBookingBody = {
  serviceId?: string;
  barberId?: string;
  date?: string;
  appointmentSlot?: string;
};

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to book an appointment." },
      { status: 401 },
    );
  }

  let body: CreateBookingBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { serviceId, barberId, date, appointmentSlot } = body;

  if (!serviceId || !barberId || !date || !appointmentSlot) {
    return NextResponse.json(
      {
        error:
          "serviceId, barberId, date, and appointmentSlot are required.",
      },
      { status: 400 },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Date must use YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(bookingDate.getTime())) {
    return NextResponse.json(
      { error: "Invalid booking date." },
      { status: 400 },
    );
  }

  const [service, barber] = await Promise.all([
    prisma.service.findFirst({
      where: {
        id: serviceId,
        isActive: true,
      },
    }),
    prisma.barber.findFirst({
      where: {
        id: barberId,
        isActive: true,
      },
    }),
  ]);

  if (!service) {
    return NextResponse.json(
      { error: "Service not found or unavailable." },
      { status: 404 },
    );
  }

  if (!barber) {
    return NextResponse.json(
      { error: "Barber not found or unavailable." },
      { status: 404 },
    );
  }

  const dayOfWeekMap = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ] as const;

  const dayOfWeek = dayOfWeekMap[bookingDate.getDay()];

  const schedule = await prisma.barberSchedule.findFirst({
    where: {
      barberId,
      dayOfWeek,
      slot: appointmentSlot,
    },
  });

  if (!schedule) {
    return NextResponse.json(
      { error: "This appointment slot is not available." },
      { status: 400 },
    );
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        customerId: session.user.id,
        barberId,
        serviceId,
        bookingDate,
        appointmentSlot,
        priceAtBooking: service.price,
      },
      select: {
        id: true,
        status: true,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "This appointment was just booked by someone else. Please choose another time.",
        },
        { status: 409 },
      );
    }

    console.error("Failed to create booking:", error);

    return NextResponse.json(
      { error: "Unable to create booking." },
      { status: 500 },
    );
  }
}