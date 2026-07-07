import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { useProgress } from '../../store/progress'
import { useRecallUi } from '../../store/recall-ui'
import { questionsForCompleted, type InterviewQuestion } from '../../content/interview-questions'
import { PaperCard } from '../../design/PaperCard'
import { InkButton } from '../../design/InkButton'
import { CodePane } from '../../design/CodePane'
import { TapeLabel } from '../../design/TapeLabel'

const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000
const MAX_QUESTIONS = 3

/**
 * Bias toward recently completed topics: fill most slots from the newest-completed
 * lessons (tie-break least-recently-asked, so within a batch they rotate), and
 * reserve one slot for the globally least-recently-asked question so older topics
 * resurface occasionally.
 */
function pickQuestions(
  eligible: InterviewQuestion[],
  recall: Record<string, { ratedAt: string }>,
  completed: Record<string, string>,
): InterviewQuestion[] {
  const askedAt = (q: InterviewQuestion) => recall[q.id]?.ratedAt ?? '' // '' = never asked
  const completedAt = (q: InterviewQuestion) => completed[q.lessonId] ?? ''

  const byRecent = [...eligible].sort((a, b) => {
    const c = completedAt(b).localeCompare(completedAt(a)) // newest completion first
    return c !== 0 ? c : askedAt(a).localeCompare(askedAt(b)) // then least-recently-asked
  })
  const byStale = [...eligible].sort((a, b) => askedAt(a).localeCompare(askedAt(b)))

  const picks: InterviewQuestion[] = []
  const take = (q?: InterviewQuestion) => {
    if (q && !picks.some((p) => p.id === q.id)) picks.push(q)
  }

  take(byRecent[0]) // two from the most recently completed lessons
  take(byRecent[1])
  take(byStale[0]) // one older topic resurfaced
  for (const q of byRecent) {
    if (picks.length >= MAX_QUESTIONS) break
    take(q)
  }
  return picks.slice(0, MAX_QUESTIONS)
}

/**
 * Returning-learner recall, mounted once globally (in Layout). It auto-opens on
 * entering a lesson when the 8-hour clock has elapsed and the learner has eligible
 * questions (completed phase-1+ lessons). It can also be opened any time from the
 * "quick recall" nav button, which ignores the clock. Self-rating is optional;
 * back/next navigate like the lesson stepper. Skin follows BreakCoach.tsx.
 */
