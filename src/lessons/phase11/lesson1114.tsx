import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.14 — Debugging failing tests
 * Red on CI with no screen to watch: the evidence kit (screenshot, video,
 * trace per 11.3's policies). The trace = a flight recorder: time-travel
 * DOM snapshots + network + console. The reading METHOD (assertion →
 * snapshot → locator → network → console). UI mode locally; page.pause()
 * as 8.3's breakpoint, browser edition.
 */

const CODE = `// red on CI — you weren't there. Evidence:
// test-results/…/test-failed-1.png   screenshot
// test-results/…/video.webm          the film
// test-results/…/trace.zip           flight recorder

// $ npx playwright show-trace trace.zip

// locally: time-travel debugging
// $ npx playwright test --ui

// mid-test breakpoint (8.3, browser edition):
await page.pause();

// the policies that captured all this (11.3):
//   trace: "on-first-retry"
//   screenshot: "only-on-failure"
//   video: "retain-on-failure"`

interface View {
  mode: 'kit' | 'trace' | 'method' | 'local'
  tab?: 'actions' | 'snapshot' | 'network' | 'console' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'kit', console: [],
    note: 'the scenario that defines the job: green locally, RED on CI — no screen, no replay, 2000km away. You need EVIDENCE, not vibes',
  },
  {
    mode: 'kit', console: [],
    note: 'the kit, captured by 11.3’s policies into test-results/ (9.5’s promise kept): a screenshot, a video, and the star — trace.zip',
  },
  {
    mode: 'kit', console: [],
    note: 'the screenshot = the moment of death, one frame. First glance: is this even the right PAGE? (Wrong-env failures die here in seconds)',
  },
  {
    mode: 'trace', tab: 'actions', console: [],
    note: 'the TRACE is a flight recorder: every action on a timeline — with DOM SNAPSHOTS before and after each one',
  },
  {
    mode: 'trace', tab: 'snapshot', console: [],
    note: 'click any action → see the page AS IT WAS, fully inspectable — not a picture: the actual DOM, hoverable, measurable. Time travel',
    badge: 'the locator picker works inside snapshots too — point at the element and it writes the best locator (11.4’s ladder, automated)',
  },
  {
    mode: 'trace', tab: 'network', console: [],
    note: 'the network tab: every request the page made (6.7), with status and timing — did the API even answer?',
  },
  {
    mode: 'trace', tab: 'console', console: [],
    note: 'and the console tab: the page’s own errors (0.5’s messages, captured) — a JS crash in the app often explains everything',
  },
  {
    mode: 'method', console: [],
    note: 'the reading METHOD, in order: ① the failed assertion — what did it expect? ② its BEFORE snapshot — what did the page actually show?',
  },
  {
    mode: 'method', console: [],
    note: '③ the locator — what did it match (or not)? ④ network — did the data arrive? ⑤ console — did the app crash? Five questions, one culprit',
    badge: '8.3’s discipline verbatim: evidence, not guessing. The trace is the debugger’s frozen world, recorded instead of live.',
  },
  {
    mode: 'local', console: ['$ npx playwright test --ui'],
    note: 'locally, richer still: UI MODE — watch mode (10.5) + live trace: click a test, watch it run, edit code, it re-runs. The daily cockpit',
  },
  {
    mode: 'local', console: ['await page.pause()'],
    note: 'and page.pause() = 8.3’s breakpoint, browser edition: the test freezes, an inspector opens — step actions, try locators live on the real page',
  },
]

