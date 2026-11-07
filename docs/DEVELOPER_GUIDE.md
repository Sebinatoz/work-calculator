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

## 6. Packaging Desktop Multiplateforme (Windows, Mac, Linux)

L'application intègre un packaging desktop natif complet via **Electron & Electron-Builder**, avec icônes haute résolution et raccourcis configurés.

### Formats générés par plateforme :
* 🪟 **Windows** : 
  * `Work Calculator Setup 1.0.0.exe` (Installateur NSIS avec raccourcis Bureau et Menu Démarrer)
  * `Work Calculator 1.0.0.exe` (Version portable autonome, zéro installation requise)
* 🍏 **macOS** :
  * `Work Calculator-1.0.0.dmg` (Image disque standard Apple avec glisser-déposer vers `Applications`)
  * `Work Calculator-1.0.0-mac.zip` (Binaires universels Apple Silicon M1/M2/M3 et Intel x64)
* 🐧 **Linux** :
  * `Work Calculator-1.0.0.AppImage` (Exécutable portable autonome tous Linux)
  * `work-calculator_1.0.0_amd64.deb` (Paquet d'installation Debian / Ubuntu / Linux Mint)

### Commandes de compilation locale :

```bash
# Compiler l'exécutable Windows (.exe installateur et portable)
npm run dist:win

# Compiler pour macOS (nécessite un environnement macOS)
npm run dist:mac

# Compiler pour Linux (nécessite un environnement Linux)
npm run dist:linux
```

Les exécutables générés sont automatiquement déposés dans le dossier `release/`.

### 🚀 Compilation Multiplateforme Automatisée (GitHub Actions CI/CD)

Conformément aux règles de l'art, les environnements macOS (SDK Apple/Darwin) et Linux (système de fichiers POSIX et WebKitGTK) nécessitent leur système natif respectif pour être compilés et packagés proprement.

Le pipeline CI/CD [`.github/workflows/release.yml`](../.github/workflows/release.yml) orchestre la compilation croisée sur matrice :
1. **Déclenchement automatique :** Lors de la création d'un tag git (ex: `git tag v1.0.0 && git push origin v1.0.0`).
2. **Déclenchement manuel (Workflow Dispatch) :** Depuis l'onglet *Actions* de GitHub, sélectionner *Release Desktop Multiplateforme* puis cliquer sur **Run workflow**.
3. Les 3 environnements (`windows-latest`, `macos-latest`, `ubuntu-latest`) compilent en parallèle et publient automatiquement les binaires prêts à télécharger sur la page des Releases GitHub.

---

## 7. Convention de Commits & Bonnes Pratiques

Le projet suit la convention **Conventional Commits** :
* `feat:` Nouvelle fonctionnalité
* `fix:` Correction d'un bogue
* `test:` Ajout ou mise à jour de tests unitaires
* `docs:` Modification de la documentation
* `refactor:` Refactorisation sans changement de comportement
* `style:` Ajustements d'interface ou de formatage
