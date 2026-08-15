import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import type { Step } from '../types'

type Props = {
  step: Step
  children: ReactNode
}

/** Transition de page sobre : fondu + léger décalage vertical. */
export function PageTransition({ step, children }: Props) {
  const reduce = useReducedMotion()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className="page-stage min-h-dvh"
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: reduce ? 0.15 : 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
