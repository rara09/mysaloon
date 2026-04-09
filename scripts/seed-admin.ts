/**
 * Crée un utilisateur administrateur par défaut si aucun compte avec cet email n'existe.
 * Exécuter après les migrations : npm run seed:admin
 */
import { config } from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../src/entities/user.entity';
import { UserRole } from '../src/entities/enums';

config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@mysaloon.local';
  const plainPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
  const firstName = process.env.SEED_ADMIN_FIRST_NAME || 'Admin';
  const lastName = process.env.SEED_ADMIN_LAST_NAME || 'MySaloon';

  if (
    process.env.NODE_ENV === 'production' &&
    plainPassword === 'ChangeMe123!'
  ) {
    console.error(
      'Refus: définissez SEED_ADMIN_PASSWORD dans .env en production (mot de passe par défaut interdit).',
    );
    process.exit(1);
  }

  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'mysaloon',
    entities: [path.join(__dirname, '../src/**/*.entity.{ts,js}')],
    synchronize: false,
    logging: false,
  });

  await dataSource.initialize();

  try {
    const repo = dataSource.getRepository(User);
    const existing = await repo.findOne({ where: { email } });

    if (existing) {
      console.log(
        `Aucune action : un utilisateur existe déjà avec l'email "${email}".`,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await repo.save(
      repo.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.ADMIN,
        isActive: true,
      }),
    );

    console.log(`Administrateur créé : ${email}`);
  } finally {
    await dataSource.destroy();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
