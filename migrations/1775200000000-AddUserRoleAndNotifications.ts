import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoleAndNotifications1775200000000
  implements MigrationInterface
{
  name = 'AddUserRoleAndNotifications1775200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const roleCol = await queryRunner.query(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'role'
    `);
    const roleCount = Number(roleCol?.[0]?.count ?? 0);
    if (roleCount === 0) {
      await queryRunner.query(`
        ALTER TABLE \`users\`
        ADD COLUMN \`role\` enum('ADMIN','STAFF','CLIENT') NOT NULL DEFAULT 'ADMIN'
      `);
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`notifications\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`userId\` int NOT NULL,
        \`type\` enum('APPOINTMENT_CREATED') NOT NULL,
        \`title\` varchar(255) NOT NULL,
        \`body\` text NOT NULL,
        \`data\` json NULL,
        \`readAt\` datetime NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_notifications_userId\` (\`userId\`),
        INDEX \`IDX_notifications_readAt\` (\`readAt\`)
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`notifications\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`role\``);
  }
}

