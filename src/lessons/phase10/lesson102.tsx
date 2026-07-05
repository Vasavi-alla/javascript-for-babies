import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 10.2 — The testing pyramid
 * Three layers defined precisely (unit / integration+API / E2E) with real
 * speed math, confidence-vs-cost tradeoffs, why the PYRAMID shape wins, the
 * ice-cream-cone anti-pattern, and where Playwright sits. Pays off 9.7's
 * pyramid flag.
 */

const CODE = `// the SAME feature, asked at 3 layers
// (a checkout that applies a coupon)

// UNIT — one machine, isolated (~5ms)
expect(applyCoupon(1000, "SAVE10"))
  .toBe(900);

// API — pieces wired, no browser (~300ms)
const res = await request.post("/api/checkout",
  { data: { total: 1000, coupon: "SAVE10" } });
expect(res.status()).toBe(200);

// E2E — whole system, real browser (~8s)
await page.fill("#coupon", "SAVE10");
await page.click("text=Apply");
await expect(page.locator(".total"))
  .toHaveText("₹900");`

interface View {
  mode: 'pyramid' | 'cone'
  litLayers: number[]
  counts?: [number, number, number]
  meterMs?: string | null
  playwrightTag?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'pyramid', litLayers: [], console: [],
    note: 'one feature, three possible questions — at three very different prices',
  },
  {
    mode: 'pyramid', litLayers: [0], counts: [0, 0, 0], meterMs: '~5ms each', console: [],
    note: 'UNIT: one machine, fully isolated — no disk, no network, no browser. Milliseconds. A failure points AT the function',
  },
  {
    mode: 'pyramid', litLayers: [1], meterMs: '~300ms each', console: [],
    note: 'API / INTEGRATION: a few pieces wired together, still no browser — 9.7’s checks live here',
  },
  {
    mode: 'pyramid', litLayers: [2], meterMs: '~8s each', console: [],
    note: 'E2E (end-to-end): the WHOLE system through a real browser — the only layer that sees what a user sees',
  },
  {
    mode: 'pyramid', litLayers: [0, 1, 2], console: [],
    note: 'the speed math is brutal: 500 unit tests ≈ 3 seconds · 500 E2E tests ≈ over an hour',
    badge: 'a suite too slow to run on every change stops being run — and an unrun suite catches nothing (10.1’s whole point, lost)',
  },
  {
    mode: 'pyramid', litLayers: [0, 1, 2], console: [],
    note: 'confidence trades the other way: a unit failure PINPOINTS; only E2E proves the wiring a user actually touches',
  },
  {
    mode: 'pyramid', litLayers: [0, 1, 2], counts: [50, 12, 4], console: [],
    note: 'hence the SHAPE: many cheap pinpointing tests at the base, a few precious whole-system tests on top',
  },
  {
    mode: 'cone', litLayers: [0, 1, 2], counts: [3, 5, 40], console: [],
    note: 'the anti-pattern: the ICE-CREAM CONE — everything E2E. Hours per run, flaky, soon abandoned',
    badge: 'teams fall into it honestly: E2E tests are the easiest to IMAGINE (“click what the user clicks”) — and the most expensive to own',
  },
  {
    mode: 'pyramid', litLayers: [1, 2], counts: [50, 12, 4], playwrightTag: true, console: [],
    note: 'where your tool sits: Playwright OWNS the top (browser E2E) and serves the middle (its request helper, 9.7)',
  },
  {
    mode: 'pyramid', litLayers: [0, 1, 2], counts: [50, 12, 4], console: [],
    note: 'the skill: ask each question at the CHEAPEST layer that can answer it — coupon math is a unit question, not a browser question',
  },
]

const LAYERS = [
  { label: 'UNIT — functions in isolation', w: 340, color: 'var(--color-marker-teal)' },
  { label: 'API / INTEGRATION — pieces wired', w: 240, color: 'var(--color-pencil-blue)' },
  { label: 'E2E — real browser', w: 140, color: 'var(--color-marker-coral)' },
]

