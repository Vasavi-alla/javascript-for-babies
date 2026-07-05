import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.10 — Network interception & API testing
 * page.route = a STUB at the network boundary (10.6's family, biggest
 * stage): the envelope intercepted mid-flight, answered by your handler.
 * Sad paths on demand (500s, aborts). The mock/real tradeoff. And 9.7's
 * request fixture: pure API tests in the same runner.
 */

const CODE = `// intercept: when the page asks for products,
// WE answer — the server is never consulted
await page.route("**/api/products", (route) =>
  route.fulfill({
    json: [{ name: "Mug", price: 250 }],
  })
);
await page.goto("/shop");
await expect(page.getByText("Mug")).toBeVisible();

// sad paths, on demand:
await page.route("**/api/products",
  (route) => route.fulfill({ status: 500 }));
await page.route("**/api/ads",
  (route) => route.abort());

// pure API test — no page at all (9.7 delivered):
const res = await request.get("/api/products");
expect(res.status()).toBe(200);`

interface View {
  mode: 'booth' | 'sad' | 'tradeoff' | 'request'
  intercepted?: boolean
  status?: string | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'booth', intercepted: false, console: [],
    note: 'the dependency problem, browser-sized: E2E tests lean on the BACKEND — slow, shared, and its data changes under you',
  },
  {
    mode: 'booth', intercepted: true, console: [],
    note: 'page.route(pattern, handler): a customs booth on 6.7’s road — the envelope is stopped MID-FLIGHT, before leaving',
  },
  {
    mode: 'booth', intercepted: true, status: '200 · [{ Mug }]', console: ['Mug — ₹250 ✓ rendered'],
    note: 'route.fulfill({ json }) — YOUR handler answers instead of the server. The page can’t tell. Deterministic data, every run',
    badge: 'name it precisely: this is a STUB (10.6) at the network boundary — canned answers controlling what feeds the page. Same family, biggest stage.',
  },
  {
    mode: 'booth', intercepted: true, status: '200 · [{ Mug }]', console: [],
    note: 'the pattern "**/api/products" is a glob — ** matches any prefix, so the rule catches the call on any host (11.3’s baseURL included)',
  },
  {
    mode: 'sad', status: '500', console: ['error banner shown ✓'],
    note: 'THE superpower: sad paths on demand. fulfill({ status: 500 }) — “server down” as a one-liner. You can’t schedule a real outage; you can always fake one',
  },
  {
    mode: 'sad', status: 'aborted', console: ['page survives without ads ✓'],
    note: 'route.abort() simulates network FAILURE (the request never lands) · route.continue() waves it through untouched — observe without changing',
  },
  {
    mode: 'tradeoff', console: [],
    note: 'the honest tradeoff: mocked = fast + deterministic, but the real backend is unproven · unmocked = true end-to-end, but slow + shared',
  },
  {
    mode: 'tradeoff', console: [],
    note: 'teams mix deliberately: MOCK for UI states (empty list, error banner, huge list) · keep a FEW unmocked journeys for the real wiring',
    badge: '10.2’s layer thinking, applied INSIDE E2E: many cheap mocked tests, few precious full-stack ones. The pyramid is fractal.',
  },
  {
    mode: 'request', status: '200', console: ['GET /api/products → 200'],
    note: '9.7’s promise, delivered: the request fixture — pure API tests, no page, no browser rendering, in the SAME runner and report',
  },
  {
    mode: 'request', status: '200', console: [],
    note: 'and 4.13 is everywhere here: fulfill takes json in, res.json() comes out, toEqual (10.4) asserts the shapes. The JSON skills were never optional',
  },
]

