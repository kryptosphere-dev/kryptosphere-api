# Guide de déploiement

## Prérequis

- Compte [Vercel](https://vercel.com)
- Projet [Neon](https://console.neon.tech) avec une base PostgreSQL 16
- Node.js 18+

---

## 1. Préparer Neon

1. Créer un projet Neon (région la plus proche)
2. Copier la connection string depuis le dashboard : **Connection Details > Connection string**
   - Format : `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`
3. Appliquer le schema Prisma :
   ```bash
   DATABASE_URL=<connection-string> npx prisma migrate deploy
   ```

---

## 2. Configurer Vercel

Dans **Settings > Environment Variables**, ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | Connection string Neon complète |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob (depuis le dashboard Blob) |
| `SETUP_SECRET` | `openssl rand -hex 32` |
| `SHA256_SALT` | `openssl rand -hex 32` |

---

## 3. Déployer

### Via GitHub (recommandé)

1. Pousser le code sur GitHub
2. Sur Vercel : **Add New Project** > importer le repo
3. Vercel détecte automatiquement TypeScript et compile `api/[[...route]].ts`
4. Cliquer **Deploy**

### Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 4. Initialiser le root user (une seule fois)

```bash
curl -X POST https://your-api.vercel.app/api/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SETUP_SECRET" \
  -d '{
    "email": "admin@example.com",
    "password": "secure-password"
  }'
```

Réponse attendue (201) :
```json
{ "message": "Root user created successfully", "email": "admin@example.com" }
```

Retourne 403 si appelé une seconde fois.

---

## 5. Vérifier le déploiement

```bash
# Health check
curl https://your-api.vercel.app/api/health

# Login
curl -X POST https://your-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@example.com", "password": "secure-password" }'
```

---

## Dépannage

**`SETUP_SECRET environment variable is not set`**
→ Ajouter la variable dans Vercel Dashboard > Settings > Environment Variables

**`Unauthorized` lors du setup**
→ Vérifier que le token dans `Authorization: Bearer` correspond exactement à `SETUP_SECRET`

**`Root user already exists`**
→ Normal — le setup ne peut s'exécuter qu'une fois

**`Database connection failed` (health check)**
→ Vérifier `DATABASE_URL` dans les env vars Vercel. S'assurer que `?sslmode=require` est bien présent.

**Cold start lent (première requête)**
→ Normal pour les fonctions serverless Vercel. Les appels suivants sont plus rapides grâce au cache Prisma.

---

## Sécurité

- Ne jamais commiter `.env` (gitignored)
- `SETUP_SECRET` et `SHA256_SALT` : générés aléatoirement, jamais réutilisés entre environnements
- Sessions : tokens hashés en SHA-256 en base, TTL 30 jours, révocables
