type Props = {
  height?: number
  className?: string
  priority?: boolean
}

const LOGO_SRC = '/Logo/logo.png'

export function BrandLogo({
  height = 72,
  className = '',
  priority = false,
}: Props) {
  const width = Math.round(height * 2.6)
  return (
    <img
      src={LOGO_SRC}
      alt="Media Compass — Think Before You Share"
      height={height}
      width={width}
      className={`block shrink-0 object-contain ${className}`}
      style={{ height, width: 'auto', maxHeight: height }}
      decoding="sync"
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
    />
  )
}
