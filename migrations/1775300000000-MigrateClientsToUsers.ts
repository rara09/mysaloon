import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateClientsToUsers1775300000000 implements MigrationInterface {
  name = 'MigrateClientsToUsers1775300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Create users from clients (email-based merge; otherwise create new)
    await queryRunner.query(`
      INSERT INTO \`users\` (\`email\`, \`password\`, \`firstName\`, \`lastName\`, \`avatar\`, \`isActive\`, \`role\`, \`createdAt\`, \`updatedAt\`)
      SELECT
        COALESCE(NULLIF(c.email, ''), CONCAT('client+', c.id, '@local.invalid')) AS email,
        '' AS password,
        c.firstName,
        c.lastName,
        c.avatar,
        1 AS isActive,
        'CLIENT' AS role,
        c.createdAt,
        c.updatedAt
      FROM \`clients\` c
      LEFT JOIN \`users\` u ON u.email = c.email
      WHERE u.id IS NULL
    `);

    // 2) Add mapping table client->user (temporary)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`client_user_map\` (
        \`clientId\` int NOT NULL,
        \`userId\` int NOT NULL,
        PRIMARY KEY (\`clientId\`),
        INDEX \`IDX_client_user_map_userId\` (\`userId\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      INSERT INTO \`client_user_map\` (\`clientId\`, \`userId\`)
      SELECT
        c.id AS clientId,
        u.id AS userId
      FROM \`clients\` c
      JOIN \`users\` u
        ON u.email = COALESCE(NULLIF(c.email, ''), CONCAT('client+', c.id, '@local.invalid'))
    `);

    // 3) Drop foreign keys that reference clients (names from InitialSchema)
    // services.clientId -> clients.id
    await queryRunner.query(
      `ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_services_clientId\``,
    );
    // sales.clientId -> clients.id
    await queryRunner.query(
      `ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_sales_clientId\``,
    );
    // debts.clientId -> clients.id
    await queryRunner.query(
      `ALTER TABLE \`debts\` DROP FOREIGN KEY \`FK_debts_clientId\``,
    );

    // appointments FK name from AddAppointmentsAndServiceDuration
    await queryRunner.query(
      `ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_appointments_clientId\``,
    );

    // 4) Update ids to userId values
    await queryRunner.query(`
      UPDATE \`services\` s
      JOIN \`client_user_map\` m ON m.clientId = s.clientId
      SET s.clientId = m.userId
      WHERE s.clientId IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE \`sales\` s
      JOIN \`client_user_map\` m ON m.clientId = s.clientId
      SET s.clientId = m.userId
      WHERE s.clientId IS NOT NULL
    `);

    await queryRunner.query(`
      UPDATE \`debts\` d
      JOIN \`client_user_map\` m ON m.clientId = d.clientId
      SET d.clientId = m.userId
    `);

    await queryRunner.query(`
      UPDATE \`appointments\` a
      JOIN \`client_user_map\` m ON m.clientId = a.clientId
      SET a.clientId = m.userId
    `);

    // 5) Re-create FKs pointing to users(id)
    await queryRunner.query(`
      ALTER TABLE \`services\`
      ADD CONSTRAINT \`FK_services_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`sales\`
      ADD CONSTRAINT \`FK_sales_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`debts\`
      ADD CONSTRAINT \`FK_debts_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE \`appointments\`
      ADD CONSTRAINT \`FK_appointments_clientId\` FOREIGN KEY (\`clientId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // 6) Drop clients table and mapping
    await queryRunner.query(`DROP TABLE IF EXISTS \`clients\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`client_user_map\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Non réversible facilement (perte de l'ancienne table clients)
    // On ne tente pas un down automatique pour éviter des incohérences.
  }
}

