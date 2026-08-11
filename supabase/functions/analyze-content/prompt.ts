type ContentType = 'url' | 'text' | 'image'
type Lang = 'fr' | 'en' | 'ln' | 'sw'

type TechFacts = {
  domain?: string
  createdDate?: string
  isSecure?: boolean
  limited?: boolean
  inputType: ContentType
}

const LANG_INSTRUCTION: Record<Lang, string> = {
  fr: 'Réponds en français.',
  en: 'Respond in English.',
  ln: 'Réponds en lingala.',
  sw: 'Réponds en swahili.',
}

export function buildAnalysisPrompt(
  inputType: ContentType,
  content: string,
  collectedFacts: Record<string, unknown>,
  lang: Lang,
): string {
  const phase1 = collectedFacts.domain || collectedFacts.createdDate
    ? 'Phase 1 (Source) : domaine, HTTPS, Whois, risque domaine'
    : null
  const phase2 = collectedFacts.evidenceFacts
    ? 'Phase 2 (Evidence) : page HTML, Safe Browsing, fact-checks, PesaCheck'
    : null
  const phase3 = collectedFacts.technicalSignals
    ? 'Phase 3 (Technique) : signaux compilés'
    : null

  const phasesDone = [phase1, phase2, phase3].filter(Boolean).join('\n- ')

  return `Tu es Media Compass, un assistant d'éducation aux médias pour la jeunesse en RDC.

CONTEXTE : Les 4 phases de collecte sont terminées. Tu produis maintenant le RAPPORT DE DIAGNOSTIC
sur les 5 dimensions Transmission Humaine™. L'humain lira ce rapport pour confirmer ou nuancer chaque avis.

Phases de collecte déjà effectuées :
- ${phasesDone || 'Collecte limitée — base-toi sur le contenu'}

PREUVES COLLECTÉES (utilise-les dans technicalReasons — ne pas inventer) :
${JSON.stringify(collectedFacts, null, 2)}

Type d'entrée : ${inputType}
Contenu analysé :
"""
${content.slice(0, 4000)}
"""

${LANG_INSTRUCTION[lang] ?? LANG_INSTRUCTION.fr}

Pour CHAQUE dimension, produis :
- aiSuggestion : avis court (ex. "Fiable", "Douteux", "Risque élevé")
- confidence : 0.0 à 1.0
- status : "safe" | "warning" | "risk"
- technicalReasons : 2 à 4 raisons TIRÉES des preuves ci-dessus (cite domaine, fact-check, signal technique, etc.)

Mapping dimensions ↔ preuves :
- source     → domaine, HTTPS, Whois, domainRisk, auteur
- evidence   → citations, fact-checks, Safe Browsing, reachability page
- intent     → clickbait, langage sensationnaliste, cohérence titre/contenu
- transmission → valeurs normalisées, cadre "nous vs eux", appel au partage
- impact     → effet sur cohésion sociale, polarisation, contexte RDC

Réponds UNIQUEMENT en JSON valide :
{
  "source": { "aiSuggestion": "...", "confidence": 0.0, "status": "safe|warning|risk", "technicalReasons": ["...", "..."] },
  "evidence": { ... },
  "intent": { ... },
  "transmission": { ... },
  "impact": { ... },
  "confidenceScore": 0.0
}`
}

export function buildMockEvaluation(degraded: boolean) {
  const note = degraded
    ? 'Analyse en mode dégradé — services externes indisponibles.'
    : 'Analyse simulée — IA indisponible.'

  const dimension = (suggestion: string, status: 'safe' | 'warning' | 'risk') => ({
    aiSuggestion: suggestion,
    confidence: 0.6,
    status,
    technicalReasons: [note, 'Vérifie manuellement la source et le contexte.'],
  })

  return {
    source: dimension('À vérifier', 'warning'),
    evidence: dimension('Preuves insuffisantes', 'warning'),
    intent: dimension('Intention incertaine', 'warning'),
    transmission: dimension('Impact social à évaluer', 'warning'),
    impact: dimension('Prudence recommandée', 'warning'),
    confidenceScore: 0.6,
  }
}
