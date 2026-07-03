import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.9 — Recursion
 * Viz: the call stack again — but now every frame is the SAME function,
 * each with its own n. The tower grows call by call, hits the base case,
 * and unwinds. Voice: real terms lead (frame, base case, stack).
 */

const CODE = `function countdown(n) {
  if (n === 0) {
    console.log("Liftoff!");
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(3);`

interface Scene {
  frames: string[]
  lines: string[]
}

const SCENES: Scene[] = [
  { frames: [], lines: [] }, // definition
  { frames: ['countdown(3)'], lines: ['3'] },
  { frames: ['countdown(3)', 'countdown(2)'], lines: ['3', '2'] },
  { frames: ['countdown(3)', 'countdown(2)', 'countdown(1)'], lines: ['3', '2', '1'] },
  { frames: ['countdown(3)', 'countdown(2)', 'countdown(1)', 'countdown(0)'], lines: ['3', '2', '1', 'Liftoff!'] },
  { frames: [], lines: ['3', '2', '1', 'Liftoff!'] }, // unwind
  { frames: [], lines: ['3', '2', '1', 'Liftoff!'] }, // wrap
]

function RecursionTower({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 250" className="w-full">
        <RoughRect x={90} y={210} width={260} height={30} seed={901} fill="var(--color-paper-shade)" fillStyle="solid" />
        <text x={220} y={230} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          global
        </text>

        <AnimatePresence>
          {scene.frames.map((frame, i) => (
            <motion.g
              key={frame}
              initial={{ opacity: 0, y: -28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <RoughRect
                x={128}
                y={168 - i * 44}
                width={184}
                height={38}
                seed={910 + i}
                fill={i === scene.frames.length - 1 ? 'var(--color-sticky)' : 'var(--color-paper, #fdf8ee)'}
                fillStyle="solid"
              />
              <text
                x={220}
                y={192 - i * 44}
                textAnchor="middle"
                fontFamily="var(--font-code)"
                fontSize={13}
                fontWeight={700}
                fill="var(--color-ink)"
              >
                {frame}
              </text>
            </motion.g>
          ))}
        </AnimatePresence>

        {scene.frames.length === 0 && (
          <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            (stack empty)
          </text>
        )}
        {scene.frames.length === 4 && (
          <text x={396} y={40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-marker-coral)">
            base case!
          </text>
        )}
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const SUMTO_EXERCISE: CodeExerciseDef = {
  id: 'l39-sumto',
  title: 'a function that calls itself — and returns',
  task: 'Recursion meets return: each frame hands its answer DOWN the tower as it unwinds. Sum the numbers from 1 to n without a single loop.',
  steps: [
    <>
      A function named <code>sumTo</code> with one parameter: <code>n</code>.
    </>,
    <>
      Base case first: if <code>n</code> is 0, return 0 — the escape hatch that stops the tower.
    </>,
    <>
      Otherwise return <code>n + sumTo(n - 1)</code> — this frame’s number plus everything below
      it.
    </>,
    <>
      Print <code>sumTo(4)</code> — the tower computes 4 + 3 + 2 + 1 + 0.
    </>,
  ],
  starter: '',
  expectedOutput: ['10'],
  mustUse: [
    { test: /function\s+sumTo\s*\(\s*\w+\s*\)/, label: 'sumTo is a function with one parameter' },
    { test: /if\s*\(/, label: 'a base case guards the top' },
    { test: /return[\s\S]*sumTo\s*\(/, label: 'the function returns a value built from calling ITSELF' },
    { test: /console\.log\s*\(\s*sumTo\s*\(\s*4\s*\)\s*\)/, label: 'prints sumTo(4)' },
  ],
  mustNotUse: [{ test: /for\s*\(|while\s*\(/, label: 'no loops — the stack does the repeating today' }],
  modelAnswer: `function sumTo(n) {
  if (n === 0) {
    return 0;
  }
  return n + sumTo(n - 1);
}

console.log(sumTo(4));`,
}

export const lesson39: LessonDef = {
  id: '3.9',
  hook: (
    <>
      <p>
        Lesson 3.6 planted a quiet detail: the stack makes a frame per <em>call</em>, not per
        function. Which permits something delightfully strange:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a function that calls itself
        </HighlightMark>
        . Not a paradox — just the same function getting a second frame, with a different value of
        n, stacked on top of the first.
      </p>
      <p>
        This is <strong>recursion</strong>: solving a problem by handling one slice and handing
        the rest to… yourself. It shines wherever a problem contains smaller copies of itself —
        countdowns, nested folders, family trees, the DOM tree you’ll automate in Phase 7. One
        rule keeps it from running forever, and today it gets a name: the <em>base case</em>.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'definition',
      caption:
        'The definition is stored — and line 7 contains the strange part: countdown calls countdown. Also note line 2: an if that does NOT recurse. Remember it; it’s the emergency brake.',
      highlightLines: [1, 2, 7],
    },
    {
      id: 'first-frame',
      caption:
        'countdown(3): a frame with n = 3. It prints 3, then calls countdown(2). By 3.6’s rules this frame now freezes mid-line — nothing special so far, except the function it called happens to be itself.',
      highlightLines: [10, 6, 7],
    },
    {
      id: 'second-frame',
      caption:
        'A SECOND countdown frame, with its own private n = 2 (fresh parameters per call — 3.2). The n = 3 frame still exists below, frozen. Same function, two frames, two different n’s living at once.',
      highlightLines: [6, 7],
    },
    {
      id: 'third-frame',
      caption:
        'countdown(1) stacks on top: prints 1, calls countdown(0). The tower is now four stories of the same function. Each frame only knows its own n — that isolation is what makes recursion thinkable.',
      highlightLines: [6, 7],
    },
    {
      id: 'base-case',
      caption:
        'countdown(0): the if finally fires — n === 0 — prints "Liftoff!" and RETURNS without calling again. This is the BASE CASE: the input so small you answer directly. No base case → the tower grows until the engine throws the stack-overflow error from 3.6.',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'unwind',
      caption:
        'Now the unwind: countdown(0) pops, countdown(1) resumes — and it’s already at its last line, so it pops too; then (2), then (3). The tower collapses floor by floor, in reverse order of building. Every recursion has these two movements: build up, unwind down.',
      highlightLines: [7],
    },
    {
      id: 'wrap',
      caption:
        'The recipe for every recursive function, forever: (1) a base case that answers the smallest input directly, checked FIRST; (2) a recursive step that shrinks the problem toward that base case. Shrink is mandatory — countdown(n - 1), never countdown(n).',
    },
  ],
  Viz: RecursionTower,
  underTheHood: (
    <>
      <p>
        Precisely: <strong>recursion</strong> is a function invoking itself; each invocation gets
        its own stack frame with its own parameters and locals, exactly like any call (3.6). The{' '}
        <strong>base case</strong> is the non-recursive branch that stops the growth; the{' '}
        <strong>recursive step</strong> must move the argument strictly <em>toward</em> it. Miss
        either and the stack hits its height limit:{' '}
        <code>RangeError: Maximum call stack size exceeded</code> — the loop-that-never-ends of
        the function world, and it even has the same fix: make progress toward stopping.
      </p>
      <p>
        Anything a loop can do, recursion can do, and vice versa — countdown could have been a
        for-loop. So when? Loops win for flat, list-shaped work. Recursion wins when the data is{' '}
        <em>nested</em> — a folder of folders, a menu of submenus, the browser’s DOM tree where
        every element can contain more elements. “Handle this node, recurse into the children” is
        a sentence you’ll live inside during Phase 7.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> search Google
        for the word <em>recursion</em> and it asks “Did you mean: <em>recursion</em>?” — a
        straight-faced joke that clicks forever, planted by Google’s engineers. Try it right now;
        it’s been running for years.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'At the tallest moment — just as "Liftoff!" prints — how many countdown frames are on the stack? Type the number.',
      accept: ['4', 'four'],
      placeholder: 'a number…',
      why: 'Four: countdown(3), (2), (1) frozen below, and countdown(0) on top hitting the base case. Same function, four frames, four private n values.',
    },
    {
      kind: 'type-output',
      question: 'Delete the base case (the whole if block). The tower grows until the engine throws — type the famous two-word name of that failure.',
      accept: ['stack overflow', 'Stack overflow', 'Stack Overflow', 'stackoverflow'],
      placeholder: 'two words…',
      why: 'A stack overflow — RangeError: Maximum call stack size exceeded. Recursion without a base case is the infinite loop of the function world (and yes, the website is named after it — 3.6).',
    },
    {
      kind: 'type-output',
      question: 'Recursion’s emergency brake — the branch that answers directly WITHOUT calling again — is called the ___ case. Type the word.',
      accept: ['base', 'Base', 'base case'],
      placeholder: 'the ___ case…',
      why: 'The base case — checked first, it stops the growth. The recursive step must shrink the input toward it (n - 1), or the brake is never reached.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SUMTO_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain recursion to a friend using the stack tower: how can a function call itself without paradox, what is the base case, and what happens if you forget it?',
    modelAnswer:
      'A function calling itself isn’t a paradox because the stack makes a new frame per CALL, not per function — countdown(3) calling countdown(2) just stacks a second frame with its own private n, while the first waits frozen below. The tower grows: n = 3, 2, 1… until the base case — the if branch that answers directly without calling again — fires at n = 0. Then the tower unwinds: each frame pops in reverse order, resuming and finishing the frame below it. Two ingredients make every recursive function: a base case checked first, and a recursive step that shrinks the input toward it (n − 1, never n). Forget the base case, or fail to shrink, and the tower grows until the engine throws a stack overflow — recursion’s version of an infinite loop. It earns its keep on nested data: folders inside folders, and the DOM tree I’ll be testing later.',
  },
  recap: [
    'Recursion = a function calling itself. Legal because each CALL gets its own frame with its own n.',
    'Two mandatory parts: a base case (answers directly, checked first) + a recursive step that SHRINKS toward it.',
    'Build up, unwind down: frames stack until the base case, then pop in reverse. No base case → stack overflow.',
    'Loops for flat lists; recursion for nested shapes — folders, menus, and Phase 7’s DOM tree.',
  ],
}
