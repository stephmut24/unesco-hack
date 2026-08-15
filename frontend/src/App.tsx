import { useEffect, useMemo, useState } from 'react'
import { LandingScreen } from './screens/LandingScreen'
import { EntryScreen } from './screens/EntryScreen'
import { AnalysisScreen } from './screens/AnalysisScreen'
import { CoAnalysisScreen } from './screens/CoAnalysisScreen'
import { ReflectionScreen } from './screens/ReflectionScreen'
import { VerdictScreen } from './screens/VerdictScreen'
import { PageTransition } from './components/PageTransition'
import { AppHeader } from './components/AppHeader'
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

const emptyOpinions = (): Record<DimensionKey, string> =>
  Object.fromEntries(DIMENSION_KEYS.map((key) => [key, ''])) as Record<
    DimensionKey,
    string
  >

function mapChoices(
  choices: Record<DimensionKey, UserChoice>,
  opinions: Record<DimensionKey, string>,
): Record<DimensionKey, UserChoiceDetail> {
  return Object.fromEntries(
    DIMENSION_KEYS.map((key) => {
      const choice = choices[key]
      if (choice === 'modify') {
        const opinion = opinions[key]?.trim()
        return [
          key,
          {
            action: 'modify' as const,
            ...(opinion ? { userOpinion: opinion } : {}),
          },
        ]
      }
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
  const [opinions, setOpinions] = useState(emptyOpinions)
  const [reflection, setReflection] = useState('')
  const [offline, setOffline] = useState(!navigator.onLine)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [dimensions, setDimensions] = useState<DimensionEval[]>([])
  const [completedPhases, setCompletedPhases] = useState(0)
  const [phaseSummaries, setPhaseSummaries] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [launching, setLaunching] = useState(false)

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
    setLaunching(true)
    setStep('analysis')
    setError(null)
    setAnalysisResult(null)
    setDimensions([])
    setCompletedPhases(0)
    setPhaseSummaries([])
    setChoices(emptyChoices())
    setOpinions(emptyOpinions())

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
    } finally {
      setLaunching(false)
    }
  }

  function clearContentToEntry() {
    setText('')
    setImageFile(null)
    setChoices(emptyChoices())
    setOpinions(emptyOpinions())
    setReflection('')
    setAnalysisResult(null)
    setDimensions([])
    setCompletedPhases(0)
    setPhaseSummaries([])
    setError(null)
    setLaunching(false)
    setStep('entry')
  }

  function continueOffline() {
    setError(null)
    setAnalysisResult(null)
    setDimensions([])
    setChoices(emptyChoices())
    setOpinions(emptyOpinions())
    setStep('reflection')
  }

  const handleReflectionContinue = async () => {
    setStep('verdict')

    if (!analysisResult) return

    try {
      await saveUserEvaluation({
        analysisId: analysisResult.analysisId,
        choices: mapChoices(choices, opinions),
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
    setOpinions(emptyOpinions())
    setReflection('')
    setAnalysisResult(null)
    setDimensions([])
    setCompletedPhases(0)
    setPhaseSummaries([])
    setError(null)
    setLaunching(false)
  }

  const showAppHeader =
    step === 'entry' ||
    step === 'analysis' ||
    step === 'coanalysis' ||
    step === 'verdict'

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

      {showAppHeader ? (
        <AppHeader
          lang={lang}
          onLangChange={setLang}
          showLang={step !== 'analysis' && step !== 'verdict'}
        />
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
            onContinueOffline={continueOffline}
            error={error}
            loading={launching}
            offline={offline}
          />
        ) : null}

        {step === 'analysis' ? (
          <AnalysisScreen
            lang={lang}
            completedPhases={completedPhases}
            phaseSummaries={phaseSummaries}
            degraded={analysisResult?.degraded}
          />
        ) : null}

        {step === 'coanalysis' ? (
          <CoAnalysisScreen
            lang={lang}
            onLangChange={setLang}
            dimensions={dimensions}
            degraded={analysisResult?.degraded}
            choices={choices}
            opinions={opinions}
            onChoice={(key, choice) => {
              setChoices((prev) => ({ ...prev, [key]: choice }))
              if (choice === 'confirm') {
                setOpinions((prev) => ({ ...prev, [key]: '' }))
              }
            }}
            onUserOpinion={(key, text) =>
              setOpinions((prev) => ({ ...prev, [key]: text }))
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
            dimensions={dimensions}
            pesacheckUrl="https://pesacheck.org/"
            onRestart={restart}
            onDeleteContent={clearContentToEntry}
          />
        ) : null}
      </PageTransition>
    </>
  )
}

export default App
