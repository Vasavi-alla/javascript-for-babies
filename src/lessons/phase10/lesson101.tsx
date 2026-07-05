import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 10.1 — Why software breaks
 * A REGRESSION built mechanically before the learner's eyes: shared helper +
 * dependency graph (8.1) + form-data-is-strings (1.11) = a break far from
 * the change. The cost-of-bug curve (desk→review→QA→production), what tests
 * actually buy (automated re-asking + executable spec), and the honest limit
 * (presence of bugs, never absence).
 */

const CODE = `// monday — a tiny helper, used EVERYWHERE
function formatPrice(amount) {
  return "₹" + amount;
}
// cart.js imports it · invoice.js imports it
// email.js imports it · search.js imports it

// friday — invoices need two decimals:
function formatPrice(amount) {
  return "₹" + amount.toFixed(2);
}
// invoice page checked by hand ✓ … shipped

// but cart.js feeds it a FORM value —
// and form values are STRINGS (1.11):
formatPrice(quantityInput.value);
// "3".toFixed is not a function 💥`

interface Caller {
  name: string
  state: 'fine' | 'crashed'
}
interface View {
  mode: 'graph' | 'curve' | 'suite'
  helperHot?: boolean
  callers?: Caller[]
  curveStage?: number
  suiteChecks?: number
  console: string[]
  note: string
  badge?: string
}

const CALLERS_OK: Caller[] = [
  { name: 'cart.js', state: 'fine' },
  { name: 'invoice.js', state: 'fine' },
  { name: 'email.js', state: 'fine' },
  { name: 'search.js', state: 'fine' },
]
const CALLERS_BROKEN: Caller[] = [
  { name: 'cart.js', state: 'crashed' },
  { name: 'invoice.js', state: 'fine' },
  { name: 'email.js', state: 'fine' },
  { name: 'search.js', state: 'fine' },
]

const VIEWS: View[] = [
  {
    mode: 'graph', callers: CALLERS_OK, console: [],
    note: 'one helper, four dependents — 8.1’s dependency graph, drawn for a single function',
  },
  {
    mode: 'graph', helperHot: true, callers: CALLERS_OK, console: [],
    note: 'friday: a one-line change, hand-checked on the invoice page ✓ — shipped',
  },
  {
    mode: 'graph', helperHot: true, callers: CALLERS_BROKEN, console: ['TypeError: amount.toFixed is not a function'],
    note: 'cart feeds it a form value — a STRING (1.11) — and strings have no .toFixed. Cart is down.',
  },
  {
    mode: 'graph', helperHot: true, callers: CALLERS_BROKEN, console: ['TypeError: amount.toFixed is not a function'],
    note: 'this has a name: a REGRESSION — something that WORKED, broken by a LATER change',
    badge: 'the defining cruelty: the break surfaces FAR from the change. Nobody touched cart.js all week.',
  },
  {
    mode: 'graph', helperHot: true, callers: CALLERS_BROKEN, console: [],
    note: 'why it keeps happening: shared code = invisible coupling. Every arrow carries consequences',
    badge: 'a human can re-check 4 arrows by hand. Real projects have thousands — manual re-checking cannot scale.',
  },
  {
    mode: 'curve', curveStage: 1, console: [],
    note: 'caught at your desk (8.3’s debugger, a quick run): minutes. The cheapest bug you’ll ever fix',
  },
  {
    mode: 'curve', curveStage: 4, console: [],
    note: 'the SAME bug, caught later, costs more at every stop — in production it costs money, trust, and a 2am call',
  },
  {
    mode: 'suite', suiteChecks: 12, console: ['✓ cart still adds items', '✓ invoice shows decimals', '✓ search formats ranges'],
    note: 'what a test suite IS: the manual re-checking, automated — hundreds of “does X still work?” questions after EVERY change',
  },
  {
    mode: 'suite', suiteChecks: 12, console: ['✓ cart still adds items', '✓ invoice shows decimals', '✓ search formats ranges'],
    note: 'second purchase: tests are executable SPECIFICATION — “keeps plain numbers intact,” written as code that runs',
    badge: 'a comment can silently rot; a test that stops being true turns RED. Documentation that defends itself.',
  },
  {
    mode: 'suite', suiteChecks: 12, console: [],
    note: 'the honest limit: tests show the PRESENCE of bugs in what you asked — never the ABSENCE of bugs everywhere',
    badge: 'a green suite means “everything I asked about still works.” The tester’s craft = asking the right questions. That’s this whole phase.',
  },
]

