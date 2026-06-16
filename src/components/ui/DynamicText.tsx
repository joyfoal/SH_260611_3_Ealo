'use client'

import { useEffect, useState } from 'react'

interface LineConfig {
  text: string
  size: string
  color: string
  weight: number
}

function splitKoreanText(text: string): string[] {
  const words = text.split(' ')
  if (words.length <= 1) return [text, '', '', '']
  if (words.length === 2) return [words[0], words[1], '', '']
  if (words.length === 3) return [words[0], words[1], words[2], '']

  // 4+ words: group intelligently
  const first = words[0] // 나는, 저는, etc.
  const last = words[words.length - 1]
  const secondLast = words[words.length - 2]
  const middle = words.slice(1, words.length - 2)

  if (middle.length === 0) {
    return [first, secondLast, last, '']
  }
  if (middle.length === 1) {
    return [first, middle[0], secondLast, last]
  }
  // more than 1 middle word - put first middle word on line2, rest on line3
  const line3 = middle.slice(1).join(' ')
  return [first, middle[0], line3, `${secondLast} ${last}`]
}

interface DynamicTextProps {
  text: string
  darkBackground?: boolean
  compact?: boolean
}

export function DynamicText({ text, darkBackground = false, compact = false }: DynamicTextProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  const chunks = splitKoreanText(text)
  const lines: LineConfig[] = [
    {
      text: chunks[0],
      size: compact ? '16px' : '26px',
      color: 'var(--color-text-secondary)',
      weight: 400,
    },
    {
      text: chunks[1],
      size: compact ? '28px' : '52px',
      color: darkBackground ? 'var(--color-text-onDark)' : 'var(--color-text-primary)',
      weight: 500,
    },
    {
      text: chunks[2],
      size: compact ? '18px' : '28px',
      color: 'var(--color-accent-light)',
      weight: 400,
    },
    {
      text: chunks[3],
      size: compact ? '20px' : '32px',
      color: 'var(--color-accent-secondary)',
      weight: 500,
    },
  ]

  return (
    <div
      style={{
        background: darkBackground ? 'var(--color-bg-dark)' : 'transparent',
        padding: darkBackground ? '32px 24px' : '0',
        letterSpacing: '-0.5px',
        lineHeight: 1.9,
      }}
    >
      {lines.map((line, i) =>
        line.text ? (
          <div
            key={i}
            style={{
              fontSize: line.size,
              color: line.color,
              fontWeight: line.weight,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: `opacity 0.4s ease ${i * 0.2}s, transform 0.4s ease ${i * 0.2}s`,
            }}
          >
            {line.text}
          </div>
        ) : null
      )}
    </div>
  )
}
