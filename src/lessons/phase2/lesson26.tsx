import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.6 — for loops (LoopMachine 🎬)
 * Viz: the three slots of the for-header lighting up in sequence,
 * with i's odometer and the console filling up.
 */

const CODE = `for (let i = 1; i <= 5; i = i + 1) {
  console.log("Test run #" + i);
}
console.log("All done!");`

// per step: [active slot (0 none, 1 init, 2 check, 3 update), i value, prints, done]
const STATE: Array<[number, number, number, boolean]> = [
  [0, 0, 0, false],
  [1, 1, 0, false],
  [2, 1, 1, false],
  [3, 2, 1, false],
  [3, 2, 1, false], // prediction
  [2, 6, 5, true],
  [2, 6, 5, true],
]

const SLOTS = [
  { label: 'let i = 1', note: 'init — runs ONCE', x: 40, width: 115 },
  { label: 'i <= 5', note: 'check — before every lap', x: 170, width: 100 },
  { label: 'i = i + 1', note: 'update — after every lap', x: 285, width: 115 },
]

function LoopMachine({ stepIndex }: { stepIndex: number }) {
  const [active, i, prints, done] = STATE[stepIndex] ?? STATE[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={40} y={28} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
        the for-machine: three slots, three jobs
      </text>

      {SLOTS.map((slot, idx) => (
        <g key={idx}>
          <RoughRect
            x={slot.x}
            y={40}
            width={slot.width}
            height={44}
            seed={450 + idx}
            fill={active === idx + 1 ? 'var(--color-marker-yellow)' : undefined}
          />
          <text x={slot.x + slot.width / 2} y={67} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
            {slot.label}
          </text>
          <text x={slot.x + slot.width / 2} y={102} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            {slot.note}
          </text>
        </g>
      ))}

      {/* the odometer */}
      <text x={80} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
        i (the odometer)
      </text>
      <RoughRect x={52} y={160} width={56} height={46} seed={455} />
      <AnimatePresence mode="popLayout">
        <motion.text
          key={i}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          x={80}
          y={192}
          textAnchor="middle"
          fontFamily="var(--font-hand)"
          fontSize={26}
          fontWeight={700}
          fill="var(--color-ink)"
        >
          {stepIndex === 0 ? '—' : i}
        </motion.text>
      </AnimatePresence>

      {/* console prints */}
      <text x={190} y={150} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
        console
      </text>
      {Array.from({ length: prints }, (_, k) => (
        <g key={k}>
          <RoughRect x={190} y={158 + k * 26} width={175} height={22} seed={460 + k} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.2} />
          <text x={200} y={173 + k * 26} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">
            Test run #{k + 1}
          </text>
        </g>
      ))}

      {done && (
        <text x={80} y={250} fontFamily="var(--font-hand)" fontSize={17} fontWeight={700} fill="var(--color-marker-teal)">
          6 &lt;= 5? false → exit ✓
        </text>
      )}
    </svg>
  )
}

const COUNTDOWN_EXERCISE: CodeExerciseDef = {
  id: 'd2b-countdown',
  title: 'countdown',
  task: 'A rocket launch: 3… 2… 1… Go! — where the counting is done by a loop, not by you.',
  steps: [
    <>
      The three numbers must be printed by a loop counting <strong>down</strong> — writing the
      digits 3, 2, 1 into print statements is not allowed.
    </>,
    <>
      <code>Go!</code> prints exactly once, after the counting is over.
    </>,
  ],
  starter: '',
  expectedOutput: ['3', '2', '1', 'Go!'],
  mustUse: [
    { test: /for\s*\(|while\s*\(/, label: 'a loop produces the numbers' },
    { test: /i--|i\s*-=\s*1|i\s*=\s*i\s*-\s*1|\w+--/, label: 'the loop counts DOWN' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']?3["']?\s*\)/, label: 'no hard-coded 3 — the loop variable does the counting' },
  ],
  modelAnswer: `for (let i = 3; i >= 1; i--) {
  console.log(i);
}

console.log("Go!");`,
}