function RegressionComic({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'graph' && (
        <g>
          <RoughRect x={150} y={36} width={140} height={48} seed={2701} strokeWidth={view.helperHot ? 2.8 : 2} stroke={view.helperHot ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fill={view.helperHot ? 'color-mix(in srgb, var(--color-marker-coral) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={220} y={58} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">formatPrice</text>
          <text x={220} y={74} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill={view.helperHot ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'}>
            {view.helperHot ? 'changed friday' : 'the shared helper'}
          </text>
          {(view.callers ?? []).map((caller, i) => {
            const x = 22 + i * 104
            const crashed = caller.state === 'crashed'
            return (
              <g key={caller.name}>
                <HandArrow from={{ x: x + 45, y: 148 }} to={{ x: 190 + i * 20, y: 88 }} curve={0.12} seed={2710 + i} stroke={crashed ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'} strokeWidth={crashed ? 2.2 : 1.4} />
                <RoughRect x={x} y={152} width={92} height={44} seed={2715 + i} strokeWidth={crashed ? 2.6 : 1.6} stroke={crashed ? 'var(--color-marker-coral)' : 'var(--color-ink)'} roughness={crashed ? 2.6 : 1.3} fill={crashed ? 'color-mix(in srgb, var(--color-marker-coral) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
                <text x={x + 46} y={172} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">{caller.name}</text>
                <text x={x + 46} y={188} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill={crashed ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}>
                  {crashed ? '💥 down' : '✓'}
                </text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'curve' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the same bug, priced by WHERE it’s caught
          </text>
          {[
            { label: 'your desk', sub: 'minutes', h: 28 },
            { label: 'code review', sub: 'hours', h: 56 },
            { label: 'QA / test run', sub: 'days', h: 96 },
            { label: 'PRODUCTION', sub: 'money · trust · 2am', h: 150 },
          ].map((bar, i) => {
            const active = (view.curveStage ?? 0) > i
            return (
              <g key={bar.label} opacity={active ? 1 : 0.25}>
                <RoughRect x={40 + i * 96} y={200 - bar.h} width={78} height={bar.h} seed={2730 + i} strokeWidth={2} stroke={i === 3 ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${i === 3 ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} ${8 + i * 4}%, transparent)`} fillStyle="solid" />
                <text x={79 + i * 96} y={216} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">{bar.label}</text>
                <text x={79 + i * 96} y={232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{bar.sub}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'suite' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the suite: every question, re-asked after every change
          </text>
          {Array.from({ length: view.suiteChecks ?? 0 }).map((_, i) => (
            <motion.g key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <RoughRect x={34 + (i % 4) * 96} y={44 + Math.floor(i / 4) * 48} width={84} height={38} seed={2740 + i} strokeWidth={1.6} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
              <text x={76 + (i % 4) * 96} y={68 + Math.floor(i / 4) * 48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-marker-teal)">✓</text>
            </motion.g>
          ))}
          <text x={220} y={210} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
            …asked in seconds, not staff-weeks
          </text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={392} fontSize={9.5} seed={2750} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const REGRESSION_EXERCISE: CodeExerciseDef = {
  id: 'l101-regression-detector',
  title: 'build a regression detector',
  task: 'Two health reports of the same app: before and after friday’s change. Write the program that spots exactly what regressed — the seed of every test suite you’ll ever run.',
  steps: [
    <>
      Create <code>before</code> as{' '}
      <code>{'{ cart: "ok", invoice: "ok", email: "ok", search: "ok" }'}</code> and{' '}
      <code>after</code> as the same object but with <code>cart</code> set to{' '}
      <code>"broken"</code>.
    </>,
    <>
      Write <code>findRegressions(before, after)</code>: return the names of every feature that
      was <code>"ok"</code> before and is NOT <code>"ok"</code> now — walk the keys (4.8) and
      keep the guilty ones (4.9).
    </>,
    <>
      Print each regressed name, then a summary line: <code>1 regression found</code> — the
      count computed, never typed.
    </>,
  ],
  starter: '',
  expectedOutput: ['cart', '1 regression found'],
  mustUse: [
    { test: /Object\.keys/, label: 'the walk starts from Object.keys' },
    { test: /\.filter\s*\(/, label: 'the guilty are kept with .filter' },
    { test: /function\s+findRegressions\s*\(|const\s+findRegressions\s*=/, label: 'a function named findRegressions' },
    { test: /\.length/, label: 'the summary count comes from .length' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']cart["']\s*\)/, label: 'no hard-coded names — the detector must find them' },
    { test: /console\.log\s*\(\s*["']1 regression/, label: 'no hard-coded count — compute it' },
  ],
  modelAnswer: `const before = { cart: "ok", invoice: "ok", email: "ok", search: "ok" };
const after = { cart: "broken", invoice: "ok", email: "ok", search: "ok" };

function findRegressions(before, after) {
  return Object.keys(before).filter(
    (name) => before[name] === "ok" && after[name] !== "ok"
  );
}

const regressed = findRegressions(before, after);
for (const name of regressed) {
  console.log(name);
}
console.log(regressed.length + " regression found");`,
}

export const lesson101: LessonDef = {
  id: '10.1',
  hook: (
    <>
      <p>
        Here’s the uncomfortable truth this entire phase is built on:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          most bugs aren’t written — they’re CAUSED, by a correct-looking change to code that
          something else silently depended on
        </HighlightMark>
        . You’re about to watch one happen, mechanically, with tools you already own: a shared
        helper, a dependency graph, and one string where a number was expected.
      </p>
      <p>
        Then the two questions that define the job you’re training for: what does catching that
        bug COST at each stage — and what exactly does a test suite buy?
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-setup',
      caption:
        'Monday. formatPrice is a tiny helper — three lines — and four files import it (8.1’s graph, drawn for one function). This shape is EVERYWHERE in real code: write once, depend often. Remember the arrows; they’re about to matter.',
      highlightLines: [1, 2, 3, 4, 5, 6],
    },
    {
      id: 'the-change',
      caption:
        'Friday. Invoices need two decimal places, so someone upgrades the helper: amount.toFixed(2). They open the invoice page, see ₹120.00, looks perfect — shipped. A careful person, a correct-looking change, a manual check that passed.',
      highlightLines: [8, 9, 10, 11],
    },
    {
      id: 'the-break',
      caption:
        'But follow cart.js’s arrow: it feeds the helper a value from a FORM — and 1.11 taught you form values are STRINGS. "3".toFixed doesn’t exist. TypeError. The cart — untouched all week — is down in front of customers.',
      highlightLines: [13, 14, 15, 16],
    },
    {
      id: 'name-it',
      caption:
        'This has a name: a REGRESSION — something that WORKED, broken by a LATER change (“regress” = to step backward). Its defining cruelty: the break surfaces far from the change. The diff says invoice; the fire is in cart.',
      highlightLines: [15, 16],
    },
    {
      id: 'why-inevitable',
      caption:
        'Why this keeps happening to smart, careful people: shared code means invisible coupling — every import arrow carries consequences in both directions. Re-checking four arrows by hand is possible. Real projects have thousands of arrows and dozens of changes a day. Manual re-checking cannot scale. Ever.',
      highlightLines: [5, 6],
    },
    {
      id: 'cost-desk',
      caption:
        'Now price the bug by WHERE it gets caught. At your desk, minutes after typing it — a quick run, 8.3’s debugger, done in minutes. Cheapest possible. In code review: someone else’s hour, a comment thread, a second commit.',
      highlightLines: [9],
    },
    {
      id: 'cost-production',
      caption:
        'Caught in QA: days — reproduce, report, prioritize, fix, re-verify. Caught in PRODUCTION: lost orders while the cart is down, users who trust the shop a little less, and somebody’s 2am. Same bug at every stop — the price multiplied roughly tenfold at each one.',
      highlightLines: [16],
    },
    {
      id: 'what-tests-buy',
      caption:
        'So here is what a test suite actually IS: the manual re-checking, automated. Hundreds of tiny “does X still work?” questions — cart adds items, invoice shows decimals, search formats ranges — re-asked after EVERY change, in seconds. Friday’s change would have been interrogated before it ever shipped.',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'executable-spec',
      caption:
        'The second thing tests buy, quieter but just as valuable: they’re executable SPECIFICATION. “formatPrice keeps plain numbers intact” written as running code. A comment saying that can silently rot; a test saying it turns RED the moment it stops being true. Documentation that defends itself.',
      highlightLines: [2, 3],
    },
    {
      id: 'the-honest-limit',
      caption:
        'And the honest limit, stated on day one: tests can only show the PRESENCE of bugs in what you asked about — never the ABSENCE of bugs everywhere. A green suite means “everything I asked still works.” Which makes the tester’s real craft choosing the right questions. That craft is this entire phase.',
      highlightLines: [1],
    },
  ],
  Viz: RegressionComic,
  underTheHood: (
    <>
      <p>
        The word for what bit cart.js is a <strong>contract</strong>: formatPrice’s old, unwritten
        contract was “accepts anything <code>+</code> can glue” (1.9 — strings included); the new
        code silently narrowed it to “numbers only.” Most regressions are exactly this: an
        unwritten contract, narrowed without anyone noticing. Tests make contracts{' '}
        <em>written</em> — and 8.5’s TypeScript makes some of them checkable before running
        (<code>amount: number</code> would have flagged the string caller at the desk stage).
      </p>
      <p>
        The cost curve isn’t folklore — it’s one of the oldest measured results in software
        engineering, and while the exact multipliers vary by study, the <em>shape</em> never
        does: each stage a bug survives multiplies its price, with production an order of
        magnitude worse than anything before it. That shape is why companies pay people
        specifically to catch bugs early — your future job is literally an arbitrage on this
        curve.
      </p>
      <p>
        Precision on “regression”: teams also use it as an adjective — <em>regression testing</em>{' '}
        (re-running existing checks to catch regressions) and a <em>regression suite</em> (the
        collection of those checks). Same idea, three grammatical costumes; you’ll hear all three
        in your first week.
      </p>
      <p>
        Job note: when interviewers ask “why do we test?”, weak answers say “to find bugs.” You
        now have the strong one: to make change safe — catching regressions in seconds instead of
        production, at desk prices instead of 2am prices — plus a specification that can’t rot.
        That answer signals a professional.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A feature that worked last week breaks because of THIS week’s change to a different file. What is that called? (one word)',
      accept: ['regression', 'a regression', 'Regression'],
      placeholder: 'the term…',
      why: 'A regression — something that worked, broken by a later change. Its cruelty: the break surfaces far from the change that caused it.',
    },
    {
      kind: 'type-output',
      question: 'Where is the SAME bug cheapest to fix — at your desk, in QA, or in production?',
      accept: ['at your desk', 'your desk', 'desk', 'at the desk', 'the desk'],
      placeholder: 'the stage…',
      why: 'The desk — minutes. Each stage the bug survives multiplies its price, with production costing money, trust, and someone’s 2am.',
    },
    {
      kind: 'type-output',
      question: 'A test suite is fully green. Does that PROVE the app has no bugs? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — tests show the presence of bugs in what you asked about, never the absence of bugs everywhere. Green means “everything I asked still works” — which is why choosing the right questions is the craft.',
    },
  ],
  PlayExtra: () => <CodeExercise def={REGRESSION_EXERCISE} />,
  teachBack: {
    prompt:
      'Tell the formatPrice story to a friend: what changed, why a different file broke, what that’s called — then the cost curve, and the two things a test suite actually buys (plus its one honest limit).',
    modelAnswer:
      'A helper called formatPrice was used by four files — a little dependency graph. On friday someone upgraded it for invoices, adding .toFixed(2), checked the invoice page by hand, and shipped. But cart.js fed that helper a value from a form, and form values are strings — strings don’t have .toFixed, so the cart crashed in production even though nobody touched cart.js. That’s a regression: something that worked, broken by a later change, surfacing far from the change itself. It happens because shared code creates invisible coupling, and humans can’t re-check thousands of import arrows after every change. The cost of that bug depends entirely on where it’s caught: minutes at the desk, hours in review, days in QA, and in production it costs money, trust, and a 2am call — roughly multiplying at each stage. A test suite buys two things: first, it IS the manual re-checking automated — hundreds of “does X still work?” questions re-asked after every change in seconds, so friday’s change gets interrogated before shipping; second, tests are executable specification — “keeps plain numbers intact” as running code that turns red when it stops being true, unlike a comment that silently rots. The honest limit: a green suite proves only that everything you ASKED about still works — tests show the presence of bugs, never their absence — so the real craft is asking the right questions.',
  },
  recap: [
    'A REGRESSION = something that worked, broken by a later change — and it surfaces far from the change (shared code = invisible coupling; the graph’s arrows carry consequences).',
    'The cost curve: desk (minutes) → review (hours) → QA (days) → production (money, trust, 2am) — the same bug multiplies in price at every stage it survives.',
    'Tests buy (1) automated re-asking of every “does X still work?” after every change, and (2) executable specification that can’t rot. Honest limit: green shows presence-of-bugs-checked, never absence — choosing the questions is the craft.',
  ],
}
