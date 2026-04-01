import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCatalogServiceImage1775100000000 implements MigrationInterface {
  name = 'AddCatalogServiceImage1775100000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const col = await queryRunner.query(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'catalog_services'
        AND COLUMN_NAME = 'image'
    `);
    const count = Number(col?.[0]?.count ?? 0);
    if (count === 0) {
      await queryRunner.query(`
        ALTER TABLE \`catalog_services\`
        ADD COLUMN \`image\` varchar(255) NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`catalog_services\` DROP COLUMN \`image\`
    `);
  }
}
