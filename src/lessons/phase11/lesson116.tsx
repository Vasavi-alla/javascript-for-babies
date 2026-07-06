import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.6 — Auto-waiting & web-first assertions
 * THE flaky-test killer. Dynamic pages make answers arrive LATER; sleep()
 * is the old sin (too short = flaky, too long = slow); web-first assertions
 * POLL the fresh locator until truth or timeout. Matcher tour, the
 * two-families distinction (10.4 checks once; these retry), the
 * anti-patterns, and the one honest exception.
 */

const CODE = `// the OLD world (other tools, sadder days):
//   click(); sleep(5000); read();  ← guess & pray

// Playwright:
await page.getByRole("button", { name: "Search" })
  .click();
await expect(page.getByText("12 results"))
  .toBeVisible();
// ↑ polls: check · wait · check · …
//   passes the INSTANT it's true (or times out)

await expect(page.getByRole("listitem")).toHaveCount(12);
await expect(page.getByLabel("Email"))
  .toHaveValue("ada@shop.com");
await expect(page.getByText("Saved!")).toBeHidden();`

interface View {
  mode: 'dynamic' | 'sleep' | 'poll' | 'families'
  timeline?: Array<{ at: number; ok: boolean }>
  truthAt?: number
  sleepLen?: number
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'dynamic', console: [],
    note: 'modern pages are DYNAMIC: click search → spinner → network (6.7) → render (7.8). The answer exists LATER, at an unknowable time',
  },
  {
    mode: 'sleep', sleepLen: 2, truthAt: 3, console: ['✗ read too early — flaky'],
    note: 'the old sin: sleep(2000). Page took 3s today → the read happens too early → red on correct code. FLAKY',
  },
  {
    mode: 'sleep', sleepLen: 5, truthAt: 1, console: ['✓ …after wasting 4 seconds'],
    note: 'so you pad it: sleep(5000). Page took 1s → four seconds wasted × 500 tests = 10.2’s abandoned suite',
    badge: 'sleep can’t win: too short = flaky, too long = slow. Every hand-tuned number is wrong in one direction on some machine.',
  },
  {
    mode: 'poll', truthAt: 3, timeline: [{ at: 0, ok: false }, { at: 1, ok: false }, { at: 2, ok: false }, { at: 3, ok: true }], console: ['✓ passed the instant truth arrived'],
    note: 'web-first: expect(locator).toBeVisible() POLLS — resolve fresh (11.4!) → check → not yet? wait → again. Passes the INSTANT it’s true',
  },
  {
    mode: 'poll', truthAt: 3, timeline: [{ at: 0, ok: false }, { at: 1, ok: false }, { at: 2, ok: false }, { at: 3, ok: true }], console: [],
    note: 'fast page = fast test · slow page = patient test — SAME code. Speed adapts to reality; a sleep never can',
  },
  {
    mode: 'poll', truthAt: -1, timeline: [{ at: 0, ok: false }, { at: 1, ok: false }, { at: 2, ok: false }, { at: 3, ok: false }], console: ['TimeoutError after 5s: expected visible, got hidden'],
    note: 'and when truth never arrives: fail at 11.3’s expect.timeout, with the last seen state in the message — honest, bounded patience',
  },
  {
    mode: 'families', console: [],
    note: 'the matcher tour, all retrying: toHaveText/toContainText · toHaveCount (late lists!) · toHaveValue (forms) · toHaveURL · toBeEnabled/Checked',
  },
  {
    mode: 'families', console: [],
    note: 'dynamic patterns handled FREE: a toast that appears (toBeVisible) then disappears (toBeHidden — it polls for ABSENCE too)',
    badge: 'waiting for something to vanish by hand is miserable; toBeHidden/not.toBeVisible makes disappearance just another assertion',
  },
  {
    mode: 'families', console: [],
    note: 'know which family you’re holding: 10.4’s expect(125).toBe() checks ONCE — a value can’t change. A LOCATOR’s world can — so web-first waits',
  },
  {
    mode: 'sleep', sleepLen: 3, truthAt: 2, console: [],
    note: 'the anti-patterns you WILL be tempted by: page.waitForTimeout(3000) is sleep in a costume — never in a merged test',
    badge: 'seeing waitForTimeout in review = someone patching a symptom. The cure is always a better assertion on the thing you’re actually waiting FOR.',
  },
  {
    mode: 'poll', truthAt: 2, timeline: [{ at: 0, ok: false }, { at: 1, ok: false }, { at: 2, ok: true }], console: [],
    note: 'one honest exception: network choreography — page.waitForResponse(…) when the WIRE event itself is the thing. Rare, deliberate, commented',
  },
]

