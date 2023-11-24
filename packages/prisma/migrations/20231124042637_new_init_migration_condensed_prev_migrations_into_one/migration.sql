-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('owner', 'custom');

-- CreateEnum
CREATE TYPE "TxStateEnum" AS ENUM ('Started', 'Ended');

-- CreateEnum
CREATE TYPE "ChargingStateEnumType" AS ENUM ('Charging', 'EVConnected', 'SuspendedEV', 'SuspendedEVSE', 'Idle');

-- CreateEnum
CREATE TYPE "ReasonEnumType" AS ENUM ('DeAuthorized', 'EmergencyStop', 'EnergyLimitReached', 'EVDisconnected', 'GroundFault', 'ImmediateReset', 'Local', 'LocalOutOfCredit', 'MasterPass', 'Other', 'OvercurrentFault', 'PowerLoss', 'PowerQuality', 'Reboot', 'Remote', 'SOCLimitReached', 'StoppedByEV', 'TimeLimitReached', 'Timeout');

-- CreateTable
CREATE TABLE "org" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Domain" (
    "domain" VARCHAR(50) NOT NULL,
    "orgId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("domain")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usi" (
    "userId" UUID NOT NULL,
    "password" VARCHAR(80),

    CONSTRAINT "usi_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "userId" UUID NOT NULL,
    "orgId" UUID NOT NULL,
    "roleType" "RoleType" NOT NULL DEFAULT 'custom',
    "roleId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("userId","orgId")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "orgId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChargingStation" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "urlName" VARCHAR(50) NOT NULL,
    "friendlyName" VARCHAR(50),
    "orgId" UUID NOT NULL,
    "lat" SMALLINT,
    "lon" SMALLINT,
    "lbnt" TIMESTAMP(3),
    "lbnr" VARCHAR(20),
    "serialNumber" VARCHAR(25),
    "model" VARCHAR(20),
    "vendorName" VARCHAR(50),
    "firmV" VARCHAR(50),
    "iccid" VARCHAR(20),
    "imsi" VARCHAR(20),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ChargingStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EVSE" (
    "sn" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "friendlyName" VARCHAR(50),
    "stationId" UUID NOT NULL,

    CONSTRAINT "EVSE_pkey" PRIMARY KEY ("stationId","sn")
);

-- CreateTable
CREATE TABLE "Connector" (
    "sn" SMALLINT NOT NULL,
    "stationId" UUID NOT NULL,
    "evseNum" SMALLINT NOT NULL,
    "typeId" TEXT,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("stationId","evseNum","sn")
);

-- CreateTable
CREATE TABLE "ConnectorType" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "iconB64" TEXT,

    CONSTRAINT "ConnectorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "orgId" UUID NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdToken" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "orgId" UUID NOT NULL,
    "token" VARCHAR(36) NOT NULL,
    "driverId" UUID NOT NULL,

    CONSTRAINT "IdToken_pkey" PRIMARY KEY ("id")
);

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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChargingStation_orgId_urlName_key" ON "ChargingStation"("orgId", "urlName");

-- CreateIndex
CREATE UNIQUE INDEX "IdToken_orgId_token_key" ON "IdToken"("orgId", "token");

-- CreateIndex
CREATE INDEX "Transaction_stationId_localId_idx" ON "Transaction"("stationId", "localId");

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usi" ADD CONSTRAINT "usi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChargingStation" ADD CONSTRAINT "ChargingStation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVSE" ADD CONSTRAINT "EVSE_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_evseNum_stationId_fkey" FOREIGN KEY ("evseNum", "stationId") REFERENCES "EVSE"("sn", "stationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConnectorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdToken" ADD CONSTRAINT "IdToken_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdToken" ADD CONSTRAINT "IdToken_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
