'use client'

import { TabBar } from './TabBar'

interface AppLayoutProps {
  children: React.ReactNode
  activeTab: string
  hideTabBar?: boolean
}

export function AppLayout({ children, activeTab, hideTabBar }: AppLayoutProps) {
  return (
    <div
      className="flex flex-col"
      style={{ minHeight: '100dvh', background: 'var(--color-bg-primary)' }}
    >
      <main className="flex-1 overflow-y-auto">{children}</main>
      {!hideTabBar && <TabBar activeTab={activeTab} />}
    </div>
  )
}
