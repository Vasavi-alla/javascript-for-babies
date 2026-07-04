import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 6.4 — Promises (flagship)
 * A promise is a RECEIPT for future work: pending → fulfilled/rejected,
 * one-way, once. .then registers "when ready"; every .then returns a NEW
 * promise — chains flatten the pyramid; ONE .catch drains every error.
 */

const CODE = `const order = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("burger #42");
  }, 60);
});

console.log("receipt in hand");

order
  .then((food) => {
    console.log("eating " + food);
    return food + " + fries";
  })
  .then((meal) => {
    console.log("upgraded: " + meal);
  })
  .catch((err) => {
    console.log("refund: " + err.message);
  });`

interface View {
  state: 'pending' | 'fulfilled' | 'rejected'
  value: string | null
  chain: { label: string; done: boolean }[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the receipt/chain */
  badge?: string
}

const VIEWS: View[] = [
  {
    state: 'pending', value: null, chain: [], console: [],
    note: 'new Promise((resolve, reject) => {…}) starts the work immediately and hands you back a promise — a receipt for work in progress, state: pending',
  },
  {
    state: 'pending', value: null,
    chain: [{ label: '.then(eat)', done: false }, { label: '.then(upgrade)', done: false }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand'],
    note: 'you attach plans to the receipt NOW — the thread moves on (nothing has resolved yet)',
  },
  {
    state: 'fulfilled', value: '"burger #42"',
    chain: [{ label: '.then(eat)', done: false }, { label: '.then(upgrade)', done: false }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand'],
    note: '60ms later: resolve("burger #42") flips the promise — pending → FULFILLED, value locked in',
  },
  {
    state: 'fulfilled', value: '"burger #42"',
    chain: [{ label: '.then(eat)', done: false }, { label: '.then(upgrade)', done: false }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand'],
    note: 'a promise settles exactly ONCE',
    badge: 'a second resolve, or a late reject, is simply ignored — pending → fulfilled OR rejected, one flip, forever',
  },
  {
    state: 'fulfilled', value: '"burger #42"',
    chain: [{ label: '.then(eat) ✓', done: true }, { label: '.then(upgrade)', done: false }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand', 'eating burger #42'],
    note: 'the fulfilled value flows into the first .then — whose RETURN feeds the next link',
  },
  {
    state: 'fulfilled', value: '"burger #42 + fries"',
    chain: [{ label: '.then(eat) ✓', done: true }, { label: '.then(upgrade) ✓', done: true }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand', 'eating burger #42', 'upgraded: burger #42 + fries'],
    note: 'every .then returns a NEW promise — that’s why chains stay FLAT instead of nesting',
  },
  {
    state: 'fulfilled', value: '"burger #42 + fries"',
    chain: [{ label: '.then(eat) ✓', done: true }, { label: '.then(upgrade) ✓', done: true }, { label: '.catch(refund)', done: false }],
    console: ['receipt in hand', 'eating burger #42', 'upgraded: burger #42 + fries'],
    note: 'the chain waits for slow steps too',
    badge: 'return a PROMISE from a .then and the chain even WAITS for it — steps that take time chain just as flat',
  },
  {
    state: 'rejected', value: 'Error("kitchen fire")',
    chain: [{ label: '.then(eat) — skipped', done: false }, { label: '.then(upgrade) — skipped', done: false }, { label: '.catch(refund) ✓', done: true }],
    console: ['receipt in hand', 'refund: kitchen fire'],
    note: 'had reject() fired instead: every .then is SKIPPED and the error slides to ONE shared .catch',
  },
  {
    state: 'rejected', value: 'Error("kitchen fire")',
    chain: [{ label: '.then(eat) — skipped', done: false }, { label: '.then(upgrade) — skipped', done: false }, { label: '.catch(refund) ✓', done: true }],
    console: ['receipt in hand', 'refund: kitchen fire'],
    note: 'one more lane, for cleanup',
    badge: '.finally(fn) runs on EITHER ending — success or rejection — the cleanup lane returns too',
  },
]

function PromiseReceipt({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const stateColor = view.state === 'pending' ? 'var(--color-marker-yellow)' : view.state === 'fulfilled' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* the receipt */}
      <RoughRect x={40} y={44} width={150} height={110} seed={1011} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={115} y={38} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">the promise — a receipt</text>
      <AnimatePresence mode="wait">
        <motion.g key={view.state} initial={{ opacity: 0, rotateX: 90 }} animate={{ opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }}>
          <RoughRect x={56} y={62} width={118} height={30} seed={1012} strokeWidth={1.8} fill={stateColor} fillStyle={view.state === 'pending' ? 'hachure' : 'solid'} />
          <text x={115} y={82} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
            {view.state.toUpperCase()}
          </text>
        </motion.g>
      </AnimatePresence>
      {view.value && (
        <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={115} y={126} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
          {view.value}
        </motion.text>
      )}

      {/* the chain */}
      <text x={240} y={38} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">plans attached to the receipt</text>
      {view.chain.map((link, i) => (
        <motion.g key={link.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
          <RoughRect x={240} y={48 + i * 44} width={172} height={34} seed={1015 + i} strokeWidth={link.done ? 2.4 : 1.6} stroke={link.label.includes('skip') ? 'var(--color-ink-soft)' : link.done ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={link.done ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={326} y={70 + i * 44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill={link.label.includes('skip') ? 'var(--color-ink-soft)' : 'var(--color-ink)'}>
            {link.label}
          </text>
          {i < view.chain.length - 1 && (
            <HandArrow from={{ x: 326, y: 84 + i * 44 }} to={{ x: 326, y: 90 + i * 44 }} curve={0} seed={1021 + i} strokeWidth={1.8} headLength={7} />
          )}
        </motion.g>
      ))}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={182} width={352} height={30} seed={1023} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={201} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={238} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={252} width={360} height={36} seed={1022} strokeWidth={1.5} />
      <text x={58} y={274} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.slice(-2).join('   ·   ')}
      </text>
    </svg>
  )
}

const DELAY_CHAIN_EXERCISE: CodeExerciseDef = {
  id: 'l64-delaychain',
  title: 'build the receipt machine',
  task: 'Make your own promise from scratch — then transform its value through a FLAT two-link chain (no nesting anywhere).',
  steps: [
    <>
      A function <code>delayValue(ms, value)</code> that returns a <code>new Promise</code> which
      resolves with <code>value</code> after <code>ms</code> milliseconds (setTimeout inside the
      executor).
    </>,
    <>
      Call <code>delayValue(50, 10)</code> and attach a chain: the first <code>.then</code>{' '}
      doubles the value and RETURNS it; the second <code>.then</code> adds 1 and prints the
      result.
    </>,
    <>
      Output must be <code>21</code> — and your chain must be flat: two .then links in a row, no
      callback inside a callback.
    </>,
  ],
  starter: '',
  expectedOutput: ['21'],
  mustUse: [
    { test: /new\s+Promise\s*\(\s*\(\s*resolve/, label: 'a promise built by hand: new Promise((resolve, …) => …)' },
    { test: /\.then\s*\([\s\S]*?\)\s*\.then\s*\(/, label: 'a FLAT chain: .then(...).then(...)' },
    { test: /return/, label: 'the first .then RETURNS the transformed value — that’s what feeds link two' },
  ],
  mustNotUse: [
    { test: /await|async/, label: 'promise chains only — async/await arrives in 6.6' },
    { test: /21/, label: 'no hand-typed 21 — the chain must compute it' },
  ],
  modelAnswer: `function delayValue(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

delayValue(50, 10)
  .then((n) => {
    return n * 2;
  })
  .then((n) => {
    console.log(n + 1);
  });`,
}

export const lesson64: LessonDef = {
  id: '6.4',
  hook: (
    <>
      <p>
        Last lesson's pain, prescribed a cure. Instead of you handing your next step INTO the
        async function (a callback), the function hands YOU something back:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a promise — a receipt for work in progress
        </HighlightMark>
        . Order a burger, get a receipt <em>immediately</em>. The receipt isn't the burger — it's
        a live object that will <em>flip</em> when the kitchen finishes, and you can attach plans
        to it: "when ready, do this; if it fails, do that."
      </p>
      <p>
        Three states, one flip: that's the whole shape of a promise.
      </p>
      <p>
        Flat chains and a single shared error drain follow from it — by the end of this lesson the
        pyramid of doom is a straight line, and you'll have built a promise with your own hands.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'receipt',
      caption:
        'new Promise((resolve, reject) => { …start the work… }) — the executor function runs IMMEDIATELY and starts the async work (here, a timer). What you get back, instantly, is the receipt: a promise in state PENDING. Two levers are handed to the executor: resolve(value) to flip it to success, reject(error) to flip it to failure.',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'attach',
      caption:
        'The thread doesn’t wait — "receipt in hand" prints while the kitchen works. Then you attach plans to the receipt: .then(fn) means “when fulfilled, run fn with the value”; .catch(fn) means “if rejected, run fn with the error”. Attaching is instant and non-blocking — these are notes pinned to the receipt.',
      highlightLines: [7, 9, 10, 16],
    },
    {
      id: 'flip',
      caption:
        '60ms later the timer runs resolve("burger #42") — and the promise FLIPS: pending → fulfilled, value locked in.',
      highlightLines: [3],
    },
    {
      id: 'settle-once',
      caption:
        'Crucial rule: a promise settles exactly ONCE. A second resolve, or a late reject, is ignored. Pending → fulfilled OR pending → rejected; one flip, one way, forever.',
      highlightLines: [3],
    },
    {
      id: 'flow',
      caption:
        'The flip triggers the first .then: food is "burger #42", it prints — and look at its last line: return food + " + fries". WHERE does that returned value go? Into the NEXT link. Every .then returns a brand-new promise that fulfills with whatever your function returns.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'flat',
      caption:
        'That’s the pyramid-flattener: because .then returns a new promise, the next step attaches with another .then AT THE SAME INDENT — order → then → then reads top to bottom, exactly the order it runs. Compare with yesterday’s staircase. Same steps, flat line.',
      highlightLines: [9, 10, 13, 14, 15],
    },
    {
      id: 'flat-async-then',
      caption:
        'One more power move: return a PROMISE from a .then and the chain even WAITS for it — steps that take time chain just as flat as instant ones.',
      highlightLines: [9, 10, 13, 14, 15],
    },
    {
      id: 'one-drain',
      caption:
        'And errors get civilization: had the kitchen called reject(new Error("kitchen fire")), every .then would be SKIPPED and the error would slide down the chain into the ONE .catch at the bottom — 5.8’s falling spark, rebuilt for async. One drain for the whole chain, not a check at every level.',
      highlightLines: [16, 17, 18],
    },
    {
      id: 'finally-note',
      caption:
        'One more lane, for cleanup that must run regardless: .finally(fn) runs on EITHER ending — success or rejection — no matter which .then or .catch fired.',
      highlightLines: [16, 17, 18],
    },
  ],
  Viz: PromiseReceipt,
  underTheHood: (
    <>
      <p>
        A promise is a plain object with internal state (<code>pending</code> /{' '}
        <code>fulfilled</code> / <code>rejected</code>) plus lists of reactions to run on settle.
      </p>
      <p>
        Precision that impresses: <code>.then</code> doesn't "wait" — it <em>registers</em> and
        immediately returns the next promise.
      </p>
      <p>
        Attach a <code>.then</code> to an <em>already-settled</em> promise and it still runs (soon,
        not instantly — the exact "when" is next lesson's microtask story).
      </p>
      <p>
        You'll <em>consume</em> promises far more often than construct them: <code>fetch</code>{' '}
        (6.7) returns one, Playwright's every action returns one — your test code will be
        promise-chains wearing 6.6's <code>async/await</code> costume. Building one by hand today
        (the exercise) is like taking apart a lock: afterward, every key makes sense.
      </p>
      <p>
        Naming note for the wild: people say "resolved" loosely to mean fulfilled; strictly,{' '}
        <em>settled</em> = no longer pending (either outcome), <em>fulfilled</em> = success,{' '}
        <em>rejected</em> = failure.
      </p>
      <p>
        Use the strict words in interviews; understand the loose ones in blog posts.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A new Promise whose executor’s resolve fires in 5 seconds — what STATE is it in right after creation? Type it.',
      accept: ['pending', 'Pending', 'PENDING'],
      placeholder: 'the state…',
      why: 'Pending — the receipt starts pending and stays there until resolve or reject flips it (once, one way). The flip 5 seconds later makes it fulfilled.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'Promise.resolve(5)\n  .then((n) => {\n    return n + 1;\n  })\n  .then((n) => {\n    console.log(n * 10);\n  });',
      accept: ['60'],
      placeholder: 'type the console output…',
      why: 'Promise.resolve(5) is an already-fulfilled receipt for 5. Link one returns 6 → that becomes link two’s input → 60. Each .then feeds the next through its RETURN.',
    },
    {
      kind: 'type-output',
      question: 'The promise a chain STARTS from rejects. The chain has three .then links after it and one final .catch. How many of the .then links run? Type the number.',
      accept: ['0', 'zero', 'none', 'Zero'],
      placeholder: 'a number…',
      why: 'Zero — a rejection skips every .then and slides straight to the nearest .catch: one shared drain instead of per-level checks. (After a .catch handles it, the chain below is healthy again.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={DELAY_CHAIN_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain promises to a friend using the receipt picture: the three states and the one-flip rule, what .then really does (and returns!), how chains stay flat, and where errors go.',
    modelAnswer:
      'A promise is a receipt an async function hands you immediately — the work continues in the kitchen. It has three states: pending while working, then exactly ONE flip, ever: to fulfilled (with a value) via resolve, or to rejected (with an error) via reject. .then(fn) doesn’t wait — it pins a plan to the receipt (“when fulfilled, run fn with the value”) and instantly returns a NEW promise that fulfills with whatever fn returns. That’s why chains are flat: order.then(a).then(b) reads top to bottom at one indent, each link feeding the next through its return value — the pyramid of doom becomes a straight line (and if a link returns a promise, the chain waits for it). Errors are the other win: a rejection skips every .then and slides down to one shared .catch — a single drain for the whole chain — with .finally running on either ending for cleanup.',
  },
  recap: [
    'A promise = a receipt: pending → (one flip, once) → fulfilled(value) or rejected(error).',
    '.then registers a plan AND returns a new promise fed by your return value → flat chains that read top-to-bottom. (Returned promises are awaited by the chain.)',
    'Rejections skip every .then into ONE shared .catch; .finally runs either way. Build them rarely, consume them constantly (fetch, Playwright).',
  ],
}
