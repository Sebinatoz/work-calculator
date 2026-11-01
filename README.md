# ⏱️ Work Calculator (Calculateur d'Heures de Prestation)

[![CI](https://github.com/Sebinatoz/work-calculator/actions/workflows/ci.yml/badge.svg)](https://github.com/Sebinatoz/work-calculator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-brightgreen.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

Application dédiée, moderne et multiplateforme pour le calcul automatisé des heures de travail quotidiennes, la gestion des pauses, des heures supplémentaires, des heures négatives (déficit), des congés de récupération et du solde cumulé d'un mois sur l'autre.

Conçue pour remplacer efficacement le tableur Excel historique de suivi des prestations.

---

## ✨ Fonctionnalités Principales

* ⚡ **Saisie Ultra-Fluide :** Raccourcis de saisie intelligents (taper `8` donne `08:00`, `815` donne `08:15`, `1630` donne `16:30`) avec navigation directe par touche `Tab`.
* 📊 **Calculs Automatisés & Fiables :** 
  * Total travaillé = $(\text{Rentrée} - \text{Départ}) - \text{Pause}$
  * Détection automatique des **Heures Supp.** ($> \text{base}$) et des **Heures Négatives** ($< \text{base}$).
  * Décompte des **Heures de Récupération** prises.
* 🔄 **Report Automatique de Solde (Rollover) :** Le solde cumulé du mois précédent est automatiquement transmis au mois suivant.
* 🇧🇪 **Jours Fériés Intégrés :** Calcul algorithmique automatique des jours fériés légaux belges (Pâques, Ascension, Pentecôte, Fête nationale, etc.) et français.
* ⚙️ **100% Personnalisable :**
  * Base journalière modifiable (8h par défaut, 7h30, 7h, etc.).
  * Pays au choix (Belgique, France, Luxembourg, Personnalisé).
  * Menus déroulants de chantiers et d'absences éditables.
  * Nom du collaborateur personnalisable.
* 📄 **Exports Professionnels :**
  * **Export Excel / CSV :** Compatible ligne pour ligne avec l'ancien modèle Excel de Didier.
  * **Export / Impression PDF :** Mise en page soignée au format A4 avec zones d'émargement et signature collaborateur / employeur.
* 💾 **Sécurité & Portabilité :** Stockage local automatique (Offline-First) + sauvegarde et restauration complète au format JSON.

---

## 🚀 Démarrage Immédiat

### Méthode 1 : Zéro Installation (Recommandée pour un test immédiat)
Double-cliquez simplement sur le fichier **[`index.html`](index.html)** dans votre explorateur de fichiers. L'application se lance immédiatement dans votre navigateur par défaut sans aucun serveur requis !

### Méthode 2 : Environnement de Développement Vite
```bash
# Installer les dépendances
npm install

# Démarrer le serveur local
npm run dev

# Lancer les tests unitaires
npm test
```

---

## 📐 Documentation Complète

Le dossier [`docs/`](docs/) contient toute la documentation technique et fonctionnelle :

* 🏛️ **[Architecture & Conception](docs/ARCHITECTURE.md)** : Découpage technique, flux de données, modèles de domaine.
* 📏 **[Spécifications & Formules](docs/SPECIFICATIONS.md)** : Règles de calcul détaillées des heures sup, négatives et soldes.
* 📖 **[Guide Utilisateur](docs/USER_GUIDE.md)** : Mode d'emploi pas-à-pas pour le collaborateur et le responsable.
* 💻 **[Guide Développeur](docs/DEVELOPER_GUIDE.md)** : Instructions pour étendre le code, lancer les tests et compiler pour Windows/Mac/Linux.

---

## 🛠️ Stack Technique

* **Langage :** TypeScript 5.3 (Typage strict, ESLint compatible)
* **Design :** Tailwind CSS avec thème sombre/clair
* **Tests :** Vitest
* **Build :** Vite 5
* **Desktop Natif :** Compatible Tauri (binaire autonome < 20 Mo)

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
