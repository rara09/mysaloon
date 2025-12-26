import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1737859200000 implements MigrationInterface {
  name = 'InitialSchema1737859200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Table users
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`firstName\` varchar(255) NOT NULL,
        \`lastName\` varchar(255) NOT NULL,
        \`avatar\` varchar(255) NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_users_email\` (\`email\`)
      ) ENGINE=InnoDB
    `);

    // Table clients
    await queryRunner.query(`
      CREATE TABLE \`clients\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`firstName\` varchar(255) NOT NULL,
        \`lastName\` varchar(255) NOT NULL,
        \`phone\` varchar(255) NULL,
        \`email\` varchar(255) NULL,
        \`avatar\` varchar(255) NULL,
        \`address\` varchar(255) NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_clients_phone\` (\`phone\`)
      ) ENGINE=InnoDB
    `);

    // Table products
    await queryRunner.query(`
      CREATE TABLE \`products\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`category\` enum('Hair', 'Nails', 'Aesthetics', 'Other') NOT NULL DEFAULT 'Hair',
        \`costPrice\` decimal(10,2) NOT NULL,
        \`sellingPrice\` decimal(10,2) NOT NULL,
        \`stockLevel\` int NOT NULL DEFAULT 0,
        \`image\` varchar(255) NULL,
        \`description\` text NULL,
        \`lowStockAlert\` tinyint NOT NULL DEFAULT 0,
        \`lowStockThreshold\` int NOT NULL DEFAULT 5,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    // Table services
    await queryRunner.query(`
      CREATE TABLE \`services\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`type\` enum('Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL,
        \`amount\` decimal(10,2) NOT NULL,
        \`paymentMethod\` enum('Espèces', 'Mobile Money', 'Crédit', 'Carte') NOT NULL DEFAULT 'Espèces',
        \`serviceDate\` datetime NOT NULL,
        \`notes\` text NULL,
        \`stylistId\` int NOT NULL,
        \`clientId\` int NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_services_stylistId\` (\`stylistId\`),
        INDEX \`IDX_services_clientId\` (\`clientId\`),
        CONSTRAINT \`FK_services_stylistId\` FOREIGN KEY (\`stylistId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_services_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // Table sales
    await queryRunner.query(`
      CREATE TABLE \`sales\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`totalAmount\` decimal(10,2) NOT NULL,
        \`paymentMethod\` enum('Espèces', 'Mobile Money', 'Crédit', 'Carte') NOT NULL DEFAULT 'Espèces',
        \`userId\` int NOT NULL,
        \`clientId\` int NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_sales_userId\` (\`userId\`),
        INDEX \`IDX_sales_clientId\` (\`clientId\`),
        CONSTRAINT \`FK_sales_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_sales_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // Table sale_items
    await queryRunner.query(`
      CREATE TABLE \`sale_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`saleId\` int NOT NULL,
        \`productId\` int NOT NULL,
        \`quantity\` int NOT NULL,
        \`unitPrice\` decimal(10,2) NOT NULL,
        \`totalPrice\` decimal(10,2) NOT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_sale_items_saleId\` (\`saleId\`),
        INDEX \`IDX_sale_items_productId\` (\`productId\`),
        CONSTRAINT \`FK_sale_items_saleId\` FOREIGN KEY (\`saleId\`) REFERENCES \`sales\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_sale_items_productId\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // Table expenses
    await queryRunner.query(`
      CREATE TABLE \`expenses\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`amount\` decimal(10,2) NOT NULL,
        \`category\` enum('Produits', 'Eau', 'Électricité', 'Salaires', 'Loyer', 'Autre') NOT NULL DEFAULT 'Autre',
        \`expenseDate\` date NOT NULL,
        \`notes\` text NULL,
        \`receipt\` varchar(255) NULL,
        \`userId\` int NOT NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_expenses_userId\` (\`userId\`),
        CONSTRAINT \`FK_expenses_userId\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    // Table debts
    await queryRunner.query(`
      CREATE TABLE \`debts\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`totalAmount\` decimal(10,2) NOT NULL,
        \`paidAmount\` decimal(10,2) NOT NULL DEFAULT 0,
        \`status\` enum('IMPAYÉ', 'PARTIEL', 'PAYÉ') NOT NULL DEFAULT 'IMPAYÉ',
        \`clientId\` int NOT NULL,
        \`serviceId\` int NULL,
        \`saleId\` int NULL,
        \`dueDate\` date NOT NULL,
        \`notes\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_debts_clientId\` (\`clientId\`),
        INDEX \`IDX_debts_serviceId\` (\`serviceId\`),
        INDEX \`IDX_debts_saleId\` (\`saleId\`),
        CONSTRAINT \`FK_debts_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_debts_serviceId\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION,
        CONSTRAINT \`FK_debts_saleId\` FOREIGN KEY (\`saleId\`) REFERENCES \`sales\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les tables dans l'ordre inverse (les contraintes de clés étrangères seront supprimées automatiquement)
    await queryRunner.query(`DROP TABLE IF EXISTS \`debts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`expenses\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`sale_items\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`sales\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`services\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`products\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`clients\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
  }
}

