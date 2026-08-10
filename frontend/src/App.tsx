import { useEffect, useMemo, useState } from 'react'
import { LandingScreen } from './screens/LandingScreen'
import { EntryScreen } from './screens/EntryScreen'
import { AnalysisScreen } from './screens/AnalysisScreen'
import { CoAnalysisScreen } from './screens/CoAnalysisScreen'
import { ReflectionScreen } from './screens/ReflectionScreen'
import { VerdictScreen } from './screens/VerdictScreen'
import { PageTransition } from './components/PageTransition'
import { runMediaAnalysisPipeline } from './api/analysis'
import { saveUserEvaluation } from './api/evaluation'
import { COPY } from './data/content'
import { mapToDimensions } from './lib/mapAnalysis'
import { buildAnalysisInput } from './lib/validateInput'
import { computeVerdict } from './lib/verdict'
import {
  DIMENSION_KEYS,
  type AnalysisResult,
  type DimensionEval,
  type DimensionKey,
  type Lang,
  type Step,
  type UserChoice,
  type UserChoiceDetail,
} from './types'

const emptyChoices = (): Record<DimensionKey, UserChoice> =>
  Object.fromEntries(DIMENSION_KEYS.map((key) => [key, null])) as Record<
    DimensionKey,
    UserChoice
  >

function mapChoices(
  choices: Record<DimensionKey, UserChoice>,
): Record<DimensionKey, UserChoiceDetail> {
  return Object.fromEntries(
    DIMENSION_KEYS.map((key) => {
      const choice = choices[key]
      if (choice === 'modify') return [key, { action: 'modify' as const }]
      return [key, { action: 'confirm' as const }]
    }),
  ) as Record<DimensionKey, UserChoiceDetail>
}

function App() {
  const [lang, setLang] = useState<Lang>('fr')
  const [step, setStep] = useState<Step>('landing')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [choices, setChoices] = useState(emptyChoices)
  const [reflection, setReflection] = useState('')
  const [offline, setOffline] = useState(!navigator.onLine)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [dimensions, setDimensions] = useState<DimensionEval[]>([])
  const [completedPhases, setCompletedPhases] = useState(0)
  const [phaseSummaries, setPhaseSummaries] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const imagePreview = useMemo(() => {
    if (!imageFile) return null
    return URL.createObjectURL(imageFile)
  }, [imageFile])

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  useEffect(() => {
    const on = () => setOffline(false)
    const off = () => setOffline(true)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  const verdict = useMemo(() => {
    if (dimensions.length === 0) return null
    return computeVerdict(dimensions, choices, lang)
  }, [dimensions, choices, lang])

  const handleLaunch = async () => {
    setStep('analysis')
    setError(null)
    setAnalysisResult(null)
    setDimensions([])
    setCompletedPhases(0)
    setPhaseSummaries([])
    setChoices(emptyChoices())

    try {
      const input = await buildAnalysisInput(text, imageFile, lang)
      const result = await runMediaAnalysisPipeline(input, ({ completedPhases: done, summary }) => {
        setCompletedPhases(done)
        setPhaseSummaries((prev) => {
          const next = [...prev]
          next[done - 1] = summary
          return next
        })
      })
      setAnalysisResult(result)
      setDimensions(mapToDimensions(result.dimensions, lang))
      setStep('coanalysis')
    } catch (err) {
      console.error('Erreur boussole:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Désolé, la boussole a perdu le nord. Réessaye !',
      )
      setStep('entry')
    }
  }

  const handleReflectionContinue = async () => {
    setStep('verdict')

    if (!analysisResult) return

    try {
      await saveUserEvaluation({
        analysisId: analysisResult.analysisId,
        choices: mapChoices(choices),
        reflection,
      })
    } catch (err) {
      console.error('Erreur sauvegarde:', err)
    }
  }

  function restart() {
    setStep('landing')
    setText('')
    setImageFile(null)
    setChoices(emptyChoices())
    setReflection('')
    setAnalysisResult(null)
    setDimensions([])
    setCompletedPhases(0)
    setPhaseSummaries([])
    setError(null)
  }

  return (
    <>
      {offline ? (
        <div
          role="status"
          className="fixed inset-x-0 top-0 z-50 bg-amber-50 px-4 py-2.5 text-center text-sm font-medium text-ink shadow-sm"
        >
          {COPY[lang].offline}
        </div>
      ) : null}

      <PageTransition step={step}>
        {step === 'landing' ? (
          <LandingScreen
            lang={lang}
            onLangChange={setLang}
            onStart={() => setStep('entry')}
          />
        ) : null}

        {step === 'entry' ? (
          <EntryScreen
            lang={lang}
            onLangChange={setLang}
            text={text}
            onTextChange={setText}
            imagePreview={imagePreview}
            onImageSelect={setImageFile}
            onLaunch={handleLaunch}
            error={error}
          />
        ) : null}

        {step === 'analysis' ? (
          <AnalysisScreen
            lang={lang}
            completedPhases={completedPhases}
            phaseSummaries={phaseSummaries}
          />
        ) : null}

        {step === 'coanalysis' ? (
          <CoAnalysisScreen
            lang={lang}
            onLangChange={setLang}
            dimensions={dimensions}
            degraded={analysisResult?.degraded}
            choices={choices}
            onChoice={(key, choice) =>
              setChoices((prev) => ({ ...prev, [key]: choice }))
            }
            onContinue={() => setStep('reflection')}
          />
        ) : null}

        {step === 'reflection' ? (
          <ReflectionScreen
            lang={lang}
            value={reflection}
            onChange={setReflection}
            onContinue={handleReflectionContinue}
          />
        ) : null}

        {step === 'verdict' ? (
          <VerdictScreen
            lang={lang}
            choices={choices}
            reflection={reflection}
            verdict={verdict ?? undefined}
            degraded={analysisResult?.degraded}
            onRestart={restart}
          />
        ) : null}
      </PageTransition>
    </>
  )
}

export default App
