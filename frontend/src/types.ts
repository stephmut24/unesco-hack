export type Lang = 'fr' | 'en' | 'ln' | 'sw'

export type Step =
  | 'landing'
  | 'entry'
  | 'analysis'
  | 'coanalysis'
  | 'reflection'
  | 'verdict'

export type DimensionKey =
  | 'source'
  | 'evidence'
  | 'intent'
  | 'transmission'
  | 'impact'

export const DIMENSION_KEYS: DimensionKey[] = [
  'source',
  'evidence',
  'intent',
  'transmission',
  'impact',
]

export type RiskLevel = 'safe' | 'warning' | 'risk'

export type ContentType = 'url' | 'text' | 'image'

export type AnalysisPhase = 'source' | 'evidence' | 'technical' | 'synthesis'

export const ANALYSIS_PHASES: AnalysisPhase[] = [
  'source',
  'evidence',
  'technical',
  'synthesis',
]

/** Contexte accumulé entre les phases du pipeline */
export type PipelineContext = {
  techFacts?: TechFacts & Record<string, unknown>
  evidenceFacts?: Record<string, unknown>
  technicalSignals?: string[]
  degraded?: boolean
  aiProvider?: string
  aiError?: string
}

/** Labels i18n statiques (titre + question) — les données IA viennent du backend */
export type DimensionLabel = {
  key: DimensionKey
  title: string
  question: string
}

/** Affichage d'une dimension (labels UI + données backend) */
export type DimensionEval = DimensionLabel & {
  aiSuggestion: string
  aiSummary: string
  confidence: number
  status: RiskLevel
  technicalReasons: string[]
}

/** Données IA brutes pour une dimension (sans labels i18n) */
export type RawAiDimension = {
  aiSuggestion: string
  aiSummary: string
  confidence: number
  status: RiskLevel
  technicalReasons: string[]
}

export type RawAiEvaluation = Record<DimensionKey, RawAiDimension>

export type UserChoice = 'confirm' | 'modify' | null

export type UserChoiceDetail = {
  action: 'confirm' | 'modify'
  userOpinion?: string
}

/** Métadonnées forensiques collectées côté backend */
export type TechFacts = {
  domain?: string
  createdDate?: string
  isSecure?: boolean
  limited?: boolean
  inputType: ContentType
}

/** Payload envoyé à l'Edge Function analyze-content */
export type AnalysisInput = {
  type: ContentType
  value: string
  imageBase64?: string
  lang: Lang
  sessionId: string
  phase?: AnalysisPhase
  context?: PipelineContext
}

/** Résultat d'une phase du pipeline */
export type PhaseResponse = {
  success: boolean
  phase: AnalysisPhase
  phaseIndex: number
  summary: string
  context: PipelineContext
  result?: AnalysisResult
  error?: string
}

/** Réponse normalisée après analyse */
export type AnalysisResult = {
  analysisId: string
  dimensions: RawAiEvaluation
  confidenceScore: number
  techFacts: TechFacts
  degraded?: boolean
  aiProvider?: string
  aiError?: string
}

/** Payload envoyé à save-evaluation en fin de parcours */
export type UserEvaluation = {
  analysisId: string
  choices: Record<DimensionKey, UserChoiceDetail>
  reflection: string
  lang: Lang
}

/** Verdict calculé côté backend (save-evaluation) */
export type Verdict = {
  score: number
  label: string
  recommendation: string
}

/** Réponse API analyze-content */
export type AnalyzeContentResponse = {
  success: boolean
  result?: AnalysisResult
  error?: string
}

/** Réponse API save-evaluation */
export type SaveEvaluationResponse = {
  success: boolean
  verdict?: Verdict
  error?: string
}

export type ContentInput = {
  text: string
  imageFile: File | null
}
