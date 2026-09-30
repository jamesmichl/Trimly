import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type BarberStatusRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateBarberStatusBody = {
  isActive?: boolean;
};

export async function PATCH(
  request: Request,
  { params }: BarberStatusRouteProps,
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

  let body: UpdateBarberStatusBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  if (typeof body.isActive !== "boolean") {
    return NextResponse.json(
      { error: "isActive must be a boolean." },
      { status: 400 },
    );
  }

  const { id } = await params;

  const barber = await prisma.barber.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!barber) {
    return NextResponse.json(
      { error: "Barber not found." },
      { status: 404 },
    );
  }

  if (barber.isActive === body.isActive) {
    return NextResponse.json({
      barber,
    });
  }

  const result = await prisma.barber.updateMany({
    where: {
      id: barber.id,
      isActive: barber.isActive,
    },
    data: {
      isActive: body.isActive,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      {
        error:
          "Barber status changed while your request was being processed. Please refresh and try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    barber: {
      id: barber.id,
      isActive: body.isActive,
    },
  });
}