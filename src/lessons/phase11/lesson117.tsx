import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.7 — Fixtures & hooks
 * Where { page } comes from: fixtures = prepared resources injected by
 * name (4.11 destructuring), each test in a FRESH context (isolation with
 * machinery). Hooks (beforeEach/afterEach) vs fixtures; custom fixtures
 * via extend + the use() sandwich; laziness; 10.6's injection promoted to
 * infrastructure.
 */

const CODE = `import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("search filters the list", async ({ page }) => {
  // page: fresh browser context, navigated by the hook
});

// a CUSTOM fixture: a logged-in page
const testWithShopper = test.extend({
  shopper: async ({ page }, use) => {
    await page.goto("/login");            // setup
    await page.getByLabel("Email").fill("t@shop.com");
    await page.getByRole("button", { name: "Log in" })
      .click();
    await use(page);                       // the test runs
    // teardown would go here
  },
});

testWithShopper("cart persists",
  async ({ shopper }) => { /* born logged in */ });`

interface View {
  mode: 'mystery' | 'isolation' | 'hooks' | 'sandwich' | 'lazy'
  contexts?: Array<{ test: string; state: string }>
  sandwichPhase?: 'setup' | 'use' | 'teardown' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'mystery', console: [],
    note: 'the day-one mystery: { page } — you never created it. Who hands it in?',
  },
  {
    mode: 'mystery', console: [],
    note: 'the answer: a FIXTURE — a prepared resource the runner builds and INJECTS by name. The { page } is 4.11’s destructuring, on a delivery',
    badge: '10.6 called this dependency injection — hand dependencies in, and they become swappable. Playwright made it infrastructure.',
  },
  {
    mode: 'isolation', contexts: [{ test: 'test 1', state: 'fresh context #1' }, { test: 'test 2', state: 'fresh context #2' }, { test: 'test 3', state: 'fresh context #3' }], console: [],
    note: 'the page arrives inside a FRESH browser context per test: cookies, localStorage, session — all zeroed. Every test, a clean world',
  },
  {
    mode: 'isolation', contexts: [{ test: 'test 1', state: 'fresh context #1' }, { test: 'test 2', state: 'fresh context #2' }, { test: 'test 3', state: 'fresh context #3' }], console: [],
    note: 'a context = an incognito profile: CHEAP (milliseconds). The browser process itself is heavy and SHARED. Cheap isolation is what makes it affordable',
    badge: 'this is 10.5’s “tests run in isolation” promise with real machinery — and the prerequisite for 11.15’s parallelism: no shared state, no collisions',
  },
  {
    mode: 'hooks', console: ['beforeEach → test 1', 'beforeEach → test 2'],
    note: 'HOOKS: test.beforeEach runs before every test in the file — the shared Arrange (10.3). afterEach cleans up; beforeAll runs once (sparingly!)',
  },
  {
    mode: 'hooks', console: [],
    note: 'hooks vs fixtures: hooks are per-file convenience; fixtures are REUSABLE, composable, and only built when asked for',
  },
  {
    mode: 'sandwich', sandwichPhase: 'setup', console: ['goto /login', 'fill email', 'click Log in'],
    note: 'a CUSTOM fixture via test.extend: everything before use(page) is SETUP — here, a real UI login',
  },
  {
    mode: 'sandwich', sandwichPhase: 'use', console: ['(the test body runs here)'],
    note: 'await use(page) — the fixture PAUSES and the test runs with the prepared resource. The fixture is a sandwich; the test is the filling',
  },
  {
    mode: 'sandwich', sandwichPhase: 'teardown', console: ['(cleanup after use — logout, delete data…)'],
    note: 'code AFTER use() is TEARDOWN — guaranteed cleanup, even when the test failed. Setup and cleanup live together, forever paired',
  },
  {
    mode: 'lazy', console: [],
    note: 'fixtures are LAZY: built only when a test asks by name. Tests that don’t say { shopper } never pay for a login. Declare needs; the runner supplies',
    badge: 'this scales beautifully: a suite defines shopper, admin, apiClient… and each test names exactly what it needs — nothing more runs',
  },
]

function FixtureBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'mystery' && (
        <g>
          <RoughRect x={70} y={60} width={300} height={60} seed={4601} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={86} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">test("…", async ({'{ page }'}) =&gt; {'{'}</text>
          <text x={220} y={106} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-marker-coral)">↑ who made this?</text>
          <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect x={110} y={150} width={220} height={44} seed={4602} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
            <text x={220} y={170} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">the RUNNER built it — a fixture,</text>
            <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">injected because you named it</text>
          </motion.g>
        </g>
      )}

      {view.mode === 'isolation' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            one browser process · a fresh context per test
          </text>
          <RoughRect x={30} y={40} width={380} height={40} seed={4610} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={65} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink)">the browser (heavy, shared — launched once)</text>
          {(view.contexts ?? []).map((ctx, i) => (
            <motion.g key={ctx.test} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <RoughRect x={40 + i * 128} y={100} width={116} height={70} seed={4615 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={98 + i * 128} y={124} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">{ctx.test}</text>
              <text x={98 + i * 128} y={144} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">{ctx.state}</text>
              <text x={98 + i * 128} y={160} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">cookies: {'{}'} · storage: {'{}'}</text>
            </motion.g>
          ))}
        </g>
      )}

      {view.mode === 'hooks' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            hooks: the file’s shared beats
          </text>
          {['beforeEach → goto("/")', 'test 1 body', 'beforeEach → goto("/")', 'test 2 body'].map((line, i) => (
            <g key={i}>
              <RoughRect x={80} y={44 + i * 44} width={280} height={34} seed={4620 + i} strokeWidth={1.8} stroke={line.startsWith('before') ? 'var(--color-pencil-blue)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${line.startsWith('before') ? 'var(--color-pencil-blue)' : 'var(--color-marker-teal)'} 7%, transparent)`} fillStyle="solid" />
              <text x={220} y={66 + i * 44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{line}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'sandwich' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the fixture sandwich
          </text>
          {[
            { key: 'setup', label: 'SETUP — before use()', sub: 'log in, prepare' },
            { key: 'use', label: 'await use(page) — the TEST runs', sub: 'the filling' },
            { key: 'teardown', label: 'TEARDOWN — after use()', sub: 'guaranteed cleanup' },
          ].map((layer, i) => {
            const hot = view.sandwichPhase === layer.key
            return (
              <g key={layer.key} opacity={hot ? 1 : 0.35}>
                <RoughRect x={70} y={44 + i * 56} width={300} height={46} seed={4630 + i} strokeWidth={hot ? 2.6 : 1.6} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={220} y={64 + i * 56} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">{layer.label}</text>
                <text x={220} y={82 + i * 56} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{layer.sub}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'lazy' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            lazy: built only when named
          </text>
          {[
            { name: 'test A asks { page }', built: 'page built · shopper NOT built' },
            { name: 'test B asks { shopper }', built: 'page built → shopper built on top' },
          ].map((row, i) => (
            <g key={row.name}>
              <RoughRect x={50} y={50 + i * 70} width={340} height={54} seed={4640 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={220} y={72 + i * 70} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{row.name}</text>
              <text x={220} y={92 + i * 70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">{row.built}</text>
            </g>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4650} color="var(--color-pencil-blue)" />
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

const FIXTURE_EXERCISE: CodeExerciseDef = {
  id: 'l117-fixture-sandwich',
  title: 'build the fixture sandwich',
  task: 'The use() pattern in miniature: a fixture that sets up, hands the resource to the test, and tears down — GUARANTEED, in that order, with the test as the filling.',
  steps: [
    <>
      Write <code>shopperFixture(testFn)</code>: print <code>setup: log in</code>, build the
      resource <code>const shopper = "logged-in page"</code>, call <code>testFn(shopper)</code>{' '}
      (the use() moment), then print <code>teardown: log out</code>.
    </>,
    <>
      Write two “tests” as functions: one printing <code>test A sees: logged-in page</code>{' '}
      (build it from the parameter — 3.8’s functions-as-values carry the day), one printing{' '}
      <code>test B sees: logged-in page</code>.
    </>,
    <>
      Run both through the fixture — each test gets the full sandwich: setup, filling, teardown,
      twice over.
    </>,
  ],
  starter: '',
  expectedOutput: ['setup: log in', 'test A sees: logged-in page', 'teardown: log out', 'setup: log in', 'test B sees: logged-in page', 'teardown: log out'],
  mustUse: [
    { test: /function\s+shopperFixture\s*\(|const\s+shopperFixture\s*=/, label: 'a fixture function named shopperFixture' },
    { test: /testFn\s*\(\s*\w+\s*\)/, label: 'the test runs INSIDE the fixture, handed the resource' },
    { test: /shopperFixture\s*\(/, label: 'tests are run through the fixture' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']test A sees: logged-in page["']\s*\)/, label: 'the test must build its line from the handed-in resource, not hard-code it' },
  ],
  modelAnswer: `function shopperFixture(testFn) {
  console.log("setup: log in");
  const shopper = "logged-in page";
  testFn(shopper);
  console.log("teardown: log out");
}

function testA(shopper) {
  console.log("test A sees: " + shopper);
}

function testB(shopper) {
  console.log("test B sees: " + shopper);
}

shopperFixture(testA);
shopperFixture(testB);`,
}

export const lesson117: LessonDef = {
  id: '11.7',
  hook: (
    <>
      <p>
        Since 11.1 you’ve typed <code>async ({'{ page }'})</code> without asking the obvious
        question: you never created <code>page</code> — who hands it in?{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Fixtures: prepared resources the runner builds and injects by name — each test receiving
          a genuinely FRESH browser world
        </HighlightMark>
        . 10.6’s dependency injection, promoted to infrastructure.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-mystery',
      caption:
        'Start with the mystery hiding in plain sight: every test signature says async ({ page }) — 4.11’s destructuring — but no line of yours ever created a page. Something is building it and passing it in. That something is the fixture system, and it’s the runner’s deepest idea.',
      highlightLines: [7],
    },
    {
      id: 'fixtures-defined',
      caption:
        'A FIXTURE is a prepared resource, built by the runner and injected into your test because you NAMED it in the parameters. page is one; browser and context exist too; request (9.7’s payoff) is another. You declare needs; the runner supplies. 10.6 taught this move as dependency injection — here it’s the architecture.',
      highlightLines: [7],
    },
    {
      id: 'isolation',
      caption:
        'And the page you receive is not just any page: it lives in a FRESH BROWSER CONTEXT created for YOUR test alone — cookies empty, localStorage empty (7.7’s stores, zeroed), no session, no history. Test 2 cannot be poisoned by test 1’s leftovers, structurally.',
      highlightLines: [7, 8],
    },
    {
      id: 'context-economics',
      caption:
        'The economics that make this affordable: a CONTEXT is like an incognito profile — creating one costs milliseconds. The BROWSER process (the heavy thing, launched once per worker) is shared underneath. Cheap contexts are why per-test isolation isn’t a luxury — and why 11.15’s parallelism will be safe.',
      highlightLines: [7],
    },
    {
      id: 'hooks',
      caption:
        'Now HOOKS, the simpler cousin: test.beforeEach(fn) runs before every test in the file — the shared Arrange from 10.3, written once. afterEach cleans up after each. beforeAll/afterAll run once per file — use sparingly: whatever they set up is SHARED, and shared state is coupling (10.6’s warning).',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'hooks-vs-fixtures',
      caption:
        'Hooks versus fixtures, the working distinction: hooks are per-FILE convenience — quick, local, fine for a goto("/"). Fixtures are REUSABLE across the whole suite, composable (fixtures can use other fixtures), and lazy. Rule of thumb: setup needed in one file → hook; setup needed by many → fixture.',
      highlightLines: [3, 12],
    },
    {
      id: 'custom-fixture-setup',
      caption:
        'Building your own: test.extend({ shopper: … }) defines a NEW injectable name. Read the shopper fixture’s body: everything BEFORE use(page) is SETUP — here a real UI login: goto, fill, click. This runs before any test that asks for shopper.',
      highlightLines: [12, 13, 14, 15, 16, 17],
    },
    {
      id: 'the-use-sandwich',
      caption:
        'Then the strangest, most important line: await use(page). The fixture PAUSES, and the test runs with the prepared resource — the fixture is a sandwich, the test is the filling. This inversion (the fixture wraps the test) is what makes the next step possible.',
      highlightLines: [18],
    },
    {
      id: 'teardown',
      caption:
        'Because code AFTER use() is TEARDOWN — and it runs even when the test FAILED. Log out, delete created data, close what you opened: cleanup lives in the same function as its setup, forever paired. (Compare: a separate afterEach can drift from its beforeEach; a sandwich can’t drift from itself.)',
      highlightLines: [19],
    },
    {
      id: 'laziness',
      caption:
        'Last property, quietly powerful: fixtures are LAZY — built only when a test names them. A test asking only { page } never pays for shopper’s login. A mature suite defines shopper, admin, apiClient, seededCart… and every test declares exactly what it needs. Nothing more runs. That’s the whole design.',
      highlightLines: [23, 24],
    },
  ],
  Viz: FixtureBoard,
  underTheHood: (
    <>
      <p>
        Fixtures form a dependency GRAPH (8.1’s picture, again): your shopper uses page, page
        uses context, context uses browser. The runner resolves the chain lazily and tears it down
        in reverse order — construction and destruction as mirror images, guaranteed.
      </p>
      <p>
        Fixtures have <strong>scopes</strong>. The default is per-test.{' '}
        <code>{'{ scope: "worker" }'}</code> builds once per worker process (11.15) — right for
        expensive resources safe to share across tests in one worker, like a database connection.
        Per-test freshness stays the default because isolation is the prize.
      </p>
      <p>
        The UI-login-per-test shown here is honest but expensive — which is exactly why 11.11
        exists: log in ONCE, bottle the session (storageState), and hand every context the bottle.
        The shopper fixture then becomes a one-liner that loads state instead of driving the
        login form. Same injection shape, hundred× cheaper.
      </p>
      <p>
        <strong>💼 On the job —</strong> reading an unfamiliar suite, open its{' '}
        <code>fixtures.ts</code> first: it’s the cast of characters. Maturity is visible there.
        Good ones read like a menu of prepared worlds (shopper, admin, emptyCart,
        seededCatalog); bad ones have one giant fixture doing everything for everyone.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Test 1 sets a cookie and adds items to localStorage. What does test 2’s page see in them?',
      accept: ['nothing', 'empty', 'nothing — fresh context', 'they are empty', 'zeroed', 'clean/empty'],
      placeholder: 'what does it see…',
      why: 'Nothing — each test gets a page in a FRESH browser context: cookies and storage zeroed (7.7’s stores, reset). Isolation is structural, not polite convention.',
    },
    {
      kind: 'type-output',
      question: 'In a custom fixture, code written AFTER await use(page) runs when?',
      accept: ['after the test', 'teardown', 'after the test runs', 'when the test finishes', 'after the test, even on failure', 'as teardown'],
      placeholder: 'when…',
      why: 'After the test — it’s the teardown half of the sandwich, and it runs even when the test failed. Setup and cleanup live paired in one function.',
    },
    {
      kind: 'type-output',
      question: 'A test’s parameters say only ({ page }). Does the shopper fixture’s login run for it? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — fixtures are LAZY: built only when a test names them. Declare needs; the runner supplies exactly those and nothing more.',
    },
  ],
  PlayExtra: () => <CodeExercise def={FIXTURE_EXERCISE} />,
  teachBack: {
    prompt:
      'Solve the { page } mystery for a friend: what a fixture is, what “fresh context per test” means and why it’s cheap, hooks vs fixtures, and the use() sandwich (with why teardown-after-use beats a separate afterEach).',
    modelAnswer:
      'The page nobody created is a fixture: a prepared resource the runner builds and injects because the test named it in its parameters — dependency injection from 10.6, promoted to infrastructure, with 4.11’s destructuring as the delivery door. The page arrives inside a fresh browser context created for that test alone — an incognito-profile-like world with cookies, localStorage, and session all zeroed — so no test can be poisoned by another’s leftovers. It’s affordable because contexts are cheap (milliseconds) while the heavy browser process is shared underneath — and that structural isolation is also what will make parallel workers safe. Hooks are the simpler cousin: beforeEach is the file’s shared Arrange, afterEach its cleanup — per-file convenience — while fixtures are reusable across the suite, composable, and lazy: built only when a test names them, so a test asking for { page } never pays for a shopper login. Custom fixtures use the use() sandwich: everything before await use(resource) is setup, the test runs as the filling, and everything after is teardown — guaranteed even when the test fails. That pairing beats separate before/after hooks because setup and its cleanup live in one function and can never drift apart.',
  },
  recap: [
    'Fixtures = prepared resources injected BY NAME ({ page } is 4.11 destructuring on a delivery) — 10.6’s dependency injection as architecture. Lazy: built only when asked.',
    'Every test gets a FRESH context (cookies/storage zeroed — 7.7 reset): structural isolation, cheap because contexts are incognito-light while the browser process is shared. Prerequisite for parallelism.',
    'Hooks = per-file beats (beforeEach = shared Arrange). Custom fixtures via extend + the use() SANDWICH: setup before, test as filling, teardown after — guaranteed even on failure, forever paired.',
  ],
}
