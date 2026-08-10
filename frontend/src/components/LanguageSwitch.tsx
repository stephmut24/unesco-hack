import type { Lang } from '../types'
import { COPY } from '../data/content'

const LABELS: Record<Lang, string> = {
  fr: 'FR',
  en: 'EN',
  ln: 'LN',
  sw: 'SW',
}

type Props = {
  value: Lang
  onChange: (lang: Lang) => void
}

export function LanguageSwitch({ value, onChange }: Props) {
  return (
    <div
      className="inline-flex overflow-hidden rounded-md border border-white/25 bg-white/10 text-[0.7rem] font-semibold text-white"
      role="group"
      aria-label={COPY[value].languageLabel}
    >
      {(Object.keys(LABELS) as Lang[]).map((lang, i) => {
        const active = value === lang
        return (
          <button
            key={lang}
            type="button"
            onClick={() => onChange(lang)}
            className={`min-h-10 min-w-9 px-1.5 sm:min-w-10 ${
              i > 0 ? 'border-l border-white/20' : ''
            } ${active ? 'bg-white text-navy' : 'hover:bg-white/10'}`}
            aria-pressed={active}
          >
            {LABELS[lang]}
          </button>
        )
      })}
    </div>
  )
}
