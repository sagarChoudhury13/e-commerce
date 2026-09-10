/*
  Warnings:

  - The values [ACCEPTED,OUT_FOR_DELIVERY] on the enum `OrderEventStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderEventStatus_new" AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."orderEvent" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "status" TYPE "OrderEventStatus_new" USING ("status"::text::"OrderEventStatus_new");
ALTER TABLE "orderEvent" ALTER COLUMN "status" TYPE "OrderEventStatus_new" USING ("status"::text::"OrderEventStatus_new");
ALTER TYPE "OrderEventStatus" RENAME TO "OrderEventStatus_old";
ALTER TYPE "OrderEventStatus_new" RENAME TO "OrderEventStatus";
DROP TYPE "public"."OrderEventStatus_old";
ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
ALTER TABLE "orderEvent" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
