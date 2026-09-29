import { Prisma } from "@/generated/prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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

  const { id } = await context.params;

  const body = await request.json();
  const amount = body.amount;

  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json(
      { error: "Tip amount must be a positive integer." },
      { status: 400 },
    );
  }

  if (amount > 1_000_000) {
    return NextResponse.json(
      { error: "Tip amount cannot exceed Rp1.000.000." },
      { status: 400 },
    );
  }

  const booking = await prisma.booking.findFirst({
    where: {
      id,
      customerId: session.user.id,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found." },
      { status: 404 },
    );
  }

  if (booking.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Tips can only be given for completed bookings." },
      { status: 409 },
    );
  }

  try {
    const tip = await prisma.tip.create({
      data: {
        bookingId: booking.id,
        amount,
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { tip },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "A tip has already been added to this booking." },
        { status: 409 },
      );
    }

    throw error;
  }
}