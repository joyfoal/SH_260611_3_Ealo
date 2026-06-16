'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  isOnboarded,
  getTodayAffirmationIds,
  saveTodayAffirmationIds,
  getAffirmations,
  generateTodayQueue,
  todayStr,
} from '@/lib/storage'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOnboarded()) {
        router.replace('/onboarding')
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
            sessionStorage.setItem('mornim-speak-queue', JSON.stringify(ids))
            sessionStorage.setItem('mornim-speak-index', String(ids.indexOf(uncompleted[0].id)))
          }
          router.replace(`/speak?id=${uncompleted[0].id}`)
          return
        }
      }

      router.replace('/home')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  const icons = Array.from({ length: 9 }, (_, i) => ({
    col: i % 3,
    row: Math.floor(i / 3),
    delay: i * 0.09,
  }))

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '100dvh', background: 'var(--color-bg-dark)' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          width: '288px',
        }}
      >
        {icons.map(({ col, row, delay }, i) => (
          <div
            key={i}
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '20px',
              backgroundImage: 'url(/mornim.png)',
              backgroundSize: '300% 300%',
              backgroundPosition: `${col * 50}% ${row * 50}%`,
              animation: `popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
