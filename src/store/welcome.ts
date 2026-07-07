import { create } from 'zustand'

/** Whether the welcome modal is open. Auto-opened once for fresh learners; the
 *  home-page "who drew this?" link can re-open it any time. Not persisted. */
export const useWelcome = create<{ open: boolean; setOpen: (v: boolean) => void }>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
}))

const SEEN_KEY = 'jfb-welcome-seen'
export function hasSeenWelcome(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}
export function markWelcomeSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* storage blocked — modal simply may reappear next load */
  }
}
