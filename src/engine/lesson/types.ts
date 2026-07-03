import type { ComponentType, ReactNode } from 'react'
import type { Prediction, Step } from '../stepper/types'
import type { CheckItem } from '../mission/types'

/**
 * A complete lesson, following the 6-part anatomy in 04-LESSON-BLUEPRINT.md:
 * Hook → Visualize → Under the Hood → Play → Teach-back → Recap.
 */
export interface LessonDef {
  /** Must match a LessonMeta id in content/registry.ts */
  id: string
  /** Why this concept exists — shown before anything else. Never starts with syntax. */
  hook: ReactNode
  /** Code shown next to the visualization (steps may override via codeOverride). */
  code?: string
  steps: Step[]
  /** Pure function of stepIndex — scrubbing both ways must always be correct. */
  Viz: ComponentType<{ stepIndex: number }>
  /** The accurate, deeper explanation with real terminology. */
  underTheHood: ReactNode
  /**
   * Quick checks. Prefer typed answers ({ kind: 'type-output', … }) over
   * multiple choice — recall beats recognition (user decision 2026-07-03);
   * keep an MCQ only when the options themselves are the teaching.
   */
  quiz: Array<Prediction | CheckItem>
  /** Optional extra interactive exercise rendered in the Play section. */
  PlayExtra?: ComponentType
  teachBack: {
    prompt: string
    modelAnswer: string
  }
  /** Short recall statements shown as sticky notes at the end. */
  recap: string[]
}
