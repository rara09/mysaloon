# MySaloon - Backend API

Backend API pour la gestion et le suivi d'un salon de coiffure développé avec NestJS.

## Fonctionnalités

- ✅ Authentification JWT (register, login)
- ✅ Gestion des clients
- ✅ Gestion des services (coiffures)
- ✅ Gestion des produits et stock
- ✅ Gestion des ventes
- ✅ Gestion des dépenses
- ✅ Gestion des dettes clients
- ✅ Dashboard avec statistiques

## Prérequis

- Node.js (v18 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le projet et installer les dépendances :

```bash
npm install
```

2. Configurer les variables d'environnement :

Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=mysaloon

# JWT Configuration
JWT_SECRET=votre_secret_jwt_changez_en_production

# Application
PORT=3000
NODE_ENV=development
```

3. Créer la base de données MySQL :

```sql
CREATE DATABASE mysaloon;
```

4. Lancer l'application :

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera accessible sur `http://localhost:3000/api`

## Structure de l'API

### Authentification

- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion

### Clients

- `GET /api/clients` - Liste des clients
- `GET /api/clients/:id` - Détails d'un client
- `POST /api/clients` - Créer un client
- `PATCH /api/clients/:id` - Modifier un client
- `DELETE /api/clients/:id` - Supprimer un client

### Services (Coiffures)

- `GET /api/services` - Liste des services
- `GET /api/services/:id` - Détails d'un service
- `POST /api/services` - Créer un service
- `PATCH /api/services/:id` - Modifier un service
- `DELETE /api/services/:id` - Supprimer un service

### Produits

- `GET /api/products` - Liste des produits
- `GET /api/products/low-stock` - Produits en rupture de stock
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit
- `PATCH /api/products/:id` - Modifier un produit
- `PUT /api/products/:id/stock` - Mettre à jour le stock
- `DELETE /api/products/:id` - Supprimer un produit

### Ventes

- `GET /api/sales` - Liste des ventes
- `GET /api/sales/:id` - Détails d'une vente
- `POST /api/sales` - Créer une vente
- `DELETE /api/sales/:id` - Supprimer une vente

### Dépenses

- `GET /api/expenses` - Liste des dépenses
- `GET /api/expenses/today-total` - Total des dépenses aujourd'hui
- `GET /api/expenses/:id` - Détails d'une dépense
- `POST /api/expenses` - Créer une dépense
- `PATCH /api/expenses/:id` - Modifier une dépense
- `DELETE /api/expenses/:id` - Supprimer une dépense

### Dettes

- `GET /api/debts` - Liste des dettes (filtrer par status avec ?status=IMPAYÉ|PARTIEL|PAYÉ)
- `GET /api/debts/total` - Total des dettes
- `GET /api/debts/clients-count` - Nombre de clients avec dettes
- `GET /api/debts/:id` - Détails d'une dette
- `POST /api/debts` - Créer une dette
- `PATCH /api/debts/:id` - Modifier une dette
- `PUT /api/debts/:id/pay` - Payer une dette
- `DELETE /api/debts/:id` - Supprimer une dette

### Dashboard

- `GET /api/dashboard/stats?period=day|week|month|year` - Statistiques du dashboard
- `GET /api/dashboard/history?period=day|week|month|year` - Historique des opérations

## Exemples de requêtes

### Inscription

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Connexion

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Créer un service (nécessite un token JWT)

```bash
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Coupe Homme",
  "type": "Coupe",
  "amount": 25,
  "paymentMethod": "Espèces",
  "serviceDate": "2024-01-15T14:30:00Z",
  "stylistId": 1,
  "clientId": 1
}
```

### Créer une vente (nécessite un token JWT)

```bash
POST /api/sales
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "Carte",
  "userId": 1,
  "clientId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "unitPrice": 15.00
    }
  ]
}
```

## Sécurité

- Toutes les routes (sauf `/api/auth/register` et `/api/auth/login`) nécessitent un token JWT
- Les mots de passe sont hashés avec bcrypt
- Validation des données avec class-validator
- CORS activé pour les requêtes cross-origin

## Technologies utilisées

- NestJS
- TypeORM
- MySQL
- JWT (Passport)
- bcrypt
- class-validator
- class-transformer

## Structure du projet

```
src/
├── entities/          # Entités TypeORM
├── auth/             # Module d'authentification
├── clients/          # Module clients
├── services/         # Module services (coiffures)
├── products/         # Module produits
├── sales/            # Module ventes
├── expenses/         # Module dépenses
├── debts/            # Module dettes
├── dashboard/        # Module dashboard
├── config/           # Configuration
└── main.ts           # Point d'entrée
```

## Notes

- En mode développement, TypeORM synchronise automatiquement le schéma de la base de données
- En production, désactivez `synchronize` et utilisez des migrations
- Changez le `JWT_SECRET` en production pour plus de sécurité
