import { create } from 'zustand'

/**
 * Controls the recall overlay's visibility. The overlay auto-opens on lesson
 * entry (8h-gated) and can also be opened on demand from the "quick recall"
 * nav button (which bypasses the gate). Not persisted. `forced` records whether
 * this open was on-demand, so the empty state can speak differently if needed.
 */
export const useRecallUi = create<{
  open: boolean
  forced: boolean
  openNow: (forced: boolean) => void
  close: () => void
}>((set) => ({
  open: false,
  forced: false,
  openNow: (forced) => set({ open: true, forced }),
  close: () => set({ open: false }),
}))
