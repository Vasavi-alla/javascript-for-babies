import { useEffect, useRef, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { AnimatePresence, motion } from 'motion/react'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { useProgress } from '../../store/progress'
import { localDay } from './stats'

/** One focused block before we suggest stretching (Pomodoro-ish). */
const BREAK_AFTER_MINUTES = 25
/** Past this much active time in a day, the suggestion becomes "stop for today". */
const DAY_ENOUGH_MINUTES = 90
const SNOOZE_MINUTES = 5

/**
 * The break coach: counts *active* minutes (react-idle-timer pauses the
 * count when the learner wanders off) and, after a focused block, covers
 * the page with a gentle nudge — stretch, or close the notebook for the
 * day. Active minutes also feed the studyLog that powers the home-page
 * streak, so resting never costs progress.
 */
export function BreakCoach() {
  const { studyLog, logStudyMinute } = useProgress()
  const [sessionMinutes, setSessionMinutes] = useState(0)
  const [nudge, setNudge] = useState<'break' | 'day' | null>(null)
  const idleRef = useRef(false)

  useIdleTimer({
    timeout: 60_000,
    onIdle: () => {
      idleRef.current = true
    },
    onActive: () => {
      idleRef.current = false
    },
  })

  const todayMinutes = studyLog[localDay()] ?? 0

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (idleRef.current || document.visibilityState !== 'visible') return
      logStudyMinute(localDay())
      setSessionMinutes((m) => m + 1)
    }, 60_000)
    return () => window.clearInterval(timer)
  }, [logStudyMinute])

  useEffect(() => {
    if (nudge !== null || sessionMinutes < BREAK_AFTER_MINUTES) return
    setNudge(todayMinutes >= DAY_ENOUGH_MINUTES ? 'day' : 'break')
  }, [sessionMinutes, nudge, todayMinutes])

  function takeBreak() {
    setNudge(null)
    setSessionMinutes(0)
  }

  function snooze() {
    setNudge(null)
    setSessionMinutes(BREAK_AFTER_MINUTES - SNOOZE_MINUTES)
  }

  return (
    <AnimatePresence>
      {nudge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'color-mix(in srgb, var(--color-ink) 35%, transparent)' }}
        >
          <motion.div
            initial={{ y: 24, rotate: -2 }}
            animate={{ y: 0, rotate: -1 }}
            transition={{ type: 'spring', damping: 18 }}
          >
            <StickyNote id={`break-${nudge}`} className="max-w-md p-2">
              {nudge === 'break' ? (
                <>
                  <p className="font-hand text-3xl font-bold">☕ time to stretch</p>
                  <p className="mt-2">
                    That’s {BREAK_AFTER_MINUTES} focused minutes. Brains file things away during
                    pauses, not during marathons — water, stretch, look at something far away.
                    Your place in the shop is saved, always.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-hand text-3xl font-bold">🌙 that’s a strong day</p>
                  <p className="mt-2">
                    {todayMinutes} minutes of learning today. What you studied settles in while
                    you rest — close the notebook proudly. Your streak and your place will be
                    right here tomorrow.
                  </p>
                </>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <InkButton id={`break-yes-${nudge}`} variant="primary" onClick={takeBreak}>
                  {nudge === 'break' ? '☕ ok, taking a break' : '🌙 done for today'}
                </InkButton>
                <InkButton id={`break-snooze-${nudge}`} onClick={snooze}>
                  {SNOOZE_MINUTES} more minutes — mid-thought
                </InkButton>
              </div>
            </StickyNote>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
