import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getBusinessDate,
  getBusinessTime,
} from "@/lib/date";
import { prisma } from "@/lib/prisma";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

const allowedTransitions: Record<
  BookingStatus,
  BookingStatus[]
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
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

  const { id } = await context.params;

  let body: { status?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const status = body.status;

  if (
    status !== "PENDING" &&
    status !== "CONFIRMED" &&
    status !== "COMPLETED" &&
    status !== "CANCELLED"
  ) {
    return NextResponse.json(
      { error: "Invalid booking status." },
      { status: 400 },
    );
  }

  const booking = await prisma.booking.findUnique({
    where: {
      id,
    },
    select: {
      status: true,
      bookingDate: true,
      appointmentSlot: true,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 },
    );
  }

  const currentStatus = booking.status as BookingStatus;

  if (!allowedTransitions[currentStatus].includes(status)) {
    return NextResponse.json(
      {
        error: `Cannot change booking from ${currentStatus} to ${status}.`,
      },
      { status: 409 },
    );
  }

  if (status === "COMPLETED") {
    const bookingDate = booking.bookingDate
      .toISOString()
      .slice(0, 10);

    const businessDate = getBusinessDate();
    const businessTime = getBusinessTime();

    const appointmentHasStarted =
      bookingDate < businessDate ||
      (bookingDate === businessDate &&
        booking.appointmentSlot <= businessTime);

    if (!appointmentHasStarted) {
      return NextResponse.json(
        {
          error:
            "This booking cannot be completed before the appointment time.",
        },
        { status: 400 },
      );
    }
  }

  const result = await prisma.booking.updateMany({
    where: {
      id,
      status: currentStatus,
    },
    data: {
      status,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      {
        error:
          "Booking status changed before this update. Please try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    booking: {
      id,
      status,
    },
  });
}