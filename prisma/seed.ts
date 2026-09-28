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
      price: 75000,
    },
    {
      name: "Haircut + Wash",
      price: 100000,
    },
    {
      name: "Hair Coloring",
      price: 150000,
    },
    {
      name: "Beard Trim",
      price: 50000,
    },
    {
      name: "Haircut + Beard Trim",
      price: 110000,
    },
    {
      name: "Premium Grooming",
      price: 175000,
    },
  ];

  const barbers = [
    {
      name: "Elijah",
      bio: "Known for clean, precise cuts and a refined approach to modern grooming.",
    },
    {
      name: "Daniel",
      bio: "Focused on sharp, versatile styles with careful attention to detail.",
    },
    {
      name: "John",
      bio: "Combines classic barbering with a modern, polished finish.",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name: service.name,
      },
      update: {
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