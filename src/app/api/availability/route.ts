import { DayOfWeek } from "@/generated/prisma/client";
import {
  getBusinessDate,
  getBusinessTime,
  parseBookingDate,
} from "@/lib/date";
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

  const bookingDate = parseBookingDate(date);

  if (!bookingDate) {
    return NextResponse.json(
      {
        error: "Invalid date. Use a real date in YYYY-MM-DD format.",
      },
      {
        status: 400,
      },
    );
  }

  const businessDate = getBusinessDate();

  if (date < businessDate) {
    return NextResponse.json(
      {
        error: "Past dates are not available for booking.",
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

  const businessTime = getBusinessTime();

  const slots = schedules
    .map((schedule) => schedule.slot)
    .filter((slot) => !occupiedSlots.has(slot))
    .filter((slot) => {
      if (date !== businessDate) {
        return true;
      }

      return slot > businessTime;
    });

  return NextResponse.json({
    date,
    dayOfWeek,
    slots,
  });
}