function CustomsBooth({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {(view.mode === 'booth' || view.mode === 'sad') && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the envelope’s road — with a customs booth
          </text>
          <RoughRect x={26} y={60} width={110} height={80} seed={4901} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={81} y={95} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink)">the page</text>
          <text x={81} y={115} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">asks /api/products</text>
          <HandArrow from={{ x: 140, y: 100 }} to={{ x: 180, y: 100 }} curve={0} seed={4905} stroke="var(--color-ink-soft)" strokeWidth={1.8} />
          <RoughRect x={184} y={56} width={90} height={88} seed={4902} strokeWidth={2.4} stroke={view.intercepted || view.mode === 'sad' ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'} fill={`color-mix(in srgb, var(--color-marker-coral) ${view.intercepted || view.mode === 'sad' ? 10 : 3}%, transparent)`} fillStyle="solid" />
          <text x={229} y={86} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">customs</text>
          <text x={229} y={102} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">booth</text>
          <text x={229} y={122} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7} fill="var(--color-ink-soft)">page.route(…)</text>
          <g opacity={view.intercepted || view.mode === 'sad' ? 0.25 : 1}>
            <HandArrow from={{ x: 278, y: 100 }} to={{ x: 318, y: 100 }} curve={0} seed={4906} stroke="var(--color-ink-soft)" strokeWidth={1.8} />
            <RoughRect x={322} y={60} width={92} height={80} seed={4903} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
            <text x={368} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">the real</text>
            <text x={368} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">server</text>
          </g>
          {(view.intercepted || view.mode === 'sad') && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={150} y={168} width={160} height={40} seed={4910} strokeWidth={2} stroke={view.status === '500' || view.status === 'aborted' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${view.status === '500' || view.status === 'aborted' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} 10%, transparent)`} fillStyle="solid" />
              <text x={230} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">the booth answers:</text>
              <text x={230} y={201} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{view.status ?? '…'}</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'tradeoff' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            mocked vs real — a deliberate mix
          </text>
          <RoughRect x={40} y={48} width={175} height={120} seed={4920} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={127} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">mocked (many)</text>
          <text x={127} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">fast · deterministic</text>
          <text x={127} y={112} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">UI states on demand</text>
          <text x={127} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-marker-coral)">backend unproven</text>
          <RoughRect x={225} y={48} width={175} height={120} seed={4921} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={312} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">unmocked (few)</text>
          <text x={312} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">true end-to-end</text>
          <text x={312} y={112} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">real wiring proven</text>
          <text x={312} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-marker-coral)">slow · shared data</text>
        </g>
      )}

      {view.mode === 'request' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the request fixture — no page anywhere
          </text>
          <RoughRect x={40} y={56} width={130} height={70} seed={4930} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={105} y={86} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">request.get(…)</text>
          <text x={105} y={106} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">your test (Node)</text>
          <HandArrow from={{ x: 174, y: 90 }} to={{ x: 250, y: 90 }} curve={0.1} seed={4935} stroke="var(--color-marker-teal)" strokeWidth={2} />
          <RoughRect x={254} y={56} width={130} height={70} seed={4931} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={319} y={86} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink)">the API</text>
          <text x={319} y={106} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{view.status ?? ''}</text>
          <text x={220} y={160} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            10.2’s middle band, living inside your Playwright suite
          </text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4940} color="var(--color-pencil-blue)" />
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

const ROUTE_EXERCISE: CodeExerciseDef = {
  id: 'l1110-build-route',
  title: 'build the customs booth',
  task: 'The starter is the “real server.” Build route registration and an interception-aware fetch: registered patterns get YOUR answer; everything else passes through to the server.',
  steps: [
    <>
      Keep the starter’s <code>server</code>. Create <code>routes</code>: an empty array, and{' '}
      <code>addRoute(pattern, handler)</code> that pushes <code>{'{ pattern, handler }'}</code>.
    </>,
    <>
      Write <code>fetchWithRoutes(url)</code>: find the first route whose pattern the url
      includes (4.10’s find + includes); if found, return its handler’s answer; otherwise fall
      through to <code>server(url)</code>.
    </>,
    <>
      Register a mock: pattern <code>"/api/products"</code> answering{' '}
      <code>"Mug ₹250 (mocked)"</code>. Then print the result of fetching{' '}
      <code>"https://shop.com/api/products"</code> and of fetching{' '}
      <code>"https://shop.com/api/user"</code> — one mocked, one real.
    </>,
  ],
  starter: `// the real server — keep as is:
function server(url) {
  if (url.includes("/api/user")) return "Ada (from server)";
  return "products (from server)";
}

// your booth below:
`,
  expectedOutput: ['Mug ₹250 (mocked)', 'Ada (from server)'],
  mustUse: [
    { test: /\.find\s*\(/, label: 'route matching uses .find' },
    { test: /\.includes\s*\(/, label: 'patterns match with .includes' },
    { test: /function\s+addRoute|const\s+addRoute\s*=/, label: 'a function named addRoute' },
    { test: /function\s+fetchWithRoutes|const\s+fetchWithRoutes\s*=/, label: 'a function named fetchWithRoutes' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']Mug ₹250 \(mocked\)["']\s*\)/, label: 'no hard-coded answers — fetch through the booth' },
  ],
  modelAnswer: `// the real server — keep as is:
function server(url) {
  if (url.includes("/api/user")) return "Ada (from server)";
  return "products (from server)";
}

// your booth below:
const routes = [];

function addRoute(pattern, handler) {
  routes.push({ pattern: pattern, handler: handler });
}

function fetchWithRoutes(url) {
  const route = routes.find((r) => url.includes(r.pattern));
  if (route) {
    return route.handler(url);
  }
  return server(url);
}

addRoute("/api/products", () => "Mug ₹250 (mocked)");

console.log(fetchWithRoutes("https://shop.com/api/products"));
console.log(fetchWithRoutes("https://shop.com/api/user"));`,
}

export const lesson1110: LessonDef = {
  id: '11.10',
  hook: (
    <>
      <p>
        Your E2E tests have a dependency problem: the BACKEND — slow, shared with the whole team,
        and its data changes under you. 10.6 taught the cure at function scale; today it scales
        to the browser:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          page.route intercepts the page’s network requests MID-FLIGHT and answers them with your
          canned data — a stub at the network boundary
        </HighlightMark>
        . Plus 9.7’s promised payoff: pure API tests in the same suite.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-dependency',
      caption:
        'The problem, honestly stated: an unmocked E2E test leans on the real backend. It’s slow (every request a real round trip — 6.7), shared (a teammate deletes “Mug” and your test dies innocently), and unschedulable (how do you test the error banner without breaking the server?). 10.6’s boundary problem, browser-sized.',
      highlightLines: [1, 2],
    },
    {
      id: 'route',
      caption:
        'page.route(pattern, handler): a customs booth built on 6.7’s road. When the PAGE sends a matching request, the envelope is stopped mid-flight — before it leaves for the network — and YOUR handler decides its fate. The server is never consulted.',
      highlightLines: [3],
    },
    {
      id: 'fulfill',
      caption:
        'route.fulfill({ json: [...] }) — the booth answers with a crafted response. The page receives it exactly as if the server had spoken: parses it (6.8), renders Mug for ₹250 (7.8). It cannot tell. Name the move precisely: a STUB (10.6) — canned answers controlling what FEEDS the page. Same family, biggest stage.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'glob-pattern',
      caption:
        'The pattern "**/api/products" is a glob: ** matches any prefix, so the rule catches the call whatever host it targets (11.3’s baseURL, localhost, staging — all covered). One booth, every road into that endpoint.',
      highlightLines: [3],
    },
    {
      id: 'sad-paths',
      caption:
        'Now THE superpower — the reason interception exists: SAD PATHS ON DEMAND. fulfill({ status: 500 }) makes the products API “fail” for exactly this test — does the page show its error banner, or a white screen? You can’t schedule a real outage. You can always fake one, in one line.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'abort-continue',
      caption:
        'The booth has three verdicts: fulfill (answer it yourself), abort (the request DIES — network failure, simulated: does the page survive without its ads?), and continue (wave it through untouched — observation without interference, the spy-flavored option).',
      highlightLines: [13, 14, 15],
    },
    {
      id: 'the-tradeoff',
      caption:
        'The honest tradeoff, because mocking is not free: a mocked test is fast and deterministic — but it proves the UI against YOUR data, not the real backend. An unmocked test is true end-to-end — and slow, shared, and flaky-prone. Neither is “correct”; they answer different questions.',
      highlightLines: [3, 8],
    },
    {
      id: 'the-mix',
      caption:
        'So teams mix deliberately: MOCK for UI states — empty list, error banner, one item, five hundred items, all cheap and exact — and keep a FEW unmocked journeys that prove the real wiring end to end. Recognize the shape? 10.2’s layer thinking applied INSIDE E2E. The pyramid is fractal.',
      highlightLines: [3, 17],
    },
    {
      id: 'request-fixture',
      caption:
        'And the second half of the lesson title: 9.7’s promise, delivered. The request fixture (11.7 — injected by name) sends API calls with NO page at all: await request.get("/api/products"), assert on status and body. Pure API tests — 10.2’s middle band — living in the same runner, same report, same CI.',
      highlightLines: [17, 18, 19],
    },
    {
      id: 'json-everywhere',
      caption:
        'Step back and notice whose skills these are: fulfill takes json in (4.13’s stringify-shaped data), res.json() parses out (6.8), toEqual asserts the shapes (10.4’s structural walk), and optional fields read via ?. ?? (8.4). The JSON lessons were never a detour — they were THIS, in advance.',
      highlightLines: [5, 18, 19],
    },
  ],
  Viz: CustomsBooth,
  underTheHood: (
    <>
      <p>
        Handlers can be surgical: <code>route.fulfill({'{ … }'})</code> can also start from the
        REAL response — fetch it (<code>route.fetch()</code>), tweak one field of the JSON, and
        fulfill with the modified body: perfect for “what if the price were negative” questions
        against otherwise-real data.
      </p>
      <p>
        Routes are scoped: <code>page.route</code> affects one page;{' '}
        <code>context.route</code> covers every page in the context (11.7). Register routes
        BEFORE the navigation that triggers the requests — a booth built after the trucks left
        catches nothing (a classic first-week bug).
      </p>
      <p>
        For whole recorded backends there’s HAR replay (<code>routeFromHAR</code>) — record a
        real session once, replay it as a complete mock. Heavier machinery, same stub idea. And
        the request fixture can share auth with your pages (11.11’s storage state) — API-create,
        UI-verify flows come cheap.
      </p>
      <p>
        Job note: interviewers love “how would you test the error state of the products page?”
        The professional answer is one sentence now: intercept the products call with
        route.fulfill status 500 and assert the banner — deterministic, no server harmed. Bonus
        sentence: and a few unmocked journeys stay in the suite so the real wiring is still
        proven. That pairing is the whole judgment.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'route.fulfill({ json: [...] }) answers the page’s request. In 10.6’s family, what is this — a stub, spy, or fake?',
      accept: ['stub', 'a stub', 'Stub', 'STUB'],
      placeholder: 'family member…',
      why: 'A stub — canned answers controlling what feeds the machine (here, the page). At the network boundary, exactly where 10.6 said doubles belong.',
    },
    {
      kind: 'type-output',
      question: 'How do you test the “server down” error banner without breaking any real server? (name the call)',
      accept: ['fulfill status 500', 'route.fulfill({ status: 500 })', 'fulfill({ status: 500 })', 'fulfill with status 500', 'route.fulfill status 500', 'mock a 500'],
      placeholder: 'the call…',
      why: 'route.fulfill({ status: 500 }) — a one-line fake outage, scoped to this test. Sad paths on demand are the whole reason interception exists.',
    },
    {
      kind: 'type-output',
      question: 'Should EVERY E2E test mock the backend? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — mocked tests prove the UI against YOUR data, not the real wiring. Teams mix: many mocked UI-state tests + a few unmocked journeys. The pyramid is fractal.',
    },
  ],
  PlayExtra: () => <CodeExercise def={ROUTE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain interception to a friend: the backend-dependency problem, what page.route does to the envelope (name the 10.6 family member), why sad paths are the superpower, the mocked-vs-real tradeoff, and what the request fixture adds.',
    modelAnswer:
      'E2E tests depend on the real backend, which is slow, shared with the whole team, and impossible to schedule failures on — the boundary problem from 10.6 at browser scale. page.route(pattern, handler) builds a customs booth on the network road: when the page sends a matching request, the envelope is stopped mid-flight before it reaches any server, and my handler decides — fulfill answers with crafted JSON the page can’t distinguish from the real thing, abort simulates network failure, continue waves it through for pure observation. Precisely named, fulfill is a STUB: canned answers controlling what feeds the page, the 10.6 family at the network boundary. The superpower is sad paths on demand: fulfill({ status: 500 }) fakes a server outage for exactly one test, so the error banner becomes testable without harming anything — you can’t schedule a real outage, but you can always fake one. The tradeoff is honest: mocked tests are fast and deterministic but prove the UI against my data, not the real backend; unmocked tests prove the true wiring but are slow and shared — so teams mock the many UI-state tests and keep a few unmocked journeys, the pyramid applied fractally inside E2E. And the request fixture completes 9.7’s promise: pure API tests with no page at all, same runner, same report — the middle band of the pyramid living inside the Playwright suite.',
  },
  recap: [
    'page.route(pattern, handler) = a customs booth: the page’s request stopped MID-FLIGHT. Verdicts: fulfill (a STUB — 10.6, network edition), abort (fake outage), continue (observe). Register BEFORE navigating.',
    'The superpower: sad paths on demand — fulfill({ status: 500 }) tests error UI in one deterministic line. Tradeoff: mocked = fast/exact but backend unproven; keep a few unmocked journeys (the pyramid is fractal).',
    'request fixture = 9.7 delivered: pure API tests (no page) in the same runner/report. 4.13 + 6.8 + 10.4 do all the JSON work — those lessons were this, in advance.',
  ],
}
