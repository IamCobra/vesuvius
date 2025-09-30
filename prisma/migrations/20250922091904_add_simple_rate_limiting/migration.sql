-- CreateTable
CREATE TABLE "public"."login_attempts" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resetTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_attempts_ipAddress_key" ON "public"."login_attempts"("ipAddress");
