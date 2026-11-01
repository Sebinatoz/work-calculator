# Guide Développeur - Work Calculator

Ce guide s'adresse aux développeurs souhaitant contribuer au projet, lancer les tests unitaires, ou compiler les exécutables natifs pour Windows, macOS et Linux.

---

## 1. Prérequis

* **Node.js** : version 18.x ou 20.x LTS recommandée.
* **npm**, **pnpm** ou **yarn**.
* **Git** pour la gestion de version.
* *(Optionnel pour build desktop natif)* : Rust et Cargo pour Tauri.

---

## 2. Installation et Lancement Local

```bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd "Work Calculator"

# Installer les dépendances
npm install

# Démarrer le serveur de développement Vite
npm run dev
```

L'application s'ouvre automatiquement sur `http://localhost:3000`.

---

## 3. Exécution des Tests Unitaires

Le projet s'appuie sur **Vitest** pour valider l'intégrité mathématique des calculs d'heures, la gestion des jours fériés et le report de solde.

```bash
# Lancer les tests une fois
npm test

# Lancer les tests en mode écoute continue (watch)
npx vitest
```

---

## 4. Vérification des Types & Linting

```bash
# Vérification TypeScript stricte
npx tsc --noEmit
```

---

## 5. Construction pour la Production

```bash
npm run build
```
Les fichiers statiques optimisés sont générés dans le dossier `dist/`.

---

## 6. Packaging Desktop Natif (Windows, Mac, Linux) via Tauri

Pour générer des binaires autonomes (`.exe`, `.dmg`, `.AppImage`) :

```bash
# 1. Initialiser Tauri si non fait
npx @tauri-apps/cli init

# 2. Compiler pour votre système actuel
npx @tauri-apps/cli build
```

Les installateurs produits sont déposés dans `src-tauri/target/release/bundle/`.

---

## 7. Convention de Commits & Bonnes Pratiques

Le projet suit la convention **Conventional Commits** :
* `feat:` Nouvelle fonctionnalité
* `fix:` Correction d'un bogue
* `test:` Ajout ou mise à jour de tests unitaires
* `docs:` Modification de la documentation
* `refactor:` Refactorisation sans changement de comportement
* `style:` Ajustements d'interface ou de formatage
