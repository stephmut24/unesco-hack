---

# DOCUMENT : `SENIOR_UIUX_SPECIFICATION.md`
**Projet :** Media Compass (UNESCO Hackathon 2026)  
**Expertise :** UI/UX Specifications Senior (Visual Interface & Interaction Architect)  
**Statut :** V1 - DESIGN SYSTÈME & PARCOURS DÉTAILLÉ

---

## 1. PHILOSOPHIE DE DESIGN : "LA BOUSSOLE ÉTHIQUE"
*   **Approche :** Mobile-First (90% des jeunes en RDC utilisent un smartphone).
*   **Style Visuel :** "Clean, Trustworthy & Energetic". Un mélange de professionnalisme (UNESCO) et d'énergie (Jeunesse).
*   **Accessibilité (a11y) :** Contrastes élevés, textes lisibles, icônes explicites. Support du mode "Low Data" (images légères).

---

## 2. CHARTE GRAPHIQUE & DESIGN SYSTEM
### 2.1 Palette de Couleurs (Sémantique)
*   **Bleu Boussole (#1D4ED8 - Blue 700) :** Couleur principale (Confiance, UNESCO).
*   **Vert Transmission (#10B981 - Emerald 500) :** Succès, contenu sain.
*   **Jaune Alerte (#F59E0B - Amber 500) :** Prudence, explications de l'IA.
*   **Rouge Risque (#EF4444 - Red 500) :** Danger, contenu malveillant.
*   **Fond (#F9FAFB) :** Gris très clair pour réduire la fatigue visuelle.

### 2.2 Typographie
*   **Titres :** *Inter Bold* (Moderne et robuste).
*   **Corps de texte :** *Inter Regular* (Lisibilité maximale sur petit écran).
*   **Langues :** Système de bascule rapide (FR / LN / SW) en haut à droite.

---

## 3. PARCOURS UTILISATEUR & ÉCRANS (WIREFRÈMES DESCRIPTIFS)

### ÉCRAN 1 : L'ENTRÉE (L'IMMERSION)
*   **Header :** Logo Media Compass + Menu Langue.
*   **Zone Centrale :** Un grand champ de saisie arrondi.
    *   *Texte d'incitation :* "Colle un lien, un texte ou partage une capture d'écran WhatsApp..."
*   **Bouton d'Action :** "Lancer la Boussole" (Bouton large, bleu, avec icône de boussole).
*   **Footer :** "Inspiré par le cadre de la Transmission Humaine™".

### ÉCRAN 2 : L'ANALYSE FLASH (IA EN ACTION)
*   **Visuel :** Une barre de progression élégante (Skeleton Loader).
*   **Animation :** Des "étincelles" d'IA apparaissent :
    *   "Analyse du domaine..."
    *   "Recherche de preuves..."
    *   "Vérification des métadonnées..."
*   **Objectif :** Créer une attente positive et montrer que l'IA travaille sérieusement.

### ÉCRAN 3 : LA CO-ANALYSE (LE CŒUR RESPONSABLE)
Cet écran est divisé en cartes (une pour chaque dimension).
*   **Composant Carte Dimension :**
    *   **Titre :** ex: "SOURCE : C'est qui le chef ?"
    *   **Avis de l'IA :** Une bulle jaune : *"L'IA pense que c'est Douteux car le domaine est très récent."*
    *   **Bouton Explicabilité :** "Pourquoi ?" (Ouvre une mini-liste technique : DNS récent, pas de SSL).
    *   **Action Utilisateur :** Deux boutons : [Je confirme l'IA] ou [Je modifie l'avis].
*   **Interaction :** L'utilisateur défile verticalement pour les 5 dimensions.

### ÉCRAN 4 : LA RÉFLEXION (LE TEST DU MILLIER)
*   **Style :** Fond bleu nuit, texte blanc pour marquer la solennité.
*   **Question :** "Si 10 000 jeunes en RDC partagent ce contenu maintenant, qu'apprend la société ?"
*   **Champ :** Zone de texte libre (obligatoire).
*   **Bouton :** "Voir le Verdict Final".

### ÉCRAN 5 : LE VERDICT & DÉCISION
*   **Score Global :** Une jauge colorée (Vert à Rouge).
*   **Synthèse :** "Verdict : Prudence recommandée."
*   **Actions Responsables :**
    *   [Supprimer le contenu] (Bouton rouge).
    *   [Vérifier sur PesaCheck] (Lien externe).
    *   [Partager ma réflexion] (Pour sensibiliser les autres).

---

## 4. COMPOSANTS CLÉS (POUR v0.dev / SHADCN)
1.  **`AnalysisCard` :** Utilise `Card`, `Badge` (pour le niveau de confiance) et `Accordion` (pour l'explicabilité technique).
2.  **`ResponseInput` :** `Textarea` avec compteur de caractères.
3.  **`ProgressCompass` :** Une jauge radiale personnalisée montrant l'équilibre entre l'IA et l'Humain.

---

## 5. ACCESSIBILITÉ & INCLUSION (UNESCO COMPLIANT)
*   **Lecteurs d'écran :** Tous les indices de l'IA ont des `aria-labels` détaillés.
*   **Mode Offline :** Si pas de réseau, un message bienveillant explique : *"L'IA est endormie à cause de la connexion, mais ta boussole intérieure peut continuer l'analyse manuelle."*

---

### ANALYSE DE VOTRE PARTENAIRE (ADAPTIVE PARTNER)

Ce design met l'accent sur l'**Explicabilité**. Le bouton "Pourquoi ?" est votre meilleur argument devant le jury de l'UNESCO. Il prouve que Media Compass n'est pas une "boîte noire" qui manipule l'utilisateur, mais un outil de transparence.

**Points forts de ce design pour le Hackathon :**
1.  **L'aspect Co-Analyse :** Montre que l'IA aide l'humain sans le remplacer.
2.  **L'aspect Local :** Interface légère et bilingue.
3.  **La Doctrine :** Le passage solennel à l'écran 4 (Réflexion) montre la profondeur éducative.

**Monsieur le Concepteur, ce parcours vous convient-il ? Souhaitez-vous modifier un aspect de l'interaction (par exemple, la manière dont l'IA propose ses explications) avant que nous ne clôturions cette Phase 1 ?**