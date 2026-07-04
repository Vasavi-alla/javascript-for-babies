import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { LESSONS, PHASES, lessonsForPhase, type LessonMeta } from '../content/registry'
import { dailyNote } from '../content/motivation'
import { DEFAULT_NAME, nameSlug, useLearnerName } from '../content/learner'
import { useProgress } from '../store/progress'
import { activeDaySet, computeStreak, localDay, monthGrid } from '../engine/coach/stats'
import { PaperCard } from '../design/PaperCard'
import { TapeLabel } from '../design/TapeLabel'
import { InkButton } from '../design/InkButton'
import { HighlightMark } from '../design/HighlightMark'
import { DailySticker } from '../design/DailySticker'
import { RoughCurve, RoughEllipse, RoughLine, RoughPolygon, RoughRect } from '../design/rough-svg'
import { useMeasure } from '../design/useMeasure'
import { ResidentCat } from './ResidentCat'

/**
 * The landing page, as a notebook spread:
 *  1. the morning page — greeting, ONE continue card, and a margin rail
 *     (daily sticker, handwritten margin notes, month calendar);
 *  2. the road — one hand-drawn winding road down the page: walked stretch
 *     inked in teal with pawprints, the learner's avatar standing at the
 *     current phase, the rest in faint pencil, a checkered flag at the end;
 *  3. a hand-written sign-off footer (Barnaby patrols via the fixed strip).
 */

function greetingByHour(): string {
  const hour = new Date().getHours()
  if (hour < 12) return '☀️ Good morning'
  if (hour < 17) return '🌤️ Good afternoon'
  return '🌙 Good evening'
}

/**
 * The learner's name in the headline — click it, type, Enter. Saved via
 * useLearnerName (localStorage). Saving a real name also gives the page its
 * /<name>-journey address (cosmetic; the route never reads the slug back).
 */
