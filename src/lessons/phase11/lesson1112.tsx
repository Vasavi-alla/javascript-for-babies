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
 * 11.12 — Cross-browser projects & devices
 * A project = a named config variant; the projects array runs the WHOLE
 * suite once per variant (11.1's three engines, operationalized). devices
 * presets spread into use (4.11). Mobile emulation honesty. --project
 * filtering, webServer, and the cross-browser budget (10.2 thinking).
 */

const CODE = `projects: [
  { name: "chromium",
    use: { ...devices["Desktop Chrome"] } },
  { name: "firefox",
    use: { ...devices["Desktop Firefox"] } },
  { name: "webkit",
    use: { ...devices["Desktop Safari"] } },
  { name: "mobile",
    use: { ...devices["iPhone 14"] } },
],
webServer: {
  command: "npm run start",
  url: "http://localhost:3000",
  reuseExistingServer: !process.env.CI,
},

// $ npx playwright test --project=webkit`

interface View {
  mode: 'lanes' | 'devices' | 'webserver' | 'budget'
  lanesLit?: number[]
  mobileJoins?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'lanes', lanesLit: [0], console: [],
    note: 'the question your suite can’t answer yet: it passes on chromium — does the app WORK on Safari?',
  },
  {
    mode: 'lanes', lanesLit: [0, 1, 2], console: [],
    note: 'a PROJECT = a named config variant. The projects array runs your ENTIRE suite once per variant — same specs, different settings',
  },
  {
    mode: 'lanes', lanesLit: [0, 1, 2], console: ['50 tests × 3 projects = 150 runs'],
    note: '11.1’s three engines, operationalized: chromium, firefox, webkit — one suite, three lanes, zero spec changes',
  },
  {
    mode: 'lanes', lanesLit: [0, 1, 2], console: ['✓ chromium · ✓ firefox · ✗ webkit'],
    note: 'and the report groups by project: “passed on chromium, FAILED on webkit” is a real, actionable diagnosis — the Safari surprise, caught',
  },
  {
    mode: 'devices', mobileJoins: true, console: [],
    note: 'devices["iPhone 14"] = a preset bundle — viewport, touch, user agent, pixel ratio — spread into use with 4.11’s dots',
  },
  {
    mode: 'devices', mobileJoins: true, console: [],
    note: 'emulation, honestly: a REAL engine wearing a phone-shaped viewport with touch events — superb for layout and touch logic',
    badge: 'it is NOT real phone hardware — device-specific bugs (a Samsung keyboard quirk) need real devices. Know what the tool claims, and what it doesn’t.',
  },
  {
    mode: 'lanes', lanesLit: [2], console: ['$ npx playwright test --project=webkit'],
    note: 'filter lanes from the terminal: --project=webkit runs one variant — the daily move when chasing an engine-specific bug',
  },
  {
    mode: 'webserver', console: ['starting… localhost:3000 ready → tests begin'],
    note: 'webServer: the config STARTS your app and waits for the URL before any test runs — “was the dev server running?” dies here',
  },
  {
    mode: 'webserver', console: [],
    note: 'reuseExistingServer: !process.env.CI — 9.4’s pattern again: locally reuse YOUR running server; CI always starts fresh',
  },
  {
    mode: 'budget', console: [],
    note: 'the honest budget (10.2 thinking): most logic bugs are engine-independent — chromium on every change, ALL engines nightly/pre-release',
    badge: 'cross-browser-everything-always quadruples the bill for rare catches. Deliberate lanes, not maximal ones. (11.11’s setup step? Projects can DEPEND on it — login bottles once, all lanes drink.)',
  },
]

