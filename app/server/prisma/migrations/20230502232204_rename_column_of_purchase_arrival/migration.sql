ALTER TABLE `PurchaseArrival` RENAME COLUMN `flowerOrderId` to `purchaseId`;
ALTER TABLE `PurchaseArrival` DROP FOREIGN KEY `PurchaseArrival_flowerOrderId_fkey`;
ALTER TABLE `PurchaseArrival` ADD CONSTRAINT `PurchaseArrival_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `PurchaseArrival` RENAME INDEX `PurchaseArrival_flowerOrderId_key` TO `PurchaseArrival_purchaseId_key`;
