import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'
import {
  computeVerdictScore,
  generateVerdictRecommendation,
  type Verdict,
} from './verdict.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type UserChoiceDetail = {
  action: 'confirm' | 'modify'
  userOpinion?: string
}

type Lang = 'fr' | 'en' | 'ln' | 'sw'

type SaveEvaluationRequest = {
  analysisId: string
  choices: Record<string, UserChoiceDetail>
  reflection: string
  lang?: Lang
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { analysisId, choices, reflection, lang = 'fr' } =
      (await req.json()) as SaveEvaluationRequest

    if (!analysisId || !reflection?.trim()) {
      return json({ success: false, error: 'analysisId et reflection requis' }, 400)
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: analysis, error: fetchError } = await supabaseClient
      .from('analyses')
      .select('ai_suggestion')
      .eq('id', analysisId)
      .single()

    if (fetchError) throw fetchError

    const aiSuggestion = analysis?.ai_suggestion ?? {}
    const baseVerdict = computeVerdictScore(aiSuggestion, choices, lang)
    const recommendation = await generateVerdictRecommendation(
      aiSuggestion,
      choices,
      reflection,
      lang,
      baseVerdict,
    )

    const verdict: Verdict = {
      score: baseVerdict.score,
      label: baseVerdict.label,
      recommendation,
      level: baseVerdict.level,
    }

    const { error: updateError } = await supabaseClient
      .from('analyses')
      .update({
        user_validation: choices,
        final_score_label: verdict.level,
        completed_at: new Date().toISOString(),
      })
      .eq('id', analysisId)

    if (updateError) throw updateError

    const { data: existing } = await supabaseClient
      .from('reflections')
      .select('id')
      .eq('analysis_id', analysisId)
      .maybeSingle()

    const reflectionPayload = {
      analysis_id: analysisId,
      reflection_text: reflection.trim(),
    }

    const { error: reflectionError } = existing
      ? await supabaseClient
          .from('reflections')
          .update(reflectionPayload)
          .eq('analysis_id', analysisId)
      : await supabaseClient.from('reflections').insert(reflectionPayload)

    if (reflectionError) throw reflectionError

    return json({
      success: true,
      verdict: {
        score: verdict.score,
        label: verdict.label,
        recommendation: verdict.recommendation,
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
