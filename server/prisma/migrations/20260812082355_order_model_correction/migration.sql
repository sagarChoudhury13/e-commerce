/*
  Warnings:

  - Added the required column `address` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `orderProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "status" "OrderEventStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "orderProduct" ADD COLUMN     "quantity" INTEGER NOT NULL;
