/*
  Warnings:

  - A unique constraint covering the columns `[roomId,service,billingPeriod]` on the table `Meter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Meter_roomId_service_billingPeriod_key" ON "Meter"("roomId", "service", "billingPeriod");
