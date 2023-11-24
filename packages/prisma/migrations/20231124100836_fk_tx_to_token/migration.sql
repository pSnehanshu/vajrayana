-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "idTokenId" UUID;

-- AlterTable
ALTER TABLE "TransactionEvent" ADD COLUMN     "idTokenId" UUID;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_idTokenId_fkey" FOREIGN KEY ("idTokenId") REFERENCES "IdToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionEvent" ADD CONSTRAINT "TransactionEvent_idTokenId_fkey" FOREIGN KEY ("idTokenId") REFERENCES "IdToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
