import { AnalysisCard } from '../components/AnalysisCard'
import { AppShell } from '../components/AppShell'
import { COPY } from '../data/content'
import type { DimensionEval, DimensionKey, Lang, UserChoice } from '../types'

type Props = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  dimensions: DimensionEval[]
  degraded?: boolean
  choices: Record<DimensionKey, UserChoice>
  opinions: Record<DimensionKey, string>
  onChoice: (key: DimensionKey, choice: Exclude<UserChoice, null>) => void
  onUserOpinion: (key: DimensionKey, text: string) => void
  onContinue: () => void
}

export function CoAnalysisScreen({
  lang,
  onLangChange,
  dimensions,
  degraded,
  choices,
  opinions,
  onChoice,
  onUserOpinion,
  onContinue,
}: Props) {
  const copy = COPY[lang]
  const answered = dimensions.every((d) => choices[d.key] !== null)
  const answeredCount = dimensions.filter((d) => choices[d.key] !== null).length

  return (
    <AppShell
      lang={lang}
      step="coanalysis"
      onLangChange={onLangChange}
      lessonEyebrow={`03 · ${copy.coAnalysisTitle}`}
      title={copy.coAnalysisHint(answeredCount, dimensions.length)}
      learnGoal={copy.learnGoals[2]}
      footer={
        <button
          type="button"
          disabled={dimensions.length > 0 ? !answered : false}
          onClick={onContinue}
          className="btn-primary min-h-12"
        >
          {copy.continue}
        </button>
      }
    >
      <div className="space-y-4">
        {degraded ? (
          <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-warn">
            {copy.degradedBanner}
          </p>
        ) : null}

        {dimensions.length === 0 ? (
          <div
            role="status"
            className="lesson-card px-5 py-10 text-center"
          >
            <p className="font-display text-sm font-semibold text-navy">
              {copy.emptyDimensionsTitle}
            </p>
            <p className="mt-2 text-sm text-muted">{copy.emptyDimensionsHint}</p>
          </div>
        ) : (
          dimensions.map((dimension, index) => (
            <AnalysisCard
              key={dimension.key}
              dimension={dimension}
              index={index}
              choice={choices[dimension.key]}
              userOpinion={opinions[dimension.key] ?? ''}
              whyLabel={copy.why}
              evidenceLabel={copy.evidenceLabel}
              yourDecision={copy.yourDecision}
              confirmLabel={copy.confirm}
              modifyLabel={copy.modify}
              modifyOpinionLabel={copy.modifyOpinionLabel}
              modifyOpinionPlaceholder={copy.modifyOpinionPlaceholder}
              autoSuggestionLabel={copy.autoSuggestionLabel}
              nuanceHint={copy.nuanceHint}
              confidenceLabel={copy.confidence(dimension.confidence)}
              onChoice={(choice) => onChoice(dimension.key, choice)}
              onUserOpinion={(text) => onUserOpinion(dimension.key, text)}
            />
          ))
        )}
      </div>
    </AppShell>
  )
}
