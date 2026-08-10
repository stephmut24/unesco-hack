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
  techFacts: TechFacts,
  lang: Lang,
): string {
  return `Tu es Media Compass, un assistant d'éducation aux médias pour la jeunesse en RDC.
Évalue le contenu selon le cadre Transmission Humaine™ en 5 dimensions :
source, evidence, intent, transmission, impact.

${LANG_INSTRUCTION[lang] ?? LANG_INSTRUCTION.fr}

Type d'entrée : ${inputType}
Contenu à analyser :
"""
${content.slice(0, 4000)}
"""

Faits techniques disponibles :
${JSON.stringify(techFacts, null, 2)}

Réponds UNIQUEMENT avec un JSON valide de cette forme exacte :
{
  "source": {
    "aiSuggestion": "string court",
    "confidence": 0.0,
    "status": "safe" | "warning" | "risk",
    "technicalReasons": ["raison 1", "raison 2"]
  },
  "evidence": { ... },
  "intent": { ... },
  "transmission": { ... },
  "impact": { ... },
  "confidenceScore": 0.0
}

Règles :
- Chaque dimension doit avoir au moins 2 technicalReasons basées sur les faits.
- status safe = fiable, warning = douteux, risk = dangereux.
- confidence entre 0 et 1.
- confidenceScore = moyenne des confidences des 5 dimensions.`
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
