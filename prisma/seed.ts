import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const services = [
  {
    name: "Signature Haircut",
    description:
      "A precision haircut tailored to your style, face shape, and preferences.",
    price: 75000,
  },
  {
    name: "Haircut + Wash",
    description:
      "A tailored haircut followed by a refreshing wash for a clean finish.",
    price: 100000,
  },
  {
    name: "Hair Coloring",
    description:
      "Professional hair coloring designed to refresh or redefine your look.",
    price: 150000,
  },
  {
    name: "Beard Trim",
    description:
      "A clean and precise beard trim to sharpen your overall look.",
    price: 50000,
  },
  {
    name: "Haircut + Beard Trim",
    description:
      "A complete grooming session combining a tailored haircut and beard trim.",
    price: 110000,
  },
  {
    name: "Premium Grooming",
    description:
      "A complete grooming experience for a polished and refreshed finish.",
    price: 175000,
  },
];

  const barbers = [
  {
    name: "Elijah",
    slug: "elijah",
    bio: "Known for clean, precise cuts and a refined approach to modern grooming.",
  },
  {
    name: "Daniel",
    slug: "daniel",
    bio: "Focused on sharp, versatile styles with careful attention to detail.",
  },
  {
    name: "John",
    slug: "john",
    bio: "Combines classic barbering with a modern, polished finish.",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name: service.name,
      },
      update: {
        description: service.description,
        price: service.price,
        isActive: true,
      },
      create: service,
    });
  }

  for (const barber of barbers) {
    await prisma.barber.upsert({
      where: {
        name: barber.name,
      },
      update: {
        slug: barber.slug,
        bio: barber.bio,
        isActive: true,
      },
      create: barber,
    });
  }

  const seededBarbers = await prisma.barber.findMany({
  where: {
    name: {
      in: barbers.map((barber) => barber.name),
    },
  },
});

const workingDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

const schedules = seededBarbers.flatMap((barber) =>
  workingDays.flatMap((dayOfWeek) =>
    timeSlots.map((slot) => ({
      barberId: barber.id,
      dayOfWeek,
      slot,
    }))
  )
);

await prisma.barberSchedule.createMany({
  data: schedules,
  skipDuplicates: true,
});

  console.log(`Seeded ${services.length} services.`);
  console.log(`Seeded ${barbers.length} barbers.`);
  console.log(`Seeded ${schedules.length} barber schedules.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });