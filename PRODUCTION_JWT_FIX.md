# Fix JWT Authentication en Production

## Problème

Les routes protégées retournent 401 Unauthorized en production même avec un token valide, alors que tout fonctionne en local.

## Causes Possibles

1. **JWT_SECRET différent** entre local et production
2. **Fichier .env non chargé** en production
3. **Variables d'environnement non définies** dans le système
4. **Token expiré ou invalide**
5. **Format du header Authorization incorrect**

## Solutions

### 1. Vérifier le fichier .env en production

Assurez-vous que le fichier `.env` existe dans le dossier racine du projet en production :

```bash
# Sur le serveur de production
cd /path/to/mysaloon
ls -la .env
cat .env | grep JWT_SECRET
```

Le fichier doit contenir :
```env
JWT_SECRET=votre_secret_jwt_identique_au_local
```

### 2. Vérifier que le JWT_SECRET est identique

**IMPORTANT :** Le `JWT_SECRET` utilisé pour **signer** le token (lors du login) doit être **identique** à celui utilisé pour **valider** le token (lors de l'accès aux routes protégées).

#### En local :
```bash
cat .env | grep JWT_SECRET
```

#### En production :
```bash
# Sur le serveur
cat .env | grep JWT_SECRET
```

Les deux doivent être **identiques**.

### 3. Vérifier le chargement des variables d'environnement

Ajoutez un log temporaire dans `main.ts` pour vérifier :

```typescript
// Dans src/main.ts, avant app.listen()
console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### 4. Redémarrer l'application après modification du .env

**CRITIQUE :** Après avoir modifié le fichier `.env`, vous **DEVEZ** redémarrer l'application :

```bash
# Avec PM2
pm2 restart mysaloon

# Avec systemd
sudo systemctl restart mysaloon

# Directement
# Arrêter (Ctrl+C) puis
npm run start:prod
```

### 5. Vérifier le format du header Authorization

Le header doit être exactement dans ce format :

```
Authorization: Bearer <token>
```

**Points importants :**
- "Bearer" avec un B majuscule
- Un espace entre "Bearer" et le token
- Pas de guillemets autour du token
- Pas d'espaces supplémentaires

### 6. Tester avec curl

```bash
# 1. Se connecter pour obtenir un token
curl -X POST http://votre-serveur/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"votre_email","password":"votre_password"}'

# 2. Copier le token de la réponse

# 3. Tester une route protégée
curl -X GET http://votre-serveur/api/clients \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -v  # -v pour voir les headers de réponse
```

### 7. Vérifier les logs

Les logs d'erreur ont été ajoutés. Vérifiez les logs de l'application :

```bash
# Avec PM2
pm2 logs mysaloon

# Avec systemd
sudo journalctl -u mysaloon -f

# Directement
# Les erreurs s'afficheront dans la console
```

Vous devriez voir des messages comme :
- `JWT Guard Error: No authorization header` (si le header manque)
- `JWT Guard Error: Invalid authorization format` (si le format est incorrect)
- `JWT Validation Error: Invalid payload` (si le token est invalide)
- `JWT Validation Error: User not found` (si l'utilisateur n'existe plus)

## Checklist de Vérification

- [ ] Le fichier `.env` existe en production
- [ ] Le `JWT_SECRET` dans `.env` est identique à celui en local
- [ ] L'application a été redémarrée après modification du `.env`
- [ ] Le token a été obtenu avec le même `JWT_SECRET`
- [ ] Le header Authorization est au format correct : `Bearer <token>`
- [ ] Le token n'est pas expiré (valide 7 jours)
- [ ] L'utilisateur existe et est actif dans la base de données
- [ ] Les logs montrent des erreurs spécifiques

## Solution Rapide

1. **Vérifier et synchroniser JWT_SECRET** :
   ```bash
   # En local
   echo $JWT_SECRET

   # En production (dans .env)
   JWT_SECRET=<même_valeur>
   ```

2. **Redémarrer l'application** :
   ```bash
   pm2 restart mysaloon
   ```

3. **Obtenir un nouveau token** :
   ```bash
   curl -X POST http://votre-serveur/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"email","password":"password"}'
   ```

4. **Tester avec le nouveau token** :
   ```bash
   curl -X GET http://votre-serveur/api/clients \
     -H "Authorization: Bearer NOUVEAU_TOKEN"
   ```

## Debug Avancé

Si le problème persiste, activez le logging détaillé temporairement :

Dans `src/auth/jwt.strategy.ts`, décommentez les logs de debug pour voir exactement ce qui se passe.

## Notes

- Les tokens générés avec un `JWT_SECRET` ne peuvent être validés qu'avec le même secret
- Si vous changez le `JWT_SECRET`, tous les tokens existants deviennent invalides
- En production, utilisez un secret fort et unique
- Ne commitez jamais le fichier `.env` dans Git


