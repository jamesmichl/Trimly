"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type BookingService = {
  id: string;
  name: string;
  price: number;
};

type BookingBarber = {
  id: string;
  slug: string | null;
  name: string;
};

type BookingFormProps = {
  services: BookingService[];
  barbers: BookingBarber[];
};

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

function formatBookingDate(date: string) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function BookingForm({
  services,
  barbers,
}: BookingFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const barberFromUrl = searchParams.get("barber");

  const initialBarber =
    barbers.find((barber) => barber.slug === barberFromUrl)?.id ?? null;

  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(
    initialBarber,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-CA");

  const selectedServiceData = services.find(
    (service) => service.id === selectedService,
  );

  const selectedBarberData = barbers.find(
    (barber) => barber.id === selectedBarber,
  );

  useEffect(() => {
    if (!selectedBarber || !selectedDate) {
      return;
    }

    async function fetchAvailability() {
      setIsLoadingSlots(true);
      setSlotError(null);
      setSelectedTime(null);

      try {
        const response = await fetch(
          `/api/availability?barberId=${encodeURIComponent(
            selectedBarber!,
          )}&date=${encodeURIComponent(selectedDate)}`,
        );

        if (!response.ok) {
          throw new Error("Failed to load availability");
        }

        const data: { slots: string[] } = await response.json();

        setAvailableSlots(data.slots);
      } catch {
        setAvailableSlots([]);
        setSlotError("Unable to load available times. Please try again.");
      } finally {
        setIsLoadingSlots(false);
      }
    }

    fetchAvailability();
  }, [selectedBarber, selectedDate]);

  async function handleConfirmBooking() {
  if (!selectedService || !selectedBarber || !selectedDate || !selectedTime) {
    return;
  }

  setIsBooking(true);
  setBookingError(null);

  try {
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceId: selectedService,
        barberId: selectedBarber,
        date: selectedDate,
        appointmentSlot: selectedTime,
      }),
    });

    const data: {
      booking?: {
        id: string;
        status: string;
      };
      error?: string;
    } = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Unable to create booking.");
    }

    if (!data.booking) {
      throw new Error("Booking response is invalid.");
    }

    router.push(`/bookings/${data.booking.id}`);
  } catch (error) {
    setBookingError(
      error instanceof Error ? error.message : "Unable to create booking.",
    );
  } finally {
    setIsBooking(false);
  }
}

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

                    <div>
                      <span className="font-semibold">{barber.name}</span>

                      <p className="mt-1 text-sm text-muted">
                        Select this barber
                      </p>
                    </div>
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

        {currentStep === 4 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Step 04
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Choose your time
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Select an available appointment time.
            </p>

            {isLoadingSlots ? (
              <p className="mt-8 text-sm text-muted">
                Loading available times...
              </p>
            ) : slotError ? (
              <p className="mt-8 text-sm text-red-600">{slotError}</p>
            ) : availableSlots.length === 0 ? (
              <p className="mt-8 text-sm text-muted">
                No available times for this date.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl border px-4 py-4 text-sm font-medium transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-sm font-medium underline underline-offset-4"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!selectedTime}
                onClick={() => setCurrentStep(5)}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                Review booking
              </button>
            </div>
          </>
        )}

        {currentStep === 5 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Booking Review
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Review your appointment
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Make sure everything looks right before confirming your booking.
            </p>

            <div className="mt-8 divide-y divide-border rounded-xl border border-border">
              <div className="flex items-center justify-between gap-6 p-5">
                <span className="text-sm text-muted">Service</span>

                <div className="text-right">
                  <p className="font-medium">{selectedServiceData?.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {selectedServiceData
                      ? formatRupiah(selectedServiceData.price)
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 p-5">
                <span className="text-sm text-muted">Barber</span>
                <span className="font-medium">{selectedBarberData?.name}</span>
              </div>

              <div className="flex items-center justify-between gap-6 p-5">
                <span className="text-sm text-muted">Date</span>
                <span className="font-medium">
                  {formatBookingDate(selectedDate)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-6 p-5">
                <span className="text-sm text-muted">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
            </div>

            {bookingError && (
              <p className="mt-4 text-sm text-red-600">{bookingError}</p>
            )}

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="text-sm font-medium underline underline-offset-4"
              >
                Back to time
              </button>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                >
                {isBooking ? "Confirming..." : "Confirm booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}