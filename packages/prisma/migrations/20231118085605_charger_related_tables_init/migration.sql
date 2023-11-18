-- CreateTable
CREATE TABLE "ChargingStation" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "friendlyName" VARCHAR(50),
    "orgId" UUID NOT NULL,
    "lat" SMALLINT,
    "lon" SMALLINT,

    CONSTRAINT "ChargingStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EVSE" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orgId" UUID NOT NULL,
    "urlName" VARCHAR(50) NOT NULL,
    "friendlyName" VARCHAR(50),
    "stationId" UUID NOT NULL,

    CONSTRAINT "EVSE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connector" (
    "sn" SMALLINT NOT NULL,
    "evseId" UUID NOT NULL,
    "typeId" TEXT,

    CONSTRAINT "Connector_pkey" PRIMARY KEY ("sn","evseId")
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

-- CreateIndex
CREATE UNIQUE INDEX "EVSE_orgId_urlName_key" ON "EVSE"("orgId", "urlName");

-- AddForeignKey
ALTER TABLE "ChargingStation" ADD CONSTRAINT "ChargingStation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVSE" ADD CONSTRAINT "EVSE_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EVSE" ADD CONSTRAINT "EVSE_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "ChargingStation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_evseId_fkey" FOREIGN KEY ("evseId") REFERENCES "EVSE"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connector" ADD CONSTRAINT "Connector_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ConnectorType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
