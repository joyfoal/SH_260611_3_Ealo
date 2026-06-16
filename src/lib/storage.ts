export type ThemeName = 'warm' | 'dark' | 'green'

export type AffirmationCategory = string

export interface Affirmation {
  id: string
  text: string
  category: AffirmationCategory
  createdAt: string
  completedDates: string[]
}

export interface DayRecord {
  date: string
  completedCount: number
  dominantCategory: AffirmationCategory | null
}

export interface StreakData {
  currentStreak: number
  lastCompletedDate: string | null
  shields: number
}

export interface TomorrowNote {
  date: string
  message: string
  selectedAffirmationIds: string[]
}

const KEYS = {
  AFFIRMATIONS: 'mornim-affirmations',
  CALENDAR: 'mornim-calendar',
  STREAK: 'mornim-streak',
  THEME: 'mornim-theme',
  ONBOARDING_DONE: 'mornim-onboarded',
  TOMORROW_NOTE: 'mornim-tomorrow-note',
  TODAY_AFFIRMATIONS: 'mornim-today-affirmations',
  WEEKLY_REPORT_SHOWN: 'mornim-weekly-report-shown',
  TOMORROW_ENABLED: 'mornim-tomorrow-enabled',
  CATEGORIES: 'mornim-categories',
} as const

const DEFAULT_CATEGORIES = [
  '나 자신', '일과 커리어', '돈과 풍요', '관계와 사랑',
  '건강과 몸', '용기와 도전', '마음과 평온', '오늘 하루',
]

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore storage errors
  }
}

// Affirmations
export function getAffirmations(): Affirmation[] {
  return safeGet<Affirmation[]>(KEYS.AFFIRMATIONS, [])
}

export function saveAffirmation(a: Affirmation): void {
  const list = getAffirmations()
  list.push(a)
  safeSet(KEYS.AFFIRMATIONS, list)
}

export function updateAffirmation(a: Affirmation): void {
  const list = getAffirmations()
  const idx = list.findIndex((x) => x.id === a.id)
  if (idx >= 0) list[idx] = a
  else list.push(a)
  safeSet(KEYS.AFFIRMATIONS, list)
}

export function deleteAffirmation(id: string): void {
  const list = getAffirmations().filter((x) => x.id !== id)
  safeSet(KEYS.AFFIRMATIONS, list)
}

// Calendar
export function getCalendar(): DayRecord[] {
  return safeGet<DayRecord[]>(KEYS.CALENDAR, [])
}

export function getDayRecord(date: string): DayRecord | null {
  const list = getCalendar()
  return list.find((r) => r.date === date) ?? null
}

export function saveDayRecord(r: DayRecord): void {
  const list = getCalendar()
  const idx = list.findIndex((x) => x.date === r.date)
  if (idx >= 0) list[idx] = r
  else list.push(r)
  safeSet(KEYS.CALENDAR, list)
}

// Streak
export function getStreakData(): StreakData {
  return safeGet<StreakData>(KEYS.STREAK, {
    currentStreak: 0,
    lastCompletedDate: null,
    shields: 0,
  })
}

export function saveStreakData(s: StreakData): void {
  safeSet(KEYS.STREAK, s)
}

// Today's affirmation queue
export function getTodayAffirmationIds(): string[] {
  return safeGet<string[]>(KEYS.TODAY_AFFIRMATIONS, [])
}

export function saveTodayAffirmationIds(ids: string[]): void {
  safeSet(KEYS.TODAY_AFFIRMATIONS, ids)
}

// Tomorrow note
export function getTomorrowNote(): TomorrowNote | null {
  return safeGet<TomorrowNote | null>(KEYS.TOMORROW_NOTE, null)
}

export function saveTomorrowNote(n: TomorrowNote): void {
  safeSet(KEYS.TOMORROW_NOTE, n)
}

// Onboarding
export function isOnboarded(): boolean {
  return safeGet<boolean>(KEYS.ONBOARDING_DONE, false)
}

export function setOnboarded(): void {
  safeSet(KEYS.ONBOARDING_DONE, true)
}

// Theme
export function getTheme(): ThemeName {
  return safeGet<ThemeName>(KEYS.THEME, 'warm')
}

export function setTheme(t: ThemeName): void {
  safeSet(KEYS.THEME, t)
}

// Tomorrow enabled
export function isTomorrowEnabled(): boolean {
  return safeGet<boolean>(KEYS.TOMORROW_ENABLED, true)
}

export function setTomorrowEnabled(v: boolean): void {
  safeSet(KEYS.TOMORROW_ENABLED, v)
}

// Categories (dynamic)
export function getCategories(): string[] {
  return safeGet<string[]>(KEYS.CATEGORIES, DEFAULT_CATEGORIES)
}

export function saveCategories(cats: string[]): void {
  safeSet(KEYS.CATEGORIES, cats)
}

// Helper
export function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

// Generate today's affirmation queue
export function generateTodayQueue(): string[] {
  const today = todayStr()
  const note = getTomorrowNote()
  if (note && note.date === today && note.selectedAffirmationIds.length > 0) {
    return note.selectedAffirmationIds.slice(0, 3)
  }
  const affirmations = getAffirmations()
  if (affirmations.length === 0) return []
  const notRecentlyDone = affirmations
    .filter((a) => !a.completedDates.includes(today))
    .sort(() => Math.random() - 0.5)
  const recentlyDone = affirmations
    .filter((a) => a.completedDates.includes(today))
    .sort(() => Math.random() - 0.5)
  const combined = [...notRecentlyDone, ...recentlyDone]
  return combined.slice(0, 3).map((a) => a.id)
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === 'undefined') return
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