function PollingTimeline({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'dynamic' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            click → …the answer arrives LATER
          </text>
          {['click "Search"', 'spinner 🌀', 'network round trip (6.7)', 'render (7.8)', '“12 results” appears'].map((stage, i) => (
            <g key={stage}>
              <RoughRect x={40 + i * 76} y={70} width={70} height={54} seed={4501 + i} strokeWidth={1.8} stroke={i === 4 ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={i === 4 ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'transparent'} fillStyle="solid" />
              <text x={75 + i * 76} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={7.5} fill="var(--color-ink)">
                <WrapTspans text={stage} x={75 + i * 76} maxPx={62} fontSize={7.5} />
              </text>
            </g>
          ))}
          <text x={220} y={160} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
            how long does the middle take? 200ms? 3s? NOBODY KNOWS in advance
          </text>
        </g>
      )}

      {view.mode === 'sleep' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the sleep gamble
          </text>
          <RoughRect x={40} y={60} width={(view.sleepLen ?? 3) * 70} height={36} seed={4510} strokeWidth={2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
          <text x={40 + ((view.sleepLen ?? 3) * 70) / 2} y={83} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">sleep({(view.sleepLen ?? 3) * 1000})</text>
          {typeof view.truthAt === 'number' && view.truthAt >= 0 && (
            <g>
              <line x1={40 + view.truthAt * 70} y1={110} x2={40 + view.truthAt * 70} y2={150} stroke="var(--color-marker-teal)" strokeWidth={2.4} strokeLinecap="round" />
              <text x={40 + view.truthAt * 70} y={166} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-marker-teal)">truth arrives here</text>
            </g>
          )}
          <text x={40} y={200} fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            {view.sleepLen && view.truthAt !== undefined && view.truthAt >= 0 && view.sleepLen < view.truthAt
              ? 'read happens BEFORE truth → red on correct code'
              : 'truth was ready long before the read → pure waste'}
          </text>
        </g>
      )}

      {view.mode === 'poll' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the polling assertion
          </text>
          {(view.timeline ?? []).map((tick, i) => (
            <g key={i}>
              <RoughRect x={50 + i * 90} y={64} width={76} height={44} seed={4520 + i} strokeWidth={2} stroke={tick.ok ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={tick.ok ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'transparent'} fillStyle="solid" />
              <text x={88 + i * 90} y={84} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink)">check {i + 1}</text>
              <text x={88 + i * 90} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill={tick.ok ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
                {tick.ok ? 'true ✓' : 'not yet'}
              </text>
            </g>
          ))}
          <text x={220} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            fresh locator resolution every check (11.4) · gentle pauses between
          </text>
        </g>
      )}

      {view.mode === 'families' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            two expect families — know which you’re holding
          </text>
          <RoughRect x={36} y={44} width={180} height={130} seed={4530} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 5%, transparent)" fillStyle="solid" />
          <text x={126} y={66} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">10.4: value matchers</text>
          <text x={126} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">expect(125).toBe(125)</text>
          <text x={126} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">checks ONCE —</text>
          <text x={126} y={132} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">a value can’t change</text>
          <RoughRect x={224} y={44} width={180} height={130} seed={4531} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 5%, transparent)" fillStyle="solid" />
          <text x={314} y={66} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">web-first matchers</text>
          <text x={314} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">await expect(loc).toHaveText(…)</text>
          <text x={314} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">RETRIES — the page’s</text>
          <text x={314} y={132} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">world CAN change</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={4540} color="var(--color-pencil-blue)" />
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

