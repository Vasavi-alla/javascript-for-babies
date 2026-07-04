import { motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.11 — Checkpoint: the tip calculator brain
 * Everything Phase 3 taught, composed: three small PURE functions feeding
 * each other through return values. Viz: the pipeline of functions with
 * values flowing left to right.
 */

const CODE = `function tipAmount(bill, percent) {
  return bill * percent / 100;
}

function totalWithTip(bill, percent) {
  return bill + tipAmount(bill, percent);
}

function perPerson(bill, percent, people) {
  return totalWithTip(bill, percent) / people;
}

console.log(perPerson(1200, 10, 4));`

interface Scene {
  tip: number | null
  total: number | null
  each: number | null
  lines: string[]
}

const SCENES: Scene[] = [
  { tip: null, total: null, each: null, lines: [] },
  { tip: null, total: null, each: null, lines: [] }, // the chain of calls begins
  { tip: 120, total: null, each: null, lines: [] },
  { tip: 120, total: 1320, each: null, lines: [] },
  { tip: 120, total: 1320, each: 330, lines: ['330'] },
  { tip: 120, total: 1320, each: 330, lines: ['330'] }, // wrap
]

function Box({ x, name, value, active }: { x: number; name: string; value: number | null; active: boolean }) {
  return (
    <g opacity={value !== null || active ? 1 : 0.4}>
      <RoughRect x={x} y={64} width={116} height={64} seed={1100 + x} fill="var(--color-sticky)" fillStyle="solid" />
      <text x={x + 58} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
        {name}
      </text>
      {value !== null ? (
        <motion.text
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          x={x + 58}
          y={112}
          textAnchor="middle"
          fontFamily="var(--font-code)"
          fontSize={14}
          fontWeight={700}
          fill="var(--color-marker-teal)"
        >
          ↩ {value}
        </motion.text>
      ) : (
        <text x={x + 58} y={112} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
          …
        </text>
      )}
    </g>
  )
}

function BrainPipeline({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 190" className="w-full">
        <text x={220} y={30} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          bill 1200 · tip 10% · 4 people
        </text>
        <Box x={16} name="tipAmount" value={scene.tip} active={stepIndex >= 1} />
        <RoughLine x1={132} y1={96} x2={158} y2={96} seed={1101} strokeWidth={2} />
        <Box x={162} name="totalWithTip" value={scene.total} active={stepIndex >= 1} />
        <RoughLine x1={278} y1={96} x2={304} y2={96} seed={1102} strokeWidth={2} />
        <Box x={308} name="perPerson" value={scene.each} active={stepIndex >= 1} />
        <text x={220} y={168} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
          each returned value feeds the next function — no console.log inside
        </text>
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const TIP_EXERCISE: CodeExerciseDef = {
  id: 'l311-tip',
  title: 'part 1 — the smallest brain cell',
  task: 'Start the commission with the smallest piece: a pure function that computes a tip. Nothing printed inside — it RETURNS.',
  steps: [
    <>
      A function named <code>tipAmount</code> with two parameters: <code>bill</code>, then{' '}
      <code>percent</code>.
    </>,
    <>
      It RETURNS bill × percent ÷ 100 — pure: no printing, no outside variables.
    </>,
    <>
      Prove it: print <code>tipAmount(1200, 10)</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['120'],
  mustUse: [
    { test: /function\s+tipAmount\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'tipAmount takes bill, then percent' },
    { test: /return/, label: 'the tip is RETURNED (the whole point of this checkpoint)' },
    { test: /console\.log\s*\(\s*tipAmount\s*\(\s*1200\s*,\s*10\s*\)\s*\)/, label: 'prints tipAmount(1200, 10)' },
  ],
  modelAnswer: `function tipAmount(bill, percent) {
  return bill * percent / 100;
}

console.log(tipAmount(1200, 10));`,
}

const COMPOSE_EXERCISE: CodeExerciseDef = {
  id: 'l311-compose',
  title: 'part 2 — machines feeding machines',
  task: 'Now the composition: two more pure functions, each one CALLING the previous one and building on its returned value. tipAmount is already in the editor.',
  steps: [
    <>
      A function named <code>totalWithTip</code> (parameters: <code>bill</code>,{' '}
      <code>percent</code>) that returns the bill PLUS the tip — and it must get the tip by{' '}
      <em>calling <code>tipAmount</code></em>, not by re-doing the math.
    </>,
    <>
      A function named <code>perPerson</code> (parameters: <code>bill</code>, <code>percent</code>
      , <code>people</code>) that returns the total split evenly — by calling{' '}
      <code>totalWithTip</code>.
    </>,
    <>
      The grand finale: print <code>perPerson(1200, 10, 4)</code>.
    </>,
  ],
  starter: 'function tipAmount(bill, percent) {\n  return bill * percent / 100;\n}\n\n',
  expectedOutput: ['330'],
  mustUse: [
    { test: /function\s+totalWithTip\s*\([\s\S]*?\)[\s\S]*?tipAmount\s*\(/, label: 'totalWithTip builds on tipAmount by CALLING it' },
    { test: /function\s+perPerson\s*\([\s\S]*?\)[\s\S]*?totalWithTip\s*\(/, label: 'perPerson builds on totalWithTip by CALLING it' },
    { test: /console\.log\s*\(\s*perPerson\s*\(\s*1200\s*,\s*10\s*,\s*4\s*\)\s*\)/, label: 'prints perPerson(1200, 10, 4)' },
  ],
  mustNotUse: [
    { test: /=\s*330\b|=\s*1320\b/, label: 'no pre-computed totals — the functions must earn every number' },
  ],
  modelAnswer: `function tipAmount(bill, percent) {
  return bill * percent / 100;
}

function totalWithTip(bill, percent) {
  return bill + tipAmount(bill, percent);
}

function perPerson(bill, percent, people) {
  return totalWithTip(bill, percent) / people;
}

console.log(perPerson(1200, 10, 4));`,
}

export const lesson311: LessonDef = {
  id: '3.11',
  hook: (
    <>
      <p>
        The Phase 3 finale — and it works like real software does. The commission: a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          tip calculator brain
        </HighlightMark>
        . Dinner cost 1200, the service deserves 10%, four friends are splitting. What does each
        person pay?
      </p>
      <p>
        You could write one big function that does everything. Professionals don’t. They build{' '}
        <strong>small pure functions</strong> and <em>compose</em> them — each one returning its
        answer so the next can build on it. This is why lesson 3.3 was so insistent about{' '}
        <code>return</code> over <code>console.log</code>: a returned value can feed another
        function; printed text can’t feed anything. Today that investment pays out in full.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read',
      caption:
        'Three definitions, each tiny, each PURE (3.10): inputs through parameters, answers through return, no printing inside. Notice the dependencies: totalWithTip calls tipAmount; perPerson calls totalWithTip. A brain made of three cells.',
      highlightLines: [1, 5, 9],
    },
    {
      id: 'chain-starts',
      caption:
        'Line 13 calls perPerson(1200, 10, 4). Its body needs totalWithTip first — which needs tipAmount first. Three frames stack up (the 3.6 tower, working for you): perPerson paused, totalWithTip paused, tipAmount computing.',
      highlightLines: [13, 10],
    },
    {
      id: 'tip-returns',
      caption:
        'tipAmount returns 1200 × 10 ÷ 100 = 120. By 3.3’s law, that 120 REPLACES the call tipAmount(bill, percent) inside totalWithTip — which can now finish its own line: 1200 + 120.',
      highlightLines: [2, 6],
    },
    {
      id: 'total-returns',
      caption:
        'totalWithTip returns 1320, which replaces ITS call inside perPerson. See the relay? Each return value is a baton passed to the function above. No shared variables, no leaks — just values flowing through returns.',
      highlightLines: [6, 10],
    },
    {
      id: 'per-person',
      caption:
        'perPerson returns 1320 ÷ 4 = 330, the console.log at the very edge prints it (compute pure, print at the edges — 3.10), and the stack empties. Each friend pays 330.',
      highlightLines: [10, 13],
    },
    {
      id: 'wrap',
      caption:
        'The payoff of composition: requirements change — “make it 15%” — and you change NOTHING but the argument. The restaurant adds a service charge? Touch only totalWithTip; tipAmount and perPerson don’t even notice. Small pure pieces, loosely joined: that’s software.',
    },
  ],
  Viz: BrainPipeline,
  underTheHood: (
    <>
      <p>
        What you just used is called <strong>function composition</strong>: building bigger
        behavior by feeding one function’s return value into another. It only works because every
        piece <em>returns</em> (3.3) and every piece is <em>pure</em> (3.10) — no hidden state, so
        the only thing connecting them is visible values. When you read professional code, this is
        most of what you’ll see: small verbs, composed.
      </p>
      <p>
        And here is your career quietly beginning: pure, composed functions are exactly what unit
        tests are written against. <code>expect(tipAmount(1200, 10)).toBe(120)</code> — one line,
        no setup, no browser, no server. In Phase 10 you’ll write precisely that with Vitest, and
        the functions you wrote today would pass those tests unchanged. You didn’t just finish
        functions; you built your first testable unit.
      </p>
      <p>
        Phase 3, complete: machines → parameters → return → functions-as-values → scope → the call
        stack → closures → callbacks → recursion → purity → composition. Every later phase spends
        this vocabulary. Next stop, Phase 4: what happens when data comes in <em>groups</em>.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what tipAmount(600, 10) returns:',
      accept: ['60'],
      why: '600 × 10 ÷ 100 = 60. Same inputs, same output, forever — it’s pure, which is exactly why it’s one assertion away from being a unit test.',
    },
    {
      kind: 'type-output',
      question: 'Composition only works because these functions ___ their answers instead of printing them. Type the keyword.',
      accept: ['return', 'Return'],
      placeholder: 'a keyword…',
      why: 'return — a returned value replaces the call and can feed the next function; printed text goes to human eyes and can never be computed with. Lesson 3.3’s window-vs-chute, now load-bearing.',
    },
    {
      kind: 'type-output',
      question: 'Compose in your head: type what perPerson(1000, 20, 2) returns:',
      accept: ['600'],
      why: 'tipAmount → 200; totalWithTip → 1200; perPerson → 1200 ÷ 2 = 600. If you traced that chain without running it, Phase 3 has done its job.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={TIP_EXERCISE} />
      <CodeExercise def={COMPOSE_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'The Phase 3 graduation speech: explain to a friend how the tip calculator works as three composed pure functions — and why building it that way beats one big function.',
    modelAnswer:
      'The calculator is three tiny pure functions, each doing one job and RETURNING its answer: tipAmount computes the tip from bill and percent; totalWithTip calls tipAmount and adds the bill; perPerson calls totalWithTip and divides by the group size. When perPerson(1200, 10, 4) runs, the calls stack up like the call-stack tower, then each return value replaces its call and feeds the function above — 120 flows into 1320, 1320 flows into 330 — and only the very last line, outside all functions, prints. It beats one big function because each piece is understandable alone, reusable elsewhere, and testable with a single assertion like expect(tipAmount(1200, 10)).toBe(120). And change is contained: switch to 15%? Change an argument. Add a service charge? Touch only totalWithTip. Small pure pieces connected by return values — that’s how real software is built, and how it’s tested.',
  },
  recap: [
    'Composition: small pure functions feeding each other through RETURN values. The chute (3.3) was the whole point.',
    'The relay: 120 → 1320 → 330 — each return replaces its call and becomes the next function’s ingredient.',
    'Change stays contained: new percent = new argument; new rule = touch one function. The others never notice.',
    '🎓 Phase 3 complete — and expect(tipAmount(1200,10)).toBe(120) is a Vitest unit test you can already write.',
  ],
}
