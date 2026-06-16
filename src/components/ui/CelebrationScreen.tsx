'use client'

import { useEffect, useState } from 'react'

const PHRASES = ['잘했어요!', '멋져요!', '오늘도 해냈어요!', '최고예요!', '정말 잘하고 있어요!']

interface CelebrationScreenProps {
  completedCount: number
  totalCount: number
  onNext: () => void
}

export function CelebrationScreen({ completedCount, totalCount, onNext }: CelebrationScreenProps) {
  const [phrase] = useState(() => PHRASES[Math.floor(Math.random() * PHRASES.length)])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const timer = setTimeout(onNext, 1500)
    return () => clearTimeout(timer)
  }, [onNext])

  const isAllDone = completedCount === totalCount

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg-dark)',
      }}
    >
      <div
        style={{
          fontSize: '28px',
          fontWeight: 500,
          color: 'var(--color-text-onDark)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.5)',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          textAlign: 'center',
          marginBottom: '16px',
        }}
      >
        {isAllDone ? '모두 완료! 🎉' : phrase}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: 'var(--color-accent-light)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}
      >
        {completedCount} / {totalCount} 완료
      </div>
    </div>
  )
}
