# Notes frontend — 15 août 2026

Périmètre : **UI uniquement**. Aucun fichier `supabase/`, aucune Edge Function, aucun `lib/supabase.ts` ni `api/` modifié.

## Transitions de page

- `PageTransition` : plus de glissement + rotation. Fondu simple + léger décalage vertical (0,28 s).
- `AppShell` : animations d’entrée du header / rail / footer retirées pour éviter le double mouvement avec le changement d’écran.

## Feedbacks UI traités

| ID | Modification |
|----|----------------|
| **F-01** | Explication du score sous la jauge (prudent / élevé / bas), selon la valeur. |
| **F-02** | Bannière « analyse limitée » : liste de ce qui n’a pas pu être vérifié + impact sur le résultat (`DegradedNotice`). |
| **F-03** | Boutons **Valider** / **Corriger** (plus « nuancer »). Copy simplifiée FR / EN. |
| **F-04** | Texte sous « Partager ma réflexion » : ramener la phrase dans le groupe d’origine. |
| **F-05 / F-06** | Non implémenté : pas d’auth, donc pas d’historique. |
| **F-07** | Sélecteur limité à **FR / EN** pour l’instant (LN / SW masqués). |
| **F-08** | Phrase d’aide sous chaque carte (safe / warning / risk). |
| **F-09** | Micro-texte d’aide sous le champ de saisie (quoi coller, ensuite observer, puis décider). |
| **F-10** | Libellés du rail visibles aussi sur téléphone. |

## Logo

- Nouveau fichier : `frontend/public/Logo/logo.png` (remplace `logo.jpg`).
- Références mises à jour : `BrandLogo`, favicon, image Open Graph, `manifest.webmanifest`.

## Fichiers touchés

- `src/components/PageTransition.tsx`, `AppShell.tsx`, `ProgressCompass.tsx`, `AnalysisCard.tsx`, `LearningRail.tsx`, `LanguageSwitch.tsx`, `BrandLogo.tsx`
- `src/components/DegradedNotice.tsx` *(nouveau)*
- `src/data/content.ts`
- `src/screens/` : Landing, Entry, Analysis, CoAnalysis, Verdict
- `src/App.tsx` (branchement copy / degraded / verdict)
- `src/types.ts`
- `src/index.css` (origine de transform de page)
- `frontend/index.html`, `frontend/public/manifest.webmanifest`, `frontend/public/Logo/logo.png`

## Non fait (volontairement)

- Rien côté Supabase / backend (B-01 à B-08).
- L’historique n’est pas dans le frontend : il demandera une authentification plus tard.
- L’appel `saveUserEvaluation` existant n’a pas été modifié.
- Lingala / Swahili : textes encore dans `content.ts`, mais absents du sélecteur.
