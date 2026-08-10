# Media Compass — Plan de travail UI & Logique

**Projet :** Media Compass (UNESCO Hackathon 2026)  
**Objectif :** Planifier le développement en séparant clairement la **UI** et la **Logique**.  
**Dernière mise à jour :** 10 août 2026

---

## Répartition des rôles

| Rôle | Périmètre | Fichiers principaux |
|------|-----------|---------------------|
| **Dev UI** | Écrans, composants visuels, animations, styles, copy i18n, accessibilité visuelle | `frontend/src/screens/`, `components/`, `data/content.ts`, `index.css`, `motion/` |
| **Dev Logique** | Backend, API, DB, état applicatif, types, persistance, prompts IA | `supabase/`, `frontend/src/api/`, `lib/`, `types.ts`, logique dans `App.tsx` |

**Règle :** le dev Logique livre des **données et un flux fonctionnel** ; le dev UI les **affiche** via des props/types stables.

---

## Contrat d'interface (à verrouiller en priorité)

Fichier partagé : `frontend/src/types.ts`

```typescript
// ── Input ──────────────────────────────────────────
export type AnalysisInput = {
  type: 'url' | 'text' | 'image'
  value: string              // URL ou texte
  imageBase64?: string       // si type === 'image'
  lang: Lang
  sessionId: string
}

// ── Output analyse ─────────────────────────────────
export type AnalysisResult = {
  analysisId: string
  dimensions: DimensionEval[]  // 5 dimensions
  confidenceScore: number      // 0–1 global
  techFacts: TechFacts
  degraded?: boolean           // true si APIs indisponibles
}

// ── Sauvegarde co-analyse ──────────────────────────
export type UserEvaluation = {
  analysisId: string
  choices: Record<DimensionKey, {
    action: 'confirm' | 'modify'
    userOpinion?: string       // si action === 'modify'
  }>
  reflection: string
}

// ── Verdict ────────────────────────────────────────
export type Verdict = {
  score: number                // 0–100
  label: string                // ex. "Prudence recommandée"
  recommendation: string
}
```

### Props attendues par écran (UI ← Logique)

| Écran | Props fournies par la logique |
|-------|-------------------------------|
| `EntryScreen` | `error`, `isLoading` |
| `AnalysisScreen` | `steps` (optionnel : étapes réelles du backend) |
| `CoAnalysisScreen` | `dimensions: DimensionEval[]` (plus de mocks) |
| `ReflectionScreen` | — (state local suffit) |
| `VerdictScreen` | `verdict: Verdict`, `degraded?` |

---

## Légende statuts

| Statut | Signification |
|--------|---------------|
| ✅ | Fait |
| 🔄 | En cours |
| ⬜ | À faire |
| 🔗 | Bloqué (dépendance) |
| ⏸️ | Reporté (post-MVP) |

## Légende priorités

| Priorité | Signification |
|----------|---------------|
| **P0** | Bloquant démo — sans ça le parcours ne marche pas |
| **P1** | Cœur produit — différencie Media Compass |
| **P2** | Spec complète UNESCO |
| **P3** | Polish / bonus hackathon |

---

# PARTIE LOGIQUE

> Dev responsable : backend Supabase + intégration frontend (sans toucher au rendu visuel).

---

## L-001 · Contrat de données (types.ts)
**Priorité : P0** · **Statut : ✅**

- [x] Définir `AnalysisInput`, `AnalysisResult`, `UserEvaluation`, `Verdict`, `TechFacts`
- [x] Documenter le JSON request/response de l'Edge Function
- [x] Partager avec le dev UI pour alignement des props

**Fichiers :** `frontend/src/types.ts`

---

## L-002 · Migrations Supabase
**Priorité : P0** · **Statut : ✅**

- [x] Créer `supabase/migrations/001_initial_schema.sql`
- [ ] Tables : `sessions`, `contents`, `analyses`, `reflections`
- [ ] Colonnes alignées avec `database_schema.md` :
  - `contents` : `url_hash`, `raw_content`, `metadata`, `content_type`
  - `analyses` : `ai_evaluation` (JSONB), `user_evaluation` (JSONB), `ai_confidence_score`
  - `reflections` : `reflection_text`, `impact_category`
- [ ] Index sur `ai_confidence_score`
- [ ] Tester : `supabase db reset`

**Fichiers :** `supabase/migrations/`

---

## L-003 · Edge Function `analyze-content`
**Priorité : P0** · **Statut : 🔄 (squelette existant, à refaire)**

