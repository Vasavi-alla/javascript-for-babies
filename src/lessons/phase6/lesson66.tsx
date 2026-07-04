import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 6.6 — async/await
 * Syntax over promises: async functions always return a promise; await
 * pauses THIS function only (its frame parks on a shelf), frees the stack,
 * and resumes via the microtask lane. try/catch works on async again (5.8
 * completes). The costume your entire Playwright career will wear.
 */

const CODE = `function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function brew() {
  console.log("kettle on");
  await delay(60);
  console.log("tea ready");
  return "cup";
}

console.log("before");
brew().then((c) => console.log("got " + c));
console.log("after");`

interface View {
  stack: string[]
  shelf: string | null
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the stack/shelf */
  badge?: string
}

const VIEWS: View[] = [
  {
    stack: ['global', 'brew()'], shelf: null, console: ['before', 'kettle on'],
    note: 'an async function is called like any function — it starts running immediately, on the stack, until its first await',
  },
  {
    stack: ['global'], shelf: 'brew — paused at line 9, waiting for delay(60)', console: ['before', 'kettle on'],
    note: 'await = park THIS frame on a shelf and FREE the stack. Nothing is blocked.',
  },
  {
    stack: ['global'], shelf: 'brew — paused', console: ['before', 'kettle on', 'after'],
    note: 'proof: "after" prints while brew sleeps on the shelf. Only brew paused — the world kept moving',
  },
  {
    stack: ['brew — resumed'], shelf: null, console: ['before', 'kettle on', 'after', 'tea ready'],
    note: '60ms later the promise fulfills — brew’s paused function returns to the stack and continues from where it left off',
  },
  {
    stack: ['brew — resumed'], shelf: null, console: ['before', 'kettle on', 'after', 'tea ready'],
    note: 'HOW it resumes: 6.5’s machinery',
    badge: 'await is literally .then wearing sync clothing — everything below the await is the .then callback, auto-written',
  },
  {
    stack: ['(empty)'], shelf: null, console: ['before', 'kettle on', 'after', 'tea ready', 'got cup'],
    note: 'brew’s return value fulfills the promise brew() gave its caller — async functions ALWAYS return promises',
  },
  {
    stack: ['(empty)'], shelf: null, console: ['before', 'kettle on', 'after', 'tea ready', 'got cup'],
    note: 'and the reunion 5.8 promised: because later-code runs INSIDE the function again, try/catch works on async failures',
  },
  {
    stack: ['(empty)'], shelf: null, console: ['before', 'kettle on', 'after', 'tea ready', 'got cup'],
    note: 'a rejection re-throws AT the await line, caught by an ordinary catch',
    badge: 'the scattered per-level checks of 6.3, the .catch plumbing of 6.4 — all collapse back into the one error tool you already know',
  },
]

function AsyncShelf({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">call stack</text>
      <RoughRect x={30} y={38} width={160} height={140} seed={1041} strokeWidth={2} roughness={1.6} />
      {view.stack.map((f, i) => (
        <motion.g key={f} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={42} y={140 - i * 46} width={136} height={36} seed={1045 + i} strokeWidth={1.7} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={110} y={163 - i * 46} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{f}</text>
        </motion.g>
      ))}

      {/* the paused shelf */}
      <text x={250} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">the paused shelf</text>
      <RoughRect x={240} y={38} width={180} height={70} seed={1049} strokeWidth={2} roughness={2} stroke="var(--color-pencil-blue)" />
      <AnimatePresence mode="wait">
        {view.shelf ? (
          <motion.g key={view.shelf} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}>
            <RoughRect x={252} y={54} width={156} height={38} seed={1050} strokeWidth={1.7} fill="var(--color-sticky)" fillStyle="solid" />
            <text x={330} y={71} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{view.shelf.split(' — ')[0]}</text>
            <text x={330} y={84} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">{view.shelf.split(' — ')[1] ?? ''}</text>
          </motion.g>
        ) : (
          <motion.text key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={330} y={78} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
            (empty)
          </motion.text>
        )}
      </AnimatePresence>
      <text x={330} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-pencil-blue)">
        await parks a frame here —
      </text>
      <text x={330} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-pencil-blue)">
        resumes via the micro lane ⚡
      </text>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={188} width={352} height={30} seed={1052} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={207} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={230} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={246} width={360} height={40} seed={1051} strokeWidth={1.5} />
      <text x={58} y={264} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">
        {view.console.slice(0, 3).join('  ·  ')}
      </text>
      <text x={58} y={280} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">
        {view.console.slice(3).join('  ·  ')}
      </text>
    </svg>
  )
}

