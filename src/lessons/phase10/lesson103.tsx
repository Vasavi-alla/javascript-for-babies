import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 10.3 — Anatomy of a test
 * Demystify: a test is just a function that calls your function and checks.
 * Arrange–Act–Assert with precise roles; expected values come from THINKING
 * (never from running the code — the enshrined-bug trap); one behavior per
 * test; names as sentences; AAA scaling all the way to Playwright.
 */

const CODE = `// the machine under test
function withTax(price) {
  return price * 1.25;
}

// a TEST is just a function that checks it
function test_addsTax() {
  // Arrange — set the stage
  const price = 100;

  // Act — ONE call: the behavior
  const actual = withTax(price);

  // Assert — compare against expected
  const expected = 125;
  if (actual === expected) {
    console.log("PASS: adds 25% tax");
  } else {
    console.log("FAIL: got " + actual);
  }
}

test_addsTax();`

interface View {
  zone: 'none' | 'arrange' | 'act' | 'assert' | 'all'
  verdict?: 'pass' | 'fail' | null
  ghostExpected?: boolean
  twoTests?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    zone: 'none', console: [],
    note: 'no framework, no magic: a test is a FUNCTION that calls your function and checks the answer',
  },
  {
    zone: 'arrange', console: [],
    note: 'ARRANGE: build exactly the world the behavior needs — the inputs, and nothing more',
  },
  {
    zone: 'act', console: [],
    note: 'ACT: one call — THE behavior under test. The machine runs (3.2), the answer lands in actual',
  },
  {
    zone: 'assert', verdict: 'pass', console: ['PASS: adds 25% tax'],
    note: 'ASSERT: compare actual against expected, and say the verdict OUT LOUD',
  },
  {
    zone: 'assert', ghostExpected: true, console: ['PASS: adds 25% tax'],
    note: 'where did 125 come from? From THINKING: 100 × 1.25, worked out on paper — never from running the code',
    badge: 'the trap: run the code, see 126, write expect(126) — congratulations, today’s bug is now the law. Expected values come from the SPEC.',
  },
  {
    zone: 'all', verdict: 'pass', console: ['PASS: adds 25% tax'],
    note: 'the shape has a name: ARRANGE – ACT – ASSERT. Every test you ever read will be these three beats',
  },
  {
    zone: 'all', twoTests: true, console: ['PASS: adds 25% tax', 'PASS: zero price stays zero'],
    note: 'one BEHAVIOR per test: a failing test should BE the diagnosis, not the start of an investigation',
    badge: 'a test that asserts five things and fails tells you almost nothing; five tests that assert one thing each tell you everything',
  },
  {
    zone: 'all', twoTests: true, console: ['PASS: adds 25% tax', 'PASS: zero price stays zero'],
    note: 'names are sentences: “adds 25% tax” · “zero price stays zero” — the report reads as a SPEC',
  },
  {
    zone: 'all', twoTests: true, console: [],
    note: 'edges deserve their own tests: withTax(0) is a different QUESTION than withTax(100) — own name, own verdict',
  },
  {
    zone: 'all', console: [],
    note: 'this shape scales to the very end: in Playwright, arrange = navigate, act = click, assert = expect(locator)',
    badge: 'learn the three beats once — you’ll write them at every layer of 10.2’s pyramid for the rest of your career',
  },
]

