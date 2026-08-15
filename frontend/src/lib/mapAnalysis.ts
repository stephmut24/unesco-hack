import { getDimensionLabels } from '../data/content'
import {
  DIMENSION_KEYS,
  type DimensionEval,
  type Lang,
  type RawAiDimension,
  type RawAiEvaluation,
  type RiskLevel,
} from '../types'

const DEFAULT_DIMENSION: RawAiDimension = {
  aiSuggestion: 'Indéterminé',
  aiSummary: 'Analyse partielle — données insuffisantes pour produire une synthèse.',
  confidence: 0.5,
  status: 'warning',
  technicalReasons: ['Analyse partielle — données insuffisantes'],
}

function normalizeStatus(value: unknown): RiskLevel {
  if (value === 'safe' || value === 'warning' || value === 'risk') return value
  return 'warning'
}

function normalizeDimension(raw: unknown): RawAiDimension {
  if (!raw || typeof raw !== 'object') return DEFAULT_DIMENSION

  const d = raw as Record<string, unknown>
  const reasons = Array.isArray(d.technicalReasons)
    ? d.technicalReasons.filter((r): r is string => typeof r === 'string')
    : Array.isArray(d.technical_reasons)
      ? d.technical_reasons.filter((r): r is string => typeof r === 'string')
      : typeof d.reason === 'string'
        ? [d.reason]
        : typeof d.explanation === 'string'
          ? [d.explanation]
          : DEFAULT_DIMENSION.technicalReasons

  const aiSuggestion =
    typeof d.aiSuggestion === 'string'
      ? d.aiSuggestion
      : typeof d.ai_suggestion === 'string'
        ? d.ai_suggestion
        : DEFAULT_DIMENSION.aiSuggestion

  const aiSummary =
    typeof d.aiSummary === 'string'
      ? d.aiSummary
      : typeof d.ai_summary === 'string'
        ? d.ai_summary
        : typeof d.summary === 'string'
          ? d.summary
          : typeof d.explanation === 'string'
            ? d.explanation
            : aiSuggestion

  return {
    aiSuggestion,
    aiSummary,
    confidence:
      typeof d.confidence === 'number'
        ? Math.min(1, Math.max(0, d.confidence))
        : typeof d.confidence_score === 'number'
          ? Math.min(1, Math.max(0, d.confidence_score))
          : DEFAULT_DIMENSION.confidence,
    status: normalizeStatus(d.status),
    technicalReasons: reasons.length > 0 ? reasons : DEFAULT_DIMENSION.technicalReasons,
  }
}

/** Normalise la réponse brute de l'Edge Function */
export function normalizeRawEvaluation(raw: unknown): RawAiEvaluation {
  const source = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}

  return Object.fromEntries(
    DIMENSION_KEYS.map((key) => [key, normalizeDimension(source[key])]),
  ) as RawAiEvaluation
}

/** Fusionne les données backend avec les labels i18n pour l'affichage */
export function mapToDimensions(raw: RawAiEvaluation, lang: Lang): DimensionEval[] {
  const labels = getDimensionLabels(lang)

  return labels.map((label) => {
    const ai = raw[label.key] ?? DEFAULT_DIMENSION
    return {
      ...label,
      aiSuggestion: ai.aiSuggestion,
      aiSummary: ai.aiSummary,
      confidence: ai.confidence,
      status: ai.status,
      technicalReasons: ai.technicalReasons,
    }
  })
}
