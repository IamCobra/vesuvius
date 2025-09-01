-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."OpeningHour" (
    "id" TEXT NOT NULL,
    "weekday" INTEGER NOT NULL,
    "openTime" TEXT NOT NULL,
    "closeTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blackout" (
    "id" TEXT NOT NULL,
    "startUtc" TIMESTAMP(3) NOT NULL,
    "endUtc" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blackout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SlotSetting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "slotMinutes" INTEGER NOT NULL DEFAULT 30,
    "maxCoversPerSlot" INTEGER NOT NULL DEFAULT 24,
    "maxPartySize" INTEGER NOT NULL DEFAULT 8,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Copenhagen',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlotSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reservation" (
    "id" TEXT NOT NULL,
    "partySize" INTEGER NOT NULL,
    "slotStartUtc" TIMESTAMP(3) NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" "public"."ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpeningHour_weekday_idx" ON "public"."OpeningHour"("weekday");

-- CreateIndex
CREATE INDEX "Blackout_startUtc_endUtc_idx" ON "public"."Blackout"("startUtc", "endUtc");

-- CreateIndex
CREATE INDEX "Reservation_slotStartUtc_idx" ON "public"."Reservation"("slotStartUtc");

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_customerEmail_slotStartUtc_key" ON "public"."Reservation"("customerEmail", "slotStartUtc");
