-- AlterTable
ALTER TABLE `Episode` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'livefun',
    MODIFY `body` TEXT NOT NULL DEFAULT '',
    MODIFY `twitch` VARCHAR(191) NOT NULL DEFAULT 'ludusrusso';
