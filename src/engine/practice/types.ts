import type { ReactNode } from 'react'

/**
 * A write-the-code exercise: the learner types real JavaScript, runs it, and
 * is validated against the exact console output PLUS required syntax — so
 * they practice the *form*, not just the result.
 * Written LeetCode-style for newbies: a short story, then numbered steps that
 * spell out exact names and strings, then the exact expected console output.
 */
export interface CodeExerciseDef {
  id: string
  title: string
  /** The story/goal in one or two plain sentences. A string so the AI mentor can read it too. */
  task: string
  /**
   * Requirements, LeetCode-style: exact names, exact text, constraints — the
   * WHAT, never the HOW. The solving (which keyword, which shape) stays with
   * the learner; the inspection checks and "show answer" teach the how.
   */
  steps: ReactNode[]
  /** Pre-filled editor content (comments that scaffold, never the answer). */
  starter?: string
  /** Exact console lines a correct solution prints, in order. */
  expectedOutput: string[]
  /**
   * Syntax the solution must contain — this is what makes it a syntax lesson,
   * not an output-guessing game. NOTE: don't use the /g flag (stateful .test()).
   */
  mustUse?: Array<{ test: RegExp; label: string }>
  /** Shortcuts we don't allow (e.g. just console.log-ing the final string). */
  mustNotUse?: Array<{ test: RegExp; label: string }>
  modelAnswer: string
}
