import { Link } from 'react-router'
import { findLesson, LESSONS } from '../../content/registry'
import { PaperCard } from '../../design/PaperCard'
import { StickyNote } from '../../design/StickyNote'
import { TapeLabel } from '../../design/TapeLabel'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { useProgress } from '../../store/progress'
import { useStepper } from '../stepper/useStepper'
import { StepperControls } from '../stepper/StepperControls'
import { PredictionCard } from '../stepper/PredictionCard'
import { QuizCard } from './QuizCard'
import { TeachBack } from './TeachBack'
import type { LessonDef } from './types'

/** Renders a complete lesson in the 6-part anatomy (04-LESSON-BLUEPRINT.md). */
export function LessonShell({ def }: { def: LessonDef }) {
  const meta = findLesson(def.id)
  const stepper = useStepper(def.steps)
  const { completedLessons, markComplete } = useProgress()
  const isDone = Boolean(completedLessons[def.id])

  const orderIndex = LESSONS.findIndex((l) => l.id === def.id)
  const nextMeta = orderIndex >= 0 ? LESSONS[orderIndex + 1] : undefined

  const code = stepper.step.codeOverride ?? def.code
  const { Viz, PlayExtra, playground } = def

  if (!meta) return null

  return (
    <div className="flex flex-col gap-10">
      {/* ── header + hook ─────────────────────────────── */}
      <header>
        <Link to={`/phase/${meta.phase}`} className="text-ink-soft text-sm hover:underline">
          ← back to phase {meta.phase}
        </Link>
        <h1 className="font-hand mt-2 text-4xl font-bold sm:text-5xl">
          {meta.id} — {meta.title}
        </h1>

        {playground && (
          <div className="mt-6 max-w-3xl">
            <TapeLabel id={`playground-${def.id}`} color="var(--color-marker-yellow)">
              try it first
            </TapeLabel>
            <PaperCard id={`playground-card-${def.id}`} tilt={false} className="mt-4">
              <div className="flex flex-col gap-4">
                <p>{playground.prompt}</p>
                <playground.Widget />
              </div>
            </PaperCard>
          </div>
        )}

        <div className="mt-4 flex max-w-3xl flex-col gap-3 text-lg">{def.hook}</div>
      </header>

      {/* ── visualize ─────────────────────────────────── */}
      <section>
        <TapeLabel id={`viz-${def.id}`} color="var(--color-marker-coral)">
          watch it happen
        </TapeLabel>
        <PaperCard id={`viz-card-${def.id}`} tilt={false} className="mt-4">
          <div className={`grid items-start gap-6 ${code ? 'md:grid-cols-2' : ''}`}>
            <div className="flex flex-col gap-4">
              {code && <CodePane code={code} highlightLines={stepper.step.highlightLines} />}
              <p className="min-h-16">{stepper.step.caption}</p>
            </div>
            <div className="bg-paper-shade/40 rounded-lg">
              <Viz stepIndex={stepper.index} />
            </div>
          </div>

          {stepper.step.prediction && (
            <div className="mt-4">
              <PredictionCard
                prediction={stepper.step.prediction}
                answered={stepper.answered}
                onAnswer={stepper.answer}
              />
            </div>
          )}

          <div className="mt-6">
            <StepperControls stepper={stepper} steps={def.steps} />
          </div>
        </PaperCard>
      </section>

      {/* ── under the hood ────────────────────────────── */}
      <section>
        <TapeLabel id={`hood-${def.id}`} color="var(--color-pencil-blue)">
          under the hood
        </TapeLabel>
        <p className="text-ink-soft mt-2 text-sm">
          The deeper story, with the real names for things — this part is what turns “I saw it” into “I can explain it.”
        </p>
        <PaperCard id={`hood-card-${def.id}`} tilt={false} className="mt-3 max-w-3xl">
          <div className="flex flex-col gap-4">{def.underTheHood}</div>
        </PaperCard>
      </section>

      {/* ── play ──────────────────────────────────────── */}
      <section>
        <TapeLabel id={`play-${def.id}`} color="var(--color-marker-yellow)">
          your turn
        </TapeLabel>
        <div className="mt-4 flex flex-col items-start gap-5">
          {PlayExtra && <PlayExtra />}
          {def.quiz.map((q, i) => (
            <QuizCard key={i} index={i} question={q} />
          ))}
        </div>
      </section>

      {/* ── teach-back ────────────────────────────────── */}
      <section>
        <TapeLabel id={`teach-${def.id}`} color="var(--color-marker-teal)">
          teach it back
        </TapeLabel>
        <div className="mt-4">
          <TeachBack lessonId={def.id} prompt={def.teachBack.prompt} modelAnswer={def.teachBack.modelAnswer} />
        </div>
      </section>

      {/* ── recap + complete ──────────────────────────── */}
      <section>
        <TapeLabel id={`recap-${def.id}`}>to remember</TapeLabel>
        <div className="mt-4 flex flex-wrap items-start gap-4">
          {def.recap.map((line, i) => (
            <StickyNote id={`recap-${def.id}-${i}`} key={i} className="max-w-xs">
              {line}
            </StickyNote>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          {isDone ? (
            <span className="text-marker-teal font-hand text-2xl font-bold">✓ lesson completed</span>
          ) : (
            <InkButton id={`complete-${def.id}`} variant="primary" onClick={() => markComplete(def.id)}>
              mark lesson complete ✓
            </InkButton>
          )}
          {nextMeta && (
            <Link to={`/lesson/${nextMeta.id}`} className="font-hand text-2xl hover:underline">
              next: {nextMeta.id} {nextMeta.title} →
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
