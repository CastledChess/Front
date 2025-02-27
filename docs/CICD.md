# Intégration Continue (CI) du Dépôt Front

## Vue d'ensemble


Le dépôt Front utilise GitHub Actions pour l'intégration continue, permettant d'automatiser les tests et les builds à chaque modification du code. Cette documentation détaille la configuration et le fonctionnement de la CI pour le dépôt Front.

## Configuration de la CI

### Fichier de configuration principal

La CI est configurée dans le fichier `.github/workflows/build.yml`.

## Déclencheurs

La CI est déclenchée dans les cas suivants :

1. **Push** sur les branches :

   - `main` (production)

   - `staging` (pré-production)

   - `develop` (développement)

   - Branches de correction (`fix/**`)

   - Branches de correction urgente (`hotfix/**`)

2. **Pull Requests** vers les branches :

   - `main`

   - `staging`

   - `develop`

   - Branches de correction (`fix/**`)

   - Branches de correction urgente (`hotfix/**`)

   - Branches de fonctionnalités (`feat/**`)

## Étapes du workflow

Le workflow de CI exécute les étapes suivantes :

1. **Checkout du code** : Récupération du code source du dépôt

2. **Mise en cache** : Configuration du cache pour les modules Node.js et le build Vite

   - Optimise les performances en évitant de télécharger les dépendances à chaque exécution

   - Utilise un système de clés basé sur le contenu des fichiers pour invalider le cache si nécessaire

3. **Configuration de Node.js** : Installation de Node.js v20.x

4. **Installation des dépendances** : Exécution de `npm ci` pour installer les dépendances exactes du projet

5. **Build du projet** : Exécution de `npm run build` pour vérifier que le projet peut être compilé sans erreur

6. **Tests** : Exécution des tests avec `npm test` (si présents)

## Mirroring du dépôt

En plus de la CI, le dépôt Front est configuré pour être synchronisé avec un dépôt privé via le workflow `.github/workflows/mirror.yml`.

Ce workflow est déclenché pour tous les push et pull requests sur toutes les branches, et synchronise le dépôt avec un miroir privé.

## Validation locale avant commit

Le dépôt utilise également Husky pour exécuter des hooks Git localement avant les commits :

```sh
# .husky/pre-commit
# On vérifie les fichiers modifiés avant et après l'exécution d
MODIFIED_FILES_BEFORE=$(git diff --name-only)

# On exécute le linter et le formateur de code
# npm run lint -> temporarily removed
npm run format
```

Ce hook pré-commit s'assure que le code est correctement formaté avant d'être commité, en utilisant les règles définies dans `.prettierrc`.

## Intégration avec le workflow Gitflow

## Environnement de développement

Le projet utilise un fichier `.env` pour la configuration (basé sur `.env.example`), qui définit notamment l'URL de l'API :

## Gestion des problèmes

Le dépôt utilise des templates d'issues GitHub pour standardiser les rapports de bugs, demandes de fonctionnalités et autres tâches :

- Bug reports

- Feature requests

- Chores

- Refactoring

- Improvements

- Typo fixes

- Style changes

Ces templates facilitent le suivi des problèmes et leur intégration dans le workflow de développement.
