import { AnimatePresence, motion } from 'motion/react'
import { PaperCard } from '../design/PaperCard'
import { HandArrow, RoughEllipse, RoughLine, RoughRect } from '../design/rough-svg'
import { useStepper } from '../engine/stepper/useStepper'
import { StepperControls } from '../engine/stepper/StepperControls'
import type { Step } from '../engine/stepper/types'

/**
 * Phase 0 lab: the bigger picture — you, your code, the browser, the engine,
 * memory, and what you see. Builds up piece by piece.
 */

const STEPS: Step[] = [
  {
    id: 'cast',
    caption:
      'Meet the cast. On the left: your code — an ordinary text file full of instructions you wrote. On the right: the browser, where everything will happen.',
  },
  {
    id: 'engine',
    caption:
      'Hiding inside every browser is an engine (Chrome’s is called V8). It has exactly one job: read JavaScript instructions and carry them out.',
  },
  {
    id: 'flow',
    caption:
      'When a page loads, your code flows into the engine. The engine performs it one instruction at a time, top to bottom — millions of instructions per second.',
  },
  {
    id: 'memory',
    caption:
      'Whenever your code needs to remember something (a name, a number, a score…), the engine borrows little boxes from memory — the machine’s short-term workspace. Phase 1 is all about these boxes.',
  },
  {
    id: 'output',
    caption:
      'And results come back out where you can see them: messages appear in the console, things change on the page. Code goes in → behavior comes out. That’s the whole story — the rest of the journey just fills in the details.',
  },
]

function BigPicture({ stepIndex }: { stepIndex: number }) {
  return (
    <svg viewBox="0 0 680 330" className="w-full">
      {/* your code */}
      <text x={30} y={80} fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
        your code
      </text>
      <RoughRect x={25} y={95} width={135} height={160} seed={31} fill="var(--color-paper-raised)" fillStyle="solid" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <RoughLine
          key={i}
          x1={42}
          y1={120 + i * 22}
          x2={42 + [78, 100, 60, 92, 70, 85][i]}
          y2={120 + i * 22}
          seed={40 + i}
          stroke="var(--color-ink-soft)"
          strokeWidth={2}
        />
      ))}

      {/* the browser */}
      <text x={225} y={48} fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
        the browser
      </text>
      <RoughRect x={220} y={60} width={290} height={240} seed={32} />

      {/* the engine */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={{ transformOrigin: '310px 185px' }}
          >
            <RoughEllipse cx={310} cy={185} width={130} height={95} seed={33} fill="var(--color-marker-yellow)" />
            <text x={310} y={180} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
              engine
            </text>
            <text x={310} y={204} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
              (V8)
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* code flows into the engine */}
      <AnimatePresence>
        {stepIndex >= 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <HandArrow from={{ x: 165, y: 175 }} to={{ x: 238, y: 183 }} seed={34} stroke="var(--color-ink)" />
            <text x={158} y={158} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
              reads it line by line
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* memory */}
      <AnimatePresence>
        {stepIndex >= 3 && (
          <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <text x={415} y={95} fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-ink)">
              memory (RAM)
            </text>
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const col = i % 3
              const row = Math.floor(i / 3)
              return (
                <RoughRect
                  key={i}
                  x={418 + col * 28}
                  y={105 + row * 28}
                  width={24}
                  height={24}
                  seed={50 + i}
                  strokeWidth={1.5}
                  fill={i === 1 ? 'var(--color-marker-teal)' : undefined}
                />
              )
            })}
            <HandArrow from={{ x: 372, y: 160 }} to={{ x: 420, y: 140 }} seed={35} curve={0.3} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* what you see */}
      <AnimatePresence>
        {stepIndex >= 4 && (
          <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <text x={545} y={80} fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
              what you see
            </text>
            <RoughRect x={545} y={95} width={115} height={160} seed={36} fill="var(--color-paper-raised)" fillStyle="solid" />
            <RoughRect x={558} y={112} width={88} height={30} seed={37} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={602} y={132} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
              Hello!
            </text>
            <text x={602} y={175} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
              the console +
            </text>
            <text x={602} y={196} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
              the page itself
            </text>
            <HandArrow from={{ x: 378, y: 205 }} to={{ x: 540, y: 190 }} seed={38} stroke="var(--color-marker-teal)" curve={-0.15} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export function Phase0Lab() {
  const stepper = useStepper(STEPS)

  return (
    <PaperCard id="phase0-lab" tilt={false}>
      <h3 className="font-hand mb-1 text-3xl font-bold">The bigger picture</h3>
      <p className="text-ink-soft mb-4 text-sm">
        Where your code goes and what happens to it. Step through with the buttons or ← → keys.
      </p>
      <div className="bg-paper-shade/40 rounded-lg">
        <BigPicture stepIndex={stepper.index} />
      </div>
      <p className="mt-4 min-h-16 max-w-3xl">{stepper.step.caption}</p>
      <div className="mt-4">
        <StepperControls stepper={stepper} steps={STEPS} />
      </div>
    </PaperCard>
  )
}
