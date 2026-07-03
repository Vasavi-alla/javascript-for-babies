import type { ComponentType, ReactNode } from 'react'
import type { Prediction } from '../stepper/types'

/**
 * Mission-format lesson (Phases 3–4): a customer work order solved through
 * hands-on challenges — the learner acts first, explanation arrives as
 * feedback. See docs/superpowers/specs/2026-07-03-mission-format-phases-3-4-design.md.
 */

export type JobType =
  | 'build'
  | 'repair'
  | 'stocktake'
  | 'mystery'
  | 'inspection'
  | 'rush-hour'
  | 'delivery'

/**
 * One hands-on job step. The Interactive owns its whole mini-story
 * (attempts, fail-then-learn beats, predictions) and calls onComplete()
 * exactly once when the learner has done the job.
 */
export interface MissionChallenge {
  id: string
  /** Short imperative title, e.g. "Find the GO button". */
  title: string
  /** Scene-setting, ONE or two short sentences — people skim. */
  prompt: ReactNode
  /**
   * The single do-this instruction, rendered loud (👉 + highlight) so it
   * can't be skimmed past. Keep it under ~10 words.
   */
  action: ReactNode
  Interactive: ComponentType<{ onComplete: () => void }>
  /** The "I'm stuck — show me" escape: spell out exactly what to do. */
  stuck: ReactNode
}

/** A quick check. 'choice' renders like a quiz; 'type-output' asks for exact typed text. */
export type CheckItem =
  | ({ kind: 'choice' } & Prediction)
  | {
      kind: 'type-output'
      question: string
      /** Optional code the question is about, shown above the input. */
      code?: string
      /** Accepted answers (compared after trimming; case-sensitive — output is exact). */
      accept: string[]
      why: string
      /** Input hint; defaults to "type the console output…". */
      placeholder?: string
    }

export interface MissionDef {
  /** Must match a LessonMeta id in content/registry.ts */
  id: string
  jobType: JobType
  /** The customer's complaint/commission — the hook, framed as a problem. */
  workOrder: {
    /** e.g. 'Rosa — the town welcome desk' */
    customer: string
    /** Their words, quoted on the order card. */
    request: ReactNode
  }
  /** Optional scene-setting shown right under the work order (keep it short). */
  brief?: ReactNode
  challenges: MissionChallenge[]
  /** What lands on the shop shelf when the mission ships. */
  shelfItem: { emoji: string; label: string }
  /** The Under-the-Hood equivalent: real terminology, ~250 words. */
  shopNotes: ReactNode
  finalCheck: CheckItem[]
  teachBack: { prompt: string; modelAnswer: string }
  recap: string[]
}
