import { DayOfWeek } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const dayOfWeekMap: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");

  if (!barberId || !date) {
    return NextResponse.json(
      {
        error: "barberId and date are required",
      },
      {
        status: 400,
      },
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      {
        error: "date must use YYYY-MM-DD format",
      },
      {
        status: 400,
      },
    );
  }

  const bookingDate = new Date(`${date}T00:00:00.000Z`);

  if (Number.isNaN(bookingDate.getTime())) {
    return NextResponse.json(
      {
        error: "Invalid date",
      },
      {
        status: 400,
      },
    );
  }

  const barber = await prisma.barber.findFirst({
    where: {
      id: barberId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!barber) {
    return NextResponse.json(
      {
        error: "Active barber not found",
      },
      {
        status: 404,
      },
    );
  }

  const dayOfWeek = dayOfWeekMap[bookingDate.getUTCDay()];

  const [schedules, existingBookings] = await Promise.all([
    prisma.barberSchedule.findMany({
      where: {
        barberId: barber.id,
        dayOfWeek,
      },
      orderBy: {
        slot: "asc",
      },
      select: {
        slot: true,
      },
    }),

    prisma.booking.findMany({
      where: {
        barberId: barber.id,
        bookingDate,
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        appointmentSlot: true,
      },
    }),
  ]);

  const occupiedSlots = new Set(
    existingBookings.map((booking) => booking.appointmentSlot),
  );

  const slots = schedules
    .map((schedule) => schedule.slot)
    .filter((slot) => !occupiedSlots.has(slot));

  return NextResponse.json({
    date,
    dayOfWeek,
    slots,
  });
}