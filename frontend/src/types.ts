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

export type RiskLevel = 'safe' | 'warning' | 'risk'

export type DimensionEval = {
  key: DimensionKey
  title: string
  question: string
  aiSuggestion: string
  confidence: number
  status: RiskLevel
  technicalReasons: string[]
}

export type UserChoice = 'confirm' | 'modify' | null

export type ContentInput = {
  text: string
  imageFile: File | null
}
