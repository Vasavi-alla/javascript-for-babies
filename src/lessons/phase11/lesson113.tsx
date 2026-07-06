import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.3 — The config, decoded
 * 8.6's detective format, third outing: playwright.config.ts line by line.
 * The two nested timeouts, CI-conditional retries/workers (9.4 in the
 * wild), reporter, the use{} defaults block (baseURL from env, the
 * artifacts trio). Nothing in the file stays mysterious.
 */

const CODE = `import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL
             ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});`

interface Sticky {
  label: string
  color: string
}
interface View {
  stickies: Sticky[]
  budgets?: boolean
  console: string[]
  note: string
  badge?: string
}

const TEAL = 'var(--color-marker-teal)'
const BLUE = 'var(--color-pencil-blue)'
const CORAL = 'var(--color-marker-coral)'

const S1: Sticky = { label: 'testDir → where the runner globs for *.spec', color: TEAL }
const S2: Sticky = { label: 'timeout 30s → per-TEST budget', color: CORAL }
const S3: Sticky = { label: 'expect.timeout 5s → per-ASSERTION retry budget', color: CORAL }
const S4: Sticky = { label: 'fullyParallel → files AND tests in parallel', color: BLUE }
const S5: Sticky = { label: 'forbidOnly on CI → the .only guard', color: BLUE }
const S6: Sticky = { label: 'retries: CI 2 · local 0 — raw truth at the desk', color: TEAL }
const S7: Sticky = { label: 'workers: CI 1 · local auto', color: BLUE }
const S8: Sticky = { label: 'reporter: html → 11.2’s report', color: TEAL }
const S9: Sticky = { label: 'use{} → defaults handed to EVERY test', color: CORAL }
const S10: Sticky = { label: 'baseURL from env ?? localhost (9.4!)', color: TEAL }
const S11: Sticky = { label: 'trace/screenshot/video → evidence policies', color: BLUE }

const VIEWS: View[] = [
  {
    stickies: [], console: [],
    note: 'third case for the detective method: 8.6 read package.json, 11.16 will read the CI file — today, the config',
  },
  {
    stickies: [], console: [],
    note: 'the frame: export default (8.1) hands the runner ONE object; defineConfig is a helper that gives it 8.5’s autocomplete',
  },
  {
    stickies: [S1], console: [],
    note: 'testDir: "./tests" — aims 10.5’s find-by-convention: the runner globs for spec files under this folder only',
  },
  {
    stickies: [S1, S2], budgets: true, console: [],
    note: 'timeout: 30_000 — the per-TEST budget: a test still running at 30s is killed and failed as timed out',
  },
  {
    stickies: [S1, S2, S3], budgets: true, console: [],
    note: 'expect: { timeout: 5_000 } — the OTHER budget: how long ONE web-first assertion may retry (11.6). Nested inside the first',
    badge: 'the 30_000 spelling: numeric underscores — pure readability, the number is 30000. Two budgets: the assertion’s clock ticks inside the test’s clock.',
  },
  {
    stickies: [S1, S2, S3, S4, S5], console: [],
    note: 'fullyParallel: run everything concurrently (11.15) · forbidOnly on CI: a committed .only FAILS the build (10.5’s disaster, guarded)',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6], console: [],
    note: 'retries — read the 9.4 pattern: process.env.CI ? 2 : 0. On CI, failures re-run twice; locally, zero',
    badge: 'why the split: at your desk you want RAW TRUTH (a flake must look flaky); CI wants signal over cosmic-ray noise. 11.15 debates the tradeoff fully.',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6, S7], console: [],
    note: 'workers — same pattern: 1 on CI (deterministic on a shared box), undefined locally = auto (~half your cores)',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6, S7, S8], console: [],
    note: 'reporter: "html" — which report gets built (11.2’s show-report). Others exist: "list" for terminals, "junit" for CI dashboards',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10], console: [],
    note: 'the use{} block: DEFAULTS handed to every test. baseURL = 9.4 delivered: env-aimed, ?? localhost — page.goto("/") now means “the target”',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11], console: [],
    note: 'the artifacts trio — evidence POLICIES: trace on-first-retry · screenshot only-on-failure · video retain-on-failure (into test-results/, 9.5)',
    badge: 'why not trace: "on" always? Traces cost time and disk. Record evidence when something is WRONG — 11.14 teaches you to read it.',
  },
  {
    stickies: [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11], console: [],
    note: 'case closed: every line has a job you can name. The config is the suite’s CONTRACT — and you now read any project’s cold',
  },
]

function ConfigCaseBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        the config case board
      </text>
      {view.stickies.length === 0 && !view.budgets && (
        <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
          (step through — every line becomes a sticky)
        </text>
      )}
      {view.stickies.map((sticky, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        return (
          <motion.g key={sticky.label} initial={{ opacity: 0, y: -8, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: col === 0 ? -1 : 1 }} transition={{ type: 'spring', damping: 15 }}>
            <RoughRect x={26 + col * 200} y={34 + row * 34} width={188} height={28} seed={4201 + i} strokeWidth={1.6} stroke={sticky.color} fill={`color-mix(in srgb, ${sticky.color} 8%, transparent)`} fillStyle="solid" />
            <text x={120 + col * 200} y={52 + row * 34} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={7.8} fontWeight={700} fill="var(--color-ink)">{sticky.label}</text>
          </motion.g>
        )
      })}
      {view.budgets && view.stickies.length <= 3 && (
        <g>
          <RoughRect x={70} y={150} width={300} height={80} seed={4230} strokeWidth={2.2} stroke={CORAL} fill="color-mix(in srgb, var(--color-marker-coral) 5%, transparent)" fillStyle="solid" />
          <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">test budget: 30s</text>
          <RoughRect x={110} y={182} width={140} height={36} seed={4231} strokeWidth={1.8} stroke={BLUE} fill="color-mix(in srgb, var(--color-pencil-blue) 8%, transparent)" fillStyle="solid" />
          <text x={180} y={204} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">one assertion: ≤5s</text>
          <text x={300} y={204} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">← ticks inside</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={254} width={392} fontSize={9.5} seed={4240} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>
    </svg>
  )
}