const SCORE_EXERCISE: CodeExerciseDef = {
  id: 'l66-score',
  title: 'await, and catch what falls',
  task: 'Write async code that reads like sync code — including the part where 5.8’s try/catch finally works on async failures again.',
  steps: [
    <>
      A helper <code>delay(ms)</code> returning a promise that resolves after <code>ms</code>{' '}
      (setTimeout inside).
    </>,
    <>
      An async function <code>fetchScore()</code>: await a 40ms delay, then return{' '}
      <code>42</code>. And an async function <code>fetchBroken()</code>: await a 40ms delay, then{' '}
      <code>throw new Error("offline")</code>.
    </>,
    <>
      An async <code>main()</code>: in a <code>try</code>, await <code>fetchScore()</code> and
      print <code>"score: " + it</code>; then await <code>fetchBroken()</code>. In the{' '}
      <code>catch</code>, print the error's message. Call <code>main()</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['score: 42', 'offline'],
  mustUse: [
    { test: /async\s+function\s+main|const\s+main\s*=\s*async/, label: 'an async main drives the flow' },
    { test: /await[\s\S]*await[\s\S]*await/, label: 'awaits throughout — this is the costume' },
    { test: /try\s*\{[\s\S]*await[\s\S]*\}\s*catch/, label: 'try/catch wraps awaited calls — async errors, caught like sync ones' },
    { test: /throw\s+new\s+Error\s*\(\s*["']offline["']\s*\)/, label: 'the failure is a real thrown Error' },
  ],
  mustNotUse: [
    { test: /\.then\s*\(/, label: 'no .then here — await IS the then, in sync costume' },
  ],
  modelAnswer: `function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchScore() {
  await delay(40);
  return 42;
}

async function fetchBroken() {
  await delay(40);
  throw new Error("offline");
}

async function main() {
  try {
    const s = await fetchScore();
    console.log("score: " + s);
    await fetchBroken();
  } catch (err) {
    console.log(err.message);
  }
}

main();`,
}

export const lesson66: LessonDef = {
  id: '6.6',
  hook: (
    <>
      <p>
        Promise chains flattened the pyramid — but they still <em>read</em> like plumbing:{' '}
        <code>.then</code>, arrow, return, <code>.then</code>. JavaScript's final gift to async is
        a costume that makes promise code <em>look synchronous</em>:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          async/await
        </HighlightMark>
        .
      </p>
      <p>
        Two keywords, two precise meanings. <code>async</code> before a function: "this function
        always returns a promise."
      </p>
      <p>
        <code>await</code> before a promise: "pause <em>this function</em> here — park its frame on
        a shelf, free the stack — and resume with the value when the promise settles." Not
        blocking. Pausing <em>one function</em> while the world keeps moving.
      </p>
      <p>
        This is the syntax your entire Playwright career will be written in — today it stops being
        magic.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'call',
      caption:
        '"before" prints, then brew() is called — an async function starts running IMMEDIATELY and synchronously, like any function: "kettle on" prints. The async keyword changed nothing yet. The change comes at the first await.',
      highlightLines: [7, 8, 14, 15],
    },
    {
      id: 'park',
      caption:
        'await delay(60): delay returns a pending promise, and await does its move — brew’s frame LEAVES the stack and parks on a shelf, bookmarked at this exact line. The stack is free. Read that again: await does not block the thread; it suspends ONE function.',
      highlightLines: [9],
    },
    {
      id: 'world-moves',
      caption:
        'Proof on the console: "after" prints while brew sleeps on the shelf. The caller was never paused — brew() returned a pending promise to it instantly (we’ll cash it in a moment). Only the code BELOW the await, INSIDE brew, is waiting.',
      highlightLines: [16],
    },
    {
      id: 'resume-mechanism',
      caption:
        '60ms later the delay promise fulfills — and brew’s paused function returns to the stack to continue from where it left off.',
      highlightLines: [10],
    },
    {
      id: 'resume-then',
      caption:
        'HOW it returns is 6.5’s machinery: the resumption is a MICROTASK. await is literally .then wearing sync clothing — everything below the await is the .then callback, auto-written.',
      highlightLines: [10],
    },
    {
      id: 'always-promise',
      caption:
        'brew finishes: return "cup". But the caller got a PROMISE from brew() — so that return fulfills it, and the .then prints "got cup". The rule with no exceptions: an async function ALWAYS returns a promise — return value → fulfilled promise; a throw inside → rejected promise.',
      highlightLines: [11, 15],
    },
    {
      id: 'try-catch-mechanism',
      caption:
        'And the reunion 5.8 promised: because await makes later-code run INSIDE the function again, try/catch works on async failures — await a rejecting promise and the rejection is re-thrown AT the await line, caught by an ordinary catch.',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'try-catch-payoff',
      caption:
        'The scattered per-level error checks of 6.3, the .catch plumbing of 6.4 — all collapse back into the one error tool you already know. The exercise makes you feel it.',
      highlightLines: [8, 9, 10],
    },
  ],
  Viz: AsyncShelf,
  underTheHood: (
    <>
      <p>
        Await accepts any promise — which is why it composes with everything:{' '}
        <code>await fetch(…)</code> (next lesson), <code>await page.click(…)</code> (Phase 11),{' '}
        <code>await Promise.all([…])</code> (6.8). Awaiting a non-promise value just continues
        with it (wrapped in an instantly-fulfilled promise).
      </p>
      <p>
        And <code>await</code> is only legal inside <code>async</code> functions (plus at the top
        level of modules) — the engine needs permission to suspend the frame.
      </p>
      <p>
        The subtle cost that bites real test suites: <code>await a(); await b();</code> is{' '}
        <em>sequential</em> — b doesn't start until a finishes. Two independent 80ms waits become
        160ms. When steps don't depend on each other, start both promises first, then await —
        lesson 6.8 turns this into a tool (<code>Promise.all</code>).
      </p>
      <p>
        Mental model to keep forever: <em>async/await changes how async code READS, never how it
        RUNS.</em> Underneath: the same receipts (6.4), the same microtask lane (6.5), the same
        event loop (6.2). You can now read all four layers of the machine — that's the phase
        checkpoint's whole job, two lessons from now.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the FULL output order, separated by spaces:',
      code: 'async function go() {\n  console.log("in");\n  await Promise.resolve();\n  console.log("resumed");\n}\nconsole.log("start");\ngo();\nconsole.log("end");',
      accept: ['start in end resumed', 'start, in, end, resumed'],
      placeholder: 'e.g. a b c d…',
      why: 'go() runs synchronously to its first await ("in"), then parks — the caller continues ("end") — and the resumption arrives as a microtask ("resumed"). Async functions run sync until the first await.',
    },
    {
      kind: 'type-output',
      question: 'What does EVERY async function return? Type the one word.',
      accept: ['promise', 'a promise', 'Promise', 'a Promise'],
      placeholder: 'one word…',
      why: 'A promise — always. return value → fulfills it; throw → rejects it; no return → fulfills with undefined. The async keyword is a promise-wrapping guarantee.',
    },
    {
      kind: 'type-output',
      question: 'await pauses ___ — type: the whole thread, or just this function.',
      accept: ['just this function', 'this function', 'the function', 'just the function', 'only this function'],
      placeholder: 'thread / function…',
      why: 'Just this function — its frame parks on the shelf with a bookmark while the stack runs everything else. The thread never waits (6.1’s law survives); one function does.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SCORE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain async/await to a friend who knows promises: what async guarantees, what await actually does to the function (and the thread!), how it resumes, and why try/catch works again.',
    modelAnswer:
      'async before a function is a guarantee: it always returns a promise — a returned value fulfills it, a throw rejects it. await before a promise pauses ONLY that function: its frame leaves the stack and parks with a bookmark at the await line, so the thread stays free and everything else keeps running — it’s suspension, not blocking. When the awaited promise settles, the function’s resumption is queued as a MICROTASK (the express lane), and it continues from the bookmark with the fulfilled value — await is .then wearing synchronous clothing; everything below the await is the callback, auto-written. That’s also why try/catch works again: a rejected promise re-throws at the await line, inside the function, where an ordinary catch grabs it — no more per-level checks or .catch plumbing. And one care: consecutive awaits are sequential; independent work should be started first and awaited together (Promise.all).',
  },
  recap: [
    'async fn ⇒ ALWAYS returns a promise (return → fulfill, throw → reject). Runs synchronously until its first await.',
    'await = park THIS frame (bookmarked) + free the stack; resume via the microtask lane with the settled value. Suspension, never blocking.',
    'try/catch works across await (rejections re-throw at the await line). Beware sequential awaits for independent work — 6.8 fixes that.',
  ],
}
