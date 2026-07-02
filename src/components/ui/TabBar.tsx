'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Home, Gamepad2, Users, Settings, Mic, type LucideIcon } from 'lucide-react'
import { goToSpeak } from '@/lib/storage'

const LEFT_TABS = [
  { label: '홈', href: '/home', icon: Home },
  { label: '게임', href: '/games', icon: Gamepad2 },
] as const

const RIGHT_TABS = [
  { label: '함께', href: '/community', icon: Users },
  { label: '설정', href: '/settings', icon: Settings },
] as const

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
  label, href, icon: Icon, isActive,
}: { label: string; href: string; icon: LucideIcon; isActive: boolean }) {
  return (
    <Link
      href={href}
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

  return (
    <nav
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
      }}
      className="flex items-center justify-around py-2 pb-safe"
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
            filter: 'drop-shadow(0 6px 10px rgba(186,117,23,0.45))',
          }}
        >
          <svg width={72} height={72} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
            <path d={STAR_PATH} fill="var(--color-accent-primary)" />
          </svg>
          <Mic size={30} strokeWidth={2} color="#fff" style={{ position: 'relative' }} />
        </span>
      </button>

      {RIGHT_TABS.map(({ label, href, icon }) => (
        <TabLink key={label} label={label} href={href} icon={icon} isActive={activeTab === label} />
      ))}
    </nav>
  )
}
