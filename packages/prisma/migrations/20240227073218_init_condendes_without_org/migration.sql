-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('owner', 'custom');

-- CreateEnum
CREATE TYPE "ConnectorStatus" AS ENUM ('Available', 'Occupied', 'Reserved', 'Unavailable', 'Faulted');

-- CreateEnum
CREATE TYPE "TxStateEnum" AS ENUM ('Started', 'Updated', 'Ended');

-- CreateEnum
CREATE TYPE "TriggerReasonEnumType" AS ENUM ('Authorized', 'CablePluggedIn', 'ChargingRateChanged', 'ChargingStateChanged', 'Deauthorized', 'EnergyLimitReached', 'EVCommunicationLost', 'EVConnectTimeout', 'MeterValueClock', 'MeterValuePeriodic', 'TimeLimitReached', 'Trigger', 'UnlockCommand', 'StopAuthorized', 'EVDeparted', 'EVDetected', 'RemoteStop', 'RemoteStart', 'AbnormalCondition', 'SignedDataReceived', 'ResetCommand');

-- CreateEnum
CREATE TYPE "ChargingStateEnumType" AS ENUM ('Charging', 'EVConnected', 'SuspendedEV', 'SuspendedEVSE', 'Idle');

-- CreateEnum
CREATE TYPE "ReasonEnumType" AS ENUM ('DeAuthorized', 'EmergencyStop', 'EnergyLimitReached', 'EVDisconnected', 'GroundFault', 'ImmediateReset', 'Local', 'LocalOutOfCredit', 'MasterPass', 'Other', 'OvercurrentFault', 'PowerLoss', 'PowerQuality', 'Reboot', 'Remote', 'SOCLimitReached', 'StoppedByEV', 'TimeLimitReached', 'Timeout');

-- CreateEnum
CREATE TYPE "MeterValueLocation" AS ENUM ('Body', 'Cable', 'EV', 'Inlet', 'Outlet');

-- CreateEnum
CREATE TYPE "EventTriggerEnumType" AS ENUM ('Alerting', 'Delta', 'Periodic');

-- CreateEnum
CREATE TYPE "EventNotificationEnumType" AS ENUM ('HardWiredNotification', 'HardWiredMonitor', 'PreconfiguredMonitor', 'CustomMonitor');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roleType" "RoleType" NOT NULL DEFAULT 'custom',
    "roleId" UUID,

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
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
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
    "latitude" SMALLINT,
    "longitude" SMALLINT,
    "lastBootNotifTime" TIMESTAMP(3),
    "lastBootNotifReason" VARCHAR(20),
    "serialNumber" VARCHAR(25),
    "model" VARCHAR(20),
    "vendorName" VARCHAR(50),
    "firmwareVersion" VARCHAR(50),
    "modem_iccid" VARCHAR(20),
    "modem_imsi" VARCHAR(20),
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sn" SMALLINT NOT NULL,
    "stationId" UUID NOT NULL,
    "evseNum" SMALLINT NOT NULL,
    "typeId" TEXT,
    "status" "ConnectorStatus" NOT NULL DEFAULT 'Unavailable',
    "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

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

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdToken" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "token" VARCHAR(36) NOT NULL,
    "driverId" UUID NOT NULL,

    CONSTRAINT "IdToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serverId" UUID NOT NULL,
    "offline" BOOLEAN NOT NULL DEFAULT false,
    "numberOfPhasesUsed" SMALLINT,
    "cableMaxCurrent" SMALLINT,
    "reservationId" INTEGER,
    "localId" VARCHAR(36) NOT NULL,
    "chargingState" "ChargingStateEnumType",
    "timeSpentCharging" SMALLINT,
    "stoppedReason" "ReasonEnumType",
    "remoteStartId" INTEGER,
    "stationId" UUID NOT NULL,
    "evseSn" SMALLINT,
    "connectorSn" SMALLINT,
    "idTokenId" UUID,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("serverId")
);

