-- CreateEnum
CREATE TYPE "SettingsKeyEnum" AS ENUM ('name', 'logoB64');

-- CreateTable
CREATE TABLE "Settings" (
    "key" "SettingsKeyEnum" NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("key")
);