function PyramidMeter({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const cone = view.mode === 'cone'
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        {cone ? 'the ice-cream cone (do not build this)' : 'the testing pyramid'}
      </text>
      {LAYERS.map((layer, i) => {
        const lit = view.litLayers.includes(i)
        const w = cone ? [140, 240, 340][i] : layer.w
        const y = 176 - i * 62
        const count = view.counts?.[i]
        return (
          <g key={layer.label} opacity={lit ? 1 : 0.3}>
            <RoughRect x={220 - w / 2} y={y} width={w} height={52} seed={2801 + i} strokeWidth={lit ? 2.4 : 1.6} stroke={layer.color} fill={`color-mix(in srgb, ${layer.color} ${lit ? 12 : 5}%, transparent)`} fillStyle="solid" />
            <text x={220} y={y + 24} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">{layer.label}</text>
            <text x={220} y={y + 42} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
              {typeof count === 'number' ? `${count} tests` : ['~5ms each', '~300ms each', '~8s each'][i]}
            </text>
            {view.playwrightTag && i > 0 && (
              <text x={220 + w / 2 + 8} y={y + 32} fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-marker-coral)">
                ← Playwright
              </text>
            )}
          </g>
        )
      })}
      {view.meterMs && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={320} y={40} width={94} height={30} seed={2810} strokeWidth={1.8} stroke="var(--color-ink)" fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={367} y={60} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{view.meterMs}</text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={256} width={392} fontSize={9.5} seed={2820} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>
    </svg>
  )
}

