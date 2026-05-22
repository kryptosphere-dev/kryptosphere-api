# kryptosphere-api

API serverless pour Kryptosphere, déployée sur Vercel avec Neon Postgres.

**Stack** : Node.js · TypeScript · Hono · Prisma · Neon (PostgreSQL) · Neon Auth (Better Auth) · Vercel Blob

---

## Démarrage rapide

```bash
npm install
cp env.example .env
# Remplir .env avec les vraies valeurs (voir section Variables d'environnement)
npm run db:generate
npm run db:push
npm run dev   # Node server sur http://localhost:3000
```

---

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | Connection string Neon — branch `dev` en local, `kryptosphere_db` en prod |
| `NEON_AUTH_JWKS_URL` | JWKS endpoint Neon Auth pour vérifier les JWT — Neon Console → Auth → Configuration |
| `SETUP_SECRET` | Secret one-time pour promouvoir le premier super admin — `openssl rand -base64 32` |
| `BLOB_READ_WRITE_TOKEN` | Token Vercel Blob pour l'upload d'images |

Voir `env.example` pour les formats.

---

## Dev local

### Prérequis
- Un projet Neon avec Neon Auth activé
- Un **branch Neon `dev`** créé depuis `production` (hérite du schéma `neon_auth`)
- `DATABASE_URL` pointant sur le branch `dev`

### Lancer le serveur
```bash
npm run dev
# API disponible sur http://localhost:3000
```

`npm run dev` démarre un serveur Node.js via `tsx watch` avec hot-reload.
Le fichier `api/[[...route]].ts` reste l'entrée Vercel utilisée en production.

### Vérifier la connexion
```
GET http://localhost:3000/api/health
```

---

## Premier lancement — setup super admin

À faire **une seule fois** après le premier `db:push` sur une nouvelle base.

**1. Créer un compte via Neon Auth**

```powershell
Invoke-RestMethod `
  -Uri "<NEON_AUTH_BASE_URL>/sign-up/email" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ "Origin" = "http://localhost:3000" } `
  -Body '{"email":"toi@example.com","password":"MotDePasse!","name":"Yohan"}'
```
Utiliser curl sur linux. 

`<NEON_AUTH_BASE_URL>` = Auth URL dans Neon Console → Auth → Configuration.

Récupère le `token` dans la réponse.

**2. Promouvoir en super admin**

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/api/setup" `
  -Method Post `
  -Headers @{
    "Authorization" = "Bearer <token>"
    "x-setup-secret" = "<SETUP_SECRET>"
  }
```

Retourne `403` si un super admin existe déjà.

---

## Routes

### `GET /api/health`

```json
{ "status": "ok", "db": "up", "timestamp": "...", "uptime": 42, "responseTimeMs": 8 }
```

---

### `GET /api/auth/me` — authentifié

Retourne l'utilisateur courant synchronisé depuis Neon Auth.

```
Authorization: Bearer <jwt>
```

---

### `POST /api/board` — super admin uniquement

```json
{ "type": "main", "year": 2025 }
```

`type` : `"main"` | `"chapter"`. `chapterId` obligatoire si `type = "chapter"`.

---

### `POST /api/images` — authentifié

Upload multipart :
- `file` : fichier image
- `key` : identifiant unique
- `altText` (optionnel)

Réponse `201` :
```json
{ "image": { "id": "...", "key": "...", "url": "..." }, "blob": { "url": "..." } }
```

### `GET /api/images?id=<id>` — par ID
### `GET /api/images?limit=20` — liste paginée (défaut 50, max 200)

---

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur Node local avec hot-reload |
| `npm run build` | Compilation TypeScript |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:push` | Applique le schéma Prisma (dev) |
| `npm run db:migrate` | Migrations Prisma (prod) |

---

## Structure du projet

```
kryptosphere-api/
├── api/
│   ├── [[...route]].ts     # Catch-all Vercel → entrée Hono (prod)
│   └── routes/
│       ├── health.router.ts
│       ├── auth.router.ts
│       ├── board.router.ts
│       ├── images.router.ts
│       └── setup.router.ts
├── app.ts                  # App Hono partagée (dev + prod)
├── server.ts               # Serveur Node local (dev uniquement)
├── lib/
│   ├── db.ts               # Client Prisma singleton (adaptateur Neon)
│   └── middleware.ts       # Auth JWT (JWKS) + role guard
├── services/postgres/      # DAO layer — un service par entité
├── models/                 # Interfaces TypeScript
├── prisma/
│   ├── schema.prisma
│   └── prisma.config.ts    # Config Prisma 7 (adaptateur Neon)
└── env.example
```

---

## Déploiement

Voir [DEPLOYMENT.md](DEPLOYMENT.md).
