-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `deliveryDate` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseId` INTEGER NOT NULL,
    `flowerId` INTEGER NOT NULL,
    `orderQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseArrival` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerOrderId` INTEGER NOT NULL,
    `arrivedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PurchaseArrival_flowerOrderId_key`(`flowerOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryIncrease` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `arrivalId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlowerInventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerId` INTEGER NOT NULL,
    `arrivalDate` DATE NOT NULL,
    `currentQuantity` INTEGER UNSIGNED NOT NULL,

    UNIQUE INDEX `FlowerInventory_flowerId_arrivalDate_key`(`flowerId`, `arrivalDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PurchaseDetail` ADD CONSTRAINT `PurchaseDetail_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseDetail` ADD CONSTRAINT `PurchaseDetail_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseArrival` ADD CONSTRAINT `PurchaseArrival_flowerOrderId_fkey` FOREIGN KEY (`flowerOrderId`) REFERENCES `Purchase`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryIncrease` ADD CONSTRAINT `InventoryIncrease_arrivalId_fkey` FOREIGN KEY (`arrivalId`) REFERENCES `PurchaseArrival`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryIncrease` ADD CONSTRAINT `InventoryIncrease_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `FlowerInventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlowerInventory` ADD CONSTRAINT `FlowerInventory_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
