import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, ChatBubble, Takeaway, Key } from '../../design/JobScene'

/**
 * 11.2 — Setup: what npm init playwright scaffolds
 * Into 9.8's workspace: the init command's four questions, the browser
 * binaries download (why it's big), the four scaffolded files toured, first
 * run (workers glimpsed), npx glossed, --headed, the HTML report from day
 * one. Every file connects back: 8.5 TS, 8.6 package.json, 10.5 convention.
 */

const CODE = `$ npm init playwright@latest

✔ TypeScript or JavaScript?      · TypeScript
✔ Where to put your tests?       · tests
✔ Add a GitHub Actions workflow? · true
✔ Install Playwright browsers?   · true

first-suite/
├─ playwright.config.ts     ← 11.3 decodes it
├─ package.json             ← you read these cold (8.6)
├─ tests/example.spec.ts
└─ .github/workflows/playwright.yml   ← 11.16

$ npx playwright test
Running 2 tests using 2 workers
  2 passed (4.2s)

$ npx playwright test --headed
$ npx playwright show-report`

interface View {
  mode: 'init' | 'tree' | 'run'
  answeredQs?: number
  treeLit?: number | null
  termLines?: string[]
  console: string[]
  note: string
  badge?: string
}

const QS = ['TypeScript or JavaScript? → TypeScript', 'Where to put tests? → tests/', 'GitHub Actions workflow? → true', 'Install browsers? → true (the big download)']
const TREE = ['playwright.config.ts', 'package.json', 'tests/example.spec.ts', '.github/workflows/playwright.yml']

const VIEWS: View[] = [
  {
    mode: 'init', answeredQs: 0, console: [],
    note: 'this installs into EXACTLY the workspace you built in 9.8 — Node, a folder, a terminal. Nothing else needed',
  },
  {
    mode: 'init', answeredQs: 1, console: [],
    note: 'npm init playwright@latest — 8.2’s init, supercharged: it interviews you, then scaffolds a working suite',
  },
  {
    mode: 'init', answeredQs: 4, console: [],
    note: 'four questions: TypeScript (8.5 — say yes), a tests folder, a CI workflow (created now, decoded in 11.16), and the browsers',
  },
  {
    mode: 'init', answeredQs: 4, console: ['Downloading Chromium 124… Firefox… WebKit…'],
    note: 'the download is BIG on purpose: three REAL browser builds, version-matched to the library (11.1’s protocol)',
    badge: 'hundreds of MB, once per Playwright version — they live in a shared cache, not in your repo (and never in git — 8.2’s rule)',
  },
  {
    mode: 'tree', treeLit: null, console: [],
    note: 'the scaffold: four files, and you already know how to read three of them cold',
  },
  {
    mode: 'tree', treeLit: 2, console: [],
    note: 'tests/example.spec.ts — .spec. is 10.5’s .test. convention in Playwright costume: the runner finds files by pattern',
  },
  {
    mode: 'run', termLines: ['$ npx playwright test', 'Running 2 tests using 2 workers', '  2 passed (4.2s)'], console: [],
    note: 'first run: found the example specs by convention, ran them, 2 passed, exit 0 (9.2) — a working suite in minute one',
  },
  {
    mode: 'run', termLines: ['$ npx playwright test', 'Running 2 tests using 2 workers', '  2 passed (4.2s)'], console: [],
    note: '“using 2 workers” — tests ran in PARALLEL out of the box. Hold that thought for 11.15',
    badge: 'npx, glossed: run a command from an installed package without installing it globally — npm run’s sibling for package binaries',
  },
  {
    mode: 'run', termLines: ['$ npx playwright test --headed'], console: [],
    note: '--headed: the window opens and you WATCH the robot drive. The single best trust-builder in week one — do it',
  },
  {
    mode: 'run', termLines: ['$ npx playwright show-report'], console: [],
    note: 'and the HTML report exists from day one: every test, timings, failures with evidence — artifacts land per 9.5',
    badge: 'playwright-report/ and test-results/ join node_modules in .gitignore — products, not sources',
  },
]

