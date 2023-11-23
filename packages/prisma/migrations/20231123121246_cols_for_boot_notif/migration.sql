-- AlterTable
ALTER TABLE "ChargingStation" ADD COLUMN     "firmV" VARCHAR(50),
ADD COLUMN     "iccid" VARCHAR(20),
ADD COLUMN     "imsi" VARCHAR(20),
ADD COLUMN     "lbnr" VARCHAR(20),
ADD COLUMN     "lbnt" TIMESTAMP(3),
ADD COLUMN     "model" VARCHAR(20),
ADD COLUMN     "serialNumber" VARCHAR(25),
ADD COLUMN     "vendorName" VARCHAR(50);
