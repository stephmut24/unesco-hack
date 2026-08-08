import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  className?: string
  interactive?: boolean
  accent?: 'navy' | 'accent' | 'ok' | 'warn' | 'danger' | 'none'
  style?: CSSProperties
}

const accents = {
  none: '',
  navy: 'before:bg-navy',
  accent: 'before:bg-accent',
  ok: 'before:bg-ok',
  warn: 'before:bg-warn',
  danger: 'before:bg-danger',
} as const

export function SurfaceCard({
  children,
  className = '',
  interactive = false,
  accent = 'none',
  style,
  ...rest
}: Props) {
  const hasAccent = accent !== 'none'
  return (
    <div
      {...rest}
      className={`card relative overflow-hidden ${interactive ? 'card-interactive' : ''} ${
        hasAccent
          ? `before:absolute before:inset-y-0 before:left-0 before:w-1 ${accents[accent]}`
          : ''
      } ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}
