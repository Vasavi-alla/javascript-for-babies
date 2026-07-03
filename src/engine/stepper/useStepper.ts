import { useCallback, useEffect, useState } from 'react'
import type { Step } from './types'

export interface StepperState {
  index: number
  step: Step
  isFirst: boolean
  isLast: boolean
  /** True while the current step's prediction is unanswered — next() is blocked. */
  gated: boolean
  /** The learner's answer for the current step, if any. */
  answered: number | undefined
  next: () => void
  prev: () => void
  answer: (choice: number) => void
}

export function useStepper(steps: Step[]): StepperState {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const step = steps[index]
  const gated = step.prediction !== undefined && answers[step.id] === undefined

  const next = useCallback(() => {
    setIndex((i) => {
      const current = steps[i]
      const blocked = current.prediction !== undefined && answers[current.id] === undefined
      return blocked ? i : Math.min(i + 1, steps.length - 1)
    })
  }, [steps, answers])

  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  const answer = useCallback(
    (choice: number) => setAnswers((a) => ({ ...a, [step.id]: choice })),
    [step.id],
  )

  // ←/→ keyboard stepping (Enter is reserved for prediction confirm buttons)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  return {
    index,
    step,
    isFirst: index === 0,
    isLast: index === steps.length - 1,
    gated,
    answered: answers[step.id],
    next,
    prev,
    answer,
  }
}