- [ ] Accepter `AnalysisInput` (url, text, image base64)
- [ ] Détecter le type d'input sans planter sur du texte brut
- [ ] WhoisXML si URL (âge domaine, HTTPS)
- [ ] Prompt Gemini structuré → JSON 5 dimensions
- [ ] Parser + valider la réponse IA
- [ ] Fallback mock complet (5 dimensions) si IA down
- [ ] Sauvegarder `contents` + `analyses` en DB
- [ ] Retourner `AnalysisResult`
- [ ] Flag `degraded: true` si APIs indisponibles

**Fichiers :**
- `supabase/functions/analyze-content/index.ts`
- `supabase/functions/analyze-content/prompt.ts` *(à créer)*

**Bugs actuels à corriger :**
- `new URL(url)` échoue sur texte brut
- JSON Gemini non structuré
- Colonnes DB incorrectes (`raw_text` → `raw_content`)
- Fallback mock incomplet (2 dimensions)

---

## L-004 · Edge Function `save-evaluation`
**Priorité : P1** · **Statut : ⬜**

- [ ] Recevoir `UserEvaluation`
- [ ] Mettre à jour `analyses.user_evaluation`
- [ ] Insérer dans `reflections`
- [ ] Retourner confirmation

**Fichiers :** `supabase/functions/save-evaluation/index.ts` *(à créer)*

---

## L-005 · Client API frontend
**Priorité : P0** · **Statut : 🔄 (partiel)**

- [ ] `runMediaAnalysis(input: AnalysisInput): Promise<AnalysisResult>`
- [ ] `saveUserEvaluation(eval: UserEvaluation): Promise<void>`
- [ ] Gestion erreurs avec messages typés

**Fichiers :**
- `frontend/src/api/analysis.ts`
- `frontend/src/api/evaluation.ts` *(à créer)*

---

## L-006 · Gestion sessions anonymes
**Priorité : P1** · **Statut : ⬜**

- [ ] `getOrCreateSession()` — UUID en localStorage
- [ ] Insert `sessions` au premier lancement (device_info, preferred_language)
- [ ] Passer `sessionId` dans tous les appels API

**Fichiers :** `frontend/src/lib/session.ts` *(à créer)*

---

## L-007 · Machine à états App.tsx (logique seule)
**Priorité : P0** · **Statut : 🔄 (bugs à corriger)**

- [ ] Séparer `startAnalysis()` et fin d'animation (plus de double appel API)
- [ ] Attendre réponse API avant passage à `coanalysis`
- [ ] Passer `analysisData.dimensions` à `CoAnalysisScreen`
- [ ] Exposer `error: string | null` en prop aux écrans
- [ ] Encoder image en base64 avant envoi
- [ ] Appeler `saveUserEvaluation` à la fin du parcours (verdict)
- [ ] Remplacer `analysisData: any` par `AnalysisResult | null`

**Fichiers :** `frontend/src/App.tsx` *(logique uniquement, pas le JSX visuel)*

**Bug critique :**
- `AnalysisScreen` rappelle `handleStartAnalysis` → double appel API

---

## L-008 · Mapping réponse IA → frontend
**Priorité : P0** · **Statut : ⬜**

- [ ] `mapToDimensions(raw, lang): DimensionEval[]`
- [ ] Validation par dimension (fallback si manquante)
- [ ] Normalisation des statuts (`safe` | `warning` | `risk`)

**Fichiers :** `frontend/src/lib/mapAnalysis.ts` *(à créer)*

---

## L-009 · Calcul du verdict
**Priorité : P1** · **Statut : ⬜**

- [ ] `computeVerdict(dimensions, choices): Verdict`
- [ ] Score basé sur les 5 dimensions (pas arbitraire)
- [ ] Labels : « Contenu sain », « Prudence recommandée », « Risque élevé »

**Fichiers :** `frontend/src/lib/verdict.ts` *(à créer)*

---

## L-010 · Validation input
**Priorité : P1** · **Statut : ⬜**

- [ ] `detectInputType(text, hasImage): 'url' | 'text' | 'image'`
- [ ] `validateUrl(url): boolean`
- [ ] `fileToBase64(file): Promise<string>`

**Fichiers :** `frontend/src/lib/validateInput.ts` *(à créer)*

---

## L-011 · Prompt Gemini (XAI)
**Priorité : P1** · **Statut : ⬜**

