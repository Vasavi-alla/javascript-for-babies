import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.13 — Checkpoint: the test-results dashboard
 * The whole phase in one dataset: an array of objects (THE shape of real test
 * reports), chained through filter → map, folded with reduce. Two exercises:
 * a pass rate, and a find-the-slowest-failure chain. This is literally the
 * learner's future job, four phases early.
 */

const CODE = `const runs = [
  { name: "login",  passed: true,  ms: 320 },
  { name: "search", passed: false, ms: 810 },
  { name: "cart",   passed: true,  ms: 150 },
  { name: "pay",    passed: false, ms: 990 },
];

const failed = runs.filter(r => !r.passed);
console.log(failed.length);

const names = failed.map(r => r.name);
console.log(names);

const totalMs = runs.reduce((s, r) => s + r.ms, 0);
console.log(totalMs);`

interface View {
  /** which runs are highlighted (by index) */
  hot: number[]
  stage: 'data' | 'filter' | 'map' | 'reduce' | 'done'
  console: string[]
  note: string
}

const VIEWS: View[] = [
  { hot: [], stage: 'data', console: [], note: 'an ARRAY of OBJECTS — the exact shape every real test report has' },
  { hot: [1, 3], stage: 'filter', console: ['2'], note: 'filter with !r.passed keeps the failures — objects pass through the gate whole' },
  { hot: [1, 3], stage: 'map', console: ['2', '["search","pay"]'], note: 'chain: the filtered array feeds map, which plucks one property from each object' },
  { hot: [0, 1, 2, 3], stage: 'reduce', console: ['2', '["search","pay"]', '2270'], note: 'reduce folds a property across ALL runs: 0+320+810+150+990 = 2270' },
  { hot: [], stage: 'done', console: ['2', '["search","pay"]', '2270'], note: 'failures counted, named, and timed — you just wrote a QA dashboard' },
]

const RUNS = [
  { name: 'login', passed: true, ms: 320 },
  { name: 'search', passed: false, ms: 810 },
  { name: 'cart', passed: true, ms: 150 },
  { name: 'pay', passed: false, ms: 990 },
]

function DashboardBelt({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={24} y={34} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        runs — four little test-run records
      </text>
      {RUNS.map((r, i) => {
        const hot = view.hot.includes(i)
        return (
          <g key={r.name}>
            <RoughRect
              x={26 + i * 102}
              y={44}
              width={92}
              height={64}
              seed={811 + i}
              strokeWidth={hot ? 2.4 : 1.6}
              stroke={hot ? (r.passed ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)') : 'var(--color-ink)'}
              fill={r.passed ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'color-mix(in srgb, var(--color-marker-coral) 10%, transparent)'}
              fillStyle="solid"
            />
            <text x={72 + i * 102} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">{r.name}</text>
            <text x={72 + i * 102} y={80} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill={r.passed ? 'var(--color-ink)' : 'var(--color-marker-coral)'}>{r.passed ? '✓ passed' : '✗ failed'}</text>
            <text x={72 + i * 102} y={98} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink-soft)">{r.ms} ms</text>
          </g>
        )
      })}

      {/* stage card */}
      <AnimatePresence mode="wait">
        <motion.g key={view.stage} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {view.stage === 'filter' && (
            <g>
              <RoughRect x={110} y={132} width={220} height={40} seed={821} strokeWidth={2} fill="var(--color-marker-yellow)" fillStyle="solid" />
              <text x={220} y={157} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">filter(r =&gt; !r.passed)</text>
            </g>
          )}
          {view.stage === 'map' && (
            <g>
              <RoughRect x={80} y={132} width={280} height={40} seed={822} strokeWidth={2} fill="var(--color-marker-yellow)" fillStyle="solid" />
              <text x={220} y={157} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">failed.map(r =&gt; r.name) → ["search","pay"]</text>
            </g>
          )}
          {view.stage === 'reduce' && (
            <g>
              <RoughRect x={80} y={132} width={280} height={40} seed={823} strokeWidth={2} fill="var(--color-marker-yellow)" fillStyle="solid" />
              <text x={220} y={157} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">reduce: 0 → 320 → 1130 → 1280 → 2270</text>
            </g>
          )}
          {view.stage === 'done' && (
            <g>
              <RoughRect x={110} y={126} width={220} height={62} seed={824} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
              <text x={220} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill="var(--color-ink)">2 failed: search, pay</text>
              <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">suite time: 2270 ms</text>
            </g>
          )}
        </motion.g>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={240} width={360} height={40} seed={825} strokeWidth={1.5} />
      <text x={52} y={236} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">console</text>
      {view.console.length === 0 ? (
        <text x={220} y={265} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">(nothing printed yet)</text>
      ) : (
        <text x={58} y={265} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{view.console.join('   ·   ')}</text>
      )}
    </svg>
  )
}

