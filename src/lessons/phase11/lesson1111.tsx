import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.11 — Auth, storage state & sessions
 * The login tax (5s × 200 tests); a session IS cookies+localStorage (7.7);
 * storageState bottles it to JSON (4.13/9.5); test.use hands every fresh
 * context the bottle — isolation preserved (shared bottle, not shared
 * live session). Setup project runs login once; secrets from env (9.4);
 * expiry as the classic failure mode.
 */

const CODE = `// setup step: log in ONCE, bottle the session
await page.goto("/login");
await page.getByLabel("Email")
  .fill(process.env.TEST_USER);
await page.getByLabel("Password")
  .fill(process.env.TEST_PASS);
await page.getByRole("button", { name: "Log in" })
  .click();
await expect(page.getByText("Welcome")).toBeVisible();
await page.context()
  .storageState({ path: ".auth/shopper.json" });

// every test after: born logged in
test.use({ storageState: ".auth/shopper.json" });

test("cart persists", async ({ page }) => {
  await page.goto("/cart");   // already logged in
});`

interface View {
  mode: 'tax' | 'session' | 'bottle' | 'reuse' | 'expiry'
  logins?: number
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'tax', logins: 3, console: [],
    note: 'the login tax: every test logging in through the UI = ~5s × 200 tests ≈ 17 MINUTES of pure login, every run',
  },
  {
    mode: 'tax', logins: 3, console: [],
    note: 'worse than slow: the login FORM becomes 200 tests’ shared dependency — one flaky login, 200 innocent reds',
  },
  {
    mode: 'session', console: [],
    note: 'first, demystify “logged in”: 7.7 taught it — a session IS data: cookies + localStorage the server recognizes. State, not magic',
  },
  {
    mode: 'bottle', console: ['.auth/shopper.json written'],
    note: 'so BOTTLE it: context().storageState({ path }) snapshots cookies + localStorage into a JSON file — 4.13’s format, 9.5’s disk',
  },
  {
    mode: 'bottle', console: [],
    note: 'the login runs ONCE, as a SETUP step before the suite (a dependency project — 11.12 formalizes projects)',
    badge: 'the credentials come from process.env (9.4) — TEST_USER/TEST_PASS never in the repo, injected locally via .env and on CI from the vault',
  },
  {
    mode: 'reuse', logins: 1, console: ['test 1 ✓ born logged in', 'test 2 ✓ born logged in', 'test 3 ✓ born logged in'],
    note: 'test.use({ storageState: path }): every fresh context is BORN with the bottled state — tests start logged in, zero UI logins',
  },
  {
    mode: 'reuse', logins: 1, console: [],
    note: 'isolation SURVIVES: each test still gets a fresh context (11.7) — they share the BOTTLE, never a live session. No cross-test poisoning',
  },
  {
    mode: 'bottle', console: [],
    note: 'a bottled session IS credentials — anyone holding the file is logged in as that user. Treat it like a password',
    badge: '.auth/ joins .gitignore — 8.2’s rule, security edition. Regenerate bottles; never treasure them.',
  },
  {
    mode: 'expiry', console: ['401 · 401 · 401 — every test suddenly red'],
    note: 'the classic failure mode, pre-diagnosed: sessions EXPIRE. A stale bottle = sudden mass-401s across the whole suite',
  },
  {
    mode: 'expiry', console: [],
    note: 'the cure is the design: CI regenerates the bottle EVERY run (the setup step runs first, always) — staleness can’t accumulate',
  },
]

