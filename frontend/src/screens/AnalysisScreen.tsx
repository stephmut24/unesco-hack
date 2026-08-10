import { Check, Loader2 } from 'lucide-react'
import { AppShell } from '../components/AppShell'
import { ANALYSIS_STEPS, COPY } from '../data/content'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  /** Nombre de phases termin├®es (0ÔÇô4) */
  completedPhases: number
  /** R├®sum├® backend par ├®tape termin├®e */
  phaseSummaries?: string[]
  degraded?: boolean
}

export function AnalysisScreen({
  lang,
  completedPhases,
  phaseSummaries = [],
  degraded,
}: Props) {
  const copy = COPY[lang]
  const steps = ANALYSIS_STEPS[lang]
  const activeIndex = Math.min(completedPhases, steps.length - 1)
  const allDone = completedPhases >= steps.length
  const progress = allDone ? 100 : ((completedPhases + 0.5) / steps.length) * 100

  return (
    <AppShell
      lang={lang}
      step="analysis"
      showLang={false}
      lessonEyebrow={`02 ┬À ${copy.analysisRunningTitle}`}
      title={copy.analysisRunningHint}
      learnGoal={copy.learnGoals[1]}
    >
      <div className="space-y-4">
        {degraded && allDone ? (
          <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-warn">
            {copy.degradedBanner}
          </p>
        ) : null}

        <div className="lesson-card fade-in p-5 sm:p-6">
          <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
            <span>
              {copy.analysisStep(allDone ? steps.length : activeIndex + 1, steps.length)}
            </span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-panel">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="mt-5 space-y-2">
            {steps.map((stepItem, i) => {
              const state =
                i < completedPhases
                  ? 'done'
                  : i === completedPhases && !allDone
                    ? 'active'
                    : 'pending'
              const summary = phaseSummaries[i]

              return (
                <li
                  key={stepItem}
                  className={`flex gap-3 rounded-xl px-3.5 py-3.5 text-sm ${
                    state === 'active'
                      ? 'bg-accent-soft font-semibold text-ink'
                      : state === 'done'
                        ? 'bg-emerald-50 text-ok'
                        : 'bg-panel text-muted'
                  }`}
                >
                  <span className="flex w-7 shrink-0 items-start justify-center pt-0.5">
                    {state === 'done' ? (
                      <Check size={18} aria-label="Termin├®" />
                    ) : state === 'active' ? (
                      <Loader2
                        size={18}
                        className="animate-spin text-accent"
                        aria-label="En cours"
                      />
                    ) : (
                      <span className="font-display tabular-nums text-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <span>{stepItem}</span>
                    {summary && state === 'done' ? (
                      <p className="mt-1 text-xs font-normal leading-relaxed opacity-80">
                        {summary}
                      </p>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </AppShell>
  )
}
