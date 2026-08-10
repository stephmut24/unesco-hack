type Props = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  maxLength?: number
  label?: string
  dark?: boolean
}

export function ResponseInput({
  value,
  onChange,
  placeholder,
  maxLength = 280,
  label,
  dark = false,
}: Props) {
  return (
    <label className="block w-full">
      {label ? <span className="sr-only">{label}</span> : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={5}
        maxLength={maxLength}
        className={
          dark
            ? 'w-full resize-none rounded-xl border-0 bg-white/10 px-3.5 py-3 text-base leading-relaxed text-white outline-none placeholder:text-white/45 focus:bg-white/15 focus:shadow-[0_0_0_3px_rgba(255,255,255,0.15)]'
            : 'field'
        }
      />
      <span
        className={`mt-1.5 block text-right text-xs tabular-nums ${
          dark ? 'text-white/50' : 'text-muted'
        }`}
      >
        {value.length}/{maxLength}
      </span>
    </label>
  )
}
