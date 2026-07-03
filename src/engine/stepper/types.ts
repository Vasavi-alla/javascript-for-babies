import type { ReactNode } from 'react'

/** A predict-before-reveal gate: the learner must answer before advancing. */
export interface Prediction {
  question: string
  options: string[]
  correctIndex: number
  /** Shown after answering, right or wrong — the "why". */
  why: string
}

/**
 * One step of a lesson's visualization. Design rule (02-ARCHITECTURE.md):
 * every viz component must render as a pure function of the step index,
 * so steps are scrubbable in both directions.
 */
export interface Step {
  id: string
  /** Short caption for the "what just happened" panel. */
  caption: ReactNode
  /** 1-based lines to highlight in the CodePane during this step. */
  highlightLines?: number[]
  /** Replace the lesson's code pane for this step (e.g. showing a fixed typo). */
  codeOverride?: string
  prediction?: Prediction
}
