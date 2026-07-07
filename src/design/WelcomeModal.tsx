import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { DEFAULT_NAME, nameSlug, useLearnerName } from '../content/learner'
import { hasSeenWelcome, markWelcomeSeen, useWelcome } from '../store/welcome'
import { PaperCard } from './PaperCard'
import { InkButton } from './InkButton'

/** A random one of Vasavi's portraits, fixed for the life of the modal. */
const PORTRAITS = Array.from({ length: 10 }, (_, i) => `/vasavi/${i + 1}.webp`)

/**
 * First-run welcome: who made this and why, a name field, and the two habits
 * that make the course work (mark-complete + the recall questions). Auto-opens
 * once for a default-named learner on the home page; re-openable via useWelcome.
 * Skin/overlay pattern follows BreakCoach.tsx.
 */
export function WelcomeModal() {
  const [name, setName] = useLearnerName()
  const open = useWelcome((s) => s.open)
  const setOpen = useWelcome((s) => s.setOpen)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [draft, setDraft] = useState('')
  const [portrait] = useState(() => PORTRAITS[Math.floor(Math.random() * PORTRAITS.length)])
  const inputRef = useRef<HTMLInputElement>(null)

  const onHome = pathname === '/' || pathname.endsWith('-journey')
  const reduce =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  // auto-open once for a fresh learner on the home page
  useEffect(() => {
    if (onHome && name === DEFAULT_NAME && !hasSeenWelcome()) setOpen(true)
  }, [onHome, name, setOpen])

  useEffect(() => {
    // preventScroll: focusing must not scroll the tall card and hide the header
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  function close() {
    markWelcomeSeen()
    setOpen(false)
  }

  function start() {
    const saved = setName(draft) // trims, caps at 30, empty → 'friend'
    markWelcomeSeen()
    setOpen(false)
    const slug = nameSlug(saved)
    if (saved !== DEFAULT_NAME && slug) navigate(`/${slug}-journey`, { replace: true })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="welcome-title"
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{ background: 'color-mix(in srgb, var(--color-ink) 40%, transparent)' }}
        >
          {/* the backdrop scrolls, never the card — a hand-drawn border can't wrap a scroll box */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={reduce ? false : { y: 24, rotate: -1.5 }}
              animate={{ y: 0, rotate: -0.5 }}
              transition={{ type: 'spring', damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === 'Escape') close()
              }}
              className="relative w-[min(94vw,40rem)]"
            >
              <PaperCard id="welcome-card" tilt={false}>
                <div className="flex flex-col gap-4">
                  {/* header: portrait left, greeting right */}
                  <div className="flex items-center gap-4">
                    <img
                      src={portrait}
                      alt="Vasavi"
                      className="border-ink h-24 w-20 shrink-0 rounded-xl border-2 object-cover shadow-[3px_5px_12px_rgba(43,41,37,0.22)]"
                      style={{ rotate: '-2deg' }}
                    />
                    <div>
                      <h2 id="welcome-title" className="font-hand text-4xl font-bold leading-none">
                        Hi, welcome
                      </h2>
                      <p className="mt-1.5 text-[15px] leading-snug">
                        I’m <span className="text-ink font-bold">Vasavi</span>, a software tester with{' '}
                        <span className="text-ink font-bold">5 years</span> across manual and
                        automation testing.
                      </p>
                      {/* my path, drawn as stops on a trail — the app's own road motif */}
                      <div className="mt-2 flex flex-wrap items-center gap-y-1">
                        {[{ name: 'Amazon' }, { name: 'Siemens' }, { name: 'Dover', now: true }].map(
                          (stop, i) => (
                            <div key={stop.name} className="flex items-center">
                              {i > 0 && (
                                <span className="border-ink-soft/50 mx-1.5 inline-block w-5 border-t-2 border-dashed" />
                              )}
                              <span
                                className={`mr-1.5 inline-block h-2.5 w-2.5 rounded-full border-2 ${
                                  stop.now
                                    ? 'border-marker-coral bg-marker-coral'
                                    : 'border-ink-soft bg-paper'
                                }`}
                              />
                              <span
                                className={`font-hand text-lg text-ink ${stop.now ? 'font-bold' : ''}`}
                              >
                                {stop.name}
                              </span>
                              {stop.now && (
                                <span className="text-marker-coral font-hand ml-1 text-sm font-bold">
                                  now
                                </span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <p>
                    I drew this notebook for fellow testers who want to become automation testers and
                    really understand how it works, not just lean on AI to do it for them.
                  </p>

                  {/* the anchor: name entry */}
                  <div>
                    <label htmlFor="welcome-name" className="font-hand text-xl font-bold">
                      What should I call you?
                    </label>
                    <input
                      id="welcome-name"
                      ref={inputRef}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') start()
                      }}
                      maxLength={30}
                      placeholder="your name"
                      aria-label="your name"
                      autoCapitalize="words"
                      autoCorrect="off"
                      autoComplete="off"
                      spellCheck={false}
                      enterKeyHint="done"
                      className="border-ink-soft mt-1 w-full rounded-md border-2 border-dashed bg-transparent px-3 py-2 text-lg outline-none focus:border-solid"
                    />
                  </div>

                  {/* the two habits that make it work, as two marked lines */}
                  <div className="border-ink-soft/25 flex flex-col gap-2.5 border-t border-dashed pt-3 text-[15px]">
                    <p className="flex gap-2.5">
                      <span aria-hidden className="bg-marker-coral mt-2 h-2 w-2 shrink-0 rounded-full" />
                      <span>
                        Now and then I’ll ask you a short question on what you’ve covered. Not graded.
                        It just shows you how confident you feel.
                      </span>
                    </p>
                    <p className="flex gap-2.5">
                      <span aria-hidden className="bg-marker-teal mt-2 h-2 w-2 shrink-0 rounded-full" />
                      <span>
                        Tick <strong>mark lesson complete</strong> on each lesson, so your progress
                        follows you back here.
                      </span>
                    </p>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-4">
                    <InkButton id="welcome-start" variant="primary" onClick={start}>
                      {draft.trim() ? `let’s go, ${draft.trim()} ▸` : 'start on page one ▸'}
                    </InkButton>
                    <button
                      type="button"
                      onClick={close}
                      className="text-ink-soft font-hand cursor-pointer py-2 text-lg underline"
                    >
                      maybe later
                    </button>
                  </div>
                </div>
              </PaperCard>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
