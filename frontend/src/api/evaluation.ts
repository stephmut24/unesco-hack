import { isSupabaseConfigured } from '../lib/supabase'
import { computeVerdict } from '../lib/verdict'
import type { SaveEvaluationResponse, UserEvaluation, Verdict } from '../types'

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Configuration Supabase manquante.')
  return { url, key }
}

/** Sauvegarde la co-analyse et récupère le verdict calculé par le backend */
export async function saveUserEvaluation(
  evaluation: UserEvaluation,
  fallback?: () => Verdict,
): Promise<Verdict | null> {
  if (!isSupabaseConfigured) {
    return fallback?.() ?? null
  }

  const { url, key } = getSupabaseConfig()
  const endpoint = `${url}/functions/v1/save-evaluation`

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        apikey: key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluation),
    })
  } catch {
    console.warn('Sauvegarde impossible — Edge Function injoignable.')
    return fallback?.() ?? null
  }

  const data = (await response.json()) as SaveEvaluationResponse
  if (!response.ok || !data?.success) {
    console.warn('Sauvegarde échouée:', data?.error ?? response.status)
    return fallback?.() ?? null
  }

  return data.verdict ?? fallback?.() ?? null
}

/** Fallback local si le backend est indisponible (mode offline) */
export function computeLocalVerdict(
  ...args: Parameters<typeof computeVerdict>
): Verdict {
  return computeVerdict(...args)
}
