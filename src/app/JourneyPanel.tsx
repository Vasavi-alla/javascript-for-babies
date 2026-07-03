import { useProgress } from '../store/progress'
import { activeDaySet, computeStreak, monthGrid, localDay } from '../engine/coach/stats'
import { dailyNote } from '../content/motivation'
import { PaperCard } from '../design/PaperCard'
import { DailySticker } from '../design/DailySticker'

/** Home-page strip: streak, counters, this month's activity, and today's note. */
export function JourneyPanel() {
  const progress = useProgress()
  const days = activeDaySet(progress)
  const { streak, aliveToday } = computeStreak(days)
  const month = monthGrid()
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
          <div className="grid grid-cols-7 gap-1">
            {month.weekdays.map((label) => (
              <span key={label} className="font-hand text-ink-soft text-center text-xs">
                {label}
              </span>
            ))}
            {month.cells.map((cell, i) =>
              cell === null ? (
                <span key={`pad-${i}`} />
              ) : (
                <span
                  key={cell.day}
                  title={days.has(cell.day) ? `${cell.day} — studied ✓` : cell.day}
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
                    days.has(cell.day)
                      ? 'bg-marker-teal border-ink text-ink border-2'
                      : cell.isFuture
                        ? 'text-ink-soft/40'
                        : 'border-ink-soft/40 text-ink-soft border border-dashed'
                  } ${cell.isToday ? 'ring-marker-coral ring-2' : ''}`}
                >
                  {cell.date}
                </span>
              ),
            )}
          </div>
          <p className="text-ink-soft font-hand mt-1 text-center text-lg">{month.title}</p>
        </div>

        <DailySticker day={today} {...dailyNote(today)} />
      </div>
    </PaperCard>
  )
}
