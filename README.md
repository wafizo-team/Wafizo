# Wafizo

Plateforme SaaS de gestion d'avis Google pour les commerçants indépendants français.

## Stack technique

| Couche | Technologie |
|---|---|
| API | NestJS (Node 22, TypeScript) |
| Web app | React + Vite (TypeScript) |
| Landing | React + Vite |
| Types partagés | `packages/shared` (source de vérité) |
| Infra | Terraform + Ansible |
| CI | GitHub Actions |

## Structure du monorepo
Wafizo/
├── apps/
│ ├── api/ # Backend NestJS
│ ├── web/ # Frontend React (app authentifiée)
│ └── landing/ # Site vitrine
├── packages/
│ └── shared/ # Types, enums, DTOs — source de vérité
├── infra/ # Terraform + Ansible
├── .github/
│ └── workflows/ # CI GitHub Actions
├── tsconfig.base.json
├── eslint.config.js
└── .prettierrc
## Prérequis

- Node.js >= 22
- pnpm >= 9

## Installation

```bash
git clone git@github.com:<org>/wafizo.git
cd wafizo
pnpm install
```

## Commandes disponibles

```bash
# Linting (tout le monorepo)
pnpm lint
pnpm lint:fix

# Formatage
pnpm format
pnpm format:check

# Vérification des types
pnpm typecheck

# Build
pnpm build
```

## Conventions d'équipe

### Branches et PR

- `main` est protégée — aucun push direct autorisé
- **1 issue = 1 branche = 1 PR**
- Nommage des branches : `type/description-courte`
  - `feat/google-oauth`
  - `fix/review-sync-error`
  - `chore/update-dependencies`
- Toute PR vers `main` requiert : **1 review approuvée + CI verte**

### Commits

Format [Conventional Commits](https://www.conventionalcommits.org/) :

feat: ajouter l'authentification Google OAuth
fix: corriger la synchronisation des avis
chore: mettre à jour les dépendances
ci: améliorer le workflow GitHub Actions
docs: mettre à jour le README
### Contrat d'API

> **`packages/shared` est la source de vérité.**

Tout nouveau endpoint suit ce processus :
1. Définir les types/DTOs dans `packages/shared`
2. Faire valider le contrat par l'équipe (PR dédiée)
3. Implémenter côté API (`apps/api`)
4. Implémenter côté Web (`apps/web`)

Ne jamais définir un type métier directement dans `apps/api` ou `apps/web`.

## Base de données locale (dev)

Le développement local utilise PostgreSQL 16 et Redis 7 via Docker Compose.

### Prérequis

Docker et Docker Compose installés. Pour utiliser Docker sans `sudo` (à faire une fois) :

```bash
sudo usermod -aG docker $USER
```

Puis se déconnecter/reconnecter à la session pour appliquer le changement.

### Démarrer / arrêter

```bash
pnpm db:up      # démarre PostgreSQL + Redis en arrière-plan
pnpm db:down    # arrête les conteneurs (les données sont conservées)
pnpm db:logs    # affiche les logs des conteneurs
pnpm db:reset   # ⚠️ détruit les données et repart d'une base vierge
```

### Configuration

Copier le modèle d'environnement et l'adapter si besoin :

```bash
cp .env.example .env
```

Valeurs de connexion en local :
- PostgreSQL : `postgresql://wafizo:wafizo@localhost:5432/wafizo_dev`
- Redis : `redis://localhost:6379`

Le fichier `.env` n'est jamais commité (il est dans `.gitignore`). Seul `.env.example` sert de modèle partagé.
