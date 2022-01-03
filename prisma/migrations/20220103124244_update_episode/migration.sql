/*
  Warnings:

  - You are about to alter the column `title` on the `Episode` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `twitch` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Episode` ADD COLUMN `twitch` VARCHAR(191) NOT NULL,
    ADD COLUMN `youtube` VARCHAR(191) NULL,
    MODIFY `title` VARCHAR(100) NOT NULL,
    MODIFY `description` VARCHAR(1000) NOT NULL,
    MODIFY `body` TEXT NOT NULL DEFAULT '',
    MODIFY `image` VARCHAR(191) NULL;
