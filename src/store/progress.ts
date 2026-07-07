import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Self-rated confidence on a recall question. Not a grade. */
export type Confidence = 'low' | 'ok' | 'solid'

/** Learner progress, persisted to localStorage (see 02-ARCHITECTURE.md). */
interface ProgressState {
  /** lessonId → ISO date completed */
  completedLessons: Record<string, string>
  /** lessonId → the learner's teach-back answer */
  journal: Record<string, string>
  /** practice exerciseId → ISO date first solved (code written & validated) */
  solvedExercises: Record<string, string>
  /** mission challengeId → ISO date completed (so revisits don't restart job steps) */
  completedChallenges: Record<string, string>
  /** local day (YYYY-MM-DD) → active study minutes; fed by the break coach */
  studyLog: Record<string, number>
  /** recall questionId → the learner's latest self-rating + when */
  recall: Record<string, { confidence: Confidence; ratedAt: string }>
  /** ISO time the recall check was last shown (the 8-hour gate); null = never */
  lastRecallShownAt: string | null
  markComplete: (lessonId: string) => void
  saveJournal: (lessonId: string, text: string) => void
  markExerciseSolved: (exerciseId: string) => void
  markChallengeComplete: (challengeId: string) => void
  logStudyMinute: (day: string) => void
  rateRecall: (questionId: string, confidence: Confidence) => void
  markRecallShown: () => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: {},
      journal: {},
      solvedExercises: {},
      completedChallenges: {},
      studyLog: {},
      recall: {},
      lastRecallShownAt: null,
      markComplete: (lessonId) =>
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: new Date().toISOString() },
        })),
      saveJournal: (lessonId, text) =>
        set((s) => ({ journal: { ...s.journal, [lessonId]: text } })),
      markExerciseSolved: (exerciseId) =>
        set((s) => ({
          solvedExercises: { ...s.solvedExercises, [exerciseId]: new Date().toISOString() },
        })),
      markChallengeComplete: (challengeId) =>
        set((s) => ({
          completedChallenges: { ...s.completedChallenges, [challengeId]: new Date().toISOString() },
        })),
      logStudyMinute: (day) =>
        set((s) => ({ studyLog: { ...s.studyLog, [day]: (s.studyLog[day] ?? 0) + 1 } })),
      rateRecall: (questionId, confidence) =>
        set((s) => ({
          recall: { ...s.recall, [questionId]: { confidence, ratedAt: new Date().toISOString() } },
        })),
      markRecallShown: () => set({ lastRecallShownAt: new Date().toISOString() }),
    }),
    { name: 'jfb-progress' },
  ),
)
