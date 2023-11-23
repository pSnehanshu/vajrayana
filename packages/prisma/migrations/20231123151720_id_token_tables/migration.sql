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

-- CreateIndex
CREATE UNIQUE INDEX "IdToken_token_orgId_key" ON "IdToken"("token", "orgId");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdToken" ADD CONSTRAINT "IdToken_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IdToken" ADD CONSTRAINT "IdToken_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;
