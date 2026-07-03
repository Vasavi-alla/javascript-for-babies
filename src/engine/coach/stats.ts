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

/** The last `n` local days, oldest first, ending today. */
export function lastNDays(n: number): Array<{ day: string; label: string }> {
  const out: Array<{ day: string; label: string }> = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - (n - 1))
  for (let i = 0; i < n; i++) {
    out.push({
      day: localDay(cursor),
      label: cursor.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
    })
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}
