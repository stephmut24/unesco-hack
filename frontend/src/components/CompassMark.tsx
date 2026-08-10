import { useEffect, useRef } from 'react'

type Props = {
  size?: number
  className?: string
  /** Full landing choreography. */
  animate?: boolean
}

/** Choreographed bearings — soft dwell at North, then seek again. */
const BEARINGS: { angle: number; dwellMs: number }[] = [
  { angle: -42, dwellMs: 160 },
  { angle: 58, dwellMs: 120 },
  { angle: -78, dwellMs: 200 },
  { angle: 26, dwellMs: 100 },
  { angle: 108, dwellMs: 180 },
  { angle: -18, dwellMs: 140 },
  { angle: 0, dwellMs: 1100 },
  { angle: 48, dwellMs: 140 },
  { angle: -62, dwellMs: 180 },
  { angle: 82, dwellMs: 160 },
  { angle: -28, dwellMs: 120 },
  { angle: 14, dwellMs: 100 },
  { angle: 0, dwellMs: 900 },
]

function shortestDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180
}

/** Educational compass — fluid spring needle in continuous loop. */
export function CompassMark({
  size = 40,
  className = '',
  animate = false,
}: Props) {
  const needleRef = useRef<SVGGElement>(null)
  const tipRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!animate) return
    const el = needleRef.current
    const tip = tipRef.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.setAttribute('transform', 'rotate(0 48 48)')
      el.setAttribute('opacity', '1')
      return
    }

    el.setAttribute('opacity', '1')

    let angle = -55
    let velocity = 0
    let targetAbs = BEARINGS[0].angle
    let index = 0
    let dwellUntil = 0
    let last = performance.now()
    let raf = 0

    // Spring tuned for a heavy needle feel
    const stiffness = 38
    const damping = 9.2
    const settleEps = 0.35
    const settleVel = 4

    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now

      if (now >= dwellUntil) {
        const delta = shortestDelta(angle, targetAbs)
        const accel = delta * stiffness - velocity * damping
        velocity += accel * dt
        angle += velocity * dt

        const settled =
          Math.abs(shortestDelta(angle, targetAbs)) < settleEps &&
          Math.abs(velocity) < settleVel

        if (settled) {
          angle = targetAbs
          velocity = 0
          dwellUntil = now + BEARINGS[index].dwellMs
          index = (index + 1) % BEARINGS.length
          // Keep absolute target coherent with continuous angle
          const next = BEARINGS[index].angle
          targetAbs = angle + shortestDelta(angle, next)
        }
      }

      el.setAttribute('transform', `rotate(${angle} 48 48)`)

      // Subtle tip emphasis when moving fast (fluid, not flashy)
      if (tip) {
        const speed = Math.min(1, Math.abs(velocity) / 140)
        tip.setAttribute('opacity', String(0.82 + speed * 0.18))
      }

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [animate])

  if (!animate) {
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
        <path
          d="M24 5v5M24 38v5M5 24h5M38 24h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M24 12 L27.2 24 L24 36 L20.8 24 Z" fill="currentColor" />
        <circle
          cx="24"
          cy="24"
          r="3.2"
          fill="#F9FAFB"
          stroke="currentColor"
          strokeWidth="1.5"
        />
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

  return (
    <div
      className={`landing-compass-stage ${className}`.trim()}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 96 96"
        width={size}
        height={size}
        className="landing-compass"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="lc-disc"
          cx="48"
          cy="48"
          r="44"
          fill="currentColor"
          fillOpacity="0.04"
        />

        <circle
          className="lc-ring lc-ring-outer"
          cx="48"
          cy="48"
          r="40"
          stroke="currentColor"
          strokeWidth="2.25"
          strokeOpacity="0.35"
        />
        <circle
          className="lc-ring lc-ring-mid"
          cx="48"
          cy="48"
          r="32"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.28"
        />
        <circle
          className="lc-ring lc-ring-inner"
          cx="48"
          cy="48"
          r="22"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeOpacity="0.4"
        />

        <g className="lc-degrees" stroke="currentColor" strokeLinecap="round">
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * 30 * Math.PI) / 180
            const major = i % 3 === 0
            const r0 = major ? 35.5 : 37
            const r1 = 40
            return (
              <line
                key={i}
                className={`lc-deg ${major ? 'lc-deg-major' : ''}`}
                style={{ ['--deg-i' as string]: String(i) }}
                x1={48 + Math.sin(a) * r0}
                y1={48 - Math.cos(a) * r0}
                x2={48 + Math.sin(a) * r1}
                y2={48 - Math.cos(a) * r1}
                strokeWidth={major ? 2 : 1.25}
                strokeOpacity={major ? 0.55 : 0.28}
              />
            )
          })}
        </g>

        <g
          className="lc-cardinals-ticks"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <line className="lc-tick-n" x1="48" y1="8" x2="48" y2="16" />
          <line x1="48" y1="80" x2="48" y2="88" strokeOpacity="0.45" />
          <line x1="8" y1="48" x2="16" y2="48" strokeOpacity="0.45" />
          <line x1="80" y1="48" x2="88" y2="48" strokeOpacity="0.45" />
        </g>

        <g
          className="lc-letters"
          fill="currentColor"
          fontFamily="Montserrat, sans-serif"
          fontWeight="700"
          textAnchor="middle"
        >
          <text className="lc-letter lc-letter-n" x="48" y="7.5" fontSize="8">
            N
          </text>
          <text
            className="lc-letter lc-letter-e"
            x="91"
            y="51.5"
            fontSize="6.5"
            fillOpacity="0.55"
          >
            E
          </text>
          <text
            className="lc-letter lc-letter-s"
            x="48"
            y="93"
            fontSize="6.5"
            fillOpacity="0.55"
          >
            S
          </text>
          <text
            className="lc-letter lc-letter-w"
            x="5"
            y="51.5"
            fontSize="6.5"
            fillOpacity="0.55"
          >
            W
          </text>
        </g>

        <g ref={needleRef} transform="rotate(-55 48 48)" opacity={1}>
          <path
            d="M48 48 L53.2 70 L48 78 L42.8 70 Z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <path
            ref={tipRef}
            d="M48 12 L55.2 48 L48 54 L40.8 48 Z"
            fill="#2563a8"
          />
        </g>

        <circle
          className="lc-pivot"
          cx="48"
          cy="48"
          r="4.4"
          fill="#F8FAFC"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle
          className="lc-pivot-dot"
          cx="48"
          cy="48"
          r="1.7"
          fill="currentColor"
          fillOpacity="0.75"
        />

        <line
          className="lc-lock"
          x1="48"
          y1="8"
          x2="48"
          y2="16"
          stroke="#2563a8"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
