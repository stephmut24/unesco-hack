/** Media Compass — motion design tokens (Bearing system) */

export const easeOutExpo = [0.16, 1, 0.3, 1] as const
export const easeInOutSoft = [0.4, 0, 0.2, 1] as const

/** Spring “aiguille qui se cale” */
export const springSettle = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
  mass: 0.9,
}

/** Spring plus snappy (CTA, micro) */
export const springSnap = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 24,
  mass: 0.75,
}

/** Entrée page (parcours) */
export const springPage = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 18,
  mass: 0.95,
}

export const staggerFast = {
  staggerChildren: 0.08,
  delayChildren: 0.12,
}

export const staggerHero = {
  staggerChildren: 0.1,
  delayChildren: 0.35,
}
