import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 6.5 — Microtasks vs macrotasks
 * The event loop's missing seat: promise reactions ride an EXPRESS queue
 * (microtasks) that drains COMPLETELY before the regular queue (macrotasks)
 * gets its next turn. The interview snippet, dissected live.
 */

const CODE = `console.log("1 sync");

setTimeout(() => {
  console.log("4 macro");
}, 0);

Promise.resolve().then(() => {
  console.log("3 micro");
});

console.log("2 sync");`

interface View {
  stack: string
  micro: string[]
  macro: string[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the queues */
  badge?: string
}

const VIEWS: View[] = [
  {
    stack: 'global — running', micro: [], macro: [], console: ['1 sync'],
    note: 'MACROTASKS: the 6.2 queue — setTimeout callbacks, clicks, network events',
  },
  {
    stack: 'global — running', micro: [], macro: [], console: ['1 sync'],
    note: 'two queues exist, not one',
    badge: 'MICROTASKS: a second, express queue — promise reactions (.then/.catch/.finally) live here',
  },
  {
    stack: 'global — running', micro: [], macro: ['timeout cb'], console: ['1 sync'],
    note: 'the 0ms timer’s callback parks in the MACRO queue, as in 6.2',
  },
  {
    stack: 'global — running', micro: ['promise cb'], macro: ['timeout cb'], console: ['1 sync'],
    note: 'an already-resolved promise’s reaction is ready immediately — it parks in the MICRO queue',
  },
  {
    stack: '(empty)', micro: ['promise cb'], macro: ['timeout cb'], console: ['1 sync', '2 sync'],
    note: 'sync done, stack empty. Two queues hold one each. Who goes? The rule decides…',
  },
  {
    stack: 'promise cb', micro: [], macro: ['timeout cb'], console: ['1 sync', '2 sync', '3 micro'],
    note: 'THE RULE: after the stack empties, drain the ENTIRE micro queue first',
  },
  {
    stack: 'timeout cb', micro: [], macro: [], console: ['1 sync', '2 sync', '3 micro', '4 macro'],
    note: 'only then does the macro queue advance one. Final order: sync → micro → macro',
  },
  {
    stack: 'timeout cb', micro: [], macro: [], console: ['1 sync', '2 sync', '3 micro', '4 macro'],
    note: 'promise reactions ALWAYS beat a 0ms timer — say it once and own the puzzle genre forever',
    badge: 'fine print: an endless chain of microtasks each queueing another would starve timers completely',
  },
]

function TwoQueues({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={30} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">call stack</text>
      <RoughRect x={26} y={38} width={150} height={44} seed={1031} strokeWidth={2} />
      <text x={101} y={65} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{view.stack}</text>

      {/* micro queue */}
      <text x={220} y={64} fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">⚡ microtasks (express — drains COMPLETELY)</text>
      <RoughRect x={214} y={72} width={200} height={40} seed={1032} strokeWidth={2.2} stroke="var(--color-marker-teal)" />
      {view.micro.map((m) => (
        <motion.text key={m} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} x={314} y={97} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-marker-teal)">{m}</motion.text>
      ))}

