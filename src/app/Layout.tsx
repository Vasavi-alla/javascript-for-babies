import { NavLink, Outlet } from 'react-router'
import { BreakCoach } from '../engine/coach/BreakCoach'
import { WelcomeModal } from '../design/WelcomeModal'
import { RecallCheck } from '../engine/lesson/RecallCheck'
import { useProgress } from '../store/progress'
import { useRecallUi } from '../store/recall-ui'
import { questionsForCompleted } from '../content/interview-questions'

export function Layout() {
  const completedLessons = useProgress((s) => s.completedLessons)
  const openRecall = useRecallUi((s) => s.openNow)
  const hasRecall = questionsForCompleted(completedLessons).length > 0

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <BreakCoach />
      <WelcomeModal />
      <RecallCheck />
      <header className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-10">
        <NavLink to="/" className="leading-none">
          <span className="font-hand text-5xl font-bold">JS Sketchbook</span>
          <span className="text-ink-soft mt-1 block text-sm">see JavaScript think ✏️</span>
        </NavLink>
        <nav className="font-hand flex items-center gap-6 text-2xl">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'underline decoration-[var(--color-marker-yellow)] decoration-4 underline-offset-4' : 'hover:underline'
            }
          >
            the map
          </NavLink>
          {hasRecall && (
            <button type="button" onClick={() => openRecall(true)} className="cursor-pointer hover:underline">
              quick recall
            </button>
          )}
          <NavLink
            to="/design"
            className={({ isActive }) =>
              isActive ? 'underline decoration-[var(--color-marker-yellow)] decoration-4 underline-offset-4' : 'hover:underline'
            }
          >
            style guide
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
