type Props = {
  size?: number
  className?: string
}

/** Simple educational compass mark — no sci-fi spin or needle theater. */
export function CompassMark({ size = 40, className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="21"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.22"
      />
      <circle
        cx="24"
        cy="24"
        r="15.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
      />
      {/* Cardinal ticks */}
      <path
        d="M24 5v5M24 38v5M5 24h5M38 24h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Needle — static N/S */}
      <path d="M24 12 L27.2 24 L24 36 L20.8 24 Z" fill="currentColor" />
      <circle cx="24" cy="24" r="3.2" fill="#F9FAFB" stroke="currentColor" strokeWidth="1.5" />
      <text
        x="24"
        y="11"
        textAnchor="middle"
        fill="currentColor"
        fontSize="5.5"
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
      >
        N
      </text>
    </svg>
  )
}
