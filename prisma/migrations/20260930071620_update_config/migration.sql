/*
  Warnings:

  - A unique constraint covering the columns `[secretKeyHash]` on the table `Config` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Config_secretKeyHash_key" ON "Config"("secretKeyHash");
