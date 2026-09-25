import Navbar from "@/components/layout/Navbar";

const bookingSteps = [
  {
    number: "01",
    label: "Service",
  },
  {
    number: "02",
    label: "Barber",
  },
  {
    number: "03",
    label: "Date",
  },
  {
    number: "04",
    label: "Time",
  },
];

export default function BookPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Book an Appointment
            </p>

            <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl">
              Plan your next visit.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Choose your service, preferred barber, date, and an available
              appointment slot.
            </p>
          </div>

          <div className="mt-14 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
            {bookingSteps.map((step, index) => (
              <div
                key={step.number}
                className="border-b border-border py-5 sm:border-r sm:px-6 sm:nth-[2]:border-r-0 lg:border-b-0 lg:nth-[2]:border-r lg:first:pl-0 lg:last:border-r-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      index === 0
                        ? "text-xs font-semibold tracking-[0.18em] text-primary"
                        : "text-xs font-semibold tracking-[0.18em] text-muted"
                    }
                  >
                    {step.number}
                  </span>

                  <span
                    className={
                      index === 0
                        ? "text-sm font-semibold"
                        : "text-sm text-muted"
                    }
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 min-h-80 rounded-2xl border border-border bg-surface p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Step 01
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Choose your service
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-muted">
              Your available services will appear here.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}