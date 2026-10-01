import Navbar from "@/components/layout/Navbar";
import BarberCard from "@/components/barber/BarberCard";
import { prisma } from "@/lib/prisma";
import Footer from "@/components/layout/Footer";

export default async function BarbersPage() {
  const barbers = await prisma.barber.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      bookings: {
        where: {
          status: "COMPLETED",
          review: {
            isNot: null,
          },
        },
        select: {
          review: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

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
            {barbers.map((barber) => {
              const ratings = barber.bookings
                .map((booking) => booking.review?.rating)
                .filter((rating): rating is number => rating !== undefined);

              const reviewCount = ratings.length;

              const averageRating =
                reviewCount > 0
                  ? ratings.reduce((total, rating) => total + rating, 0) /
                    reviewCount
                  : null;

              return (
                <BarberCard
                  key={barber.id}
                  id={barber.slug ?? barber.id}
                  name={barber.name}
                  rating={averageRating}
                  reviewCount={reviewCount}
                />
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}