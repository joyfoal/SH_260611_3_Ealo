'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Sparkles, Users, Settings, Mic, type LucideIcon } from 'lucide-react'
import { goToSpeak } from '@/lib/storage'
import { enableDevMode } from '@/lib/devMode'

const LEFT_TABS = [
  { label: '홈', href: '/home', icon: Home },
  { label: '성고의 말', href: '/affirmations', icon: Sparkles },
] as const

const RIGHT_TABS = [
  { label: '함께', href: '/community', icon: Users },
  { label: '설정', href: '/settings', icon: Settings },
] as const

// 개발자 모드 진입: "설정" 탭을 짧은 시간 안에 연속 탭하면 비밀번호 시트가 뜬다.
const DEV_TAP_TARGET = 10
const DEV_TAP_WINDOW_MS = 1500
const DEV_PASSWORD = 'ealo1004' // TODO: 원하는 값으로 바꿔도 됩니다

// Puffy 5-point star: polygon vertices used as quadratic-curve control points,
// with midpoints as curve endpoints, so every tip and valley comes out rounded.
const STAR_PATH =
  'M43.54,19.10 Q50,6 56.47,19.10 Q62.93,32.20 77.39,34.30 Q91.85,36.40 81.39,46.60 ' +
  'Q70.92,56.80 73.39,71.20 Q75.86,85.60 62.93,78.80 Q50,72 37.07,78.80 Q24.14,85.60 26.61,71.20 ' +
  'Q29.08,56.80 18.62,46.60 Q8.15,36.40 22.61,34.30 Q37.07,32.20 43.54,19.10 Z'

interface TabBarProps {
  activeTab: string
}

function TabLink({
  label, href, icon: Icon, isActive, onClick,
}: { label: string; href: string; icon: LucideIcon; isActive: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex flex-col items-center gap-1 min-w-[44px] py-1"
      style={{
        color: isActive ? 'var(--color-tab-active)' : 'var(--color-tab-inactive)',
      }}
    >
      <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
      <span style={{ fontSize: 10 }}>{label}</span>
    </Link>
  )
}

export function TabBar({ activeTab }: TabBarProps) {
  const router = useRouter()
  const tapCountRef = useRef(0)
  const lastTapRef = useRef(0)
  const [showDevPrompt, setShowDevPrompt] = useState(false)
  const [devPassword, setDevPassword] = useState('')
  const [devError, setDevError] = useState(false)

  const handleSettingsTap = () => {
    const now = Date.now()
    if (now - lastTapRef.current > DEV_TAP_WINDOW_MS) tapCountRef.current = 0
    lastTapRef.current = now
    tapCountRef.current += 1
    if (tapCountRef.current >= DEV_TAP_TARGET) {
      tapCountRef.current = 0
      setShowDevPrompt(true)
    }
  }

  const handleDevSubmit = () => {
    if (devPassword === DEV_PASSWORD) {
      enableDevMode()
      window.dispatchEvent(new Event('ealo-dev-mode-changed'))
      setShowDevPrompt(false)
      setDevPassword('')
      setDevError(false)
    } else {
      setDevError(true)
    }
  }

  return (
    <>
    <nav
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
      }}
      className="flex items-center justify-around py-2"
    >
      {LEFT_TABS.map(({ label, href, icon }) => (
        <TabLink key={label} label={label} href={href} icon={icon} isActive={activeTab === label} />
      ))}

      <button
        type="button"
        onClick={() => goToSpeak(router)}
        className="flex flex-col items-center min-w-[44px] py-1"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-tab-inactive)' }}
      >
        <span
          style={{
            position: 'relative', width: 72, height: 72,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'translateY(-8px)',
            filter: 'drop-shadow(0 6px 10px var(--color-accent-primary))',
          }}
        >
          <svg width={72} height={72} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
            <path d={STAR_PATH} fill="var(--color-accent-primary)" />
          </svg>
          <Mic size={30} strokeWidth={2} color="#fff" style={{ position: 'relative' }} />
        </span>
      </button>

      {RIGHT_TABS.map(({ label, href, icon }) => (
        <TabLink
          key={label} label={label} href={href} icon={icon} isActive={activeTab === label}
          onClick={label === '설정' ? handleSettingsTap : undefined}
        />
      ))}
    </nav>

    {showDevPrompt && (
      <>
        <div onClick={() => setShowDevPrompt(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', zIndex: 201,
          background: 'var(--color-bg-primary)', borderRadius: '20px 20px 0 0', padding: '24px 20px 40px',
        }}>
          <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '12px' }}>
            개발자 모드
          </p>
          <input
            type="password"
            value={devPassword}
            onChange={(e) => { setDevPassword(e.target.value); setDevError(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleDevSubmit() }}
            placeholder="비밀번호"
            autoFocus
            style={{
              width: '100%', padding: '13px 14px', background: 'var(--color-bg-card)',
              border: devError ? '1.5px solid #EF5350' : '1px solid var(--color-border)',
              borderRadius: '12px', fontSize: '15px', color: 'var(--color-text-primary)', outline: 'none', boxSizing: 'border-box',
              marginBottom: devError ? '6px' : '16px',
            }}
          />
          {devError && (
            <p style={{ fontSize: '12px', color: 'var(--color-danger-dark)', marginBottom: '16px' }}>비밀번호가 올바르지 않아요</p>
          )}
          <button
            onClick={handleDevSubmit}
            style={{ width: '100%', padding: '14px', background: 'var(--color-accent-primary)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
          >
            확인
          </button>
        </div>
      </>
    )}
    </>
  )
}
