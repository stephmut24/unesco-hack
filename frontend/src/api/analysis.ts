import { isSupabaseConfigured } from '../lib/supabase'
import { normalizeRawEvaluation } from '../lib/mapAnalysis'
import {
  ANALYSIS_PHASES,
  type AnalysisInput,
  type AnalysisPhase,
  type AnalysisResult,
  type PhaseResponse,
  type PipelineContext,
} from '../types'

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Configuration Supabase manquante. Vérifie frontend/.env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).',
    )
  }
  return { url, key }
}

async function invokePhase(
  input: AnalysisInput,
  phase: AnalysisPhase,
  context: PipelineContext,
): Promise<PhaseResponse> {
  const { url, key } = getSupabaseConfig()
  const endpoint = `${url}/functions/v1/analyze-content`

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...input, phase, context }),
    })
  } catch (err) {
    const hint =
      err instanceof TypeError
        ? ' Connexion impossible — vérifie internet, DNS, VPN ou bloqueur de pub.'
        : ''
    throw new Error(`Impossible de joindre l'Edge Function (phase ${phase}).${hint}`)
  }

  const data = (await response.json()) as PhaseResponse

  if (!response.ok || !data?.success) {
    throw new Error(data?.error ?? `Erreur phase ${phase} (HTTP ${response.status})`)
  }

  return data
}

export type PipelineProgress = {
  phase: AnalysisPhase
  phaseIndex: number
  summary: string
  completedPhases: number
}

/** Exécute les 4 phases séquentiellement, synchronisées avec l'écran d'analyse */
export async function runMediaAnalysisPipeline(
  input: AnalysisInput,
  onProgress?: (progress: PipelineProgress) => void,
): Promise<AnalysisResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase non configuré — voir frontend/.env')
  }

  let context: PipelineContext = {}

  for (let i = 0; i < ANALYSIS_PHASES.length; i++) {
    const phase = ANALYSIS_PHASES[i]
    const data = await invokePhase(input, phase, context)
    context = data.context

    onProgress?.({
      phase,
      phaseIndex: data.phaseIndex,
      summary: data.summary,
      completedPhases: i + 1,
    })

    if (phase === 'synthesis' && data.result) {
      return {
        ...data.result,
        dimensions: normalizeRawEvaluation(data.result.dimensions),
      }
    }
  }

  throw new Error('Pipeline incomplet — phase synthesis sans résultat')
}

/** Appel monolithique (compat) — exécute les 4 phases côté serveur en une requête */
export async function runMediaAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase non configuré — voir frontend/.env')
  }

  const { url, key } = getSupabaseConfig()
  const endpoint = `${url}/functions/v1/analyze-content`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  const data = (await response.json()) as PhaseResponse

  if (!response.ok || !data?.success || !data.result) {
    throw new Error(data?.error ?? 'Analyse échouée')
  }

  return {
    ...data.result,
    dimensions: normalizeRawEvaluation(data.result.dimensions),
  }
}