function AAAMachine({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const zones = [
    { key: 'arrange', label: 'ARRANGE', sub: 'const price = 100', color: 'var(--color-pencil-blue)' },
    { key: 'act', label: 'ACT', sub: 'withTax(price)', color: 'var(--color-marker-teal)' },
    { key: 'assert', label: 'ASSERT', sub: 'actual === expected?', color: 'var(--color-marker-coral)' },
  ]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        one test, three beats
      </text>
      {zones.map((zone, i) => {
        const active = view.zone === zone.key || view.zone === 'all'
        return (
          <g key={zone.key} opacity={active ? 1 : 0.3}>
            <RoughRect x={30 + i * 132} y={44} width={120} height={78} seed={2901 + i} strokeWidth={active ? 2.6 : 1.6} stroke={zone.color} fill={`color-mix(in srgb, ${zone.color} ${active ? 12 : 4}%, transparent)`} fillStyle="solid" />
            <text x={90 + i * 132} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-ink)">{zone.label}</text>
            <text x={90 + i * 132} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">{zone.sub}</text>
            {i < 2 && <text x={152 + i * 132} y={88} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">→</text>}
          </g>
        )
      })}

      {view.ghostExpected && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={110} y={140} width={220} height={56} seed={2910} strokeWidth={2} stroke="var(--color-marker-coral)" roughness={2.2} fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
          <text x={220} y={162} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-marker-coral)">expected = 125</text>
          <text x={220} y={182} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">from the SPEC (100 × 1.25, on paper) — never from the code’s own output</text>
        </motion.g>
      )}

      {view.twoTests && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          {['adds 25% tax', 'zero price stays zero'].map((name, i) => (
            <g key={name}>
              <RoughRect x={70 + i * 160} y={144} width={140} height={40} seed={2915 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
              <text x={140 + i * 160} y={162} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">✓ {name}</text>
              <text x={140 + i * 160} y={177} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">one behavior each</text>
            </g>
          ))}
        </motion.g>
      )}

      {view.verdict && !view.twoTests && !view.ghostExpected && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
          <RoughRect x={160} y={148} width={120} height={36} seed={2920} strokeWidth={2.4} stroke={view.verdict === 'pass' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.verdict === 'pass' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 12%, transparent)`} fillStyle="solid" />
          <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
            {view.verdict === 'pass' ? 'PASS ✓' : 'FAIL ✗'}
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={230} width={392} fontSize={9.5} seed={2930} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={310} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const AAA_EXERCISE: CodeExerciseDef = {
  id: 'l103-first-tests',
  title: 'your first two tests, by hand',
  task: 'No framework yet — build the whole idea from raw materials: a check helper and two one-behavior tests for withTax. (10.5 gives you the professional version of exactly this.)',
  steps: [
    <>
      Write <code>withTax(price)</code> returning <code>price * 1.25</code> — the machine under
      test.
    </>,
    <>
      Write <code>check(name, actual, expected)</code>: print{' '}
      <code>PASS: name</code> when they match strictly, otherwise{' '}
      <code>FAIL: name — got actual</code>. One helper, reused by every test.
    </>,
    <>
      Test one — <code>adds 25% tax</code>: arrange a price of <code>100</code>, act with ONE
      call, assert against an expected you compute on paper (not by running!).
    </>,
    <>
      Test two — <code>zero price stays zero</code>: the edge case gets its own test, its own
      sentence-name, its own verdict.
    </>,
  ],
  starter: '',
  expectedOutput: ['PASS: adds 25% tax', 'PASS: zero price stays zero'],
  mustUse: [
    { test: /function\s+check\s*\(|const\s+check\s*=/, label: 'a reusable helper named check' },
    { test: /===|!==/, label: 'the assert compares strictly' },
    { test: /function\s+withTax\s*\(|const\s+withTax\s*=/, label: 'the machine under test, withTax' },
    { test: /check\s*\(\s*["']adds 25% tax["']/, label: 'test one is named "adds 25% tax"' },
    { test: /check\s*\(\s*["']zero price stays zero["']/, label: 'test two is named "zero price stays zero"' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']PASS: adds/, label: 'no hard-coded PASS lines — check must decide and build them' },
  ],
  modelAnswer: `function withTax(price) {
  return price * 1.25;
}

function check(name, actual, expected) {
  if (actual === expected) {
    console.log("PASS: " + name);
  } else {
    console.log("FAIL: " + name + " — got " + actual);
  }
}

// Arrange
const price = 100;
// Act
const actual = withTax(price);
// Assert (expected: 100 × 1.25 on paper = 125)
check("adds 25% tax", actual, 125);

check("zero price stays zero", withTax(0), 0);`,
}

export const lesson103: LessonDef = {
  id: '10.3',
  hook: (
    <>
      <p>
        Before any framework, the demystification:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a test is just a function that calls your function and checks the answer
        </HighlightMark>
        . Nothing more. Everything a test runner adds later — 10.5’s Vitest, Phase 11’s Playwright
        — is comfort around this one shape.
      </p>
      <p>
        The shape has three beats and a famous name: Arrange, Act, Assert. Learn it here on five
        lines of code, and you’ll recognize it in every test file you read for the rest of your
        career.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'a-test-is-code',
      caption:
        'Look at the whole pane and notice what ISN’T there: no framework, no import, no magic. test_addsTax is an ordinary function (Phase 3, verbatim) that calls withTax and checks the answer with an if (2.1). Whatever mystique “testing” had — that’s all of it.',
      highlightLines: [6, 7],
    },
    {
      id: 'arrange',
      caption:
        'Beat one — ARRANGE: set the stage. Build every input the behavior needs, and nothing more: here, one price. In bigger tests this beat creates users, fills carts, navigates pages — but its job never changes: a known starting world.',
      highlightLines: [8, 9],
    },
    {
      id: 'act',
      caption:
        'Beat two — ACT: exactly ONE call, the behavior under test. The machine runs (3.2’s picture) and the answer lands in a variable professionals conventionally name actual. One call, because this test is about one behavior — hold that thought.',
      highlightLines: [11, 12],
    },
    {
      id: 'assert',
      caption:
        'Beat three — ASSERT: compare actual against expected and announce the verdict. actual === expected (1.9’s strict comparer — no coercion surprises in a test, ever) → PASS. Anything else → FAIL, with the wrong value shown. A test that checks nothing is a rehearsal, not a test.',
      highlightLines: [14, 15, 16, 17, 18, 19],
    },
    {
      id: 'where-expected-comes-from',
      caption:
        'The most important line is the quietest: expected = 125. Where did 125 come from? From THINKING — 100 × 1.25 worked out on paper, from the spec. NEVER from running the code and copying its output. This rule is the soul of the whole discipline; break it and your tests defend nothing.',
      highlightLines: [14],
    },
    {
      id: 'aaa-named',
      caption:
        'The shape now has its name: ARRANGE – ACT – ASSERT. Say it once out loud — every test you will ever read, in any framework, in any language, is these three beats in this order. When a test file looks confusing, find the three beats and it stops being confusing.',
      highlightLines: [8, 11, 14],
    },
    {
      id: 'one-behavior',
      caption:
        'Rule two of the craft: ONE behavior per test. Why: when a test fails at 2am, its name should BE the diagnosis. A test asserting five things that fails tells you “something, somewhere”; five tests asserting one thing each tell you exactly what broke. Precision is the product.',
      highlightLines: [7],
    },
    {
      id: 'names-are-sentences',
      caption:
        'Rule three: names are SENTENCES about behavior — “adds 25% tax,” “zero price stays zero.” Read a good suite’s output top to bottom and you’ve read the specification of the machine. Bad names (“test1”, “works”) throw that entire second purchase from 10.1 in the bin.',
      highlightLines: [6],
    },
    {
      id: 'edges',
      caption:
        'And behaviors have EDGES: withTax(0) is a genuinely different question than withTax(100) — does zero stay zero, or did someone add a minimum fee? Different question → its own test, own name, own verdict. (Negative prices? Strings? Each a question. 10.1’s craft — choosing questions — starts here.)',
      highlightLines: [2, 3],
    },
    {
      id: 'aaa-scales',
      caption:
        'Last: this shape scales to the very end of your journey. A Playwright test is AAA wearing a browser: arrange = navigate and log in, act = click the button, assert = expect the locator. Learn three beats on five lines today; write them at every pyramid layer forever.',
      highlightLines: [8, 11, 14],
    },
  ],
  Viz: AAAMachine,
  underTheHood: (
    <>
      <p>
        The vocabulary you’ll meet in the wild: the function being tested is the{' '}
        <strong>SUT</strong> — system under test (here, withTax). Some teams write the three
        beats as <em>Given–When–Then</em> — the same anatomy with storytelling names. Recognize
        both.
      </p>
      <p>
        Why <em>one call</em> in Act, precisely: two acts in one test means the second runs
        against a world modified by the first. Its failures become ambiguous — did act two
        break, or did act one leave a mess? When a flow genuinely needs multiple steps, that’s
        an integration/E2E test doing flow-work on purpose. Even there: one flow per test.
      </p>
      <p>
        The enshrined-bug trap from the fifth step deserves its full horror story. A function
        rounds wrong. A hurried tester copies its output into expected. The suite goes green.
        From that day the suite actively DEFENDS the bug — anyone who fixes the rounding turns
        the suite red and gets told to “fix their mistake.” One copied expected value can outlive
        everyone who remembers why. Compute expected values from the spec. Always.
      </p>
      <p>
        <strong>💼 On the job —</strong> interviewers love handing you a function and saying
        “test this.” The professional move you now own: enumerate behaviors first (happy path,
        zero, negative, wrong type), then write one AAA test per behavior with sentence names.
        That enumeration step, done before any code, separates testers from typists.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The three beats of every test, in order — name them (comma-separated).',
      accept: ['Arrange, Act, Assert', 'arrange, act, assert', 'arrange act assert', 'Arrange Act Assert', 'arrange,act,assert'],
      placeholder: 'beat, beat, beat…',
      why: 'Arrange (set the stage) → Act (one call: the behavior) → Assert (compare actual vs expected, announce the verdict). Every test in every framework is these three beats.',
    },
    {
      kind: 'type-output',
      question: 'Your expected value should come from the spec worked out on paper — or from running the code and copying its output. Which one?',
      accept: ['the spec', 'spec', 'on paper', 'the spec worked out on paper', 'from the spec', 'thinking', 'from thinking'],
      placeholder: 'which source…',
      why: 'The spec, always. Copy the code’s own output and today’s bug becomes law — the suite will then DEFEND the bug against whoever tries to fix it.',
    },
    {
      kind: 'type-output',
      question: 'A single test asserts five different things and fails. Roughly how much does its failure tell you?',
      accept: ['almost nothing', 'nothing', 'very little', 'not much', 'little'],
      placeholder: 'how much…',
      why: '“Something, somewhere.” One behavior per test means a failure IS the diagnosis — five one-assert tests tell you exactly what broke, and their names read as a spec.',
    },
  ],
  PlayExtra: () => <CodeExercise def={AAA_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what a test literally is, walk the three beats with the withTax example, state where expected values must come from (and the horror story if not), and the one-behavior-per-test rule.',
    modelAnswer:
      'A test is just a function that calls your function and checks the answer — no framework required. It has three beats, always in order: Arrange sets the stage by building exactly the inputs the behavior needs (a price of 100); Act makes exactly one call — the behavior under test — and catches the answer in a variable called actual; Assert compares actual against expected with strict equality and announces PASS or FAIL out loud. The expected value must come from thinking — the spec, worked out on paper: 100 × 1.25 is 125 — and never from running the code and copying what it printed. Copy the output and you enshrine today’s bug as law: the suite goes green around the bug and then defends it — whoever later fixes the code turns the suite red and gets told they broke something. And each test covers ONE behavior with a sentence for a name — “adds 25% tax,” “zero price stays zero” — because a failing test’s name should be the diagnosis; a test asserting five things that fails only says “something, somewhere.” Edges like zero get their own tests because they’re genuinely different questions. The same three beats scale all the way up: a Playwright test is arrange-navigate, act-click, assert-expect.',
  },
  recap: [
    'A test = a function that calls your function and checks. Three beats, one name: ARRANGE (build the inputs) → ACT (one call — the behavior) → ASSERT (actual === expected, verdict out loud).',
    'Expected values come from the SPEC, on paper — never from the code’s own output. Copied output = today’s bug enshrined as law, defended by the suite forever.',
    'One behavior per test (a failure should BE the diagnosis) · names are sentences (the report reads as a spec) · edges get their own tests · AAA scales unchanged to Playwright: navigate / click / expect.',
  ],
}
