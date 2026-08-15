type Props = {
  height?: number
  className?: string
  priority?: boolean
}

const LOGO_SRC = '/Logo/logo.png'

export function BrandLogo({
  height = 52,
  className = '',
  priority = false,
}: Props) {
  return (
    <img
      src={LOGO_SRC}
      alt="Media Compass — Think Before You Share"
      height={height}
      width={Math.round(height * 2.6)}
      className={`block h-auto w-auto max-w-full object-contain ${className}`}
      style={{ height }}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
