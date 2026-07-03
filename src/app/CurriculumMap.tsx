import { Link } from 'react-router'
import { PHASES, lessonsForPhase, type PhaseMeta } from '../content/registry'
import { PHASE_INTROS } from '../content/phase-intros'
import { useProgress } from '../store/progress'
import { PaperCard } from '../design/PaperCard'
import { TapeLabel } from '../design/TapeLabel'
import { HighlightMark } from '../design/HighlightMark'

/** First sentence of a phase's plain-words intro — a real teaser, not jargon. */
function teaser(phaseNumber: number): string {
  const first = PHASE_INTROS[phaseNumber]?.plainWords[0] ?? ''
  const end = first.indexOf('. ')
  return end === -1 ? first : first.slice(0, end + 1)
}

export function CurriculumMap() {
  const foundation = PHASES.filter((p) => p.number <= 1)
  const journey = PHASES.filter((p) => p.number >= 2)
  const { completedLessons } = useProgress()

  const lessonCount = (phase: PhaseMeta): string => {
    const lessons = lessonsForPhase(phase.number)
    if (lessons.length === 0) return `${phase.plannedLessons} lessons ✏️ in pencil`
    const done = lessons.filter((l) => completedLessons[l.id]).length
    return done > 0 ? `${done} of ${lessons.length} lessons done` : `${lessons.length} lessons`
  }

  return (
    <div className="flex flex-col gap-12">
      <p className="max-w-2xl">
        Eleven regions on the road from{' '}
        <HighlightMark type="circle" color="var(--color-marker-coral)">zero</HighlightMark> to{' '}
        <HighlightMark type="underline" color="var(--color-marker-teal)">automation tester</HighlightMark>.
        Every region has its own page that explains, in plain words, what it teaches and why it
        matters — open one and look around before any code.
      </p>

      <section>
        <TapeLabel id="map-foundation" color="var(--color-marker-coral)">
          start here — the foundation
        </TapeLabel>
        <p className="text-ink-soft mt-2 max-w-2xl text-[15px]">
          Values and variables are the building blocks: every function, object, test and Playwright
          script is made of them. Give these two regions your slowest, most patient attention.
        </p>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {foundation.map((phase) => (
            <Link key={phase.number} to={`/phase/${phase.number}`} className="group block">
              <PaperCard id={`phase-${phase.number}`} className="h-full transition-transform group-hover:-translate-y-0.5">
                <div className="flex items-baseline gap-3">
                  <span className="font-hand text-marker-coral text-5xl font-bold">{phase.number}</span>
                  <h2 className="font-hand text-3xl font-bold group-hover:underline">{phase.title}</h2>
                </div>
                <p className="text-ink-soft mt-1 italic">“{phase.question}”</p>
                <p className="mt-3">{teaser(phase.number)}</p>
                <p className="font-hand mt-4 text-xl">
                  {lessonCount(phase)} · <span className="underline">step inside →</span>
                </p>
              </PaperCard>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <TapeLabel id="map-journey">then, the journey</TapeLabel>
        <p className="text-ink-soft mt-2 max-w-2xl text-[15px]">
          In order — each region builds on the ones before it. Regions drawn in pencil aren’t built
          yet; they get inked in as you approach them.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {journey.map((phase) => (
            <Link key={phase.number} to={`/phase/${phase.number}`} className="group block">
              <PaperCard id={`phase-${phase.number}`} className="h-full transition-transform group-hover:-translate-y-0.5">
                <div className="flex items-baseline gap-3">
                  <span className="font-hand text-ink-soft text-4xl font-bold">{phase.number}</span>
                  <h2 className="font-hand text-2xl font-bold group-hover:underline">{phase.title}</h2>
                </div>
                <p className="text-ink-soft mt-1 text-[15px] italic">“{phase.question}”</p>
                <p className="mt-2 text-[15px]">{teaser(phase.number)}</p>
                <p className="font-hand mt-3 text-lg">
                  {lessonCount(phase)} · <span className="underline">step inside →</span>
                </p>
              </PaperCard>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
