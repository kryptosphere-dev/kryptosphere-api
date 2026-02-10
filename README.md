# Kryptosphere API

API serverless pour Kryptosphere déployée sur Vercel avec MongoDB Atlas.

## 🚀 Déploiement rapide

### Prérequis

- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuit)
- Node.js 18+ installé localement

### Étapes de déploiement

#### 1. Cloner et installer

```bash
git clone <votre-repo>
cd kryptosphere-api
npm install
```

#### 2. Configurer MongoDB Atlas

1. Créez un cluster MongoDB Atlas (gratuit tier)
2. Créez un utilisateur de base de données avec un mot de passe fort
3. Configurez les IPs autorisées :
   - Pour le développement : ajoutez votre IP
   - Pour Vercel : ajoutez `0.0.0.0/0` (toutes les IPs) ou utilisez Vercel IP ranges
4. Récupérez votre connection string :
   - Cliquez sur "Connect" > "Connect your application"
   - Copiez l'URI (format : `mongodb+srv://username:password@cluster.mongodb.net/`)

#### 3. Configurer les variables d'environnement

Créez un fichier `.env` à partir de `env.example` :

```bash
cp env.example .env
```

Remplissez les variables dans `.env` :

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
SETUP_SECRET=votre_token_secret_ici
PORT=3000
```

**Générer un SETUP_SECRET sécurisé :**
```bash
openssl rand -hex 32
```

#### 4. Configurer Vercel

##### Option A : Via GitHub (recommandé)

1. Poussez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur **"Add New Project"**
4. Importez votre repository GitHub
5. Vercel détectera automatiquement la configuration TypeScript
6. **Ajoutez les variables d'environnement** :
   - Allez dans **Settings > Environment Variables**
   - Ajoutez :
     - `MONGODB_URI` : votre URI MongoDB complète
     - `SETUP_SECRET` : le token secret généré
   - (Optionnel) Si vous utilisez des variables séparées :
     - `MONGODB_USER`
     - `MONGODB_PWD`
     - `MONGODB_DB`
7. Cliquez sur **"Deploy"**

##### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer (première fois)
vercel

# Suivre les instructions pour configurer les variables d'environnement
# Ou les ajouter via le dashboard Vercel

# Déployer en production
vercel --prod
```

#### 5. Initialiser le root user (⚠️ Une seule fois)

Après le déploiement, créez le root user avec le token `SETUP_SECRET` :

```bash
curl -X POST https://votre-domaine.vercel.app/api/setup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_SETUP_SECRET" \
  -d '{
    "login": "root",
    "password": "VOTRE_MOT_DE_PASSE_SECURISE",
    "email": "admin@votre-domaine.com",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

**⚠️ Important :**
- Cette route ne fonctionne **qu'une seule fois**
- Vous devez fournir le `SETUP_SECRET` dans le header `Authorization: Bearer`
- Après création, la route retournera une erreur 403 si vous essayez de recréer le root user

#### 6. Tester l'API

**Login :**
```bash
curl -X POST https://votre-domaine.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "root",
    "password": "VOTRE_MOT_DE_PASSE"
  }'
```

**Récupérer l'utilisateur connecté :**
```bash
curl -X GET https://votre-domaine.vercel.app/api/auth/me \
  -H "Authorization: Bearer SESSION_ID_RETOURNE_PAR_LOGIN"
