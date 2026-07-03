import { useState } from 'react'
import { motion } from 'motion/react'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { HighlightMark } from '../../design/HighlightMark'
import type { Prediction } from '../stepper/types'

/** A "quick check" question in the Play section. Yellow sticky, local state. */
export function QuizCard({ index, question }: { index: number; question: Prediction }) {
  const [answered, setAnswered] = useState<number | undefined>(undefined)
  const hasAnswered = answered !== undefined
  const wasRight = answered === question.correctIndex

  return (
    <StickyNote id={`quiz-${index}-${question.question}`} className="w-full max-w-xl">
      <p className="font-hand text-2xl font-semibold leading-snug">✏️ Quick check {index + 1}</p>
      <p className="mt-1 mb-3">{question.question}</p>

      <div className="flex flex-col items-start gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex
          const isPicked = answered === i
          return (
            <div key={i} className="flex items-center gap-1.5">
              <InkButton
                id={`quiz-${index}-option-${i}`}
                disabled={hasAnswered}
                onClick={() => setAnswered(i)}
              >
                {option}
              </InkButton>
              {hasAnswered && isCorrect && <span className="text-marker-teal text-xl">✓</span>}
              {hasAnswered && isPicked && !isCorrect && (
                <span className="text-marker-coral text-xl">✗</span>
              )}
            </div>
          )
        })}
      </div>

      {hasAnswered && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-3">
          <HighlightMark
            type="highlight"
            color={
              wasRight
                ? 'color-mix(in srgb, var(--color-marker-teal) 35%, transparent)'
                : 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)'
            }
          >
            {wasRight ? 'Right!' : 'Not quite —'}
          </HighlightMark>{' '}
          {question.why}
        </motion.p>
      )}
    </StickyNote>
  )
}
