import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserNullableSaleTable1769385505886 implements MigrationInterface {
    name = 'MakeUserNullableSaleTable1769385505886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_52ff6cd9431cc7687c76f935938\``);
        await queryRunner.query(`ALTER TABLE \`sales\` CHANGE \`userId\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_52ff6cd9431cc7687c76f935938\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`sales\` DROP FOREIGN KEY \`FK_52ff6cd9431cc7687c76f935938\``);
        await queryRunner.query(`ALTER TABLE \`sales\` CHANGE \`userId\` \`userId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`sales\` ADD CONSTRAINT \`FK_52ff6cd9431cc7687c76f935938\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
