
---

# 🧭 Media Compass - Technical Debrief & Architecture

## 🌟 Vision & Mission
**Media Compass** est un outil numérique d'éducation aux médias conçu pour la jeunesse en République Démocratique du Congo et dans le monde. Contrairement aux outils de fact-checking classiques, il utilise le cadre de la **Transmission Humaine™** pour évaluer non seulement l'exactitude d'une information, mais aussi ses valeurs, ses comportements et son impact sur la cohésion sociale.

Le projet s'inscrit dans la doctrine **EDECC™** (*Écosystème Dynamique Éducatif Cohérent et Convergent*), visant à transformer la vérification en un acte de responsabilité citoyenne.

---

## 🏗️ Architecture Globale
L'application repose sur une architecture **Serverless moderne** et **découplée**, permettant une grande légèreté et une scalabilité immédiate.

### 1. Frontend (Interface & Expérience)
*   **Framework :** React.ts (Vite) pour une performance optimale et un chargement instantané.
*   **Gestion d'État :** Architecture par "Machine à États" (FSM) gérant les étapes du parcours utilisateur (`landing` ➔ `entry` ➔ `analysis` ➔ `coanalysis` ➔ `reflection` ➔ `verdict`).
*   **Communication :** Intégration du client Supabase pour invoquer des fonctions asynchrones de manière sécurisée.
*   **Design :** Mobile-first, utilisant Tailwind CSS pour un rendu fluide sur les smartphones d'entrée et milieu de gamme.

### 2. Backend & Intelligence (Le "Cerveau")
Le backend est orchestré par **Supabase Edge Functions** (Runtime Deno), agissant comme un centre de décision intelligent :
*   **Forensics Technique :** Analyse en temps réel des métadonnées du domaine via l'API **WhoisXML** (âge du domaine, protocole de sécurité, réputation).
*   **Moteur d'IA Responsable (XAI) :** Utilisation de **Gemini 1.5 Flash** (ou OpenAI) configuré pour l'explicabilité. L'IA ne donne pas un verdict binaire, mais une évaluation argumentée selon 5 dimensions :
    1.  **Source :** Identification et fiabilité de l'émetteur.
    2.  **Evidence :** Présence et qualité des preuves.
    3.  **Intent :** Objectif du contenu (informer vs manipuler).
    4.  **Transmission :** Valeurs et normes sociales véhiculées.
    5.  **Impact :** Conséquences potentielles sur la société.
*   **Résilience :** Système de "Fallback/Mock" intégré permettant le fonctionnement de l'outil même en cas d'indisponibilité des services d'IA.

### 3. Couche de Données (Persistance & Audit)
*   **Base de données :** PostgreSQL (Supabase) pour une intégrité totale des données.
*   **Modèle de données :** 
    *   `contents` : Stocke les métadonnées techniques des informations analysées (DNS, type de contenu).
    *   `analyses` : Journalise les suggestions de l'IA et les choix de l'utilisateur pour mesurer l'évolution de l'esprit critique.
    *   `reflections` : Conserve les réponses qualitatives sur l'impact social ("Le test du millier").

---

## 🛠️ Flux de Données (Data Flow)
1.  **Input :** Le jeune soumet une URL ou un texte via `EntryScreen`.
2.  **Orchestration :** L'Edge Function `analyze-content` est déclenchée. Elle parallélise la récupération des données Whois et le prompt IA.
3.  **Analyse :** L'IA synthétise les preuves techniques et le contenu sémantique pour générer un JSON structuré.
4.  **Co-Analyse :** Le Frontend affiche ces suggestions. L'utilisateur valide ou corrige l'IA, renforçant sa propre capacité de discernement.
5.  **Persistance :** Le résultat final et la réflexion de l'utilisateur sont sauvegardés pour analyse statistique (Impact UNESCO).

---

## 🚀 Installation & Contribution
*   **Frontend :** `cd frontend && npm install && npm run dev`
*   **Backend :** `supabase start` & `supabase functions serve`
*   **Variables requises :** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `GEMINI_API_KEY`, `WHOIS_XML_API_KEY`.

---
*Ce projet est développé dans le cadre du Hackathon UNESCO 2026 avec l'ambition de promouvoir une citoyenneté numérique responsable en RDC.*

---

### ANALYSE DE VOTRE PARTENAIRE (ADAPTIVE PARTNER)

Ce README est maintenant prêt. Il met en avant :
1.  **Votre maîtrise du Backend** (Edge Functions, Orchestration, Sécurité).
2.  **La fluidité du Frontend** de votre collègue (React, State Machine).
3.  **La profondeur du projet** (EDECC, Transmission Humaine).

**Souhaitez-vous que je vous aide sur un point technique précis pour finir l'implémentation avant de passer au test final avec votre collègue ?** (Par exemple, la gestion des erreurs d'affichage ou les statistiques dans Supabase).