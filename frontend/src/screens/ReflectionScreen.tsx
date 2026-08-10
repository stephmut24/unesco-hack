import { ResponseInput } from '../components/ResponseInput'
import { COPY } from '../data/content'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  value: string
  onChange: (value: string) => void
  onContinue: () => void
}

export function ReflectionScreen({ lang, value, onChange, onContinue }: Props) {
  const copy = COPY[lang]
  const ready = value.trim().length >= 8

  return (
    <div className="min-h-dvh bg-navy-deep text-white">
      <div className="app-shell flex min-h-dvh flex-col px-4 py-8">
        <span className="inline-flex w-fit rounded-full bg-white/10 px-3 py-1 font-display text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-sky-100">
          04 · {copy.thousandTestLabel}
        </span>

        <div className="mt-5 rounded-2xl bg-white/8 px-4 py-3.5 text-sm leading-relaxed text-sky-50/95">
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-wider text-sky-200">
            {copy.learnLabel}
          </p>
          <p className="mt-1.5">{copy.learnGoals[3]}</p>
        </div>

        <h1 className="mt-6 font-display text-[clamp(1.35rem,5.5vw,1.85rem)] font-bold leading-snug">
          {copy.reflectionTitle}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          {copy.reflectionHint}
        </p>

        <div className="mt-8 rounded-2xl bg-white/8 p-4">
          <ResponseInput
            value={value}
            onChange={onChange}
            placeholder={copy.reflectionHint}
            label={copy.reflectionTitle}
            dark
          />
        </div>

        <button
          type="button"
          disabled={!ready}
          onClick={onContinue}
          className="mt-auto inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-white font-display text-sm font-bold text-navy-deep disabled:cursor-not-allowed disabled:opacity-35"
        >
          {copy.seeVerdict}
        </button>
      </div>
    </div>
  )
}
