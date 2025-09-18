/*
  Warnings:

  - You are about to alter the column `priceChange` on the `menu_item_variants` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `price` on the `menu_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `unitPrice` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to alter the column `totalPrice` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `reservationDate` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `timeSlotId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the `Blackout` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[categoryId,name]` on the table `menu_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slotEndUtc` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotStartUtc` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endUtc` to the `reserved_tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startUtc` to the `reserved_tables` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."reservations" DROP CONSTRAINT "reservations_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."reservations" DROP CONSTRAINT "reservations_timeSlotId_fkey";

-- DropIndex
DROP INDEX "public"."menu_items_name_key";

-- DropIndex
DROP INDEX "public"."reservations_reservationDate_timeSlotId_idx";

-- AlterTable
ALTER TABLE "public"."menu_item_variants" ALTER COLUMN "priceChange" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."menu_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."order_items" ALTER COLUMN "unitPrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."orders" ALTER COLUMN "totalPrice" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "public"."reservations" DROP COLUMN "reservationDate",
DROP COLUMN "timeSlotId",
ADD COLUMN     "slotEndUtc" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "slotStartUtc" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "customerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."reserved_tables" ADD COLUMN     "endUtc" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startUtc" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."Blackout";

-- CreateTable
CREATE TABLE "public"."blackouts" (
    "id" TEXT NOT NULL,
    "startUtc" TIMESTAMPTZ NOT NULL,
    "endUtc" TIMESTAMPTZ NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blackouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "blackouts_startUtc_endUtc_idx" ON "public"."blackouts"("startUtc", "endUtc");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_categoryId_name_key" ON "public"."menu_items"("categoryId", "name");

-- CreateIndex
CREATE INDEX "reservations_slotStartUtc_idx" ON "public"."reservations"("slotStartUtc");

-- CreateIndex
CREATE INDEX "reservations_slotEndUtc_idx" ON "public"."reservations"("slotEndUtc");

-- AddForeignKey
ALTER TABLE "public"."reservations" ADD CONSTRAINT "reservations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
