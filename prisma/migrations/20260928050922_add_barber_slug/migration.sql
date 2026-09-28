/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barberId,bookingDate,appointmentSlot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_barberId_bookingDate_appointmentSlot_key";

-- AlterTable
ALTER TABLE "Barber" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Barber_slug_key" ON "Barber"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_barberId_bookingDate_appointmentSlot_key" ON "Booking"("barberId", "bookingDate", "appointmentSlot") WHERE ("status" IN ('PENDING', 'CONFIRMED'));
