-- AlterTable
ALTER TABLE "Connector" ALTER COLUMN "statusUpdatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "MeterSampledValue" ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "NotifyEvent" ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "TransactionEvent" ALTER COLUMN "timestamp" SET DATA TYPE TIMESTAMPTZ;
