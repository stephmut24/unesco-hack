import type { Step } from '../types'

const ORDER: Step[] = [
  'entry',
  'analysis',
  'coanalysis',
  'reflection',
  'verdict',
]

type Props = {
  current: Step
  labels: string[]
}

export function LearningRail({ current, labels }: Props) {
  const activeIndex = ORDER.indexOf(current)

  return (
    <nav aria-label="Parcours d'apprentissage" className="w-full">
      <ol className="flex items-center gap-0.5">
        {ORDER.map((step, i) => {
          const done = i < activeIndex
          const active = i === activeIndex
          return (
            <li key={step} className="flex min-w-0 flex-1 items-center gap-0.5">
              <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-display text-xs font-bold ${
                    done
                      ? 'bg-ok text-white'
                      : active
                        ? 'bg-navy text-white'
                        : 'bg-panel text-muted'
                  }`}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? '✓' : i + 1}
                </span>
                <span
                  className={`hidden truncate text-center text-[0.62rem] font-semibold sm:block ${
                    active ? 'text-navy' : 'text-muted'
                  }`}
                >
                  {labels[i]}
                </span>
              </div>
              {i < ORDER.length - 1 ? (
                <span
                  className={`mb-5 hidden h-1 w-full max-w-8 flex-1 rounded-full sm:block ${
                    done ? 'bg-ok/50' : 'bg-panel'
                  }`}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
