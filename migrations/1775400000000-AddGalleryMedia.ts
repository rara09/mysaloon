import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGalleryMedia1775400000000 implements MigrationInterface {
  name = 'AddGalleryMedia1775400000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`gallery_media\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`kind\` enum('IMAGE','VIDEO') NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`src\` varchar(500) NOT NULL,
        \`poster\` varchar(500) NULL,
        \`isActive\` tinyint(1) NOT NULL DEFAULT 1,
        \`sortOrder\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_gallery_media_isActive\` (\`isActive\`),
        INDEX \`IDX_gallery_media_sortOrder\` (\`sortOrder\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `gallery_media`');
  }
}

