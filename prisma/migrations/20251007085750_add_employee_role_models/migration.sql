-- CreateTable
CREATE TABLE "public"."employees" (
    "id" TEXT NOT NULL,
    "userName" VARCHAR(20) NOT NULL,
    "password" VARCHAR(80) NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" TEXT NOT NULL,
    "roleName" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."employees" ADD CONSTRAINT "employees_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
