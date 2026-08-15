type Lang = 'fr' | 'en' | 'ln' | 'sw'
type RiskLevel = 'safe' | 'warning' | 'risk'

type DimensionData = {
  status?: RiskLevel
  aiSuggestion?: string
  aiSummary?: string
  confidence?: number
}

type UserChoiceDetail = {
  action: 'confirm' | 'modify'
  userOpinion?: string
}

export type Verdict = {
  score: number
  label: string
  recommendation: string
  level: RiskLevel
}

const DIMENSION_KEYS = ['source', 'evidence', 'intent', 'transmission', 'impact'] as const

const VERDICT_LABELS: Record<
  Lang,
  { safe: string; warning: string; risk: string; recommendations: Record<RiskLevel, string> }
> = {
  fr: {
    safe: 'Contenu sain',
    warning: 'Prudence recommandée',
    risk: 'Risque élevé',
    recommendations: {
      safe: 'Tu peux partager en restant vigilant sur le contexte.',
      warning: 'Vérifie avant de partager. Consulte une source fiable.',
      risk: 'Ne partage pas. Vérifie auprès d\'une source officielle ou fiable.',
    },
  },
  en: {
    safe: 'Healthy content',
    warning: 'Caution advised',
    risk: 'High risk',
    recommendations: {
      safe: 'You may share while staying mindful of context.',
      warning: 'Verify before sharing. Check a reliable source.',
      risk: 'Do not share. Verify with an official or reliable source.',
    },
  },
  ln: {
    safe: 'Contenu malamu',
    warning: 'Bobateli esengeli',
    risk: 'Riski monene',
    recommendations: {
      safe: 'Okoki kokabisa kasi tala contexte.',
      warning: 'Tala liboso ya kokabisa.',
      risk: 'Kokabisa te. Tala na source ya solo to officielle.',
    },
  },
  sw: {
    safe: 'Maudhui salama',
    warning: 'Tahadhari inapendekezwa',
    risk: 'Hatari kubwa',
    recommendations: {
      safe: 'Unaweza kushiriki ukizingatia muktadha.',
      warning: 'Thibitisha kabla ya kushiriki.',
      risk: 'Usishiriki. Thibitisha kwa chanzo rasmi au cha kuaminika.',
    },
  },
}

const STATUS_WEIGHT: Record<RiskLevel, number> = {
  safe: 0,
  warning: 1,
  risk: 2,
}

function normalizeStatus(value: unknown): RiskLevel {
  if (value === 'safe' || value === 'warning' || value === 'risk') return value
  return 'warning'
}

function normalizeDimensions(raw: unknown): Record<string, DimensionData> {
  if (!raw || typeof raw !== 'object') return {}
  const source = raw as Record<string, unknown>
  const nested = source.dimensions
  const dimensions = (nested && typeof nested === 'object' ? nested : source) as Record<
    string,
    DimensionData
  >
  return dimensions
}

export function computeVerdictScore(
  dimensionsRaw: unknown,
  choices: Record<string, UserChoiceDetail>,
  lang: Lang,
): Verdict {
  const labels = VERDICT_LABELS[lang] ?? VERDICT_LABELS.fr
  const dimensions = normalizeDimensions(dimensionsRaw)

  const statuses = DIMENSION_KEYS.map((key) => {
    const dim = dimensions[key]
    return normalizeStatus(dim?.status)
  })

  const avgRisk =
    statuses.length > 0
      ? statuses.reduce((acc, s) => acc + STATUS_WEIGHT[s], 0) / statuses.length
      : 1

  const modified = Object.values(choices).filter((c) => c?.action === 'modify').length
  const adjustedRisk = Math.min(2, avgRisk + modified * 0.15)

  let level: RiskLevel
  if (adjustedRisk < 0.6) level = 'safe'
  else if (adjustedRisk < 1.4) level = 'warning'
  else level = 'risk'

  const score = Math.round(
    level === 'safe' ? 85 - modified * 5 : level === 'warning' ? 55 - modified * 5 : 25,
  )

  return {
    score: Math.max(10, Math.min(95, score)),
    label: labels[level],
    recommendation: labels.recommendations[level],
    level,
  }
}

const LANG_INSTRUCTION: Record<Lang, string> = {
  fr: 'Réponds en français.',
  en: 'Respond in English.',
  ln: 'Réponds en lingala.',
  sw: 'Réponds en swahili.',
}

const GEMINI_MODELS = ['gemini-3-flash-preview', 'gemini-2.5-flash', 'gemini-2.5-flash-lite']

export async function generateVerdictRecommendation(
  dimensionsRaw: unknown,
  choices: Record<string, UserChoiceDetail>,
  reflection: string,
  lang: Lang,
  baseVerdict: Verdict,
): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) return baseVerdict.recommendation

  const dimensions = normalizeDimensions(dimensionsRaw)
  const summary = DIMENSION_KEYS.map((key) => {
    const dim = dimensions[key]
    const choice = choices[key]
    return {
      dimension: key,
      status: dim?.status ?? 'warning',
      aiSuggestion: dim?.aiSuggestion ?? '',
      aiSummary: dim?.aiSummary ?? '',
      userAction: choice?.action ?? 'confirm',
      userOpinion: choice?.userOpinion ?? '',
    }
  })

  const prompt = `Tu es Media Compass, assistant d'éducation aux médias pour la jeunesse en RDC.

L'utilisateur vient de terminer une co-analyse sur 5 dimensions et a écrit une réflexion.
Produis UNE recommandation finale personnalisée (2-3 phrases max), ton pédagogique et responsable.

Niveau de vigilance calculé : ${baseVerdict.level} (score ${baseVerdict.score}/100)
Label : ${baseVerdict.label}

Résumé des dimensions et choix utilisateur :
${JSON.stringify(summary, null, 2)}

Réflexion de l'utilisateur (test du millier) :
"${reflection.trim().slice(0, 500)}"

${LANG_INSTRUCTION[lang] ?? LANG_INSTRUCTION.fr}

Réponds UNIQUEMENT en JSON valide avec le champ "recommendation".`

  const attempts: string[] = []

  for (const model of GEMINI_MODELS) {
    try {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { response_mime_type: 'application/json' },
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        attempts.push(`${model}: HTTP ${response.status}`)
        continue
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) continue

      const parsed = JSON.parse(text) as { recommendation?: string }
      if (typeof parsed.recommendation === 'string' && parsed.recommendation.trim()) {
        return parsed.recommendation.trim()
      }
    } catch (err) {
      attempts.push(`${model}: ${err instanceof Error ? err.message : 'erreur'}`)
    }
  }

  console.warn('Verdict recommendation IA échouée:', attempts.join(' | '))
  return baseVerdict.recommendation
}
