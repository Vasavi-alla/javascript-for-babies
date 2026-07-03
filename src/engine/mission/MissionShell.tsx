import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { findLesson, LESSONS } from '../../content/registry'
import { MISSION_THEMES } from '../../content/phase-themes'
import { PaperCard } from '../../design/PaperCard'
import { StickyNote } from '../../design/StickyNote'
import { TapeLabel } from '../../design/TapeLabel'
import { InkButton } from '../../design/InkButton'
import { useProgress } from '../../store/progress'
import { QuizCard } from '../lesson/QuizCard'
import { TeachBack } from '../lesson/TeachBack'
import { WorkOrderCard, Stamp } from './WorkOrderCard'
import { TypeOutputCard } from './TypeOutputCard'
import type { MissionChallenge, MissionDef } from './types'

/**
 * Renders a mission-format lesson (Phases 3–4): work order → hands-on
 * challenges (revealed one at a time) → SHIPPED stamp → shop notes → final
 * inspection → teach-back → recap. The learner acts before anything is
 * explained; explanation lives inside the challenges as feedback.
 */
export function MissionShell({ def }: { def: MissionDef }) {
  const meta = findLesson(def.id)
  const { completedLessons, markComplete } = useProgress()
  const isDone = Boolean(completedLessons[def.id])

  // Revisiting a finished lesson shows everything at once, still playable.
  const [doneCount, setDoneCount] = useState(isDone ? def.challenges.length : 0)
  const allDone = doneCount >= def.challenges.length

  const orderIndex = LESSONS.findIndex((l) => l.id === def.id)
  const nextMeta = orderIndex >= 0 ? LESSONS[orderIndex + 1] : undefined
  const theme = meta ? MISSION_THEMES[meta.phase] : undefined

  if (!meta || !theme) return null

  return (
    <div className="flex flex-col gap-10">
      {/* ── header + work order ───────────────────────── */}
      <header>
        <Link to={`/phase/${meta.phase}`} className="text-ink-soft text-sm hover:underline">
          ← back to phase {meta.phase}
        </Link>
        <h1 className="font-hand mt-2 text-4xl font-bold sm:text-5xl">
          {meta.id} — {meta.title}
        </h1>
        <div className="mt-6">
          <WorkOrderCard def={def} theme={theme} />
        </div>
        {def.brief && <div className="mt-5 flex max-w-3xl flex-col gap-4 text-lg">{def.brief}</div>}
      </header>

      {/* ── the job: challenges, revealed one at a time ─ */}
      {def.challenges.slice(0, doneCount + 1).map((challenge, i) => (
        <ChallengeFrame
          key={challenge.id}
          challenge={challenge}
          stepNumber={i + 1}
          totalSteps={def.challenges.length}
          completed={i < doneCount}
          onComplete={() => setDoneCount((n) => Math.max(n, i + 1))}
        />
      ))}

      {/* ── shipped + everything after ────────────────── */}
      {allDone && (
        <motion.div
          initial={isDone ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="flex flex-col gap-10"
        >
          <section className="flex flex-wrap items-center gap-5">
            <Stamp id={`shipped-${def.id}`} text={theme.labels.shipped} color="var(--color-marker-teal)" big />
            <p className="font-hand text-2xl">
              {def.shelfItem.emoji}{' '}
              {theme.labels.shippedLine.replace('{item}', def.shelfItem.label)}{' '}
              <Link to={`/phase/${meta.phase}`} className="text-ink-soft underline">
                see the shelf →
              </Link>
            </p>
          </section>

          <section>
            <TapeLabel id={`notes-${def.id}`} color="var(--color-pencil-blue)">
              {theme.labels.notes}
            </TapeLabel>
            <p className="text-ink-soft mt-2 text-sm">{theme.labels.notesLead}</p>
            <div className="mt-4 max-w-4xl">{def.shopNotes}</div>
          </section>

          <section>
            <TapeLabel id={`check-${def.id}`} color="var(--color-marker-yellow)">
              {theme.labels.check}
            </TapeLabel>
            <div className="mt-4 flex flex-col items-start gap-5">
              {def.finalCheck.map((item, i) =>
                item.kind === 'choice' ? (
                  <QuizCard key={i} index={i} question={item} />
                ) : (
                  <TypeOutputCard
                    key={i}
                    index={i}
                    question={item.question}
                    code={item.code}
                    accept={item.accept}
                    why={item.why}
                  />
                ),
              )}
            </div>
          </section>

          <section>
            <TapeLabel id={`teach-${def.id}`} color="var(--color-marker-teal)">
              {theme.labels.teach}
            </TapeLabel>
            <div className="mt-4">
              <TeachBack lessonId={def.id} prompt={def.teachBack.prompt} modelAnswer={def.teachBack.modelAnswer} />
            </div>
          </section>

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
        </motion.div>
      )}
    </div>
  )
}

/** One job step: tape label, prompt, the interactive itself, and the stuck-escape. */
function ChallengeFrame({
  challenge,
  stepNumber,
  totalSteps,
  completed,
  onComplete,
}: {
  challenge: MissionChallenge
  stepNumber: number
  totalSteps: number
  completed: boolean
  onComplete: () => void
}) {
  const [stuckOpen, setStuckOpen] = useState(false)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 18 }}
    >
      <TapeLabel id={`challenge-${challenge.id}`} color="var(--color-marker-coral)">
        job step {stepNumber} of {totalSteps} — {challenge.title}
        {completed && <span className="text-marker-teal ml-2">✓</span>}
      </TapeLabel>
      <PaperCard id={`challenge-card-${challenge.id}`} tilt={false} className="mt-4">
        <div className="mb-4 flex flex-col gap-2 text-lg">{challenge.prompt}</div>
        <challenge.Interactive onComplete={onComplete} />

        <div className="mt-4">
          {!stuckOpen ? (
            <button
              type="button"
              onClick={() => setStuckOpen(true)}
              className="text-ink-soft cursor-pointer text-sm underline"
            >
              I’m stuck — show me
            </button>
          ) : (
            <p className="text-ink-soft border-ink-soft/40 max-w-xl border-l-2 border-dashed pl-3 text-sm">
              {challenge.stuck}
            </p>
          )}
        </div>
      </PaperCard>
    </motion.section>
  )
}
