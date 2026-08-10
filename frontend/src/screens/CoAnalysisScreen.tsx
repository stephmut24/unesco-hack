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
  onChoice: (key: DimensionKey, choice: Exclude<UserChoice, null>) => void
  onContinue: () => void
}

export function CoAnalysisScreen({
  lang,
  onLangChange,
  dimensions,
  degraded,
  choices,
  onChoice,
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
          disabled={!answered || dimensions.length === 0}
          onClick={onContinue}
          className="btn-primary"
        >
          {copy.continue}
        </button>
      }
    >
      <div className="space-y-4">
        {degraded ? (
          <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-warn">
            Analyse technique limitée — certains services étaient indisponibles.
          </p>
        ) : null}

        {dimensions.length === 0 ? (
          <p role="status" className="rounded-xl bg-panel px-4 py-6 text-center text-sm text-muted">
            Aucune analyse disponible. Relance une vérification depuis l&apos;écran précédent.
          </p>
        ) : (
          dimensions.map((dimension, index) => (
            <AnalysisCard
              key={dimension.key}
              dimension={dimension}
              index={index}
              choice={choices[dimension.key]}
              whyLabel={copy.why}
              evidenceLabel={copy.evidenceLabel}
              yourDecision={copy.yourDecision}
              confirmLabel={copy.confirm}
              modifyLabel={copy.modify}
              autoSuggestionLabel={copy.autoSuggestionLabel}
              autoSuggestionText={copy.autoSuggestionText}
              confidenceLabel={copy.confidence(dimension.confidence)}
              onChoice={(choice) => onChoice(dimension.key, choice)}
            />
          ))
        )}
      </div>
    </AppShell>
  )
}
