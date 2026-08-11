import type {
  DimensionEval,
  DimensionKey,
  Lang,
  UserChoice,
  Verdict,
} from '../types'

const VERDICT_LABELS: Record<
  Lang,
  { safe: string; warning: string; risk: string; recommendations: Record<string, string> }
> = {
  fr: {
    safe: 'Contenu sain',
    warning: 'Prudence recommandée',
    risk: 'Risque élevé',
    recommendations: {
      safe: 'Tu peux partager en restant vigilant sur le contexte.',
      warning: 'Vérifie avant de partager. Consulte une source fiable.',
      risk: 'Ne partage pas. Vérifie sur PesaCheck ou une source officielle.',
    },
  },
  en: {
    safe: 'Healthy content',
    warning: 'Caution advised',
    risk: 'High risk',
    recommendations: {
      safe: 'You may share while staying mindful of context.',
      warning: 'Verify before sharing. Check a reliable source.',
      risk: 'Do not share. Verify on PesaCheck or an official source.',
    },
  },
  ln: {
    safe: 'Contenu malamu',
    warning: 'Bobateli esengeli',
    risk: 'Riski monene',
    recommendations: {
      safe: 'Okoki kokabisa kasi tala contexte.',
      warning: 'Tala liboso ya kokabisa.',
      risk: 'Kokabisa te. Tala na PesaCheck.',
    },
  },
  sw: {
    safe: 'Maudhui salama',
    warning: 'Tahadhari inapendekezwa',
    risk: 'Hatari kubwa',
    recommendations: {
      safe: 'Unaweza kushiriki ukizingatia muktadha.',
      warning: 'Thibitisha kabla ya kushiriki.',
      risk: 'Usishiriki. Thibitisha kwenye PesaCheck.',
    },
  },
}

const STATUS_WEIGHT: Record<string, number> = {
  safe: 0,
  warning: 1,
  risk: 2,
}

function averageRisk(dimensions: DimensionEval[]): number {
  if (dimensions.length === 0) return 1
  const sum = dimensions.reduce((acc, d) => acc + (STATUS_WEIGHT[d.status] ?? 1), 0)
  return sum / dimensions.length
}

export function computeVerdict(
  dimensions: DimensionEval[],
  choices: Record<DimensionKey, UserChoice>,
  lang: Lang,
): Verdict {
  const labels = VERDICT_LABELS[lang] ?? VERDICT_LABELS.fr
  const avgRisk = averageRisk(dimensions)

  const modified = Object.values(choices).filter((c) => c === 'modify').length
  const adjustedRisk = Math.min(2, avgRisk + modified * 0.15)

  let level: 'safe' | 'warning' | 'risk'
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
  }
}
