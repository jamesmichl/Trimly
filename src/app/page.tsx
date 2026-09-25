import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const bookingSteps = [
  {
    number: "01",
    title: "Choose Your Service",
    description: "Start with the grooming service that fits what you need.",
  },
  {
    number: "02",
    title: "Pick Your Barber",
    description: "Browse barber profiles, specialties, and customer reviews.",
  },
  {
    number: "03",
    title: "Book Your Slot",
    description: "Choose an available date and appointment slot that works for you.",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Premium Barbershop Experience
            </p>

            <h1 className="max-w-4xl font-display text-5xl leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
              Your cut.
              <br />
              Your barber.
              <br />
              <span className="italic text-primary">Your time.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-7 text-muted sm:text-lg">
              Book your preferred barber and secure your appointment without
              the wait. Simple, personal, and built around your schedule.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/book"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Book an Appointment
              </Link>

              <Link
                href="/barbers"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface"
              >
                Meet Our Barbers
              </Link>
            </div>
          </div>

          <div className="mt-20 grid border-t border-border md:grid-cols-3">
            {bookingSteps.map((step) => (
              <div
                key={step.number}
                className="border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
              >
                <span className="text-xs font-semibold tracking-[0.2em] text-primary">
                  {step.number}
                </span>

                <h2 className="mt-4 text-lg font-semibold">{step.title}</h2>

                <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}