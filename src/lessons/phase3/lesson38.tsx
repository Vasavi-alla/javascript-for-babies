import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.8 — Higher-order functions & callbacks
 * Viz: a function with a parameter that receives ANOTHER function — the
 * passenger function is plugged into a socket and called from inside.
 * Voice note: real terms lead now (function, parameter, callback);
 * the machine picture appears only as a parenthetical reminder.
 */

const CODE = `function repeat(times, action) {
  for (let i = 1; i <= times; i++) {
    action(i);
  }
}

function cheer(round) {
  console.log("Round " + round + ": hooray!");
}

repeat(3, cheer);`

interface Scene {
  /** what's plugged into the action socket */
  plugged: string | null
  lap: number | null
  lines: string[]
}

const SCENES: Scene[] = [
  { plugged: null, lap: null, lines: [] }, // definitions
  { plugged: null, lap: null, lines: [] }, // the contract
  { plugged: 'cheer', lap: null, lines: [] }, // cheer passed in — not called!
  { plugged: null, lap: null, lines: [] }, // the gotcha: cheer() would deliver nothing usable
  { plugged: 'cheer', lap: 1, lines: ['Round 1: hooray!'] },
  { plugged: 'cheer', lap: 2, lines: ['Round 1: hooray!', 'Round 2: hooray!'] },
  { plugged: 'cheer', lap: 3, lines: ['Round 1: hooray!', 'Round 2: hooray!', 'Round 3: hooray!'] },
  { plugged: null, lap: null, lines: ['Round 1: hooray!', 'Round 2: hooray!', 'Round 3: hooray!'] }, // wrap
]

