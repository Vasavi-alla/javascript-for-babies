import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Learner progress, persisted to localStorage (see 02-ARCHITECTURE.md). */
interface ProgressState {
  /** lessonId → ISO date completed */
  completedLessons: Record<string, string>
  /** lessonId → the learner's teach-back answer */
  journal: Record<string, string>
  markComplete: (lessonId: string) => void
  saveJournal: (lessonId: string, text: string) => void
}

export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: {},
      journal: {},
      markComplete: (lessonId) =>
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: new Date().toISOString() },
        })),
      saveJournal: (lessonId, text) =>
        set((s) => ({ journal: { ...s.journal, [lessonId]: text } })),
    }),
    { name: 'jfb-progress' },
  ),
)
