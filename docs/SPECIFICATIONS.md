# Spécifications Fonctionnelles & Règles de Calcul

Ce document consigne l'ensemble des règles métier et des formules de calcul implémentées dans **Work Calculator**, basées sur la feuille de prestation originale et les exigences formulées.

---

## 1. Données d'Entrée Utilisateur

Pour chaque journée du mois ($J_1 \dots J_N$) :

| Champ | Format | Description | Exemple |
| :--- | :--- | :--- | :--- |
| **Départ** | `HH:MM` | Heure de prise de poste | `08:00` |
| **Rentrée** | `HH:MM` | Heure de fin de poste | `16:30` |
| **Pause repas** | `HH:MM` | Durée déduite pour le repas | `00:30` |
| **H à récupérer** | `HH:MM` | Heures de récupération posées sur ce jour | `02:00` |
| **Chantier / Type** | Texte | Chantier d'intervention ou type d'absence | `Chantier A`, `Congé`, `Férié` |

---

## 2. Formules de Calcul Journalières

Soit $B$ la durée de la base journalière normale configurée dans les paramètres de l'application (par défaut $B = 8\text{ h} = 480\text{ minutes}$).

### 2.1. Temps total presté ($T$)
$$T = \max\Big(0,\; (\text{Rentrée} - \text{Départ}) - \text{Pause}\Big)$$

* Si $\text{Rentrée} \le \text{Départ}$, $T = 0$.
* Si la journée n'est pas travaillée (week-end, congé complet sans pointage horaire), $T = 0$.

### 2.2. Heures supplémentaires ($H_{\text{sup}}$)
Les heures supplémentaires représentent le temps travaillé **au-delà** de la base journalière :
$$H_{\text{sup}} = \begin{cases}
T - B & \text{si } T > B \\
0 & \text{sinon}
\end{cases}$$

### 2.3. Heures négatives ($H_{\text{nég}}$)
Les heures négatives représentent le **déficit** de temps travaillé par rapport à la base lorsque le collaborateur a presté une journée incomplète :
$$H_{\text{nég}} = \begin{cases}
B - T & \text{si } 0 < T < B \\
0 & \text{sinon (journée non travaillée ou } T \ge B)
\end{cases}$$

### 2.4. Heures à récupérer ($H_{\text{récup}}$)
* Saisie libre représentant le volume d'heures de repos compensateur ou de récupération prélevé sur le solde d'heures du collaborateur.
* Se cumule sur le mois et vient directement réduire le solde cumulé.

---

## 3. Synthèse Mensuelle et Solde Reporté

Pour un mois donné comportant $N$ jours :

### 3.1. Totaux bruts
$$\text{Total presté} = \sum_{i=1}^N T_i$$
$$\text{Total } H_{\text{sup}} = \sum_{i=1}^N H_{\text{sup}, i}$$
$$\text{Total } H_{\text{nég}} = \sum_{i=1}^N H_{\text{nég}, i}$$
$$\text{Total } H_{\text{récup}} = \sum_{i=1}^N H_{\text{récup}, i}$$

### 3.2. Solde net du mois ($\Delta_{\text{mois}}$)
$$\Delta_{\text{mois}} = \text{Total } H_{\text{sup}} - \text{Total } H_{\text{nég}} - \text{Total } H_{\text{récup}}$$

### 3.3. Solde cumulé total ($S_{\text{cumul}}$)
Soit $S_{\text{préc}}$ le solde reporté du mois précédent :
$$S_{\text{cumul}} = S_{\text{préc}} + \Delta_{\text{mois}}$$

* Si $S_{\text{cumul}} > 0$ : Le collaborateur dispose d'un **crédit d'heures** à récupérer ou à se faire indemniser.
* Si $S_{\text{cumul}} < 0$ : Le collaborateur présente un **déficit d'heures** à régulariser.

---

## 4. Moteur des Jours Fériés

Le calcul des jours fériés s'effectue dynamiquement en fonction du pays paramétré :

### Belgique (`BE`)
* **Jours fixes :** 1er janvier (Nouvel An), 1er mai (Fête du Travail), 21 juillet (Fête nationale), 15 août (Assomption), 1er novembre (Toussaint), 11 novembre (Armistice 1918), 25 décembre (Noël).
* **Fêtes mobiles :** Calculées selon l'algorithme grégorien de Butcher-Meeus :
  * Lundi de Pâques = $\text{Pâques} + 1\text{ jour}$
  * Ascension = $\text{Pâques} + 39\text{ jours}$
  * Lundi de Pentecôte = $\text{Pâques} + 50\text{ jours}$

### Personnalisation
L'utilisateur peut basculer sur la France, le Luxembourg ou insérer des dates personnalisées (ex. ponts d'entreprise, fête patronale de la Saint-Éloi).
