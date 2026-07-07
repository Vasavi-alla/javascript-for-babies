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
 * 11.1 — What Playwright is & why teams pick it
 * Manual pain → robot hands; the architecture (Node script ⇄ Playwright ⇄
 * real browsers over a bridge); every await = a command crossing; headless
 * vs headed; three engines from one API; why it beat the older generation;
 * what it is NOT. Reads the first real test with 9 known tools in it.
 */

const CODE = `import { test, expect } from "@playwright/test";

test("a user can log in", async ({ page }) => {
  await page.goto("https://shop.example.com");
  await page.getByLabel("Email").fill("ada@shop.com");
  await page.getByRole("button", { name: "Log in" })
    .click();
  await expect(page.getByText("Welcome, Ada"))
    .toBeVisible();
});`

interface View {
  mode: 'pain' | 'bridge' | 'engines' | 'familiar'
  envelopeAt?: 'script' | 'crossing' | 'browser' | null
  command?: string | null
  enginesLit?: number[]
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'pain', console: [],
    note: 'release day, forever: a human re-clicks the same login for the thousandth time — bored, slow, and skipping steps by wednesday',
  },
  {
    mode: 'bridge', envelopeAt: 'script', console: [],
    note: 'read the test aloud: it IS the manual script — goto, fill, click, check — executed by robot hands',
  },
  {
    mode: 'bridge', envelopeAt: 'crossing', command: 'click("Log in")', console: [],
    note: 'the architecture: your script is a NODE program (9.1) — commands cross a bridge to a REAL browser',
  },
  {
    mode: 'bridge', envelopeAt: 'browser', command: 'click("Log in")', console: ['✓ clicked'],
    note: 'each await = one command crossing, one result returning — 6.6’s await riding 9.6’s loop, live',
  },
  {
    mode: 'bridge', envelopeAt: 'browser', command: null, console: ['✓ clicked'],
    note: 'headless: the browser runs with NO window — full engine, no pixels on screen. Default, for speed',
    badge: '--headed opens the window so you can WATCH the robot drive. Headless for suites, headed for humans.',
  },
  {
    mode: 'engines', enginesLit: [0, 1, 2], console: [],
    note: 'one API, THREE real engines: chromium (Chrome/Edge), firefox, webkit (Safari’s engine)',
  },
  {
    mode: 'engines', enginesLit: [0, 1, 2], console: [],
    note: 'why teams picked it: the previous generation needed per-browser drivers and HAND-WRITTEN waits',
    badge: 'Playwright shipped with auto-waiting built in (11.6) + one API for all three engines + the trace recorder (11.14). The flakiness era’s exit door.',
  },
  {
    mode: 'bridge', envelopeAt: 'script', console: [],
    note: 'and what it is NOT: magic. It can only do what a user could do — if the app is broken, Playwright PROVES it, loudly',
  },
  {
    mode: 'familiar', console: [],
    note: 'count your own tools in this one test: import (8.1) · async/await (6.6) · fixtures ({ page } — 11.7) · AAA (10.3) · expect (10.4)',
  },
  {
    mode: 'familiar', console: [],
    note: 'the map of this phase: setup → config → locators → actions → waiting → structure → network → CI. Eighteen stops. Last phase. Let’s go',
    badge: 'nothing ahead is new THINKING — it’s your ten phases of tools, handed a browser',
  },
]

