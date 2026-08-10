import { isSupabaseConfigured } from '../lib/supabase'
import type { SaveEvaluationResponse, UserEvaluation } from '../types'

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Configuration Supabase manquante.')
  return { url, key }
}

export async function saveUserEvaluation(evaluation: UserEvaluation): Promise<void> {
  if (!isSupabaseConfigured) return

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
    return
  }

  const data = (await response.json()) as SaveEvaluationResponse
  if (!response.ok || !data?.success) {
    console.warn('Sauvegarde échouée:', data?.error ?? response.status)
  }
}
