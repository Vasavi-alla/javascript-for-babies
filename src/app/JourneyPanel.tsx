import { useProgress } from '../store/progress'
import { activeDaySet, computeStreak, lastNDays, localDay } from '../engine/coach/stats'
import { dailyMessage } from '../content/motivation'
import { PaperCard } from '../design/PaperCard'
import { StickyNote } from '../design/StickyNote'
import { hashSeed, seededBetween } from '../design/seed'

/** Home-page strip: streak, counters, the last week, and today's note. */
export function JourneyPanel() {
  const progress = useProgress()
  const days = activeDaySet(progress)
  const { streak, aliveToday } = computeStreak(days)
  const week = lastNDays(7)
  const today = localDay()
  const lessonsDone = Object.keys(progress.completedLessons).length
  const solved = Object.keys(progress.solvedExercises).length
  const minutesToday = progress.studyLog[today] ?? 0

  const streakLine = aliveToday
    ? 'alive today ✓'
    : streak > 0
      ? 'a few minutes today keeps it alive'
      : 'it starts with today’s first lesson'

  return (
    <PaperCard id="journey-panel" tilt={false}>
      <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6">
        <div>
          <p className="font-hand text-6xl leading-none font-bold">
            🔥 {streak}
            <span className="ml-2 text-2xl font-semibold">day{streak === 1 ? '' : 's'}</span>
          </p>
          <p className="text-ink-soft font-hand mt-1 text-lg">{streakLine}</p>
        </div>

        <div className="font-hand flex flex-col gap-0.5 text-xl">
          <span>📘 {lessonsDone} lesson{lessonsDone === 1 ? '' : 's'} completed</span>
          <span>⌨️ {solved} exercise{solved === 1 ? '' : 's'} solved by hand</span>
          <span>⏱️ {minutesToday} min today</span>
        </div>

        <div>
          <div className="flex gap-2.5">
            {week.map(({ day, label }) => (
              <div key={day} className="flex flex-col items-center gap-1">
                <span
                  className={`h-6 w-6 rounded-full border-2 ${
                    days.has(day) ? 'bg-marker-teal border-ink' : 'border-ink-soft/50 border-dashed'
                  }`}
                  style={{ rotate: `${seededBetween(hashSeed(day), -8, 8)}deg` }}
                />
                <span className="font-hand text-ink-soft text-sm">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-ink-soft font-hand mt-1 text-center text-lg">this week</p>
        </div>

        <StickyNote id={`daily-note-${today}`} className="max-w-72">
          <p className="font-hand text-xl font-bold">📌 today’s note from the shop</p>
          <p className="mt-1 text-[15px]">{dailyMessage(today)}</p>
        </StickyNote>
      </div>
    </PaperCard>
  )
}
