import { BrandLogo } from './BrandLogo'
import { LanguageSwitch } from './LanguageSwitch'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  onLangChange?: (lang: Lang) => void
  showLang?: boolean
}

export function AppHeader({ lang, onLangChange, showLang = true }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface">
      <div className="app-shell flex items-center justify-between gap-3 px-4 py-2.5">
        <BrandLogo height={72} priority className="max-w-[78%] rounded-md" />
        {showLang && onLangChange ? (
          <LanguageSwitch value={lang} onChange={onLangChange} tone="light" />
        ) : null}
      </div>
    </header>
  )
}
