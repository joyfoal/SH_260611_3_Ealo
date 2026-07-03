export const TOAST_EVENT = 'ealo-toast'

export function showToast(message: string): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<string>(TOAST_EVENT, { detail: message }))
}
