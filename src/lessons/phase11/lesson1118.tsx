import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.18 — Capstone: the full test suite
 * The real-world mission assembled from every lesson: scaffold → config →
 * POM structure → fixtures/auth → tagged smoke+regression → data-driven
 * rows → one mocked sad path → cross-browser projects → CI with published
 * report. Checklist board fills; GRADUATE stamp. The exercise is the whole
 * course in one program.
 */

const CODE = `// THE MISSION (a real repo, outside this app):
// target: the Phase 7 todo app + a demo shop
//
//  1  npm init playwright@latest        (11.2)
//  2  config: baseURL from env, retries (11.3)
//  3  pages/: TodoPage, CheckoutPage    (11.9)
//  4  fixtures: shopper via storageState(11.7/11)
//  5  specs: @smoke set + @regression   (11.13)
//  6  data-driven coupon table          (11.8)
//  7  one mocked sad path (500 banner)  (11.10)
//  8  projects: chromium + webkit       (11.12)
//  9  push → CI runs → report published (11.16)
// 10  a flake appears → clinic → fixed  (11.15)
//
// then: pin the repo. It IS your portfolio.`

interface Check {
  label: string
  done: boolean
}
interface View {
  checks: Check[]
  graduate?: boolean
  console: string[]
  note: string
  badge?: string
}

const ITEMS = ['scaffold + config', 'page objects', 'auth fixture (bottled)', 'smoke + regression tags', 'data-driven table', 'mocked sad path', 'cross-browser lanes', 'CI green + report live']

const checks = (n: number): Check[] => ITEMS.map((label, i) => ({ label, done: i < n }))

const VIEWS: View[] = [
  {
    checks: checks(0), console: [],
    note: 'the last checkpoint is the first day of the job: an empty repo, a target app, and everything you know',
  },
  {
    checks: checks(1), console: ['$ npm init playwright@latest', '$ git init && git commit -m "scaffold"'],
    note: 'foundation: 11.2’s scaffold in a REAL repo, config aimed by env with CI-aware retries (11.3). Commit early — the repo is the deliverable',
  },
  {
    checks: checks(2), console: [],
    note: 'structure before volume: pages/TodoPage.ts and pages/CheckoutPage.ts (11.9) — locators by role (11.4), verbs by user intention',
  },
  {
    checks: checks(3), console: ['setup project: logged in once → .auth/shopper.json'],
    note: 'the auth fixture: one bottled login (11.11) injected via test.use — every spec born logged in, isolation intact (11.7)',
  },
  {
    checks: checks(4), console: ['$ npx playwright test --grep @smoke → 6 passed (58s)'],
    note: 'the specs: a @smoke set proving the app breathes + @regression depth (11.13) — AAA shape (10.3), web-first assertions only (11.6)',
  },
  {
    checks: checks(5), console: ['✓ coupon SAVE10 → 900 · ✓ SAVE25 → 750 · ✓ EXPIRED → 1000'],
    note: 'the coupon table (11.8): one mold, three rows, edges at a line each — expected values from the spec, on paper (10.3, always)',
  },
  {
    checks: checks(6), console: ['route 500 → error banner visible ✓'],
    note: 'one mocked sad path (11.10): the 500 banner, tested deterministically — plus the unmocked journeys stay honest',
  },
  {
    checks: checks(7), console: ['✓ 24 passed [chromium] · ✓ 24 passed [webkit]'],
    note: 'two lanes (11.12): chromium + webkit — the Safari surprises get caught before users find them',
  },
  {
    checks: checks(8), console: ['push → CI: ✓ green · report → github pages'],
    note: 'the finish: push → the robot runs it all (11.16) → green check → report published at a URL anyone can open',
  },
  {
    checks: checks(8), console: ['⚠ cart total (flaky) → traced → shared state → unique data → stable'],
    note: 'and the graduation rite: a flake appears (it will) — clinic (11.15), trace (11.14), cause named, cured, zero tolerance held',
  },
  {
    checks: checks(8), graduate: true, console: [],
    note: 'pin the repo. Write the README with the report link. You are an automation tester — with evidence',
    badge: 'from console.log("hello") to a CI-guarded cross-browser suite: 115 lessons, one journey. Now go teach someone — you were built for it.',
  },
]

function GraduationBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the capstone board
      </text>
      {view.checks.map((check, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        return (
          <g key={check.label}>
            <RoughRect x={26 + col * 200} y={36 + row * 44} width={188} height={36} seed={5701 + i} strokeWidth={check.done ? 2 : 1.3} stroke={check.done ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={check.done ? 'color-mix(in srgb, var(--color-marker-teal) 9%, transparent)' : 'transparent'} fillStyle="solid" />
            <text x={40 + col * 200} y={58 + row * 44} fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={check.done ? 700 : 400} fill={check.done ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>
              {check.done ? '☑' : '☐'} {check.label}
            </text>
          </g>
        )
      })}
      {view.graduate && (
        <motion.g initial={{ opacity: 0, scale: 0.6, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ type: 'spring', damping: 12 }}>
          <RoughRect x={110} y={216} width={220} height={44} seed={5720} strokeWidth={3} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
          <text x={220} y={244} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fontWeight={700} fill="var(--color-marker-coral)">
            🎓 GRADUATE
          </text>
        </motion.g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={274} width={392} fontSize={9} seed={5730} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={302} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && !view.badge && (
        <text x={220} y={278} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const GRADUATION_EXERCISE: CodeExerciseDef = {
  id: 'l1118-graduation',
  title: 'the graduation run',
  task: 'One program, the whole course: a page object wrapping the app, a data table generating tagged tests, a grep’d smoke run, then the full suite with a counted summary and an exit code. Every line is a lesson you own.',
  steps: [
    <>
      Keep the starter’s <code>makeApp</code>. Build <code>class CheckoutPage</code> (11.9):
      constructor stores a fresh app; <code>applyCoupon(code)</code> delegates;{' '}
      <code>total()</code> reads.
    </>,
    <>
      The table (11.8): <code>cases</code> = SAVE10 → 900 (this row’s name ends with{' '}
      <code>@smoke</code>), SAVE25 → 750, EXPIRED → 1000. Generate tests with{' '}
      <code>makeTests(cases)</code>: each <code>{'{ name, run }'}</code>, name ={' '}
      <code>coupon CODE → TOTAL</code> (+ the tag where the row has one), run = a fresh
      CheckoutPage, apply, strict-compare (10.3’s beats in one arrow).
    </>,
    <>
      The runner (10.5): <code>runSuite(tests, grep)</code> — filter by grep when given (11.13),
      print <code>✓ name</code> per pass, count, and return the fail count.
    </>,
    <>
      The ceremony: print <code>smoke run:</code>, run with grep <code>"@smoke"</code>; print{' '}
      <code>full run:</code>, run all; print <code>N passed, M failed — exit CODE</code> from the
      counts (9.2, one last time); and if the exit code is 0, print <code>🎓 GRADUATE</code>.
    </>,
  ],
  starter: `// the app under test — keep as is:
function makeApp() {
  return {
    total: 1000,
    apply(code) {
      const discounts = { SAVE10: 100, SAVE25: 250 };
      this.total = this.total - (discounts[code] ?? 0);
    },
  };
}

// your graduation suite below:
`,
  expectedOutput: ['smoke run:', '✓ coupon SAVE10 → 900 @smoke', 'full run:', '✓ coupon SAVE10 → 900 @smoke', '✓ coupon SAVE25 → 750', '✓ coupon EXPIRED → 1000', '3 passed, 0 failed — exit 0', '🎓 GRADUATE'],
  mustUse: [
    { test: /class\s+CheckoutPage/, label: 'a page object (11.9)' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+/, label: 'the table generates tests (11.8)' },
    { test: /\.filter\s*\(/, label: 'grep filters the suite (11.13)' },
    { test: /\.includes\s*\(/, label: 'tags match with .includes' },
    { test: /===/, label: 'assertions compare strictly (10.4)' },
    { test: /exit/, label: 'the run ends with an exit code (9.2)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']3 passed, 0 failed/, label: 'no hard-coded summary — the runner counts' },
    { test: /console\.log\s*\(\s*["']✓ coupon SAVE10/, label: 'no hard-coded results — generate, grep, run' },
  ],
  modelAnswer: `// the app under test — keep as is:
function makeApp() {
  return {
    total: 1000,
    apply(code) {
      const discounts = { SAVE10: 100, SAVE25: 250 };
      this.total = this.total - (discounts[code] ?? 0);
    },
  };
}

// your graduation suite below:
class CheckoutPage {
  constructor(app) {
    this.app = app;
  }
  applyCoupon(code) {
    this.app.apply(code);
  }
  total() {
    return this.app.total;
  }
}

const cases = [
  { code: "SAVE10", total: 900, tag: " @smoke" },
  { code: "SAVE25", total: 750, tag: "" },
  { code: "EXPIRED", total: 1000, tag: "" },
];

function makeTests(cases) {
  const tests = [];
  for (const c of cases) {
    tests.push({
      name: \`coupon \${c.code} → \${c.total}\${c.tag}\`,
      run: () => {
        const checkout = new CheckoutPage(makeApp());
        checkout.applyCoupon(c.code);
        return checkout.total() === c.total;
      },
    });
  }
  return tests;
}

function runSuite(tests, grep) {
  const selected = grep ? tests.filter((t) => t.name.includes(grep)) : tests;
  let passed = 0;
  let failed = 0;
  for (const t of selected) {
    if (t.run()) {
      console.log("✓ " + t.name);
      passed = passed + 1;
    } else {
      console.log("✗ " + t.name);
      failed = failed + 1;
    }
  }
  return { passed: passed, failed: failed };
}

const tests = makeTests(cases);

console.log("smoke run:");
runSuite(tests, "@smoke");

console.log("full run:");
const result = runSuite(tests, null);
const exitCode = result.failed === 0 ? 0 : 1;
console.log(result.passed + " passed, " + result.failed + " failed — exit " + exitCode);
if (exitCode === 0) {
  console.log("🎓 GRADUATE");
}`,
}

export const lesson1118: LessonDef = {
  id: '11.18',
  hook: (
    <>
      <p>
        The last checkpoint isn’t a lesson — it’s{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the first day of the job, rehearsed: a real repo, a real target app, and a complete
          suite assembled from everything you own
        </HighlightMark>
        . POM structure, bottled auth, tagged sets, a data table, one mocked sad path, two browser
        lanes, and CI publishing the report. Then the graduation stamp — and what to do with it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-mission',
      caption:
        'The mission, plainly: build a REAL suite in a REAL repo (outside this app) against two targets — the todo app you built in 7.9, and a public demo shop. Nothing new is taught below; every box on the board is a lesson number you’ve completed. This is assembly, and assembly is the job.',
      highlightLines: [1, 2],
    },
    {
      id: 'foundation',
      caption:
        'Foundation first: npm init playwright@latest in a fresh repo (11.2), then make the config yours (11.3): baseURL from env with a localhost default, CI-aware retries, the artifacts trio. Commit immediately and often — this repo is the deliverable, and its history shows your process.',
      highlightLines: [4, 5],
    },
    {
      id: 'structure',
      caption:
        'Structure before volume (11.9): pages/TodoPage.ts and pages/CheckoutPage.ts — locators as properties chosen by the ladder (11.4: role first), actions as user verbs. Three specs don’t need this; the suite you’re building will, and starting structured is free.',
      highlightLines: [6],
    },
    {
      id: 'auth',
      caption:
        'Auth the professional way (11.11): a setup project logs in ONCE — credentials from env (9.4) — and bottles storageState to .auth/ (gitignored!). A shopper fixture (11.7) hands every spec the bottle. Every test born logged in; the login flow itself gets exactly one dedicated spec.',
      highlightLines: [7],
    },
    {
      id: 'the-specs',
      caption:
        'The specs: a @smoke set — the todo app breathes, the shop checks out — plus @regression depth (11.13). Every test AAA-shaped (10.3), sentence-named, asserting with web-first matchers only (11.6): no waitForTimeout will survive your own review.',
      highlightLines: [8],
    },
    {
      id: 'data-table',
      caption:
        'The data-driven centerpiece (11.8): the coupon table — three rows including the EXPIRED edge, names generated from data, expected totals computed on PAPER from the shop’s rules (10.3’s soul-rule, one last recitation: never from running the app).',
      highlightLines: [9],
    },
    {
      id: 'sad-path',
      caption:
        'One mocked sad path (11.10): route the products call to a 500 and assert the error banner — deterministic, server unharmed. And leave the main journeys UNMOCKED: the mix is the judgment (the pyramid is fractal), and your capstone should demonstrate judgment, not just features.',
      highlightLines: [10],
    },
    {
      id: 'lanes',
      caption:
        'Cross-browser (11.12): projects for chromium and webkit — the report now says “passed on both” or catches the Safari surprise before a user does. (Mobile emulation is one more array entry if the target app deserves it. Budget thinking applies even in a capstone.)',
      highlightLines: [11],
    },
    {
      id: 'ci',
      caption:
        'The finish line (11.16): push. The robot boots a fresh box, npm ci, installs browsers, runs both lanes with secrets injected, uploads the report if:always(), and stamps the pull request green. Publish the HTML report to GitHub Pages — a URL. Your suite now guards a repo and shows its evidence to anyone.',
      highlightLines: [12],
    },
    {
      id: 'the-flake-rite',
      caption:
        'And the graduation rite nobody skips: somewhere in this build, a test WILL flake. Good. Run it alone twenty times (11.15), read the failing trace (11.14’s five questions), name the cause from the clinic’s four, cure it, and note the fix in the README. Handling your first flake calmly IS the credential.',
      highlightLines: [13],
    },
    {
      id: 'graduate',
      caption:
        'Then: pin the repo. Write a README that links the published report and explains the structure in six lines. That repo answers every screening question this course prepared you for — with EVIDENCE. From console.log("hello") in 0.3 to this: you are an automation tester. Last ritual of the course: go teach somebody something from Phase 0. You’ll find you can. That was always the third goal.',
      highlightLines: [15],
    },
  ],
  Viz: GraduationBoard,
  underTheHood: (
    <>
      <p>
        Suggested repo shape, so the blank page never wins:{' '}
        <code>tests/smoke/</code>, <code>tests/regression/</code>, <code>pages/</code>,{' '}
        <code>fixtures.ts</code>, <code>.auth/</code> (gitignored), <code>playwright.config.ts</code>,{' '}
        <code>.github/workflows/</code>. Total scope that reads as professional: 20–30 tests.
        Small enough to polish, large enough to prove structure.
      </p>
      <p>
        Public demo targets that welcome practice suites exist for this (search
        “practice automation site” — several are maintained for testers). Your own 7.9 todo app
        is the better half of the capstone: YOU know its spec, so your expected values are
        honest.
      </p>
      <p>
        The README is worth an hour. State what it covers, how to run it (three commands), and
        the report link. One paragraph on structure decisions — why POM, why the mock/unmock
        split, how auth works — and the flake story. Interviewers read READMEs before code.
        It’s the teach-back principle (every lesson’s!) applied to your portfolio.
      </p>
      <p>
        And the map from here: this course made you job-ready for E2E automation. The adjacent
        territories, when you want them: deeper API testing, performance testing, running
        browsers in containers, other runners. All are built from concepts you now hold (HTTP,
        processes, CI, doubles). Nothing in this field will read as magic again. That was the
        whole point.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The capstone’s expected coupon totals come from where — running the shop, or the shop’s rules on paper?',
      accept: ['the rules on paper', 'on paper', 'the spec', 'the spec on paper', 'paper', 'the rules', 'from the spec'],
      placeholder: 'from…',
      why: '10.3’s soul-rule, final recitation: expected values come from the SPEC, worked out on paper. Copy the app’s output and the suite enshrines its bugs.',
    },
    {
      kind: 'type-output',
      question: 'What does “deploying” your capstone suite actually mean? (what gets published)',
      accept: ['the report', 'its verdicts and the report', 'the verdicts and report', 'the HTML report', 'verdicts + evidence', 'the report to a URL'],
      placeholder: 'what ships…',
      why: 'Its VERDICTS (the green/red gate on every change) and its EVIDENCE (the HTML report at a URL) — a suite ships judgment, not code (11.16).',
    },
    {
      kind: 'type-output',
      question: 'A test in your capstone flakes. Per the graduation rite, what’s the FIRST move?',
      accept: ['run it alone repeatedly', 'repeat-each', 'run it alone ×20', '--repeat-each=20', 'reproduce it — run alone 20 times', 'run it alone 20 times'],
      placeholder: 'first move…',
      why: 'Make it confess: run it ALONE ×20 (--repeat-each), then read the failing run’s trace and name the cause from the clinic’s four (11.15). Calm triage IS the credential.',
    },
  ],
  PlayExtra: () => <CodeExercise def={GRADUATION_EXERCISE} />,
  teachBack: {
    prompt:
      'The final teach-back: describe your capstone suite to an interviewer in one minute — structure, auth, test selection, data strategy, the mock/unmock split, browsers, CI — and end with the flake story.',
    modelAnswer:
      'It’s a Playwright suite in TypeScript against a todo app and a demo shop, structured with page objects — locators chosen role-first so redesigns don’t break them, user verbs as methods — and specs that read as user stories. Auth is bottled: a setup project logs in once with env-injected credentials and saves storageState, so every test starts logged in inside its own fresh context; the login flow itself has one dedicated spec. Tests are tagged: a smoke set proving the critical paths breathe runs on every push in about a minute, with the full regression set behind it. The coupon logic is data-driven — one test body, a table of cases including the expired-code edge, expected totals computed from the shop’s rules on paper. The network strategy is a deliberate mix: UI states like the server-error banner are tested against mocked 500s for determinism, while the main purchase journey stays unmocked to prove the real wiring. It runs on chromium and webkit via projects, and CI runs everything on every push — npm ci for exact dependencies, secrets from the vault, the HTML report uploaded even on failure and published to a URL. And when a test flaked mid-build, I ran it alone twenty times, read the failing trace, found a shared-state collision, switched to unique per-run data, and documented the fix in the README. The suite’s been stable since — and that story is in the repo’s history.',
  },
  recap: [
    'The capstone = assembly, and assembly is the job: scaffold+config → POM → bottled auth → @smoke/@regression → data table → one mocked sad path (+ honest unmocked journeys) → chromium+webkit → CI green with a PUBLISHED report.',
    'The graduation rite: your first flake, triaged calmly — alone ×20, trace, clinic, cure, README note. Handling it IS the credential interviewers probe for.',
    'Pin the repo; README with the report link (the teach-back principle, portfolio edition). From console.log("hello") to a CI-guarded cross-browser suite — you are an automation tester. Now go teach someone Phase 0: that was always the third goal.',
  ],
}
