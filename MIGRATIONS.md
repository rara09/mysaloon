# Guide des Migrations TypeORM

## Configuration

Les migrations sont configurées pour fonctionner avec MySQL. La configuration se trouve dans `typeorm.config.ts` et utilise les variables d'environnement du fichier `.env`.

## Commandes de Migration

### 1. Générer une migration automatiquement

Génère une migration basée sur les différences entre vos entités et le schéma actuel de la base de données :

```bash
npm run migration:generate -- migrations/NomDeLaMigration
```

**Exemple :**
```bash
npm run migration:generate -- migrations/AddUserAvatar
```

### 2. Créer une migration manuelle

Crée un fichier de migration vide que vous pouvez remplir manuellement :

```bash
npm run migration:create -- migrations/NomDeLaMigration
```

**Exemple :**
```bash
npm run migration:create -- migrations/AddIndexToClients
```

### 3. Exécuter les migrations (Production)

Exécute toutes les migrations en attente :

```bash
npm run migration:run
```

**⚠️ Important :** Cette commande doit être exécutée après le build en production :
```bash
npm run build
npm run migration:run
npm run start:prod
```

### 4. Annuler la dernière migration

Annule la dernière migration exécutée :

```bash
npm run migration:revert
```

### 5. Voir le statut des migrations

Affiche quelles migrations ont été exécutées et lesquelles sont en attente :

```bash
npm run migration:show
```

## Workflow Recommandé

### Développement

1. Modifiez vos entités dans `src/entities/`
2. Générez la migration :
   ```bash
   npm run migration:generate -- migrations/DescriptionDesChangements
   ```
3. Vérifiez le fichier de migration généré dans `migrations/`
4. Testez la migration localement :
   ```bash
   npm run migration:run
   ```

### Production

1. **Backup de la base de données** (CRITIQUE) :
   ```bash
   mysqldump -u root -p mysaloon > backup_$(date +%Y%m%d_%H%M%S).sql
   ```

2. **Build du projet** :
   ```bash
   npm run build
   ```

3. **Exécuter les migrations** :
   ```bash
   npm run migration:run
   ```

4. **Démarrer l'application** :
   ```bash
   npm run start:prod
   ```

## Structure d'une Migration

Une migration TypeORM ressemble à ceci :

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NomDeLaMigration1234567890 implements MigrationInterface {
  name = 'NomDeLaMigration1234567890'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Code pour appliquer la migration
    await queryRunner.query(`ALTER TABLE users ADD COLUMN avatar VARCHAR(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Code pour annuler la migration
    await queryRunner.query(`ALTER TABLE users DROP COLUMN avatar`);
  }
}
```

## Bonnes Pratiques

1. ✅ **Toujours tester les migrations en staging avant la production**
2. ✅ **Faire des backups avant chaque migration en production**
3. ✅ **Vérifier les migrations générées avant de les commiter**
4. ✅ **Utiliser des noms descriptifs pour les migrations**
5. ✅ **Ne jamais modifier une migration déjà exécutée en production**
6. ✅ **Créer une nouvelle migration pour corriger les erreurs**

## Dépannage

### Erreur : "Migration already executed"

Si une migration a déjà été exécutée mais que vous voulez la réexécuter, vous devez d'abord l'annuler :

```bash
npm run migration:revert
npm run migration:run
```

### Erreur : "Cannot find module"

Assurez-vous d'avoir compilé le projet avant d'exécuter les migrations :

```bash
npm run build
npm run migration:run
```

### Migration échouée en production

1. Vérifiez les logs pour identifier l'erreur
2. Si possible, annulez la migration :
   ```bash
   npm run migration:revert
   ```
3. Corrigez le problème
4. Créez une nouvelle migration pour appliquer la correction

## Variables d'Environnement Requises

Assurez-vous que votre fichier `.env` contient :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=mysaloon
NODE_ENV=production
```

