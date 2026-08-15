type Props = {
  title: string
  missing: readonly string[]
  impact: string
}

export function DegradedNotice({ title, missing, impact }: Props) {
  return (
    <div
      role="status"
      className="rounded-xl bg-amber-50 px-4 py-3.5 text-sm text-ink"
    >
      <p className="font-medium text-warn">{title}</p>
      {missing.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-4 text-ink">
          {missing.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      <p className="mt-2 text-xs leading-relaxed text-muted">{impact}</p>
    </div>
  )
}
