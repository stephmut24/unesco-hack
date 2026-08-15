import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import { buildAnalysisPrompt, buildMockEvaluation } from './prompt.ts'
import {
  ANALYSIS_PHASES,
  type AnalysisPhase,
  type PipelineContext,
  runEvidencePhase,
  runSourcePhase,
  runTechnicalPhase,
} from './phases.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type ContentType = 'url' | 'text' | 'image'
type Lang = 'fr' | 'en' | 'ln' | 'sw'

type AnalysisRequest = {
  phase?: AnalysisPhase
  type: ContentType
  value: string
  imageBase64?: string
  lang?: Lang
  sessionId?: string
  context?: PipelineContext
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

// Modèles pour comptes Google AI Studio récents (2.x indisponibles pour nouveaux utilisateurs)
const GEMINI_MODELS = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
]

async function callGemini(prompt: string, apiKey: string): Promise<Record<string, unknown>> {
  const attempts: string[] = []

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
      const err = `Gemini ${model} HTTP ${response.status}: ${JSON.stringify(data).slice(0, 120)}`
      console.error(err)
      attempts.push(err)
      continue
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      attempts.push(`Gemini ${model}: réponse vide`)
      continue
    }

    return JSON.parse(text)
  }

  throw new Error(attempts.join(' | '))
}

async function callLLM(prompt: string): Promise<{ raw: Record<string, unknown>; provider: string }> {
  const geminiKey = Deno.env.get('GEMINI_API_KEY')

  if (!geminiKey) {
    throw new Error('Gemini: GEMINI_API_KEY absente')
  }

  try {
    return { raw: await callGemini(prompt, geminiKey), provider: 'gemini' }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur Gemini'
    console.error('Gemini échec:', msg)
    throw new Error(`Gemini: ${msg}`)
  }
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

function computeFinalScoreLabel(dimensions: Record<string, unknown>): string {
  const statuses = DIMENSION_KEYS.map((key) => {
    const dim = dimensions[key] as { status?: string } | null
    return dim?.status ?? 'warning'
  })
  if (statuses.includes('risk')) return 'risk'
  if (statuses.includes('warning')) return 'warning'
  return 'safe'
}

function buildRichPrompt(
  type: ContentType,
  value: string,
  imageBase64: string | undefined,
  lang: Lang,
  ctx: PipelineContext,
): string {
  const contentForPrompt =
    type === 'image'
      ? `[Image] ${value}${imageBase64 ? ' (base64 fourni)' : ''}`
      : value

  const techFacts = {
    ...(ctx.techFacts ?? {}),
    evidenceFacts: ctx.evidenceFacts,
    technicalSignals: ctx.technicalSignals,
  }

  return buildAnalysisPrompt(type, contentForPrompt, techFacts as never, lang)
}

async function runSynthesisPhase(
  type: ContentType,
  value: string,
  imageBase64: string | undefined,
  lang: Lang,
  sessionId: string,
  ctx: PipelineContext,
  supabaseClient: ReturnType<typeof createClient>,
): Promise<{ context: PipelineContext; summary: string; result: Record<string, unknown> }> {
  const forensicLimited = ctx.degraded ?? false
  let aiDegraded = false
  let aiProvider: string | undefined
  let aiError: string | undefined
  let aiRaw: Record<string, unknown>

  try {
    const prompt = buildRichPrompt(type, value, imageBase64, lang, ctx)
    const llm = await callLLM(prompt)
    aiRaw = llm.raw
    aiProvider = llm.provider
  } catch (err) {
    aiError = err instanceof Error ? err.message : 'Erreur IA'
    aiRaw = buildMockEvaluation(true)
    aiDegraded = true
  }

  // Bannière UI : uniquement si l'IA a échoué (pas si seule la collecte forensique est partielle)
  const degraded = aiDegraded

  const { dimensions, confidenceScore } = extractDimensions(aiRaw)
  const finalScoreLabel = computeFinalScoreLabel(dimensions)
  const techFacts = {
    ...(ctx.techFacts ?? {}),
    evidenceFacts: ctx.evidenceFacts,
    technicalSignals: ctx.technicalSignals,
    confidenceScore,
  }

  const contentHash = hashContent(type, value)
  const { data: contentData, error: contentError } = await supabaseClient
    .from('contents')
    .upsert(
      {
        url_hash: contentHash,
        raw_text: value,
        forensic_metadata: techFacts,
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

  const updatedContext: PipelineContext = {
    ...ctx,
    degraded,
    forensicLimited,
    aiProvider,
    aiError,
  }

  return {
    context: updatedContext,
    summary: aiDegraded
      ? 'Co-analyse préparée (mode dégradé — IA limitée)'
      : forensicLimited
        ? `Co-analyse prête — 5 dimensions (${aiProvider}, collecte partielle)`
        : `Co-analyse prête — 5 dimensions évaluées (${aiProvider})`,
    result: {
      analysisId,
      dimensions,
      confidenceScore,
      techFacts,
      degraded,
      aiProvider,
      aiError,
    },
  }
}

async function runPhase(
  phase: AnalysisPhase,
  type: ContentType,
  value: string,
  imageBase64: string | undefined,
  lang: Lang,
  sessionId: string,
  ctx: PipelineContext,
  supabaseClient: ReturnType<typeof createClient>,
) {
  const whoisKey = Deno.env.get('WHOIS_XML_API_KEY')
  const apiEnv = {
    safeBrowsingKey: Deno.env.get('GOOGLE_SAFE_BROWSING_API_KEY'),
    factCheckKey: Deno.env.get('GOOGLE_FACTCHECK_API_KEY'),
  }

  switch (phase) {
    case 'source':
      return runSourcePhase(type, value, whoisKey)
    case 'evidence':
      return runEvidencePhase(type, value, ctx, apiEnv)
    case 'technical':
      return runTechnicalPhase(type, value, ctx)
    case 'synthesis':
      return runSynthesisPhase(type, value, imageBase64, lang, sessionId, ctx, supabaseClient)
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = (await req.json()) as AnalysisRequest
    const {
      phase,
      type = 'text',
      value,
      imageBase64,
      lang = 'fr',
      sessionId = crypto.randomUUID(),
      context = {},
    } = body

    if (!value?.trim() && !imageBase64) {
      return json({ success: false, error: 'Contenu vide' }, 400)
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Pipeline complet si phase non spécifiée (compat curl)
    if (!phase) {
      let pipelineCtx: PipelineContext = {}
      let lastSummary = ''
      let finalResult: Record<string, unknown> | undefined

      for (const p of ANALYSIS_PHASES) {
        const out = await runPhase(
          p,
          type,
          value,
          imageBase64,
          lang,
          sessionId,
          pipelineCtx,
          supabaseClient,
        )
        pipelineCtx = out.context
        lastSummary = out.summary
        if ('result' in out && out.result) finalResult = out.result
      }

      return json({
        success: true,
        phase: 'synthesis',
        phaseIndex: 3,
        summary: lastSummary,
        context: pipelineCtx,
        result: finalResult,
      })
    }

    const phaseIndex = ANALYSIS_PHASES.indexOf(phase)
    if (phaseIndex === -1) {
      return json({ success: false, error: `Phase invalide: ${phase}` }, 400)
    }

    const output = await runPhase(
      phase,
      type,
      value,
      imageBase64,
      lang,
      sessionId,
      context,
      supabaseClient,
    )

    return json({
      success: true,
      phase,
      phaseIndex,
      summary: output.summary,
      context: output.context,
      result: 'result' in output ? output.result : undefined,
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
