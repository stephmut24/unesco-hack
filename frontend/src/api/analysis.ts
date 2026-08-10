import { isSupabaseConfigured } from '../lib/supabase'
import { normalizeRawEvaluation } from '../lib/mapAnalysis'
import type {
  AnalysisInput,
  AnalysisResult,
  AnalyzeContentResponse,
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

export async function runMediaAnalysis(input: AnalysisInput): Promise<AnalysisResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase non configuré — voir frontend/.env')
  }

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
      body: JSON.stringify(input),
    })
  } catch (err) {
    const hint =
      err instanceof TypeError
        ? ' Connexion impossible — vérifie internet, DNS, VPN ou bloqueur de pub.'
        : ''
    throw new Error(`Impossible de joindre l'Edge Function.${hint}`)
  }

  let data: AnalyzeContentResponse
  try {
    data = (await response.json()) as AnalyzeContentResponse
  } catch {
    throw new Error(`Réponse invalide du serveur (HTTP ${response.status}).`)
  }

  if (!response.ok) {
    throw new Error(data?.error ?? `Erreur serveur HTTP ${response.status}`)
  }

  if (!data?.success || !data.result) {
    throw new Error(data?.error ?? 'Analyse échouée')
  }

  return {
    ...data.result,
    dimensions: normalizeRawEvaluation(data.result.dimensions),
  }
}
