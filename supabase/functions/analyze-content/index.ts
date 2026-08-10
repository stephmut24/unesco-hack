// supabase/functions/analyze-content/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { url, sessionId = 'anonymous' } = await req.json()
    
    // Initialisation du client Supabase interne (pour sauvegarder)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const geminiKey = Deno.env.get('GEMINI_API_KEY')
    const whoisKey = Deno.env.get('WHOIS_XML_API_KEY')
    const domain = new URL(url).hostname
    
    // --- 1. ANALYSE TECHNIQUE ---
    let techFacts = { domain, createdDate: "Inconnue", isSecure: url.startsWith('https') }
    try {
      const whoisRes = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisKey}&domainName=${domain}&outputFormat=JSON`)
      const whoisData = await whoisRes.json()
      techFacts.createdDate = whoisData.WhoisRecord?.createdDate || "Inconnue"
    } catch (e) { console.error(e) }

    // --- 2. ANALYSE IA (ou Mock) ---
    let finalAnalysis;
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Analyse Media Compass pour ${url}. Faits: ${JSON.stringify(techFacts)}. Réponds en JSON pur.` }]}],
          generationConfig: { response_mime_type: "application/json" }
        })
      })
      const data = await response.json()
      finalAnalysis = JSON.parse(data.candidates[0].content.parts[0].text)
    } catch (aiError) {
      finalAnalysis = { source: { status: "warning", explanation: "IA en mode simulation." }, impact: { status: "safe", explanation: "Analyse simulée." } /* ... les autres ... */ }
    }

    // --- 3. SAUVEGARDE EN BASE DE DONNÉES (La nouveauté) ---
    // A. On enregistre le contenu
    const { data: contentData } = await supabaseClient
      .from('contents')
      .upsert({ url_hash: domain, raw_text: url, forensic_metadata: techFacts, content_type: 'url' })
      .select()
      .single()

    // B. On enregistre l'analyse
    if (contentData) {
      await supabaseClient.from('analyses').insert({
        session_id: sessionId,
        content_id: contentData.id,
        ai_suggestion: finalAnalysis,
        final_score_label: finalAnalysis.source?.status || 'unknown'
      })
    }

    return new Response(
      JSON.stringify({ success: true, analysis: finalAnalysis, techFacts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    return new Response(JSON.stringify({ success: false, error: "Erreur" }), { status: 500, headers: corsHeaders })
  }
})