const CONFIG_EXERCISE: CodeExerciseDef = {
  id: 'l113-config-resolver',
  title: 'the config resolver',
  task: 'The config asks the environment two questions (9.4’s plumbing). Build the resolver that answers them, and print the effective settings for a local run and a CI run.',
  steps: [
    <>
      Write <code>resolveRetries(env)</code>: <code>2</code> when <code>env.CI</code> is set,{' '}
      <code>0</code> otherwise (a ternary reads best).
    </>,
    <>
      Write <code>resolveBaseURL(env)</code>: <code>env.BASE_URL</code> with the honest default{' '}
      <code>"http://localhost:3000"</code> (8.4’s operator, exactly as the real config uses it).
    </>,
    <>
      Print one line per world with a template literal:{' '}
      <code>local: 0 retries → http://localhost:3000</code> for an empty env, and{' '}
      <code>ci: 2 retries → https://staging.shop.com</code> for{' '}
      <code>{'{ CI: "true", BASE_URL: "https://staging.shop.com" }'}</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['local: 0 retries → http://localhost:3000', 'ci: 2 retries → https://staging.shop.com'],
  mustUse: [
    { test: /\?\?/, label: 'the baseURL default arrives via ??' },
    { test: /\?[^?]+:/, label: 'retries resolve with a ternary' },
    { test: /function\s+resolveRetries|const\s+resolveRetries\s*=/, label: 'a function named resolveRetries' },
    { test: /function\s+resolveBaseURL|const\s+resolveBaseURL\s*=/, label: 'a function named resolveBaseURL' },
    { test: /`/, label: 'the lines are template literals' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']local: 0 retries/, label: 'no hard-coded lines — resolve from the env objects' },
  ],
  modelAnswer: `function resolveRetries(env) {
  return env.CI ? 2 : 0;
}

function resolveBaseURL(env) {
  return env.BASE_URL ?? "http://localhost:3000";
}

const local = {};
const ci = { CI: "true", BASE_URL: "https://staging.shop.com" };

console.log(\`local: \${resolveRetries(local)} retries → \${resolveBaseURL(local)}\`);
console.log(\`ci: \${resolveRetries(ci)} retries → \${resolveBaseURL(ci)}\`);`,
}

export const lesson113: LessonDef = {
  id: '11.3',
  hook: (
    <>
      <p>
        Every Playwright question that begins “why does my test…” ends in this file. So before
        locators, before actions,{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          playwright.config.ts gets the 8.6 treatment: every line decoded, until nothing in it is
          mystery furniture
        </HighlightMark>
        .
      </p>
      <p>
        You’ve done this twice (package.json in 8.6; the CI file comes in 11.16). Same detective
        method, richest file yet.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-method',
      caption:
        'The method is 8.6’s, verbatim: read every line, pin its job to the board, trust nothing you can’t explain. This file is the suite’s CONTRACT — the runner consults it before touching a single test, so understanding it means understanding every run you’ll ever start.',
      highlightLines: [1],
    },
    {
      id: 'the-frame',
      caption:
        'The frame first: export default (8.1’s “one main thing”) hands the runner exactly one object. defineConfig adds nothing at runtime — it’s a typing helper (8.5) so your editor autocompletes every field and flags typos in this very file. Config files deserve type-checking too.',
      highlightLines: [1, 3],
    },
    {
      id: 'testdir',
      caption:
        'testDir: "./tests" — aims the find-by-convention machinery (10.5, 11.2): the runner searches this folder for spec files by filename pattern (a “glob” — wildcards like *.spec.ts). Tests outside it silently don’t exist — worth knowing before a confusing afternoon.',
      highlightLines: [4],
    },
    {
      id: 'test-timeout',
      caption:
        'timeout: 30_000 — the per-TEST budget, in milliseconds. (The underscore is a numeric separator — pure readability; the value is 30000.) A test still running at 30 seconds is killed and failed as timed out: budgets keep one hung test from freezing the suite (6.1’s lesson, suite-sized).',
      highlightLines: [5],
    },
    {
      id: 'expect-timeout',
      caption:
        'expect: { timeout: 5_000 } — a DIFFERENT clock: how long ONE web-first assertion may retry before giving up (11.6’s polling budget). The two nest: each assertion gets up to 5s, all inside the test’s 30s. Most “timeout” confusion on the job is these two clocks, conflated — you now hold both.',
      highlightLines: [6],
    },
    {
      id: 'parallel-forbidonly',
      caption:
        'fullyParallel: true — files AND the tests inside them may run concurrently (11.15’s machinery; isolation from 11.7 is what makes it safe). And forbidOnly: !!process.env.CI — 10.5’s .only-left-in disaster, guarded: on CI, a committed .only fails the whole build instead of silently shrinking the suite.',
      highlightLines: [7, 8],
    },
    {
      id: 'retries',
      caption:
        'retries: process.env.CI ? 2 : 0 — read that right-hand side: it’s 9.4, live in a config file. On CI, a failed test re-runs up to twice; locally, zero. The split is philosophy: at your desk you want raw truth (a flake must LOOK flaky); CI wants signal over cosmic-ray noise. 11.15 debates it properly.',
      highlightLines: [9],
    },
    {
      id: 'workers',
      caption:
        'workers — same conditional pattern: 1 on CI (a shared runner box behaves deterministically with one worker), undefined locally, which means AUTO: roughly half your CPU cores. You saw “using 2 workers” in 11.2 — this line is where that number came from.',
      highlightLines: [10],
    },
    {
      id: 'reporter',
      caption:
        'reporter: "html" — which report gets built after the run (11.2’s show-report opens it). Alternatives you’ll meet: "list" (plain terminal lines), "junit" (XML for CI dashboards), and combinations. The reporter changes how results are SHOWN, never what ran.',
      highlightLines: [11],
    },
    {
      id: 'use-block',
      caption:
        'The use: {} block — DEFAULTS handed to every test’s fixtures (11.7 explains the handing). Star of the block: baseURL, read from process.env.BASE_URL with ?? localhost — 9.4’s one-suite-many-targets promise, delivered: page.goto("/") now means “the front page of whatever this run targets.”',
      highlightLines: [12, 13, 14],
    },
    {
      id: 'artifacts-trio',
      caption:
        'The artifacts trio — three evidence POLICIES, not switches: trace: "on-first-retry" (record the flight recorder only when a test fails once — 11.14’s star), screenshot: "only-on-failure", video: "retain-on-failure". Evidence when something’s wrong, silence when all’s well; files land in test-results/ (9.5).',
      highlightLines: [15, 16, 17],
    },
    {
      id: 'case-closed',
      caption:
        'Case closed — walk the board: where tests live, two nested clocks, parallelism with a safety guard, CI-aware retries and workers, the report format, env-aimed targeting, and evidence policies. Every line has a job you can say out loud. From today, no config file in any repo is mystery furniture.',
      highlightLines: [3, 19],
    },
  ],
  Viz: ConfigCaseBoard,
  underTheHood: (
    <>
      <p>
        Where env values come from. Locally, teams load a <code>.env</code> file at the
        top of the config (<code>import "dotenv/config"</code> — 9.4’s layered sources). On CI,
        the pipeline injects the same names from its vault (11.16). The config reads{' '}
        <code>process.env.*</code> either way — one reading site, two suppliers.
      </p>
      <p>
        Settings cascade: the config’s <code>use{'{}'}</code> is the base layer, a project
        (11.12) can override it, a file can (<code>test.use({'{…}'})</code>), and a single test
        can too. Most-specific wins — the same mental model as CSS specificity (7.x), applied to
        test settings.
      </p>
      <p>
        Two more residents you’ll meet in real configs: <code>projects</code> (the cross-browser
        array — all of 11.12) and <code>webServer</code> (start the app before testing — also
        11.12). And <code>globalSetup</code>/<code>globalTeardown</code> for run-once work — 11.11
        uses the projects flavor of that idea for login.
      </p>
      <p>
        <strong>💼 On the job —</strong> when a suite behaves differently on CI than locally,
        compare the EFFECTIVE config first. Nearly always it’s a{' '}
        <code>process.env.CI ? … : …</code> line doing exactly what it says — retries masking a
        flake, workers changing order. You can now read those lines; that skill will save you
        afternoons.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'timeout: 30_000 and expect.timeout: 5_000 — which one is the budget for a SINGLE retrying assertion?',
      accept: ['expect.timeout', 'expect timeout', 'the expect timeout', '5000', '5_000', 'expect: { timeout }', 'the 5s one'],
      placeholder: 'which…',
      why: 'expect.timeout (5s) — one assertion may poll that long, and every assertion’s clock ticks inside the test’s overall 30s budget. Two clocks, nested.',
    },
    {
      kind: 'type-output',
      question: 'retries is 2 on CI but 0 locally. Why zero at your desk? (short phrase)',
      accept: ['raw truth', 'you want raw truth', 'to see flakes', 'so flakes look flaky', 'to see the flakiness', 'so you see real failures', 'no hiding flakes'],
      placeholder: 'because…',
      why: 'At the desk you want raw truth — a flaky test must LOOK flaky so you investigate it. CI trades that for signal over noise; the report still marks retried passes as flaky (11.15).',
    },
    {
      kind: 'type-output',
      question: 'With baseURL set, what does page.goto("/") navigate to?',
      accept: ['the baseURL', 'baseURL', 'the base url', 'the target', 'the configured base URL', 'whatever baseURL is', 'the front page of the target'],
      placeholder: 'where…',
      why: 'The configured baseURL — env-aimed via process.env.BASE_URL ?? localhost (9.4 delivered). One suite, many targets, and specs never hard-code hosts.',
    },
  ],
  PlayExtra: () => <CodeExercise def={CONFIG_EXERCISE} />,
  teachBack: {
    prompt:
      'Give the full config briefing: the two nested timeouts, why retries and workers read process.env.CI, what the use block is (and how baseURL gets aimed), and the artifacts trio’s policy logic.',
    modelAnswer:
      'The config is one default-exported object the runner consults before any test runs. Two clocks live in it, nested: timeout (30 seconds) is the per-test budget — a test still running then is killed and failed — while expect.timeout (5 seconds) is how long a single web-first assertion may retry; every assertion’s clock ticks inside the test’s clock, and most timeout confusion is these two conflated. retries and workers both read process.env.CI — 9.4’s environment plumbing inside a config file: on CI failures re-run twice and one worker keeps a shared box deterministic; locally retries are zero because at the desk you want raw truth — a flake must look flaky — and workers auto-scale to your cores. forbidOnly on CI guards 10.5’s .only disaster by failing the build. The use block holds defaults handed to every test, starring baseURL: read from process.env.BASE_URL with a ?? localhost fallback, so page.goto("/") means “the front page of whatever this run targets” — one suite, many targets. And the artifacts trio are evidence policies, not switches: trace on-first-retry, screenshot only-on-failure, video retain-on-failure — collect evidence when something is wrong, stay silent and fast when all is well, files landing in test-results.',
  },
  recap: [
    'The config = the suite’s contract, read with 8.6’s method. Frame: export default + defineConfig (typing help). testDir aims find-by-convention.',
    'TWO nested clocks: timeout 30s per TEST ⊃ expect.timeout 5s per ASSERTION. CI-conditionals everywhere (9.4 live): retries 2/0 (raw truth locally), workers 1/auto, forbidOnly guards .only.',
    'use{} = defaults for every test — baseURL: env ?? localhost makes goto("/") target-aware. Artifacts trio = evidence POLICIES (trace on-first-retry, screenshot/video on failure) → test-results/ (9.5).',
  ],
}
