import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Learner progress, persisted to localStorage (see 02-ARCHITECTURE.md). */
interface ProgressState {
  /** lessonId → ISO date completed */
  completedLessons: Record<string, string>
  /** lessonId → the learner's teach-back answer */
  journal: Record<string, string>
  /** practice exerciseId → ISO date first solved (code written & validated) */
  solvedExercises: Record<string, string>
  markComplete: (lessonId: string) => void
  saveJournal: (lessonId: string, text: string) => void
  markExerciseSolved: (exerciseId: string) => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: {},
      journal: {},
      solvedExercises: {},
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
    }),
    { name: 'jfb-progress' },
  ),
)
