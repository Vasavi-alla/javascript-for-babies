import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 0.1 — What is a program?
 * Viz: InstructionTape — four instruction cards executed one at a time.
 */

const CODE = `console.log("Crack the egg");
console.log("Whisk with milk");
console.log("Pour into the pan");
console.log("Flip after 2 minutes");`

const CARDS = ['Crack the egg', 'Whisk with milk', 'Pour into the pan', 'Flip after 2 minutes']

// per step: [which card the machine is on (1–4, 0 = none), how many are finished]
const STATE: Array<[number, number]> = [
  [0, 0], // 0: intro
  [1, 0], // 1: running card 1
  [2, 1], // 2: running card 2
  [2, 1], // 3: prediction (same picture)
  [3, 2], // 4: running card 3
  [4, 3], // 5: running card 4
  [0, 4], // 6: all done
]

function InstructionTape({ stepIndex }: { stepIndex: number }) {
  const [current, doneCount] = STATE[stepIndex] ?? STATE[0]
  return (
    <svg viewBox="0 0 420 290" className="w-full">
      <text x={70} y={30} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
        the instructions, as the machine sees them
      </text>
      {CARDS.map((label, i) => {
        const n = i + 1
        const y = 48 + i * 58
        const isCurrent = current === n
        const isDone = n <= doneCount
        return (
          <g key={i}>
            <RoughRect
              x={70}
              y={y}
              width={280}
              height={46}
              seed={60 + i}
              fill={isCurrent ? 'var(--color-marker-yellow)' : undefined}
            />
            <text x={90} y={y + 29} fontFamily="var(--font-hand)" fontSize={21} fill="var(--color-ink)">
              {n}. {label}
            </text>
            <AnimatePresence>
              {isDone && (
                <motion.text
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  x={362}
                  y={y + 31}
                  fontFamily="var(--font-hand)"
                  fontSize={26}
                  fontWeight={700}
                  fill="var(--color-marker-teal)"
                >
                  ✓
                </motion.text>
              )}
            </AnimatePresence>
          </g>
        )
      })}
      {/* the reading head */}
      <AnimatePresence>
        {current > 0 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: (current - 1) * 58 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 17 }}
          >
            <HandArrow from={{ x: 14, y: 71 }} to={{ x: 62, y: 71 }} seed={70} stroke="var(--color-marker-coral)" curve={0.1} />
          </motion.g>
        )}
      </AnimatePresence>
      {stepIndex >= 6 && (
        <text x={70} y={288} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-marker-teal)">
          finished — in well under a millisecond ⚡
        </text>
      )}
    </svg>
  )
}

