/** Heuristiques domaine — sans API externe */
export function analyzeDomainRisk(domain: string, createdDate?: string, isSecure?: boolean) {
  const risks: string[] = []
  const signals: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' = 'low'

  if (!isSecure) {
    risks.push('Site sans HTTPS')
    riskLevel = 'medium'
  }

  const suspiciousTlds = ['.xyz', '.top', '.click', '.buzz', '.gq', '.tk', '.ml']
  if (suspiciousTlds.some((tld) => domain.endsWith(tld))) {
    risks.push(`Extension de domaine peu fiable (${domain.split('.').pop()})`)
    riskLevel = 'high'
  }

  if (createdDate && createdDate !== 'Inconnue') {
    const created = new Date(createdDate)
    if (!Number.isNaN(created.getTime())) {
      const ageDays = Math.floor((Date.now() - created.getTime()) / (1000 * 60 * 60 * 24))
      signals.push(`Domaine actif depuis ~${ageDays} jours`)
      if (ageDays < 30) {
        risks.push('Domaine très récent (< 30 jours)')
        riskLevel = 'high'
      } else if (ageDays < 180) {
        risks.push('Domaine récent (< 6 mois)')
        if (riskLevel === 'low') riskLevel = 'medium'
      }
    }
  }

  const freeHosts = ['blogspot.com', 'wordpress.com', 'wixsite.com', 'github.io']
  if (freeHosts.some((h) => domain.includes(h))) {
    signals.push('Hébergé sur plateforme gratuite — vérifier l\'auteur')
  }

  return { risks, signals, riskLevel, domain }
}