const PLANNER_EXERCISE: CodeExerciseDef = {
  id: 'l102-suite-planner',
  title: 'the suite health check',
  task: 'You inherit a test plan. Compute its shape and its runtime — and let the numbers, not opinions, say whether it’s a pyramid or a cone.',
  steps: [
    <>
      Create <code>plan</code>: an array of 9 test objects —{' '}
      <code>{'{ name: "…", layer: "unit" }'}</code> × 6, <code>layer: "api"</code> × 2, and{' '}
      <code>layer: "e2e"</code> × 1 (names are yours to invent).
    </>,
    <>
      Count each layer with a reusable <code>countLayer(plan, layer)</code> (4.9’s filter +
      length) and print the shape line: <code>6 unit · 2 api · 1 e2e</code> (a template literal
      builds it).
    </>,
    <>
      Compute the total runtime in milliseconds — unit tests cost <code>5</code>, api{' '}
      <code>300</code>, e2e <code>8000</code> — and print it as <code>8630ms</code>.
    </>,
    <>
      Print the verdict: <code>healthy pyramid</code> when unit tests outnumber e2e tests,{' '}
      <code>ice-cream cone</code> otherwise.
    </>,
  ],
  starter: '',
  expectedOutput: ['6 unit · 2 api · 1 e2e', '8630ms', 'healthy pyramid'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'layer counts come from .filter' },
    { test: /function\s+countLayer\s*\(|const\s+countLayer\s*=/, label: 'a reusable function named countLayer' },
    { test: /`/, label: 'the shape line is a template literal' },
    { test: /\*\s*5|5\s*\*/, label: 'runtime is computed from the per-layer costs' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']8630ms["']\s*\)/, label: 'no hard-coded runtime — multiply and add' },
    { test: /console\.log\s*\(\s*["']6 unit/, label: 'no hard-coded shape line — count and build it' },
  ],
  modelAnswer: `const plan = [
  { name: "coupon math", layer: "unit" },
  { name: "tax math", layer: "unit" },
  { name: "empty cart", layer: "unit" },
  { name: "rounding", layer: "unit" },
  { name: "max discount", layer: "unit" },
  { name: "invalid code", layer: "unit" },
  { name: "checkout endpoint", layer: "api" },
  { name: "coupon endpoint", layer: "api" },
  { name: "full purchase flow", layer: "e2e" },
];

function countLayer(plan, layer) {
  return plan.filter((t) => t.layer === layer).length;
}

const unit = countLayer(plan, "unit");
const api = countLayer(plan, "api");
const e2e = countLayer(plan, "e2e");

console.log(\`\${unit} unit · \${api} api · \${e2e} e2e\`);

const totalMs = unit * 5 + api * 300 + e2e * 8000;
console.log(totalMs + "ms");

console.log(unit > e2e ? "healthy pyramid" : "ice-cream cone");`,
}

export const lesson102: LessonDef = {
  id: '10.2',
  hook: (
    <>
      <p>
        9.7 planted a flag: “the testing pyramid — lesson 10.2.” Time to pay it. The idea:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the same feature can be tested at three layers — and the layers differ in speed by a
          factor of a THOUSAND
        </HighlightMark>
        . Choosing the layer is therefore not a detail; it decides whether your suite runs in
        seconds (and gets run) or hours (and gets abandoned).
      </p>
      <p>
        Three layers, real numbers, one famous shape — and the anti-pattern that eats teams
        alive.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'one-feature-three-questions',
      caption:
        'The code pane shows ONE feature — a checkout coupon — asked about at three layers. Same behavior under test, three completely different price tags. Read all three blocks once before we zoom in.',
      highlightLines: [1, 2],
    },
    {
      id: 'unit',
      caption:
        'Layer one, UNIT: test one machine in complete isolation — applyCoupon is a pure function (3.9’s word: same input, same output, touches nothing). No disk, no network, no browser. Cost: ~5 milliseconds. And when it fails, the failure POINTS AT the function — diagnosis included.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'api-integration',
      caption:
        'Layer two, API / INTEGRATION: several pieces wired together — the checkout endpoint really parses the request, really applies the coupon, really answers JSON. Still no browser. Cost: ~300ms. This is exactly where 9.7’s API checks live, and where its flag pointed.',
      highlightLines: [8, 9, 10, 11],
    },
    {
      id: 'e2e',
      caption:
        'Layer three, E2E — end-to-end: the WHOLE system through a real browser. A robot fills the coupon field, clicks Apply, reads the total off the screen — the only layer that sees what a USER sees, including the wiring between UI and logic. Cost: ~8 seconds per test. Every second is honest work: browsers are heavy.',
      highlightLines: [13, 14, 15, 16, 17],
    },
    {
      id: 'speed-math',
      caption:
        'Now the brutal arithmetic. 500 unit tests × 5ms ≈ 3 seconds — you run that on every save. 500 E2E tests × 8s ≈ 67 MINUTES — nobody runs that on every save. And 10.1 taught what an unrun suite is worth: nothing. Speed isn’t a luxury; it decides whether the suite exists in practice.',
      highlightLines: [4, 13],
    },
    {
      id: 'confidence-trade',
      caption:
        'But confidence trades the other way. A unit test failing pinpoints the exact broken function — and yet all units passing can’t promise the app works: the wiring between them might be broken (10.1’s cart!). Only E2E proves the path a user actually walks. Cheap-and-precise versus costly-and-complete.',
      highlightLines: [5, 16, 17],
    },
    {
      id: 'the-shape',
      caption:
        'Both truths at once give the famous SHAPE: MANY cheap, pinpointing unit tests at the base — they catch most regressions in milliseconds. A MIDDLE band of API tests for the wiring. A FEW precious E2E tests on top for the critical user journeys. That’s the testing pyramid — not a diagram, a budget.',
      highlightLines: [4, 8, 13],
    },
    {
      id: 'ice-cream-cone',
      caption:
        'Flip it and you get the anti-pattern with the best name in testing: the ICE-CREAM CONE — a huge scoop of E2E on top, almost nothing beneath. Runs take hours, failures point nowhere (“something in checkout, somewhere”), flakiness multiplies, and the team quietly stops running it. Now they have zero suites and think they have one.',
      highlightLines: [13, 14, 15],
    },
    {
      id: 'where-playwright-sits',
      caption:
        'Where your tool lives on this map: Playwright OWNS the top layer — driving real browsers is its whole reason to exist — and serves the middle too, via the request helper you met in 9.7. Phase 11 teaches the top of the pyramid; today you learned why that top must stay small.',
      highlightLines: [8, 13],
    },
    {
      id: 'the-skill',
      caption:
        'The skill this lesson leaves you with, in one sentence: ask every question at the CHEAPEST layer that can answer it. “Is the coupon math right?” is a unit question — 5ms, not 8 seconds. “Can a user actually apply a coupon?” is the E2E question worth its price. Spend like a professional.',
      highlightLines: [4, 5, 13, 14],
    },
  ],
  Viz: PyramidMeter,
  underTheHood: (
    <>
      <p>
        The boundary between “unit” and “integration” is genuinely fuzzy and teams argue about it
        for sport — is a function plus its real helper two units or one integration? Don’t get
        stuck: the load-bearing distinction is <strong>touches the outside world or not</strong>{' '}
        (network, disk, browser, clock). Inside-only = fast lane; outside-touching = slow lane.
        10.6’s test doubles exist precisely to move tests INTO the fast lane.
      </p>
      <p>
        Real numbers behind the estimates: a browser E2E test pays for launching a browser
        context, loading a page, network round-trips (6.7), rendering (7.8), and auto-waiting
        pauses (11.6 will formalize them). None of that is waste — it’s exactly WHY it proves so
        much — but it can’t be made free, only paralleled (11.15).
      </p>
      <p>
        The pyramid has respectable critics — you’ll meet the “testing trophy” (which fattens the
        integration band, arguing modern tools made it cheap). The disagreement is about the
        middle band’s size; NOBODY credible argues for the cone. Both camps agree on this
        lesson’s core: many fast tests below, few browser tests above.
      </p>
      <p>
        Job note: “where would you test this?” is a beloved interview question. The winning shape
        of an answer is the one from the last step — name the layer, justify by cost and by what
        failure at that layer would tell you. You just practiced it three times.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: '“Is the coupon math correct for 1000 minus 10%?” — which layer should ask this: unit, api, or e2e?',
      accept: ['unit', 'Unit', 'UNIT', 'unit test', 'the unit layer'],
      placeholder: 'layer…',
      why: 'Pure math in one function = a unit question: ~5ms, and a failure points at the exact function. Never spend 8 browser-seconds on a 5ms question.',
    },
    {
      kind: 'type-output',
      question: 'A suite with 40 E2E tests and 3 unit tests has a famous nickname. What is it?',
      accept: ['ice-cream cone', 'ice cream cone', 'the ice-cream cone', 'the ice cream cone', 'icecream cone'],
      placeholder: 'the nickname…',
      why: 'The ice-cream cone — the inverted pyramid. Hours per run, failures that point nowhere, growing flakiness, and eventually a suite nobody runs.',
    },
    {
      kind: 'type-output',
      question: '500 unit tests at ~5ms each — roughly how many SECONDS is the whole run? (nearest whole number)',
      accept: ['3', '2.5', '2', 'about 3', '~3'],
      placeholder: 'seconds…',
      why: '500 × 5ms = 2500ms ≈ 3 seconds — fast enough to run on every save. The same 500 tests as E2E would take over an hour. That factor is the pyramid’s entire argument.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PLANNER_EXERCISE} />,
  teachBack: {
    prompt:
      'Draw the pyramid for a friend: define the three layers precisely, give the speed math that justifies the shape, explain what the ice-cream cone is and why teams fall into it, and say where Playwright sits.',
    modelAnswer:
      'The pyramid has three layers, defined by how much of the system a test touches. Unit tests exercise one function in complete isolation — no disk, network, or browser — so they run in about five milliseconds and a failure points at the exact function. API or integration tests wire a few real pieces together, like posting to a checkout endpoint and asserting on the JSON — a few hundred milliseconds, still no browser. E2E tests drive the whole system through a real browser, filling fields and reading the screen — the only layer that proves what a user actually experiences, at several seconds per test. The speed math justifies the shape: 500 unit tests finish in about 3 seconds, while 500 E2E tests take over an hour — and a suite too slow to run on every change stops being run, which makes it worthless. So: many cheap pinpointing tests at the base, a band of API tests for the wiring, a few precious E2E tests for the critical journeys. The inverted version is the ice-cream cone — everything E2E — which teams fall into because E2E tests are the easiest to imagine (“click what the user clicks”) and the costliest to own: hours-long flaky runs that get abandoned. Playwright owns the top layer (real browsers are its purpose) and serves the middle with its request helper. The governing skill: ask every question at the cheapest layer that can answer it.',
  },
  recap: [
    'Three layers by how much system a test touches: UNIT (one isolated function, ~5ms, failure pinpoints) · API/INTEGRATION (pieces wired, ~300ms, no browser — 9.7 lives here) · E2E (whole system in a real browser, ~seconds, proves the user’s path).',
    'The shape is a budget: 500 unit ≈ 3s vs 500 E2E ≈ an hour — and an unrun suite catches nothing. Many cheap below, few precious above. The inverse (ice-cream cone) dies of slowness and flakiness.',
    'Playwright owns the top and serves the middle (request). Governing skill: ask each question at the CHEAPEST layer that can answer it — coupon math is a unit question; “can a user buy?” is worth browser-seconds.',
  ],
}
