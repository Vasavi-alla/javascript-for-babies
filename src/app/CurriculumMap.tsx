import { Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { LESSONS, PHASES, lessonsForPhase, type LessonMeta } from '../content/registry'
import { dailyNote } from '../content/motivation'
import { LEARNER_NAME } from '../content/learner'
import { useProgress } from '../store/progress'
import { activeDaySet, computeStreak, localDay, monthGrid } from '../engine/coach/stats'
import { PaperCard } from '../design/PaperCard'
import { TapeLabel } from '../design/TapeLabel'
import { InkButton } from '../design/InkButton'
import { HighlightMark } from '../design/HighlightMark'
import { DailySticker } from '../design/DailySticker'
import { RoughEllipse } from '../design/rough-svg'

/**
 * The landing page, as a notebook spread:
 *  1. the morning page — greeting, ONE continue card, and a margin rail
 *     (daily sticker, handwritten margin notes, month calendar);
 *  2. the road — the 11 phases as a vertical trail with wax-seal stations,
 *     "you are here" pinned to the current one;
 *  3. the desk — Barnaby patrolling the bottom edge.
 */

function greetingByHour(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '☀️ Good morning'
  if (hour < 17) return '🌤️ Good afternoon'
  return '🌙 Good evening'
}

/** First unfinished, already-built lesson — the single thing to do next. */
function findNextLesson(completed: Record<string, string>): LessonMeta | undefined {
  return LESSONS.find((l) => l.status === 'available' && !completed[l.id])
}

export function CurriculumMap() {
  const progress = useProgress()
  const { completedLessons, completedChallenges, solvedExercises } = progress
  const navigate = useNavigate()

  const days = activeDaySet(progress)
  const { streak, aliveToday } = computeStreak(days)
  const today = localDay()
  const month = monthGrid()
  const startedEver = Object.keys(completedLessons).length > 0 || Object.keys(completedChallenges).length > 0

  const next = findNextLesson(completedLessons)
  const currentPhase = next?.phase ?? PHASES.filter((p) => lessonsForPhase(p.number).length > 0).at(-1)?.number ?? 0

  const continueLabel = !startedEver ? 'start at page one ▸' : 'continue where I left off ▸'

  const lessonsDone = Object.keys(completedLessons).length
  const solvedCount = Object.keys(solvedExercises).length
  const minutesToday = progress.studyLog[today] ?? 0

  return (
    <div className="flex flex-col gap-14">
      {/* ── 1 · the morning page ─────────────────────────────── */}
      <section className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8">
        <div className="min-w-64 flex-1">
          <div className="flex items-center gap-5">
            <img
              src="/vasavi.png"
              alt="Vasavi"
              className="border-ink h-32 w-32 shrink-0 rounded-2xl border-2 object-cover shadow-[2px_4px_10px_rgba(43,41,37,0.18)] sm:h-36 sm:w-36"
              style={{ rotate: '-2deg' }}
            />
            <div>
              <p className="text-ink-soft font-hand text-2xl">{greetingByHour()}</p>
              <h1 className="font-hand mt-1 text-5xl font-bold sm:text-6xl">
                Welcome{startedEver ? ' back' : ''}, {LEARNER_NAME}
              </h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-lg">
            {streak > 0 ? (
              <>
                Day {streak} on the road from zero to{' '}
                <HighlightMark type="underline" color="var(--color-marker-teal)">
                  automation tester
                </HighlightMark>
                .
              </>
            ) : startedEver ? (
              <>Back on the road — your notebook kept your page.</>
            ) : (
              <>
                The road from zero to{' '}
                <HighlightMark type="underline" color="var(--color-marker-teal)">
                  automation tester
                </HighlightMark>{' '}
                starts on page one.
              </>
            )}
          </p>

          <PaperCard id="continue-card" tilt={false} className="mt-6 max-w-xl">
            {next ? (
              <>
                <p className="text-ink-soft text-sm">
                  next on the road · phase {next.phase}: {PHASES.find((p) => p.number === next.phase)?.title}
                </p>
                <p className="font-hand mt-1 text-3xl font-bold">
                  {next.id} — {next.title}
                </p>
                <p className="text-ink-soft mt-1.5">{next.blurb}</p>
                <div className="mt-4">
                  <InkButton id="continue-journey" variant="primary" onClick={() => navigate(`/lesson/${next.id}`)}>
                    {continueLabel}
                  </InkButton>
                </div>
              </>
            ) : (
              <>
                <p className="font-hand text-3xl font-bold">You’ve cleared every page drawn so far 🎉</p>
                <p className="text-ink-soft mt-1.5">
                  The next chapters are still being inked. Meanwhile, sharpened hands stay sharp:
                </p>
                <div className="mt-4">
                  <InkButton id="continue-journey" variant="primary" onClick={() => navigate(`/phase/${currentPhase}`)}>
                    revisit phase {currentPhase} ▸
                  </InkButton>
                </div>
              </>
            )}
          </PaperCard>
        </div>

        {/* the margin rail: sticker, margin notes, month */}
        <aside className="flex w-full max-w-xs flex-col gap-6">
          <DailySticker day={today} {...dailyNote(today)} />

          <div className="border-ink-soft/40 font-hand flex flex-col gap-1 border-l-2 border-dashed pl-4 text-xl">
            <span>
              🔥 {streak} day{streak === 1 ? '' : 's'}{' '}
              <span className="text-ink-soft text-base">
                {aliveToday ? '— alive today ✓' : streak > 0 ? '— a few minutes keeps it alive' : '— starts today'}
              </span>
            </span>
            <span>📘 {lessonsDone} lesson{lessonsDone === 1 ? '' : 's'} completed</span>
            <span>⌨️ {solvedCount} exercise{solvedCount === 1 ? '' : 's'} solved by hand</span>
            <span>⏱️ {minutesToday} min today</span>
          </div>

          <div>
            <div className="grid w-fit grid-cols-7 gap-1">
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
            <p className="text-ink-soft font-hand mt-1 text-lg">{month.title}</p>
          </div>
        </aside>
      </section>

      {/* ── 2 · the road ─────────────────────────────────────── */}
      <section>
        <TapeLabel id="map-road" color="var(--color-marker-coral)">
          the road — zero to automation tester
        </TapeLabel>
        <p className="text-ink-soft mt-2 max-w-2xl text-[15px]">
          Eleven regions, walked in order — each one has its own page that explains, in plain words,
          what it teaches and why it matters. Pencil-drawn regions get inked in as you approach them.
        </p>

        <div className="relative mt-8 flex flex-col gap-9">
          {/* the trail itself */}
          <div
            aria-hidden
            className="border-ink-soft/40 absolute top-2 bottom-2 left-[23px] border-l-2 border-dashed md:left-1/2 md:-translate-x-px"
          />

          {PHASES.map((phase, i) => {
            const built = lessonsForPhase(phase.number)
            const done = built.filter((l) => completedLessons[l.id]).length
            const cleared = built.length > 0 && done === built.length
            const isCurrent = phase.number === currentPhase
            const isPencil = built.length === 0
            const isFoundation = phase.number <= 1
            const onLeft = i % 2 === 0

            const status = isPencil
              ? `✏️ ${phase.plannedLessons} lessons in pencil`
              : cleared
                ? `cleared ✓ — all ${built.length} lessons`
                : done > 0
                  ? `${done} of ${built.length} lessons done`
                  : `${built.length} lessons, ready`

            return (
              <div key={phase.number} className="relative pl-16 md:grid md:grid-cols-2 md:gap-x-20 md:pl-0">
                <div className="absolute top-0 left-0 md:left-1/2 md:-translate-x-1/2">
                  <Seal
                    number={phase.number}
                    state={isCurrent ? 'current' : cleared ? 'cleared' : isPencil ? 'pencil' : 'open'}
                  />
                </div>

                <div className={onLeft ? 'md:col-start-1 md:justify-self-end' : 'md:col-start-2'}>
                  {isCurrent && (
                    <TapeLabel id={`here-${phase.number}`} color="var(--color-marker-coral)" className="mb-2 text-xl">
                      📍 you are here
                    </TapeLabel>
                  )}
                  <div className={`max-w-md ${isPencil ? 'opacity-60' : ''}`}>
                    <Link to={`/phase/${phase.number}`} className="group block">
                      <p className="font-hand text-2xl font-bold group-hover:underline">
                        {phase.title}
                        {isFoundation && (
                          <span className="text-marker-coral ml-2 text-base font-semibold">the foundation</span>
                        )}
                      </p>
                      <p className="text-ink-soft mt-0.5 text-[15px] italic">“{phase.question}”</p>
                      <p className={`font-hand mt-1 text-lg ${cleared ? 'text-marker-teal' : ''}`}>
                        {status} <span className="text-ink-soft underline">step inside →</span>
                      </p>
                    </Link>
                    {isCurrent && next && (
                      <p className="text-ink-soft mt-1 text-sm">
                        up next in this region: <span className="font-semibold">{next.id} {next.title}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* the end of the road */}
          <div className="relative pl-16 md:pl-0 md:text-center">
            <div className="absolute top-0 left-[9px] md:static">
              <span className="text-3xl">🏁</span>
            </div>
            <p className="font-hand text-2xl font-bold">job-ready: automation tester</p>
            <p className="text-ink-soft text-sm">the road ends at a job title — every region walked, every concept teachable</p>
          </div>
        </div>
      </section>

    </div>
  )
}

/** A wax-seal trail marker: the phase number stamped on the road. */
function Seal({ number, state }: { number: number; state: 'cleared' | 'current' | 'open' | 'pencil' }) {
  const seal = (
    <svg viewBox="0 0 48 48" className="h-12 w-12">
      {state === 'current' && (
        <RoughEllipse cx={24} cy={24} width={45} height={45} seed={700 + number} stroke="var(--color-marker-coral)" strokeWidth={2} />
      )}
      <RoughEllipse
        cx={24}
        cy={24}
        width={35}
        height={35}
        seed={710 + number}
        stroke={state === 'pencil' ? 'var(--color-ink-soft)' : state === 'current' ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
        strokeWidth={state === 'current' ? 2.4 : 2}
        roughness={state === 'pencil' ? 2.4 : 1.2}
        fill={state === 'cleared' ? 'var(--color-marker-teal)' : undefined}
        fillStyle="hachure"
      />
      <text
        x={24}
        y={31}
        textAnchor="middle"
        fontFamily="var(--font-hand)"
        fontSize={19}
        fontWeight={700}
        fill={state === 'pencil' ? 'var(--color-ink-soft)' : 'var(--color-ink)'}
      >
        {number}
      </text>
    </svg>
  )

  return (
    <div className="bg-paper" style={{ borderRadius: '50%' }}>
      {state === 'current' ? (
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {seal}
        </motion.div>
      ) : (
        seal
      )}
    </div>
  )
}
