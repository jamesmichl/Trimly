import Navbar from "@/components/layout/Navbar";
import ServiceCard from "@/components/service/ServiceCard";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
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
                description={service.description ?? "Service details coming soon."}
                price={`Rp${service.price.toLocaleString("id-ID")}`}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}