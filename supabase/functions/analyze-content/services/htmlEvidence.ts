const SENSATIONAL_PATTERNS = [
  /\bURGENT\b/i,
  /\bBREAKING\b/i,
  /\bCHOC\b/i,
  /\bSCANDALE\b/i,
  /\bEXCLUSIF\b/i,
  /\bON NE VOUS LE DIRA PAS\b/i,
  /\bPARTAGE(Z)?\s(VITE|RAPIDE)/i,
  /\b(Ils|Elles) ne veulent pas que/i,
  /\b100%\s+(vrai|prouvé)/i,
  /\b(FAKE|HOAX|CANULAR)\b/i,
]

export type HtmlEvidence = {
  pageTitle?: string
  metaDescription?: string
  ogSiteName?: string
  author?: string
  textSnippet?: string
  externalLinkCount: number
  hasCitation: boolean
  sensationalMatches: string[]
  hasLegalMention: boolean
  httpStatus?: number
  reachable?: boolean
  contentLength?: number
  finalUrl?: string
}

export function extractHtmlEvidence(html: string, httpStatus: number, finalUrl?: string): HtmlEvidence {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const metaDesc = html.match(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
  )
  const ogSite = html.match(
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  )
  const authorMeta = html.match(
    /<meta[^>]+name=["'](author|article:author|dc\.creator)["'][^>]+content=["']([^"']+)["']/i,
  )

  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000)

  const externalLinks = (html.match(/href=["']https?:\/\/[^"']+["']/gi) ?? []).length
  const hasCitation = /source\s*:|selon\s+|d'après\s+|https?:\/\//i.test(textContent)
  const hasLegalMention = /mentions?\s+l[ée]gales|privacy|politique de confidentialit/i.test(html)

  const sensationalMatches: string[] = []
  for (const pattern of SENSATIONAL_PATTERNS) {
    const m = textContent.match(pattern) ?? html.match(pattern)
    if (m) sensationalMatches.push(m[0])
  }

  return {
    pageTitle: titleMatch?.[1]?.trim().slice(0, 200),
    metaDescription: metaDesc?.[1]?.trim().slice(0, 300),
    ogSiteName: ogSite?.[1]?.trim(),
    author: authorMeta?.[2]?.trim(),
    textSnippet: textContent.slice(0, 400),
    externalLinkCount: externalLinks,
    hasCitation,
    sensationalMatches: [...new Set(sensationalMatches)].slice(0, 5),
    hasLegalMention,
    httpStatus,
    reachable: httpStatus >= 200 && httpStatus < 400,
    contentLength: html.length,
    finalUrl,
  }
}

export function summarizeHtmlEvidence(ev: HtmlEvidence): string[] {
  const findings: string[] = []
  if (ev.pageTitle) findings.push(`Titre : « ${ev.pageTitle} »`)
  if (ev.author) findings.push(`Auteur déclaré : ${ev.author}`)
  if (ev.hasCitation) findings.push('Citations/sources détectées dans le texte')
  else findings.push('Aucune citation explicite trouvée')
  if (ev.sensationalMatches.length > 0) {
    findings.push(`Langage sensationnaliste : « ${ev.sensationalMatches.join(' », « ')} »`)
  }
  if (ev.externalLinkCount > 0) findings.push(`${ev.externalLinkCount} liens externes dans la page`)
  if (!ev.hasLegalMention) findings.push('Pas de mentions légales détectées')
  return findings
}
