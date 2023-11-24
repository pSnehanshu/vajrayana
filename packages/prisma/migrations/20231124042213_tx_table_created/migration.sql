/*
  Warnings:

  - The primary key for the `Connector` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `EVSE` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[orgId,token]` on the table `IdToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "TxStateEnum" AS ENUM ('Started', 'Ended');

-- CreateEnum
CREATE TYPE "ChargingStateEnumType" AS ENUM ('Charging', 'EVConnected', 'SuspendedEV', 'SuspendedEVSE', 'Idle');

-- CreateEnum
CREATE TYPE "ReasonEnumType" AS ENUM ('DeAuthorized', 'EmergencyStop', 'EnergyLimitReached', 'EVDisconnected', 'GroundFault', 'ImmediateReset', 'Local', 'LocalOutOfCredit', 'MasterPass', 'Other', 'OvercurrentFault', 'PowerLoss', 'PowerQuality', 'Reboot', 'Remote', 'SOCLimitReached', 'StoppedByEV', 'TimeLimitReached', 'Timeout');

-- DropIndex
DROP INDEX "IdToken_token_orgId_key";

-- AlterTable
ALTER TABLE "Connector" DROP CONSTRAINT "Connector_pkey",
ADD CONSTRAINT "Connector_pkey" PRIMARY KEY ("stationId", "evseNum", "sn");

-- AlterTable
ALTER TABLE "EVSE" DROP CONSTRAINT "EVSE_pkey",
ADD CONSTRAINT "EVSE_pkey" PRIMARY KEY ("stationId", "sn");

-- CreateTable
CREATE TABLE "Transaction" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serverId" UUID NOT NULL,
    "localId" VARCHAR(36) NOT NULL,
    "state" "TxStateEnum" NOT NULL DEFAULT 'Started',
    "cstate" "ChargingStateEnumType",
    "tmsc" SMALLINT,
    "strn" "ReasonEnumType",
    "rsid" INTEGER,
    "phase" SMALLINT,
    "mxcnt" SMALLINT,
    "stationId" UUID NOT NULL,
    "evseSn" SMALLINT,
    "connectorSn" SMALLINT,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("serverId")
);

-- CreateIndex
CREATE INDEX "Transaction_stationId_localId_idx" ON "Transaction"("stationId", "localId");

-- CreateIndex
CREATE UNIQUE INDEX "IdToken_orgId_token_key" ON "IdToken"("orgId", "token");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