```

## 📁 Structure du projet 

```
kryptosphere-api/
├── api/                    # Routes Vercel Serverless Functions (Web Standards)
│   ├── auth/
│   │   ├── login.ts       # POST /api/auth/login
│   │   └── me.ts          # GET /api/auth/me
│   ├── board/
│   │   └── index.ts       # POST /api/board
│   ├── setup.ts           # POST /api/setup (initialisation)
│   └── health.ts          # GET /api/health (healthcheck)
├── lib/                    # Utilitaires partagés
│   ├── mongodb.ts         # Connexion MongoDB mise en cache (adaptée serverless)
│   └── middleware.ts      # Sécurité & helpers (session, rôle, réponses HTTP)
├── services/               # Services métier
│   └── mongoose/          # Services MongoDB (User, Session, Board, etc.)
├── models/                 # Interfaces TypeScript (User, Board, Session, ...)
├── utils/
│   └── security.utils.ts  # Hash mot de passe, etc.
├── env.example            # Exemple de configuration d'environnement
├── package.json
└── tsconfig.json
```

## 🔌 Routes API

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `POST` | `/api/auth/login` | Authentification | ❌ |
| `GET` | `/api/auth/me` | Récupérer l'utilisateur connecté | ✅ Session |
| `POST` | `/api/board` | Créer un board | ✅ SuperAdmin |
| `POST` | `/api/setup` | Initialiser le root user | 🔑 SETUP_SECRET |
| `GET` | `/api/health` | Healthcheck API & DB | ❌ |

## 🔒 Sécurité

### Variables d'environnement

- ✅ **Ne jamais commiter** `.env` dans Git
- ✅ Utiliser des tokens secrets forts pour `SETUP_SECRET`
- ✅ Limiter les IPs autorisées sur MongoDB Atlas si possible
- ✅ HTTPS automatique avec Vercel

### Bonnes pratiques

1. Changez le mot de passe root après la première connexion
2. Ne partagez jamais le `SETUP_SECRET`
3. Utilisez des mots de passe forts
4. Surveillez les logs Vercel pour détecter les tentatives d'accès suspectes

## 🛠️ Développement local (avec `npx vercel dev`)

En local, on utilise **exactement le même code** que sur Vercel, via le CLI Vercel, mais sans installation globale grâce à `npx`.

```bash
# Installer les dépendances
npm install

# Créer un fichier .env avec vos variables
cp env.example .env
# Éditer .env avec vos valeurs

# Lancer l'API en local (mêmes routes qu'en prod)
npm run dev
```

`npm run dev` exécute en réalité `npx vercel dev` :

- au **premier lancement**, `npx` va :
  - télécharger le CLI Vercel (`vercel@...`)
  - te demander de te connecter (`Visit vercel.com/device and enter XXXXX-XXXXX`)
  - tu dois te connecter avec le compte **contact.kryptosphere@gmail.com**
- aux lancements suivants, il réutilisera cette configuration (plus besoin de se reconnecter).

Par défaut, Vercel servira l'API sur `http://localhost:3000`.
Les routes sont les mêmes qu'en production :

```bash
# Setup (une seule fois)
curl -X POST http://localhost:3000/api/setup ...

# Login
curl -X POST http://localhost:3000/api/auth/login ...

# Me
curl -X GET http://localhost:3000/api/auth/me ...
```

## 🐛 Dépannage

### Erreur "SETUP_SECRET environment variable is not set"
→ Ajoutez la variable `SETUP_SECRET` dans Vercel Dashboard > Settings > Environment Variables

### Erreur "Unauthorized" lors du setup
→ Vérifiez que le token dans `Authorization: Bearer` correspond exactement à `SETUP_SECRET`

### Erreur "Root user already exists"
→ Normal ! Le root user a déjà été créé. La route `/api/setup` ne peut être utilisée qu'une seule fois.

### Erreur de connexion MongoDB
→ Vérifiez :
- Vos variables d'environnement MongoDB dans Vercel Dashboard et/ou `.env`
- Que votre IP est autorisée sur MongoDB Atlas (ou utilisez `0.0.0.0/0`)
- Que votre connection string est correcte

### Cold start lent
→ Normal pour les fonctions serverless. Les appels suivants seront plus rapides grâce au cache MongoDB.

## 📦 Technologies

- **Runtime** : Vercel Serverless Functions
- **Base de données** : MongoDB Atlas
- **ORM** : Mongoose
- **Language** : TypeScript

## 📝 Licence

[Votre licence ici]
