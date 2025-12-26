# Guide d'Exécution des Migrations en Production

## Migration Initiale

La migration `1737859200000-InitialSchema.ts` crée toutes les tables nécessaires pour l'application MySaloon.

### Tables créées

1. **users** - Utilisateurs de l'application (stylistes, administrateurs)
2. **clients** - Clients du salon
3. **products** - Produits en stock
4. **services** - Services de coiffure effectués
5. **sales** - Ventes de produits
6. **sale_items** - Détails des ventes (lignes de commande)
7. **expenses** - Dépenses du salon
8. **debts** - Dettes des clients

### Relations et Contraintes

- **users** → **services** (stylistId)
- **users** → **sales** (userId)
- **users** → **expenses** (userId)
- **clients** → **services** (clientId)
- **clients** → **sales** (clientId)
- **clients** → **debts** (clientId)
- **services** → **debts** (serviceId)
- **sales** → **debts** (saleId)
- **sales** → **sale_items** (saleId)
- **products** → **sale_items** (productId)

## Exécution en Production

### Prérequis

1. ✅ Base de données MySQL créée
2. ✅ Fichier `.env` configuré avec les bonnes variables
3. ✅ Application compilée (`npm run build`)

### Étapes

#### 1. Backup de la base de données (CRITIQUE)

```bash
mysqldump -u root -p mysaloon > backup_before_migration_$(date +%Y%m%d_%H%M%S).sql
```

#### 2. Vérifier la configuration

Assurez-vous que votre fichier `.env` contient :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=mysaloon
NODE_ENV=production
```

#### 3. Build du projet

```bash
npm run build
```

Cela va :
- Compiler le code TypeScript
- Copier les migrations dans `dist/migrations/`

#### 4. Vérifier le statut des migrations

```bash
npm run migration:show
```

Cela affichera quelles migrations ont été exécutées et lesquelles sont en attente.

#### 5. Exécuter la migration

```bash
npm run migration:run
```

Cette commande va :
- Se connecter à la base de données
- Exécuter toutes les migrations en attente
- Créer toutes les tables avec leurs relations

#### 6. Vérifier le résultat

```bash
# Se connecter à MySQL
mysql -u root -p mysaloon

# Lister les tables
SHOW TABLES;

# Vérifier la structure d'une table
DESCRIBE users;
DESCRIBE clients;
DESCRIBE products;
```

Vous devriez voir toutes les tables créées.

### En cas d'erreur

#### Annuler la dernière migration

```bash
npm run migration:revert
```

#### Restaurer la base de données

```bash
mysql -u root -p mysaloon < backup_before_migration_YYYYMMDD_HHMMSS.sql
```

## Vérification Post-Migration

### Vérifier les tables créées

```sql
SHOW TABLES;
```

Résultat attendu :
```
+-------------------+
| Tables_in_mysaloon|
+-------------------+
| clients           |
| debts             |
| expenses          |
| products          |
| sale_items        |
| sales             |
| services          |
| users             |
+-------------------+
```

### Vérifier les contraintes de clés étrangères

```sql
SELECT
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    REFERENCED_TABLE_SCHEMA = 'mysaloon'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Vérifier les index

```sql
SHOW INDEX FROM users;
SHOW INDEX FROM clients;
```

## Structure des Tables

### Table `users`
- `id` (PK, AUTO_INCREMENT)
- `email` (UNIQUE)
- `password` (hashé avec bcrypt)
- `firstName`, `lastName`
- `avatar` (nullable)
- `isActive` (default: true)
- `createdAt`, `updatedAt`

### Table `clients`
- `id` (PK, AUTO_INCREMENT)
- `firstName`, `lastName`
- `phone` (UNIQUE, nullable)
- `email`, `avatar`, `address` (nullable)
- `createdAt`, `updatedAt`

### Table `products`
- `id` (PK, AUTO_INCREMENT)
- `name`
- `category` (ENUM: Hair, Nails, Aesthetics, Other)
- `costPrice`, `sellingPrice` (DECIMAL)
- `stockLevel` (default: 0)
- `lowStockAlert` (boolean)
- `lowStockThreshold` (default: 5)
- `image`, `description` (nullable)
- `createdAt`, `updatedAt`

### Table `services`
- `id` (PK, AUTO_INCREMENT)
- `name`
- `type` (ENUM: Tresses, Tissage, Coupe, Coloration, Onglerie, Autre)
- `amount` (DECIMAL)
- `paymentMethod` (ENUM: Espèces, Mobile Money, Crédit, Carte)
- `serviceDate` (DATETIME)
- `stylistId` (FK → users)
- `clientId` (FK → clients, nullable)
- `notes` (nullable)
- `createdAt`, `updatedAt`

### Table `sales`
- `id` (PK, AUTO_INCREMENT)
- `totalAmount` (DECIMAL)
- `paymentMethod` (ENUM)
- `userId` (FK → users)
- `clientId` (FK → clients, nullable)
- `createdAt`, `updatedAt`

### Table `sale_items`
- `id` (PK, AUTO_INCREMENT)
- `saleId` (FK → sales, CASCADE DELETE)
- `productId` (FK → products)
- `quantity`
- `unitPrice`, `totalPrice` (DECIMAL)

### Table `expenses`
- `id` (PK, AUTO_INCREMENT)
- `amount` (DECIMAL)
- `category` (ENUM: Produits, Eau, Électricité, Salaires, Loyer, Autre)
- `expenseDate` (DATE)
- `userId` (FK → users)
- `notes`, `receipt` (nullable)
- `createdAt`, `updatedAt`

### Table `debts`
- `id` (PK, AUTO_INCREMENT)
- `totalAmount`, `paidAmount` (DECIMAL)
- `status` (ENUM: IMPAYÉ, PARTIEL, PAYÉ)
- `clientId` (FK → clients)
- `serviceId` (FK → services, nullable)
- `saleId` (FK → sales, nullable)
- `dueDate` (DATE)
- `notes` (nullable)
- `createdAt`, `updatedAt`

## Notes Importantes

⚠️ **IMPORTANT :**
- Ne jamais exécuter les migrations sur une base de données en production sans backup
- Toujours tester les migrations en staging d'abord
- Vérifier que `synchronize: false` en production
- Les migrations sont idempotentes - elles ne s'exécutent qu'une seule fois

✅ **Bonnes pratiques :**
- Faire un backup avant chaque migration
- Vérifier le statut avec `migration:show`
- Tester en local d'abord
- Documenter toute migration personnalisée