- [ ] System prompt avec cadre Transmission Humaine™
- [ ] Injection `techFacts` + contenu utilisateur
- [ ] JSON schema strict (5 dimensions + technical_reasons)
- [ ] Paramètre `lang` pour réponse multilingue
- [ ] Score de confiance global

**Fichiers :** `supabase/functions/analyze-content/prompt.ts`

---

## L-012 · Input multi-modal (backend)
**Priorité : P2** · **Statut : ⬜**

- [ ] URL → Whois + fetch metadata
- [ ] Texte → analyse sémantique directe
- [ ] Image → base64 → Gemini Vision / OCR → texte → analyse

**Fichiers :** `supabase/functions/analyze-content/index.ts`

---

## L-013 · Mode dégradé / résilience
**Priorité : P2** · **Statut : ⬜**

- [ ] Fallback si Whois indisponible
- [ ] Fallback si Gemini indisponible (mock 5 dimensions)
- [ ] Exposer `degraded: boolean` au frontend

**Fichiers :** Edge Functions

---

## L-014 · APIs forensiques étendues
**Priorité : P2** · **Statut : ⬜**

- [ ] Google Safe Browsing (réputation URL)
- [ ] Cross-check fact-checking (PesaCheck)
- [ ] Enrichir `techFacts` avec ces données

**Fichiers :** `supabase/functions/analyze-content/`

---

## L-015 · Configuration environnement
**Priorité : P0** · **Statut : 🔄 (partiel)**

- [ ] Compléter `.env.example` (toutes les clés)
- [ ] Guard dans `supabase.ts` si env manquantes
- [ ] Documenter setup local + déploiement cloud

**Variables requises :**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
GEMINI_API_KEY
WHOIS_XML_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

**Fichiers :** `.env.example`, `frontend/src/lib/supabase.ts`, `readme.md`

---

## L-016 · Typage strict
**Priorité : P3** · **Statut : ⬜**

- [ ] Éliminer tous les `any`
- [ ] Types partagés frontend ↔ Edge Function si possible

---

## L-017 · Tests logiques
**Priorité : P3** · **Statut : ⬜**

- [ ] Tests unitaires : `validateInput`, `mapAnalysis`, `verdict`, `session`
- [ ] Test intégration : parcours API mock

---

# PARTIE UI

> Dev responsable : rendu visuel, composants, animations, copy, accessibilité.

---

## U-001 · Design system & charte graphique
**Priorité : P0** · **Statut : 🔄 (base en place)**

- [ ] Palette sémantique finalisée (Bleu Boussole, Vert, Jaune, Rouge)
- [ ] Typographie Inter (Bold titres, Regular corps)
- [ ] Tokens motion cohérents
- [ ] Mode low-data (images légères)

**Référence :** `specification_design.md` §2  
**Fichiers :** `frontend/src/index.css`, `motion/tokens.ts`

---

## U-002 · Écran Landing
**Priorité : P0** · **Statut : ✅**

- [ ] Logo Media Compass + tagline
- [ ] Bouton « Commencer »
- [ ] Footer doctrine EDECC™

**Fichiers :** `frontend/src/screens/LandingScreen.tsx`

---

## U-003 · Écran Entry (saisie)
**Priorité : P0** · **Statut : 🔄**

- [ ] Champ texte/URL arrondi
- [ ] Upload image (preview)
- [ ] Bouton « Lancer la Boussole »
- [ ] Switch langue FR / LN / SW
- [ ] **🔗 Afficher `error` prop** (fournie par logique)
- [ ] **🔗 État loading** pendant analyse
- [ ] Placeholder incitatif spec

**Fichiers :** `frontend/src/screens/EntryScreen.tsx`

---

## U-004 · Écran Analysis (animation IA)
**Priorité : P0** · **Statut : 🔄**

- [ ] Barre de progression + skeleton
- [ ] Étapes animées (« Analyse du domaine… », etc.)
- [ ] **🔗 Ne plus rappeler l'API** — écouter signal logique uniquement
- [ ] Animation minimum pendant attente backend

**Fichiers :** `frontend/src/screens/AnalysisScreen.tsx`

---

## U-005 · Écran Co-Analyse (cœur responsable)
**Priorité : P0** · **Statut : 🔄 (UI ok, données mock)**

