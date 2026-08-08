import { useCallback, useEffect, useMemo, useState } from 'react'
import { EntryScreen } from './screens/EntryScreen'
import { AnalysisScreen } from './screens/AnalysisScreen'
import { CoAnalysisScreen } from './screens/CoAnalysisScreen'
import { ReflectionScreen } from './screens/ReflectionScreen'
import { VerdictScreen } from './screens/VerdictScreen'
import { COPY, MOCK_DIMENSIONS } from './data/content'
import type { DimensionKey, Lang, Step, UserChoice } from './types'

const emptyChoices = (): Record<DimensionKey, UserChoice> =>
  Object.fromEntries(MOCK_DIMENSIONS.map((d) => [d.key, null])) as Record<
    DimensionKey,
    UserChoice
  >

function App() {
  const [lang, setLang] = useState<Lang>('fr')
  const [step, setStep] = useState<Step>('entry')
  const [text, setText] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [choices, setChoices] = useState(emptyChoices)
  const [reflection, setReflection] = useState('')
  const [offline, setOffline] = useState(!navigator.onLine)

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

  const handleAnalysisDone = useCallback(() => setStep('coanalysis'), [])

  function restart() {
    setStep('entry')
    setText('')
    setImageFile(null)
    setChoices(emptyChoices())
    setReflection('')
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

      {step === 'entry' && (
        <EntryScreen
          lang={lang}
          onLangChange={setLang}
          text={text}
          onTextChange={setText}
          imagePreview={imagePreview}
          onImageSelect={setImageFile}
          onLaunch={() => setStep('analysis')}
        />
      )}

      {step === 'analysis' && (
        <AnalysisScreen lang={lang} onDone={handleAnalysisDone} />
      )}

      {step === 'coanalysis' && (
        <CoAnalysisScreen
          lang={lang}
          onLangChange={setLang}
          choices={choices}
          onChoice={(key, choice) =>
            setChoices((prev) => ({ ...prev, [key]: choice }))
          }
          onContinue={() => setStep('reflection')}
        />
      )}

      {step === 'reflection' && (
        <ReflectionScreen
          lang={lang}
          value={reflection}
          onChange={setReflection}
          onContinue={() => setStep('verdict')}
        />
      )}

      {step === 'verdict' && (
        <VerdictScreen
          lang={lang}
          choices={choices}
          reflection={reflection}
          onRestart={restart}
        />
      )}
    </>
  )
}

export default App
