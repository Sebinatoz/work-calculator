# Règles Git & Workflow du Projet (Work Calculator)

## 🚨 Règle d'or absolue : PROTECTION DE `main`
- **INTERDICTION STRICTE DE COMMITER DIRECTEMENT SUR `main`**.
- La branche principale de développement actif est **`dev`**.
- Toute modification ou nouvelle fonctionnalité doit être réalisée sur `dev` ou sur une branche dédiée (`feature/...`, `fix/...`), puis fusionnée via Pull Request ou merge contrôlé.

## 🌿 Stratégie des Branches (Git Flow simplifié)
1. **`main`** : Branche de production / version stable uniquement. Jamais de commit direct.
2. **`dev`** : Branche d'intégration active de tous les développements.
3. **`feature/<nom>`** : Branche pour une nouvelle fonctionnalité (ex: `feature/export-excel`).
4. **`fix/<nom>`** : Branche pour corriger un bogue (ex: `fix/calcul-heures-supp`).
5. **`docs/<nom>`** : Branche pour documentation spécifique.

## ✍️ Bonnes Pratiques de Commit (Conventional Commits)
Chaque message de commit doit être clair, concis et préfixé par un type standardisé :
- `feat: ...` : Nouvelle fonctionnalité visible pour l'utilisateur.
- `fix: ...` : Correction d'un bug.
- `docs: ...` : Modification de documentation (README, guides, etc.).
- `style: ...` : Mise en page, cosmétique CSS, sans changement de logique métier.
- `refactor: ...` : Amélioration du code sans modifier le comportement existant.
- `test: ...` : Ajout ou correction de tests.
- `chore: ...` : Tâches de maintenance (dépendances, configuration de build, hooks).

## 🚀 Processus de Release Multiplateforme Obligatoire
À chaque modification ou correction :
1. Incrémenter la version dans `package.json` (ex: `1.1.0` -> `1.1.1`).
2. Valider les tests unitaires (`npm test`) et compiler (`npm run build`).
3. Compiler les exécutables Windows en local (`npm run dist:win`) dans le dossier `release/` pour disponibilité immédiate.
4. Intégrer les modifications dans `main` (merge contrôlé depuis `dev`).
5. Créer et pousser le tag Git `vX.Y.Z` (`git tag -a vX.Y.Z -m "..." && git push origin vX.Y.Z`).
6. Le workflow GitHub Actions (`release.yml`) compile automatiquement sur les runners natifs Windows, macOS et Linux (`.exe`, `.dmg`, `.zip`, `.AppImage`, `.deb`) et publie la Release GitHub officielle.
7. Revenir systématiquement sur la branche `dev` (`git checkout dev`).