function SessionBottle({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'tax' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the login tax, per test
          </text>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <RoughRect x={40} y={44 + i * 56} width={150} height={44} seed={5001 + i} strokeWidth={1.8} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 7%, transparent)" fillStyle="solid" />
              <text x={115} y={62 + i * 56} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink)">UI login (~5s) 🐌</text>
              <text x={115} y={78 + i * 56} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">goto·fill·fill·click</text>
              <text x={205} y={70 + i * 56} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">→</text>
              <RoughRect x={230} y={44 + i * 56} width={170} height={44} seed={5005 + i} strokeWidth={1.6} stroke="var(--color-marker-teal)" fill="transparent" fillStyle="solid" />
              <text x={315} y={70 + i * 56} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink)">test {i + 1}’s ACTUAL work</text>
            </g>
          ))}
          <text x={220} y={232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-marker-coral)">× 200 tests ≈ 17 minutes of logging in</text>
        </g>
      )}

      {view.mode === 'session' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            what “logged in” actually is (7.7)
          </text>
          <RoughRect x={90} y={50} width={260} height={110} seed={5010} strokeWidth={2.2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={220} y={74} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">the session = plain data</text>
          <text x={220} y={100} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">cookies: {'{ session: "abc123…" }'}</text>
          <text x={220} y={122} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">localStorage: {'{ token: "eyJh…" }'}</text>
          <text x={220} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">the server recognizes THESE — not your face</text>
        </g>
      )}

      {view.mode === 'bottle' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            log in once → bottle the state
          </text>
          <RoughRect x={40} y={50} width={140} height={90} seed={5020} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={110} y={80} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">setup step:</text>
          <text x={110} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">one real UI login</text>
          <text x={110} y={118} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7} fill="var(--color-ink-soft)">env credentials (9.4)</text>
          <text x={200} y={98} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">→</text>
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
            <RoughRect x={240} y={50} width={160} height={90} seed={5021} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
            <text x={320} y={76} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12}>🫙</text>
            <text x={320} y={98} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">.auth/shopper.json</text>
            <text x={320} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">cookies + storage, bottled</text>
          </motion.g>
        </g>
      )}

      {view.mode === 'reuse' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            every fresh context, born with the bottle
          </text>
          <RoughRect x={170} y={40} width={100} height={50} seed={5030} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
          <text x={220} y={62} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11}>🫙</text>
          <text x={220} y={80} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7} fill="var(--color-ink)">shopper.json</text>
          {[0, 1, 2].map((i) => (
            <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <RoughRect x={44 + i * 128} y={130} width={116} height={64} seed={5035 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="transparent" fillStyle="solid" />
              <text x={102 + i * 128} y={152} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">test {i + 1}</text>
              <text x={102 + i * 128} y={170} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8} fill="var(--color-ink-soft)">fresh context (11.7)</text>
              <text x={102 + i * 128} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8} fill="var(--color-marker-teal)">+ a COPY of the bottle</text>
            </motion.g>
          ))}
        </g>
      )}

      {view.mode === 'expiry' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the stale bottle
          </text>
          <RoughRect x={140} y={44} width={160} height={60} seed={5040} strokeWidth={2.2} stroke="var(--color-marker-coral)" roughness={2.2} fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
          <text x={220} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11}>🫙💀</text>
          <text x={220} y={90} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink)">bottled tuesday · it’s friday · session expired</text>
          <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-marker-coral)">401 · 401 · 401 · 401 · 401</text>
          <text x={220} y={162} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">every test red at once — now a five-second diagnosis for you</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={5050} color="var(--color-pencil-blue)" />
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

