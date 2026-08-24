/*
  Warnings:

  - You are about to drop the column `createAt` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `orderEvent` table. All the data in the column will be lost.
  - You are about to drop the column `createAt` on the `orderProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cart" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orderEvent" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orderProduct" DROP COLUMN "createAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "image_url" TEXT;
