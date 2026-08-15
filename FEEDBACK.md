# Media Compass — Synthèse feedbacks & évolutions

**Date :** 15 août 2026  
**Contexte :** retours après visionnage / tests du prototype (équipe, testeurs, Dr Nancy)

---

## 1. Points positifs à conserver

| Source | Message clé |
|--------|-------------|
| Feedback général | Parcours de réflexion cohérent avec la vision du projet |
| Testeur « DG / module » | Toutes les options fonctionnent ; transitions rapides entre étapes |
| Testeuse #2 | Claire, esthétique, intuitive, fluide, sans bugs sur téléphone |
| Testeuse #2 | L’outil **propose** des indices sans décider à la place de l’utilisateur |
| Testeuse #2 | Les **5 dimensions** poussent à réfléchir avant de partager |
| Marco | Facilité d’usage = levier de fidélité (à renforcer tôt) |

**Principe produit à garder :** Media Compass = boussole pédagogique, pas juge automatique.

---

## 2. Ajouts & améliorations — Frontend (UI / UX / copy)

### 2.1 Priorité haute (compréhension & confiance)

| ID | Demande | Détail UI |
|----|---------|-----------|
| **F-01** | Expliquer le **score de vigilance** | Sous la jauge (`ProgressCompass` / Verdict) : 1–2 phrases concrètes (ex. « 55 = prudence : plusieurs signaux demandent vérification avant partage »). Aligné avec le point du Dr Nancy. |
| **F-02** | Mode **analyse limitée / degraded** plus clair | Quand `degraded === true` : lister **ce qui n’a pas pu être analysé** + **ce que ça change** pour le résultat (pas seulement une bannière générique). |
| **F-03** | Simplifier le vocabulaire | Remplacer les formulations trop techniques pour un public non-IT. Ex. proposé : **« Valider ou nuancer » → « Valider ou corriger »** (boutons co-analyse + copy i18n). |
| **F-04** | Clarifier **« Partager ma réflexion »** | Préciser le contexte : retourner dans la **communauté d’origine** (WhatsApp, réseau, groupe) pour y partager réflexion / expérience post-analyse — qui reçoit le partage et pourquoi. |

### 2.2 Priorité moyenne (Learning Loop™ & parcours)

| ID | Demande | Détail UI |
|----|---------|-----------|
| **F-05** | **Historique des analyses** | Écran / section listant : analyses passées, réflexions, recommandations. Accès depuis landing ou menu. |
| **F-06** | **Progression / évolution** | Visualiser dans le temps : scores, choix confirm/corriger par dimension, comparaison ancienne vs nouvelle analyse. Renforce le Learning Loop™. |
| **F-07** | i18n **complète** (LN / SW / EN) | Tout le contenu UI doit changer de langue (pas seulement les indices / labels partiels) : rail, boutons, bannières, verdict, erreurs, offline, degraded. |
| **F-08** | Explications plus **précises** | Renforcer les textes d’aide (pourquoi une dimension, que faire après un signal risque / warning) sans alourdir le premier viewport. |
| **F-09** | Simplicité d’onboarding (Marco) | Première visite plus guidée : micro-texte « quoi coller », étapes visibles, moins de jargon dès l’Entry. |

### 2.3 Priorité basse / polish

| ID | Demande | Détail UI |
|----|---------|-----------|
| **F-10** | Parité **mobile / desktop** | Conserver la qualité téléphone ; vérifier lisibilité et touch targets sur grand écran. |
| **F-11** | Centraliser les feedbacks tests (outil) | Page ou doc interne + éventuellement un canal in-app « Signaler un problème » (optionnel post-soumission). |

### Fichiers frontend typiquement concernés

- `screens/VerdictScreen.tsx`, `components/ProgressCompass.tsx` → F-01, F-04  
- `screens/AnalysisScreen.tsx`, `CoAnalysisScreen.tsx`, `VerdictScreen.tsx` → F-02  
- `data/content.ts`, `AnalysisCard.tsx` → F-03, F-07, F-08  
- Nouveaux écrans / navigation → F-05, F-06  
- `EntryScreen.tsx`, `LandingScreen.tsx` → F-09  

