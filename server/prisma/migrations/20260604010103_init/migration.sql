/*
  Warnings:

  - A unique constraint covering the columns `[invoiceCode]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceCode_key" ON "Invoice"("invoiceCode");
