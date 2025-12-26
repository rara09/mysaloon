# Guide de Débogage JWT

## Problème : Erreur 401 Unauthorized

Si vous recevez une erreur 401 même avec un token valide, vérifiez les points suivants :

### 1. Format du Header Authorization

Le header doit être exactement dans ce format :

```
Authorization: Bearer <votre_token>
```

**Points importants :**
- Le mot "Bearer" doit être en majuscule B
- Il doit y avoir un espace entre "Bearer" et le token
- Pas d'espaces supplémentaires
- Pas de guillemets autour du token

**Exemple correct :**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemples incorrects :**
```bash
# ❌ Mauvaise casse
Authorization: bearer <token>

# ❌ Pas d'espace
Authorization: Bearer<token>

# ❌ Guillemets autour du token
Authorization: Bearer "<token>"

# ❌ Espaces supplémentaires
Authorization: Bearer  <token>
```

### 2. Vérifier le Token

#### a) Décoder le token

Vous pouvez décoder votre token JWT sur [jwt.io](https://jwt.io) pour vérifier :
- Le payload contient `sub` (user ID) et `email`
- Le token n'est pas expiré
- Le secret utilisé pour signer correspond à `JWT_SECRET` dans votre `.env`

#### b) Vérifier la structure du payload

Le token doit contenir :
```json
{
  "sub": 1,
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 3. Vérifier la Configuration

#### a) Fichier `.env`

Assurez-vous que votre fichier `.env` contient :

```env
JWT_SECRET=votre_secret_jwt
```

**Important :** Le même secret doit être utilisé pour :
- Signer le token (dans `auth.service.ts`)
- Valider le token (dans `jwt.strategy.ts`)

#### b) Redémarrer l'application

Après avoir modifié `.env`, **redémarrez toujours l'application** :

```bash
# Arrêter l'application (Ctrl+C)
# Puis redémarrer
npm run start:dev
```

### 4. Tester avec curl

#### Test de connexion
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

#### Test avec token
```bash
# Récupérer le token depuis la réponse du login
TOKEN="votre_token_ici"

# Tester une route protégée
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Vérifier les Logs

Activez le logging dans `jwt.strategy.ts` temporairement pour déboguer :

```typescript
async validate(payload: any) {
  console.log('JWT Payload:', payload); // Debug
  const user = await this.authService.validateUser(payload.sub);
  if (!user) {
    console.log('User not found:', payload.sub); // Debug
    throw new UnauthorizedException();
  }
  return user;
}
```

### 6. Vérifier que l'utilisateur existe

Le token peut être valide mais l'utilisateur peut ne plus exister ou être inactif. Vérifiez dans la base de données :

```sql
SELECT id, email, isActive FROM users WHERE id = <user_id_from_token>;
```

### 7. Problèmes Courants

#### Problème : Token expiré
**Solution :** Connectez-vous à nouveau pour obtenir un nouveau token

#### Problème : Secret JWT différent
**Solution :** Vérifiez que `JWT_SECRET` dans `.env` est le même partout

#### Problème : Utilisateur inactif
**Solution :** Vérifiez que `isActive = true` dans la base de données

#### Problème : Format du header incorrect
**Solution :** Vérifiez exactement le format : `Authorization: Bearer <token>`

### 8. Test Complet

```bash
# 1. S'inscrire ou se connecter
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Copier le token de la réponse (access_token)

# 3. Tester une route protégée
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json"
```

### 9. Vérification du Code

Assurez-vous que :
- ✅ `JwtStrategy` utilise `ConfigService` pour lire `JWT_SECRET`
- ✅ `JwtModule` utilise `registerAsync` avec `ConfigService`
- ✅ Le guard `JwtAuthGuard` est bien appliqué sur les routes
- ✅ Le token est signé avec le même secret que celui utilisé pour la validation

## Solution Rapide

Si rien ne fonctionne, essayez cette séquence :

1. **Vérifier le fichier `.env`** :
   ```bash
   cat .env | grep JWT_SECRET
   ```

2. **Redémarrer l'application** :
   ```bash
   # Arrêter (Ctrl+C)
   npm run start:dev
   ```

3. **Obtenir un nouveau token** :
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"votre_email","password":"votre_password"}'
   ```

4. **Tester avec le nouveau token** :
   ```bash
   curl -X GET http://localhost:3000/api/clients \
     -H "Authorization: Bearer NOUVEAU_TOKEN"
   ```



