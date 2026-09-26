"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const services = [
  {
    id: "signature-haircut",
    name: "Signature Haircut",
    price: 75000,
  },
  {
    id: "haircut-wash",
    name: "Haircut + Wash",
    price: 100000,
  },
  {
    id: "hair-coloring",
    name: "Hair Coloring",
    price: 150000,
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    price: 50000,
  },
  {
    id: "haircut-beard-trim",
    name: "Haircut + Beard Trim",
    price: 110000,
  },
  {
    id: "premium-grooming",
    name: "Premium Grooming",
    price: 175000,
  },
];

const barbers = [
  {
    id: "elijah",
    name: "Elijah",
    rating: 4.9,
    reviews: 84,
  },
  {
    id: "daniel",
    name: "Daniel",
    rating: 4.8,
    reviews: 67,
  },
  {
    id: "john",
    name: "John",
    rating: 4.9,
    reviews: 52,
  },
];

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

function formatRupiah(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function BookingForm() {
  const searchParams = useSearchParams();

  const barberFromUrl = searchParams.get("barber");

  const initialBarber = barbers.some(
    (barber) => barber.id === barberFromUrl
  )
    ? barberFromUrl
    : null;

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(
    initialBarber
  );
  const [selectedDate, setSelectedDate] = useState("");
  const today = new Date().toLocaleDateString("en-CA");

   return (
  <>
    <div className="mt-14 grid border-y border-border sm:grid-cols-2 lg:grid-cols-4">
      {bookingSteps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;

        return (
          <div
            key={step.number}
            className="border-b border-border py-5 sm:border-r sm:px-6 sm:nth-[2]:border-r-0 lg:border-b-0 lg:nth-[2]:border-r lg:first:pl-0 lg:last:border-r-0"
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  isActive
                    ? "text-xs font-semibold tracking-[0.18em] text-primary"
                    : "text-xs font-semibold tracking-[0.18em] text-muted"
                }
              >
                {step.number}
              </span>

              <span
                className={
                  isActive
                    ? "text-sm font-semibold"
                    : "text-sm text-muted"
                }
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mt-12 rounded-2xl border border-border bg-surface p-8 lg:p-10">
  {currentStep === 1 && (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
        Step 01
      </p>

      <h2 className="mt-3 text-2xl font-semibold">
        Choose your service
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted">
        Select the grooming service you want to book.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedService === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service.id)}
              className={`flex items-center justify-between rounded-xl border p-5 text-left transition-colors ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary"
              }`}
            >
              <span className="font-semibold">{service.name}</span>

              <span className="ml-4 shrink-0 text-sm text-muted">
                {formatRupiah(service.price)}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={!selectedService}
          onClick={() => setCurrentStep(selectedBarber ? 3 : 2)}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </>
  )}

 {currentStep === 2 && (
  <>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      Step 02
    </p>

    <h2 className="mt-3 text-2xl font-semibold">
      Choose your barber
    </h2>

    <p className="mt-3 text-sm leading-6 text-muted">
      Select the barber you want for your appointment.
    </p>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {barbers.map((barber) => {
        const isSelected = selectedBarber === barber.id;

        return (
          <button
            key={barber.id}
            type="button"
            onClick={() => setSelectedBarber(barber.id)}
            className={`rounded-xl border p-5 text-left transition-colors ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary"
            }`}
          >
            <div className="mb-5 flex aspect-[4/3.5] items-center justify-center rounded-lg bg-background">
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full bg-muted/40" />
                <div className="mt-2 h-8 w-16 rounded-t-full bg-muted/40" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">{barber.name}</span>

              <span className="shrink-0 text-sm">
                ★ {barber.rating}
              </span>
            </div>

            <p className="mt-1 text-sm text-muted">
              {barber.reviews} reviews
            </p>
          </button>
        );
      })}
    </div>

    <div className="mt-8 flex items-center justify-between">
      <button
        type="button"
        onClick={() => setCurrentStep(1)}
        className="text-sm font-medium underline underline-offset-4"
      >
        Back to services
      </button>

      <button
        type="button"
        disabled={!selectedBarber}
        onClick={() => setCurrentStep(3)}
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  </>
)}

{currentStep === 3 && (
  <>
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      Step 03
    </p>

    <h2 className="mt-3 text-2xl font-semibold">
      Choose your date
    </h2>

    <p className="mt-3 text-sm leading-6 text-muted">
      Select the date for your appointment.
    </p>

    <div className="mt-8 max-w-md">
      <label
        htmlFor="booking-date"
        className="mb-2 block text-sm font-medium"
      >
        Appointment date
      </label>

      <input
        id="booking-date"
        type="date"
        min={today}
        value={selectedDate}
        onChange={(event) => setSelectedDate(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
      />
    </div>

    <div className="mt-8 flex items-center justify-between">
      <button
        type="button"
         onClick={() => setCurrentStep(initialBarber ? 1 : 2)}
        className="text-sm font-medium underline underline-offset-4"
      >
        Back
      </button>

      <button
        type="button"
        disabled={!selectedDate}
        onClick={() => setCurrentStep(4)}
        className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Continue
      </button>
    </div>
  </>
)}

    </div>
  </>
);
}