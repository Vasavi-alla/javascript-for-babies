import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.6 — The call stack (first look) 🎬
 * Viz: CallStackTower — every call gets its own paper card (frame) with its
 * own variables; frames stack up when calls nest and pop off when they
 * finish, and the engine always returns to EXACTLY where it left off.
 */

const CODE = `function makeTea() {
  boilWater();
  console.log("tea is ready");
}

function boilWater() {
  console.log("water is hot");
}

makeTea();`

interface Frame {
  name: string
  note: string
}

interface Scene {
  frames: Frame[]
  lines: string[]
}

const SCENES: Scene[] = [
  { frames: [], lines: [] }, // definitions read — nothing runs
  { frames: [{ name: 'makeTea()', note: 'running line 2' }], lines: [] },
  {
    frames: [
      { name: 'makeTea()', note: '⏸ paused at line 2' },
      { name: 'boilWater()', note: 'running line 7' },
    ],
    lines: [],
  },
  {
    frames: [{ name: 'makeTea()', note: '▶ resumed at line 3' }],
    lines: ['water is hot'],
  },
  { frames: [], lines: ['water is hot', 'tea is ready'] },
  { frames: [], lines: ['water is hot', 'tea is ready'] }, // wrap
]

function CallStackTower({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 230" className="w-full">
        {/* the ground: the global floor everything stands on */}
        <RoughRect x={70} y={186} width={300} height={34} seed={601} fill="var(--color-paper-shade)" fillStyle="solid" />
        <text x={220} y={208} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          global — the ground floor
        </text>
        <text x={30} y={40} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          the call stack
        </text>

        {/* frames stack upward from the ground */}
        <AnimatePresence>
          {scene.frames.map((frame, i) => (
            <motion.g
              key={frame.name}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <RoughRect
                x={110}
                y={140 - i * 52}
                width={220}
                height={44}
                seed={610 + i}
                fill={i === scene.frames.length - 1 ? 'var(--color-sticky)' : 'var(--color-paper, #fdf8ee)'}
                fillStyle="solid"
              />
              <text x={128} y={160 - i * 52} fontFamily="var(--font-code)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
                {frame.name}
              </text>
              <text x={128} y={176 - i * 52} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
                {frame.note}
              </text>
            </motion.g>
          ))}
        </AnimatePresence>

        {scene.frames.length === 0 && (
          <text x={220} y={120} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            (stack empty — no function is running)
          </text>
        )}
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const SONG_EXERCISE: CodeExerciseDef = {
  id: 'l36-song',
  title: 'the same frame, twice',
  task: 'A twist the watched code never showed: one function called TWICE from inside another. Two separate frames for the same function — trace the pushes and pops before you run.',
  steps: [
    <>
      A function named <code>chorus</code> whose body prints exactly <code>la la la</code>.
    </>,
    <>
      A function named <code>song</code> whose body, in order: prints <code>verse</code>, calls{' '}
      <code>chorus()</code>, calls <code>chorus()</code> again, prints <code>verse</code>.
    </>,
    <>
      Call <code>song()</code> once. Before running: how many times does a chorus frame get
      pushed and popped?
    </>,
  ],
  starter: '',
  expectedOutput: ['verse', 'la la la', 'la la la', 'verse'],
  mustUse: [
    { test: /function\s+chorus\s*\(/, label: 'defines chorus' },
    { test: /function\s+song\s*\(/, label: 'defines song' },
    { test: /chorus\s*\(\s*\)[\s\S]*chorus\s*\(\s*\)/, label: 'song calls chorus TWICE — two frames, one function' },
    { test: /song\s*\(\s*\)/, label: 'song itself gets called' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']la la la["']\s*\)[\s\S]*console\.log\s*\(\s*["']la la la["']\s*\)/, label: 'ONE "la la la" print, inside chorus — the two calls do the repeating' },
  ],
  modelAnswer: `function chorus() {
  console.log("la la la");
}

function song() {
  console.log("verse");
  chorus();
  chorus();
  console.log("verse");
}

song();`,
}

export const lesson36: LessonDef = {
  id: '3.6',
  hook: (
    <>
      <p>
        In 3.3 you saw the engine <em>jump</em> into a function and jump back. But here’s the
        question that makes everything tick: when <code>makeTea()</code> calls{' '}
        <code>boilWater()</code>, and boilWater finishes… how does the engine know{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          exactly where to go back to
        </HighlightMark>
        ? Not roughly — exactly: the right function, the right line, with all its variables intact.
      </p>
      <p>
        The answer is a beautifully simple machine called the <strong>call stack</strong>: a tower
        of paper cards. Every call places a new card on top; every finished call removes the top
        card — and the card underneath still says exactly where its function was paused. Watch the
        tower breathe.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'definitions',
      caption:
        'The engine reads both definitions and — say it with me — runs nothing. Two machines stored, stack empty. Execution starts at line 10, the only line that actually DOES something.',
      highlightLines: [1, 6],
    },
    {
      id: 'push-maketea',
      caption:
        'makeTea() is called — a new card (a "frame") goes on the stack: makeTea, with its own private workspace. The rule: whatever card is on TOP is the code currently running.',
      highlightLines: [10],
    },
    {
      id: 'push-boilwater',
      caption:
        'Line 2: makeTea calls boilWater. makeTea is NOT done — it’s frozen mid-line, and its card stays, remembering the exact spot. A second card goes on top: boilWater. Top card runs; everything below waits.',
      highlightLines: [2],
    },
    {
      id: 'pop-boilwater',
      caption:
        'boilWater prints and reaches its end — its card is lifted OFF the stack and destroyed (its variables with it, as 3.2 taught). And look: the top card is makeTea again, still pointing at where it paused. The engine resumes there, precisely.',
      highlightLines: [7, 3],
    },
    {
      id: 'pop-maketea',
      caption:
        'makeTea prints its own line and finishes — its card pops too. Stack empty: the program is done. Push on call, pop on finish, top card runs. That’s the entire machine.',
      highlightLines: [3],
    },
    {
      id: 'wrap',
      caption:
        'This tower is also where errors get their power: when something crashes, the error message lists the whole tower — “at boilWater, at makeTea” — called a stack trace. You’ve been reading one-story stack traces since lesson 0.5; now you can read tall ones.',
    },
  ],
  Viz: CallStackTower,
  underTheHood: (
    <>
      <p>
        The real vocabulary: each card is a <strong>stack frame</strong> — it holds the function’s
        parameters, its local variables, and the <strong>return address</strong> (the exact spot
        to resume). The stack is LIFO — <em>last in, first out</em> — like a stack of plates: you
        can only add or remove at the top.
      </p>
      <p>
        One frame per <em>call</em>, not per function: call the same function twice and it gets two
        separate frames (lesson 3.9 turns this into a superpower).
      </p>
      <p>
        The stack also explains the phrase <em>single-threaded</em> from lesson 2.5 more deeply:
        JavaScript has exactly ONE call stack, so exactly one top card, so exactly one thing
        running at any instant.
      </p>
      <p>
        And the stack has a maximum height — call too deep without finishing anything and the
        engine throws <code>RangeError: Maximum call stack size exceeded</code>.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> that overflowing
        tower is called a <em>stack overflow</em> — and yes, that’s exactly where the website{' '}
        <strong>Stack Overflow</strong> got its name. The place every programmer on Earth goes to
        ask questions is named after the error you just learned to cause. You’ll visit it roughly
        forever.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'While boilWater is running, how many function cards are on the stack (not counting the global floor)? Type the number.',
      accept: ['2', 'two'],
      placeholder: 'a number…',
      why: 'Two — makeTea (paused, remembering its spot) and boilWater (on top, running). The top card runs; everything below waits its turn.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what prints FIRST when makeTea() runs:',
      accept: ['water is hot'],
      why: 'makeTea’s very first act (line 2) is calling boilWater — so boilWater’s print happens before makeTea’s own line 3 ever runs. Trace the tower: push makeTea, push boilWater, print, pop, THEN "tea is ready".',
    },
    {
      kind: 'type-output',
      question: 'boilWater finishes and its card pops. Type the name of the function the engine resumes:',
      accept: ['makeTea', 'makeTea()', 'maketea'],
      placeholder: 'function name…',
      why: 'makeTea — its card is now the top of the stack again, and it recorded the exact line it paused on. That return address is the whole reason the stack exists.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SONG_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the call stack to a friend with the tower-of-cards picture: what happens on a call, what happens on a finish, and how the engine knows exactly where to resume.',
    modelAnswer:
      'Every time a function is called, the engine puts a new card on a tower — the call stack. The card holds that call’s variables and, crucially, the exact line it’s on. Whatever card is on top is the code currently running. If that function calls another one, it freezes mid-line, its card stays put, and a new card goes on top. When the top function finishes, its card is removed and destroyed — and the card underneath is on top again, still pointing at the exact spot where it paused, so the engine resumes precisely there. Push on call, pop on finish, only the top runs. That’s also why error messages list several functions — that’s the tower printed out, called a stack trace — and why calling too deep gives a “stack overflow”: the tower has a maximum height.',
  },
  recap: [
    'Every CALL puts a frame (card) on the stack: its variables + the exact line to resume. Finish = the card pops.',
    'Top card runs; every card below is frozen mid-line, waiting. LIFO — last in, first out.',
    'One stack → one top card → one thing running: that’s "single-threaded", seen from the inside.',
    'Fun fact: the website Stack Overflow is named after the too-tall-tower error you can now explain.',
  ],
}
