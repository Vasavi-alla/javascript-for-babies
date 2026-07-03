import { AnimatePresence, motion } from 'motion/react'
import { PaperCard } from '../design/PaperCard'
import { CodePane } from '../design/CodePane'
import { HandArrow, RoughEllipse, RoughRect } from '../design/rough-svg'
import { useStepper } from '../engine/stepper/useStepper'
import { StepperControls } from '../engine/stepper/StepperControls'
import type { Step } from '../engine/stepper/types'

/**
 * Phase 1 lab: a miniature of lesson 1.2 — what really happens in memory
 * when you create (and change) a variable.
 */

const CODE = `let age = 25;\nage = 26;`

const STEPS: Step[] = [
  {
    id: 'intro',
    caption:
      'One line of code: let age = 25. In English it means “machine, please remember the number 25, and call it age.” Let’s watch the machine actually do it.',
    highlightLines: [1],
  },
  {
    id: 'slot',
    caption:
      'First, the machine reserves a tiny space in its memory — think of it as an empty box, ready to hold exactly one value.',
    highlightLines: [1],
  },
  {
    id: 'value',
    caption: 'Next, the value 25 is created and placed into that space.',
    highlightLines: [1],
  },
  {
    id: 'label',
    caption:
      'Finally the name “age” is attached — like a label tied to the box with string. Important: the name is NOT the value. It’s a pointer to where the value lives. From now on, writing age means “go look in that box.”',
    highlightLines: [1],
  },
  {
    id: 'predict-reassign',
    caption: 'Now line 2 runs: age = 26. The variable age currently remembers 25. Make your prediction below before moving on.',
    highlightLines: [2],
    prediction: {
      question: 'Line 2 says age = 26. What do you think JavaScript does?',
      options: [
        'Deletes age completely and creates a brand-new age for 26',
        'Keeps age, but swaps what it remembers: 25 becomes 26',
        'Refuses with an error — age already has a value',
      ],
      correctIndex: 1,
      why: 'Assigning again keeps the variable and simply replaces the value it remembers. The old 25 is forgotten. (One exception you’ll meet soon: if we had created it with const instead of let, changing it WOULD be an error — const means “this must never change.”)',
    },
  },
  {
    id: 'reassign',
    caption:
      'Same box, same label — new value inside. That is all “changing a variable” ever means. The old 25 is gone; the machine’s cleaner (the garbage collector) sweeps it away.',
    highlightLines: [2],
  },
]

function MemoryScene({ stepIndex }: { stepIndex: number }) {
  const value = stepIndex >= 5 ? '26' : '25'
  return (
    <svg viewBox="0 0 420 240" className="w-full">
      <text x={230} y={40} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        memory
      </text>

      {/* the reserved space */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
            style={{ transformOrigin: '290px 105px' }}
          >
            <RoughRect x={230} y={68} width={120} height={74} seed={7} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* the value (keyed by value so reassignment swaps it) */}
      <AnimatePresence mode="popLayout">
        {stepIndex >= 2 && (
          <motion.g
            key={value}
            initial={{ opacity: 0, y: -70 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughEllipse
              cx={290}
              cy={105}
              width={72}
              height={46}
              seed={value === '25' ? 11 : 13}
              fill="var(--color-marker-yellow)"
              fillStyle="hachure"
            />
            <text
              x={290}
              y={114}
              textAnchor="middle"
              fontFamily="var(--font-hand)"
              fontSize={28}
              fontWeight={700}
              fill="var(--color-ink)"
            >
              {value}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the name, attached like a label */}
      <AnimatePresence>
        {stepIndex >= 3 && (
          <motion.g
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <text
              x={70}
              y={114}
              fontFamily="var(--font-hand)"
              fontSize={30}
              fontWeight={700}
              fill="var(--color-ink)"
            >
              age
            </text>
            <HandArrow from={{ x: 125, y: 106 }} to={{ x: 222, y: 106 }} curve={0.12} seed={21} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export function Phase1Lab() {
  const stepper = useStepper(STEPS)

  return (
    <PaperCard id="phase1-lab" tilt={false}>
      <h3 className="font-hand mb-1 text-3xl font-bold">
        Watch a variable being born
      </h3>
      <p className="text-ink-soft mb-5 text-sm">
        A taste of lesson 1.2. Step through with the buttons or ← → keys — go backward any time.
      </p>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <CodePane code={CODE} highlightLines={stepper.step.highlightLines} />
          <p className="min-h-16">{stepper.step.caption}</p>
        </div>
        <div className="bg-paper-shade/40 rounded-lg">
          <MemoryScene stepIndex={stepper.index} />
        </div>
      </div>

      <div className="mt-6">
        <StepperControls stepper={stepper} steps={STEPS} />
      </div>
    </PaperCard>
  )
}