function TraceViewer({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'kit' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the evidence kit, in test-results/
          </text>
          {[
            { icon: '📸', name: 'test-failed-1.png', sub: 'the moment of death' },
            { icon: '🎞️', name: 'video.webm', sub: 'the whole test, as film' },
            { icon: '✈️', name: 'trace.zip', sub: 'the flight recorder — the star' },
          ].map((item, i) => (
            <g key={item.name}>
              <RoughRect x={60} y={44 + i * 60} width={320} height={48} seed={5301 + i} strokeWidth={i === 2 ? 2.6 : 1.8} stroke={i === 2 ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={i === 2 ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
              <text x={84} y={73 + i * 60} fontFamily="var(--font-hand)" fontSize={13}>{item.icon}</text>
              <text x={116} y={66 + i * 60} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{item.name}</text>
              <text x={116} y={83 + i * 60} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{item.sub}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'trace' && (
        <g>
          <text x={24} y={24} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">
            the trace viewer
          </text>
          {/* timeline filmstrip */}
          <RoughRect x={30} y={34} width={380} height={36} seed={5310} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          {['goto', 'fill', 'click', 'expect ✗'].map((action, i) => (
            <g key={action}>
              <RoughRect x={44 + i * 94} y={40} width={82} height={24} seed={5315 + i} strokeWidth={action.includes('✗') ? 2.2 : 1.4} stroke={action.includes('✗') ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${action.includes('✗') ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} 8%, transparent)`} fillStyle="solid" />
              <text x={85 + i * 94} y={56} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{action}</text>
            </g>
          ))}
          {/* tabs */}
          {(['snapshot', 'network', 'console'] as const).map((tab, i) => {
            const active = view.tab === tab || (view.tab === 'actions' && i === 0)
            return (
              <g key={tab}>
                <RoughRect x={30 + i * 100} y={84} width={92} height={26} seed={5320 + i} strokeWidth={active ? 2.2 : 1.3} stroke={active ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={active ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={76 + i * 100} y={101} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">{tab}</text>
              </g>
            )
          })}
          {/* pane */}
          <RoughRect x={30} y={120} width={380} height={104} seed={5330} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          {view.tab === 'snapshot' || view.tab === 'actions' ? (
            <g>
              <text x={220} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink)">the page AS IT WAS at that action</text>
              <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">[ Search: "mug" ]  ( Search )  …spinner still visible…</text>
              <text x={220} y={196} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-marker-teal)">real DOM — inspectable, not a picture</text>
            </g>
          ) : view.tab === 'network' ? (
            <g>
              <text x={60} y={150} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">GET /api/search?q=mug</text>
              <text x={360} y={150} textAnchor="end" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-coral)">500 ✗</text>
              <text x={60} y={172} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">GET /api/session</text>
              <text x={360} y={172} textAnchor="end" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-teal)">200</text>
              <text x={220} y={200} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">…the API never answered with results</text>
            </g>
          ) : (
            <g>
              <text x={60} y={155} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-coral)">TypeError: Cannot read properties of undefined</text>
              <text x={60} y={175} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">    at renderResults (app.js:214)</text>
              <text x={220} y={202} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">the app crashed — 0.5’s anatomy, captured in flight</text>
            </g>
          )}
        </g>
      )}

      {view.mode === 'method' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the five-question method
          </text>
          {['① the failed assertion — expected what?', '② its BEFORE snapshot — page showed what?', '③ the locator — matched what?', '④ network — did the data arrive?', '⑤ console — did the app crash?'].map((q, i) => (
            <g key={q}>
              <RoughRect x={60} y={40 + i * 40} width={320} height={32} seed={5340 + i} strokeWidth={1.7} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={76} y={60 + i * 40} fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">{q}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'local' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the local cockpit
          </text>
          <RoughRect x={40} y={44} width={175} height={130} seed={5350} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={127} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">--ui mode</text>
          <text x={127} y={96} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">watch mode + live trace</text>
          <text x={127} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">click a test → watch it run</text>
          <text x={127} y={136} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">edit → auto re-run</text>
          <RoughRect x={225} y={44} width={175} height={130} seed={5351} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={312} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">page.pause()</text>
          <text x={312} y={96} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">the test FREEZES mid-flight</text>
          <text x={312} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">inspector opens: step, resume</text>
          <text x={312} y={136} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">try locators on the live page</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={5360} color="var(--color-pencil-blue)" />
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

const DIAGNOSE_EXERCISE: CodeExerciseDef = {
  id: 'l1114-trace-reader',
  title: 'read the flight recorder',
  task: 'The starter is a captured trace (as data). Write the diagnosis routine that walks the five-question method and names the true culprit — the way you will at work, weekly.',
  steps: [
    <>
      Keep the starter’s <code>trace</code> object: actions (with an ok flag), network entries,
      and console errors.
    </>,
    <>
      Question ①: find the first action where <code>ok</code> is false (4.10’s find) — print{' '}
      <code>failed at: NAME</code>.
    </>,
    <>
      Question ④: find any network entry with status ≥ 500 — print{' '}
      <code>network: 500 from /api/search</code> (built from the found entry).
    </>,
    <>
      Verdict: if a 5xx exists, the app wasn’t the bug’s author — print{' '}
      <code>diagnosis: backend failure, not a locator bug</code>.
    </>,
  ],
  starter: `// a captured trace — keep as is:
const trace = {
  actions: [
    { name: "goto /shop", ok: true },
    { name: "fill search", ok: true },
    { name: "expect 12 results", ok: false },
  ],
  network: [
    { url: "/api/session", status: 200 },
    { url: "/api/search", status: 500 },
  ],
  console: [],
};

// your diagnosis below:
`,
  expectedOutput: ['failed at: expect 12 results', 'network: 500 from /api/search', 'diagnosis: backend failure, not a locator bug'],
  mustUse: [
    { test: /\.find\s*\(/, label: 'the culprit hunt uses .find' },
    { test: /!\s*\w+\.ok|\.ok\s*===\s*false/, label: 'the failed action is found by its ok flag' },
    { test: />=\s*500|===\s*500/, label: 'the network check looks for 5xx' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']failed at: expect 12 results["']\s*\)/, label: 'no hard-coded findings — read them from the trace' },
  ],
  modelAnswer: `// a captured trace — keep as is:
const trace = {
  actions: [
    { name: "goto /shop", ok: true },
    { name: "fill search", ok: true },
    { name: "expect 12 results", ok: false },
  ],
  network: [
    { url: "/api/session", status: 200 },
    { url: "/api/search", status: 500 },
  ],
  console: [],
};

// your diagnosis below:
const failed = trace.actions.find((a) => !a.ok);
console.log("failed at: " + failed.name);

const serverError = trace.network.find((n) => n.status >= 500);
console.log("network: " + serverError.status + " from " + serverError.url);

if (serverError) {
  console.log("diagnosis: backend failure, not a locator bug");
}`,
}

export const lesson1114: LessonDef = {
  id: '11.14',
  hook: (
    <>
      <p>
        The defining scenario of the job: the suite is green on your machine and{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          RED on CI — where there was no screen, no human, and no replay… except the evidence kit
          your config has been quietly collecting
        </HighlightMark>
        . Today: the trace — a flight recorder with time-travel — and the five-question method
        that turns any red into a diagnosis.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'red-on-ci',
      caption:
        'Set the scene honestly: 11.16’s robot ran your suite at 3am on a machine that no longer exists. One test is red. You cannot “just look” — there is nothing to look AT. Every debugging skill you have (8.3!) needs evidence to grip. Playwright’s answer: record everything worth gripping.',
      highlightLines: [1],
    },
    {
      id: 'the-kit',
      caption:
        'The kit, captured by 11.3’s evidence policies into test-results/ (9.5’s folder promise, kept): a screenshot at failure, a video of the run, and the star witness — trace.zip. On CI these upload as artifacts (11.16), surviving the machine’s death.',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'screenshot-first',
      caption:
        'Triage order: the SCREENSHOT first — one frame, the moment of death. It answers the fastest question: is this even the right page? A login screen where the cart should be = env/auth problem (11.11’s stale bottle!), diagnosed in five seconds without opening anything else.',
      highlightLines: [2],
    },
    {
      id: 'the-trace',
      caption:
        'Then the star: npx playwright show-trace trace.zip opens the FLIGHT RECORDER — every action on a timeline filmstrip, and for EACH action, DOM snapshots from before and after it. Not screenshots: the actual DOM, recorded.',
      highlightLines: [4, 6],
    },
    {
      id: 'time-travel',
      caption:
        'Click any action and you see the page AS IT WAS at that instant — inspectable, hoverable, measurable. This is time travel for debugging: “what did the page look like when the click landed?” stops being archaeology and becomes… clicking. (The locator picker works inside snapshots too — point at an element, get 11.4’s best locator, written for you.)',
      highlightLines: [6],
    },
    {
      id: 'network-tab',
      caption:
        'The trace’s network tab: every request the page made during the test (6.7’s envelopes, logged) with status and timing. The single most common CI-only failure — “the API answered 500 on the shared staging box” — is one glance here. Your test was innocent; the backend confessed.',
      highlightLines: [4],
    },
    {
      id: 'console-tab',
      caption:
        'And the console tab: the PAGE’s own JavaScript errors, captured in flight — 0.5’s anatomy, recorded. An uncaught TypeError in the app at the exact moment your assertion failed usually IS the story: the app crashed; your test merely noticed.',
      highlightLines: [4],
    },
    {
      id: 'the-method-1',
      caption:
        'Now the METHOD — because evidence without method is a pile. Question ①: the failed assertion — what exactly did it expect? (11.6’s message says: expected visible, last saw hidden.) Question ②: that assertion’s BEFORE snapshot — what did the page actually show? Spinner still up? Empty list? Error banner?',
      highlightLines: [6],
    },
    {
      id: 'the-method-2',
      caption:
        'Question ③: the locator — did it match nothing (wrong page? renamed?) or the WRONG thing (strict-mode cousin)? Question ④: network — did the data even arrive? Question ⑤: console — did the app crash? Five questions, in order, one culprit. It’s 8.3’s discipline verbatim: evidence, never guessing.',
      highlightLines: [6],
    },
    {
      id: 'ui-mode',
      caption:
        'Locally you get the richer cockpit: npx playwright test --ui — 10.5’s watch mode fused with a LIVE trace viewer: click a test, watch it run action by action, edit your code, it re-runs. Most daily development happens in this window once you’ve tasted it.',
      highlightLines: [8, 9],
    },
    {
      id: 'pause',
      caption:
        'And for the deepest local digs: await page.pause() — 8.3’s breakpoint, browser edition. The test FREEZES mid-flight, an inspector opens on the live page: step through remaining actions, try locator expressions against the real DOM, resume when satisfied. Never commit it (11.13’s .only cousin) — it’s a debugging tool wearing an await.',
      highlightLines: [11],
    },
  ],
  Viz: TraceViewer,
  underTheHood: (
    <>
      <p>
        Why <code>trace: "on-first-retry"</code> is the beloved default: recording costs a little
        speed, so the first (usually passing) attempt runs unrecorded — but when a test fails and
        retries (11.15), the RETRY records everything. You pay for evidence exactly when evidence
        is needed. Flip to <code>"on"</code> temporarily when hunting something rare.
      </p>
      <p>
        The trace also captures <code>test.step</code> chapters (11.13) — a well-stepped long
        test reads as a table of contents in the viewer. This is where that hygiene habit pays
        its dividend: failures name chapters, chapters jump to snapshots.
      </p>
      <p>
        The HTML report (11.2) embeds all of this: on CI, download the report artifact, open it,
        click the red test — screenshot, video, and trace are one click deep. 11.16 wires the
        upload; you already know how to read everything inside.
      </p>
      <p>
        Job note: “walk me through debugging a CI-only failure” is THE senior-signal interview
        question in this field. You now own the complete answer: artifacts survive the machine
        (screenshot → right page?; trace → five questions: assertion, snapshot, locator, network,
        console), reproduce locally with --ui if needed, and the usual verdicts — stale auth
        bottle, backend 5xx, or a real race the trace timeline exposes. That answer, delivered
        calmly, reads as years of experience.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Which artifact lets you inspect the page’s ACTUAL DOM as it was at each action — screenshot, video, or trace?',
      accept: ['trace', 'the trace', 'trace.zip', 'the trace file'],
      placeholder: 'which…',
      why: 'The trace — a flight recorder with before/after DOM snapshots per action: inspectable time travel, not pictures. Screenshots freeze one frame; video shows but can’t be inspected.',
    },
    {
      kind: 'type-output',
      question: 'The trace’s network tab shows /api/search answered 500 right before your assertion failed. Whose bug is it likely — your locator or the backend?',
      accept: ['the backend', 'backend', 'the server', 'backend failure', 'the backend’s', 'server'],
      placeholder: 'whose…',
      why: 'The backend — the data never arrived, so the UI never showed it, so your (correct) assertion failed. The most common CI-only failure, diagnosed in one glance at the network tab.',
    },
    {
      kind: 'type-output',
      question: 'Which command opens the local cockpit — watch mode fused with a live trace viewer?',
      accept: ['npx playwright test --ui', '--ui', 'playwright test --ui', 'test --ui', 'ui mode'],
      placeholder: 'the command…',
      why: 'npx playwright test --ui — click a test, watch it run, edit, auto re-run, inspect any action’s snapshot. Daily development lives here once tasted.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DIAGNOSE_EXERCISE} />,
  teachBack: {
    prompt:
      'Walk a friend through debugging a CI-only red: the evidence kit and what each piece answers, the trace’s three panes, the five-question method in order, and the two local tools.',
    modelAnswer:
      'A CI-only red means the failure happened on a machine with no screen that no longer exists — so debugging runs on evidence the config collected: a screenshot at the moment of failure, a video of the run, and the trace, all landing in test-results and uploaded as CI artifacts. Triage starts with the screenshot — one frame answering “is this even the right page?”, which catches auth and environment problems in seconds. The star is the trace: a flight recorder showing every action on a timeline with before-and-after DOM snapshots — click an action and inspect the page as it actually was, real DOM, not a picture — plus a network tab logging every request with its status, and a console tab capturing the app’s own JavaScript errors. The method is five questions in order: what did the failed assertion expect; what does its before-snapshot actually show; what did the locator match or fail to match; did the network deliver the data — a 500 from the API right before the failure means the backend confessed and my test was innocent; and did the app’s console record a crash. Locally, two richer tools: --ui mode, watch mode fused with a live trace where edits re-run instantly, and page.pause(), the browser edition of a breakpoint — the test freezes and an inspector opens on the live page to step actions and try locators. Evidence, in order, never guessing.',
  },
  recap: [
    'CI reds are debugged from EVIDENCE: screenshot (right page? — 5-second auth/env triage), video, and the TRACE: a flight recorder with per-action before/after DOM snapshots (inspectable time travel), network log, and the app’s console errors.',
    'The five-question method, in order: assertion expected? → before-snapshot showed? → locator matched? → network delivered? → app crashed? One culprit. (8.3’s evidence discipline, browser edition.)',
    'Locally: --ui mode (watch + live trace = the daily cockpit) and page.pause() (a browser breakpoint — never commit it). trace: "on-first-retry" = pay for evidence exactly when needed.',
  ],
}
