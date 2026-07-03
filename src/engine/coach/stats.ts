/** Streak & activity math over the progress store's timestamps. */

interface ProgressSlices {
  completedLessons: Record<string, string>
  solvedExercises: Record<string, string>
  completedChallenges: Record<string, string>
  studyLog: Record<string, number>
}

/** Local calendar day as YYYY-MM-DD (not UTC — a late-night session is still "today"). */
export function localDay(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Every local day with any learning activity: study minutes, lessons, exercises, challenges. */
export function activeDaySet(p: ProgressSlices): Set<string> {
  const days = new Set<string>(Object.keys(p.studyLog))
  const stamps = [
    ...Object.values(p.completedLessons),
    ...Object.values(p.solvedExercises),
    ...Object.values(p.completedChallenges),
  ]
  for (const iso of stamps) days.add(localDay(new Date(iso)))
  return days
}

/**
 * Consecutive active days ending today — or ending yesterday if today hasn't
 * started yet (the streak isn't broken until the day is actually missed).
 */
export function computeStreak(days: Set<string>): { streak: number; aliveToday: boolean } {
  const aliveToday = days.has(localDay())
  const cursor = new Date()
  if (!aliveToday) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(localDay(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return { streak, aliveToday }
}

export interface MonthCell {
  day: string
  date: number
  isToday: boolean
  isFuture: boolean
}

/**
 * The current calendar month as a Monday-start grid: leading/trailing nulls
 * pad to whole weeks. Activity state comes from activeDaySet — i.e. from the
 * persisted progress store in localStorage.
 */
export function monthGrid(now: Date = new Date()): {
  title: string
  weekdays: string[]
  cells: Array<MonthCell | null>
} {
  const year = now.getFullYear()
  const month = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const mondayStartOffset = (new Date(year, month, 1).getDay() + 6) % 7
  const todayKey = localDay(now)

  const cells: Array<MonthCell | null> = Array.from({ length: mondayStartOffset }, () => null)
  for (let d = 1; d <= daysInMonth; d++) {
    const key = localDay(new Date(year, month, d))
    cells.push({ day: key, date: d, isToday: key === todayKey, isFuture: key > todayKey })
  }
  while (cells.length % 7 !== 0) cells.push(null)

  // Locale-correct two-letter weekday labels, Monday first.
  const monday = new Date(now)
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)
  })

  return {
    title: now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    weekdays,
    cells,
  }
}
