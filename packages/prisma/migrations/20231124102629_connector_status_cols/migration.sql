/*
  Warnings:

  - Added the required column `updatedAt` to the `Connector` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConnectorStatus" AS ENUM ('Available', 'Occupied', 'Reserved', 'Unavailable', 'Faulted');

-- AlterTable
ALTER TABLE "Connector" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "ConnectorStatus" NOT NULL DEFAULT 'Unavailable',
ADD COLUMN     "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
