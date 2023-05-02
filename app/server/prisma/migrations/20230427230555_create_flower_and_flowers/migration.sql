-- CreateTable
CREATE TABLE `Flower` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `flowerCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deliveryDays` INTEGER NOT NULL,
    `purchaseQuantity` INTEGER NOT NULL,
    `maintanableDays` INTEGER NOT NULL,

    UNIQUE INDEX `Flower_flowerCode_key`(`flowerCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bouquet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bouquetCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Bouquet_bouquetCode_key`(`bouquetCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BouquetDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bouquetId` INTEGER NOT NULL,
    `flowerId` INTEGER NOT NULL,
    `flowerQuantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BouquetDetail` ADD CONSTRAINT `BouquetDetail_bouquetId_fkey` FOREIGN KEY (`bouquetId`) REFERENCES `Bouquet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BouquetDetail` ADD CONSTRAINT `BouquetDetail_flowerId_fkey` FOREIGN KEY (`flowerId`) REFERENCES `Flower`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