      {/* macro queue */}
      <text x={220} y={140} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">🐢 macrotasks (regular — one per turn)</text>
      <RoughRect x={214} y={148} width={200} height={40} seed={1033} strokeWidth={2} />
      {view.macro.map((m) => (
        <motion.text key={m} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} x={314} y={173} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{m}</motion.text>
      ))}

      {/* priority arrow */}
      <HandArrow from={{ x: 208, y: 92 }} to={{ x: 176, y: 62 }} curve={0.2} seed={1035} stroke="var(--color-marker-teal)" strokeWidth={2.4} headLength={10} />
      <HandArrow from={{ x: 208, y: 168 }} to={{ x: 176, y: 70 }} curve={0.3} seed={1036} stroke="var(--color-ink-soft)" strokeWidth={1.8} headLength={9} />
      <text x={150} y={110} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-marker-teal)">first,</text>
      <text x={150} y={126} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-marker-teal)">all of it</text>
      <text x={168} y={158} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">then one</text>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={196} width={352} height={30} seed={1038} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={215} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={236} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={252} width={360} height={34} seed={1037} strokeWidth={1.5} />
      <text x={58} y={274} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const LANES_EXERCISE: CodeExerciseDef = {
  id: 'l65-lanes',
  title: 'one of each, in the right lanes',
  task: 'Produce the exact output sync → micro → macro using one plain print, one promise reaction, and one zero-delay timer — written in an order that PROVES the lanes decide, not the line numbers.',
  steps: [
    <>
      Schedule the timer FIRST in your code: a 0ms <code>setTimeout</code> printing{' '}
      <code>"macro"</code>.
    </>,
    <>
      Then attach a promise reaction printing <code>"micro"</code> (an already-resolved promise is
      fine).
    </>,
    <>
      Then a plain <code>console.log("sync")</code> as your LAST line. Required output:{' '}
      <code>sync</code>, <code>micro</code>, <code>macro</code> — the reverse of how you wrote
      them.
    </>,
  ],
  starter: '',
  expectedOutput: ['sync', 'micro', 'macro'],
  mustUse: [
    { test: /setTimeout[\s\S]*Promise[\s\S]*console\.log\s*\(\s*["']sync["']\s*\)/, label: 'written in the order: timer → promise → sync (the lanes must do the reordering)' },
    { test: /Promise\.resolve\s*\(\s*\)\s*\.then/, label: 'the micro lane entry is a promise reaction' },
  ],
  mustNotUse: [
    { test: /async|await/, label: 'raw lanes only — async/await is next lesson' },
  ],
  modelAnswer: `setTimeout(() => {
  console.log("macro");
}, 0);

Promise.resolve().then(() => {
  console.log("micro");
});

console.log("sync");`,
}

export const lesson65: LessonDef = {
  id: '6.5',
  hook: (
    <>
      <p>
        The 6.2 machine had one queue. Small confession: it has <strong>two</strong> — and the
        second one has priority boarding. Promise reactions don't wait in the regular callback
        queue with the timers and clicks; they ride the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          microtask queue — the express lane
        </HighlightMark>
        .
      </p>
      <p>
        The rule that decides every ordering puzzle: when the stack empties, the engine drains the{' '}
        <em>entire</em> microtask queue first — every promise reaction, including ones queued{' '}
        <em>by</em> other reactions — and only then moves ONE macrotask (timer, click). This is
        the final piece of the event-loop machine, and the snippet on the left is the exact one
        interviewers use to check who really owns it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'macro-defined',
      caption:
        'Vocabulary first. MACROTASKS: the 6.2 queue — setTimeout callbacks, clicks, network events.',
      highlightLines: [1],
    },
    {
      id: 'micro-defined',
      caption:
        'MICROTASKS: a second, express queue — promise reactions (.then/.catch/.finally) live here. Same machine, one new lane, one new rule coming.',
      highlightLines: [1],
    },
    {
      id: 'park-macro',
      caption:
        '"1 sync" prints. The 0ms timer hands its callback through the Web APIs into the MACRO queue — familiar 6.2 territory. It now waits for the stack, as always.',
      highlightLines: [1, 3, 4, 5],
    },
    {
      id: 'park-micro',
      caption:
        'Promise.resolve() is an already-fulfilled receipt, so its .then reaction is ready immediately — and it parks in the MICRO queue. Two queues, one waiting callback each. The race is set.',
      highlightLines: [7, 8, 9],
    },
    {
      id: 'stack-empties',
      caption:
        '"2 sync" prints and global finishes — the stack is empty. In 6.2 the loop would now move “the” queue’s head. But with two queues holding one callback each, WHICH one boards?',
      highlightLines: [11],
    },
    {
      id: 'the-rule',
      caption:
        'THE RULE: drain the ENTIRE microtask queue first. "3 micro" prints — and had that reaction queued more microtasks, they’d all run too, before any macrotask. Express means express: the whole lane empties.',
      highlightLines: [7, 8, 9],
    },
    {
      id: 'then-macro',
      caption:
        'Only with the micro lane empty does the macro queue advance one: "4 macro". Final order: sync → micro → macro — promise reactions ALWAYS beat a 0ms timer. Say it once and own the puzzle genre forever.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'starve-warning',
      caption:
        'Fine print, for later: an endless chain of microtasks each queueing another would starve timers completely — express lanes can be abused.',
      highlightLines: [3, 4, 5],
    },
  ],
  Viz: TwoQueues,
  underTheHood: (
    <>
      <p>
        Who rides where — the practical table: <em>micro</em> = promise reactions,{' '}
        <code>queueMicrotask(fn)</code>, <code>await</code>-resumptions (next lesson!).{' '}
        <em>Macro</em> = <code>setTimeout</code>/<code>setInterval</code>, DOM events, network
        callbacks.
      </p>
      <p>
        The drain point is precisely "each time the stack empties" — even between two macrotasks,
        the micro lane gets fully cleared.
      </p>
      <p>
        Why does the language bother? Consistency guarantees: a promise reaction is guaranteed to
        run <em>before</em> anything else can happen (no click, no timer can sneak between your{' '}
        <code>.then</code>s), which makes chained state updates atomic-feeling. That guarantee is
        exactly what <code>await</code> builds on — 6.6 will read as "microtasks with pretty
        syntax."
      </p>
      <p>
        Debug-life note: this is why a log inside <code>.then</code> appears before a log inside a{' '}
        <code>setTimeout(fn, 0)</code> written earlier — an ordering "bug" that has consumed
        thousands of confused hours. You now dissolve it with one sentence: different lanes.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the FULL output order, separated by spaces:',
      code: 'setTimeout(() => console.log("t"), 0);\nPromise.resolve().then(() => console.log("p"));\nconsole.log("s");',
      accept: ['s p t', 's, p, t', 'spt'],
      placeholder: 'e.g. x y z…',
      why: 'Sync first (s), then the ENTIRE micro lane (p), then one macrotask (t). Lanes decide, not line order — the timer was written first and still runs last.',
    },
    {
      kind: 'type-output',
      question: 'When the stack empties, the microtask queue drains ___ before the next macrotask. Type: partially or completely.',
      accept: ['completely', 'Completely', 'fully', 'completely!'],
      placeholder: 'partially / completely…',
      why: 'Completely — including microtasks queued BY microtasks. Only when the express lane is empty does one macrotask board. (Which is also how an endless microtask chain could starve timers.)',
    },
    {
      kind: 'type-output',
      question: 'A .then reaction and a setTimeout(fn, 0) are both ready. Which runs first? Type: then or timeout.',
      accept: ['then', 'the then', '.then', 'Then', 'promise'],
      placeholder: 'then / timeout…',
      why: 'The .then — promise reactions are microtasks, and the micro lane always fully drains before the macro queue advances. Promises beat timers, every time.',
    },
  ],
  PlayExtra: () => <CodeExercise def={LANES_EXERCISE} />,
  teachBack: {
    prompt:
      'The interviewer shows you sync + setTimeout(0) + Promise.then and asks for the output order and WHY. Give the two-queue explanation, the drain rule, and name what rides in each lane.',
    modelAnswer:
      'Two queues feed the one stack. Macrotasks — setTimeout/setInterval callbacks, clicks, network events — wait in the regular queue from the classic event-loop picture. Microtasks — promise reactions (.then/.catch/.finally), queueMicrotask, await-resumptions — wait in an express queue. The rule: whenever the stack empties, the engine drains the ENTIRE microtask queue first (including microtasks queued by other microtasks), and only then moves ONE macrotask onto the stack. So for the classic snippet: all synchronous logs print first; then every promise reaction; then the setTimeout callback — sync, micro, macro — regardless of the order the lines were written. That’s also why a .then always beats a zero-delay timer, and why an infinite microtask chain would starve timers entirely.',
  },
  recap: [
    'Two queues, one stack: macro (timers, clicks, network) and micro (promise reactions, queueMicrotask, await-resumptions).',
    'THE rule: stack empties → drain ALL microtasks (even newly queued ones) → then ONE macrotask.',
    'Therefore: sync → micro → macro. Promise reactions always beat setTimeout(fn, 0) — the interview snippet is now arithmetic.',
  ],
}
