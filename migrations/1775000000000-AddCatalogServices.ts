import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCatalogServices1775000000000 implements MigrationInterface {
  name = 'AddCatalogServices1775000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`catalog_services\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) NOT NULL,
        \`type\` enum('Nattes', 'Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL,
        \`amount\` decimal(10,2) NOT NULL,
        \`duration\` int NOT NULL DEFAULT 60,
        \`description\` text NULL,
        \`isActive\` tinyint(1) NOT NULL DEFAULT 1,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`catalog_services\``);
  }
}