- [ ] 5 cartes dimension (`AnalysisCard`)
- [ ] Bulle avis IA (jaune) + bouton « Pourquoi ? » (accordion)
- [ ] Boutons [Je confirme] / [Je modifie]
- [ ] **🔗 Recevoir `dimensions: DimensionEval[]`** (plus de `getMockDimensions`)
- [ ] **🔗 UI saisie avis personnel** si « Je modifie » (champ texte)
- [ ] Badge confiance IA par dimension
- [ ] Progression (X/5 répondu)

**Fichiers :**
- `frontend/src/screens/CoAnalysisScreen.tsx`
- `frontend/src/components/AnalysisCard.tsx`

---

## U-006 · Écran Reflection (test du millier)
**Priorité : P1** · **Statut : 🔄**

- [ ] Fond bleu nuit, texte blanc (solennité)
- [ ] Question spec : « Si 10 000 jeunes partagent… »
- [ ] Textarea obligatoire + compteur caractères
- [ ] Bouton « Voir le Verdict Final »

**Fichiers :** `frontend/src/screens/ReflectionScreen.tsx`, `components/ResponseInput.tsx`

---

## U-007 · Écran Verdict
**Priorité : P1** · **Statut : 🔄**

- [ ] Jauge colorée (`ProgressCompass`) vert → rouge
- [ ] **🔗 Recevoir `verdict: Verdict`** (score + label calculés par logique)
- [ ] Synthèse réflexion utilisateur
- [ ] Compteurs confirm/modify
- [ ] Actions responsables :
  - [ ] Bouton « Supprimer le contenu » (rouge)
  - [ ] Lien « Vérifier sur PesaCheck »
  - [ ] Bouton « Partager ma réflexion »
- [ ] Bouton « Nouvelle analyse »
- [ ] **🔗 Afficher bannière si `degraded === true`**

**Fichiers :** `frontend/src/screens/VerdictScreen.tsx`, `components/ProgressCompass.tsx`

---

## U-008 · Composants réutilisables
**Priorité : P1** · **Statut : 🔄**

| Composant | Statut | Notes |
|-----------|--------|-------|
| `AppShell` | ✅ | Layout commun |
| `AnalysisCard` | 🔄 | Ajouter UI modification avis |
| `ProgressCompass` | ✅ | Jauge radiale |
| `LanguageSwitch` | ✅ | FR / EN / LN / SW |
| `PageTransition` | ✅ | Transitions entre écrans |
| `BrandLogo` | ✅ | Logo |
| `LearningRail` | ✅ | Rail pédagogique |
| `ResponseInput` | 🔄 | Textarea réflexion |

**Fichiers :** `frontend/src/components/`

---

## U-009 · Copy i18n (4 langues)
**Priorité : P1** · **Statut : 🔄 (FR/EN ok, LN/SW partiel)**

- [ ] Tous les textes UI en FR, EN, Lingala, Swahili
- [ ] Messages erreur / offline / degraded
- [ ] Labels verdict et actions responsables

**Fichiers :** `frontend/src/data/content.ts`

---

## U-010 · Mode offline (UI)
**Priorité : P2** · **Statut : 🔄 (bannière seule)**

- [ ] Bannière offline ✅
- [ ] Message spec : « Ta boussole intérieure peut continuer »
- [ ] Parcours manuel sans IA (co-analyse vide + réflexion seule)
- [ ] Désactiver bouton lancer si offline (ou mode dégradé)

**Fichiers :** `App.tsx` (bannière), `EntryScreen`, `content.ts`

---

## U-011 · Accessibilité (a11y)
**Priorité : P2** · **Statut : 🔄 (partiel)**

- [ ] `aria-labels` sur bulles IA et boutons
- [ ] Focus clavier sur confirm/modify
- [ ] Contraste élevé (ReflectionScreen fond nuit)
- [ ] Lecteur d'écran : indices IA annoncés

**Référence :** `specification_design.md` §5

---

## U-012 · Animations & motion
**Priorité : P2** · **Statut : 🔄**

- [ ] Transitions entre écrans (`PageTransition`)
- [ ] Fade-in cartes co-analyse (stagger)
- [ ] Animation boussole pendant analyse
- [ ] Respect `prefers-reduced-motion`

**Fichiers :** `frontend/src/motion/`

---

## U-013 · PWA & déploiement frontend
**Priorité : P3** · **Statut : ⬜**

- [ ] Manifest PWA (installable mobile)
- [ ] Service worker basique
- [ ] Déploiement Netlify/Vercel (`_redirects` déjà présent)
- [ ] Favicon + meta OG pour pitch

