import Navbar from "@/components/layout/Navbar";
import BarberCard from "@/components/barber/BarberCard";

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

export default function BarbersPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Our Barbers
            </p>

            <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl">
              Find the barber that fits you.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Meet the team behind every great cut. Browse customer ratings and
              choose who you want for your next appointment.
            </p>
          </div>

          <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                id={barber.id}
                name={barber.name}
                rating={barber.rating}
                reviewCount={barber.reviewCount}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}