function ScaffoldTour({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'init' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the init interview
          </text>
          <RoughRect x={30} y={40} width={380} height={40} seed={4101} strokeWidth={2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
          <text x={46} y={65} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-marker-teal)">$ npm init playwright@latest</text>
          {QS.map((q, i) => {
            const answered = (view.answeredQs ?? 0) > i
            return (
              <g key={q} opacity={answered ? 1 : 0.3}>
                <RoughRect x={40} y={92 + i * 34} width={360} height={28} seed={4105 + i} strokeWidth={answered ? 1.8 : 1.2} stroke={answered ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={answered ? 'color-mix(in srgb, var(--color-marker-teal) 6%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={54} y={110 + i * 34} fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">{answered ? '✔' : '·'} {q}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'tree' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the scaffold — four files
          </text>
          <text x={40} y={58} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">first-suite/</text>
          {TREE.map((file, i) => {
            const lit = view.treeLit === i
            return (
              <motion.g key={file} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                {lit && <RoughRect x={48} y={70 + i * 30} width={330} height={26} seed={4110 + i} strokeWidth={1.6} stroke="var(--color-marker-yellow)" fill="color-mix(in srgb, var(--color-marker-yellow) 20%, transparent)" fillStyle="solid" />}
                <text x={60} y={88 + i * 30} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">└ {file}</text>
              </motion.g>
            )
          })}
          <text x={60} y={216} fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">
            config → 11.3 · package.json → 8.6 · workflow → 11.16
          </text>
        </g>
      )}

      {view.mode === 'run' && (
        <g>
          <RoughRect x={30} y={40} width={380} height={110} seed={4120} strokeWidth={2.2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
          {(view.termLines ?? []).map((line, i) => (
            <text key={i} x={46} y={68 + i * 24} fontFamily="var(--font-code)" fontSize={10} fill={line.startsWith('$') ? 'var(--color-marker-teal)' : line.includes('passed') ? 'var(--color-marker-teal)' : 'var(--color-ink)'}>
              {line}
            </text>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4130} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const SCAFFOLD_EXERCISE: CodeExerciseDef = {
  id: 'l112-scaffold-checker',
  title: 'the scaffold inspector',
  task: 'A teammate says “I ran the init but something’s off.” Write the inspector: verify a scaffold has every required file, and name exactly what’s missing when it doesn’t.',
  steps: [
    <>
      Create <code>required</code>: the four scaffold files —{' '}
      <code>"playwright.config.ts"</code>, <code>"package.json"</code>,{' '}
      <code>"tests/example.spec.ts"</code>, <code>".github/workflows/playwright.yml"</code>.
    </>,
    <>
      Write <code>inspect(files)</code>: compute the missing ones (required entries the files
      list doesn’t include — 4.9 + membership). If none are missing, print{' '}
      <code>scaffold complete</code>; otherwise print <code>missing: NAME</code> for each.
    </>,
    <>
      Run it twice: once on a complete scaffold, once on one where{' '}
      <code>playwright.config.ts</code> was deleted.
    </>,
  ],
  starter: '',
  expectedOutput: ['scaffold complete', 'missing: playwright.config.ts'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'the missing list comes from .filter' },
    { test: /\.includes\s*\(/, label: 'membership is asked with .includes' },
    { test: /function\s+inspect\s*\(|const\s+inspect\s*=/, label: 'a function named inspect' },
    { test: /\.length\s*===\s*0|\.length\s*>\s*0|\.length\s*!==\s*0/, label: 'the verdict checks the missing list’s length' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']missing: playwright/, label: 'no hard-coded missing lines — the filter must find them' },
  ],
  modelAnswer: `const required = [
  "playwright.config.ts",
  "package.json",
  "tests/example.spec.ts",
  ".github/workflows/playwright.yml",
];

function inspect(files) {
  const missing = required.filter((name) => !files.includes(name));
  if (missing.length === 0) {
    console.log("scaffold complete");
  } else {
    for (const name of missing) {
      console.log("missing: " + name);
    }
  }
}

inspect([
  "playwright.config.ts",
  "package.json",
  "tests/example.spec.ts",
  ".github/workflows/playwright.yml",
]);

inspect([
  "package.json",
  "tests/example.spec.ts",
  ".github/workflows/playwright.yml",
]);`,
}

export const lesson112: LessonDef = {
  id: '11.2',
  hook: (
    <>
      <p>
        9.8 left you with a real Node workspace and a promise: “this is what Playwright installs
        into.” Today the promise lands:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          one command interviews you, scaffolds a complete working suite, downloads three real
          browsers — and two minutes later you run passing tests
        </HighlightMark>
        .
      </p>
      <p>
        The goal today isn’t just to run it — it’s to know exactly what every scaffolded file IS,
        so nothing in your project is mystery furniture.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'into-the-workspace',
      caption:
        'Setting: your 9.8 workspace — Node LTS installed, a project folder, a terminal standing in it. That’s the complete list of prerequisites. Everything Playwright needs, you built two phases ago, by hand, knowing every piece.',
      highlightLines: [1],
    },
    {
      id: 'the-init',
      caption:
        'The command: npm init playwright@latest. It’s 8.2’s npm init, supercharged: instead of just writing a package.json, it INTERVIEWS you — four questions — then scaffolds a complete, runnable suite around your answers.',
      highlightLines: [1],
    },
    {
      id: 'the-four-questions',
      caption:
        'The interview, with your informed answers: TypeScript or JavaScript? — TypeScript, and 8.5 is why you say it without flinching. Where to put tests? — tests/. Add a GitHub Actions workflow? — true: 11.16’s file gets created NOW, decoded later. Install browsers? — true, and that one deserves its own step.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'browser-binaries',
      caption:
        'The browsers download is BIG — hundreds of megabytes — and now you know exactly why: three REAL browser builds (chromium, firefox, webkit), each version-matched to the library so 11.1’s wire protocol never drifts. They land in a shared cache on your machine, once per Playwright version. Never in the repo.',
      highlightLines: [6],
    },
    {
      id: 'scaffold-tour',
      caption:
        'The scaffold: four files. playwright.config.ts — the suite’s control panel, and all of 11.3. package.json — you read these cold since 8.6 (peek: @playwright/test in devDependencies, exactly where 8.2 said test tools live). tests/example.spec.ts. And the workflow file, waiting for 11.16.',
      highlightLines: [8, 9, 10, 11, 12],
    },
    {
      id: 'spec-convention',
      caption:
        'That .spec.ts extension is an old friend in a new costume: 10.5’s find-by-convention. The runner globs for *.spec.ts under your tests folder — no registration, no list. Name a file right and it’s in the suite. (spec vs test? Same idea, different tradition — Playwright’s scaffold says spec.)',
      highlightLines: [10],
    },
    {
      id: 'first-run',
      caption:
        'The first run: npx playwright test. It finds the two example specs by convention, launches headless browsers (11.1), runs, and reports: 2 passed, 4.2 seconds — and invisibly, exit code 0 (9.2, forever). You have a working browser-test suite in minute one. The examples exist to be read: open them.',
      highlightLines: [14, 15, 16],
    },
    {
      id: 'workers-glimpse',
      caption:
        'One phrase in that output deserves a bookmark: “using 2 workers.” Your two tests ran in PARALLEL, out of the box, in separate worker processes. That’s 11.15’s whole story glimpsed early — file it. And npx, glossed: it runs a command from an installed package without a global install; npm run’s sibling.',
      highlightLines: [15],
    },
    {
      id: 'headed',
      caption:
        'Now the moment that makes it real: npx playwright test --headed. A browser window OPENS, and you watch the robot drive — the page loads, fields fill themselves, buttons click. Do this once today, seriously: watching the hands work is the fastest trust-builder in the whole toolchain.',
      highlightLines: [18],
    },
    {
      id: 'the-report',
      caption:
        'Last discovery: npx playwright show-report opens an HTML report of the last run — every test, timings, and (on failures) the evidence kit 11.14 will teach you to read. It’s built from files in playwright-report/ and test-results/ — written with 9.5’s tools, and belonging in .gitignore with all other products.',
      highlightLines: [19],
    },
  ],
  Viz: ScaffoldTour,
  underTheHood: (
    <>
      <p>
        Where the browsers live: a per-user cache (on Linux{' '}
        <code>~/.cache/ms-playwright</code>, equivalents elsewhere) — shared across all your
        projects, keyed by version. <code>npx playwright install</code> re-downloads on demand;
        CI machines run it every time (11.16’s fresh-box rule), often behind a cache step.
      </p>
      <p>
        The example spec is worth five minutes of honest reading: it navigates to playwright.dev
        and asserts on the page — a real network round trip (6.7). Some teams delete it on day
        one. Better: keep it until your own first spec passes — a known-good check for “is my
        setup broken, or is my test wrong?”
      </p>
      <p>
        If TypeScript feels like overhead in week one: the scaffold works identically with the
        JavaScript answer, and everything in this phase applies unchanged. But 8.5’s argument
        stands — <code>page.</code> autocompleting every action is worth the one-letter extension,
        and every real codebase you join will have chosen TS already.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Why is the Playwright install download so large — what is it actually downloading?',
      accept: ['browsers', 'the browsers', 'browser binaries', 'three browsers', 'real browser builds', 'browser builds', 'chromium firefox webkit'],
      placeholder: 'what’s in it…',
      why: 'Three real browser builds — chromium, firefox, webkit — version-matched to the library so the wire protocol never drifts. Cached once per version, never committed.',
    },
    {
      kind: 'type-output',
      question: 'How does the runner know tests/example.spec.ts contains tests?',
      accept: ['convention', 'the filename', 'naming convention', 'the .spec. in the name', 'file naming convention', 'by convention', '*.spec.ts'],
      placeholder: 'how…',
      why: 'Find-by-convention — 10.5’s .test. idea in Playwright costume: the runner globs for *.spec.ts. Name a file right and it’s in the suite.',
    },
    {
      kind: 'type-output',
      question: 'Which flag opens a visible browser window so you can watch the test drive?',
      accept: ['--headed', 'headed', '-headed'],
      placeholder: 'the flag…',
      why: '--headed — headless (no window) is the default for speed; headed is for humans. Watching the robot drive once is the fastest trust-builder there is.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, a teammate will ask where your tests live.</Scene>
      <ChatBubble who="teammate" face="🙂">Why is there an e2e folder inside the app repo?</ChatBubble>
      <ChatBubble who="you" face="😊" accent indent>
        That is where real suites live: one repo, same files, same reading order. Config first,
        then a spec.
      </ChatBubble>
      <Takeaway>
        While learning, keep one suite in an empty folder so the model stays clean.{' '}
        <Key>At work, the suite lives inside the app repo instead.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={SCAFFOLD_EXERCISE} />,
  teachBack: {
    prompt:
      'Walk a friend through npm init playwright@latest: the four questions and how you’d answer them (with reasons), why the download is big, what each scaffolded file is, and the two commands you run right after.',
    modelAnswer:
      'In a fresh folder in the 9.8 workspace, npm init playwright@latest interviews you with four questions. TypeScript or JavaScript — TypeScript, because the editor then knows every page action’s shape (8.5) and every real codebase has already chosen it. Where to put tests — the default tests folder. Add a GitHub Actions workflow — yes: it creates the CI file now, which 11.16 decodes line by line. Install browsers — yes, and that’s why the download is hundreds of megabytes: it fetches three real browser builds — chromium, firefox, and webkit — version-matched to the library so the wire protocol between your Node script and the browsers never drifts; they live in a shared per-user cache, never in the repo. The scaffold is four files: playwright.config.ts, the suite’s control panel; package.json, readable cold since 8.6, with @playwright/test in devDependencies; tests/example.spec.ts, found by the *.spec.ts naming convention — 10.5’s find-by-convention idea; and the workflow YAML waiting for CI. Then two commands: npx playwright test runs the examples — found by convention, run headless, “2 passed,” exit code 0 — and npx playwright test --headed opens a real window so you watch the robot drive, which is the fastest way to trust the tool. npx itself just runs a command from an installed package without a global install. And npx playwright show-report opens the HTML report that exists from day one.',
  },
  recap: [
    'One command into 9.8’s workspace: npm init playwright@latest — four questions (TS: yes, per 8.5), then a complete runnable suite. The big download = three real, version-matched browser builds, cached per-user, never committed.',
    'Four files, none mysterious: config (11.3’s subject) · package.json (readable since 8.6) · example.spec.ts (found by *.spec convention — 10.5) · CI workflow (11.16’s subject).',
    'npx playwright test → 2 passed, exit 0, “using 2 workers” (11.15 foreshadowed) · --headed to watch the robot · show-report for the day-one HTML report. Report folders join .gitignore.',
  ],
}
