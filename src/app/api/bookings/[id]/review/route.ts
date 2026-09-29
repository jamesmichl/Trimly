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
  const rating = body.rating;
  const comment =
    typeof body.comment === "string" ? body.comment.trim() : "";

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be an integer between 1 and 5." },
      { status: 400 },
    );
  }

  if (comment.length > 500) {
    return NextResponse.json(
      { error: "Review comment cannot exceed 500 characters." },
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
      { error: "Only completed bookings can be reviewed." },
      { status: 409 },
    );
  }

  try {
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        rating,
        comment: comment || null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { review },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "This booking has already been reviewed." },
        { status: 409 },
      );
    }

    throw error;
  }
}