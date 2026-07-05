import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 10.5 — Vitest hands-on
 * The runner as a converging point of Phases 8–9: an npm devDependency, a
 * Node program, found-by-convention test files, describe/it/expect, red
 * output decoded line by line (9.2's traces), exit codes (CI contract),
 * watch mode. Exercise: BUILD the mini-runner with try/catch (5.8).
 */

const CODE = `// tax.test.js — the .test. marks it
import { describe, it, expect } from "vitest";
import { withTax } from "./tax.js";

describe("withTax", () => {
  it("adds 25% tax", () => {
    expect(withTax(100)).toBe(125);
  });

  it("keeps zero at zero", () => {
    expect(withTax(0)).toBe(0);
  });
});

// $ npm run test
//   ✓ withTax > adds 25% tax
//   ✗ withTax > keeps zero at zero
//     Expected: 0 · Received: 1
//     at tax.test.js:11:26
// Tests  1 passed | 1 failed`

interface RunnerLine {
  text: string
  kind: 'cmd' | 'pass' | 'fail' | 'detail' | 'summary'
  hot?: boolean
}
interface View {
  lines: RunnerLine[]
  exitChip?: '0' | '1' | null
  watchBanner?: boolean
  console: string[]
  note: string
  badge?: string
}

const GREEN_RUN: RunnerLine[] = [
  { text: '$ npm run test', kind: 'cmd' },
  { text: '✓ withTax > adds 25% tax', kind: 'pass' },
  { text: '✓ withTax > keeps zero at zero', kind: 'pass' },
  { text: 'Tests  2 passed (2)', kind: 'summary' },
]
const RED_RUN: RunnerLine[] = [
  { text: '$ npm run test', kind: 'cmd' },
  { text: '✓ withTax > adds 25% tax', kind: 'pass' },
  { text: '✗ withTax > keeps zero at zero', kind: 'fail' },
  { text: '  Expected: 0', kind: 'detail' },
  { text: '  Received: 1', kind: 'detail' },
  { text: '  at tax.test.js:11:26', kind: 'detail' },
  { text: 'Tests  1 passed | 1 failed', kind: 'summary' },
]

const VIEWS: View[] = [
  {
    lines: [], console: [],
    note: 'a test RUNNER is a Node program (9.1) from npm (8.2) whose whole job is: find tests, run them, report',
  },
  {
    lines: [{ text: '$ npm install -D vitest', kind: 'cmd' }, { text: 'added 1 package', kind: 'detail' }], console: [],
    note: 'installed as a devDependency (8.2: a workshop tool — the shipped app never runs its own tests)',
  },
  {
    lines: [{ text: 'tax.js          ← the machine', kind: 'detail' }, { text: 'tax.test.js     ← its tests', kind: 'pass' }], console: [],
    note: 'the convention: name a file *.test.js and the runner FINDS it — no registration, no list to maintain',
  },
  {
    lines: [], console: [],
    note: 'describe(name, …) groups one machine’s tests; it(sentence, fn) = ONE behavior — 10.3’s rules, now enforced by shape',
  },
  {
    lines: GREEN_RUN, exitChip: '0', console: [],
    note: 'npm run test: the runner finds every .test. file, runs each it in isolation, prints a ✓ per behavior',
  },
  {
    lines: RED_RUN.map((l, i) => (i === 2 ? { ...l, hot: true } : l)), console: [],
    note: 'now the important skill — seed a bug (withTax returns +1) and READ the red, top to bottom',
  },
  {
    lines: RED_RUN.map((l, i) => (i === 3 || i === 4 ? { ...l, hot: true } : l)), console: [],
    note: 'Expected 0, Received 1 — the assertion speaks 10.4’s language: what the spec said vs what the code did',
  },
  {
    lines: RED_RUN.map((l, i) => (i === 5 ? { ...l, hot: true } : l)), console: [],
    note: 'and the address: tax.test.js:11:26 — 9.2’s stack-trace reading pays off, pointing at YOUR expect line',
  },
  {
    lines: RED_RUN, exitChip: '1', console: [],
    note: 'invisibly, the run exited 1 — 9.2’s contract: this exact number is what turns CI red',
    badge: 'green suite → exit 0 → pipeline proceeds · any failure → exit 1 → the release stops. No human in the loop.',
  },
  {
    lines: GREEN_RUN, exitChip: '0', watchBanner: true, console: [],
    note: 'watch mode: vitest stays alive and re-runs on every SAVE — the tightest feedback loop in the trade',
    badge: 'the 8.3 edit-run-read-delete loop, fully automated: save a file, see red or green before your hand leaves the keyboard',
  },
  {
    lines: GREEN_RUN, exitChip: '0', console: [],
    note: 'file away: Playwright’s runner speaks this same grammar — test/expect, ✓/✗, exit codes. Learn once, use twice',
  },
]

function TestRunnerPane({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <RoughRect x={20} y={22} width={400} height={196} seed={3101} strokeWidth={2.2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
      <text x={220} y={16} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
        the runner’s report
      </text>
      {view.lines.length === 0 && (
        <text x={220} y={120} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
          (nothing run yet — step through)
        </text>
      )}
      {view.lines.map((line, i) => (
        <g key={i}>
          {line.hot && <RoughRect x={28} y={36 + i * 24} width={340} height={22} seed={3105 + i} strokeWidth={1.5} stroke="var(--color-marker-yellow)" fill="color-mix(in srgb, var(--color-marker-yellow) 22%, transparent)" fillStyle="solid" />}
          <text x={36} y={52 + i * 24} fontFamily="var(--font-code)" fontSize={10} fill={
            line.kind === 'cmd' ? 'var(--color-marker-teal)'
            : line.kind === 'pass' ? 'var(--color-marker-teal)'
            : line.kind === 'fail' ? 'var(--color-marker-coral)'
            : line.kind === 'summary' ? 'var(--color-ink)'
            : 'var(--color-ink-soft)'
          } fontWeight={line.kind === 'summary' ? 700 : 400}>
            {line.text}
          </text>
        </g>
      ))}
      {view.exitChip && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
          <RoughRect x={358} y={30} width={54} height={30} seed={3120} strokeWidth={2.2} stroke={view.exitChip === '0' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.exitChip === '0' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 12%, transparent)`} fillStyle="solid" />
          <text x={385} y={50} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
            {view.exitChip === '0' ? '→ 0' : '→ 1'}
          </text>
        </motion.g>
      )}
      {view.watchBanner && (
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={28} y={182} width={384} height={28} seed={3121} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
          <text x={220} y={201} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
            WATCH  waiting for file changes… (save = instant re-run)
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={3130} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>
    </svg>
  )
}

const RUNNER_EXERCISE: CodeExerciseDef = {
  id: 'l105-mini-runner',
  title: 'build the runner itself',
  task: 'The starter ships a throwing assert (5.8!) and a deliberately sick withTax. Do NOT fix the bug — your job is the RUNNER: run every test, survive the failures, report the truth, hand back the exit code.',
  steps: [
    <>
      Keep the starter as is. Build <code>tests</code>: an array of two objects, each{' '}
      <code>{'{ name, fn }'}</code> — <code>"adds 25% tax"</code> asserting{' '}
      <code>withTax(100)</code> is <code>125</code>, and <code>"keeps zero at zero"</code>{' '}
      asserting <code>withTax(0)</code> is <code>0</code>.
    </>,
    <>
      The runner: loop the tests (for...of); call each <code>fn()</code> inside try/catch (5.8)
      — a throw means FAIL, print <code>✗ name — message</code> (the error object carries the
      message); no throw means PASS, print <code>✓ name</code>. Count both.
    </>,
    <>
      After the loop, print the summary <code>1 passed, 1 failed</code> (from your counters),
      then <code>exit code: 1</code> — computed from the fail count, 9.2’s contract.
    </>,
  ],
  starter: `// a tiny assert that THROWS on mismatch (5.8):
function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error("expected " + expected + ", got " + actual);
  }
}

// the machine under test — SICK ON PURPOSE. Don't fix it:
function withTax(price) {
  return price * 1.35;
}

// your runner below:
`,
  expectedOutput: ['✗ adds 25% tax — expected 125, got 135', '✓ keeps zero at zero', '1 passed, 1 failed', 'exit code: 1'],
  mustUse: [
    { test: /try\s*\{/, label: 'the runner survives failures with try' },
    { test: /catch\s*\(\s*\w+\s*\)/, label: '…and catch' },
    { test: /\.message/, label: 'the failure line uses the error’s .message' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+tests\s*\)/, label: 'a for...of loop over tests' },
    { test: /assertEqual\s*\(/, label: 'the tests assert through assertEqual' },
  ],
  mustNotUse: [
    { test: /1\.25/, label: 'don’t fix the bug — the runner’s job is to REPORT it honestly' },
    { test: /console\.log\s*\(\s*["']1 passed, 1 failed["']\s*\)/, label: 'no hard-coded summary — count in the loop' },
  ],
  modelAnswer: `// a tiny assert that THROWS on mismatch (5.8):
function assertEqual(actual, expected) {
  if (actual !== expected) {
    throw new Error("expected " + expected + ", got " + actual);
  }
}

// the machine under test — SICK ON PURPOSE. Don't fix it:
function withTax(price) {
  return price * 1.35;
}

// your runner below:
const tests = [
  { name: "adds 25% tax", fn: () => assertEqual(withTax(100), 125) },
  { name: "keeps zero at zero", fn: () => assertEqual(withTax(0), 0) },
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  try {
    test.fn();
    console.log("✓ " + test.name);
    passed = passed + 1;
  } catch (err) {
    console.log("✗ " + test.name + " — " + err.message);
    failed = failed + 1;
  }
}

console.log(passed + " passed, " + failed + " failed");
console.log("exit code: " + (failed === 0 ? 0 : 1));`,
}

export const lesson105: LessonDef = {
  id: '10.5',
  hook: (
    <>
      <p>
        You’ve been hand-rolling PASS/FAIL prints. Time to meet the professional version:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Vitest — a test runner: a Node program whose entire job is to find your tests, run them
          in isolation, and report red or green
        </HighlightMark>
        . Watch how many of your Phase 8–9 lessons converge on this one tool: it arrives via npm,
        lives in devDependencies, runs on Node, and reports through exit codes.
      </p>
      <p>
        And in the exercise you’ll build the runner itself — ten lines, thanks to 5.8 — so it
        never feels like magic.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'what-a-runner-is',
      caption:
        'Definition first: a test RUNNER is a program that finds test files, executes every test in them (keeping tests isolated from each other), and reports results — human-readable ✓/✗ for you, an exit code for machines. Vitest is one; Playwright ships another. The concept is identical.',
      highlightLines: [1],
    },
    {
      id: 'install',
      caption:
        'It arrives exactly the way 8.2 taught: npm install -D vitest — the -D marking it a devDependency, a workshop tool the shipped app never needs. Then one script in package.json ("test": "vitest") and npm run test means something.',
      highlightLines: [2],
    },
    {
      id: 'file-convention',
      caption:
        'How does it FIND tests? Pure convention: any file named *.test.js (tax.test.js, next to tax.js). No registration, no central list — name the file right and it’s in the suite. Convention over configuration; you’ll meet this philosophy everywhere.',
      highlightLines: [1],
    },
    {
      id: 'describe-it',
      caption:
        'The vocabulary, imported as named imports (8.1) from the vitest package: describe(name, fn) groups one machine’s tests; it(sentence, fn) holds ONE behavior — 10.3’s one-behavior rule and sentence-names, now enforced by the shape of the API. expect is 10.4, unchanged.',
      highlightLines: [2, 5, 6, 10],
    },
    {
      id: 'run-green',
      caption:
        'npm run test: the runner finds every .test. file, runs each it, prints a ✓ per behavior with its full sentence — “withTax > adds 25% tax” — and a summary. Green across the board. Notice the report reads like a spec: 10.3’s naming rule, paying rent.',
      highlightLines: [15, 16, 17],
    },
    {
      id: 'seed-a-bug',
      caption:
        'Now the skill that matters: reading RED. Seed a bug — make withTax return price * 1.25 + 1 — and run again. One test still passes (interesting in itself!), one turns red. Never fear a red run; it’s the suite doing its job. Read it top to bottom.',
      highlightLines: [16, 17],
    },
    {
      id: 'read-expected-received',
      caption:
        'The failure block speaks 10.4’s language: Expected: 0 (what the spec said) versus Received: 1 (what the code did). That pair is the whole diagnosis for a wrong-value bug — and it’s why 10.4 said precise matchers write your 2am documentation.',
      highlightLines: [18],
    },
    {
      id: 'read-the-address',
      caption:
        'Below it, an address: at tax.test.js:11:26 — file, line, column. 9.2’s stack-trace reading pays off verbatim: that’s YOUR expect line, one click away in any editor. Category, message, location — the same anatomy since 0.5, wearing a test report.',
      highlightLines: [19],
    },
    {
      id: 'exit-code',
      caption:
        'And invisibly, the run left 9.2’s number behind: exit code 1. This single number is the entire handshake with CI (8.2): green suite → 0 → the pipeline proceeds; any failure → 1 → the release stops. Your hand-rolled runner in the exercise will honor the same contract.',
      highlightLines: [20],
    },
    {
      id: 'watch-mode',
      caption:
        'The daily-driver feature: WATCH MODE. Run vitest without arguments and it stays alive, watching files — every save triggers an instant re-run of affected tests. Change code, glance at the terminal, see green or red before your hand leaves the keyboard. 8.3’s slow log-loop, fully automated.',
      highlightLines: [15],
    },
    {
      id: 'grammar-transfers',
      caption:
        'File away for Phase 11: Playwright’s runner speaks this exact grammar — test(sentence, fn), expect, ✓/✗ reports, exit codes, even watch-like UI mode. Today you learned every test runner you’ll ever meet; the next one just drives browsers between the beats.',
      highlightLines: [2, 5],
    },
  ],
  Viz: TestRunnerPane,
  underTheHood: (
    <>
      <p>
        Why “Vitest”? It’s built on Vite — the same build tool running THIS app — which is where
        its speed comes from: tests re-run in milliseconds because Vite only re-processes what
        changed. Its API is deliberately compatible with Jest (the older, most famous runner), so
        Jest tutorials mostly apply verbatim: <code>it</code> and <code>test</code> are literally
        aliases.
      </p>
      <p>
        “Runs each test in isolation” is a real promise with machinery behind it: each test file
        gets a fresh module environment, and hooks like <code>beforeEach</code> reset shared
        state between tests — so test 3 can’t be poisoned by test 2’s leftovers. (Phase 11’s
        fixtures are this idea, upgraded to whole browser contexts.)
      </p>
      <p>
        The full report vocabulary you’ll meet: <strong>skipped</strong> (
        <code>it.skip</code> — deliberately off), <strong>todo</strong> (a named intention with
        no body yet), and <code>it.only</code> — run JUST this one while debugging. The
        <code>.only</code> left in by accident is a classic disaster (the suite silently shrinks
        to one test and everything “passes”); 11.13 shows the CI guard against it.
      </p>
      <p>
        Job note: in interviews, “walk me through what happens when you run npm test” is a
        systems question in disguise. You can now answer it end to end: npm resolves the script
        (8.2) → Node launches the runner (9.1) → it globs for .test. files → runs each it,
        catching assertion throws (5.8, as your exercise proves) → prints ✓/✗ + summary → exits
        0 or 1 → CI reads the number (9.2). Thirteen lessons in one sentence.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'How does Vitest know which files contain tests?',
      accept: ['the .test. in the filename', 'file naming convention', 'naming convention', 'the filename', 'files named .test.js', '*.test.js', 'the .test. suffix', 'convention'],
      placeholder: 'how…',
      why: 'Pure naming convention: *.test.js (or .spec.). No registration, no list — name the file right and the runner finds it.',
    },
    {
      kind: 'type-output',
      question: 'A suite finishes with 1 failed test. What exit code does the runner hand back?',
      accept: ['1', 'non-zero', 'nonzero', '1 (non-zero)'],
      placeholder: 'the number…',
      why: 'Non-zero (1) — 9.2’s contract. That single number is what turns CI red; a fully green suite exits 0 and the pipeline proceeds.',
    },
    {
      kind: 'type-output',
      question: 'Which feature re-runs your tests automatically every time you save a file?',
      accept: ['watch mode', 'watch', 'Watch mode', 'watch-mode'],
      placeholder: 'feature name…',
      why: 'Watch mode — the runner stays alive and re-runs affected tests on every save. The tightest feedback loop in the trade: red or green before your hand leaves the keyboard.',
    },
  ],
  PlayExtra: () => <CodeExercise def={RUNNER_EXERCISE} />,
  teachBack: {
    prompt:
      'Walk a friend through “what actually happens when I run npm run test” — from npm to the exit code — and then explain how the runner survives a failing test without stopping (your exercise knows).',
    modelAnswer:
      'npm run test looks up the "test" script in package.json (that’s 8.2) and launches Vitest — a Node program installed as a devDependency. The runner finds tests by naming convention: any file ending .test.js is in the suite, no registration needed. Inside those files, describe groups one machine’s tests and each it holds one behavior with a sentence name; expect provides the assertions. The runner executes every it in isolation and prints the report: a ✓ with the full sentence per passing test, and for failures a block that reads top to bottom as the diagnosis — the test’s name, Expected versus Received (the spec’s answer versus the code’s), and an address like tax.test.js:11:26 pointing at the exact expect line, the same file:line:column anatomy as any stack trace. Then the summary, and invisibly, the exit code: 0 if everything passed, 1 if anything failed — the single number CI reads to turn the pipeline green or red. The runner survives failures because assertions THROW on mismatch, and it wraps every test in try/catch: a throw is caught, recorded as a fail, and the loop simply continues to the next test — I built exactly that in ten lines. And day to day you keep watch mode running: every save re-runs affected tests instantly.',
  },
  recap: [
    'A runner = find tests (by *.test.js convention) → run each it in isolation → report (✓/✗ + Expected/Received + file:line:column) → exit 0/1. Vitest arrives via npm -D; one script wires npm run test.',
    'describe = one machine’s group · it(sentence, fn) = one behavior — 10.3’s rules enforced by API shape. Reading red is a skill: name → Expected vs Received → the address (9.2’s anatomy).',
    'The runner survives failures because asserts THROW and it try/catches each test (5.8 — you built it). Exit code feeds CI; watch mode re-runs on save; Playwright’s runner speaks the same grammar.',
  ],
}
