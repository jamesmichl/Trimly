import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CancelBookingRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

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

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (booking.bookingDate < today) {
    return NextResponse.json(
      { error: "Past bookings cannot be cancelled." },
      { status: 400 },
    );
  }

  const cancelledBooking = await prisma.booking.update({
    where: {
      id: booking.id,
    },
    data: {
      status: "CANCELLED",
    },
    select: {
      id: true,
      status: true,
    },
  });

  return NextResponse.json({
    booking: cancelledBooking,
  });
}