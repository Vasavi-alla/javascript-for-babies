import { Link, useParams } from 'react-router'
import { PHASES, lessonsForPhase } from '../content/registry'
import { PHASE_INTROS } from '../content/phase-intros'
import { MISSION_THEMES } from '../content/phase-themes'
import { PHASE_LABS } from '../labs'
import { MISSION_DEFS } from '../lessons'
import { practiceSetsForPhase } from '../practice/sets'
import { ShopShelf } from '../engine/mission/ShopShelf'
import { useProgress } from '../store/progress'
import { PaperCard } from '../design/PaperCard'
import { StickyNote } from '../design/StickyNote'
import { TapeLabel } from '../design/TapeLabel'
import { HighlightMark } from '../design/HighlightMark'

export function PhasePage() {
  const params = useParams<{ number: string }>()
  const { completedLessons, solvedExercises } = useProgress()
  const phaseNumber = Number(params.number)
  const phase = PHASES.find((p) => p.number === phaseNumber)
  const intro = PHASE_INTROS[phaseNumber]

  if (!phase || !intro) {
    return (
      <StickyNote id="phase-404" color="pink">
        No phase “{params.number}”. <Link to="/" className="underline">Back to the map</Link>
      </StickyNote>
    )
  }

  const lessons = lessonsForPhase(phase.number)
  const prev = PHASES.find((p) => p.number === phaseNumber - 1)
  const next = PHASES.find((p) => p.number === phaseNumber + 1)
  const isFoundation = phaseNumber <= 1
  const theme = MISSION_THEMES[phaseNumber]
  const shelfSlots = theme
    ? lessons.map((lesson) => {
        const mission = MISSION_DEFS[lesson.id]
        return {
          lessonId: lesson.id,
          emoji: mission?.shelfItem.emoji,
          label: mission?.shelfItem.label,
          done: Boolean(completedLessons[lesson.id]),
        }
      })
    : []

  return (
    <div className="flex flex-col gap-10">
      <header>
        <Link to="/" className="text-ink-soft text-sm hover:underline">← back to the map</Link>
        <div className="mt-3 flex items-baseline gap-4">
          <span className="font-hand text-ink-soft text-6xl font-bold">{phase.number}</span>
          <div>
            <h1 className="font-hand text-5xl font-bold">{phase.title}</h1>
            {isFoundation && (
              <TapeLabel id={`foundation-${phase.number}`} color="var(--color-marker-coral)" className="mt-2">
                foundation — everything stands on this
              </TapeLabel>
            )}
          </div>
        </div>
        <p className="text-ink-soft mt-3 text-xl italic">
          The big question: <HighlightMark type="underline" color="var(--color-marker-yellow)">“{phase.question}”</HighlightMark>
        </p>
      </header>

      {theme && (
        <section>
          <TapeLabel id={`shop-${phase.number}`} color="var(--color-marker-coral)">
            your new workplace: {theme.workplace}
          </TapeLabel>
          <div className="mt-4 flex max-w-3xl flex-col gap-4">
            {theme.shopSign.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6">
            <p className="font-hand mb-3 text-2xl font-semibold">{theme.labels.shelf}</p>
            <ShopShelf slots={shelfSlots} theme={theme} />
          </div>
        </section>
      )}

      <section>
        <TapeLabel id={`why-${phase.number}`} color="var(--color-marker-coral)">
          but why do we need this?
        </TapeLabel>
        <div className="mt-4 flex max-w-3xl flex-col gap-4">
          {intro.whyNeeded.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section>
        <TapeLabel id={`plain-${phase.number}`}>in plain words</TapeLabel>
        <div className="mt-4 flex max-w-3xl flex-col gap-4">
          {intro.plainWords.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section>
        <TapeLabel id={`terms-${phase.number}`} color="var(--color-pencil-blue)">
          words you’ll own after this
        </TapeLabel>
        <div className="mt-5 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {intro.keyTerms.map((kt) => (
            <StickyNote key={kt.term} id={`term-${phase.number}-${kt.term}`} className="h-full w-full">
              <span className="font-hand text-2xl font-bold">{kt.term}</span>
              <p className="mt-1 text-[15px] leading-relaxed">{kt.meaning}</p>
            </StickyNote>
          ))}
        </div>
      </section>

      <section>
        <TapeLabel id={`youcan-${phase.number}`} color="var(--color-marker-teal)">
          after this phase, you can…
        </TapeLabel>
        <ul className="mt-4 flex max-w-2xl flex-col gap-2">
          {intro.youCan.map((ability, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="text-marker-teal font-hand text-xl font-bold">✓</span>
              <span>{ability}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <TapeLabel id={`lab-${phase.number}`} color="var(--color-marker-coral)">
          this phase’s lab — see it move
        </TapeLabel>
        {(() => {
          const Lab = PHASE_LABS[phase.number]
          return Lab ? (
            <div className="mt-4">
              <Lab />
            </div>
          ) : (
            <p className="text-ink-soft mt-4 max-w-2xl">
              ✏️ This phase’s interactive lab is still being drawn — it arrives together with the
              phase’s lessons.
            </p>
          )
        })()}
      </section>

      <section>
        <TapeLabel id={`lessons-${phase.number}`} color="var(--color-marker-yellow)">
          the lessons
        </TapeLabel>
        {lessons.length > 0 ? (
          <ol className="mt-5 flex flex-col gap-4">
            {lessons.map((lesson) => {
              const mission = MISSION_DEFS[lesson.id]
              return (
                <li key={lesson.id}>
                  <PaperCard id={`lesson-card-${lesson.id}`} className="max-w-3xl">
                    <div className="flex items-baseline gap-3">
                      <span className="font-hand text-ink-soft text-2xl font-bold">{lesson.id}</span>
                      <div>
                        {lesson.status === 'available' ? (
                          <Link to={`/lesson/${lesson.id}`} className="text-lg font-bold hover:underline">
                            {lesson.title}
                            {completedLessons[lesson.id] && (
                              <span className="text-marker-teal font-hand ml-2 text-xl">✓ done</span>
                            )}
                          </Link>
                        ) : (
                          <span className="text-lg font-bold">{lesson.title} <span className="text-ink-soft text-sm font-normal">✏️ being drawn</span></span>
                        )}
                        {mission && theme && (
                          <p className="text-marker-coral font-hand text-lg">
                            {theme.labels.workOrder} · {theme.jobTypeLabels[mission.jobType]}
                          </p>
                        )}
                        <p className="text-ink-soft mt-0.5">{lesson.blurb}</p>
                      </div>
                    </div>
                  </PaperCard>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="text-ink-soft mt-4 max-w-2xl">
            ✏️ This phase’s {phase.plannedLessons} lessons are sketched in pencil — they get inked in
            (built with full visualizations) when your journey approaches them. The plan lives in{' '}
            <code className="text-sm">docs/plan/01-CURRICULUM.md</code>.
          </p>
        )}
      </section>

      {practiceSetsForPhase(phase.number).length > 0 && (
        <section>
          <TapeLabel id={`practice-${phase.number}`} color="var(--color-marker-teal)">
            practice bays — write real code
          </TapeLabel>
          <p className="text-ink-soft mt-2 max-w-2xl text-sm">
            No clicking through options here: you type actual JavaScript, it actually runs, and it
            gets inspected against the expected output <em>and</em> the syntax you were meant to
            practice.
          </p>
          <div className="mt-4 flex flex-col gap-4">
            {practiceSetsForPhase(phase.number).map((set) => {
              const solved = set.exercises.filter((ex) => solvedExercises[ex.id]).length
              return (
                <PaperCard id={`practice-card-${set.id}`} key={set.id} className="max-w-3xl">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link to={`/practice/${set.id}`} className="text-lg font-bold hover:underline">
                      ⌨️ {set.title}
                      {solved === set.exercises.length && (
                        <span className="text-marker-teal font-hand ml-2 text-xl">✓ cleared</span>
                      )}
                    </Link>
                    <span className="text-ink-soft font-hand text-lg">
                      best after {set.bestAfter} · {solved}/{set.exercises.length} solved
                    </span>
                  </div>
                  <p className="text-ink-soft mt-0.5">{set.blurb}</p>
                </PaperCard>
              )
            })}
          </div>
        </section>
      )}

      <nav className="border-ink-soft/30 flex justify-between border-t border-dashed pt-6">
        {prev ? (
          <Link to={`/phase/${prev.number}`} className="font-hand text-2xl hover:underline">
            ← {prev.number}. {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/phase/${next.number}`} className="font-hand text-2xl hover:underline">
            {next.number}. {next.title} →
          </Link>
        )}
      </nav>
    </div>
  )
}
