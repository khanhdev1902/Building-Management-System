/*
  Warnings:

  - You are about to drop the column `unitPrice` on the `Service` table. All the data in the column will be lost.
  - Added the required column `price` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "unitPrice",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "iconKey" TEXT,
ADD COLUMN     "price" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ALTER COLUMN "type" DROP NOT NULL;