export const lesson26: LessonDef = {
  id: '2.6',
  hook: (
    <>
      <p>
        Look at yesterday’s while loop: create a counter <em>before</em>, check it <em>at the
        gate</em>, change it <em>inside</em>. That trio is so universal that JavaScript gave it its
        own machine with three labeled slots:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the for loop
        </HighlightMark>
        . Same engine as while — but the counter’s whole life story sits in one line, where nobody
        can forget the update and freeze the tab.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'slots',
      caption:
        'Read the header as three slots separated by semicolons: INIT (let i = 1), CHECK (i <= 5), UPDATE (i = i + 1). Three different jobs with three different schedules — watch when each one lights up.',
      highlightLines: [1],
    },
    {
      id: 'init',
      caption:
        'The machine starts: INIT runs — once, and never again. The counter i is born holding 1. (i is a real variable, boxes and labels and all — it lives only for the duration of the loop.)',
      highlightLines: [1],
    },
    {
      id: 'check-run',
      caption:
        'Then the rhythm you know from while: CHECK — 1 <= 5? true → run the body: "Test run #1" hits the console.',
      highlightLines: [1, 2],
    },
    {
      id: 'update',
      caption:
        'After the body finishes, UPDATE fires: i becomes 2. Then straight back to CHECK. The cycle forever after is: check → body → update → check → body → update… (init never runs again — its job is done).',
      highlightLines: [1],
    },
    {
      id: 'predict-checks',
      caption:
        'The loop will print runs #1 through #5 — the body runs 5 times. Here’s the counting question that separates readers from tracers: how many times does the CHECK (i <= 5) run in total?',
      highlightLines: [1],
    },
    {
      id: 'exit',
      caption: 'Six — five yeses and one final no. i reaches 6, the check 6 <= 5 fails, exit to "All done!". Checks = laps + 1, always — this tiny asymmetry is the root of a thousand off-by-one bugs.',
      highlightLines: [4],
    },
    {
      id: 'exit-common-shape',
      caption:
        'You’ll soon write the most common for loop in existence: for (let i = 0; i < list.length; i++) — starting at 0 because positions start at 0 (lesson 1.6!), and using i++ as the one-keystroke version of i = i + 1.',
      highlightLines: [4],
    },
  ],
  Viz: LoopMachine,
  underTheHood: (
    <>
      <p>
        The formal execution order, worth having exactly right: <strong>init → check → body →
        update → check → body → update → … → check(false) → exit</strong>. Everything a for loop
        does, a while loop can do — for is purely a tidier arrangement, keeping the counter’s
        birth, boundary and change in one glanceable line. That tidiness is real protection: the
        “forgot the update” infinite loop from lesson 2.5 is nearly impossible in a for loop,
        because the update slot stares at you from the header.
      </p>
      <p>
        Two idioms to absorb now: counting from zero (<code>let i = 0; i &lt; n</code> — five laps,
        i taking 0,1,2,3,4) is the standard because it matches string and array positions; and{' '}
        <code>i++</code> (“increment”) is the universal shorthand for <code>i = i + 1</code>{' '}
        (<code>i--</code> counts down).
      </p>
      <p>
        In your automation future, for loops drive data-driven tests: “for each of these 50
        usernames, run the login test” — one body, fifty laps, and the counter tells you exactly
        which lap failed.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A loop you have NOT watched — different start, different step. Type the LAST number it prints:',
      code: 'for (let i = 2; i <= 8; i += 2) {\n  console.log(i);\n}',
      accept: ['8'],
      placeholder: 'a number…',
      why: '8 — it prints 2, 4, 6, 8; then i becomes 10 and the check 10 <= 8 fails before printing. The three slots work for ANY schedule — start anywhere, step by anything, stop on any condition.',
    },
    {
      kind: 'type-output',
      question: 'In for (init; check; update) — which slot runs exactly once, no matter how many laps happen? Type its name.',
      accept: ['init', 'the init', 'Init', 'A'],
      placeholder: 'init / check / update…',
      why: 'Init runs once at the very start (the counter is born). The check runs laps+1 times, the update runs once per completed lap. Knowing each slot’s schedule lets you trace any loop without running it.',
    },
    {
      kind: 'type-output',
      question: 'for (let i = 0; i < 5; i++) — the CHECK runs how many times in total? Type the number (careful — this is the off-by-one heart of loops).',
      accept: ['6', 'six'],
      placeholder: 'a number…',
      why: 'Six: five yeses (i = 0…4) plus the final NO at i = 5 that ends the loop. Checks = laps + 1, always — off-by-one bugs live and die on this fact. (And in testing, one loop body + n data laps is data-driven testing: when run #37 fails, the counter names the culprit.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={COUNTDOWN_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the for loop to a friend: what are the three slots, when does each run, and why do checks outnumber laps by exactly one?',
    modelAnswer:
      'A for loop packs the counter pattern into three labeled slots: for (init; check; update). Init runs exactly once — it creates the counter. Then the machine cycles: check the condition; if true, run the body, then run the update, then check again. So for five laps, the check actually runs six times — five yeses and the final no that ends the loop (checks = laps + 1, the root of off-by-one bugs). It’s the same engine as a while loop, just with the counter’s whole life — birth, boundary, change — visible in one line, which is why you can’t accidentally forget the update and freeze the tab.',
  },
  recap: [
    'for (init; check; update): init once, then check → body → update forever until the check says no.',
    'Checks = laps + 1 — the final “no” is a check too. Off-by-one bugs live and die on this fact.',
    'The classic: for (let i = 0; i < n; i++) — zero-based to match positions. In testing: one body, n data laps, and the counter names the failing lap.',
  ],
}