-- CreateTable
CREATE TABLE "TransactionEvent" (
    "eventType" "TxStateEnum" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "triggerReason" "TriggerReasonEnumType" NOT NULL,
    "seqNo" SMALLINT NOT NULL,
    "offline" BOOLEAN NOT NULL DEFAULT false,
    "numberOfPhasesUsed" SMALLINT,
    "cableMaxCurrent" SMALLINT,
    "reservationId" INTEGER,
    "txId" UUID NOT NULL,
    "chargingState" "ChargingStateEnumType",
    "timeSpentCharging" SMALLINT,
    "stoppedReason" "ReasonEnumType",
    "remoteStartId" INTEGER,
    "evseSn" SMALLINT,
    "connectorSn" SMALLINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idTokenId" UUID,

    CONSTRAINT "TransactionEvent_pkey" PRIMARY KEY ("txId","seqNo")
);

-- CreateTable
CREATE TABLE "MeterSampledValue" (
    "id" UUID NOT NULL,
    "stationId" UUID NOT NULL,
    "txId" UUID,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "context" TEXT NOT NULL DEFAULT 'Sample.Periodic',
    "measurand" TEXT NOT NULL DEFAULT 'Energy.Active.Import.Register',
    "phase" TEXT,
    "location" "MeterValueLocation" NOT NULL DEFAULT 'Outlet',
    "unitOfMeasure" VARCHAR(20),
    "unitMultiplier" SMALLINT NOT NULL DEFAULT 0,
    "signedData" TEXT,
    "signingMethod" VARCHAR(50),
    "encodingMethod" VARCHAR(50),
    "publicKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeterSampledValue_pkey" PRIMARY KEY ("stationId","id")
);

-- CreateTable
CREATE TABLE "NotifyEvent" (
    "id" UUID NOT NULL,
    "stationId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "tbc" BOOLEAN NOT NULL DEFAULT false,
    "seqNo" SMALLINT NOT NULL,
    "localEventId" INTEGER NOT NULL,
    "trigger" "EventTriggerEnumType" NOT NULL,
    "cause" INTEGER,
    "actualValue" TEXT NOT NULL,
    "techCode" VARCHAR(50),
    "techInfo" VARCHAR(500),
    "cleared" BOOLEAN,
    "localTxId" VARCHAR(36),
    "txId" UUID,
    "variableMonitoringId" INTEGER,
    "type" "EventNotificationEnumType" NOT NULL,
    "componentName" VARCHAR(50) NOT NULL,
    "componentInstance" VARCHAR(50),
    "evseSn" INTEGER,
    "connectorSn" INTEGER,
    "variableName" VARCHAR(50) NOT NULL,
    "variableInstance" VARCHAR(50),

    CONSTRAINT "NotifyEvent_pkey" PRIMARY KEY ("stationId","id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ChargingStation_urlName_key" ON "ChargingStation"("urlName");

-- CreateIndex
CREATE UNIQUE INDEX "IdToken_token_key" ON "IdToken"("token");

-- CreateIndex
CREATE INDEX "Transaction_stationId_localId_idx" ON "Transaction"("stationId", "localId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usi" ADD CONSTRAINT "usi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVSE" ADD CONSTRAINT "EVSE_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_evseNum_stationId_fkey" FOREIGN KEY ("evseNum", "stationId") REFERENCES "EVSE"("sn", "stationId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConnectorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdToken" ADD CONSTRAINT "IdToken_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_idTokenId_fkey" FOREIGN KEY ("idTokenId") REFERENCES "IdToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEvent" ADD CONSTRAINT "TransactionEvent_txId_fkey" FOREIGN KEY ("txId") REFERENCES "Transaction"("serverId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEvent" ADD CONSTRAINT "TransactionEvent_idTokenId_fkey" FOREIGN KEY ("idTokenId") REFERENCES "IdToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterSampledValue" ADD CONSTRAINT "MeterSampledValue_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeterSampledValue" ADD CONSTRAINT "MeterSampledValue_txId_fkey" FOREIGN KEY ("txId") REFERENCES "Transaction"("serverId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifyEvent" ADD CONSTRAINT "NotifyEvent_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotifyEvent" ADD CONSTRAINT "NotifyEvent_txId_fkey" FOREIGN KEY ("txId") REFERENCES "Transaction"("serverId") ON DELETE CASCADE ON UPDATE CASCADE;
