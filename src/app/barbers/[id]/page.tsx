import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";

type BarberProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BarberProfilePage({
  params,
}: BarberProfilePageProps) {
  const { id } = await params;

  const barber = await prisma.barber.findUnique({
    where: {
      slug: id,
    },
    include: {
      bookings: {
        where: {
          status: "COMPLETED",
        },
        select: {
          id: true,
          review: {
            select: {
              rating: true,
            },
          },
        },
      },
    },
  });

  if (!barber) {
    notFound();
  }

  const ratings = barber.bookings
    .map((booking) => booking.review?.rating)
    .filter((rating): rating is number => rating !== undefined);

  const reviewCount = ratings.length;

  const averageRating =
    reviewCount > 0
      ? ratings.reduce((total, rating) => total + rating, 0) / reviewCount
      : null;

  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="flex aspect-[4/3.5] items-center justify-center rounded-2xl bg-[#e7e4dc]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-28 w-28 text-[#aaa79f]"
                aria-hidden="true"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M3.5 22C3.5 17.3056 7.30558 13.5 12 13.5C16.6944 13.5 20.5 17.3056 20.5 22H3.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Barber Profile
              </p>

              <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                {barber.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                {averageRating !== null ? (
                  <>
                    <span className="font-medium">
                      ★ {averageRating.toFixed(1)}
                    </span>

                    <span className="text-muted">
                      {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                    </span>
                  </>
                ) : (
                  <span className="text-muted">No reviews yet</span>
                )}

                <span className="text-muted">
                  {barber.bookings.length} completed bookings
                </span>
              </div>

              <p className="mt-8 max-w-lg text-base leading-7 text-muted">
                {barber.bio ??
                  `Book your next appointment with ${barber.name} and choose an available time that works for your schedule.`}
              </p>

              <Link
                href={`/book?barber=${barber.slug}`}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book with {barber.name}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}