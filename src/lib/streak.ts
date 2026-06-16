import { getStreakData, saveStreakData, todayStr } from './storage'

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)
}

export function updateStreak(completedToday: boolean): void {
  if (!completedToday) return

  const data = getStreakData()
  const today = todayStr()

  if (data.lastCompletedDate === today) return // already updated

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (data.lastCompletedDate === yesterdayStr) {
    data.currentStreak++
  } else if (data.lastCompletedDate === null) {
    data.currentStreak = 1
  } else {
    const daysMissed = daysBetween(data.lastCompletedDate, today) - 1
    if (daysMissed === 1 && data.shields > 0) {
      data.shields--
      data.currentStreak++
    } else {
      data.currentStreak = 1
    }
  }

  data.lastCompletedDate = today

  if (data.currentStreak % 7 === 0) {
    data.shields++
  }

  saveStreakData(data)
}
