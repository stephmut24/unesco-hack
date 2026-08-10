import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { buildAnalysisPrompt, buildMockEvaluation } from './prompt.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ContentType = 'url' | 'text' | 'image'
type Lang = 'fr' | 'en' | 'ln' | 'sw'

type AnalysisRequest = {
  type: ContentType
  value: string
  imageBase64?: string
  lang?: Lang
  sessionId?: string
}

const DIMENSION_KEYS = ['source', 'evidence', 'intent', 'transmission', 'impact'] as const

function hashContent(type: ContentType, value: string): string {
  if (type === 'url') {
    try {
      return new URL(value).hostname
    } catch {
      return `url-invalid-${value.length}`
    }
  }
  return `${type}-${value.length}-${value.slice(0, 64)}`
}

async function fetchWhois(domain: string, apiKey: string | undefined) {
  if (!apiKey) return { createdDate: 'Inconnue', limited: true }

  const url =
    `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}` +
    `&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Whois HTTP ${res.status}`)
  const data = await res.json()
  return {
    createdDate: data.WhoisRecord?.createdDate ?? 'Inconnue',
    limited: false,
  }
}

const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash']

async function callGemini(prompt: string, apiKey: string): Promise<Record<string, unknown>> {
  let lastError = 'Gemini indisponible'

  for (const model of GEMINI_MODELS) {
    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { response_mime_type: 'application/json' },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      lastError = `Gemini ${model} HTTP ${response.status}: ${JSON.stringify(data).slice(0, 200)}`
      console.error(lastError)
      continue
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      lastError = `Gemini ${model}: réponse vide`
      console.error(lastError, JSON.stringify(data).slice(0, 200))
      continue
    }

    return JSON.parse(text)
  }

  throw new Error(lastError)
}

async function callOpenAI(prompt: string, apiKey: string): Promise<Record<string, unknown>> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu réponds uniquement en JSON valide, sans markdown.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(`OpenAI HTTP ${response.status}: ${JSON.stringify(data).slice(0, 200)}`)
  }

  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('OpenAI: réponse vide')

  return JSON.parse(text)
}

async function callLLM(prompt: string): Promise<{ raw: Record<string, unknown>; provider: string }> {
  const geminiKey = Deno.env.get('GEMINI_API_KEY')
  const openaiKey = Deno.env.get('OPENAI_API_KEY')

  if (geminiKey) {
    try {
      const raw = await callGemini(prompt, geminiKey)
      return { raw, provider: 'gemini' }
    } catch (err) {
      console.error('Gemini échec:', err)
    }
  }

  if (openaiKey) {
    const raw = await callOpenAI(prompt, openaiKey)
    return { raw, provider: 'openai' }
  }

  throw new Error('Aucune clé IA disponible (GEMINI_API_KEY ou OPENAI_API_KEY)')
}

function extractDimensions(raw: Record<string, unknown>) {
  const dimensions: Record<string, unknown> = {}
  for (const key of DIMENSION_KEYS) {
    dimensions[key] = raw[key] ?? null
  }
  const confidenceScore =
    typeof raw.confidenceScore === 'number' ? raw.confidenceScore : 0.65
  return { dimensions, confidenceScore }
}

/** Label global dérivé des statuts des 5 dimensions */
function computeFinalScoreLabel(dimensions: Record<string, unknown>): string {
  const statuses = DIMENSION_KEYS.map((key) => {
    const dim = dimensions[key] as { status?: string } | null
    return dim?.status ?? 'warning'
  })
  if (statuses.includes('risk')) return 'risk'
  if (statuses.includes('warning')) return 'warning'
  return 'safe'
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = (await req.json()) as AnalysisRequest
    const {
      type = 'text',
      value,
      imageBase64,
      lang = 'fr',
      sessionId = crypto.randomUUID(),
    } = body

    if (!value?.trim() && !imageBase64) {
      return json({ success: false, error: 'Contenu vide' }, 400)
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    let degraded = false
    let techFacts: Record<string, unknown> = { inputType: type, limited: false }

    if (type === 'url') {
      const domain = new URL(value).hostname
      techFacts = {
        inputType: type,
        domain,
        isSecure: value.startsWith('https'),
        limited: false,
      }
      try {
        const whois = await fetchWhois(domain, Deno.env.get('WHOIS_XML_API_KEY'))
        techFacts.createdDate = whois.createdDate
        if (whois.limited) {
          techFacts.limited = true
          degraded = true
        }
      } catch {
        techFacts.limited = true
        degraded = true
      }
    }

    const contentForPrompt =
      type === 'image'
        ? `[Image] ${value}${imageBase64 ? ' (base64 fourni pour analyse visuelle)' : ''}`
        : value

    let aiRaw: Record<string, unknown>
    let aiProvider: string | undefined
    let aiError: string | undefined

    try {
      const prompt = buildAnalysisPrompt(type, contentForPrompt, techFacts as never, lang)
      const llm = await callLLM(prompt)
      aiRaw = llm.raw
      aiProvider = llm.provider
    } catch (err) {
      aiError = err instanceof Error ? err.message : 'Erreur IA inconnue'
      console.error('LLM échec:', aiError)
      aiRaw = buildMockEvaluation(true)
      degraded = true
    }

    const { dimensions, confidenceScore } = extractDimensions(aiRaw)
    const finalScoreLabel = computeFinalScoreLabel(dimensions)

    const contentHash = hashContent(type, value)
    const { data: contentData, error: contentError } = await supabaseClient
      .from('contents')
      .upsert(
        {
          url_hash: contentHash,
          raw_text: value,
          forensic_metadata: { ...techFacts, confidenceScore },
          content_type: type,
        },
        { onConflict: 'url_hash' },
      )
      .select()
      .single()

    if (contentError) console.error('contents insert:', contentError)

    let analysisId = crypto.randomUUID()

    if (contentData) {
      const { data: analysisData, error: analysisError } = await supabaseClient
        .from('analyses')
        .insert({
          session_id: sessionId,
          content_id: contentData.id,
          ai_suggestion: { dimensions, confidenceScore },
          final_score_label: finalScoreLabel,
        })
        .select('id')
        .single()

      if (analysisError) console.error('analyses insert:', analysisError)
      if (analysisData?.id) analysisId = analysisData.id
    }

    return json({
      success: true,
      result: {
        analysisId,
        dimensions,
        confidenceScore,
        techFacts,
        degraded,
        aiProvider,
        aiError,
      },
    })
  } catch (error: unknown) {
    console.error(error)
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return json({ success: false, error: message }, 500)
  }
})

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