function BrowserLanes({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const LANES = ['chromium', 'firefox', 'webkit']
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {(view.mode === 'lanes' || view.mode === 'devices') && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            one suite, parallel lanes
          </text>
          <RoughRect x={30} y={40} width={110} height={54} seed={5101} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={85} y={62} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">the suite</text>
          <text x={85} y={80} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">50 specs, unchanged</text>
          {LANES.map((lane, i) => {
            const lit = (view.lanesLit ?? []).includes(i)
            return (
              <g key={lane} opacity={lit ? 1 : 0.3}>
                <RoughRect x={170} y={40 + i * 62} width={240} height={50} seed={5105 + i} strokeWidth={lit ? 2.2 : 1.4} stroke="var(--color-marker-teal)" fill={`color-mix(in srgb, var(--color-marker-teal) ${lit ? 8 : 3}%, transparent)`} fillStyle="solid" />
                <text x={190} y={70 + i * 62} fontFamily="var(--font-code)" fontSize={10} fontWeight={700} fill="var(--color-ink)">{lane}</text>
                <text x={396} y={70 + i * 62} textAnchor="end" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">lane {i + 1}</text>
              </g>
            )
          })}
          {view.mobileJoins && (
            <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <RoughRect x={170} y={226} width={240} height={50} seed={5110} strokeWidth={2.2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 7%, transparent)" fillStyle="solid" />
              <text x={190} y={250} fontFamily="var(--font-code)" fontSize={10} fontWeight={700} fill="var(--color-ink)">📱 mobile — iPhone 14 preset</text>
              <text x={190} y={266} fontFamily="var(--font-hand)" fontSize={8} fill="var(--color-ink-soft)">viewport 390×844 · touch · mobile UA</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'webserver' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            webServer: the gate before the lanes
          </text>
          <RoughRect x={40} y={50} width={160} height={80} seed={5120} strokeWidth={2.2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={120} y={78} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">npm run start</text>
          <text x={120} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">the app boots…</text>
          <text x={120} y={116} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-marker-teal)">localhost:3000 ✓ ready</text>
          <text x={230} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">→ then →</text>
          <RoughRect x={280} y={50} width={130} height={80} seed={5121} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={345} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink)">the suite runs</text>
        </g>
      )}

      {view.mode === 'budget' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the cross-browser budget
          </text>
          <RoughRect x={40} y={48} width={175} height={110} seed={5130} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={127} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">every change</text>
          <text x={127} y={98} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">chromium only</text>
          <text x={127} y={122} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">fast signal, most bugs</text>
          <RoughRect x={225} y={48} width={175} height={110} seed={5131} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={312} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">nightly / pre-release</text>
          <text x={312} y={98} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">all engines + mobile</text>
          <text x={312} y={122} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">the Safari surprises</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9} seed={5140} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const MATRIX_EXERCISE: CodeExerciseDef = {
  id: 'l1112-project-matrix',
  title: 'expand the project matrix',
  task: 'The runner multiplies suite × projects into a run matrix. Build the expander: every test on every project lane, named like the real report — with the total computed, not counted on fingers.',
  steps: [
    <>
      Create <code>tests</code> as <code>["login works", "coupon applies"]</code> and{' '}
      <code>projects</code> as <code>["chromium", "firefox", "webkit"]</code>.
    </>,
    <>
      Write <code>expandMatrix(tests, projects)</code>: for every project, for every test (2.7’s
      clock — the inner hand spins fully per outer click), collect{' '}
      <code>test [project] name</code> lines into an array and return it.
    </>,
    <>
      Print each line, then the summary <code>total runs: 6</code> — from the array’s length.
    </>,
  ],
  starter: '',
  expectedOutput: ['test [chromium] login works', 'test [chromium] coupon applies', 'test [firefox] login works', 'test [firefox] coupon applies', 'test [webkit] login works', 'test [webkit] coupon applies', 'total runs: 6'],
  mustUse: [
    { test: /for\s*\([\s\S]*for\s*\(/, label: 'nested loops — the matrix multiplication (2.7)' },
    { test: /function\s+expandMatrix|const\s+expandMatrix\s*=/, label: 'a function named expandMatrix' },
    { test: /`test \[\$\{|\.push\s*\(/, label: 'lines are built and collected' },
    { test: /\.length/, label: 'the total comes from the collection’s length' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']total runs: 6["']\s*\)/, label: 'no hard-coded total — the matrix computes it' },
  ],
  modelAnswer: `const tests = ["login works", "coupon applies"];
const projects = ["chromium", "firefox", "webkit"];

function expandMatrix(tests, projects) {
  const runs = [];
  for (const project of projects) {
    for (const test of tests) {
      runs.push(\`test [\${project}] \${test}\`);
    }
  }
  return runs;
}

const runs = expandMatrix(tests, projects);
for (const line of runs) {
  console.log(line);
}
console.log("total runs: " + runs.length);`,
}

export const lesson1112: LessonDef = {
  id: '11.12',
  hook: (
    <>
      <p>
        Your suite is green — on chromium. But 11.1 warned you about the engine that surprises
        everyone.{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          The projects array runs your ENTIRE suite once per named config variant — three engines
          and a phone, from one set of specs, unchanged
        </HighlightMark>
        . Plus the config block that finally kills “oh, was the dev server running?”
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-question',
      caption:
        '“Works in Chrome” is a fact about ONE engine. 9.1 taught that different runtimes wrap the same language differently — browsers too: chromium, firefox, and webkit each render, scroll, and focus with their own quirks. Safari’s webkit is the classic ambusher, and your users are on it.',
      highlightLines: [6, 7],
    },
    {
      id: 'projects',
      caption:
        'The mechanism: a PROJECT is a named CONFIG VARIANT — a name plus a use{} bundle (11.3’s block, per-variant). The projects array tells the runner: run the whole suite once per entry. Same spec files, untouched; different worlds around them.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'three-lanes',
      caption:
        'So three entries = your 50 specs × 3 engines = 150 runs, in parallel lanes (11.15’s workers feed all of them). This is 11.1’s one-API-three-engines promise, operationalized: cross-browser coverage costs a config array, not a rewrite. (Selenium veterans weep at this step.)',
      highlightLines: [1, 2, 4, 6],
    },
    {
      id: 'grouped-report',
      caption:
        'The report groups results by project — and THAT is the payoff: “passed on chromium and firefox, FAILED on webkit” is a precise, actionable diagnosis (an engine-specific bug, usually CSS or focus behavior), not a mystery. Without lanes, that bug ships to every Safari user.',
      highlightLines: [6, 7],
    },
    {
      id: 'devices',
      caption:
        'The devices registry scales this to hardware shapes: devices["iPhone 14"] is a PRESET BUNDLE — viewport 390×844, touch enabled, mobile user agent, pixel ratio — spread into use with 4.11’s dots. One more array entry, and your suite also runs phone-shaped.',
      highlightLines: [8, 9],
    },
    {
      id: 'emulation-honesty',
      caption:
        'Emulation, described honestly: it’s a REAL engine wearing a phone-shaped viewport with touch events — superb for responsive layout and touch-logic bugs (most of what breaks on mobile). It is NOT real phone hardware: a device-specific keyboard quirk needs a real device. Know what the tool claims and what it doesn’t.',
      highlightLines: [9],
    },
    {
      id: 'project-filter',
      caption:
        'Daily driving: --project=webkit runs ONE lane — the move when chasing an engine-specific bug (pair it with --headed from 11.2 and watch webkit misbehave live). Everything composes: --project + --grep (11.13, next) slice the matrix any way you need.',
      highlightLines: [17],
    },
    {
      id: 'webserver',
      caption:
        'Second gift in this config region: webServer. The runner STARTS your app with the given command, waits until the URL answers, THEN runs tests — and shuts it down after. The entire genre of “tests failed because the dev server wasn’t running” dies in this block.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'reuse-existing',
      caption:
        'And its one subtle line: reuseExistingServer: !process.env.CI — 9.4’s pattern, third appearance. Locally, if YOUR dev server is already running, reuse it (fast — your edit-and-see loop stays untouched). On CI, never reuse — always boot fresh (11.16’s clean-box philosophy). One line, both worlds correct.',
      highlightLines: [14],
    },
    {
      id: 'the-budget',
      caption:
        'Close with judgment, because lanes multiply cost: most logic bugs are engine-INDEPENDENT — a broken coupon calculation fails identically everywhere. So the standard budget (10.2 thinking): chromium on every change for fast signal; ALL engines + mobile nightly and pre-release for the Safari surprises. Deliberate lanes, not maximal ones.',
      highlightLines: [1, 16],
    },
  ],
  Viz: BrowserLanes,
  underTheHood: (
    <>
      <p>
        Projects can form a DEPENDENCY graph. Give the browser projects{' '}
        <code>dependencies: ["setup"]</code>, and the <code>setup</code> project (11.11’s login
        bottling) runs first — 8.1’s graph, once more. Bottle once, every lane drinks.
      </p>
      <p>
        Projects aren’t only for browsers. Teams define an <code>api</code> project (request-only
        tests, no browser — 11.10), a <code>smoke</code> project with a grep filter built in
        (11.13), or per-environment projects with different baseURLs. “Named config variant” is
        the general tool; cross-browser is just its most famous use.
      </p>
      <p>
        Mobile presets can be composed manually too:{' '}
        <code>use: {'{ viewport: { width: 390, height: 844 }, hasTouch: true }'}</code> — the
        registry entries are just objects (4.x) with good defaults. Print one in the REPL (9.1)
        someday; demystification is a hobby now.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: '50 tests, 4 projects (3 engines + mobile). How many test RUNS does a full pass execute?',
      accept: ['200', '200 runs', 'two hundred'],
      placeholder: 'a number…',
      why: '50 × 4 = 200 — the projects array multiplies the whole suite per variant. Exactly why the budget step exists: lanes are powerful and priced.',
    },
    {
      kind: 'type-output',
      question: 'Is devices["iPhone 14"] a real phone? What is it actually? (short phrase)',
      accept: ['no — emulation', 'emulation', 'no, emulation', 'a real engine with a phone viewport', 'an emulated device', 'viewport emulation', 'no - a preset'],
      placeholder: 'what is it…',
      why: 'Emulation: a real browser engine wearing a phone-shaped viewport + touch + mobile UA. Superb for layout/touch logic; NOT device hardware — Samsung keyboard quirks need real devices.',
    },
    {
      kind: 'type-output',
      question: 'Which config block starts your app and waits for it to answer before tests run?',
      accept: ['webServer', 'webserver', 'the webServer block', 'web server'],
      placeholder: 'block name…',
      why: 'webServer — command + url + reuseExistingServer: !CI. The “was the dev server running?” failure genre dies in this block.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you this.</Scene>
      <ChatBubble who="interviewer" face="🙂">How do you handle cross-browser testing?</ChatBubble>
      <ChatBubble who="you · after this lesson" face="😊" accent indent>
        All engines from one suite, via projects. Chromium on every change, the full matrix
        nightly.
      </ChatBubble>
      <Takeaway>
        Engine-specific bugs are real but rare. <Key>Feature plus judgment is what seniority
        sounds like.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={MATRIX_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain projects to a friend: what a project is, what the array does to your suite, what devices presets contain (and emulation’s honest limits), what webServer solves, and the cross-browser budget.',
    modelAnswer:
      'A project is a named config variant — a name plus its own use bundle — and the projects array tells the runner to execute the ENTIRE suite once per variant: the same untouched spec files against chromium, firefox, and webkit, which operationalizes the one-API-three-engines promise; fifty specs and three entries means a hundred and fifty runs, and the report groups by project, so “passed everywhere except webkit” is a precise diagnosis of an engine-specific bug rather than a mystery. The devices registry extends this to hardware shapes: devices["iPhone 14"] is a preset object — viewport, touch, mobile user agent, pixel ratio — spread into use. Honestly stated, that’s emulation: a real engine wearing a phone-shaped viewport, superb for responsive layout and touch logic, but not real hardware — device-specific quirks still need devices. The webServer block starts the app with your command, waits until the URL answers before any test runs, and shuts it down after — with reuseExistingServer: !CI reusing your local dev server but always booting fresh on CI. And the judgment: most logic bugs are engine-independent, so the standard budget runs chromium on every change for fast signal and the full engine + mobile matrix nightly and pre-release — deliberate lanes, because quadrupling every run buys rare catches at a real price.',
  },
  recap: [
    'A PROJECT = a named config variant; the projects array runs the WHOLE suite per variant — 3 engines + mobile from one set of specs. Reports group by project: “failed on webkit only” = precise diagnosis.',
    'devices["iPhone 14"] = a preset bundle (viewport/touch/UA) spread into use (4.11). Emulation honesty: real engine, phone costume — layout/touch yes, device hardware no.',
    'webServer boots the app and waits before testing (reuseExistingServer: !CI — 9.4 again). Budget: chromium every change; full matrix nightly/pre-release. Projects also do setup-dependencies (11.11’s bottle) and api/smoke variants.',
  ],
}
