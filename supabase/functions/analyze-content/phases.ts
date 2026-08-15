import { analyzeDomainRisk } from './services/domainRisk.ts'
import { checkSafeBrowsing } from './services/safeBrowsing.ts'
import {
  extractHtmlEvidence,
  summarizeHtmlEvidence,
  type HtmlEvidence,
} from './services/htmlEvidence.ts'
import { searchFactChecks } from './services/factCheck.ts'

type ContentType = 'url' | 'text' | 'image'

export type AnalysisPhase = 'source' | 'evidence' | 'technical' | 'synthesis'

export const ANALYSIS_PHASES: AnalysisPhase[] = [
  'source',
  'evidence',
  'technical',
  'synthesis',
]

export type PipelineContext = {
  techFacts?: Record<string, unknown>
  evidenceFacts?: Record<string, unknown>
  technicalSignals?: string[]
  degraded?: boolean
  aiProvider?: string
  aiError?: string
}

export async function runSourcePhase(
  type: ContentType,
  value: string,
  whoisKey: string | undefined,
): Promise<{ context: PipelineContext; summary: string }> {
  let degraded = false
  let techFacts: Record<string, unknown> = { inputType: type, limited: false }
  const findings: string[] = []

  if (type === 'url') {
    const domain = new URL(value).hostname
    const isSecure = value.startsWith('https')
    techFacts = { inputType: type, domain, isSecure, limited: false }
    findings.push(`Domaine : ${domain}`)
    findings.push(isSecure ? 'HTTPS actif' : 'Pas de HTTPS')

    try {
      const whois = await fetchWhois(domain, whoisKey)
      techFacts.createdDate = whois.createdDate
      if (whois.createdDate && whois.createdDate !== 'Inconnue') {
        findings.push(`Création domaine : ${whois.createdDate}`)
      }
      if (whois.limited) {
        techFacts.limited = true
        degraded = true
        findings.push('Whois indisponible')
      }
    } catch {
      techFacts.limited = true
      degraded = true
      findings.push('Whois indisponible')
    }

    const domainRisk = analyzeDomainRisk(domain, techFacts.createdDate as string, isSecure)
    techFacts.domainRisk = domainRisk
    findings.push(...domainRisk.signals)
    if (domainRisk.risks.length > 0) {
      findings.push(...domainRisk.risks)
    }
  } else if (type === 'text') {
    techFacts = { inputType: type, charCount: value.length, limited: false }
    findings.push(`Texte : ${value.length} caractères`)
  } else {
    techFacts = { inputType: type, limited: false }
    findings.push('Capture image reçue')
  }

  return {
    context: { techFacts, degraded },
    summary: findings.join(' · '),
  }
}

export async function runEvidencePhase(
  type: ContentType,
  value: string,
  ctx: PipelineContext,
  env: { safeBrowsingKey?: string; factCheckKey?: string },
): Promise<{ context: PipelineContext; summary: string }> {
  const evidenceFacts: Record<string, unknown> = { limited: false }
  const findings: string[] = []

  if (type === 'url') {
    // --- Safe Browsing (API Google) ---
    const safeBrowsing = await checkSafeBrowsing(value, env.safeBrowsingKey)
    evidenceFacts.safeBrowsing = safeBrowsing
    if (!safeBrowsing.limited) {
      if (!safeBrowsing.safe) {
        findings.push(`⚠️ Menace détectée : ${safeBrowsing.threats.join(', ')}`)
        evidenceFacts.limited = false
      } else {
        findings.push('Google Safe Browsing : aucune menace connue')
      }
    }

    // --- Fetch page + analyse HTML ---
    try {
      const res = await fetch(value, {
        headers: { 'User-Agent': 'MediaCompass/1.0 (UNESCO Hackathon)' },
        redirect: 'follow',
      })
      const html = (await res.text()).slice(0, 80_000)
      const htmlEv = extractHtmlEvidence(html, res.status, res.url)
      evidenceFacts.html = htmlEv
      findings.push(...summarizeHtmlEvidence(htmlEv))

      // --- Fact-checking (Google Fact Check API) ---
      const searchQuery = htmlEv.pageTitle ?? value

      const factChecks = await searchFactChecks(searchQuery, env.factCheckKey)
      evidenceFacts.factChecks = factChecks

      if (!factChecks.limited && factChecks.claims.length > 0) {
        for (const claim of factChecks.claims) {
          findings.push(
            `Fact-check (${claim.publisher}) : « ${claim.text.slice(0, 80)}… » → ${claim.rating}`,
          )
        }
      } else {
        findings.push('Pas de fact-check Google correspondant')
      }
    } catch {
      evidenceFacts.limited = true
      evidenceFacts.reachable = false
      findings.push('Page inaccessible depuis le serveur')
    }
  } else if (type === 'text') {
    const wordCount = value.trim().split(/\s+/).filter(Boolean).length
    evidenceFacts.wordCount = wordCount
    evidenceFacts.hasUrls = /https?:\/\//.test(value)

    const sensational = value.match(/\b(URGENT|CHOC|SCANDALE|FAKE|HOAX|PARTAGE)\b/gi) ?? []
    evidenceFacts.sensationalMatches = [...new Set(sensational)]
    evidenceFacts.hasCitation = /source\s*:|selon\s+|d'après\s+/i.test(value)

    findings.push(`${wordCount} mots analysables`)
    if (evidenceFacts.hasUrls) findings.push('Liens URL embarqués détectés')
    if (evidenceFacts.hasCitation) findings.push('Références sources dans le texte')
    else findings.push('Aucune source citée explicitement')
    if (sensational.length > 0) {
      findings.push(`Mots alarmistes : ${sensational.join(', ')}`)
    }

    const factChecks = await searchFactChecks(value.slice(0, 200), env.factCheckKey)
    evidenceFacts.factChecks = factChecks
    if (factChecks.claims.length > 0) {
      findings.push(`${factChecks.claims.length} fact-check(s) Google trouvé(s)`)
    } else {
      findings.push('Pas de fact-check Google correspondant')
    }
  } else {
    evidenceFacts.hasImage = true
    evidenceFacts.limited = true
    findings.push('OCR / Vision IA — nécessite GEMINI_API_KEY à l’étape synthesis')
  }

  return {
    context: {
      ...ctx,
      evidenceFacts,
      degraded: ctx.degraded ||
        Boolean(evidenceFacts.limited) ||
        (evidenceFacts.safeBrowsing as { limited?: boolean })?.limited,
    },
    summary: findings.length > 0 ? findings.join(' · ') : 'Aucune preuve externe collectée',
  }
}

