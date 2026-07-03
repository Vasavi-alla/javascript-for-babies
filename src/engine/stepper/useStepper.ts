import { useCallback, useEffect, useState } from 'react'
import type { Step } from './types'

/**
 * "Watch it happen" is pure watching (user decision 2026-07-03): steps are
 * never gated on questions — thinking happens in the typed checks instead.
 */
export interface StepperState {
  index: number
  step: Step
  isFirst: boolean
  isLast: boolean
  next: () => void
  prev: () => void
}

export function useStepper(steps: Step[]): StepperState {
  const [index, setIndex] = useState(0)

  const step = steps[index]

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, steps.length - 1)), [steps])
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), [])

  // ←/→ keyboard stepping
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
    next,
    prev,
  }
}
