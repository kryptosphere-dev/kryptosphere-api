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

### Authentification

- **`POST /api/auth/login`**  
  - **But**: Authentifier un utilisateur, renvoyer un `session` ID.  
  - **Body**:
    ```json
    {
      "login": "admin",
      "password": "votre_mot_de_passe"
    }
    ```
  - **Réponse**:
    ```json
    { "session": "SESSION_ID_ICI" }
    ```

- **`GET /api/auth/me`**  
  - **But**: Récupérer l'utilisateur actuellement connecté.  
  - **Headers**:
    - `Authorization: Bearer SESSION_ID_ICI`
  - **Réponse**:
    ```json
    {
      "_id": "...",
      "login": "admin",
      "email": "...",
      "role": "SuperAdmin",
      "firstName": "...",
      "lastName": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```

### Board

- **`POST /api/board`**  
  - **But**: Créer un board (réservé au `SuperAdmin`).  
  - **Headers**:
    - `Authorization: Bearer SESSION_ID_ICI`
  - **Body**:
    ```json
    {
      "name": "Board 2025",
      "year": 2025,
      "type": "main_board" // ou "chapter_board"
    }
    ```
  - **Réponse** (200):
    ```json
    {
      "_id": "...",
      "name": "Board 2025",
      "year": 2025,
      "type": "main_board",
      "createdAt": "...",
      "updatedAt": "..."
    }
    ```

### Setup (création du root user)

- **`POST /api/setup`**  
  - **But**: Créer l'utilisateur root (`SuperAdmin`), **une seule fois**.  
  - **Headers ou body**:
    - `setupSecret` doit correspondre à la variable d'env `SETUP_SECRET`
  - **Body exemple**:
    ```json
    {
      "setupSecret": "VOTRE_SETUP_SECRET",
      "login": "root",
      "password": "VOTRE_MOT_DE_PASSE_SECURISE",
      "email": "admin@votre-domaine.com",
      "firstName": "Admin",
      "lastName": "User"
    }
    ```

### Healthcheck

- **`GET /api/health`**  
  - **But**: Vérifier que l'API et MongoDB répondent.  
  - **Réponse**:
    ```json
    {
      "status": "ok",
      "db": "up",
      "timestamp": "...",
      "uptime": 123.45,
      "responseTimeMs": 10
    }
    ```

### Images (Vercel Blob + Mongo) – intégration avec le website

Ces routes permettent au **website** de stocker et récupérer des images en centralisant la logique dans l’API.

#### 1. Upload d'une image

- **`POST /api/images`**  
  - **But**: Uploader une image vers Vercel Blob et stocker ses métadonnées dans MongoDB.  
  - **Auth**:  
    - **Obligatoire**: `Authorization: Bearer SESSION_ID_ICI` (seuls les utilisateurs authentifiés peuvent uploader).
  - **Content-Type**: `multipart/form-data`
  - **Champs attendus**:
    - `file`: `File` (obligatoire) – le fichier image
    - `key`: `string` (obligatoire) – identifiant unique connu par le website (ex: `"homepage-hero"`, `"about-banner"`)
    - `altText`: `string` (optionnel)
    - `description`: `string` (optionnel)
  - **Exemple (local)**:
    ```bash
    curl -X POST BASE_URL/api/images \
      -F "file=@img/image.png" \
      -F "key=homepage-hero" \
      -F "altText=Hero Kryptosphere" \
      -F "description=Image de hero de la home"
    ```
  - **Réponse** (201):
    ```json
    {
      "image": {
        "_id": "698b5eca89ff2c552ead1159",
        "key": "homepage-hero",
        "url": "https://...blob.vercel-storage.com/...",
        "altText": "Hero Kryptosphere",
        "description": "Image de hero de la home",
        "createdAt": "...",
        "updatedAt": "..."
      },
      "blob": {
        "url": "https://...blob.vercel-storage.com/..."
      }
    }
    ```

**Important (fonctionnement avec le website)** :

- Le **website choisit** la valeur de `key` au moment de l'upload (`homepage-hero`, `about-banner`, etc.).
- L'API stocke `key` + `url` Blob + métadonnées en base.
- Le website n’a **pas besoin de connaître le Mongo `_id`**, seulement le `key`.

#### 2. Récupérer une image par `key`

- **`GET /api/images?key=<KEY>`**  
  - **But**: Récupérer les métadonnées et l’URL d’une image à partir d’un `key` partagé avec le website.  
  - **Exemple**:
    ```bash
    curl "http://BASE_URL/api/images?key=homepage-hero"
    ```
  - **Réponse**:
    ```json
    {
      "image": {
        "_id": "698b5eca89ff2c552ead1159",
        "key": "homepage-hero",
        "url": "https://...blob.vercel-storage.com/...",
        "altText": "Hero Kryptosphere",
        "description": "Image de hero de la home",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
    ```

- **Utilisation côté website** (pattern A) :

  ```ts
  const res = await fetch(`${API_BASE_URL}/api/images?key=homepage-hero`);
  const { image } = await res.json();

  // Exemple React / Next.js
  <img src={image.url} alt={image.altText ?? ""} />
  ```

#### 3. Lister des images (optionnel)

- **`GET /api/images?limit=20`**  
  - **But**: Récupérer une liste d’images (par défaut 50, max 200).  
  - **Réponse**:
    ```json
    {
      "images": [
        { "_id": "...", "key": "homepage-hero", "url": "https://...", ... },
        { "_id": "...", "key": "about-banner", "url": "https://...", ... }
      ]
    }
    ```


## 🛠️ Développement local (avec `npx vercel dev`)

En local, on utilise **exactement le même code** que sur Vercel, via le CLI Vercel, en lançant manuellement `npx vercel dev`.

```bash
# Installer les dépendances
npm install

# Créer un fichier .env avec vos variables
cp env.example .env
# Éditer .env avec vos valeurs

# Lancer l'API en local (mêmes routes qu'en prod)
npx vercel dev
```

Au **premier lancement**, `npx vercel dev` va :
- télécharger le CLI Vercel (`vercel@...`) si besoin
- te demander de te connecter (`Visit vercel.com/device and enter XXXXX-XXXXX`)
- tu dois te connecter avec le compte **contact.kryptosphere@gmail.com**

Aux lancements suivants, il réutilisera cette configuration (plus besoin de se reconnecter).

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