const BOTTLE_EXERCISE: CodeExerciseDef = {
  id: 'l1111-bottle-the-session',
  title: 'bottle the session',
  task: 'Model the whole economy: an expensive UI login, a bottle on the model disk (9.5’s trick), and three tests — run the suite the naive way, then the bottled way, and let the login counter tell the story.',
  steps: [
    <>
      Keep the starter’s <code>uiLogin</code> — it counts every call and returns a session
      object.
    </>,
    <>
      Naive suite: run 3 tests, each calling <code>uiLogin()</code> itself. Then print{' '}
      <code>naive: 3 logins</code> — from the counter, not typed.
    </>,
    <>
      Bottled suite: reset the counter; call <code>uiLogin()</code> ONCE and store its result on
      the model disk under <code>".auth/shopper.json"</code> (dynamic brackets); run 3 tests
      that each READ the bottle and print <code>test N: sess_abc ✓</code> (the cookie from the
      loaded state).
    </>,
    <>
      Finish with <code>bottled: 1 login</code> — the counter again.
    </>,
  ],
  starter: `// the expensive login — keep as is:
let loginCount = 0;
function uiLogin() {
  loginCount = loginCount + 1;
  return { cookie: "sess_abc" };
}

// your two suites below:
`,
  expectedOutput: ['naive: 3 logins', 'test 1: sess_abc ✓', 'test 2: sess_abc ✓', 'test 3: sess_abc ✓', 'bottled: 1 login'],
  mustUse: [
    { test: /disk\s*\[/, label: 'the bottle lives on a model disk (9.5), addressed with brackets' },
    { test: /for\s*\(/, label: 'tests run in loops' },
    { test: /loginCount/, label: 'the story is told by the counter' },
    { test: /`test \$\{|"test " \+/, label: 'test lines are built, naming each test' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']naive: 3 logins["']\s*\)/, label: 'no hard-coded counts — read the counter' },
  ],
  modelAnswer: `// the expensive login — keep as is:
let loginCount = 0;
function uiLogin() {
  loginCount = loginCount + 1;
  return { cookie: "sess_abc" };
}

// your two suites below:
for (let i = 1; i <= 3; i = i + 1) {
  uiLogin();
}
console.log("naive: " + loginCount + " logins");

loginCount = 0;
const disk = {};
disk[".auth/shopper.json"] = uiLogin();

for (let i = 1; i <= 3; i = i + 1) {
  const state = disk[".auth/shopper.json"];
  console.log(\`test \${i}: \${state.cookie} ✓\`);
}
console.log("bottled: " + loginCount + " login");`,
}

export const lesson1111: LessonDef = {
  id: '11.11',
  hook: (
    <>
      <p>
        Two hundred tests, each logging in through the UI first: seventeen minutes of pure login
        per run, and one flaky login form failing two hundred innocent tests.{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          The cure: log in ONCE, bottle the session as a file, and hand every fresh context the
          bottle
        </HighlightMark>
        . 7.7 taught you what a session IS — today that knowledge becomes seventeen minutes.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-tax',
      caption:
        'Price the problem first: a UI login — goto, fill, fill, click, wait for welcome — costs ~5 seconds. Times 200 tests, that’s ≈17 minutes PER RUN of logging in, before any test does its actual work. 10.2’s abandoned-suite math, self-inflicted.',
      highlightLines: [2, 3, 4, 5, 6, 7, 8],
    },
    {
      id: 'worse-than-slow',
      caption:
        'And slow is the SMALLER problem: every test now depends on the login form. One flaky moment in that single flow — a slow auth server, an animation — and two hundred innocent tests turn red. You’ve made the most fragile page in the app a universal dependency.',
      highlightLines: [7, 8],
    },
    {
      id: 'what-a-session-is',
      caption:
        'Now demystify, with 7.7: “being logged in” is not a state of grace — it’s DATA. A session cookie the server recognizes, maybe a token in localStorage. The server never sees “you”; it sees these values arriving with each request. And data… can be saved.',
      highlightLines: [9],
    },
    {
      id: 'bottle-it',
      caption:
        'So bottle it: page.context().storageState({ path: ".auth/shopper.json" }) snapshots the context’s cookies AND localStorage into a JSON file — 4.13’s format on 9.5’s disk. The session, bottled: a file that means “logged in as the test shopper.”',
      highlightLines: [10, 11],
    },
    {
      id: 'setup-once',
      caption:
        'The bottling login runs ONCE, as a SETUP step before the suite — in Playwright terms, a small setup project the others depend on (11.12 formalizes projects). Credentials come from process.env (9.4): TEST_USER and TEST_PASS live in .env locally and the CI vault remotely — never in the repo.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'reuse',
      caption:
        'Then the payoff line: test.use({ storageState: ".auth/shopper.json" }). Every test’s fresh context is BORN with the bottled cookies and storage already installed — page.goto("/cart") lands already logged in. Two hundred logins become zero.',
      highlightLines: [14, 16, 17],
    },
    {
      id: 'isolation-preserved',
      caption:
        'The subtle point that makes this safe: isolation (11.7) SURVIVES. Each test still gets its own fresh context — they share the BOTTLE (a file, copied in), never a live session. Test 3 adding cart items still can’t touch test 5’s world. Shared starting state, private everything-after.',
      highlightLines: [14, 16],
    },
    {
      id: 'bottle-is-credentials',
      caption:
        'Security beat, non-optional: a bottled session IS credentials — anyone holding shopper.json is logged in as that user. So .auth/ joins .gitignore (8.2’s rule, security edition), and the bottle gets regenerated rather than treasured. Files that grant access are secrets, whatever their extension.',
      highlightLines: [11],
    },
    {
      id: 'expiry',
      caption:
        'And the classic failure mode, pre-diagnosed for you: sessions EXPIRE. A bottle saved tuesday meets friday’s server — and every test goes red at once with 401s. Sudden MASS failure with auth-flavored errors = stale bottle. That diagnosis takes teams hours the first time; it will take you five seconds.',
      highlightLines: [11, 14],
    },
    {
      id: 'the-cure-is-design',
      caption:
        'The cure is baked into the design: the setup step runs FIRST on every CI run (11.16), regenerating the bottle fresh each time — staleness can’t accumulate where re-bottling is automatic. Locally, delete .auth/ whenever things look weird; it rebuilds in one login’s time.',
      highlightLines: [1, 10, 11],
    },
  ],
  Viz: SessionBottle,
  underTheHood: (
    <>
      <p>
        Multiple personas scale the same way: bottle <code>shopper.json</code>,{' '}
        <code>admin.json</code>, <code>new-user.json</code> in the setup step, and different spec
        files <code>test.use</code> different bottles. Combined with fixtures (11.7), suites
        expose them as injectable names: <code>{'{ adminPage }'}</code>.
      </p>
      <p>
        Even faster than one UI login: API login — POST the credentials with the request fixture
        (11.10), receive the session cookie, write the storage state yourself. The UI login flow
        then gets exactly ONE dedicated test of its own (it still needs testing — it’s a feature!)
        while every other test skips it entirely. That division — test the login once, reuse
        auth everywhere else — is the professional standard.
      </p>
      <p>
        What storageState does NOT capture: sessionStorage (7.7’s tab-scoped store) and
        IndexedDB. Most auth lives in cookies/localStorage so the bottle usually suffices — but
        when an app stubbornly logs you out despite the bottle, remember this list.
      </p>
      <p>
        Job note: “how do you handle auth in your suite?” is a standard interview probe. The
        layered answer you now own: sessions are data (cookies/localStorage), so we log in once
        in a setup project — ideally via API — bottle storageState per persona, inject it into
        fresh contexts, keep bottles out of git, and regenerate per CI run so expiry can’t bite.
        That answer is a hiring signal.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: '“Logged in” is ultimately made of what two browser-side stores? (7.7 knows)',
      accept: ['cookies and localStorage', 'cookies + localStorage', 'cookies, localStorage', 'cookies and local storage', 'localStorage and cookies'],
      placeholder: 'store + store…',
      why: 'Cookies + localStorage — the session data the server recognizes. That’s why it can be bottled to a JSON file and installed into fresh contexts.',
    },
    {
      kind: 'type-output',
      question: 'Tests share the storageState file. Does test 3’s cart-filling leak into test 5’s world? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — they share the BOTTLE (copied into each fresh context at birth), never a live session. Isolation from 11.7 survives: shared starting state, private everything-after.',
    },
    {
      kind: 'type-output',
      question: 'The whole suite suddenly fails with 401s on every test. Your first suspect?',
      accept: ['stale bottle', 'expired session', 'the storage state expired', 'stale storageState', 'expired storage state', 'session expired', 'the bottle expired'],
      placeholder: 'the suspect…',
      why: 'A stale bottle — the saved session expired. Mass auth-flavored failure = regenerate the storage state (CI does it every run by design; locally, delete .auth/).',
    },
  ],
  PlayExtra: () => <CodeExercise def={BOTTLE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the auth strategy to a friend: the login tax (both costs), what a session actually is, the bottle-and-reuse mechanics, why isolation survives, and the expiry failure mode with its cure.',
    modelAnswer:
      'Logging in through the UI in every test costs twice: five seconds times two hundred tests is seventeen minutes of pure login per run, and worse, the login form becomes a shared dependency — one flaky moment there fails two hundred innocent tests. The fix starts with 7.7’s demystification: being logged in is just data — a session cookie and maybe a localStorage token that the server recognizes. So you log in ONCE, in a setup step that runs before the suite, with credentials from process.env (never the repo), and bottle the session: storageState snapshots the context’s cookies and localStorage into a JSON file. Then test.use({ storageState }) hands every test’s fresh context that bottle at birth — tests start already logged in, zero UI logins. Isolation survives because they share the BOTTLE, not a live session: each test still gets its own fresh context with a copy installed, so nothing one test does leaks into another. Two cautions complete it: the bottle IS credentials, so .auth/ stays out of git; and sessions expire — a stale bottle shows up as sudden mass 401s across the suite, which is a five-second diagnosis once you know it, and the cure is the design itself: CI regenerates the bottle every run. The pro refinement: log in via the API instead of the UI, and keep exactly one dedicated test for the login flow itself.',
  },
  recap: [
    'The login tax: ~5s × N tests + the login form as a universal flaky dependency. A session = DATA (cookies + localStorage — 7.7), so it can be bottled: storageState → .auth/*.json (4.13 on 9.5’s disk).',
    'Setup step logs in ONCE (env credentials — 9.4); test.use({ storageState }) births every fresh context WITH the bottle. Isolation survives: shared bottle, never a live session.',
    'The bottle IS credentials → .gitignore. Sessions expire → mass 401s = stale bottle (5-second diagnosis); CI regenerates per run by design. Pro move: API login + one dedicated UI-login test.',
  ],
}
