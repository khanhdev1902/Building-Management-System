/*
  Warnings:

  - You are about to drop the column `sentAt` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `NotificationRecipient` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `invoiceCode` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Notification` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'INVOICE', 'PAYMENT', 'CONTRACT', 'PROBLEM', 'ANNOUNCEMENT', 'CHAT');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- DropForeignKey
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT "NotificationRecipient_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "NotificationRecipient" DROP CONSTRAINT "NotificationRecipient_userId_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "sentAt",
ADD COLUMN     "actionUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readAt" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- DropTable
DROP TABLE "NotificationRecipient";

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