export async function runTechnicalPhase(
  type: ContentType,
  _value: string,
  ctx: PipelineContext,
): Promise<{ context: PipelineContext; summary: string }> {
  const signals: string[] = []
  const tech = ctx.techFacts ?? {}
  const evidence = ctx.evidenceFacts ?? {}
  const html = evidence.html as HtmlEvidence | undefined
  const domainRisk = tech.domainRisk as { risks?: string[]; riskLevel?: string } | undefined
  const safeBrowsing = evidence.safeBrowsing as {
    safe?: boolean
    threats?: string[]
    limited?: boolean
  } | undefined

  // --- Signaux domaine (phase 1) ---
  if (tech.domain) signals.push(`[Source] Domaine : ${tech.domain}`)
  if (typeof tech.isSecure === 'boolean') {
    signals.push(
      tech.isSecure ? '[Source] HTTPS actif' : '[Source] ⚠️ HTTP non chiffré',
    )
  }
  if (domainRisk?.riskLevel === 'high') {
    signals.push(`[Source] ⚠️ Risque domaine élevé`)
    for (const r of domainRisk.risks ?? []) signals.push(`[Source] ${r}`)
  } else if (domainRisk?.riskLevel === 'medium') {
    signals.push(`[Source] Prudence domaine modérée`)
  }

  // --- Signaux preuves (phase 2) ---
  if (safeBrowsing && !safeBrowsing.limited) {
    signals.push(
      safeBrowsing.safe
        ? '[Evidence] Safe Browsing : OK'
        : `[Evidence] ⚠️ Safe Browsing : ${safeBrowsing.threats?.join(', ')}`,
    )
  }
  if (html) {
    if (!html.hasCitation) signals.push('[Evidence] Aucune citation explicite')
    if (html.sensationalMatches.length > 0) {
      signals.push(`[Evidence] Clickbait/sensationnel : ${html.sensationalMatches.join(', ')}`)
    }
    if (!html.hasLegalMention) signals.push('[Evidence] Mentions légales absentes')
    if (html.author) signals.push(`[Evidence] Auteur : ${html.author}`)
  }
  const factChecks = evidence.factChecks as { claims?: unknown[]; limited?: boolean } | undefined
  if (factChecks && !factChecks.limited) {
    signals.push(
      factChecks.claims?.length
        ? `[Evidence] ${factChecks.claims.length} fact-check(s) trouvé(s)`
        : '[Evidence] Aucun fact-check Google correspondant',
    )
  }

  // --- Signaux texte ---
  if (type === 'text') {
    if (!evidence.hasCitation) signals.push('[Evidence] Texte sans source citée')
    const sens = evidence.sensationalMatches as string[] | undefined
    if (sens?.length) signals.push(`[Evidence] Langage alarmiste : ${sens.join(', ')}`)
  }

  if (tech.limited || evidence.limited) {
    signals.push('[Technique] Analyse partielle — certaines APIs indisponibles')
  }

  if (signals.length === 0) {
    signals.push('[Technique] Signaux minimaux — analyse IA requise')
  }

  const alertCount = signals.filter((s) => s.includes('⚠️')).length

  return {
    context: { ...ctx, technicalSignals: signals },
    summary: alertCount > 0
      ? `${signals.length} signaux dont ${alertCount} alerte(s) technique(s)`
      : `${signals.length} signal${signals.length > 1 ? 'aux' : ''} technique${signals.length > 1 ? 's' : ''} identifié${signals.length > 1 ? 's' : ''}`,
  }
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
