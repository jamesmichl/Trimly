import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ServiceStatusRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateServiceStatusBody = {
  isActive?: boolean;
};

export async function PATCH(
  request: Request,
  { params }: ServiceStatusRouteProps,
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

  let body: UpdateServiceStatusBody;

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

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service not found." },
      { status: 404 },
    );
  }

  if (service.isActive === body.isActive) {
    return NextResponse.json({
      service,
    });
  }

  const result = await prisma.service.updateMany({
    where: {
      id: service.id,
      isActive: service.isActive,
    },
    data: {
      isActive: body.isActive,
    },
  });

  if (result.count === 0) {
    return NextResponse.json(
      {
        error:
          "Service status changed while your request was being processed. Please refresh and try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    service: {
      id: service.id,
      isActive: body.isActive,
    },
  });
}