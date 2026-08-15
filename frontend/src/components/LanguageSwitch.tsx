import type { Lang } from '../types'
import { COPY } from '../data/content'

const UI_LANGS = ['fr', 'en'] as const
const LABELS: Record<(typeof UI_LANGS)[number], string> = {
  fr: 'FR',
  en: 'EN',
}

type Props = {
  value: Lang
  onChange: (lang: Lang) => void
  /** dark = navy header; light = landing / pale surfaces */
  tone?: 'dark' | 'light'
}

export function LanguageSwitch({
  value,
  onChange,
  tone = 'dark',
}: Props) {
  const light = tone === 'light'

  return (
    <div
      className={
        light
          ? 'inline-flex overflow-hidden rounded-md border border-line bg-surface text-[0.7rem] font-semibold text-ink shadow-soft'
          : 'inline-flex overflow-hidden rounded-md border border-white/25 bg-white/10 text-[0.7rem] font-semibold text-white'
      }
      role="group"
      aria-label={COPY[value].languageLabel}
    >
      {UI_LANGS.map((lang, i) => {
        const active = value === lang
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            className={`min-h-10 min-w-9 px-1.5 sm:min-w-10 ${
              i > 0
                ? light
                  ? 'border-l border-line'
                  : 'border-l border-white/20'
                : ''
            } ${
              active
                ? light
                  ? 'bg-navy text-white'
                  : 'bg-white text-navy'
                : light
                  ? 'hover:bg-panel'
                  : 'hover:bg-white/10'
            }`}
            aria-pressed={active}
          >
            {LABELS[lang]}
          </button>
        )
      })}
    </div>
  )
}
