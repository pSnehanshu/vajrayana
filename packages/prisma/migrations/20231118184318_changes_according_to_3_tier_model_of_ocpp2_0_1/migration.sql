/*
  Warnings:

  - The primary key for the `Connector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `evseId` on the `Connector` table. All the data in the column will be lost.
  - The primary key for the `EVSE` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `EVSE` table. All the data in the column will be lost.
  - You are about to drop the column `orgId` on the `EVSE` table. All the data in the column will be lost.
  - You are about to drop the column `urlName` on the `EVSE` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orgId,urlName]` on the table `ChargingStation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `urlName` to the `ChargingStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `evseNum` to the `Connector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stationId` to the `Connector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sn` to the `EVSE` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Connector" DROP CONSTRAINT "Connector_evseId_fkey";

-- DropForeignKey
ALTER TABLE "EVSE" DROP CONSTRAINT "EVSE_orgId_fkey";

-- DropIndex
DROP INDEX "EVSE_orgId_urlName_key";

-- AlterTable
ALTER TABLE "ChargingStation" ADD COLUMN     "urlName" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Connector" DROP CONSTRAINT "Connector_pkey",
DROP COLUMN "evseId",
ADD COLUMN     "evseNum" SMALLINT NOT NULL,
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Connector_pkey" PRIMARY KEY ("sn", "evseNum");

-- AlterTable
ALTER TABLE "EVSE" DROP CONSTRAINT "EVSE_pkey",
DROP COLUMN "id",
DROP COLUMN "orgId",
DROP COLUMN "urlName",
ADD COLUMN     "sn" SMALLINT NOT NULL,
ADD CONSTRAINT "EVSE_pkey" PRIMARY KEY ("sn", "stationId");

-- CreateIndex
CREATE UNIQUE INDEX "ChargingStation_orgId_urlName_key" ON "ChargingStation"("orgId", "urlName");

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_evseNum_stationId_fkey" FOREIGN KEY ("evseNum", "stationId") REFERENCES "EVSE"("sn", "stationId") ON DELETE CASCADE ON UPDATE CASCADE;
