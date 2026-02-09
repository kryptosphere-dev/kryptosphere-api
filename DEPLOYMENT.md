# Guide de déploiement sur Vercel

## 📋 Prérequis

- Compte Vercel (gratuit)
- Compte MongoDB Atlas (gratuit)
- Node.js installé localement (pour les tests)

## 🚀 Étapes de déploiement

### 1. Installer les dépendances

```bash
npm install
```

### 2. Préparer MongoDB Atlas

1. Créez un cluster MongoDB Atlas (gratuit)
2. Créez un utilisateur de base de données
3. Configurez les IPs autorisées (ou `0.0.0.0/0` pour toutes les IPs)
4. Récupérez votre connection string

### 3. Configurer les variables d'environnement sur Vercel

Dans le dashboard Vercel, allez dans **Settings > Environment Variables** et ajoutez :

#### Variables obligatoires :

- `MONGODB_URI` : Votre URI MongoDB Atlas complète
  - Exemple : `mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority`
  - OU utilisez les variables séparées ci-dessous

#### Variables optionnelles (si vous n'utilisez pas MONGODB_URI complète) :

- `MONGODB_USER` : Nom d'utilisateur MongoDB
- `MONGODB_PWD` : Mot de passe MongoDB
- `MONGODB_DB` : Nom de la base de données

#### Variable de sécurité pour le setup :

- `SETUP_SECRET` : **Générez un token secret fort** (ex: `openssl rand -hex 32`)
  - Ce token sera requis pour créer le root user
  - ⚠️ **IMPORTANT** : Gardez ce token secret et ne le partagez pas

### 4. Déployer sur Vercel

#### Option A : Via GitHub (recommandé)

1. Poussez votre code sur GitHub
2. Allez sur [vercel.com](https://vercel.com)
3. Cliquez sur **Add New Project**
4. Importez votre repository GitHub
5. Vercel détectera automatiquement la configuration
6. Cliquez sur **Deploy**

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Pour la production
vercel --prod
```

### 5. Initialiser le root user (⚠️ Sécurisé)

Après le déploiement, vous devez créer le root user **une seule fois**.

#### Méthode 1 : Avec curl

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

#### Méthode 2 : Avec le body

```bash
curl -X POST https://votre-domaine.vercel.app/api/setup \
  -H "Content-Type: application/json" \
  -d '{
    "setupSecret": "VOTRE_SETUP_SECRET",
    "login": "root",
    "password": "VOTRE_MOT_DE_PASSE_SECURISE",
    "email": "admin@votre-domaine.com",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

#### Méthode 3 : Avec Postman / Insomnia

- **URL** : `POST https://votre-domaine.vercel.app/api/setup`
- **Headers** : 
  - `Content-Type: application/json`
  - `Authorization: Bearer VOTRE_SETUP_SECRET`
- **Body** (JSON) :
```json
{
  "login": "root",
  "password": "VOTRE_MOT_DE_PASSE_SECURISE",
  "email": "admin@votre-domaine.com",
  "firstName": "Admin",
  "lastName": "User"
}
```

⚠️ **Sécurité** :
- Le root user ne peut être créé **qu'une seule fois**
- Vous devez fournir le `SETUP_SECRET` dans le header `Authorization: Bearer` ou dans le body
- Après création, la route retournera une erreur 403 si vous essayez de recréer le root user

### 6. Tester l'API

#### Login

```bash
curl -X POST https://votre-domaine.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "root",
    "password": "VOTRE_MOT_DE_PASSE"
  }'
```

Réponse :
```json
{
  "session": "SESSION_ID"
}
```

#### Récupérer l'utilisateur connecté

```bash
curl -X GET https://votre-domaine.vercel.app/api/auth/me \
  -H "Authorization: Bearer SESSION_ID"
```

## 🔒 Sécurité

### Variables d'environnement sensibles

- `SETUP_SECRET` : Ne jamais commiter dans Git
- `MONGODB_URI` / `MONGODB_PWD` : Ne jamais commiter dans Git

### Bonnes pratiques

1. ✅ Utilisez des mots de passe forts pour le root user
2. ✅ Changez le mot de passe root après la première connexion
3. ✅ Ne partagez jamais le `SETUP_SECRET`
4. ✅ Limitez les IPs autorisées sur MongoDB Atlas si possible
5. ✅ Utilisez HTTPS (automatique avec Vercel)

## 📝 Routes disponibles

- `POST /api/auth/login` - Authentification
- `GET /api/auth/me` - Récupérer l'utilisateur connecté (nécessite session)
- `POST /api/board` - Créer un board (nécessite SuperAdmin + session)
- `POST /api/setup` - Initialiser le root user (une seule fois, nécessite SETUP_SECRET)

## 🐛 Dépannage

### Erreur "SETUP_SECRET environment variable is not set"
→ Ajoutez la variable `SETUP_SECRET` dans Vercel Dashboard > Settings > Environment Variables

### Erreur "Unauthorized" lors du setup
→ Vérifiez que le token dans `Authorization: Bearer` correspond à `SETUP_SECRET`

### Erreur "Root user already exists"
→ Le root user a déjà été créé. C'est normal, la route ne peut être utilisée qu'une fois.

### Erreur de connexion MongoDB
→ Vérifiez vos variables d'environnement MongoDB dans Vercel Dashboard

### Cold start lent
→ Normal pour les fonctions serverless. Les appels suivants seront plus rapides grâce au cache MongoDB.

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
