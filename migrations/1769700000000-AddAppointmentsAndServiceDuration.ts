import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointmentsAndServiceDuration1769700000000
  implements MigrationInterface
{
  name = 'AddAppointmentsAndServiceDuration1769700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add duration (minutes) to services so we can compute appointment endTime.
    const durationColumn = await queryRunner.query(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'services'
        AND COLUMN_NAME = 'duration'
    `);

    const count = Number(durationColumn?.[0]?.count ?? 0);
    if (count === 0) {
      await queryRunner.query(`
        ALTER TABLE \`services\`
        ADD COLUMN \`duration\` int NOT NULL DEFAULT 60
      `);
    }

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`appointments\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`clientId\` int NOT NULL,
        \`serviceId\` int NOT NULL,
        \`date\` date NOT NULL,
        \`startTime\` time NOT NULL,
        \`endTime\` time NOT NULL,
        \`status\` enum('PENDING','CONFIRMED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'PENDING',
        \`notes\` text NULL,
        \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_appointments_date\` (\`date\`),
        INDEX \`IDX_appointments_status\` (\`status\`),
        INDEX \`IDX_appointments_clientId\` (\`clientId\`),
        INDEX \`IDX_appointments_serviceId\` (\`serviceId\`),
        CONSTRAINT \`FK_appointments_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_appointments_serviceId\` FOREIGN KEY (\`serviceId\`) REFERENCES \`services\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`appointments\``);
    await queryRunner.query(`
      ALTER TABLE \`services\` DROP COLUMN IF EXISTS \`duration\`
    `);
  }
}

