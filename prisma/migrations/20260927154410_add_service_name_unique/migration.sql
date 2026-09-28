/*
  Warnings:

  - A unique constraint covering the columns `[barberId,bookingDate,appointmentSlot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_barberId_bookingDate_appointmentSlot_key";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_barberId_bookingDate_appointmentSlot_key" ON "Booking"("barberId", "bookingDate", "appointmentSlot") WHERE ("status" IN ('PENDING', 'CONFIRMED'));

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");
