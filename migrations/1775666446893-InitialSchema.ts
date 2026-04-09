import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1775666446893 implements MigrationInterface {
    name = 'InitialSchema1775666446893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`category\` enum ('Hair', 'Nails', 'Aesthetics', 'Other') NOT NULL DEFAULT 'Hair', \`costPrice\` decimal(10,2) NOT NULL, \`sellingPrice\` decimal(10,2) NOT NULL, \`stockLevel\` int NOT NULL DEFAULT '0', \`image\` varchar(255) NULL, \`description\` varchar(255) NULL, \`lowStockAlert\` tinyint NOT NULL DEFAULT 0, \`lowStockThreshold\` int NOT NULL DEFAULT '5', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sale_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`saleId\` int NOT NULL, \`productId\` int NOT NULL, \`quantity\` int NOT NULL, \`unitPrice\` decimal(10,2) NOT NULL, \`totalPrice\` decimal(10,2) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sales\` (\`id\` int NOT NULL AUTO_INCREMENT, \`totalAmount\` decimal(10,2) NOT NULL, \`paymentMethod\` enum ('Espèces', 'Mobile Money', 'Crédit', 'Carte') NOT NULL DEFAULT 'Espèces', \`userId\` int NULL, \`clientId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`expenses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`amount\` decimal(10,2) NOT NULL, \`category\` enum ('Produits', 'Eau', 'Électricité', 'Salaires', 'Loyer', 'Autre') NOT NULL DEFAULT 'Autre', \`expenseDate\` date NOT NULL, \`notes\` varchar(255) NULL, \`receipt\` varchar(255) NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`role\` enum ('ADMIN', 'STAFF', 'CLIENT') NOT NULL DEFAULT 'ADMIN', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`services\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('Nattes', 'Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`paymentMethod\` enum ('Espèces', 'Mobile Money', 'Crédit', 'Carte') NOT NULL DEFAULT 'Espèces', \`serviceDate\` datetime NOT NULL, \`notes\` varchar(255) NULL, \`duration\` int NOT NULL DEFAULT '60', \`clientId\` int NULL, \`guestName\` varchar(255) NULL DEFAULT 'Invité', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`type\` enum ('APPOINTMENT_CREATED') NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` text NOT NULL, \`data\` json NULL, \`readAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_692a909ee0fa9383e7859f9b40\` (\`userId\`), INDEX \`IDX_9d8adc796dff8c73acd1eba656\` (\`readAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`gallery_media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`kind\` enum ('IMAGE', 'VIDEO') NOT NULL, \`title\` varchar(255) NOT NULL, \`src\` varchar(500) NOT NULL, \`poster\` varchar(500) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`sortOrder\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_e697a01a81610284591a21e74d\` (\`isActive\`), INDEX \`IDX_0d0b179c5f58780ede66bbe171\` (\`sortOrder\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`debts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`totalAmount\` decimal(10,2) NOT NULL, \`paidAmount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`status\` enum ('IMPAYÉ', 'PARTIEL', 'PAYÉ') NOT NULL DEFAULT 'IMPAYÉ', \`clientId\` int NOT NULL, \`serviceId\` int NULL, \`saleId\` int NULL, \`dueDate\` date NOT NULL, \`notes\` varchar(255) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`catalog_services\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('Nattes', 'Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`duration\` int NOT NULL DEFAULT '60', \`description\` text NULL, \`image\` varchar(255) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clientId\` int NOT NULL, \`serviceId\` int NOT NULL, \`date\` date NOT NULL, \`startTime\` time NOT NULL, \`endTime\` time NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING', \`notes\` text NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sale_items\` ADD CONSTRAINT \`FK_c642be08de5235317d4cf3deb40\` FOREIGN KEY (\`saleId\`) REFERENCES \`sales\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sale_items\` ADD CONSTRAINT \`FK_d675aea38a16313e844662c48f8\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_52ff6cd9431cc7687c76f935938\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_c0ae0d7fce67f97394e3a250a33\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`expenses\` ADD CONSTRAINT \`FK_3d211de716f0f14ea7a8a4b1f2c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD CONSTRAINT \`FK_31f2f6cdc217456fc9d0378309d\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`debts\` ADD CONSTRAINT \`FK_d8ee440220d45a94bf1238b48a0\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`debts\` ADD CONSTRAINT \`FK_7d3bf4e7a0fdf3f1c84404109e6\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`debts\` ADD CONSTRAINT \`FK_4190cf19e55e9d5e0258a87ce09\` FOREIGN KEY (\`saleId\`) REFERENCES \`sales\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_c4dbd8eb292b83b5dc67be3cf45\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_f77953c373efb8ab146d98e90c3\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_f77953c373efb8ab146d98e90c3\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_c4dbd8eb292b83b5dc67be3cf45\``);
        await queryRunner.query(`ALTER TABLE \`debts\` DROP FOREIGN KEY \`FK_4190cf19e55e9d5e0258a87ce09\``);
        await queryRunner.query(`ALTER TABLE \`debts\` DROP FOREIGN KEY \`FK_7d3bf4e7a0fdf3f1c84404109e6\``);
        await queryRunner.query(`ALTER TABLE \`debts\` DROP FOREIGN KEY \`FK_d8ee440220d45a94bf1238b48a0\``);
        await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_31f2f6cdc217456fc9d0378309d\``);
        await queryRunner.query(`ALTER TABLE \`expenses\` DROP FOREIGN KEY \`FK_3d211de716f0f14ea7a8a4b1f2c\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_c0ae0d7fce67f97394e3a250a33\``);
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_52ff6cd9431cc7687c76f935938\``);
        await queryRunner.query(`ALTER TABLE \`sale_items\` DROP FOREIGN KEY \`FK_d675aea38a16313e844662c48f8\``);
        await queryRunner.query(`ALTER TABLE \`sale_items\` DROP FOREIGN KEY \`FK_c642be08de5235317d4cf3deb40\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
        await queryRunner.query(`DROP TABLE \`catalog_services\``);
        await queryRunner.query(`DROP TABLE \`debts\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d0b179c5f58780ede66bbe171\` ON \`gallery_media\``);
        await queryRunner.query(`DROP INDEX \`IDX_e697a01a81610284591a21e74d\` ON \`gallery_media\``);
        await queryRunner.query(`DROP TABLE \`gallery_media\``);
        await queryRunner.query(`DROP INDEX \`IDX_9d8adc796dff8c73acd1eba656\` ON \`notifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_692a909ee0fa9383e7859f9b40\` ON \`notifications\``);
        await queryRunner.query(`DROP TABLE \`notifications\``);
        await queryRunner.query(`DROP TABLE \`services\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`expenses\``);
        await queryRunner.query(`DROP TABLE \`sales\``);
        await queryRunner.query(`DROP TABLE \`sale_items\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
