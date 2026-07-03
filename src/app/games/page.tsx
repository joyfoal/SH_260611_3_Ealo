'use client'

import { useRouter } from 'next/navigation'
import { AppLayout } from '@/components/ui/AppLayout'
import { Grid2X2, ArrowUpDown, Play } from 'lucide-react'

const T = {
  ink: 'var(--color-text-primary)',
  muted: 'var(--color-text-muted)',
  cardBorder: 'var(--color-border)',
  goldGrad: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
  greenGrad: 'linear-gradient(135deg, var(--color-accent-secondary), var(--color-accent-primary))',
}

const GAMES = [
  {
    icon: <Grid2X2 size={24} strokeWidth={1.75} color="#fff" />,
    title: '벽돌 깨기',
    desc: '성공의 말 단어들이 벽돌 뒤에 있어요. 모두 깨면 성공의 말 완성!',
    route: '/games/brick',
    cardBg: 'linear-gradient(150deg, var(--color-bg-primary), var(--color-bg-card))',
    chipBg: T.goldGrad,
  },
  {
    icon: <ArrowUpDown size={24} strokeWidth={1.75} color="#fff" />,
    title: '단어 정렬',
    desc: '뒤섞인 성공의 말 단어를 올바른 순서로 맞춰보세요!',
    route: '/games/word-sort',
    cardBg: 'linear-gradient(150deg, var(--color-bg-primary), var(--color-bg-card))',
    chipBg: T.greenGrad,
  },
]

export default function GamesPage() {
  const router = useRouter()

  return (
    <AppLayout activeTab="게임">
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg-primary)', padding: '20px 16px 16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          게임
        </h1>
        <p style={{ fontSize: '13.5px', color: T.muted, marginBottom: 0 }}>
          게임으로 성공의 말을 익혀보세요
        </p>
      </div>
      <div style={{ padding: '16px 16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {GAMES.map((game) => (
            <div
              key={game.route}
              style={{
                position: 'relative',
                background: game.cardBg,
                borderRadius: '22px',
                padding: '20px',
                border: `1px solid ${T.cardBorder}`,
                boxShadow: '0 8px 26px color-mix(in srgb, var(--color-text-primary) 7%, transparent)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%',
                  background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent-primary) 12%, transparent), transparent 70%)',
                  pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: game.chipBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  position: 'relative',
                }}
              >
                {game.icon}
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: 800, color: T.ink, marginBottom: '6px', position: 'relative' }}>
                {game.title}
              </h2>
              <p style={{ fontSize: '13px', color: T.muted, marginBottom: '18px', lineHeight: 1.55, position: 'relative' }}>
                {game.desc}
              </p>
              <button
                onClick={() => router.push(game.route)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '14px',
                  background: T.goldGrad,
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 6px 16px color-mix(in srgb, var(--color-accent-primary) 28%, transparent)',
                }}
              >
                <Play size={16} fill="#fff" color="#fff" />
                플레이
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
