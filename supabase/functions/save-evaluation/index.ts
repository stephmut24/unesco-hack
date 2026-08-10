import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type UserChoiceDetail = {
  action: 'confirm' | 'modify'
  userOpinion?: string
}

type SaveEvaluationRequest = {
  analysisId: string
  choices: Record<string, UserChoiceDetail>
  reflection: string
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { analysisId, choices, reflection } = (await req.json()) as SaveEvaluationRequest

    if (!analysisId || !reflection?.trim()) {
      return json({ success: false, error: 'analysisId et reflection requis' }, 400)
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { error: updateError } = await supabaseClient
      .from('analyses')
      .update({ user_validation: choices })
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

    return json({ success: true })
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