const POLLING_EXERCISE: CodeExerciseDef = {
  id: 'l116-build-polling',
  title: 'build the polling assertion',
  task: 'The starter fakes a dynamic page on a hand-cranked clock (deterministic — no real waiting). Build the web-first assertion: poll until truth or budget, and report WHICH.',
  steps: [
    <>
      Keep the starter: <code>tick()</code> advances the fake clock 100ms; <code>getResults()</code>{' '}
      answers <code>""</code> until 300ms have passed, then <code>"12 results"</code> — a page
      whose truth arrives later.
    </>,
    <>
      Write <code>pollUntil(get, expected, maxChecks)</code>: up to maxChecks times — check{' '}
      <code>get() === expected</code>; on truth, return which check number succeeded; otherwise{' '}
      <code>tick()</code> and try again. Exhausted → return <code>-1</code>.
    </>,
    <>
      Run it: expect <code>"12 results"</code> with 10 checks → print{' '}
      <code>passed on check 4</code>. Then expect <code>"99 results"</code> with 5 checks → print{' '}
      <code>timed out after 5 checks</code>.
    </>,
  ],
  starter: `// a dynamic page on a hand-cranked clock — keep as is:
let now = 0;
function tick() {
  now = now + 100;
}
function getResults() {
  return now >= 300 ? "12 results" : "";
}

// your polling assertion below:
`,
  expectedOutput: ['passed on check 4', 'timed out after 5 checks'],
  mustUse: [
    { test: /function\s+pollUntil\s*\(|const\s+pollUntil\s*=/, label: 'a function named pollUntil' },
    { test: /for\s*\(|while\s*\(/, label: 'polling is a loop' },
    { test: /tick\s*\(\s*\)/, label: 'between checks, the clock ticks' },
    { test: /===\s*expected/, label: 'each check compares strictly against expected' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']passed on check 4["']\s*\)/, label: 'no hard-coded results — the loop must find them' },
  ],
  modelAnswer: `// a dynamic page on a hand-cranked clock — keep as is:
let now = 0;
function tick() {
  now = now + 100;
}
function getResults() {
  return now >= 300 ? "12 results" : "";
}

// your polling assertion below:
function pollUntil(get, expected, maxChecks) {
  for (let check = 1; check <= maxChecks; check = check + 1) {
    if (get() === expected) {
      return check;
    }
    tick();
  }
  return -1;
}

const first = pollUntil(getResults, "12 results", 10);
console.log(first === -1 ? "timed out" : "passed on check " + first);

const second = pollUntil(getResults, "99 results", 5);
console.log(second === -1 ? "timed out after 5 checks" : "passed on check " + second);`,
}

export const lesson116: LessonDef = {
  id: '11.6',
  hook: (
    <>
      <p>
        This is the lesson 7.8 promised and 11.1 credited with ending an era:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          web-first assertions — expect(locator) checks that RETRY until the page catches up,
          passing the instant truth arrives
        </HighlightMark>
        . Dynamic content — spinners, late lists, toasts — stops being your problem and becomes
        the assertion’s.
      </p>
      <p>
        First, honor the old enemy properly: understand exactly why sleep() can never win.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'dynamic-reality',
      caption:
        'The reality every browser test lives in: pages are DYNAMIC. Click Search and the answer does not exist yet — a spinner shows, a request travels (6.7), the response renders (7.8). “12 results” appears LATER, after a delay nobody can know in advance: 200ms on a good day, 3 seconds on a bad one.',
      highlightLines: [5, 6],
    },
    {
      id: 'the-old-sin',
      caption:
        'The old world’s answer was sleep(5000): click, close your eyes for five seconds, then read. Watch it fail BOTH ways: sleep 2s on a 3s day → you read too early → red on CORRECT code (flaky!). So you pad it…',
      highlightLines: [1, 2],
    },
    {
      id: 'sleep-cant-win',
      caption:
        '…sleep 5s on a 1s day → four seconds of pure waste — times 500 tests, that’s over half an hour of nothing, and 10.2 told you what happens to slow suites. sleep loses in both directions BY CONSTRUCTION: any fixed number is too short on some machine and too long on the rest.',
      highlightLines: [2],
    },
    {
      id: 'web-first',
      caption:
        'Playwright’s answer: await expect(locator).toBeVisible() POLLS. Resolve the locator FRESH (11.4’s description, re-looked-up), check the condition, not true yet? — wait a beat, check again. It passes the INSTANT truth arrives. No number to tune, nothing to guess.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'adapts-to-reality',
      caption:
        'Read what that buys: fast page → the first check passes → the test is FAST. Slow page → later check passes → the test was PATIENT. Same code, zero configuration — the test’s speed adapts to reality. A sleep is a guess about reality; a poll is a conversation with it.',
      highlightLines: [7, 8],
    },
    {
      id: 'bounded-patience',
      caption:
        'And when truth never arrives — the feature is genuinely broken? The polling stops at 11.3’s expect.timeout (5s) and fails with the LAST SEEN state: “expected visible, received hidden.” Bounded patience: generous to slow pages, honest about broken ones. Both timeouts you decoded now have faces.',
      highlightLines: [7, 8],
    },
    {
      id: 'matcher-tour',
      caption:
        'The web-first family, all retrying: toHaveText / toContainText (content), toHaveCount (a list still filling — THE late-list tool), toHaveValue (form fields — 7.6), toHaveURL (navigation landed), toBeEnabled / toBeChecked (state). Each one: fresh resolve, poll, instant pass or honest timeout.',
      highlightLines: [12, 13, 14],
    },
    {
      id: 'appear-and-vanish',
      caption:
        'Dynamic patterns fall for free now. The toast that appears: toBeVisible. The toast that then DISAPPEARS: toBeHidden — yes, it polls for ABSENCE. The spinner that must go away before the data means anything: expect(spinner).toBeHidden() then assert the data. Appearance and disappearance, both just assertions.',
      highlightLines: [15],
    },
    {
      id: 'two-families',
      caption:
        'Now the distinction that prevents subtle confusion forever: 10.4’s expect(125).toBe(125) checks ONCE — 125 is a settled value; rechecking can’t help. expect(LOCATOR).toHaveText() retries — the page’s world CAN change. Value matchers judge the past; web-first matchers wait for a future. Know which family you’re holding.',
      highlightLines: [12],
    },
    {
      id: 'anti-patterns',
      caption:
        'The temptations, named so you can refuse them: page.waitForTimeout(3000) is sleep() wearing a Playwright costume — every argument from step three applies verbatim; never in a merged test. And waitForSelector is the older API the web-first assertions replaced. When you feel the urge to wait, ask: what am I actually waiting FOR? Then assert THAT.',
      highlightLines: [1, 2],
    },
    {
      id: 'honest-exception',
      caption:
        'One honest exception, so the rule stays credible: sometimes the WIRE EVENT itself is the thing — “clicking Save fires exactly one POST to /api/orders.” page.waitForResponse(…) exists for that network choreography. Rare, deliberate, worth a comment when used. Everything else: assert on what the user would see.',
      highlightLines: [7, 8],
    },
  ],
  Viz: PollingTimeline,
  underTheHood: (
    <>
      <p>
        Inside the polling loop: checks run on the browser side where possible, at gentle
        intervals (roughly every 100ms). Each round re-resolves the locator. So even if the
        framework replaces the DOM node — React (a page-building library) re-renders constantly
        — the assertion follows the description, not a dead reference. 11.4’s design decision
        matters here, permanently.
      </p>
      <p>
        <code>toHaveText</code> has precise rules. It normalizes whitespace. It matches the FULL
        text — use <code>toContainText</code> for substrings. It accepts arrays for lists:{' '}
        <code>toHaveText(["Red", "Blue", "Green"])</code> asserts all three items in
        order — a whole list shape in one retrying assertion.
      </p>
      <p>
        Some truths live outside the DOM — a value in your own code, an API’s answer. For those
        there’s <code>await expect.poll(() =&gt; fn())</code> and <code>expect(async …).toPass()</code>:
        the same retry engine pointed at any function. Your exercise’s pollUntil is
        literally this, hand-built.
      </p>
      <p>
        <strong>💼 On the job —</strong> you can now READ flakiness statistics. Teams migrating
        from sleep-based suites to web-first assertions routinely report faster runs (no padded
        sleeps) AND ten-times-fewer flakes. The same change fixes both directions of sleep’s
        failure. When 11.15’s flakiness clinic lists “race conditions” as cause #1, the cure
        column will just say: this lesson.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'sleep(2000) before reading a page that takes 3s today — does the test pass, fail, or waste time?',
      accept: ['fail', 'fails', 'it fails', 'FAIL', 'fails (flaky)', 'flaky fail'],
      placeholder: 'pass / fail / waste…',
      why: 'Fails — the read happens before truth arrives: red on correct code, the definition of flaky. Pad the sleep and you buy the other failure: wasted seconds on every fast run. sleep can’t win.',
    },
    {
      kind: 'type-output',
      question: 'expect(locator).toBeVisible() — how does it behave between the click and the element appearing?',
      accept: ['it polls', 'polls', 'retries', 'it retries', 'checks repeatedly', 'keeps checking', 'poll'],
      placeholder: 'it …',
      why: 'It polls: fresh locator resolution → check → wait → check again, passing the INSTANT truth arrives, failing only at expect.timeout with the last seen state.',
    },
    {
      kind: 'type-output',
      question: 'Which family retries — expect(125).toBe(125) or expect(locator).toHaveText("Ada")?',
      accept: ['the locator one', 'toHaveText', 'expect(locator)', 'the web-first one', 'web-first', 'the second', 'locator'],
      placeholder: 'which…',
      why: 'The web-first (locator) family — a page’s world can change, so waiting helps. A settled value like 125 can’t change, so 10.4’s matchers check once. Know which you’re holding.',
    },
  ],
  PlayExtra: () => <CodeExercise def={POLLING_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the flaky-test killer to a friend: why dynamic pages break sleep() in BOTH directions, how a polling assertion works (freshness included), what bounds its patience, and the one honest exception to “never wait by hand.”',
    modelAnswer:
      'Modern pages are dynamic: click Search and the answer literally doesn’t exist yet — a request travels, the response renders, and “12 results” appears after a delay nobody can predict. The old answer, sleep(5000), fails by construction in both directions: too short on a slow day and the test reads before truth arrives — red on correct code, which is what flaky means — and too long on fast days, wasting seconds times five hundred tests until the suite is too slow to run. Playwright’s web-first assertions poll instead: expect(locator).toBeVisible() re-resolves the locator fresh each time — it’s a description, not a stale reference, so it survives the framework replacing DOM nodes — checks the condition, waits a beat, checks again, and passes the INSTANT it’s true. Fast page, fast test; slow page, patient test; same code. The patience is bounded by the config’s expect.timeout: if truth never arrives, it fails honestly, reporting the last state it saw. The whole retrying family covers text, counts, values, URLs, and even ABSENCE — toBeHidden polls for a toast to vanish. The tempting shortcuts — waitForTimeout — are sleep in costume and never belong in merged tests; the one honest exception is network choreography, waitForResponse, when the wire event itself is what you’re testing — rare, deliberate, commented.',
  },
  recap: [
    'Dynamic pages = answers arrive LATER at unknowable times. sleep() loses both ways by construction: too short → flaky red on correct code; too long → 10.2’s abandoned-suite slowness.',
    'Web-first assertions POLL: fresh locator resolve (11.4) → check → wait → again — instant pass when truth arrives, honest TimeoutError (expect.timeout, 11.3) with last-seen state when it doesn’t. Family: toHaveText/Count/Value/URL, toBeVisible/Hidden (absence polls too!).',
    'Two expect families: values check ONCE (10.4 — the past can’t change); locators RETRY (the page can). waitForTimeout = sleep in costume, never merged; the one exception is waitForResponse for wire-event choreography.',
  ],
}
