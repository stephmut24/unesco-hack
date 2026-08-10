import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { easeInOutSoft, springPage } from '../motion/tokens'
import type { Step } from '../types'

const ORDER: Step[] = [
  'landing',
  'entry',
  'analysis',
  'coanalysis',
  'reflection',
  'verdict',
]

type Props = {
  step: Step
  children: ReactNode
}

/**
 * Motion design — transition de page “bearing” :
 * glisse + légère rotation selon le sens du parcours.
 */
export function PageTransition({ step, children }: Props) {
  const reduce = useReducedMotion()
  const index = ORDER.indexOf(step)
  const prev = useRef(index)
  const direction = index >= prev.current ? 1 : -1
  prev.current = index

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step}
        className="page-stage min-h-dvh will-change-transform"
        custom={direction}
        initial={reduce ? { opacity: 0 } : 'enter'}
        animate={reduce ? { opacity: 1 } : 'center'}
        exit={reduce ? { opacity: 0, transition: { duration: 0.18 } } : 'exit'}
        variants={{
          enter: (dir: number) => ({
            opacity: 0,
            x: dir * 56,
            y: 24,
            scale: 0.97,
            rotate: dir * -1.4,
          }),
          center: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: {
              ...springPage,
              opacity: { duration: 0.4, ease: easeInOutSoft },
            },
          },
          exit: (dir: number) => ({
            opacity: 0,
            x: dir * -40,
            y: -16,
            scale: 0.985,
            rotate: dir * 0.8,
            transition: {
              duration: 0.28,
              ease: easeInOutSoft,
            },
          }),
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
