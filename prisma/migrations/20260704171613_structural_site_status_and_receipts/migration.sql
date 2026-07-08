-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SiteStatus" ADD VALUE 'UNVERIFIED';
ALTER TYPE "SiteStatus" ADD VALUE 'CLOSED';

-- AlterTable
ALTER TABLE "sites" ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiptImage" TEXT NOT NULL DEFAULT '';