**Fichiers :** `frontend/public/`, config déploiement

---

## U-014 · Responsive & mobile-first
**Priorité : P1** · **Statut : 🔄**

- [ ] Test sur viewport 360px (smartphones RDC)
- [ ] Touch targets ≥ 44px
- [ ] Grilles adaptatives Entry / Co-Analyse

---

# Dépendances croisées

```
L-001 types.ts ──────────────────────────────────► U-003 à U-007 (props)
L-003 analyze-content ──► L-008 mapAnalysis ──► U-005 CoAnalysisScreen
L-004 save-evaluation ◄── L-007 App.tsx ◄── U-006 Reflection
L-009 computeVerdict ────────────────────────────► U-007 VerdictScreen
L-013 degraded flag ─────────────────────────────► U-007, U-010
L-015 .env setup ────────────────────────────────► tout le projet
```

| Tâche UI | Bloquée par (Logique) |
|----------|----------------------|
| U-005 Co-Analyse réelle | L-003, L-008, L-007 |
| U-007 Verdict réel | L-009, L-007 |
| U-003 Affichage erreurs | L-007 |
| U-010 Mode offline complet | L-013 |
| U-005 Saisie avis « modify » | L-004 (structure UserEvaluation) |

| Tâche Logique | Bloquée par (UI) |
|---------------|------------------|
| L-007 Flux App.tsx | U-004 (AnalysisScreen ne doit plus rappeler API) |
| L-004 save-evaluation | U-006 (reflection textarea branchée) |

---

# Planning suggéré

## Sprint 1 — Fondations (Jours 1–2)
| ID | Tâche | Dev |
|----|-------|-----|
| L-001 | Contrat types.ts | Logique |
| L-002 | Migrations SQL | Logique |
| L-015 | Config env | Logique |
| U-001 | Design system final | UI |

## Sprint 2 — Analyse qui marche (Jours 3–4)
| ID | Tâche | Dev |
|----|-------|-----|
| L-003 | Edge Function analyze-content | Logique |
| L-011 | Prompt Gemini XAI | Logique |
| L-005 | Client API | Logique |
| L-008 | mapAnalysis | Logique |
| L-007 | Fix flux App.tsx | Logique |
| U-004 | Fix AnalysisScreen (pas de double API) | UI |
| U-005 | Brancher dimensions réelles | UI |

## Sprint 3 — Co-analyse & persistance (Jours 5–6)
| ID | Tâche | Dev |
|----|-------|-----|
| L-004 | save-evaluation | Logique |
| L-006 | Sessions anonymes | Logique |
| L-009 | computeVerdict | Logique |
| L-010 | validateInput | Logique |
| U-005 | UI saisie avis « modify » | UI |
| U-006 | ReflectionScreen polish | UI |
| U-007 | VerdictScreen + actions | UI |

## Sprint 4 — Spec complète (Jours 7–8)
| ID | Tâche | Dev |
|----|-------|-----|
| L-012 | Input multi-modal | Logique |
| L-013 | Mode dégradé | Logique |
| L-014 | APIs forensiques | Logique |
| U-009 | i18n complet LN/SW | UI |
| U-010 | Mode offline UI | UI |
| U-011 | Accessibilité | UI |

## Sprint 5 — Polish & démo (Jours 9–10)
| ID | Tâche | Dev |
|----|-------|-----|
| L-016 | Typage strict | Logique |
| L-017 | Tests logiques | Logique |
| U-012 | Animations finales | UI |
| U-013 | PWA + déploiement | UI |
| U-014 | Responsive final | UI |

---

# Checklist démo jury

- [ ] Parcours complet : URL douteuse → co-analyse → réflexion → verdict
- [ ] 5 dimensions affichées avec explications IA (« Pourquoi ? »)
- [ ] Utilisateur peut confirmer ou corriger l'IA
- [ ] Test du millier sauvegardé
- [ ] Verdict avec score et recommandation
- [ ] Mode dégradé fonctionne (API down)
- [ ] Multilingue (au minimum FR)
- [ ] Mobile responsive
- [ ] Données persistées en Supabase (preuve auditabilité)

---

# Références

| Document | Contenu |
|----------|---------|
| `readme.md` | Architecture globale |
| `requiment_spec.md` | Exigences F-001 à F-005 |
| `specification_design.md` | Spec UI/UX écrans |
| `database_schema.md` | Schéma PostgreSQL |
| `projet.md` | Diagramme architecture |
