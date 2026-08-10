import type { Variants } from 'motion/react'
import { easeOutExpo, springSettle, staggerHero } from './tokens'

/** Texte intact dans un masque — seul le mouvement change */
export const clipUp: Variants = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
}

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export const heroGroup: Variants = {
  hidden: {},
  show: {
    transition: staggerHero,
  },
}

export const compassEnter: Variants = {
  hidden: { opacity: 0, scale: 0.86, rotate: -12 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { ...springSettle, delay: 0.05 },
  },
}

export const pageShell: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
}

export const pageBlock: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: springSettle,
  },
}
