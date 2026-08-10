import { Share2, RotateCcw } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { ProgressCompass } from '../components/ProgressCompass'
import { COPY } from '../data/content'
import type { DimensionKey, Lang, UserChoice } from '../types'

type Props = {
  lang: Lang
  choices: Record<DimensionKey, UserChoice>
  reflection: string
  onRestart: () => void
}

export function VerdictScreen({
  lang,
  choices,
  reflection,
  onRestart,
}: Props) {
  const copy = COPY[lang]
  const confirmed = Object.values(choices).filter((c) => c === 'confirm').length
  const modified = Object.values(choices).filter((c) => c === 'modify').length
  const score = Math.max(18, Math.min(92, 100 - confirmed * 8 - modified * 14))

  async function shareReflection() {
    const payload = `${copy.brand}\n${copy.verdictLabel}\n\n« ${reflection.trim()} »`
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.brand, text: payload })
        return
      } catch {
        /* ignore */
      }
    }
    await navigator.clipboard.writeText(payload)
  }

  return (
    <AppShell
      lang={lang}
      step="verdict"
      showLang={false}
      lessonEyebrow={`05 · ${copy.verdictTitle}`}
      title={copy.verdictLabel}
      learnGoal={copy.learnGoals[4]}
    >
      <div className="fade-in space-y-4">
        <ProgressCompass score={score} label={copy.riskConfidenceLabel} />

        <div className="lesson-card p-5 sm:p-6">
          <p className="font-display text-[0.68rem] font-bold uppercase tracking-wider text-accent">
            {copy.takeawayLabel}
          </p>
          <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-wide text-muted">
            {copy.reflectionCardTitle}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink">
            « {reflection.trim()} »
          </p>
          <p className="mt-3 text-xs text-muted">
            {copy.choiceCounts(confirmed, modified)}
          </p>
        </div>

        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={onRestart}
            className="btn-quiet min-h-12 w-full font-display text-sm font-bold"
          >
            <RotateCcw size={16} aria-hidden />
            {copy.newModule}
          </button>
          <button type="button" onClick={shareReflection} className="btn-primary">
            <Share2 size={16} aria-hidden />
            {copy.shareReflection}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
