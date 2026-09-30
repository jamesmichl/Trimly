import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  getBusinessDate,
  getBusinessTime,
} from "@/lib/date";
import { prisma } from "@/lib/prisma";

type CancelBookingRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatBookingDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function PATCH(
  _request: Request,
  { params }: CancelBookingRouteProps,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "You must be signed in to cancel a booking." },
      { status: 401 },
    );
  }

  const { id } = await params;

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      customerId: session.user.id,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 },
    );
  }

  if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
    return NextResponse.json(
      { error: "This booking can no longer be cancelled." },
      { status: 400 },
    );
  }

  const bookingDate = formatBookingDate(booking.bookingDate);
  const businessDate = getBusinessDate();

  if (bookingDate < businessDate) {
    return NextResponse.json(
      { error: "Past bookings cannot be cancelled." },
      { status: 400 },
    );
  }

  if (
    bookingDate === businessDate &&
    booking.appointmentSlot <= getBusinessTime()
  ) {
    return NextResponse.json(
      {
        error:
          "This booking can no longer be cancelled because the appointment time has already started.",
      },
      { status: 400 },
    );
  }

  const result = await prisma.booking.updateMany({
    where: {
      id: booking.id,
      customerId: session.user.id,
      status: booking.status,
    },
    data: {
      status: "CANCELLED",
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      {
        error:
          "This booking changed while your cancellation was being processed. Please refresh and try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    booking: {
      id: booking.id,
      status: "CANCELLED",
    },
  });
}