function EditableName() {
  const [name, setName] = useLearnerName()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  // set once Enter/Escape has handled the edit, so the input's own blur
  // (which fires right after) can't double-commit or save a cancelled edit
  const done = useRef(false)

  const startEditing = () => {
    done.current = false
    setDraft(name === DEFAULT_NAME ? '' : name)
    setEditing(true)
  }

  const commit = () => {
    if (done.current) return
    done.current = true
    setEditing(false)
    const saved = setName(draft)
    const slug = nameSlug(saved)
    if (saved !== DEFAULT_NAME && slug) navigate(`/${slug}-journey`, { replace: true })
  }

  const cancel = () => {
    done.current = true
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') cancel()
        }}
        maxLength={30}
        size={Math.max(draft.length, 8)}
        placeholder="your name"
        aria-label="your name"
        autoCapitalize="words"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="done"
        className="bg-transparent outline-none"
        style={{ font: 'inherit', color: 'inherit', borderBottom: '3px dashed var(--color-ink-soft)' }}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEditing}
      title="click to change the name"
      className="cursor-pointer"
      style={{
        font: 'inherit',
        color: 'inherit',
        background: 'none',
        border: 'none',
        padding: 0,
        textDecoration: 'underline dashed var(--color-ink-soft)',
        textDecorationThickness: '2px',
        textUnderlineOffset: '6px',
      }}
    >
      {name}
      <span aria-hidden className="ml-1 align-middle text-3xl">✏️</span>
    </button>
  )
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

  // how much of the road is inked: whole segments for passed phases, plus a
  // bit of the current segment as its lessons get done (11 legs incl. finish)
  const curBuilt = lessonsForPhase(currentPhase)
  const curDone = curBuilt.filter((l) => completedLessons[l.id]).length
  const partialInCurrent = curBuilt.length > 0 ? curDone / curBuilt.length : 0
  const roadProgress = Math.min(1, (currentPhase + partialInCurrent * 0.9) / BENDS.length)

  // the road is drawn in real pixels (measured), so the hand-drawn wobble
  // stays uniform instead of stretching with the viewport
  const [roadRef, { width: roadWidth }] = useMeasure<HTMLDivElement>()
  const roadPoints = [...BENDS, FINISH].map((b) => ({ x: (b.x / 100) * roadWidth, y: b.y }))

  const continueLabel = !startedEver ? 'start at page one ▸' : 'continue where I left off ▸'

  const lessonsDone = Object.keys(completedLessons).length
  const solvedCount = Object.keys(solvedExercises).length
  const minutesToday = progress.studyLog[today] ?? 0

  return (
    // extra bottom padding: Barnaby's fixed strip lives on this page only
    <div className="flex flex-col gap-14 pb-16">
      <ResidentCat />
      {/* ── 1 · the morning page ─────────────────────────────── */}
      <section className="flex flex-wrap items-start justify-between gap-x-12 gap-y-8">
        <div className="min-w-64 flex-1">
          <p className="text-ink-soft font-hand text-2xl">{greetingByHour()}</p>
          <h1 className="font-hand mt-1 text-5xl font-bold sm:text-6xl">
            Welcome{startedEver ? ' back' : ''}, <EditableName />
          </h1>
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
            {/* a random portrait of hers perches on the card's corner each
                visit — absolute, so the card keeps its own size; links to
                her LinkedIn */}
            <a
              href="https://www.linkedin.com/in/vasavi-alla/"
              target="_blank"
              rel="noopener noreferrer"
              title="Vasavi on LinkedIn ↗"
              className="border-ink absolute -top-6 right-5 block h-28 w-24 overflow-hidden rounded-xl border-2 shadow-[3px_5px_12px_rgba(43,41,37,0.22)] sm:-top-8 sm:h-32 sm:w-28"
              style={{ rotate: '2.5deg' }}
            >
              <RandomPortrait />
            </a>
            {/* text keeps clear of her column at every viewport width */}
            <div className="pr-24 sm:pr-28">
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
            </div>
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
          Twelve regions, walked in order — each one has its own page that explains, in plain words,
          what it teaches and why it matters. The stretch you’ve walked is inked in; the rest waits
          in pencil.
        </p>

        <div
          ref={roadRef}
          className="relative left-1/2 mt-6 w-[min(calc(100vw-1.5rem),1440px)] -translate-x-1/2"
          style={{ height: ROAD_HEIGHT }}
        >
          {/* the journey map: scenery on the flanks, one sketchy pencil route
              (rough.js — the Excalidraw stroke), walked stretch in marker teal */}
          {roadWidth > 0 && (
            <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox={`0 0 ${roadWidth} ${ROAD_HEIGHT}`}>
              <g opacity={0.55}>
                {SCENERY.filter((d) => d.kind !== 'danger').map((d, i) => (
                  <SceneryDoodle key={i} d={d} width={roadWidth} />
                ))}
              </g>
              {/* warning signs carry meaning — they stay more legible */}
              <g opacity={0.85}>
                {SCENERY.filter((d) => d.kind === 'danger').map((d, i) => (
                  <SceneryDoodle key={i} d={d} width={roadWidth} />
                ))}
              </g>
              <RoughCurve
                points={roadPoints}
                seed={841}
                stroke="var(--color-ink-soft)"
                strokeWidth={2.2}
                roughness={1.7}
                bowing={1.4}
                disableMultiStroke
                strokeDasharray="7 9"
                opacity={0.6}
              />
              <motion.path
                d={roadPath(roadPoints)}
                fill="none"
                stroke="var(--color-marker-teal)"
                strokeOpacity={0.7}
                strokeWidth={5}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: roadProgress }}
                transition={{ duration: 1.6, ease: 'easeInOut' }}
              />
            </svg>
          )}

          {/* Barnaby's pawprints on the walked stretch */}
          {BENDS.slice(0, Math.max(0, currentPhase)).map((bend, i) => {
            const nextBend = BENDS[i + 1]
            return (
              <span
                key={`paw-${i}`}
                aria-hidden
                className="absolute -translate-x-1/2 -translate-y-1/2 text-[13px] opacity-50"
                style={{
                  left: `${(bend.x + nextBend.x) / 2 + (i % 2 ? 4 : -4)}%`,
                  top: (bend.y + nextBend.y) / 2,
                  rotate: i % 2 ? '18deg' : '-14deg',
                }}
              >
                🐾
              </span>
            )
          })}

          {/* stations */}
          {PHASES.map((phase) => {
            const bend = BENDS[phase.number]
            if (!bend) return null
            const built = lessonsForPhase(phase.number).filter((l) => l.status === 'available')
            const done = built.filter((l) => completedLessons[l.id]).length
            const cleared = built.length > 0 && done === built.length
            const isCurrent = phase.number === currentPhase
            const isPencil = built.length === 0
            const cardOnRight = bend.x < 50

            const status = isPencil
              ? `✏️ ${phase.plannedLessons} lessons in pencil`
              : cleared
                ? `cleared ✓ — all ${built.length} lessons`
                : done > 0
                  ? `${done} of ${built.length} lessons done`
                  : `${built.length} lessons, ready`

            return (
              <div key={phase.number}>
                {/* marker standing on the road */}
                <div
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${bend.x}%`, top: bend.y }}
                >
                  {isCurrent ? (
                    <div className="flex flex-col items-center">
                      <motion.img
                        src="/favicon.png"
                        alt="you are here"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="border-marker-coral bg-paper h-12 w-12 rounded-full border-2 shadow-md"
                      />
                      <span className="bg-paper font-hand text-marker-coral mt-0.5 rounded px-1 text-base font-bold whitespace-nowrap">
                        you are here
                      </span>
                    </div>
                  ) : (
                    <Seal number={phase.number} state={cleared ? 'cleared' : isPencil ? 'pencil' : 'open'} />
                  )}
                </div>

                {/* the phase card, on the side the bend opens toward; every text
                    line sits on a paper-colored plate so the road passes BEHIND
                    the words instead of through them */}
                <div
                  className={`absolute flex w-[min(19rem,40vw)] flex-col ${cardOnRight ? 'items-start' : 'items-end'} ${isPencil ? 'opacity-60' : ''}`}
                  style={{
                    top: bend.y - 14,
                    ...(cardOnRight
                      ? { left: `calc(${bend.x}% + 42px)` }
                      : { right: `calc(${100 - bend.x}% + 42px)`, textAlign: 'right' as const }),
                  }}
                >
                  <Link
                    to={`/phase/${phase.number}`}
                    className={`group flex flex-col ${cardOnRight ? 'items-start' : 'items-end'}`}
                  >
                    <p className="bg-paper font-hand w-fit rounded px-1.5 text-2xl leading-tight font-bold group-hover:underline">
                      {phase.title}
                      {phase.number <= 1 && (
                        <span className="text-marker-coral ml-2 text-base font-semibold">the foundation</span>
                      )}
                    </p>
                    <p className="bg-paper text-ink-soft mt-0.5 w-fit rounded px-1.5 text-sm italic">
                      “{phase.question}”
                    </p>
                    <p className={`bg-paper font-hand mt-0.5 w-fit rounded px-1.5 text-lg ${cleared ? 'text-marker-teal' : ''}`}>
                      {status} <span className="text-ink-soft underline">step inside →</span>
                    </p>
                  </Link>
                  {isCurrent && next && (
                    <p className="bg-paper text-ink-soft mt-1 w-fit rounded px-1.5 text-sm">
                      up next: <span className="font-semibold">{next.id} {next.title}</span>
                    </p>
                  )}
                </div>
              </div>
            )
          })}

          {/* the end of the road */}
          <div
            className="absolute -translate-x-1/2 text-center"
            style={{ left: `${FINISH.x}%`, top: FINISH.y - 18 }}
          >
            <span className="text-3xl">🏁</span>
            <p className="font-hand text-2xl font-bold whitespace-nowrap">job-ready: automation tester</p>
            <p className="text-ink-soft text-sm">every region walked, every concept teachable</p>
          </div>
        </div>
      </section>

      {/* ── 3 · sign-off ─────────────────────────────────────── */}
      <footer className="pb-2 text-center">
        <p className="font-hand text-ink-soft text-xl">
          drawn by Vasavi ·{' '}
          <a
            href="https://www.linkedin.com/in/vasavi-alla/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pencil-blue hover:text-ink underline decoration-wavy underline-offset-4"
          >
            say hi on LinkedIn ↗
          </a>
        </p>
      </footer>

    </div>
  )
}

// ── the winding road geometry ──────────────────────────────────────────────
/** Where each phase station sits: x in % of width, y in px. Hand-tuned bends —
 *  wide sweeps so the route reads as a journey, not a timeline. */
const BENDS = [
  { x: 50, y: 70 },
  { x: 20, y: 230 },
  { x: 72, y: 390 },
  { x: 22, y: 550 },
  { x: 80, y: 710 },
  { x: 24, y: 870 },
  { x: 72, y: 1030 },
  { x: 18, y: 1190 },
  { x: 78, y: 1350 },
  { x: 26, y: 1510 },
  { x: 72, y: 1670 },
  { x: 50, y: 1830 },
]
const FINISH = { x: 50, y: 1960 }
const ROAD_HEIGHT = 2040

/** One of her ten portraits, picked at random on every visit to this page. */
const PORTRAITS = Array.from({ length: 10 }, (_, i) => `/vasavi/${i + 1}.webp`)

function RandomPortrait() {
  const [src] = useState(() => PORTRAITS[Math.floor(Math.random() * PORTRAITS.length)])
  return <img src={src} alt="Vasavi" className="absolute inset-0 h-full w-full object-cover" />
}

/** Doodles on the flanks of the road — a game-map landscape: friendly meadows
 *  early, warning signs where learners actually get eaten, mountains late. */
type Doodle = {
  kind: 'pine' | 'cloud' | 'bush' | 'flower' | 'mountain' | 'danger' | 'lake' | 'campfire'
  x: number
  y: number
  s?: number
  label?: string
}
const SCENERY: Doodle[] = [
  // the gentle start: meadow country
  { kind: 'cloud', x: 8, y: 140 },
  { kind: 'flower', x: 14, y: 200 },
  { kind: 'pine', x: 88, y: 190, s: 1.1 },
  { kind: 'flower', x: 85, y: 290 },
  { kind: 'cloud', x: 90, y: 340 },
  { kind: 'pine', x: 10, y: 430, s: 1.25 },
  { kind: 'flower', x: 17, y: 500 },
  { kind: 'bush', x: 16, y: 590 },
  // functions country — scope has teeth
  { kind: 'danger', x: 84, y: 490, label: '⚠ mind the scope' },
  { kind: 'pine', x: 91, y: 620, s: 0.9 },
  { kind: 'pine', x: 8, y: 790, s: 1.05 },
  // "how JS really runs" — dragon territory
  { kind: 'danger', x: 11, y: 930, label: '⚠ here be dragons' },
  { kind: 'mountain', x: 88, y: 900, s: 1 },
  { kind: 'cloud', x: 7, y: 1030 },
  // the async swamp
  { kind: 'lake', x: 88, y: 1120 },
  { kind: 'danger', x: 87, y: 1060, label: '⚠ async swamp' },
  { kind: 'bush', x: 80, y: 1260 },
  { kind: 'pine', x: 12, y: 1310, s: 0.95 },
  // node country and the last climb: camp, peaks, one final warning
  { kind: 'campfire', x: 14, y: 1430 },
  { kind: 'cloud', x: 91, y: 1470 },
  { kind: 'mountain', x: 9, y: 1660, s: 1.2 },
  { kind: 'pine', x: 88, y: 1560, s: 1.1 },
  { kind: 'danger', x: 13, y: 1790, label: '⚠ flaky tests ahead' },
  { kind: 'pine', x: 87, y: 1800, s: 0.95 },
  { kind: 'cloud', x: 8, y: 1900 },
  { kind: 'flower', x: 80, y: 1920 },
  { kind: 'flower', x: 20, y: 1980 },
]

function SceneryDoodle({ d, width }: { d: Doodle; width: number }) {
  const x = (d.x / 100) * width
  const y = d.y
  const s = d.s ?? 1
  const seed = 900 + Math.round(d.x * 7 + d.y)

  if (d.kind === 'pine') {
    return (
      <>
        <RoughPolygon
          points={[
            { x, y: y - 40 * s },
            { x: x + 12 * s, y: y - 14 * s },
            { x: x - 12 * s, y: y - 14 * s },
          ]}
          seed={seed}
          stroke="var(--color-ink-soft)"
          roughness={1.6}
          disableMultiStroke
        />
        <RoughPolygon
          points={[
            { x, y: y - 26 * s },
            { x: x + 16 * s, y },
            { x: x - 16 * s, y },
          ]}
          seed={seed + 1}
          stroke="var(--color-ink-soft)"
          fill="var(--color-marker-teal)"
          fillStyle="hachure"
          roughness={1.6}
          disableMultiStroke
        />
        <RoughLine x1={x} y1={y} x2={x} y2={y + 12 * s} seed={seed + 2} stroke="var(--color-ink-soft)" strokeWidth={2.2} />
      </>
    )
  }
  if (d.kind === 'cloud') {
    return (
      <>
        <RoughEllipse cx={x - 12} cy={y} width={46} height={22} seed={seed} stroke="var(--color-ink-soft)" roughness={1.4} disableMultiStroke fill="var(--color-paper)" fillStyle="solid" />
        <RoughEllipse cx={x + 14} cy={y - 7} width={38} height={20} seed={seed + 1} stroke="var(--color-ink-soft)" roughness={1.4} disableMultiStroke fill="var(--color-paper)" fillStyle="solid" />
      </>
    )
  }
  if (d.kind === 'flower') {
    // a little wildflower cluster: three stems, coral heads
    return (
      <>
        {([-8, 0, 8] as const).map((dx, i) => (
          <g key={i}>
            <RoughLine x1={x + dx} y1={y + 10} x2={x + dx * 1.3} y2={y - 6 - (i % 2) * 4} seed={seed + i} stroke="var(--color-ink-soft)" strokeWidth={1.6} />
            <RoughEllipse cx={x + dx * 1.3} cy={y - 9 - (i % 2) * 4} width={7} height={7} seed={seed + 3 + i} stroke="var(--color-ink-soft)" strokeWidth={1.4} fill="var(--color-marker-coral)" fillStyle="solid" roughness={1.2} disableMultiStroke />
          </g>
        ))}
      </>
    )
  }
  if (d.kind === 'mountain') {
    return (
      <>
        <RoughPolygon
          points={[
            { x: x - 34 * s, y },
            { x: x - 3 * s, y: y - 46 * s },
            { x: x + 26 * s, y },
          ]}
          seed={seed}
          stroke="var(--color-ink-soft)"
          roughness={1.7}
          disableMultiStroke
        />
        <RoughPolygon
          points={[
            { x: x + 4 * s, y },
            { x: x + 26 * s, y: y - 30 * s },
            { x: x + 48 * s, y },
          ]}
          seed={seed + 1}
          stroke="var(--color-ink-soft)"
          roughness={1.7}
          disableMultiStroke
        />
      </>
    )
  }
  if (d.kind === 'lake') {
    return (
      <RoughEllipse cx={x} cy={y} width={74} height={26} seed={seed} stroke="var(--color-pencil-blue)" strokeWidth={1.8} fill="var(--color-pencil-blue)" fillStyle="hachure" roughness={1.5} disableMultiStroke />
    )
  }
  if (d.kind === 'campfire') {
    return (
      <>
        <RoughLine x1={x - 10} y1={y + 6} x2={x + 10} y2={y + 12} seed={seed} stroke="var(--color-ink-soft)" strokeWidth={2.4} />
        <RoughLine x1={x - 10} y1={y + 12} x2={x + 10} y2={y + 6} seed={seed + 1} stroke="var(--color-ink-soft)" strokeWidth={2.4} />
        <RoughPolygon
          points={[
            { x, y: y - 14 },
            { x: x + 7, y: y + 4 },
            { x: x - 7, y: y + 4 },
          ]}
          seed={seed + 2}
          stroke="var(--color-marker-coral)"
          fill="var(--color-marker-coral)"
          fillStyle="hachure"
          roughness={1.4}
          disableMultiStroke
        />
      </>
    )
  }
  if (d.kind === 'danger') {
    // a hand-planted warning signpost, slightly askew — gaming-map style
    return (
      <g transform={`rotate(-3 ${x} ${y})`}>
        <RoughLine x1={x} y1={y - 16} x2={x} y2={y + 14} seed={seed} stroke="var(--color-ink-soft)" strokeWidth={2.6} />
        <RoughRect x={x - 46} y={y - 34} width={92} height={21} seed={seed + 1} stroke="var(--color-ink)" fill="var(--color-paper)" fillStyle="solid" roughness={1.3} disableMultiStroke />
        <text
          x={x}
          y={y - 19}
          textAnchor="middle"
          fontFamily="var(--font-hand)"
          fontSize={13.5}
          fontWeight={700}
          fill="var(--color-ink)"
        >
          {d.label}
        </text>
      </g>
    )
  }
  return <RoughEllipse cx={x} cy={y} width={34} height={15} seed={seed} stroke="var(--color-ink-soft)" roughness={1.8} disableMultiStroke />
}

/** One smooth cubic through every bend — vertical tangents make gentle S-curves.
 *  Used for the teal marker trace; the pencil route is rough.js on the same points. */
function roadPath(pts: { x: number; y: number }[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const midY = (a.y + b.y) / 2
    d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`
  }
  return d
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