---

## 3. Ajouts & améliorations — Backend / logique

### 3.1 Priorité haute

| ID | Demande | Détail logique |
|----|---------|----------------|
| **B-01** | Enrichir le payload **degraded** | Exposer côté API : services en échec, phases/dimensions impactées, message structuré consommable par l’UI (F-02). |
| **B-02** | **Métadonnée d’explication du score** | Fournir avec le verdict : `score`, `label`, `recommendation` **et** un champ `scoreExplanation` (ou règles i18n dérivées du score) pour F-01. |
| **B-03** | Preuves & **auteur / créateur** du contenu | Renforcer la phase evidence / source : preuves solides + infos sur la personne / entité derrière le lien ou le message (demande Marco). |

### 3.2 Priorité moyenne (Learning Loop™)

| ID | Demande | Détail logique |
|----|---------|----------------|
| **B-04** | **Persistance historique** | Stocker par session / utilisateur : `analysisId`, dimensions, choix, `userOpinion`, réflexion, verdict, timestamps. |
| **B-05** | API **liste / détail** historiques | Endpoints (ou tables + RLS) pour retrouver anciennes analyses et comparer deux runs. |
| **B-06** | Métriques de **progression** | Agrégats : nb d’analyses, répartition confirm/corriger, évolution du score moyen, dimensions les plus souvent corrigées. |

### 3.3 Qualité & tests

| ID | Demande | Détail logique |
|----|---------|----------------|
| **B-07** | Jeux de tests **liens fiables vs malveillants** | Corpus de contenus (URL saines / douteuses / trompeuses) pour valider le pipeline 4 phases + 5 dimensions. |
| **B-08** | i18n backend des textes dynamiques | S’assurer que suggestions IA / résumés de phase / recommandations respectent `lang` (FR, EN, LN, SW) — en soutien à F-07. |

### Zones backend typiquement concernées

- Edge `analyze-content` / pipeline phases → B-01, B-03, B-07, B-08  
- `computeVerdict` / save-evaluation → B-02, B-04  
- Schéma Supabase / RLS / session → B-04, B-05, B-06  

---

## 4. Process & produit (hors code strict)

| ID | Action |
|----|--------|
| **P-01** | Centraliser tous les retours tests (bugs, copy, faux positifs) dans ce fichier ou un tracker unique. |
| **P-02** | Après soumission hackathon : sprint langues nationales + historique Learning Loop™. |
| **P-03** | Continuer les tests manuels avec contenus réels (fiables et à risque). |

---

## 5. Mapping feedback → tickets

| Feedback source | Tickets |
|-----------------|---------|
| Learning Loop / historique | F-05, F-06, B-04, B-05, B-06 |
| Langues nationales | F-07, B-08 |
| « Valider ou corriger » | F-03 |
| Clarifier partage réflexion | F-04 |
| Score 55 / Dr Nancy | F-01, B-02 |
| Analyse technique limitée | F-02, B-01 |
| Termes trop techniques | F-03, F-08, F-09 |
| Preuves + auteur (Marco) | B-03 (+ copy F-08) |
| Simplicité / fidélité (Marco) | F-09 |
| Tests liens fiables / malveillants | B-07, P-03 |
| Centraliser feedbacks | F-11, P-01 |

---

## 6. Suggestion d’ordre d’implémentation

1. **Quick wins copy/UX** : F-03, F-04, F-01 (+ B-02), F-02 (+ B-01)  
2. **Confiance analyse** : B-03, F-08, B-07  
3. **i18n complète** : F-07, B-08  
4. **Learning Loop™** : B-04 → B-05 → F-05 → F-06 / B-06  

---

*Document de synthèse — à mettre à jour au fil des nouveaux retours de tests.*
