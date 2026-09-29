/*
  Warnings:

  - A unique constraint covering the columns `[barberId,bookingDate,appointmentSlot]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_barberId_bookingDate_appointmentSlot_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_barberId_bookingDate_appointmentSlot_key" ON "Booking"("barberId", "bookingDate", "appointmentSlot") WHERE ("status" IN ('PENDING', 'CONFIRMED'));
