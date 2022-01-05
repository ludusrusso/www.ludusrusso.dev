-- DropIndex
DROP INDEX `Participant_github_key` ON `Participant`;

-- AlterTable
ALTER TABLE `Episode` MODIFY `body` TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Participant` MODIFY `github` VARCHAR(191) NULL;
