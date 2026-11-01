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
