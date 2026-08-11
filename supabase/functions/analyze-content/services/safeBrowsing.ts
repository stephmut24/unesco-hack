/** Google Safe Browsing v4 — nécessite GOOGLE_SAFE_BROWSING_API_KEY */
export async function checkSafeBrowsing(
  url: string,
  apiKey: string | undefined,
): Promise<{ safe: boolean; threats: string[]; limited: boolean }> {
  if (!apiKey) return { safe: true, threats: [], limited: true }

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'media-compass', clientVersion: '1.0' },
          threatInfo: {
            threatTypes: [
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION',
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
      },
    )

    if (!res.ok) {
      console.error('Safe Browsing HTTP', res.status)
      return { safe: true, threats: [], limited: true }
    }

    const data = await res.json()
    const threats = (data.matches ?? []).map(
      (m: { threatType?: string }) => m.threatType ?? 'UNKNOWN',
    )

    return { safe: threats.length === 0, threats, limited: false }
  } catch (err) {
    console.error('Safe Browsing error:', err)
    return { safe: true, threats: [], limited: true }
  }
}
