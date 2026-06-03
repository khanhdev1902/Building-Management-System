/*
  Warnings:

  - You are about to drop the column `invoiceGenerateDay` on the `SystemSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemSetting" DROP COLUMN "invoiceGenerateDay",
ADD COLUMN     "invoiceCronExpression" TEXT NOT NULL DEFAULT '0 0 25 * *',
ADD COLUMN     "lastInvoiceGeneratedAt" TIMESTAMP(3);
