# Migrations MySaloon

Ce dossier contient les migrations de base de données pour l'application MySaloon.

## Migration Disponible

### `1737859200000-InitialSchema.ts`

Migration initiale qui crée toutes les tables de l'application :
- `users` - Utilisateurs
- `clients` - Clients
- `products` - Produits
- `services` - Services de coiffure
- `sales` - Ventes
- `sale_items` - Détails des ventes
- `expenses` - Dépenses
- `debts` - Dettes

## Commandes

Voir [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) pour le guide complet.

### Exécuter les migrations

```bash
npm run migration:run
```

### Voir le statut

```bash
npm run migration:show
```

### Annuler la dernière migration

```bash
npm run migration:revert
```

## Ordre d'Exécution

Les migrations sont exécutées dans l'ordre chronologique basé sur le timestamp dans le nom du fichier.

## Production

⚠️ **Toujours faire un backup avant d'exécuter les migrations en production !**

```bash
# 1. Backup
mysqldump -u root -p mysaloon > backup.sql

# 2. Build
npm run build

# 3. Exécuter les migrations
npm run migration:run
```
