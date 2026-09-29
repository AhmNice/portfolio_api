/*
  Warnings:

  - The primary key for the `Config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Config` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Config" DROP CONSTRAINT "Config_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD CONSTRAINT "Config_pkey" PRIMARY KEY ("id");
