type Props = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  maxLength?: number
  minLength?: number
  label?: string
  dark?: boolean
}

export function ResponseInput({
  value,
  onChange,
  placeholder,
  maxLength = 280,
  minLength = 0,
  label,
  dark = false,
}: Props) {
  const len = value.trim().length
  const belowMin = minLength > 0 && len > 0 && len < minLength

  return (
    <label className="block w-full">
      {label ? <span className="sr-only">{label}</span> : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={5}
        maxLength={maxLength}
        aria-invalid={belowMin || undefined}
        className={
          dark
            ? 'w-full resize-none rounded-xl border-0 bg-white/10 px-3.5 py-3 text-base leading-relaxed text-white outline-none placeholder:text-white/45 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]'
            : 'field'
        }
      />
      <span
        className={`mt-1.5 flex justify-between gap-2 text-xs tabular-nums ${
          dark ? 'text-white/55' : 'text-muted'
        }`}
      >
        <span>
          {minLength > 0
            ? belowMin || len === 0
              ? `${Math.max(0, minLength - len)} min.`
              : ''
            : ''}
        </span>
        <span>
          {value.length}/{maxLength}
        </span>
      </span>
    </label>
  )
}
