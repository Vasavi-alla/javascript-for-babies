import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.8 — Test data & parameterized tests
 * Data-driven testing: one test body, a table of cases, for...of GENERATES
 * a test per row at collection time — names from data, edges one line
 * each. Unique-per-run data (the collision problem), data from env/files,
 * and the boundary: vary inputs of ONE behavior, don't dump behaviors in
 * a table.
 */

const CODE = `const cases = [
  { code: "SAVE10",  total: 900 },
  { code: "SAVE25",  total: 750 },
  { code: "EXPIRED", total: 1000 },  // edge: 1 line
];

for (const c of cases) {
  test(\`coupon \${c.code} → \${c.total}\`,
    async ({ page }) => {
      await page.goto("/checkout");
      await page.getByLabel("Coupon").fill(c.code);
      await page.getByRole("button", { name: "Apply" })
        .click();
      await expect(page.getByTestId("total"))
        .toHaveText(String(c.total));
  });
}

// unique data per run — no collisions:
const email = \`ada+\${Date.now()}@shop.com\`;`

interface View {
  mode: 'copies' | 'belt' | 'unique' | 'boundary'
  stamped?: number
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'copies', console: [],
    note: 'the smell: three coupons = three nearly-identical copy-pasted tests. Fix a step in one, forget the other two — drift',
  },
  {
    mode: 'belt', stamped: 0, console: [],
    note: 'the cure: ONE test body + a TABLE of cases. The for...of runs at load time, GENERATING a test per row',
  },
  {
    mode: 'belt', stamped: 3, console: ['coupon SAVE10 → 900', 'coupon SAVE25 → 750', 'coupon EXPIRED → 1000'],
    note: 'the runner sees THREE separate tests — each reported, retried, and failed independently. Not one test looping: three tests',
    badge: 'the loop runs during collection (10.5’s find phase), before any browser opens — it manufactures test definitions, not actions',
  },
  {
    mode: 'belt', stamped: 3, console: [],
    note: 'names come FROM the data: `coupon ${c.code} → ${c.total}` — 10.3’s sentence rule, scaling automatically',
  },
  {
    mode: 'belt', stamped: 3, console: [],
    note: 'and 10.3’s one-behavior rule STILL holds: the table varies INPUTS of one behavior — apply-a-coupon — never the behavior itself',
  },
  {
    mode: 'belt', stamped: 3, console: [],
    note: 'edges become CHEAP: the EXPIRED row costs one line. Enumerate questions like 10.3 taught — pay a row per question',
    badge: 'zero-quantity, max-length, wrong-type, expired — the whole 10.3 edge checklist, at a line each. Cheap edges get tested; expensive ones get skipped.',
  },
  {
    mode: 'unique', console: ['run 1: ada+1720180800000@shop.com ✓', 'run 2: ada+1720180860000@shop.com ✓'],
    note: 'the collision problem: a test that CREATES a user fails on re-run — “email already exists.” Cure: unique-per-run data',
  },
  {
    mode: 'unique', console: [],
    note: 'ada+${Date.now()}@shop.com — the +suffix trick (mail ignores it) with a timestamp: every run, a fresh identity',
    badge: 'randomness in ASSERTIONS is flakiness (11.15) — but randomness in CREATED IDENTITIES is hygiene. Know the difference.',
  },
  {
    mode: 'boundary', console: [],
    note: 'where tables come from, in the wild: inline arrays (this lesson) · JSON files (readFile + JSON.parse — 9.5 + 4.13) · env for small config (9.4)',
  },
  {
    mode: 'boundary', console: [],
    note: 'the boundary: a table parameterizes ONE behavior. Different BEHAVIORS still get their own tests — a table is not a dumping ground',
  },
]