function CallbackSocket({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 210" className="w-full">
        {/* the host function: repeat */}
        <RoughRect x={60} y={40} width={320} height={130} seed={801} fill="var(--color-sticky)" fillStyle="solid" />
        <RoughRect x={140} y={30} width={160} height={26} seed={802} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={220} y={48} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
          repeat
        </text>

        {/* times value */}
        <text x={100} y={86} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink-soft)">
          times: 3
        </text>
        {/* lap odometer */}
        <text x={100} y={110} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink-soft)">
          {scene.lap === null ? 'i: —' : `i: ${scene.lap}`}
        </text>

        {/* the socket for the action parameter */}
        <RoughRect
          x={216}
          y={72}
          width={130}
          height={54}
          seed={803}
          fill={scene.plugged ? 'var(--color-marker-teal)' : 'var(--color-paper, #fdf8ee)'}
          fillStyle={scene.plugged ? 'hachure' : 'solid'}
          strokeWidth={1.6}
        />
        <text x={281} y={66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink-soft)">
          parameter: action
        </text>
        <AnimatePresence mode="popLayout">
          {scene.plugged ? (
            <motion.text
              key={scene.plugged}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              x={281}
              y={104}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={13}
              fontWeight={700}
              fill="var(--color-ink)"
            >
              ƒ {scene.plugged}
            </motion.text>
          ) : (
            <text x={281} y={104} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
              (empty socket)
            </text>
          )}
        </AnimatePresence>

        {/* firing indicator */}
        {scene.lap !== null && (
          <motion.text
            key={scene.lap}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            x={281}
            y={150}
            textAnchor="middle"
            fontFamily="var(--font-hand)"
            fontSize={14}
            fill="var(--color-marker-coral)"
            style={{ originX: '281px', originY: '150px' }}
          >
            action({scene.lap}) — GO!
          </motion.text>
        )}

        <text x={220} y={196} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
          a function riding into a parameter — then called from inside
        </text>
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const RUNBOTH_EXERCISE: CodeExerciseDef = {
  id: 'l38-runboth',
  title: 'a function that receives TWO functions',
  task: 'The watched code took one callback — yours takes two, and decides the order they run. You are now the schedule.',
  steps: [
    <>
      Two tiny functions: <code>morning</code> prints <code>wake up</code>; <code>night</code>{' '}
      prints <code>sleep</code>.
    </>,
    <>
      A function named <code>fullDay</code> with TWO parameters — <code>first</code> and{' '}
      <code>second</code> — that calls <code>first()</code>, then <code>second()</code>.
    </>,
    <>
      Call <code>fullDay(morning, night)</code> — both handed over as values: no parentheses on
      either.
    </>,
  ],
  starter: '',
  expectedOutput: ['wake up', 'sleep'],
  mustUse: [
    { test: /function\s+fullDay\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'fullDay takes TWO function parameters' },
    { test: /first\s*\(\s*\)[\s\S]*second\s*\(\s*\)/, label: 'it calls first(), then second()' },
    { test: /fullDay\s*\(\s*morning\s*,\s*night\s*\)/, label: 'both callbacks passed as values — no parentheses' },
  ],
  mustNotUse: [
    { test: /fullDay\s*\(\s*morning\s*\(\s*\)|fullDay\s*\([^)]*night\s*\(\s*\)/, label: 'parentheses would run them NOW and pass undefined — hand over the functions themselves' },
  ],
  modelAnswer: `function morning() {
  console.log("wake up");
}

function night() {
  console.log("sleep");
}

function fullDay(first, second) {
  first();
  second();
}

fullDay(morning, night);`,
}

export const lesson38: LessonDef = {
  id: '3.8',
  hook: (
    <>
      <p>
        Lesson 3.4 handed you a permission slip: <em>functions are values</em>. You’ve stored them
        in variables — but the permission slip allows something stranger:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          passing a function INTO another function
        </HighlightMark>
        , as an argument, like any number or string. (There’s the 3.4 tease, cashed in.)
      </p>
      <p>
        Why on earth? Because it splits work perfectly: one function knows <em>how often</em> or{' '}
        <em>when</em> something should happen; the other knows <em>what</em> should happen. “Run
        this after 3 seconds.” “Run this when the button is clicked.” “Run this for every test in
        the list.” The <em>this</em> in all three sentences is a function you pass in — and every
        Playwright test you’ll ever write starts exactly that way: <code>test("name", ...)</code>{' '}
        hands the test runner a function.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'definitions',
      caption:
        'Two definitions, nothing runs. Look closely at repeat: its second parameter, action, is expected to receive a FUNCTION — and line 3 calls it: action(i).',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'the-contract',
      caption:
        'repeat doesn’t know what action will be. It just promises: whatever machine you plug into the socket, I’ll press its GO button once per loop lap, handing over the lap number.',
      highlightLines: [2, 3],
    },
    {
      id: 'passing',
      caption:
        'Line 11: repeat(3, cheer) — and here is the entire lesson in one detail: cheer has NO parentheses. We are not running cheer; we are handing the function itself into the action parameter. The value that arrives is the function — pluggable, callable, waiting.',
      highlightLines: [11],
    },
    {
      id: 'the-gotcha',
      caption:
        'One pair of parentheses changes everything: repeat(3, cheer()) would run cheer NOW, and pass along whatever it returns — undefined, since cheer returns nothing. The socket would receive nothing usable, and repeat would crash trying undefined(1). Handing over a machine means NO parentheses.',
      highlightLines: [11],
    },
    {
      id: 'lap-1',
      caption:
        'Inside repeat, the loop begins. Lap 1: action(1) — NOW the parentheses appear, so NOW the passed function runs, receiving 1 into its round parameter. cheer prints its first line.',
      highlightLines: [2, 3],
    },
    {
      id: 'lap-2',
      caption:
        'Lap 2: action(2). Notice who is in charge of the schedule: repeat decides when and how often; cheer only decides what each round looks like. Two functions, two jobs, cleanly split.',
      highlightLines: [3],
    },
    {
      id: 'lap-3',
      caption:
        'Lap 3: action(3), the loop ends, repeat returns. Three lines printed by a function that repeat never knew by name. Swap in a different function — repeat(3, sing) — and the same schedule runs completely different work.',
      highlightLines: [3],
    },
    {
      id: 'wrap',
      caption:
        'The vocabulary: a function that accepts (or returns) another function is a HIGHER-ORDER function. The function you pass in, to be called later, is a CALLBACK — “call this back when it’s time.” repeat is higher-order; cheer was the callback.',
    },
  ],
  Viz: CallbackSocket,
  underTheHood: (
    <>
      <p>
        The two terms, precisely. A <strong>higher-order function</strong> is any function that
        takes a function as an argument, or returns one. 3.7’s <code>makeCounter</code> was
        already one — it returned a function.
      </p>
      <p>
        A <strong>callback</strong> is the function you pass in, named for the promise it carries:{' '}
        <em>“don’t run this now — call it back when the moment comes.”</em> The moment might be
        “each loop lap” (today), “when the timer fires” (Phase 6), or “when the user clicks”
        (Phase 7).
      </p>
      <p>
        The gotcha that bites everyone once: <code>repeat(3, cheer)</code> passes the function;{' '}
        <code>repeat(3, cheer())</code> <em>runs cheer immediately</em> and passes whatever it
        returns — here <code>undefined</code>, since cheer has no return. Then repeat tries{' '}
        <code>undefined(1)</code> and crashes with{' '}
        <code>TypeError: action is not a function</code>. Parentheses are the GO button (3.1) —
        when handing a function over, you don’t press GO.
      </p>
      <p>
        In memory (the Phase 1 picture, now in real words): the parameter <code>action</code>{' '}
        simply points at the same function value that <code>cheer</code> points at. Nothing is
        copied, no magic. (Phase 4 gives this pointing its precise name: a reference.)
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The classic mistake — repeat(3, cheer()) with parentheses. Type what value arrives in the action parameter:',
      accept: ['undefined'],
      placeholder: 'a value…',
      why: 'cheer() runs IMMEDIATELY (parentheses = GO), and since cheer returns nothing, undefined is what gets passed. repeat then tries undefined(1) → TypeError: action is not a function. Handing over a function means NO parentheses.',
    },
    {
      kind: 'type-output',
      question: 'A function passed into another function, to be run later, is called a ___. Type the word.',
      accept: ['callback', 'a callback', 'Callback'],
      placeholder: 'the term…',
      why: 'A callback — “call this back when it’s time.” The receiving side (repeat) is a higher-order function. You’ll write test("…", callback) hundreds of times in Phase 10.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly the LAST line this program prints:',
      accept: ['Round 3: hooray!'],
      why: 'The loop runs laps 1, 2, 3 — each lap calls action(i), and cheer glues the lap number into its sentence. Last lap, last line: Round 3: hooray!',
    },
  ],
  PlayExtra: () => <CodeExercise def={RUNBOTH_EXERCISE} />,
  interview: {
    question: 'What is a higher-order function?',
    say: 'A higher-order function either takes another function as an argument, or returns one. It works because functions are values in JavaScript (3.4). map, filter, and event handlers all rely on this.',
    example: {
      code: 'function retry(action, times) {\n  for (let i = 0; i < times; i++) {\n    if (action()) return true\n  }\n  return false\n}\n\nretry(() => tryLogin(), 3)',
      note: 'retry takes a function and runs it up to three times. Passing behavior as data is the whole idea.',
    },
    deeper:
      'A callback is just the function you pass in (3.8). The receiver decides when to call it. That is how map calls yours for each item, and how a test runner calls each test.',
    dontSay: {
      wrong: 'A function that calls other functions.',
      why: 'Any function can call others. Higher order means it takes or returns a function as data.',
    },
  },
  teachBack: {
    prompt:
      'Explain higher-order functions and callbacks to a friend — including why repeat(3, cheer) has no parentheses on cheer, and what goes wrong if you add them.',
    modelAnswer:
      'Since functions are values, you can pass one into another function as an argument. A function that accepts (or returns) a function is called a higher-order function; the function you pass in is a callback — “call this back when it’s time.” In repeat(3, cheer), repeat is in charge of the schedule (a loop, three laps) and cheer is the work to do each lap: inside, action(i) presses GO on whatever function was passed. Crucially, cheer is written WITHOUT parentheses — parentheses would run it immediately and pass its result (undefined, since it returns nothing) instead of the function itself, and repeat would crash trying to call undefined. This split — one function decides when, another decides what — is the shape of timers, event handlers, and every Playwright test: test("name", callback) is you handing the test runner a callback.',
  },
  recap: [
    'Higher-order function = takes a function in (or hands one back). Callback = the function passed in, run later.',
    'repeat(3, cheer): no parentheses — you hand over the function itself. cheer() would run it NOW and pass undefined.',
    'The split: the higher-order function owns WHEN/HOW OFTEN; the callback owns WHAT. Timers, clicks, tests — all this shape.',
    'Phase 10 preview: test("login works", callback) — your whole job will be writing callbacks.',
  ],
}