export const lesson01: LessonDef = {
  id: '0.1',
  hook: (
    <>
      <p>
        You’ve used thousands of programs — every app, game and website is one. But what actually{' '}
        <em>is</em> a program? Not roughly. Exactly.
      </p>
      <p>
        Here’s the whole secret up front: a program is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a list of instructions, written in advance, followed exactly
        </HighlightMark>
        . Like a recipe — except the cook never improvises, never gets bored, and finishes a
        million steps before you blink. Let’s watch one run.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'intro',
      caption:
        'On the left: a real JavaScript program — four instructions, each telling the machine to say one line of a pancake recipe. On the right: the same four instructions as the machine’s to-do list.',
    },
    {
      id: 'run-1',
      caption:
        'The machine starts at the top. Always at the top. It reads instruction 1 and carries it out completely before even glancing at instruction 2.',
      highlightLines: [1],
    },
    {
      id: 'run-2',
      caption: 'Instruction 1 is finished ✓. The machine moves down to instruction 2 and does that one.',
      highlightLines: [2],
    },
    {
      id: 'predict-next',
      caption: 'Instruction 2 is done. Before pressing next — what does the machine do now?',
      highlightLines: [2],
      prediction: {
        question: 'The machine just finished instruction 2. What happens next?',
        options: [
          'It picks whichever instruction looks most important',
          'It moves to instruction 3 — always simply the next one down',
          'It stops and waits for you to tell it what to do',
        ],
        correctIndex: 1,
        why: 'A machine never chooses, judges, or waits for a hint — it goes to the next instruction, every time. (In Phase 2 you’ll learn special instructions that change the order on purpose. But the machine itself never improvises.)',
      },
    },
    {
      id: 'run-3',
      caption: 'Instruction 3. No skipping, no choosing, no getting bored. Down the list it goes.',
      highlightLines: [3],
    },
    {
      id: 'run-4',
      caption: 'And instruction 4 — the last one.',
      highlightLines: [4],
    },
    {
      id: 'done',
      caption:
        'Done. Four instructions, followed exactly, in far less than a millisecond. That is a program: not magic, not intelligence — written instructions plus astonishing speed.',
    },
  ],
  Viz: InstructionTape,
  underTheHood: (
    <>
      <p>
        The proper word for “the machine carries out an instruction” is <strong>execute</strong>.
        Programmers say “the code executes” or “this line runs” — same thing: the machine did what
        the instruction said.
      </p>
      <p>
        A processor does not understand English — and not JavaScript either. Deep down it
        understands only <strong>machine code</strong>. Machine code is made of unimaginably
        small steps, like “copy this number over there.”
      </p>
      <p>
        Something has to translate your JavaScript into those small steps. That translator is
        the <strong>engine</strong> — the star of the next lesson.
      </p>
      <p>
        About speed: a modern processor performs <strong>billions</strong> of those small steps
        every second. That is the whole trade: the machine brings speed and perfect obedience;
        you bring the thinking.
      </p>
      <p>
        And that thinking has to be exact. Programming means deciding precisely what should
        happen — the machine never fills a gap for you. “Make it look nice” is not an instruction
        it can execute. That vagueness is exactly why programming languages exist.
      </p>
      <p>
        One property is the foundation of your career: programs are{' '}
        <strong>deterministic</strong>. Deterministic means: the same program, started the same
        way, does the same thing every time. That reliability is what makes automated testing
        possible — a test can check the same promise a thousand times and mean it.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'Which of these is closest to what a program really is?',
      options: [
        'A recipe card written for a perfectly obedient cook',
        'A conversation between you and the computer',
        'A picture of what the app should look like',
      ],
      correctIndex: 0,
      why: 'Written in advance, followed exactly, no improvisation — that’s a program. There’s no back-and-forth while it runs (the “conversation” starts in lesson 0.3, and even that happens through instructions).',
    },
    {
      question:
        'You accidentally wrote the instructions in the wrong order — “pour into the pan” before “whisk with milk.” What does the machine do?',
      options: [
        'Notices the mistake and quietly fixes the order',
        'Follows your wrong order exactly and makes a mess',
        'Refuses to start until you fix it',
      ],
      correctIndex: 1,
      why: 'The machine executes what you wrote, not what you meant. Getting the order right is entirely your job — and a huge share of all bugs, ever, are exactly this: correct instructions in the wrong order.',
    },
    {
      question: 'An instruction says “make the pancake nice.” What happens?',
      options: [
        'The machine makes its best guess at “nice”',
        'This can’t be a machine instruction — it’s too vague. Programming languages exist to force out that vagueness',
        'The machine looks up “nice” on the internet',
      ],
      correctIndex: 1,
      why: 'Machines cannot handle ambiguity — every instruction must be exact. A programming language is really a deal: you accept strict rules for writing instructions, and in exchange the machine can execute them perfectly.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend who has never coded: what is a program, and why does the ORDER of instructions matter so much? Use any analogy you like (kitchen, LEGO manual, driving directions…).',
    modelAnswer:
      'A program is a list of instructions written down in advance for the computer to follow — like a recipe for a cook who obeys perfectly but never thinks. The computer does instruction 1, then 2, then 3, always in order, billions of steps per second. Order matters because the machine never judges or fixes anything: if the recipe says “pour” before “whisk”, it pours before whisking and makes a mess. It does what you wrote, not what you meant.',
  },
  recap: [
    'A program = a list of instructions, followed one at a time, top to bottom.',
    'The machine never chooses, skips, or fixes your order — it obeys exactly. It runs what you wrote, not what you meant.',
    'It isn’t smart — it’s unimaginably fast: billions of tiny steps per second, identically every time.',
  ],
}