function DataBelt({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'copies' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            three copies, drifting apart
          </text>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <RoughRect x={50 + i * 10} y={44 + i * 56} width={320} height={46} seed={4701 + i} strokeWidth={1.8} stroke="var(--color-marker-coral)" roughness={1.8} fill="color-mix(in srgb, var(--color-marker-coral) 5%, transparent)" fillStyle="solid" />
              <text x={70 + i * 10} y={64 + i * 56} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">test("coupon {['SAVE10', 'SAVE25', 'EXPIRED'][i]}…") {'{'}</text>
              <text x={70 + i * 10} y={80 + i * 56} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">  …the same 5 lines, copy-pasted…</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'belt' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            one mold, a belt of data rows
          </text>
          <RoughRect x={40} y={44} width={130} height={110} seed={4710} strokeWidth={2.4} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 7%, transparent)" fillStyle="solid" />
          <text x={105} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">the mold</text>
          <text x={105} y={92} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">one test body</text>
          <text x={105} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">fill(c.code)</text>
          <text x={105} y={128} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">expect(c.total)</text>
          {['SAVE10', 'SAVE25', 'EXPIRED'].map((code, i) => {
            const stamped = (view.stamped ?? 0) > i
            return (
              <motion.g key={code} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <RoughRect x={200} y={44 + i * 40} width={90} height={32} seed={4715 + i} strokeWidth={1.6} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
                <text x={245} y={64 + i * 40} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">{code}</text>
                {stamped && (
                  <g>
                    <text x={302} y={64 + i * 40} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">→</text>
                    <RoughRect x={318} y={44 + i * 40} width={100} height={32} seed={4720 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
                    <text x={368} y={64 + i * 40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={7.5} fill="var(--color-ink)">a real TEST ✓</text>
                  </g>
                )}
              </motion.g>
            )
          })}
        </g>
      )}

      {view.mode === 'unique' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the collision problem, cured
          </text>
          <RoughRect x={50} y={44} width={340} height={44} seed={4730} strokeWidth={1.8} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
          <text x={220} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">fixed email "ada@shop.com" → run 2: already exists ✗</text>
          <text x={220} y={78} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-marker-coral)">a test that passes once, then never again</text>
          <RoughRect x={50} y={110} width={340} height={44} seed={4731} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={220} y={128} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{'ada+${Date.now()}@shop.com'} → fresh identity every run ✓</text>
          <text x={220} y={144} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">the +suffix trick: mail servers ignore it, databases don’t</text>
        </g>
      )}

      {view.mode === 'boundary' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the boundary: inputs vary, the behavior doesn’t
          </text>
          <RoughRect x={40} y={48} width={175} height={120} seed={4740} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={127} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">a good table ✓</text>
          <text x={127} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">SAVE10 → 900</text>
          <text x={127} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">SAVE25 → 750</text>
          <text x={127} y={130} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">EXPIRED → 1000</text>
          <text x={127} y={152} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">one behavior, many inputs</text>
          <RoughRect x={225} y={48} width={175} height={120} seed={4741} strokeWidth={2} stroke="var(--color-marker-coral)" roughness={2} fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
          <text x={312} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">a dumping ground ✗</text>
          <text x={312} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">apply coupon…</text>
          <text x={312} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">delete account…</text>
          <text x={312} y={130} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">check the footer…</text>
          <text x={312} y={152} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">three behaviors in a trench coat</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4750} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const DATA_EXERCISE: CodeExerciseDef = {
  id: 'l118-test-generator',
  title: 'build the test generator',
  task: 'The starter ships the machine under test. Build the data-driven suite: a table of cases, a generator that manufactures one named test per row, and a runner that reports each independently (10.5’s runner, meeting 11.8’s table).',
  steps: [
    <>
      Keep the starter’s <code>applyCoupon</code>. Create <code>cases</code>: the three rows —{' '}
      <code>SAVE10 → 900</code>, <code>SAVE25 → 750</code>, <code>EXPIRED → 1000</code> (objects
      with <code>code</code> and <code>total</code>).
    </>,
    <>
      Write <code>makeTests(cases)</code>: for each row, produce{' '}
      <code>{'{ name, run }'}</code> — the name built from the data as{' '}
      <code>coupon CODE → TOTAL</code> (template literal), the run a function returning whether{' '}
      <code>applyCoupon(1000, code)</code> strictly equals the row’s total.
    </>,
    <>
      Run them all: print <code>✓ name</code> per passing test, then the summary{' '}
      <code>3 passed</code> — counted, not typed.
    </>,
  ],
  starter: `// the machine under test — keep as is:
function applyCoupon(total, code) {
  const discounts = { SAVE10: 100, SAVE25: 250 };
  return total - (discounts[code] ?? 0);
}

// your data-driven suite below:
`,
  expectedOutput: ['✓ coupon SAVE10 → 900', '✓ coupon SAVE25 → 750', '✓ coupon EXPIRED → 1000', '3 passed'],
  mustUse: [
    { test: /function\s+makeTests\s*\(|const\s+makeTests\s*=/, label: 'a generator named makeTests' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+/, label: 'rows are walked with for...of' },
    { test: /`coupon \$\{/, label: 'test names are built FROM the data (template literal)' },
    { test: /===/, label: 'each run compares strictly' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']✓ coupon SAVE10/, label: 'no hard-coded report lines — generate, then run' },
    { test: /console\.log\s*\(\s*["']3 passed["']\s*\)/, label: 'no hard-coded summary — count the passes' },
  ],
  modelAnswer: `// the machine under test — keep as is:
function applyCoupon(total, code) {
  const discounts = { SAVE10: 100, SAVE25: 250 };
  return total - (discounts[code] ?? 0);
}

// your data-driven suite below:
const cases = [
  { code: "SAVE10", total: 900 },
  { code: "SAVE25", total: 750 },
  { code: "EXPIRED", total: 1000 },
];

function makeTests(cases) {
  const tests = [];
  for (const c of cases) {
    tests.push({
      name: \`coupon \${c.code} → \${c.total}\`,
      run: () => applyCoupon(1000, c.code) === c.total,
    });
  }
  return tests;
}

let passed = 0;
for (const t of makeTests(cases)) {
  if (t.run()) {
    console.log("✓ " + t.name);
    passed = passed + 1;
  } else {
    console.log("✗ " + t.name);
  }
}
console.log(passed + " passed");`,
}

export const lesson118: LessonDef = {
  id: '11.8',
  hook: (
    <>
      <p>
        Three coupon codes to test. The beginner writes three nearly identical tests; six months
        later they’ve drifted apart and one is lying. The professional writes{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          ONE test body and a TABLE of cases — a loop that manufactures a real, independent test
          per row
        </HighlightMark>
        . Data-driven testing: how suites scale without rotting, plus the unique-data trick that
        keeps created things from colliding.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-smell',
      caption:
        'The smell first: three coupons, three copy-pasted tests, five identical lines each. Now the checkout flow gains a step — you fix two copies and forget the third. Copy-paste drift is 10.1’s regression story happening INSIDE the suite: the guards themselves rot.',
      highlightLines: [1, 2, 3, 4],
    },
    {
      id: 'the-table',
      caption:
        'The cure: separate the DATA from the SHAPE. cases is a plain array of objects (4.x) — each row one scenario: the input code, the expected total (from the spec, on paper — 10.3’s soul-rule applies to tables too!).',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'the-generator',
      caption:
        'Then the trick that makes it real: the for...of runs at LOAD time — while the runner is collecting tests (10.5’s find phase), before any browser opens. Each lap calls test(…), MANUFACTURING a test definition. The runner sees three genuine, separate tests — not one test looping.',
      highlightLines: [7, 8, 9],
    },
    {
      id: 'independent-tests',
      caption:
        'Separate tests matter operationally: each row is reported independently (you see WHICH coupon broke), retried independently (11.15), and traced independently (11.14). A loop INSIDE one test would give you “coupon test failed, somewhere” — 10.3’s five-asserts problem, resurrected.',
      highlightLines: [8],
    },
    {
      id: 'names-from-data',
      caption:
        'The names come FROM the data: the template literal builds “coupon SAVE10 → 900”, “coupon EXPIRED → 1000” — 10.3’s names-as-sentences rule, scaling automatically. The report reads as the spec table it came from.',
      highlightLines: [8],
    },
    {
      id: 'edges-cheap',
      caption:
        'And look what happened to EDGES: the EXPIRED row costs ONE line. Zero-quantity? A row. Max-length code? A row. 10.3 taught you to enumerate the questions; the table makes each question cost a line — and questions that are cheap to ask actually GET asked.',
      highlightLines: [4],
    },
    {
      id: 'one-behavior-still',
      caption:
        'The boundary that keeps tables honest: a table parameterizes INPUTS of ONE behavior — apply-a-coupon, three ways. It is NOT a dumping ground for different behaviors (apply coupon / delete account / check footer in one table = three behaviors in a trench coat). 10.3’s one-behavior rule survives parameterization intact.',
      highlightLines: [7, 8],
    },
    {
      id: 'collision-problem',
      caption:
        'Second topic, from the trenches: tests that CREATE things. Register user ada@shop.com — passes. Run the suite again: “email already exists” — red, forever. The test collided with its own past self (and with parallel workers running beside it — 11.15).',
      highlightLines: [19, 20],
    },
    {
      id: 'unique-data',
      caption:
        'The cure: unique-per-run identities. ada+${Date.now()}@shop.com — the +suffix trick (mail delivery ignores everything after +; databases don’t) with a timestamp. Every run, a fresh user; no collisions with the past or with parallel neighbors. Note the discipline: randomness in created IDENTITIES is hygiene; randomness in ASSERTIONS is flakiness.',
      highlightLines: [19, 20],
    },
    {
      id: 'where-tables-live',
      caption:
        'Where tables come from as suites grow: inline arrays (today — right for a handful of rows), JSON files loaded with 9.5’s readFile + 4.13’s JSON.parse (right for big matrices the QA team edits), and env vars for small per-environment config (9.4). Same shape at every scale: data separate, mold reused.',
      highlightLines: [1, 7],
    },
  ],
  Viz: DataBelt,
  underTheHood: (
    <>
      <p>
        Why generation-at-collection works: the spec file is a MODULE (8.1) that the runner
        imports before running anything. Top-level code — including your for...of — executes
        during that import, and each <code>test(…)</code> call registers a definition. By the
        time browsers launch, the suite is a fixed list. (This also means the table must be
        available synchronously at load — reading it from a file is fine; fetching it from a
        server mid-collection is not.)
      </p>
      <p>
        For truly unique data under parallel workers, timestamps can theoretically collide
        (two workers, same millisecond). Real suites often add the worker index (
        <code>testInfo.workerIndex</code>) or a random suffix. The principle stays: identity =
        run-unique; expectations = deterministic.
      </p>
      <p>
        You may meet “property-based testing” in reading — generating RANDOM inputs to hunt edge
        cases. Powerful for pure functions; used sparingly in E2E where determinism is king. Know
        the term; reach for tables first.
      </p>
      <p>
        Job note: the interview question here is “how would you test 50 coupon codes?” — the
        answer that signals experience is the table (with named rows and a one-line edge policy),
        NOT “I’d write 50 tests” and NOT “I’d loop inside one test.” You now know why both wrong
        answers are wrong, which is worth more than the right one.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A for...of over 3 cases calls test() each lap. How many tests does the runner see — one or three?',
      accept: ['three', '3', 'Three', 'three tests', '3 tests'],
      placeholder: 'one / three…',
      why: 'Three — the loop runs at collection time and MANUFACTURES a test definition per row. Each is reported, retried, and traced independently; a loop inside one test would lose all of that.',
    },
    {
      kind: 'type-output',
      question: 'A test registers a new user with a fixed email. It passed yesterday. What happens on today’s run?',
      accept: ['it fails', 'fails', 'fail', 'already exists error', 'it collides', 'red — already exists'],
      placeholder: 'what happens…',
      why: 'It fails — “email already exists”: the test collides with its own past. Unique-per-run data (ada+Date.now()@…) gives every run a fresh identity.',
    },
    {
      kind: 'type-output',
      question: 'One table holds rows for “apply coupon”, “delete account”, and “check footer”. What rule does it break?',
      accept: ['one behavior per test', 'one behavior', 'the one-behavior rule', 'one behaviour per test', 'tables parameterize one behavior'],
      placeholder: 'the rule…',
      why: 'One behavior per table — parameterize INPUTS of a single behavior. Three different behaviors in one table is 10.3’s rule broken with extra steps: a dumping ground in a trench coat.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DATA_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain data-driven testing to a friend: the copy-paste smell, how the generation loop actually works (when it runs, what the runner sees), what happens to names and edges, the one-behavior boundary, and the unique-data trick.',
    modelAnswer:
      'When three coupon codes need testing, copy-pasting three nearly identical tests plants drift: fix a step in one copy, forget the others, and the guards themselves rot. Data-driven testing separates data from shape: a plain array of case objects — input and expected result, the expectations still computed from the spec on paper — and ONE test body as the mold. The for...of loop runs at collection time, while the runner is importing the spec file before any browser opens, and each lap calls test(), manufacturing a genuine test definition. The runner therefore sees three separate tests — each reported, retried, and traced independently — not one test looping, which would collapse back into “failed, somewhere.” Names are built from the data with a template literal, so the report reads like the spec table; and edges become one line each — the EXPIRED row costs a single row, so the questions worth asking actually get asked. The boundary: a table parameterizes inputs of ONE behavior; different behaviors still get their own tests. Separately, tests that CREATE things need unique-per-run data: a fixed email collides with the test’s own past run (“already exists”), so you build identities like ada+Date.now()@shop.com — the plus-suffix trick with a timestamp. Randomness in created identities is hygiene; randomness in assertions is flakiness.',
  },
  recap: [
    'Copy-paste tests drift (regression inside the suite). Data-driven: a TABLE of cases + one mold; for...of at COLLECTION time manufactures a real test per row — independently reported/retried/traced.',
    'Names from data (sentence rule scales) · edges cost one row each (cheap questions get asked) · boundary: a table varies inputs of ONE behavior, never mixes behaviors.',
    'Created things need unique-per-run identities: ada+${Date.now()}@… (+suffix trick). Identity = run-unique; expectations = deterministic. Bigger tables live in JSON files (9.5 + 4.13); small config in env (9.4).',
  ],
}
