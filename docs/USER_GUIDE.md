# Guide Utilisateur - Work Calculator

Bienvenue dans le guide d'utilisation de **Work Calculator**, votre application dédiée au suivi et au calcul des heures de prestation.

---

## 1. Démarrage Rapide

1. Ouvrez simplement le fichier `index.html` dans votre navigateur habituel (Chrome, Edge, Firefox, Safari) ou lancez l'application de bureau si elle est installée.
2. Choisissez le **Mois** et l'**Année** en haut au centre de l'écran.
3. Renseignez vos heures pour les jours travaillés.

---

## 2. Double Mode de Saisie des Heures (Au Choix)

Chaque cellule d'heure (**Départ**, **Rentrée**, **Pause**, **H Récup**) offre désormais une double possibilité selon votre préférence :

### Option A : Sélection dans la liste déroulante (sans taper)
* Cliquez sur la **petite flèche `▼`** située à droite de la case (ou cliquez/double-cliquez directement dans la case).
* Le menu déroulant s'ouvre avec les créneaux par pas de 15 minutes (identiques à l'Excel d'origine) :
  * **Départ :** de `06:00` à `18:00`
  * **Rentrée :** de `12:00` à `20:00`
  * **Pause repas :** de `00:00` à `02:00`
  * **H Récupérer :** de `00:30` à `08:00`
* Cliquez sur l'heure désirée : le calcul s'actualise immédiatement !

### Option B : Saisie ultra-rapide au clavier
Si vous préférez taper au clavier ou indiquer une heure précise (ex. `07:52`) :
* Tapez `8` puis `Tab` $\rightarrow$ l'application écrit automatiquement **08:00**.
* Tapez `815` puis `Tab` $\rightarrow$ l'application écrit automatiquement **08:15**.
* Tapez `752` puis `Tab` $\rightarrow$ l'application écrit automatiquement **07:52**.
* Tapez `1630` puis `Tab` $\rightarrow$ l'application écrit automatiquement **16:30**.
* La touche **Tabulation** vous fait passer directement à la case suivante.
* La touche **Entrée** valide la saisie de la cellule active.

### Boutons d'Action Rapide
* **⚡ (éclair à droite d'une ligne) :** Remplit en un clic la journée avec l'horaire standard (ex. `08:00 - 16:30` avec `00:30` de pause).
* **Bouton « Semaine type » (en haut) :** Remplit automatiquement du lundi au vendredi les journées vides du mois avec vos horaires de base.

---

## 3. Comprendre les Indicateurs (KPI)

En haut de votre feuille de travail, six cartes récapitulatives vous donnent une vision immédiate :
1. **Heures Travaillées :** Volume d'heures réelles effectuées sur le mois et nombre de jours prestés.
2. **Heures Sup (+) :** Tout dépassement au-delà de votre base (8h par jour par défaut).
3. **Heures Négatives (-) :** Déficit si vous quittez plus tôt que votre base.
4. **Récupérations prises :** Heures de congé de récupération décomptées ce mois-ci.
5. **Solde Mois Précédent :** Report automatique de votre solde du mois d'avant. Vous pouvez le corriger manuellement si besoin.
6. **Solde Cumulé Total :**
   * **En Vert** : Vous êtes en crédit d'heures.
   * **En Orange** : Vous êtes en débit d'heures.
   * **En Blanc** : Solde parfaitement équilibré.

---

## 4. Exports et Impression

### 4.1. Export Excel / CSV
* Cliquez sur **« Export Excel/CSV »** en haut à droite.
* Le fichier téléchargé respecte exactement la structure et les libellés de l'ancien fichier Excel de Didier.

### 4.2. Impression ou Enregistrement PDF
* Cliquez sur **« Imprimer / PDF »**.
* L'application prépare une page au format A4 noir & blanc professionnelle contenant :
  * Le titre officiel du relevé avec le nom du collaborateur.
  * La grille propre sans les menus déroulants et boutons d'action.
  * Deux encadrés en bas de page pour la signature du collaborateur et la validation du responsable.
* Choisissez votre imprimante ou **« Enregistrer au format PDF »**.

---

## 5. Personnalisation (Icône Engrenage ⚙️)

Cliquez sur l'engrenage en haut à droite pour accéder aux réglages :
* **Nom du collaborateur :** Modifiez « Didier » par n'importe quel autre nom.
* **Base journalière :** Modifiez les 8h00 par 7h30, 7h00, etc.
* **Pays des jours fériés :** Belgique, France, Luxembourg, ou Personnalisé.
* **Listes des Chantiers et des Absences :** Ajoutez ou retirez des éléments séparés par une virgule pour adapter les menus déroulants.
* **Sauvegarde & Restauration (.json) :** Téléchargez une copie intégrale de toutes vos données pour les transférer sur un autre ordinateur.
