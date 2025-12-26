# Guide de Déploiement en Production

## Prérequis

- Node.js installé sur le serveur
- MySQL installé et configuré
- Accès SSH au serveur de production
- Fichier `.env` configuré avec les bonnes variables d'environnement

## Étapes de Déploiement

### 1. Préparer l'environnement

Sur votre machine de développement, générez les migrations si nécessaire :

```bash
# Générer une migration basée sur les changements
npm run migration:generate -- migrations/NomDeLaMigration

# Vérifier que tout compile
npm run build
```

### 2. Transférer les fichiers vers le serveur

```bash
# Depuis votre machine locale
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ user@server:/path/to/mysaloon/
```

Ou utilisez Git :

```bash
# Sur le serveur
cd /path/to/mysaloon
git pull origin main
```

### 3. Installer les dépendances

```bash
cd /path/to/mysaloon
npm ci --production
```

### 4. Configurer les variables d'environnement

Créez ou mettez à jour le fichier `.env` sur le serveur :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe_production
DB_DATABASE=mysaloon
JWT_SECRET=votre_secret_jwt_securise
PORT=3000
NODE_ENV=production
```

### 5. Backup de la base de données (CRITIQUE)

```bash
mysqldump -u root -p mysaloon > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 6. Build du projet

```bash
npm run build
```

### 7. Exécuter les migrations

```bash
npm run migration:run
```

**Vérification :** Vous pouvez vérifier le statut des migrations :

```bash
npm run migration:show
```

### 8. Démarrer l'application

#### Option A : Directement

```bash
npm run start:prod
```

#### Option B : Avec PM2 (Recommandé)

```bash
# Installer PM2 globalement
npm install -g pm2

# Démarrer l'application
pm2 start dist/main.js --name mysaloon

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
```

#### Option C : Avec systemd

Créez un fichier `/etc/systemd/system/mysaloon.service` :

```ini
[Unit]
Description=MySaloon API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/mysaloon
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Puis :

```bash
sudo systemctl daemon-reload
sudo systemctl enable mysaloon
sudo systemctl start mysaloon
```

## Script de Déploiement Automatique

Créez un script `deploy.sh` :

```bash
#!/bin/bash

set -e

echo "🚀 Déploiement de MySaloon..."

# Variables
APP_DIR="/path/to/mysaloon"
BACKUP_DIR="/path/to/backups"

# 1. Backup de la base de données
echo "📦 Backup de la base de données..."
mysqldump -u root -p$DB_PASSWORD mysaloon > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Pull des dernières modifications
echo "📥 Récupération du code..."
cd $APP_DIR
git pull origin main

# 3. Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --production

# 4. Build
echo "🔨 Build du projet..."
npm run build

# 5. Exécution des migrations
echo "🔄 Exécution des migrations..."
npm run migration:run

# 6. Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart mysaloon || npm run start:prod

echo "✅ Déploiement terminé avec succès!"
```

Rendez-le exécutable :

```bash
chmod +x deploy.sh
```

## Rollback en cas de problème

### 1. Restaurer la base de données

```bash
mysql -u root -p mysaloon < backup_YYYYMMDD_HHMMSS.sql
```

### 2. Annuler les migrations

```bash
npm run migration:revert
```

### 3. Revenir à l'ancienne version du code

```bash
git checkout <ancien-commit-hash>
npm ci --production
npm run build
pm2 restart mysaloon
```

## Vérifications Post-Déploiement

1. ✅ Vérifier que l'application démarre sans erreur
2. ✅ Tester les endpoints de l'API
3. ✅ Vérifier les logs pour les erreurs
4. ✅ Vérifier que les migrations ont été appliquées : `npm run migration:show`
5. ✅ Tester l'authentification
6. ✅ Vérifier la connexion à la base de données

## Monitoring

### Logs avec PM2

```bash
# Voir les logs
pm2 logs mysaloon

# Voir le statut
pm2 status

# Monitoring en temps réel
pm2 monit
```

### Logs avec systemd

```bash
sudo journalctl -u mysaloon -f
```

## Sécurité

- ✅ Ne jamais commiter le fichier `.env`
- ✅ Utiliser des secrets forts pour `JWT_SECRET`
- ✅ Limiter les accès à la base de données
- ✅ Utiliser HTTPS en production
- ✅ Configurer un firewall
- ✅ Mettre à jour régulièrement les dépendances

## Checklist de Déploiement

- [ ] Backup de la base de données effectué
- [ ] Code mis à jour sur le serveur
- [ ] Dépendances installées (`npm ci --production`)
- [ ] Variables d'environnement configurées
- [ ] Build réussi (`npm run build`)
- [ ] Migrations exécutées (`npm run migration:run`)
- [ ] Application démarrée
- [ ] Tests de vérification effectués
- [ ] Logs vérifiés pour les erreurs

