import Navbar from "@/components/layout/Navbar";
import BookingForm from "@/components/booking/BookingForm";


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
          <BookingForm />
        </section>
      </main>
    </>
  );
}