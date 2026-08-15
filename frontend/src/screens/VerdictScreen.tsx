import { Share2, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AppShell } from '../components/AppShell'
import { DegradedNotice } from '../components/DegradedNotice'
import { ProgressCompass } from '../components/ProgressCompass'
import { COPY } from '../data/content'
import type { DimensionEval, DimensionKey, Lang, UserChoice, Verdict } from '../types'

type Props = {
  lang: Lang
  choices: Record<DimensionKey, UserChoice>
  reflection: string
  verdict?: Verdict
  degraded?: boolean
  dimensions?: DimensionEval[]
  onRestart: () => void
  onDeleteContent: () => void
}

const statusDot = {
  safe: 'bg-ok',
  warning: 'bg-warn',
  risk: 'bg-danger',
} as const

export function VerdictScreen({
  lang,
  choices,
  reflection,
  verdict,
  degraded,
  dimensions = [],
  onRestart,
  onDeleteContent,
}: Props) {
  const copy = COPY[lang]
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const confirmed = Object.values(choices).filter((c) => c === 'confirm').length
  const modified = Object.values(choices).filter((c) => c === 'modify').length
  const score =
    verdict?.score ?? Math.max(18, Math.min(92, 100 - confirmed * 8 - modified * 14))
  const verdictLabel = verdict?.label ?? copy.verdictLabel

  async function shareReflection() {
    const payload = `${copy.brand}\n${verdictLabel}\n\n« ${reflection.trim()} »`
    if (navigator.share) {
      try {
        await navigator.share({ title: copy.brand, text: payload })
        return
      } catch {
        /* ignore cancel */
      }
    }
    try {
      await navigator.clipboard.writeText(payload)
      setShareStatus(copy.shareCopied)
      window.setTimeout(() => setShareStatus(null), 2500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <AppShell
      lang={lang}
      step="verdict"
      showLang={false}
      lessonEyebrow={`05 · ${copy.verdictTitle}`}
      title={verdictLabel}
      learnGoal={copy.learnGoals[4]}
    >
      <div className="fade-in space-y-4">
        {degraded ? (
          <DegradedNotice
            title={copy.degradedBanner}
            missing={copy.degradedMissing}
            impact={copy.degradedImpact}
          />
        ) : null}

        <ProgressCompass
          score={score}
          label={copy.riskConfidenceLabel}
          explanation={copy.scoreExplanation(score)}
        />

        {verdict?.recommendation ? (
          <div className="lesson-card border-l-4 border-accent px-4 py-3.5">
            <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider text-accent">
              {copy.recommendationLabel}
            </p>
            <p className="mt-1.5 text-sm font-medium leading-relaxed text-navy">
              {verdict.recommendation}
            </p>
          </div>
        ) : null}

        {dimensions.length > 0 ? (
          <div className="lesson-card p-4">
            <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider text-muted">
              {copy.dimensionsSummaryLabel}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {dimensions.map((d) => (
                <li
                  key={d.key}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-panel px-2.5 text-xs font-semibold text-ink"
                >
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${statusDot[d.status]}`}
                    aria-hidden
                  />
                  <span>{d.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

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
            onClick={onDeleteContent}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-50 font-display text-sm font-bold text-danger"
          >
            <Trash2 size={16} aria-hidden />
            {copy.deleteContent}
          </button>
          <button type="button" onClick={shareReflection} className="btn-primary min-h-12">
            <Share2 size={16} aria-hidden />
            {copy.shareReflection}
          </button>
          <p className="px-1 text-center text-xs leading-relaxed text-muted">
            {copy.shareHint}
          </p>
          {shareStatus ? (
            <p role="status" className="text-center text-sm font-medium text-ok">
              {shareStatus}
            </p>
          ) : null}
          <button
            type="button"
            onClick={onRestart}
            className="btn-quiet min-h-12 w-full font-display text-sm font-bold"
          >
            <RotateCcw size={16} aria-hidden />
            {copy.newModule}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
