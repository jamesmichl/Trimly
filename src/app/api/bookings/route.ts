import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { auth } from "@/lib/auth";
import {
  getBusinessDate,
  getBusinessTime,
  parseBookingDate,
} from "@/lib/date";
import { prisma } from "@/lib/prisma";

type CreateBookingBody = {
  serviceId?: string;
  barberId?: string;
  date?: string;
  appointmentSlot?: string;
};

const dayOfWeekMap = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

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

  const bookingDate = parseBookingDate(date);

  if (!bookingDate) {
    return NextResponse.json(
      {
        error: "Invalid date. Use a real date in YYYY-MM-DD format.",
      },
      { status: 400 },
    );
  }

  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(appointmentSlot)) {
    return NextResponse.json(
      {
        error: "Appointment slot must use HH:MM format.",
      },
      { status: 400 },
    );
  }

  const businessDate = getBusinessDate();

  if (date < businessDate) {
    return NextResponse.json(
      {
        error: "Past dates are not available for booking.",
      },
      { status: 400 },
    );
  }

  if (
    date === businessDate &&
    appointmentSlot <= getBusinessTime()
  ) {
    return NextResponse.json(
      {
        error: "This appointment time has already passed.",
      },
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

  const dayOfWeek = dayOfWeekMap[bookingDate.getUTCDay()];

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

    return NextResponse.json(
      { booking },
      { status: 201 },
    );
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