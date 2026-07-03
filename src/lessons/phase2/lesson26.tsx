import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
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
      caption: 'The loop will print runs #1 through #5. Here’s the counting question that separates readers from tracers:',
      highlightLines: [1],
      prediction: {
        question: 'The body runs 5 times. How many times does the CHECK (i <= 5) run in total?',
        options: [
          '5 times — once per lap',
          '6 times — five yeses and one final no',
          '4 times',
        ],
        correctIndex: 1,
        why: 'Same as the while gate in lesson 2.5: every lap needs a yes (5 of them), and the loop only ENDS on a no — the sixth check, when i has become 6 and 6 <= 5 fails. Checks = laps + 1. This tiny asymmetry is the root of a thousand off-by-one bugs.',
      },
    },
    {
      id: 'exit',
      caption:
        'And there’s the ending: i reaches 6, the check says no, exit to "All done!". You’ll soon write the most common for loop in existence: for (let i = 0; i < list.length; i++) — starting at 0 because positions start at 0 (lesson 1.6!), and using i++ as the one-keystroke version of i = i + 1.',
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
        (<code>i--</code> counts down). In your automation future, for loops drive data-driven
        tests: “for each of these 50 usernames, run the login test” — one body, fifty laps, and
        the counter tells you exactly which lap failed.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> why is the
        counter always called <code>i</code>? The habit predates JavaScript by four decades — it
        comes from FORTRAN (1957), one of the first programming languages ever, where variables
        beginning with the letters I through N were automatically integers. Counters became i,
        then j and k for nested ones… and 70 years later, programmers who’ve never seen a line of
        FORTRAN still write <code>let i = 0</code> by pure cultural inheritance. (And i itself
        stands for the mathematician’s <em>index</em>.)
      </p>
    </>
  ),
  quiz: [
    {
      question: 'for (let i = 0; i < 3; i++) { console.log(i); } — what exactly prints?',
      options: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3'],
      correctIndex: 1,
      why: 'Init: i = 0. Laps while i < 3: prints 0, then 1, then 2 — and when i becomes 3, the check 3 < 3 fails BEFORE printing. Three laps, starting at zero. This exact shape is how you’ll walk arrays in Phase 4.',
    },
    {
      question: 'In the header for (A; B; C) — which part runs exactly once, no matter how many laps happen?',
      options: ['A — the init', 'B — the check', 'C — the update'],
      correctIndex: 0,
      why: 'Init runs once at the very start (the counter is born). The check runs laps+1 times, the update runs once per completed lap. Knowing each slot’s schedule lets you trace any loop without running it.',
    },
    {
      question: 'You need to run the same login test for each of 50 usernames. Which shape fits?',
      options: [
        'Copy-paste the test 50 times, changing the name each time',
        'A for loop: one body, 50 laps, the counter picks the username — and names which lap failed',
        'A very long if/else chain',
      ],
      correctIndex: 1,
      why: 'This is data-driven testing, and it’s bread-and-butter automation: the loop separates WHAT you test (the body, written once) from WHICH DATA it runs on. When run #37 fails, the counter hands you the exact culprit. Copy-paste, by contrast, is 50 chances for a typo.',
    },
  ],
  teachBack: {
    prompt:
      'Explain the for loop to a friend: what are the three slots, when does each run, and why do checks outnumber laps by exactly one?',
    modelAnswer:
      'A for loop packs the counter pattern into three labeled slots: for (init; check; update). Init runs exactly once — it creates the counter. Then the machine cycles: check the condition; if true, run the body, then run the update, then check again. So for five laps, the check actually runs six times — five yeses and the final no that ends the loop (checks = laps + 1, the root of off-by-one bugs). It’s the same engine as a while loop, just with the counter’s whole life — birth, boundary, change — visible in one line, which is why you can’t accidentally forget the update and freeze the tab. Fun fact: counters are called i because FORTRAN made I-through-N variables integers in 1957, and the habit never died.',
  },
  recap: [
    'for (init; check; update): init once, then check → body → update forever until the check says no.',
    'Checks = laps + 1 — the final “no” is a check too. Off-by-one bugs live and die on this fact.',
    'The classic: for (let i = 0; i < n; i++) — zero-based to match positions. In testing: one body, n data laps, and the counter names the failing lap.',
  ],
}
