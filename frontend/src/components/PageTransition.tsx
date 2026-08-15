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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0.12 : 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
