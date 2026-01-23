import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveServiceEntity1769159125077 implements MigrationInterface {
    name = 'ImproveServiceEntity1769159125077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`services\` DROP FOREIGN KEY \`FK_4ebfeda8dfc740b6a98fb4e6abb\``);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`stylistId\` \`guestName\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`type\` \`type\` enum ('Nattes', 'Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`guestName\``);
        await queryRunner.query(`ALTER TABLE \`services\` ADD \`guestName\` varchar(255) NULL DEFAULT 'Invité'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`services\` DROP COLUMN \`guestName\``);
        await queryRunner.query(`ALTER TABLE \`services\` ADD \`guestName\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`type\` \`type\` enum ('Tresses', 'Tissage', 'Coupe', 'Coloration', 'Onglerie', 'Autre') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` CHANGE \`guestName\` \`stylistId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`services\` ADD CONSTRAINT \`FK_4ebfeda8dfc740b6a98fb4e6abb\` FOREIGN KEY (\`stylistId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
