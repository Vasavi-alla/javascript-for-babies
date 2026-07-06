import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 6.8 — Parallel & racing
 * Sequential awaits add up; independent work should overlap. Promise.all
 * (all or one failure), allSettled (verdict list), race (first settle),
 * any (first success). Results keep INPUT order, not finish order.
 */

const CODE = `function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function main() {
  const salad = delay(60, "salad");
  const soup = delay(20, "soup");

  const first = await Promise.race([salad, soup]);
  console.log(first);

  const both = await Promise.all([salad, soup]);
  console.log(both);
}

main();`

interface View {
  lanes: { label: string; ms: number; done: boolean; failed?: boolean }[]
  verdict: string | null
  mode: 'seq' | 'par' | 'race' | 'all' | 'fail'
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the lanes */
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'seq',
    lanes: [{ label: 'salad 60ms', ms: 60, done: false }, { label: 'soup 20ms', ms: 20, done: false }],
    verdict: 'await a; await b; → 60 + 20 = 80ms',
    console: [],
    note: 'sequential awaits ADD UP — the second wait doesn’t even start until the first ends',
  },
  {
    mode: 'seq',
    lanes: [{ label: 'salad 60ms', ms: 60, done: false }, { label: 'soup 20ms', ms: 20, done: false }],
    verdict: 'await a; await b; → 60 + 20 = 80ms',
    console: [],
    note: 'this is fine — for DEPENDENT steps',
    badge: 'sequential awaits are for steps that need A’s result to ask for B. For INDEPENDENT steps, they’re pure waste.',
  },
  {
    mode: 'par',
    lanes: [{ label: 'salad 60ms', ms: 60, done: false }, { label: 'soup 20ms', ms: 20, done: false }],
    verdict: 'start both, THEN await → max(60, 20) = 60ms',
    console: [],
    note: 'lines 8–9 START both timers before any await — the kitchens overlap',
  },
  {
    mode: 'race',
    lanes: [{ label: 'salad 60ms', ms: 60, done: false }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'race → settles with the FIRST to finish',
    console: ['soup'],
    note: 'Promise.race: first settle wins — soup, at 20ms',
  },
  {
    mode: 'race',
    lanes: [{ label: 'salad 60ms', ms: 60, done: false }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'race → settles with the FIRST to finish',
    console: ['soup'],
    note: 'careful with race’s honesty',
    badge: 'first to settle EITHER way — if the fastest one rejects, race rejects too. Want first SUCCESS specifically? That’s Promise.any.',
  },
  {
    mode: 'all',
    lanes: [{ label: 'salad 60ms', ms: 60, done: true }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'all → waits for EVERY one',
    console: ['soup', '["salad","soup"]'],
    note: 'Promise.all waits for every input and fulfills with an array of results — total time: the SLOWEST one',
  },
  {
    mode: 'all',
    lanes: [{ label: 'salad 60ms', ms: 60, done: true }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'all → waits for EVERY one',
    console: ['soup', '["salad","soup"]'],
    note: 'now the ordering surprise',
    badge: '["salad","soup"] — INPUT order, position for position, even though soup finished 40ms earlier. all[0] is always input[0].',
  },
  {
    mode: 'fail',
    lanes: [{ label: 'salad ✗ rejects', ms: 60, done: true, failed: true }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'all → ONE rejection rejects the whole thing',
    console: ['soup', '["salad","soup"]'],
    note: 'Promise.all is ALL-or-nothing — one rejection anywhere rejects the combined promise immediately',
  },
  {
    mode: 'fail',
    lanes: [{ label: 'salad ✗ rejects', ms: 60, done: true, failed: true }, { label: 'soup 20ms', ms: 20, done: true }],
    verdict: 'all → ONE rejection rejects the whole thing',
    console: ['soup', '["salad","soup"]'],
    note: 'need every verdict regardless?',
    badge: 'Promise.allSettled never rejects — it fulfills with a { status, value/reason } list, one per input',
  },
]

function RaceLanes({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 316" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the kitchen lanes (time →)
      </text>
      {view.lanes.map((lane, i) => {
        const y = 50 + i * 56
        const w = lane.ms * 4.2
        return (
          <g key={lane.label}>
            <text x={30} y={y + 18} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{lane.label}</text>
            <RoughRect x={140} y={y} width={252} height={26} seed={1081 + i} strokeWidth={1.4} stroke="var(--color-ink-soft)" />
            <motion.rect
              initial={{ width: 0 }}
              animate={{ width: view.mode === 'seq' && i === 1 ? 0 : w }}
              transition={{ duration: 0.8, delay: view.mode === 'seq' && i === 1 ? 0 : i * 0.1 }}
              x={142}
              y={y + 3}
              height={20}
              rx={4}
              fill={lane.failed ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
              opacity={0.55}
            />
            {view.mode === 'seq' && i === 1 && (
              <motion.rect initial={{ width: 0 }} animate={{ width: 84 }} transition={{ duration: 0.8, delay: 0.9 }} x={142 + 252} y={y + 3} height={20} rx={4} fill="var(--color-marker-coral)" opacity={0.4} transform="translate(-84 0)" />
            )}
            {lane.done && (
              <text x={400} y={y + 18} fontFamily="var(--font-hand)" fontSize={13} fill={lane.failed ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}>
                {lane.failed ? '✗' : '✓'}
              </text>
            )}
          </g>
        )
      })}

      {view.verdict && (
        <motion.g key={view.verdict} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={60} y={168} width={320} height={32} seed={1085} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="solid" />
          <text x={220} y={189} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">
            {view.verdict}
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={222} width={352} fontSize={9.5} seed={1087} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={256} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={270} width={360} height={32} seed={1086} strokeWidth={1.5} />
      <text x={58} y={291} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const KITCHEN_RACE_EXERCISE: CodeExerciseDef = {
  id: 'l68-kitchenrace',
  title: 'race them, then feed everyone',
  task: 'Two dishes, different cooking times. Prove you can ask both of the phase’s parallel questions: who’s FIRST — and, when everything’s ready, in what ORDER do the results arrive?',
  steps: [
    <>
      A helper <code>delay(ms, value)</code> — a promise resolving with <code>value</code> after{' '}
      <code>ms</code>.
    </>,
    <>
      Start BOTH before any await: <code>slow</code> = 60ms → <code>"salad"</code>,{' '}
      <code>fast</code> = 20ms → <code>"soup"</code>. Await the RACE of [slow, fast] and print the
      winner.
    </>,
    <>
      Then await ALL of [slow, fast] and print the array — and notice it comes back in INPUT
      order, salad first, even though soup finished first.
    </>,
  ],
  starter: '',
  expectedOutput: ['soup', '["salad","soup"]'],
  mustUse: [
    { test: /Promise\.race\s*\(\s*\[/, label: 'the winner comes from Promise.race' },
    { test: /Promise\.all\s*\(\s*\[/, label: 'the full set comes from Promise.all' },
    { test: /const\s+\w+\s*=\s*delay\s*\([\s\S]*const\s+\w+\s*=\s*delay\s*\(/, label: 'both promises START before any await — that’s the parallelism' },
  ],
  mustNotUse: [
    { test: /await\s+delay/, label: 'don’t await the delays directly — start them, hold the receipts, await the combinators' },
  ],
  modelAnswer: `function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

async function main() {
  const slow = delay(60, "salad");
  const fast = delay(20, "soup");

  const winner = await Promise.race([slow, fast]);
  console.log(winner);

  const all = await Promise.all([slow, fast]);
  console.log(all);
}

main();`,
}

export const lesson68: LessonDef = {
  id: '6.8',
  hook: (
    <>
      <p>
        Lesson 6.6 left a warning: <code>await jobA(); await jobB();</code> runs <em>one after
        the other</em> — two independent 80ms waits become 160ms. In a test suite fetching five
        fixtures per test, that's the difference between a 2-minute run and a 10-minute one.
        Independent waits should <strong>overlap</strong>.
      </p>
      <p>
        JavaScript ships four combinators for exactly this —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Promise.all, allSettled, race, any
        </HighlightMark>{' '}
        — each answering a different question about a <em>set</em> of promises: all of them? every
        verdict? the first to settle? the first to succeed?
      </p>
      <p>
        Plus one ordering surprise that trips even seniors: results come back in <em>input</em>{' '}
        order, not finish order.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'sequential-bill',
      caption:
        'The bill, first: await delay(60) then await delay(20) = 80ms total, because the second timer doesn’t even START until the first await finishes.',
      highlightLines: [8, 9],
    },
    {
      id: 'dependent-vs-independent',
      caption:
        'This is fine — for DEPENDENT steps (need A’s result to ask for B). For INDEPENDENT steps, it’s pure waste.',
      highlightLines: [8, 9],
    },
    {
      id: 'start-first',
      caption:
        'The fix is two lines you already understand: CALL both functions first, await nothing yet. Lines 8–9 start both timers — salad and soup hold PENDING RECEIPTS (6.4) and both kitchens are already cooking, overlapped. The total will be max(60, 20), not the sum.',
      highlightLines: [8, 9],
    },
    {
      id: 'race-first',
      caption:
        'Question 1: who’s first? await Promise.race([salad, soup]) settles the moment the FIRST input settles — soup, at 20ms.',
      highlightLines: [11, 12],
    },
    {
      id: 'race-caveat',
      caption:
        'Careful with race’s honesty: first to settle EITHER WAY — if the fastest one rejects, race rejects. (Want first SUCCESS specifically? That’s Promise.any.) Classic real use: race a fetch against a delay-then-throw — a homemade timeout.',
      highlightLines: [11, 12],
    },
    {
      id: 'all-waits',
      caption:
        'Question 2: everything ready? await Promise.all([salad, soup]) waits for EVERY input and fulfills with an array of results — total time: the slowest one (60ms).',
      highlightLines: [14, 15],
    },
    {
      id: 'all-order',
      caption:
        'Now the ordering surprise: ["salad","soup"] — INPUT order, position for position, even though soup finished 40ms earlier. all[0] is always input[0]. Finish order is forgotten; your code stays deterministic.',
      highlightLines: [14, 15],
    },
    {
      id: 'all-or-nothing',
      caption:
        'The sharp edge: Promise.all is ALL-or-nothing — one rejection anywhere rejects the combined promise immediately (remaining work isn’t cancelled, just ignored).',
      highlightLines: [14],
    },
    {
      id: 'allsettled',
      caption:
        'When you need every verdict regardless — “load 10 dashboards, show what worked” — Promise.allSettled never rejects: it fulfills with a list of { status: "fulfilled", value } / { status: "rejected", reason } objects. Choose by question: all = need everything; allSettled = need the report; race = first settle; any = first success.',
      highlightLines: [14],
    },
  ],
  Viz: RaceLanes,
  underTheHood: (
    <>
      <p>
        None of these run promises "in parallel" themselves — the overlap happened when you{' '}
        <em>started</em> the work (the executor runs at construction, 6.4). The combinators just{' '}
        <em>observe</em> a set of receipts and settle their own single receipt by a rule. One
        thread throughout (6.1's law): the waiting overlaps in the environment, never the JS.
      </p>
      <p>
        <strong>💼 On the job —</strong> Playwright code awaits sequentially when steps depend
        (click → then assert). <code>Promise.all</code> is for genuinely simultaneous things.
        The classic:{' '}
        <code>{'await Promise.all([page.waitForNavigation(), page.click("a")]) '}</code> — start
        listening BEFORE the click that triggers it. Starting-then-awaiting is a professional
        reflex; today it enters your hands.
      </p>
      <p>
        And the input-order guarantee is what makes <code>all</code> composable with
        destructuring: <code>{'const [user, cart] = await Promise.all([getUser(), getCart()])'}</code>{' '}
        — 4.11's array pattern, matched by position, safe because position is promised.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'a takes 300ms, b takes 500ms, both started first. How many ms until await Promise.all([a, b]) finishes? Type the number.',
      accept: ['500', '500ms', '~500'],
      placeholder: 'a number…',
      why: 'all waits for the SLOWEST — overlapped, the total is max(300, 500) = 500. Sequential awaits would have paid 800. That difference is the whole lesson.',
    },
    {
      kind: 'type-output',
      question: 'p1 (80ms → "A") and p2 (30ms → "B"). Type EXACTLY what await Promise.all([p1, p2]) fulfills with:',
      accept: ['["A","B"]', '["A", "B"]'],
      placeholder: 'an array…',
      why: 'INPUT order, always: position 0 is p1’s result even though p2 finished first. Finish order never leaks into the result array.',
    },
    {
      kind: 'type-output',
      question: 'Five promises; two reject. Which combinator fulfills anyway, with a verdict for each? Type its name.',
      accept: ['allSettled', 'Promise.allSettled', 'allsettled'],
      placeholder: 'Promise.…',
      why: 'allSettled never rejects — it reports every outcome as { status, value/reason }. all would have rejected at the first failure; allSettled files the full report.',
    },
  ],
  PlayExtra: () => <CodeExercise def={KITCHEN_RACE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: why do two independent awaits waste time, how do you overlap them, what do all / allSettled / race / any each answer — and what order do all’s results arrive in?',
    modelAnswer:
      'await jobA(); await jobB(); is sequential — jobB doesn’t START until jobA’s await finishes, so independent waits add up. The fix: start both first (call the functions, hold the pending promises), then await a combinator — the work overlaps in the environment and the total is the slowest, not the sum. The four questions: Promise.all = “everything, please” — fulfills with an array of results when ALL fulfill, but one rejection rejects it immediately (all-or-nothing). Promise.allSettled = “the full report” — never rejects; gives { status, value/reason } per input. Promise.race = “first to settle, either way” — fulfilled or rejected, whichever crosses first (great for timeouts). Promise.any = “first success.” And all’s results arrive in INPUT order, position for position, regardless of finish order — which is why destructuring them is safe: const [user, cart] = await Promise.all([getUser(), getCart()]).',
  },
  recap: [
    'Independent waits: START both first, then await — overlap makes the total max(), not sum(). Sequential awaits are for dependent steps only.',
    'all = everything (one rejection kills it) · allSettled = every verdict, never rejects · race = first settle either way · any = first success.',
    'all’s results keep INPUT order — all[0] is input[0], finish order forgotten — so destructuring them is safe.',
  ],
}
