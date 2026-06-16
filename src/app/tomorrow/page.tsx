'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAffirmations, saveTomorrowNote, type Affirmation } from '@/lib/storage'

export default function TomorrowPage() {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setAffirmations(getAffirmations())
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 7) return prev
      return [...prev, id]
    })
  }

  const handleSave = async () => {
    setSaving(true)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    let finalIds = selectedIds
    if (finalIds.length === 0) {
      // Auto-select 3 random
      const shuffled = [...affirmations].sort(() => Math.random() - 0.5)
      finalIds = shuffled.slice(0, 3).map((a) => a.id)
    }

    saveTomorrowNote({
      date: tomorrowStr,
      message: message.trim(),
      selectedAffirmationIds: finalIds,
    })
    router.push('/home')
  }

  const handleSkip = () => {
    router.push('/home')
  }

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--color-bg-dark)',
        padding: '32px 16px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--color-text-onDark)', marginBottom: '8px' }}>
          내일의 나에게 ✉️
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          오늘의 성공의 말을 모두 마쳤어요.<br />내일의 나에게 한 마디 남겨보세요.
        </p>
      </div>

      {/* Message input */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '10px' }}>
          내일의 나에게 한 줄 메시지 (선택사항)
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="내일도 잘 해낼 수 있어!"
          rows={3}
          style={{
            width: '100%',
            padding: '14px',
            background: 'var(--color-bg-surface)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px',
            fontSize: '15px',
            color: 'var(--color-text-onDark)',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Affirmation picker */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
          내일 말하고 싶은 성공의 말 최대 7개 (선택 안 하면 AI가 3개 골라줘요)
        </p>
        <p style={{ fontSize: '11px', color: 'var(--color-accent-light)', marginBottom: '12px' }}>
          {selectedIds.length}/7 선택됨
        </p>
        <div className="flex flex-col gap-2">
          {affirmations.map((aff) => {
            const isSelected = selectedIds.includes(aff.id)
            return (
              <button
                key={aff.id}
                onClick={() => toggleSelect(aff.id)}
                style={{
                  padding: '12px 16px',
                  background: isSelected ? 'var(--color-accent-primary)' : 'var(--color-bg-surface)',
                  border: isSelected
                    ? '1px solid var(--color-accent-secondary)'
                    : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: isSelected ? 'white' : 'var(--color-text-onDark)',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  lineHeight: 1.5,
                  transition: 'all 0.15s ease',
                }}
              >
                {isSelected && <span style={{ marginRight: '8px' }}>✓</span>}
                {aff.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%',
            padding: '16px',
            background: 'var(--color-accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {saving ? '저장 중...' : '내일을 위해 남기기'}
        </button>
        <button
          onClick={handleSkip}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: 'var(--color-text-muted)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '15px',
            cursor: 'pointer',
          }}
        >
          건너뛰기
        </button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(136,135,128,0.6)', marginTop: '4px' }}>
          설정에서 이 페이지를 항상 건너뛸 수 있어요
        </p>
      </div>
    </div>
  )
}