function PlaywrightBridge({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'pain' && (
        <g>
          <text x={220} y={80} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15}>🧍 → 🖱️ → 😐 → 🖱️ → 😩 → 🖱️ → 💤</text>
          <text x={220} y={120} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">the same login, re-clicked every release, forever</text>
          <RoughRect x={90} y={150} width={260} height={44} seed={4001} strokeWidth={2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
          <text x={220} y={177} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink)">humans get bored → steps get skipped → bugs get through</text>
        </g>
      )}

      {view.mode === 'bridge' && (
        <g>
          <RoughRect x={26} y={60} width={140} height={110} seed={4005} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={96} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">your test — a Node program</text>
          <text x={40} y={88} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">await page.goto(…)</text>
          <text x={40} y={106} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">await ….fill(…)</text>
          <text x={40} y={124} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-marker-teal)">await ….click()</text>
          <text x={40} y={142} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">await expect(…)</text>

          <line x1={170} y1={116} x2={272} y2={116} stroke="var(--color-ink-soft)" strokeWidth={2.4} strokeDasharray="7 5" strokeLinecap="round" />
          <text x={221} y={104} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">the bridge</text>

          <RoughRect x={276} y={60} width={140} height={110} seed={4006} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={346} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">a REAL browser</text>
          <text x={346} y={95} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink)">🌐 the shop page</text>
          <text x={346} y={120} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">[Email    ]</text>
          <text x={346} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">( Log in )</text>

          {view.command && (
            <motion.g key={view.envelopeAt} initial={{ x: view.envelopeAt === 'crossing' ? -60 : 0, opacity: 0 }} animate={{ x: view.envelopeAt === 'browser' ? 60 : 0, opacity: 1 }} transition={{ type: 'spring', damping: 16 }}>
              <RoughRect x={172} y={126} width={96} height={26} seed={4010} strokeWidth={1.8} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
              <text x={220} y={143} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">{view.command}</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'engines' && (
        <g>
          {['chromium', 'firefox', 'webkit'].map((engine, i) => {
            const lit = (view.enginesLit ?? []).includes(i)
            return (
              <g key={engine} opacity={lit ? 1 : 0.3}>
                <RoughRect x={40 + i * 128} y={70} width={112} height={80} seed={4020 + i} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
                <text x={96 + i * 128} y={104} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">{engine}</text>
                <text x={96 + i * 128} y={126} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">
                  {['Chrome · Edge', 'Firefox', 'Safari’s engine'][i]}
                </text>
              </g>
            )
          })}
          <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">
            one test file — all three, unchanged (11.12 runs them)
          </text>
        </g>
      )}

      {view.mode === 'familiar' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            tools in that one test you ALREADY own
          </text>
          {[
            'import { test, expect } — 8.1 named imports',
            'async ({ page }) — 6.6 + 4.11 destructuring',
            'await, six times — 9.6’s loop at work',
            'the AAA shape — 10.3 (arrange/act/assert)',
            'expect(…).toBeVisible() — 10.4’s grammar',
          ].map((line, i) => (
            <g key={line}>
              <RoughRect x={40} y={42 + i * 36} width={360} height={30} seed={4030 + i} strokeWidth={1.6} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={56} y={61 + i * 36} fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink)">✓ {line}</text>
            </g>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={4040} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={290} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={312} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const BRIDGE_EXERCISE: CodeExerciseDef = {
  id: 'l111-the-bridge',
  title: 'model the bridge rhythm',
  task: 'A Playwright test is a Node program sending commands across a bridge, ONE at a time, each awaited. The starter fakes the browser side — you write the script side, with the exact rhythm.',
  steps: [
    <>
      Keep the starter’s <code>browser</code> function — it stands in for the real browser,
      answering each command.
    </>,
    <>
      Create <code>commands</code>: the array <code>["goto /shop", "fill email", "click login"]</code>.
    </>,
    <>
      Write an async <code>runScript(commands)</code>: for each command (in order!), await the
      browser’s answer and print it. Sequential awaits — the next command must not leave until
      the previous answer returns (6.6’s pause, 9.6’s loop).
    </>,
    <>
      After the loop, print <code>script finished — exit 0</code>, then call{' '}
      <code>runScript(commands)</code>.
    </>,
  ],
  starter: `// the browser side of the bridge — keep as is:
function browser(command) {
  return Promise.resolve(command + " ✓");
}

// your script side below:
`,
  expectedOutput: ['goto /shop ✓', 'fill email ✓', 'click login ✓', 'script finished — exit 0'],
  mustUse: [
    { test: /async\s+function\s+runScript|const\s+runScript\s*=\s*async/, label: 'an async function named runScript' },
    { test: /await\s+browser\s*\(/, label: 'each command is awaited across the bridge' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+/, label: 'commands cross in order via for...of' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']goto \/shop ✓["']\s*\)/, label: 'no hard-coded answers — print what the browser returns' },
    { test: /\.forEach\s*\(/, label: 'no forEach — it can’t await in sequence (a real Playwright gotcha!)' },
  ],
  modelAnswer: `// the browser side of the bridge — keep as is:
function browser(command) {
  return Promise.resolve(command + " ✓");
}

// your script side below:
const commands = ["goto /shop", "fill email", "click login"];

async function runScript(commands) {
  for (const command of commands) {
    const result = await browser(command);
    console.log(result);
  }
  console.log("script finished — exit 0");
}

runScript(commands);`,
}

export const lesson111: LessonDef = {
  id: '11.1',
  hook: (
    <>
      <p>
        Ten phases of preparation end here. Playwright is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          robot hands for your JavaScript: a Node program that drives a REAL browser — navigating,
          typing, clicking, reading — exactly like a human tester, in seconds, never bored
        </HighlightMark>
        .
      </p>
      <p>
        Today: what it actually is (an architecture, not magic), why the industry converged on it,
        and a first test you can already read — because you built every tool in it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'manual-pain',
      caption:
        'Why this tool exists, in one scene: release day, and a human re-clicks the same login flow for the thousandth time. Humans are brilliant at judgment and terrible at repetition — by wednesday, steps get skipped; skipped steps are where 10.1’s regressions escape. Repetition is a job for a machine.',
      highlightLines: [3],
    },
    {
      id: 'robot-hands',
      caption:
        'Read the test out loud — it IS the manual script, verbatim: go to the shop, fill the email, click Log in, check the welcome appears. Same steps a human would take, written once, executed identically every time, in about two seconds. That’s the entire pitch.',
      highlightLines: [4, 5, 6, 7, 8, 9],
    },
    {
      id: 'the-architecture',
      caption:
        'Now the architecture, because it explains everything later: your test is a NODE program (9.1 — no DOM in here!). It talks across a bridge to a REAL browser process, sending commands — “click the login button” — and receiving results. Two worlds, exactly as 9.1 promised: your code in Node’s, the page in the browser’s.',
      highlightLines: [1, 3],
    },
    {
      id: 'every-await',
      caption:
        'Look how many awaits: six. Each is a command crossing the bridge — sent, parked (9.6’s loop keeps the thread free), resumed when the browser answers. EVERYTHING in Playwright is awaited, because every line is a round trip to another process. Forget an await and commands race — the classic day-one bug.',
      highlightLines: [4, 5, 6, 7, 8, 9],
    },
    {
      id: 'headless-headed',
      caption:
        'The browser on the other side usually runs HEADLESS: the full engine — real DOM, real network, real rendering (7.8’s whole pipeline) — but no window drawn on any screen. Faster, and CI machines (11.16) have no screens anyway. Add --headed and a window opens so you can watch the robot drive.',
      highlightLines: [4],
    },
    {
      id: 'three-engines',
      caption:
        'And “a real browser” means a choice of three: chromium (the engine inside Chrome and Edge), firefox, and webkit — Safari’s engine, the one that surprises everyone. ONE API, one test file, all three engines, unchanged. 11.12 runs your suite across all of them with a config array.',
      highlightLines: [1],
    },
    {
      id: 'why-it-won',
      caption:
        'Why teams migrated en masse: the previous generation (Selenium’s era) needed a separate driver per browser and HAND-WRITTEN waits — sleep(5000) everywhere, flakiness as a lifestyle. Playwright shipped with auto-waiting built in (11.6 is that story), one API for three engines, and a flight recorder for failures (11.14). It made the misery optional.',
      highlightLines: [1],
    },
    {
      id: 'what-it-isnt',
      caption:
        'Equally important — what it is NOT: magic. Playwright can only do what a user could do, through the page. It cannot fix a broken app, reach into server code, or make a slow backend fast. When the app is broken, its job is to PROVE that, loudly and with evidence. You are the judgment; it is the hands.',
      highlightLines: [8, 9],
    },
    {
      id: 'the-familiar',
      caption:
        'Now count your own tools in this one test: import { test, expect } — 8.1’s named imports from an npm package (8.2). async ({ page }) — 6.6 plus 4.11’s destructuring (page is a fixture — 11.7’s story). Six awaits — 9.6. The AAA shape — 10.3. expect — 10.4. Ten phases, one test.',
      highlightLines: [1, 3, 8, 9],
    },
    {
      id: 'phase-map',
      caption:
        'The road ahead, so you always know where you are: setup (11.2) → the config (11.3) → finding things (11.4) → acting (11.5) → waiting (11.6) → structure (11.7–11.9) → network (11.10–11.11) → scale (11.12–11.15) → CI (11.16) → graduation (11.18). Eighteen stops. Nothing ahead is new thinking — it’s your tools, handed a browser.',
      highlightLines: [1],
    },
  ],
  Viz: PlaywrightBridge,
  underTheHood: (
    <>
      <p>
        The bridge is real machinery worth naming: Playwright talks to browsers over a{' '}
        <strong>protocol</strong> — structured messages over a pipe/websocket (Chromium’s DevTools
        Protocol and equivalents). That’s why it needs its own browser builds (11.2’s big
        download): each is patched and version-matched to speak the protocol reliably.
      </p>
      <p>
        “Real input events” matters more than it sounds. When Playwright clicks, the browser
        receives a trusted, OS-level-equivalent event — hit-testing, hover states, focus, all of
        it. It’s not a JavaScript <code>el.click()</code> simulation (7.4’s dispatch). If your app
        behaves differently for real users than for synthetic events, Playwright sides with the
        users.
      </p>
      <p>
        Family history, for your industry map. Selenium (2004) pioneered the field. Puppeteer
        (Google, 2017) modernized it, for Chrome only. The Puppeteer team then built
        Playwright (Microsoft, 2020) — Puppeteer’s ideas, all engines, plus the test runner.
        When you meet Selenium at work (you will — legacy suites live long), it’s the same
        concepts with more manual labor.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Your Playwright test file runs in which world — inside the browser page, or in Node?',
      accept: ['Node', 'node', 'in Node', 'node.js', 'Node.js', 'the node world'],
      placeholder: 'which world…',
      why: 'Node (9.1) — the test is a Node program sending commands across a bridge to a separate real browser process. That’s why there’s no document in your test file, and why everything is awaited.',
    },
    {
      kind: 'type-output',
      question: 'A browser running with its full engine but no visible window is called what?',
      accept: ['headless', 'Headless', 'headless mode', 'a headless browser'],
      placeholder: 'the term…',
      why: 'Headless — real DOM, real network, real rendering, no pixels drawn. The default for suites and CI; --headed opens the window when a human wants to watch.',
    },
    {
      kind: 'type-output',
      question: 'Name the three browser engines Playwright drives with one API.',
      accept: ['chromium, firefox, webkit', 'chromium firefox webkit', 'Chromium, Firefox, WebKit', 'chromium, firefox and webkit', 'webkit, chromium, firefox'],
      placeholder: 'engine, engine, engine…',
      why: 'Chromium (Chrome/Edge), Firefox, and WebKit (Safari’s engine — the one that surprises everyone). One test file runs on all three, unchanged.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you to explain Playwright.</Scene>
      <ChatBubble who="interviewer" face="🙂">Explain Playwright’s architecture.</ChatBubble>
      <ChatBubble who="you · after this lesson" face="😊" accent indent>
        A Node test runner driving real browser processes over a wire protocol. Every action is
        awaited across that boundary.
      </ChatBubble>
      <Takeaway>
        Most candidates just say “it’s a testing tool.” <Key>Naming the architecture is what
        gets remembered.</Key> It also explains why auto-waiting and traces are even possible.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={BRIDGE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain Playwright to a friend who’s never heard of it: the problem it solves, the architecture (where the test runs, what crosses the bridge, why everything is awaited), headless vs headed, and why it displaced the older generation.',
    modelAnswer:
      'Playwright solves the repetition problem: humans re-clicking the same flows every release get bored and skip steps, and that’s where regressions escape. It gives your JavaScript robot hands — a test is the manual script written as code: go to the page, fill the email, click login, check the welcome text. Architecturally, the test is a Node program — no DOM in it at all — that talks across a bridge to a separate, REAL browser process, sending commands and receiving results over a wire protocol. That’s why every line is awaited: each action is a round trip to another process — the command parks, Node’s event loop keeps the thread free, and the test resumes when the browser answers. The browser usually runs headless — full engine, real rendering and network, just no window — which is faster and what CI machines need; --headed opens a window to watch. One API drives three real engines: chromium, firefox, and webkit, Safari’s engine. It displaced the older generation because Selenium-era tools needed per-browser drivers and hand-written sleeps — flakiness as a lifestyle — while Playwright shipped auto-waiting built in, one API for all engines, and a trace recorder for failures. And it isn’t magic: it can only do what a user could do — when the app is broken, its job is to prove it loudly.',
  },
  recap: [
    'Playwright = robot hands: a NODE program (9.1) driving a REAL browser across a bridge — every action is an awaited round trip (which is why forgetting an await is the classic day-one bug).',
    'Headless = full engine, no window (default; CI has no screens) · --headed to watch. One API, three engines: chromium, firefox, webkit — the Safari-engine surprises included.',
    'It won on: built-in auto-waiting (11.6), one API for three engines, traces (11.14). It is NOT magic: it does what a user could do and PROVES breakage — you supply the judgment.',
  ],
}
