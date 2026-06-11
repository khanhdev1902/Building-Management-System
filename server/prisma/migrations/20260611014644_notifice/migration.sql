/*
  Warnings:

  - Added the required column `priority` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
