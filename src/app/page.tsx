'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  isOnboarded,
  getTodayAffirmationIds,
  saveTodayAffirmationIds,
  getAffirmations,
  generateTodayQueue,
  todayStr,
} from '@/lib/storage'

const FADE_MS = 280
const MIN_SPLASH_MS = 2000

export default function RootPage() {
  const router = useRouter()
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const mountedAt = Date.now()
    const go = (path: string) => {
      const remaining = MIN_SPLASH_MS - (Date.now() - mountedAt)
      setTimeout(() => {
        setFadingOut(true)
        setTimeout(() => router.replace(path), FADE_MS)
      }, Math.max(0, remaining))
    }

    if (!isOnboarded()) {
      go('/onboarding')
      return
    }

    let ids = getTodayAffirmationIds()
    if (ids.length === 0) {
      ids = generateTodayQueue()
      saveTodayAffirmationIds(ids)
    }

    if (ids.length > 0) {
      const affirmations = getAffirmations()
      const today = todayStr()
      const uncompleted = affirmations.filter(
        (a) => ids.includes(a.id) && !a.completedDates.includes(today)
      )
      if (uncompleted.length > 0) {
        if (typeof window !== 'undefined') {
          try {
            sessionStorage.setItem('ealo-speak-queue', JSON.stringify(ids))
            sessionStorage.setItem('ealo-speak-index', String(ids.indexOf(uncompleted[0].id)))
          } catch { /* 프라이빗 브라우징 등 storage 비활성화 환경 */ }
        }
        go(`/speak?id=${uncompleted[0].id}`)
        return
      }
    }

    go('/home')
  }, [router])

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: '100dvh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 90% 55% at 50% 42%, #F4FAF3 0%, #E1F0E1 55%, #C9E3CC 100%)',
        opacity: fadingOut ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 45% at 50% 42%, rgba(34,110,80,0.14), transparent 70%)',
        }}
      />
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 200, height: 200 }}>
          <Image
            src="/splash-icon.png"
            alt="이뤄"
            width={200}
            height={200}
            priority
            style={{ borderRadius: 44, boxShadow: '0 12px 32px rgba(20,60,45,0.18)' }}
          />
          {/* star crystal shine, positioned over the star baked into the icon artwork */}
          <div
            style={{
              position: 'absolute', left: '48%', top: '24%', transform: 'translate(-50%, -50%)',
              width: 56, height: 56, borderRadius: '50%', pointerEvents: 'none',
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,241,196,0.5) 45%, transparent 75%)',
              filter: 'blur(1px)',
              animation: 'starGlow 2.4s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute', left: '48%', top: '24%', transform: 'translate(-50%, -50%)',
              width: 14, height: 14, pointerEvents: 'none',
              background: '#FFFFFF',
              clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
              animation: 'starTwinkle 2.4s ease-in-out infinite',
              animationDelay: '0s',
            }}
          />
          <div
            style={{
              position: 'absolute', left: '61%', top: '17%', transform: 'translate(-50%, -50%)',
              width: 8, height: 8, pointerEvents: 'none',
              background: '#FFFFFF',
              clipPath: 'polygon(50% 0%, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0% 50%, 39% 39%)',
              animation: 'starTwinkle 2.4s ease-in-out infinite',
              animationDelay: '1.1s',
            }}
          />
        </div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#4F7A63' }}>말하면, 이루어진다</div>
        </div>
      </div>
      <div
        style={{
          position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
          width: 24, height: 24, borderRadius: '50%',
          border: '2.5px solid rgba(186,117,23,0.25)', borderTopColor: '#BA7517',
          animation: 'swirlSpin 0.9s linear infinite',
        }}
      />
    </div>
  )
}
