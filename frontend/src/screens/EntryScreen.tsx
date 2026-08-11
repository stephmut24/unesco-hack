import { ImagePlus, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { AppShell } from '../components/AppShell'
import { COPY } from '../data/content'
import { pageBlock } from '../motion/variants'
import type { Lang } from '../types'

type Props = {
  lang: Lang
  onLangChange: (lang: Lang) => void
  text: string
  onTextChange: (value: string) => void
  imagePreview: string | null
  onImageSelect: (file: File | null) => void
  onLaunch: () => void
  onContinueOffline?: () => void
  error?: string | null
  loading?: boolean
  offline?: boolean
}

export function EntryScreen({
  lang,
  onLangChange,
  text,
  onTextChange,
  imagePreview,
  onImageSelect,
  onLaunch,
  onContinueOffline,
  error,
  loading = false,
  offline = false,
}: Props) {
  const copy = COPY[lang]
  const inputRef = useRef<HTMLInputElement>(null)
  const canLaunch = !loading && !offline && (text.trim().length > 0 || Boolean(imagePreview))
  const reduce = useReducedMotion()

  return (
    <AppShell
      lang={lang}
      step="entry"
      onLangChange={onLangChange}
      lessonEyebrow={`01 · ${copy.depositTitle}`}
      title={copy.tagline}
    >
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] sm:items-stretch"
        initial={reduce ? false : 'hidden'}
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.1, delayChildren: 0.05 },
          },
        }}
      >
        <motion.aside
          className="lesson-card goal-card flex flex-col justify-between p-5"
          variants={pageBlock}
        >
          <div>
            <p className="font-display text-[0.68rem] font-bold uppercase tracking-wider text-accent">
              {copy.learnLabel}
            </p>
            <p className="mt-2.5 text-[0.95rem] font-medium leading-relaxed text-navy">
              {copy.learnGoals[0]}
            </p>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted">{copy.footer}</p>
        </motion.aside>

        <motion.div className="lesson-card p-5" variants={pageBlock}>
          <div className="space-y-3.5">
            {error ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            ) : null}

            {offline ? (
              <p role="status" className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-warn">
                {copy.offlineCompass}
              </p>
            ) : null}

            <textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              placeholder={copy.placeholder}
              rows={5}
              aria-label={copy.placeholder}
              disabled={loading}
              className="field"
            />

            <div className="flex flex-wrap gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onImageSelect(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={loading}
                className="btn-quiet min-h-11"
              >
                <ImagePlus size={16} aria-hidden />
                {copy.addImage}
              </button>
              {imagePreview ? (
                <button
                  type="button"
                  onClick={() => {
                    onImageSelect(null)
                    if (inputRef.current) inputRef.current.value = ''
                  }}
                  disabled={loading}
                  className="btn-quiet min-h-11 text-danger"
                >
                  <X size={14} aria-hidden />
                  {copy.removeImage}
                </button>
              ) : null}
            </div>

            {imagePreview ? (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={imagePreview}
                  alt={copy.selectedImageAlt}
                  className="max-h-40 w-full object-cover"
                />
              </div>
            ) : null}

            <button
              type="button"
              disabled={!canLaunch}
              onClick={onLaunch}
              aria-busy={loading || undefined}
              className="btn-primary min-h-12"
            >
              {loading ? copy.launching : copy.launch}
            </button>

            {offline && onContinueOffline ? (
              <button
                type="button"
                onClick={onContinueOffline}
                className="btn-quiet min-h-12 w-full font-display text-sm font-bold"
              >
                {copy.continueWithoutAi}
              </button>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  )
}
