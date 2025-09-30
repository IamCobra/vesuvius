/*
  Warnings:

  - You are about to drop the column `failedLoginAttempts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastLoginAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lockedUntil` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `login_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rate_limit_attempts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."login_attempts" DROP CONSTRAINT "login_attempts_userId_fkey";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "failedLoginAttempts",
DROP COLUMN "lastLoginAt",
DROP COLUMN "lockedUntil";

-- DropTable
DROP TABLE "public"."login_attempts";

-- DropTable
DROP TABLE "public"."rate_limit_attempts";
