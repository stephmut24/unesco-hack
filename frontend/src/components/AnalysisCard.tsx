import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'
import type { DimensionEval, UserChoice } from '../types'

type Props = {
  dimension: DimensionEval
  choice: UserChoice
  whyLabel: string
  evidenceLabel: string
  yourDecision: string
  confirmLabel: string
  modifyLabel: string
  autoSuggestionLabel: string
  autoSuggestionText: (suggestion: string) => string
  confidenceLabel: string
  onChoice: (choice: Exclude<UserChoice, null>) => void
  index: number
}

const statusTone = {
  safe: 'bg-emerald-50 text-ok',
  warning: 'bg-amber-50 text-warn',
  risk: 'bg-red-50 text-danger',
} as const

export function AnalysisCard({
  dimension,
  choice,
  whyLabel,
  evidenceLabel,
  yourDecision,
  confirmLabel,
  modifyLabel,
  autoSuggestionLabel,
  autoSuggestionText,
  confidenceLabel,
  onChoice,
  index,
}: Props) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <article
      className="lesson-card fade-in p-5 sm:p-6"
      style={{ animationDelay: `${index * 35}ms` }}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-[0.68rem] font-bold tracking-[0.12em] text-accent">
            Leçon {String(index + 1).padStart(2, '0')} · {dimension.title}
          </p>
          <h3 className="mt-2 font-display text-[1.1rem] font-bold leading-snug text-ink">
            {dimension.question}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold ${statusTone[dimension.status]}`}
        >
          {Math.round(dimension.confidence * 100)}%
        </span>
      </header>

      <section className="mt-4 rounded-xl bg-accent-soft px-4 py-3.5">
        <p className="font-display text-[0.68rem] font-bold uppercase tracking-wider text-accent">
          {autoSuggestionLabel}
        </p>
        <p
          className="mt-1.5 text-sm leading-relaxed text-ink"
          role="status"
          aria-label={`${autoSuggestionLabel}: ${dimension.aiSuggestion}. ${confidenceLabel}`}
        >
          {autoSuggestionText(dimension.aiSuggestion)}
        </p>
        <p className="mt-1.5 text-xs text-muted">{confidenceLabel}</p>
      </section>

      <button
        type="button"
        className="mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-accent"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {whyLabel}
        <ChevronDown
          size={16}
          className={`transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open ? (
        <div id={panelId} className="mt-2 rounded-xl bg-panel px-4 py-3">
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider text-muted">
            {evidenceLabel}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-ink">
            {dimension.technicalReasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-5">
        <p className="mb-2.5 font-display text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {yourDecision}
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onChoice('confirm')}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${
              choice === 'confirm'
                ? 'bg-navy text-white'
                : 'bg-panel text-ink hover:bg-[#e2e8f2]'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={() => onChoice('modify')}
            className={`min-h-11 rounded-xl px-3 text-sm font-semibold ${
              choice === 'modify'
                ? 'bg-ink text-white'
                : 'bg-panel text-ink hover:bg-[#e2e8f2]'
            }`}
          >
            {modifyLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