const PASSRATE_EXERCISE: CodeExerciseDef = {
  id: 'l413-passrate',
  title: 'part 1 — the pass rate',
  task: 'The number every manager asks for first. Given a run of results, compute what percentage passed — computed from the data, so tomorrow’s 400-test run needs zero edits.',
  steps: [
    <>
      Start with <code>results</code>: objects for <code>"signup"</code> (passed true),{' '}
      <code>"logout"</code> (false), <code>"search"</code> (true), <code>"upload"</code> (true) —
      each shaped <code>{'{ test: "…", passed: … }'}</code>.
    </>,
    <>
      Count the passing runs (a filter and a length), divide by the TOTAL count, scale to 100.
    </>,
    <>
      Print the rate with a percent sign glued on: <code>75%</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['75%'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'the passers are selected with filter' },
    { test: /\/\s*results\.length/, label: 'the rate divides by results.length — never a hand-count' },
  ],
  mustNotUse: [
    { test: /75/, label: 'no hand-typed 75 — the data must produce it' },
    { test: /0\.75/, label: 'no precomputed 0.75 either' },
  ],
  modelAnswer: `const results = [
  { test: "signup", passed: true },
  { test: "logout", passed: false },
  { test: "search", passed: true },
  { test: "upload", passed: true },
];

const passedCount = results.filter(r => r.passed).length;
const rate = (passedCount / results.length) * 100;

console.log(rate + "%");`,
}

