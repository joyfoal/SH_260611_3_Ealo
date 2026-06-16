'use client'

import Link from 'next/link'
import { Home, Sparkles, Gamepad2, Users, Settings } from 'lucide-react'

const TABS = [
  { label: '홈', href: '/home', icon: Home },
  { label: '성공의 말', href: '/affirmations', icon: Sparkles },
  { label: '게임', href: '/games', icon: Gamepad2 },
  { label: '함께', href: '/community', icon: Users },
  { label: '설정', href: '/settings', icon: Settings },
] as const

interface TabBarProps {
  activeTab: string
}

export function TabBar({ activeTab }: TabBarProps) {
  return (
    <nav
      style={{
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
      }}
      className="flex items-center justify-around py-2 pb-safe"
    >
      {TABS.map(({ label, href, icon: Icon }) => {
        const isActive = activeTab === label
        return (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 min-w-[44px] py-1"
            style={{
              color: isActive
                ? 'var(--color-tab-active)'
                : 'var(--color-tab-inactive)',
            }}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
            <span style={{ fontSize: label === '성공의 말' ? '8px' : '10px' }}>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
