/*
  Warnings:

  - Added the required column `coverImage` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImage` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "coverImage" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "coverImage" TEXT NOT NULL;
