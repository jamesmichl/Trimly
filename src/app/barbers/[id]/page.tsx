import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

const barbers = [
  {
    id: "elijah",
    name: "Elijah",
    rating: 4.9,
    reviewCount: 84,
  },
  {
    id: "daniel",
    name: "Daniel",
    rating: 4.8,
    reviewCount: 67,
  },
  {
    id: "john",
    name: "John",
    rating: 4.9,
    reviewCount: 52,
  },
  {
    id: "michael",
    name: "Michael",
    rating: 4.7,
    reviewCount: 46,
  },
  {
    id: "ryan",
    name: "Ryan",
    rating: 4.8,
    reviewCount: 39,
  },
  {
    id: "jonathan",
    name: "Jonathan",
    rating: 4.9,
    reviewCount: 31,
  },
];

type BarberProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BarberProfilePage({
  params,
}: BarberProfilePageProps) {
  const { id } = await params;

  const barber = barbers.find((barber) => barber.id === id);

  if (!barber) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
          Barber Profile
        </p>

        <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl">
          {barber.name}
        </h1>

        <p className="mt-6 text-base text-muted">
          ★ {barber.rating.toFixed(1)} · {barber.reviewCount} reviews
        </p>
      </main>
    </>
  );
}