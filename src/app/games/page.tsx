'use client'

import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/ui/AppLayout'
import { Grid2X2, ArrowUpDown } from 'lucide-react'

const GAMES = [
  {
    icon: <Grid2X2 size={22} strokeWidth={1.75} color="var(--color-accent-primary)" />,
    title: '벽돌 깨기',
    desc: '성공의 말 단어들이 벽돌 뒤에 있어요. 모두 깨면 성공의 말 완성!',
    route: '/games/brick',
  },
  {
    icon: <ArrowUpDown size={22} strokeWidth={1.75} color="var(--color-accent-primary)" />,
    title: '단어 정렬',
    desc: '뒤섞인 성공의 말 단어를 올바른 순서로 맞춰보세요!',
    route: '/games/word-sort',
  },
]

export default function GamesPage() {
  const router = useRouter()

  return (
    <AppLayout activeTab="게임">
      <div style={{ padding: '20px 16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          게임
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          게임으로 성공의 말을 익혀보세요
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {GAMES.map((game) => (
            <div
              key={game.route}
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--color-accent-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                {game.icon}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                {game.title}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '18px', lineHeight: 1.55 }}>
                {game.desc}
              </p>
              <button
                onClick={() => router.push(game.route)}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'var(--color-accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                플레이
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
