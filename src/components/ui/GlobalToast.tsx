'use client'

import { useEffect, useRef, useState } from 'react'
import { TOAST_EVENT } from '@/lib/toast'

export function GlobalToast() {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      setMessage(detail)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setMessage(null), 2200)
    }
    window.addEventListener(TOAST_EVENT, handler)
    return () => {
      window.removeEventListener(TOAST_EVENT, handler)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  if (!message) return null

  return (
    <div
      style={{
        position: 'fixed', bottom: '96px', left: '50%', transform: 'translateX(-50%)',
        padding: '12px 24px',
        background: 'var(--color-accent-primary)',
        borderRadius: '24px',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        zIndex: 9999,
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  )
}