const SLOWEST_EXERCISE: CodeExerciseDef = {
  id: 'l413-slowest',
  title: 'part 2 — the slowest failure',
  task: 'Triage time: of all the FAILED runs, which took longest? (Slow failures usually hide timeouts — every QA engineer hunts these.) One chain: keep the failures, order them, take the top.',
  steps: [
    <>
      Start with <code>runs</code>: <code>"a11y"</code> failed in <code>420</code> ms,{' '}
      <code>"api"</code> passed in <code>90</code> ms, <code>"e2e"</code> failed in{' '}
      <code>1400</code> ms — each shaped <code>{'{ name, passed, ms }'}</code>.
    </>,
    <>
      Build ONE chain: keep only failures, then sort them slowest-first (mind 4.10's comparator).
    </>,
    <>
      Take the first element of the chained result using array destructuring (4.11), and print its{' '}
      <code>name</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['e2e'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'failures are selected with filter' },
    { test: /\.sort\s*\(\s*\(/, label: 'ordering uses sort with a comparator' },
    { test: /const\s*\[\s*\w+\s*\]\s*=/, label: 'the top element is taken by destructuring: const [top] = …' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']e2e["']\s*\)/, label: 'no hand-typed "e2e" — the chain must find it' },
  ],
  modelAnswer: `const runs = [
  { name: "a11y", passed: false, ms: 420 },
  { name: "api",  passed: true,  ms: 90 },
  { name: "e2e",  passed: false, ms: 1400 },
];

const [slowest] = runs
  .filter(r => !r.passed)
  .sort((a, b) => b.ms - a.ms);

console.log(slowest.name);`,
}

export const lesson413: LessonDef = {
  id: '4.13',
  hook: (
    <>
      <p>
        Checkpoint. No new syntax today — instead, a look at your actual future. When a Playwright
        suite finishes, it hands you exactly one thing: <strong>an array of objects</strong>, one
        per test — name, passed or failed, how long it took. Someone has to turn that raw pile
        into answers: <em>how many failed? which ones? how slow are we?</em>
      </p>
      <p>
        That someone is about to be you. Everything Phase 4 built — objects (4.4), references
        (4.6), the trio (4.9), sorting (4.10), destructuring (4.11) — chains together here into a
        working test-results dashboard. This is the phase's promise kept: not toy data, your
        job, four phases early.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-shape',
      caption:
        'Memorize this shape — you will see it weekly for the rest of your career: an ARRAY (the suite) of OBJECTS (one per test), each with a name, a boolean verdict, and a duration. Everything a dashboard shows is computed from a pile shaped exactly like this.',
      highlightLines: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'filter-failures',
      caption:
        'Question one: how many failed? runs.filter(r => !r.passed) — the gate function reads each object’s passed property and flips it with ! (lesson 2.x’s NOT, still earning). Objects pass through the gate WHOLE — failed is an array of the two complete failure records, not just names. And per 4.6: it holds arrows to the SAME objects, not copies.',
      highlightLines: [8, 9],
    },
    {
      id: 'chain-map',
      caption:
        'Question two: WHICH failed? Chain it: the array filter produced feeds straight into map, which plucks one property from each record — failed.map(r => r.name) → ["search", "pay"]. Read chains as a sentence: “keep the failures, then take their names.” Output of one link, input of the next.',
      highlightLines: [11, 12],
    },
    {
      id: 'reduce-time',
      caption:
        'Question three: how long was the whole suite? A fold across ALL runs: reduce((s, r) => s + r.ms, 0). The accumulator starts at 0 and grows lap by lap — 320, 1130, 1280, 2270. Note it reads r.ms: reducing works on any property of the objects flowing past.',
      highlightLines: [14, 15],
    },
    {
      id: 'dashboard',
      caption:
        '2 failed — search and pay — in a 2270 ms suite. Three questions, three one-liners, zero hand-written loops. In Phase 10 a real test runner will PRODUCE this data and in Phase 11 Playwright will produce it at scale; the crunching you just watched is already yours. Now build the two dashboard widgets below yourself.',
      highlightLines: [8, 11, 14],
    },
  ],
  Viz: DashboardBelt,
  underTheHood: (
    <>
      <p>
        The pattern you've just used has a name in data work: <strong>select → project →
        aggregate</strong>. filter selects the rows you care about, map projects each row down to
        the field you need, reduce aggregates many values into one. Every dashboard, every report,
        every analytics query in existence is some arrangement of those three verbs — SQL calls
        them WHERE, SELECT and SUM, spreadsheets call them filters and pivot tables.
      </p>
      <p>
        One reference-rules reminder while chaining (4.6 never sleeps): filter and map build new{' '}
        <em>arrays</em>, but the <em>objects inside</em> are the same ones — arrows. Mutating{' '}
        <code>failed[0].name</code> would change the original run in <code>runs</code>. Chains
        make new containers, never new contents.
      </p>
      <p>
        And a promise for later: in lesson 10.5, Vitest will print its own version of this exact
        dashboard after every run — red and green, counts and timings. You'll read it like an
        author, because you've now written one.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const rs = [\n  { ok: true, ms: 10 },\n  { ok: false, ms: 30 },\n  { ok: false, ms: 20 },\n];\nconsole.log(rs.filter(r => !r.ok).length);',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 'The gate keeps records whose ok is false — two of them. filter + length is THE failure counter.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const rs = [\n  { ms: 10 },\n  { ms: 30 },\n];\nconsole.log(rs.reduce((s, r) => s + r.ms, 5));',
      accept: ['45'],
      placeholder: 'type the console output…',
      why: 'Starting value 5, then (5,10)→15, (15,30)→45. Always read reduce’s second argument before predicting — it’s part of the answer.',
    },
    {
      kind: 'type-output',
      question: 'After this chain, what does top.name hold? Type it:',
      code: 'const rs = [\n  { name: "a", ms: 50 },\n  { name: "b", ms: 90 },\n];\nconst [top] = rs.sort((x, y) => y.ms - x.ms);',
      accept: ['b'],
      placeholder: 'a value…',
      why: 'y.ms - x.ms sorts DESCENDING (biggest first — 4.10’s comparator sign), and destructuring takes index 0: the record named "b" with 90 ms.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={PASSRATE_EXERCISE} />
      <CodeExercise def={SLOWEST_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'A project manager hands you an array of test-run objects and asks for “failure count, failing test names, and total runtime.” Explain — in plain words, method by method — how you’d compute all three without writing a single loop.',
    modelAnswer:
      'The data is an array of objects — one record per test with a name, a passed boolean, and a duration. Failure count: filter the array with a function that keeps records where passed is false, and take the resulting array’s length. Failing names: chain a map onto that filtered array to pluck each record’s name — filter selects the rows, map projects the field, so runs.filter(r => !r.passed).map(r => r.name). Total runtime: reduce across ALL runs with an accumulator starting at 0, adding each record’s ms per lap — the final accumulator is the suite time. Three questions, three expressions: select with filter, project with map, aggregate with reduce — the same select/project/aggregate pattern behind every dashboard and SQL query. And none of it mutates the original array — the chains build new containers around the same records.',
  },
  recap: [
    'Real test reports are arrays of objects: { name, passed, ms }. Every dashboard number is a chain over that shape.',
    'select → project → aggregate: filter picks rows, map plucks fields, reduce folds to one value. Read chains as sentences.',
    'Chains build new ARRAYS, but the objects inside are the same ones (arrows!) — mutate a chained record and the original changes.',
  ],
}
