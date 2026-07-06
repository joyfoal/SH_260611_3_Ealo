const DEV_MODE_KEY = 'ealo-dev-mode'

export function isDevModeEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(DEV_MODE_KEY) === 'true'
  } catch {
    return false
  }
}

export function enableDevMode(): void {
  try { localStorage.setItem(DEV_MODE_KEY, 'true') } catch {}
}

export function disableDevMode(): void {
  try { localStorage.removeItem(DEV_MODE_KEY) } catch {}
}
