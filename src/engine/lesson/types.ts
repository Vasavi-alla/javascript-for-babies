import type { ComponentType, ReactNode } from 'react'
import type { Prediction, Step } from '../stepper/types'

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
  /** Optional extra interactive exercise rendered in the Play section (e.g. a CodeExercise). */
  PlayExtra?: ComponentType
  /**
   * Optional "💼 on the job" section (rendered after the checks, before teach-back):
   * the lesson's future-work moment as a hand-drawn artifact. Compose with the
   * JobScene family (src/design/JobScene.tsx). Content rules live in
   * docs/plan/04-LESSON-BLUEPRINT.md — simplest English in the app, no em dashes.
   */
  onTheJob?: ReactNode
  /**
   * Optional "🎤 in an interview" section (rendered before On-the-job, after
   * the checks): the technically-precise spoken answer a real interviewer wants.
   * This is the ONE section that uses real terminology unglossed — that is the
   * point. Content rules: see 04-LESSON-BLUEPRINT.md ("In-an-interview contract").
   * `question` + `say` are required; `deeper` and `dontSay` render only when set.
   */
  interview?: {
    /** What the interviewer asks, in their words. e.g. "What's a closure?" */
    question: string
    /** The complete spoken answer: headline sentence + the substance you volunteer right after. */
    say: ReactNode
    /**
     * A real code example you would talk through — NOT a toy. `code` is a JS
     * string (use \n for line breaks; keep it one source line so the lint stays
     * robust). `note` is an optional one-line caption ("point at this: …").
     */
    example?: { code: string; note?: string }
    /** The genuinely harder follow-up they push for. Cite the lesson each term was taught. */
    deeper?: ReactNode
    /** The common shallow/wrong answer, and why it is shallow. */
    dontSay?: { wrong: string; why: string }
  }
  teachBack: {
    prompt: string
    modelAnswer: string
  }
  /** Short recall statements shown as sticky notes at the end. */
  recap: string[]
}
