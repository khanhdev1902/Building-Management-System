/*
  Warnings:

  - The primary key for the `Meter` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Meter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `service` on the `Meter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MeterService" AS ENUM ('ELECTRIC', 'WATER');

-- AlterTable
ALTER TABLE "Meter" DROP CONSTRAINT "Meter_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "service",
ADD COLUMN     "service" "MeterService" NOT NULL,
ADD CONSTRAINT "Meter_pkey" PRIMARY KEY ("id");
