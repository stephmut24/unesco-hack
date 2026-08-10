import { useEffect, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { ANALYSIS_STEPS, COPY } from '../data/content'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  onDone: () => void
}

export function AnalysisScreen({ lang, onDone }: Props) {
  const copy = COPY[lang]
  const steps = ANALYSIS_STEPS[lang]
  const [active, setActive] = useState(0)
  const progress = ((active + 1) / steps.length) * 100

  useEffect(() => {
    if (active >= steps.length - 1) {
      const done = window.setTimeout(onDone, 900)
      return () => window.clearTimeout(done)
    }
    const tick = window.setTimeout(() => setActive((v) => v + 1), 850)
    return () => window.clearTimeout(tick)
  }, [active, onDone, steps.length])

  return (
    <AppShell
      lang={lang}
      step="analysis"
      showLang={false}
      lessonEyebrow={`02 · ${copy.analysisRunningTitle}`}
      title={copy.analysisRunningHint}
      learnGoal={copy.learnGoals[1]}
    >
      <div className="lesson-card fade-in p-5 sm:p-6">
        <div className="mb-2 flex justify-between text-xs font-semibold text-muted">
          <span>{copy.analysisStep(active + 1, steps.length)}</span>
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
              i < active ? 'done' : i === active ? 'active' : 'pending'
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
                <span className="font-display w-7 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{stepItem}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </AppShell>
  )
}
