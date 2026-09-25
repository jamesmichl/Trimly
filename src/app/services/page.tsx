import Navbar from "@/components/layout/Navbar";
import ServiceCard from "@/components/service/ServiceCard";

const services = [
  {
    id: 1,
    name: "Signature Haircut",
    description:
      "A precision haircut tailored to your style, face shape, and preferences.",
    price: "Rp75.000",
  },
  {
    id: 2,
    name: "Haircut + Wash",
    description:
      "A tailored haircut followed by a refreshing wash for a clean finish.",
    price: "Rp100.000",
  },
  {
    id: 3,
    name: "Hair Coloring",
    description:
      "Professional hair coloring designed to refresh or redefine your look.",
    price: "Rp150.000",
  },
  {
    id: 4,
    name: "Beard Trim",
    description:
      "A clean and precise beard trim to sharpen your overall look.",
    price: "Rp50.000",
  },
  {
    id: 5,
    name: "Haircut + Beard Trim",
    description:
      "A complete grooming session combining a tailored haircut and beard trim.",
    price: "Rp110.000",
  },
  {
    id: 6,
    name: "Premium Grooming",
    description:
      "A complete grooming experience for a polished and refreshed finish.",
    price: "Rp175.000",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Our Services
            </p>

            <h1 className="mt-4 font-display text-5xl tracking-[-0.03em] sm:text-6xl">
              Find the right service for your next visit.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-muted">
              Straightforward grooming services designed around what you need.
              Choose your service, barber, and preferred appointment slot.
            </p>
          </div>

          <div className="mt-16 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={service.description}
                price={service.price}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}