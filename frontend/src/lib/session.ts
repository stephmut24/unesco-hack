const SESSION_KEY = 'mc_session'

export function getOrCreateSession(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}
