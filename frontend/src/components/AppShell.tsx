import type { ReactNode } from 'react'
import { BrandLogo } from './BrandLogo'
import { LanguageSwitch } from './LanguageSwitch'
import { LearningRail } from './LearningRail'
import { COPY } from '../data/content'
import type { Lang, Step } from '../types'

type Props = {
  lang: Lang
  step: Step
  onLangChange?: (lang: Lang) => void
  showLang?: boolean
  lessonEyebrow?: string
  title?: string
  learnGoal?: string
  children: ReactNode
  footer?: ReactNode
}

export function AppShell({
  lang,
  step,
  onLangChange,
  showLang = true,
  lessonEyebrow,
  title,
  learnGoal,
  children,
  footer,
}: Props) {
  const copy = COPY[lang]

  return (
    <div className="classroom min-h-dvh">
      <header className="sticky top-0 z-30 bg-navy shadow-[0_8px_24px_-16px_rgba(15,39,68,0.55)]">
        <div className="app-shell flex items-center justify-between gap-3 px-4 py-3.5">
          <BrandLogo height={44} priority className="max-w-[66%] rounded-md" />
          {showLang && onLangChange ? (
            <LanguageSwitch value={lang} onChange={onLangChange} />
          ) : null}
        </div>
      </header>

      <div className="app-shell px-4 pt-5">
        <div className="lesson-card px-4 py-4">
          <p className="mb-3 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent">
            {copy.moduleLabel}
          </p>
          <LearningRail
            current={step}
            labels={copy.railLabels}
            ariaLabel={copy.railAriaLabel}
          />
        </div>
      </div>

      <main
        className={`app-shell px-4 ${footer ? 'pb-28 pt-6' : 'py-6'}`}
      >
        {(lessonEyebrow || title) && (
          <div className="mb-6">
            {lessonEyebrow ? (
              <span className="pill-lesson">{lessonEyebrow}</span>
            ) : null}
            {title ? (
              <h1 className="mt-3.5 font-display text-[clamp(1.45rem,4.5vw,1.85rem)] font-bold leading-snug tracking-tight text-ink">
                {title}
              </h1>
            ) : null}
            {learnGoal ? (
              <div className="mt-4 rounded-2xl bg-accent-soft px-4 py-3.5 text-sm leading-relaxed text-navy">
                <p className="font-display text-[0.68rem] font-bold uppercase tracking-wider text-accent">
                  {copy.learnLabel}
                </p>
                <p className="mt-1.5">{learnGoal}</p>
              </div>
            ) : null}
          </div>
        )}
        <div>{children}</div>
      </main>

      {footer ? (
        <div className="fixed inset-x-0 bottom-0 z-30 bg-surface/95 p-4 shadow-[0_-12px_32px_-20px_rgba(16,24,40,0.35)] backdrop-blur-sm">
          <div className="app-shell">{footer}</div>
        </div>
      ) : null}
    </div>
  )
}
