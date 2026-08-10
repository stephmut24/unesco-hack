// supabase/functions/analyze-content/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { url } = await req.json()
    const openAiKey = Deno.env.get('OPENAI_API_KEY')
    const whoisKey = Deno.env.get('WHOIS_XML_API_KEY')

    console.log("--- DÉBUT ANALYSE ---")
    console.log("URL reçue:", url)

    const domain = new URL(url).hostname
    console.log("Domaine extrait:", domain)
    
    // 1. Test Whois
    console.log("Appel WhoisXML...")
    const whoisResponse = await fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${whoisKey}&domainName=${domain}&outputFormat=JSON`)
    const whoisData = await whoisResponse.json()
    console.log("Réponse Whois reçue (OK)")

    const techFacts = {
      domain,
      createdDate: whoisData.WhoisRecord?.createdDate || "Inconnue",
      isSecure: url.startsWith('https')
    }

    // 2. Test OpenAI
    console.log("Appel OpenAI...")
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Tu es l'expert Media Compass. Réponds en JSON." },
          { role: "user", content: `Analyse : ${url}` }
        ],
        response_format: { type: "json_object" }
      }),
    })

    const aiData = await aiResponse.json()
    
    // LOG CRITIQUE : Qu'est-ce qu'OpenAI nous a vraiment dit ?
    console.log("DEBUG AI DATA:", JSON.stringify(aiData))

    if (!aiData.choices) {
        console.error("ERREUR : OpenAI n'a pas renvoyé de 'choices'. Message d'erreur OpenAI possible :", aiData.error?.message)
        throw new Error(`OpenAI Error: ${aiData.error?.message || "Format inconnu"}`)
    }

    return new Response(
      JSON.stringify({ success: true, analysis: JSON.parse(aiData.choices[0].message.content), techFacts }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    console.error("CATCH ERROR:", msg)
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})