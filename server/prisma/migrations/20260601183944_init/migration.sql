/*
  Warnings:

  - You are about to drop the column `invoiceCronExpression` on the `SystemSetting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SystemSetting" DROP COLUMN "invoiceCronExpression",
ADD COLUMN     "invoiceGenerateDay" INTEGER NOT NULL DEFAULT 25,
ADD COLUMN     "invoiceGenerateHour" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "invoiceGenerateMinute" INTEGER NOT NULL DEFAULT 0;
