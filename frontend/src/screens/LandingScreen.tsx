import { ArrowRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { CompassMark } from '../components/CompassMark'
import { LanguageSwitch } from '../components/LanguageSwitch'
import { COPY } from '../data/content'
import { easeOutExpo, springSnap } from '../motion/tokens'
import { clipUp, compassEnter, fadeRise, heroGroup } from '../motion/variants'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  onStart: () => void
}

/** Masque de clip — le texte COPY n’est pas modifié */
function Mask({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`overflow-hidden ${className}`}>{children}</div>
}

export function LandingScreen({ lang, onLangChange, onStart }: Props) {
  const copy = COPY[lang]
  const reduce = useReducedMotion()

  return (
    <div className="landing-screen classroom relative min-h-dvh overflow-hidden">
      <div className="landing-grain pointer-events-none absolute inset-0" aria-hidden />
      <motion.div
        className="landing-orb landing-orb-a"
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easeOutExpo }}
      />
      <motion.div
        className="landing-orb landing-orb-b"
        aria-hidden
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.15 }}
      />

      <header className="landing-header relative z-20 flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <motion.p
          className="font-display text-[0.68rem] font-bold uppercase tracking-[0.16em] text-accent"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.04 }}
        >
          {copy.brand}
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.1 }}
        >
          <LanguageSwitch value={lang} onChange={onLangChange} tone="light" />
        </motion.div>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100dvh-4.25rem)] w-full max-w-3xl flex-col justify-center px-5 pb-10 pt-6 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:text-left">
          <motion.div
            className="relative mx-auto flex justify-center lg:mx-0"
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={compassEnter}
          >
            <div className="landing-compass-halo" aria-hidden />
            <CompassMark size={196} animate className="relative text-navy" />
          </motion.div>

          <motion.div
            key={lang}
            className="landing-copy text-center lg:text-left"
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={heroGroup}
          >
            <Mask className="mt-0">
              <motion.h1
                className="font-display text-[clamp(2.15rem,7vw,3.35rem)] font-bold leading-[0.98] tracking-tight text-navy"
                variants={clipUp}
              >
                <span className="landing-brand-line block">{copy.brand}</span>
              </motion.h1>
            </Mask>

            <Mask className="mt-4 mx-auto max-w-md lg:mx-0">
              <motion.p
                className="font-display text-[clamp(1.05rem,3.2vw,1.25rem)] font-semibold leading-snug text-ink"
                variants={clipUp}
              >
                {copy.landingHeadline}
              </motion.p>
            </Mask>

            <motion.p
              className="mt-3.5 max-w-md text-[1.05rem] leading-relaxed text-muted lg:mx-0 mx-auto"
              variants={fadeRise}
            >
              {copy.landingLead}
            </motion.p>

            <motion.div
              className="mt-8 flex justify-center lg:justify-start"
              variants={fadeRise}
            >
              <motion.button
                type="button"
                onClick={onStart}
                className="btn-primary landing-cta max-w-xs sm:w-auto sm:min-w-[14rem] sm:px-7"
                whileHover={reduce ? undefined : { y: -3 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={springSnap}
              >
                {copy.landingCta}
                <motion.span
                  className="inline-flex"
                  aria-hidden
                  whileHover={reduce ? undefined : { x: 4 }}
                  transition={springSnap}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </motion.button>
            </motion.div>

            <motion.p
              className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-muted lg:mx-0"
              variants={fadeRise}
            >
              {copy.footer}
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
