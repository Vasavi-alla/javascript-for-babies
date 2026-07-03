import type { JobType } from '../engine/mission/types'

/**
 * Story identity for mission-format phases (3–4). Vocabulary only — the
 * MissionShell and PhasePage read these so Phase 4 reuses the same engine
 * with different words.
 */

export interface MissionTheme {
  /** e.g. 'The Machine Shop' */
  workplace: string
  /** Scene-setting paragraphs shown on the phase page, above the shelf. */
  shopSign: string[]
  /** Section labels inside a mission. */
  labels: {
    workOrder: string
    shipped: string
    /** e.g. 'the greeting machine joins your shop shelf' — {item} is replaced. */
    shippedLine: string
    notes: string
    notesLead: string
    check: string
    teach: string
    shelf: string
    shelfCount: string
  }
  jobTypeLabels: Record<JobType, string>
}

export const MISSION_THEMES: Record<number, MissionTheme> = {
  3: {
    workplace: 'The Machine Shop',
    shopSign: [
      'You’re done with classroom lessons — welcome to your first job. This is the Machine Shop, and you’re the new apprentice. Customers walk in with problems; you build them machines that solve those problems. In JavaScript those machines are called functions — and by the end of this phase you’ll build, repair, and inspect them like you’ve done it for years.',
      'Every machine you ship lands on the shelf below. The final work order (3.11) is the big one: a customer wants a tip calculator, and you’ll bolt it together from the machines you’ve already built.',
    ],
    labels: {
      workOrder: 'work order',
      shipped: 'SHIPPED ✓',
      shippedLine: 'The {item} machine joins your shop shelf.',
      notes: 'shop notes',
      notesLead:
        'What the master writes in the shop notebook — the real names for what you just did. This part turns “I made it work” into “I can explain it.”',
      check: 'final inspection',
      teach: 'train the next apprentice',
      shelf: 'your shop shelf',
      shelfCount: '{done} of {total} machines built',
    },
    jobTypeLabels: {
      build: 'build job',
      repair: 'repair job',
      stocktake: 'stocktake',
      mystery: 'mystery job',
      inspection: 'inspection',
      'rush-hour': 'rush hour',
      delivery: 'delivery',
    },
  },
}
