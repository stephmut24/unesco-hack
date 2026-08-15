type Props = {
  score: number
  label: string
  explanation?: string
}

export function ProgressCompass({ score, label, explanation }: Props) {
  const clamped = Math.max(0, Math.min(100, score))
  const tone =
    clamped >= 70 ? '#178A63' : clamped >= 40 ? '#B7791F' : '#C23B2E'

  return (
    <div className="lesson-card p-5 sm:p-6">
      <div
        className="flex items-end justify-between gap-3"
        role="img"
        aria-label={`${label}: ${clamped}`}
      >
        <div>
          <p className="font-display text-5xl font-bold tabular-nums text-ink">
            {clamped}
          </p>
          <p className="mt-1.5 text-sm font-medium text-muted">{label}</p>
        </div>
        <div
          className="grid h-14 w-14 place-items-center rounded-xl bg-panel font-display text-sm font-bold"
          style={{ color: tone }}
          aria-hidden
        >
          {clamped >= 70 ? 'OK' : clamped >= 40 ? '!' : '!!'}
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-panel">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${clamped}%`, backgroundColor: tone }}
        />
      </div>
      {explanation ? (
        <p className="mt-3 text-sm leading-relaxed text-navy">{explanation}</p>
      ) : null}
    </div>
  )
}
