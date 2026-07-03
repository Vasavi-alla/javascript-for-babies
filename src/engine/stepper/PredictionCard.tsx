import { motion } from 'motion/react'
import { StickyNote } from '../../design/StickyNote'
import { InkButton } from '../../design/InkButton'
import { HighlightMark } from '../../design/HighlightMark'
import type { Prediction } from './types'

/** The pink predict-before-reveal sticky. Blocks the stepper until answered. */
export function PredictionCard({
  prediction,
  answered,
  onAnswer,
  heading = '🔮 Predict before you press next:',
}: {
  prediction: Prediction
  answered: number | undefined
  onAnswer: (choice: number) => void
  /** Missions override this (e.g. "Predict before you press GO:"). */
  heading?: string
}) {
  const hasAnswered = answered !== undefined
  const wasRight = answered === prediction.correctIndex

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: 'spring', damping: 16 }}
    >
      <StickyNote id={`prediction-${prediction.question}`} color="pink" className="max-w-xl">
        <p className="font-hand mb-2 text-2xl leading-snug font-semibold">{heading}</p>
        <p className="mb-3">{prediction.question}</p>

        <div className="flex flex-wrap gap-2">
          {prediction.options.map((option, i) => {
            const isCorrect = i === prediction.correctIndex
            const isPicked = answered === i
            return (
              <div key={i} className="flex items-center gap-1.5">
                <InkButton
                  id={`prediction-option-${i}`}
                  disabled={hasAnswered}
                  onClick={() => onAnswer(i)}
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3"
          >
            <HighlightMark
              type="highlight"
              color={wasRight ? 'color-mix(in srgb, var(--color-marker-teal) 35%, transparent)' : 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)'}
            >
              {wasRight ? 'Yes!' : 'Not quite —'}
            </HighlightMark>{' '}
            {prediction.why}
          </motion.p>
        )}
      </StickyNote>
    </motion.div>
  )
}