export function RecallCheck() {
  const { completedLessons, recall, lastRecallShownAt, rateRecall, markRecallShown } = useProgress()
  const open = useRecallUi((s) => s.open)
  const openNow = useRecallUi((s) => s.openNow)
  const close = useRecallUi((s) => s.close)
  const { pathname } = useLocation()

  const [queue, setQueue] = useState<InterviewQuestion[]>([])
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  const lastPath = useRef('')

  // auto-open on entering a lesson, gated to once per 8 hours
  useEffect(() => {
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    if (open || !pathname.startsWith('/lesson/')) return
    if (questionsForCompleted(completedLessons).length === 0) return
    const last = lastRecallShownAt ? new Date(lastRecallShownAt).getTime() : 0
    if (Date.now() - last < EIGHT_HOURS_MS) return
    markRecallShown() // stamp now, so a skip still resets the 8h clock
    openNow(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // build a fresh queue each time the overlay opens
  useEffect(() => {
    if (!open) return
    setQueue(pickQuestions(questionsForCompleted(completedLessons), recall, completedLessons))
    setI(0)
    setRevealed(new Set())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const q = queue[i]
  const isRevealed = q ? revealed.has(q.id) : false
  const picked = q ? recall[q.id]?.confidence : undefined
  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  if (!open) return null

  function rate(confidence: 'low' | 'ok' | 'solid') {
    if (q) rateRecall(q.id, confidence)
  }
  function reveal() {
    if (q) setRevealed((prev) => new Set(prev).add(q.id))
  }
  function goNext() {
    if (i + 1 < queue.length) setI(i + 1)
    else close()
  }
  function goBack() {
    if (i > 0) setI(i - 1)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: reducedMotion ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recall-title"
        onKeyDown={(e) => {
          if (e.key === 'Escape') close()
        }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: 'color-mix(in srgb, var(--color-ink) 40%, transparent)' }}
      >
        {/* the backdrop scrolls, never the card — a hand-drawn border can't wrap a scroll box */}
        <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
          <div className="mt-8 w-[min(92vw,40rem)]">
            <PaperCard id="recall-card" tilt={false}>
              <div className="flex items-center justify-between">
                <TapeLabel id="recall-tape" color="var(--color-marker-coral)">
                  quick recall
                </TapeLabel>
                {q && (
                  <span className="text-ink-soft font-hand text-lg">
                    {i + 1} of {queue.length}
                  </span>
                )}
              </div>

              <h2 id="recall-title" className="sr-only">
                Recall questions on what you have covered
              </h2>

              {!q ? (
                // on-demand with nothing eligible yet
                <div className="mt-4">
                  <p className="text-[15px]">
                    No questions yet. Finish a lesson and tick <strong>mark lesson complete</strong>,
                    then quick recall will have questions for you here.
                  </p>
                  <div className="mt-5">
                    <InkButton id="recall-empty-close" variant="primary" onClick={close}>
                      got it
                    </InkButton>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-ink-soft mt-3 text-sm">
                    Not graded. Just so you can see how confident you feel. ({q.type}, {q.difficulty})
                  </p>

                  <p className="mt-2 text-lg font-semibold">{q.prompt}</p>
                  {q.code && <CodePane code={q.code} className="mt-3" />}

                  {!isRevealed ? (
                    <div className="mt-4">
                      <p className="text-ink-soft text-sm">
                        Answer it in your head first, then reveal it.
                      </p>
                      <div className="mt-2">
                        <InkButton id={`recall-reveal-${q.id}`} variant="primary" onClick={reveal}>
                          reveal answer
                        </InkButton>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-paper-shade/50 mt-4 rounded-lg p-3 text-[15px]">{q.answer}</div>
                      <p className="font-hand mt-4 text-xl font-bold">
                        How confident are you?{' '}
                        <span className="text-ink-soft text-base font-normal">— optional</span>
                      </p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <InkButton
                          id={`recall-low-${q.id}`}
                          variant={picked === 'low' ? 'primary' : 'default'}
                          onClick={() => rate('low')}
                        >
                          🙁 not yet
                        </InkButton>
                        <InkButton
                          id={`recall-ok-${q.id}`}
                          variant={picked === 'ok' ? 'primary' : 'default'}
                          onClick={() => rate('ok')}
                        >
                          😐 getting there
                        </InkButton>
                        <InkButton
                          id={`recall-solid-${q.id}`}
                          variant={picked === 'solid' ? 'primary' : 'default'}
                          onClick={() => rate('solid')}
                        >
                          🙂 solid
                        </InkButton>
                      </div>
                    </>
                  )}

                  {/* prev / next, like the watch-it-happen stepper */}
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <InkButton id="recall-back" onClick={goBack} disabled={i === 0}>
                      ◀ back
                    </InkButton>
                    <div className="flex items-center gap-2.5">
                      {queue.map((qq, idx) => (
                        <span
                          key={qq.id}
                          className="ink-dot inline-block h-3 w-3 border-2 transition-colors duration-300"
                          style={{
                            borderColor: 'var(--color-ink)',
                            background:
                              idx < i
                                ? 'var(--color-ink)'
                                : idx === i
                                  ? 'var(--color-marker-yellow)'
                                  : 'transparent',
                          }}
                        />
                      ))}
                    </div>
                    <InkButton id="recall-next" variant="primary" onClick={goNext}>
                      {i + 1 < queue.length ? 'next ▶' : 'done ✓'}
                    </InkButton>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={close}
                      className="text-ink-soft font-hand cursor-pointer text-base underline"
                    >
                      close recall
                    </button>
                  </div>
                </>
              )}
            </PaperCard>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
