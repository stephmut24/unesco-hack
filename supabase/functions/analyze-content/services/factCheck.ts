/** Google Fact Check Tools API — nécessite GOOGLE_FACTCHECK_API_KEY (ou clé Google Cloud) */
export async function searchFactChecks(
  query: string,
  apiKey: string | undefined,
): Promise<{ claims: Array<{ text: string; publisher: string; rating: string }>; limited: boolean }> {
  if (!apiKey || !query.trim()) return { claims: [], limited: true }

  try {
    const params = new URLSearchParams({
      query: query.slice(0, 200),
      key: apiKey,
      languageCode: 'fr',
    })

    const res = await fetch(
      `https://factchecktools.googleapis.com/v1alpha1/claims:search?${params}`,
    )

    if (!res.ok) {
      console.error('Fact Check API HTTP', res.status)
      return { claims: [], limited: true }
    }

    const data = await res.json()
    const claims = (data.claims ?? []).slice(0, 3).map(
      (c: {
        text?: string
        claimReview?: Array<{ publisher?: { name?: string }; textualRating?: string }>
      }) => ({
        text: c.text ?? '',
        publisher: c.claimReview?.[0]?.publisher?.name ?? 'Inconnu',
        rating: c.claimReview?.[0]?.textualRating ?? 'Non évalué',
      }),
    )

    return { claims, limited: false }
  } catch (err) {
    console.error('Fact Check API error:', err)
    return { claims: [], limited: true }
  }
}
