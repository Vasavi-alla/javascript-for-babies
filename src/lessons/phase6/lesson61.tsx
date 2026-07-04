import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 6.1 — Sync vs async
 * One thread = one call stack. A blocking loop traps it (frozen page, dead
 * clicks — shown honestly). Async = hand the WAITING to the environment and
 * keep the thread free. setTimeout previewed: A, B… then C.
 */

const CODE = `console.log("order placed");

const until = Date.now() + 3000;
while (Date.now() < until) {
  // the only thread is TRAPPED here
}

console.log("3 seconds of nothing else");`

const TIMER_CODE = `console.log("A");

setTimeout(() => {
  console.log("C — two seconds later");
}, 2000);

console.log("B");`

interface View {
  stack: string[]
  frozen: boolean
  parked: string | null
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the stack */
  badge?: string
}

const VIEWS: View[] = [
  {
    stack: ['global'], frozen: false, parked: null, console: ['order placed'],
    note: 'JavaScript has ONE thread — which means exactly ONE call stack (3.6’s tower)',
  },
  {
    stack: ['global', 'while (…) — spinning'], frozen: false, parked: null, console: ['order placed'],
    note: 'lines 3–6 are a deliberate crime: a loop that spins until 3 seconds pass. It’s not “waiting” — it’s WORKING furiously at doing nothing',
  },
  {
    stack: ['global', 'while (…) — spinning'], frozen: true, parked: null, console: ['order placed'],
    note: 'and it occupies the only stack the WHOLE time. This is called BLOCKING: code that holds the thread hostage',
  },
  {
    stack: ['global', 'while (…) — spinning'], frozen: true, parked: null, console: ['order placed'],
    note: 'in a real page: buttons don’t respond, animations freeze, typing vanishes — the page isn’t crashed, it’s queued',
  },
  {
    stack: ['global', 'while (…) — spinning'], frozen: true, parked: null, console: ['order placed'],
    note: 'the page isn’t crashed, it’s queued — three whole seconds of it',
    badge: 'now imagine the loop was “wait for the network” instead — every slow connection would freeze every website',
  },
  {
    stack: ['global'], frozen: false, parked: '⏲ 2000ms timer + callback → handed to the BROWSER', console: ['A'],
    note: 'the fix: don’t WAIT on the thread. setTimeout hands the waiting to the environment',
  },
  {
    stack: ['global'], frozen: false, parked: '⏲ ticking… (off the JS thread)', console: ['A', 'B'],
    note: 'the thread moved on instantly — B prints while the timer ticks elsewhere',
  },
  {
    stack: ['(empty)'], frozen: false, parked: null, console: ['A', 'B', 'C — two seconds later'],
    note: 'two seconds later, with the stack long empty, the callback finally runs: A, B, C — the thread never stood still',
  },
  {
    stack: ['(empty)'], frozen: false, parked: null, console: ['A', 'B', 'C — two seconds later'],
    note: 'but wait — the timer rang OFF the thread. How did the callback get back ONTO the one stack, safely?',
    badge: 'the queue and the loop that guard the stack — the single most famous diagram in JavaScript. Next lesson.',
  },
]

function BlockedStack({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 326" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the ONE call stack
      </text>
      {view.stack.map((f, i) => {
        const y = 170 - i * 52
        return (
          <motion.g key={f} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect x={40} y={y} width={190} height={42} seed={971 + i} strokeWidth={2} stroke={view.frozen && i === view.stack.length - 1 ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fill={view.frozen && i === view.stack.length - 1 ? 'color-mix(in srgb, var(--color-marker-coral) 14%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={135} y={y + 26} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">{f}</text>
          </motion.g>
        )
      })}

      {/* the poor click */}
      <motion.g animate={{ opacity: view.frozen ? 1 : 0.25 }}>
        <RoughRect x={280} y={60} width={130} height={40} seed={975} strokeWidth={1.8} stroke={view.frozen ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'} />
        <text x={345} y={85} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill={view.frozen ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'}>
          {view.frozen ? '🖱️ click… nothing.' : '🖱️ clicks OK'}
        </text>
      </motion.g>

      {/* parked work */}
      <AnimatePresence>
        {view.parked && (
          <motion.g initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={252} y={130} width={172} height={54} seed={976} strokeWidth={1.8} stroke="var(--color-marker-teal)" roughness={1.8} fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
            <text x={338} y={152} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink)">
              the environment’s desk
            </text>
            <text x={338} y={170} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-marker-teal)">
              {view.parked}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={198} width={352} height={34} seed={978} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={219} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)"><WrapTspans text={view.badge} x={220} maxPx={330} fontSize={10} /></text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={254} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill={view.frozen ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={270} width={360} height={32} seed={977} strokeWidth={1.5} />
      <text x={58} y={291} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const DING_EXERCISE: CodeExerciseDef = {
  id: 'l61-ding',
  title: 'prove the thread never waits',
  task: 'Write three prints where the MIDDLE one is scheduled for later — and the output order proves the thread sailed past it without waiting.',
  steps: [
    <>
      Print <code>"start"</code>.
    </>,
    <>
      Schedule a function that prints <code>"ding"</code> to run after <code>50</code>{' '}
      milliseconds — scheduled now, executed later.
    </>,
    <>
      Print <code>"end"</code> immediately after scheduling. The console must show start, end,
      ding — in that order. If ding comes second, the thread waited, and you’ve missed the point.
    </>,
  ],
  starter: '',
  expectedOutput: ['start', 'end', 'ding'],
  mustUse: [
    { test: /setTimeout\s*\(/, label: 'the later-work is scheduled with setTimeout' },
    { test: /50/, label: 'the delay is 50ms' },
  ],
  mustNotUse: [
    { test: /while\s*\(/, label: 'no blocking loops — that’s the villain of this lesson' },
  ],
  modelAnswer: `console.log("start");

setTimeout(() => {
  console.log("ding");
}, 50);

console.log("end");`,
}

export const lesson61: LessonDef = {
  id: '6.1',
  hook: (
    <>
      <p>
        A fact that shapes everything in this phase: JavaScript runs your code on{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          one single thread
        </HighlightMark>{' '}
        — one worker, one call stack, one line executing at any instant. When that thread is busy,{' '}
        <em>everything else on the page waits</em>: clicks go dead, animations freeze, typing
        vanishes into the void. You've seen this — every "page unresponsive" dialog ever.
      </p>
      <p>
        So how does one thread handle slow things — a network reply taking 2 seconds, a timer, a
        file? By refusing to wait. <strong>Asynchronous</strong> means "not now — later": hand the
        waiting to the environment, keep the thread moving, and deal with the result when it
        arrives.
      </p>
      <p>
        This lesson shows the problem raw; the next one reveals the beautiful machinery that makes
        "later" actually work.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'one-stack',
      caption:
        'One thread = one call stack, the tower from 3.6. Every click handler, every animation frame, every line of yours — ALL of it must take turns on this single tower. Keep that image; it makes everything else in this phase obvious.',
      highlightLines: [1],
    },
    {
      id: 'trapped',
      caption:
        'Lines 3–6 are a deliberate crime: a loop that spins until 3 seconds pass. It’s not “waiting” — it’s WORKING furiously at doing nothing.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'blocking-defined',
      caption:
        'And it occupies the only stack the WHOLE time. This is called BLOCKING: code that holds the thread hostage.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'frozen',
      caption:
        'While blocked: a real page’s buttons don’t respond (their click handlers need the stack — it’s occupied), animations freeze (each frame needs the stack), nothing types. The page isn’t crashed; it’s QUEUED.',
      highlightLines: [4, 5],
    },
    {
      id: 'frozen-implication',
      caption:
        'Now imagine the loop was “wait for the network” instead — every slow connection would freeze every website. Unacceptable — hence everything that follows.',
      highlightLines: [4, 5],
    },
    {
      id: 'handoff',
      caption:
        'New code — the civilized way. setTimeout(callback, 2000) does something profound: it hands the TIMER to the environment (the browser itself, which has other threads for exactly this) together with your callback — “when it rings, run this.” Cost to the JS thread: near zero. The waiting happens OFF the thread.',
      codeOverride: TIMER_CODE,
      highlightLines: [3, 4, 5],
    },
    {
      id: 'sails-past',
      caption:
        'And so the famous order begins: A prints, setTimeout REGISTERS and returns immediately, B prints. The thread never stood still.',
      highlightLines: [1, 7],
    },
    {
      id: 'c-arrives',
      caption:
        'Two seconds later — with the stack long empty — the callback finally runs and C appears. A function you passed to be called later: 3.8’s callbacks were rehearsal for exactly this.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'the-question',
      caption:
        'But wait — the timer rang OFF the thread… so how did the callback get back ONTO the one stack, safely, without interrupting whatever was running? THAT handover machine — the queue and the loop that guards the stack — is the single most famous diagram in JavaScript, and it’s the entire next lesson.',
      highlightLines: [3, 4, 5],
    },
  ],
  Viz: BlockedStack,
  underTheHood: (
    <>
      <p>
        Vocabulary, precisely: <strong>synchronous</strong> code runs now, in order, each line
        waiting for the previous — everything you've written until today.
      </p>
      <p>
        <strong>Asynchronous</strong> code is <em>scheduled</em> now but runs later, when its
        moment comes (timer done, reply arrived) and the stack is free.
      </p>
      <p>
        <strong>Blocking</strong> is synchronous code that takes long enough to hurt — the thing
        async exists to avoid. JavaScript's design bet: <em>never block; always schedule.</em>
      </p>
      <p>
        Why one thread at all? Simplicity that pays every day: your code never runs at the same
        instant as other code, so two functions can never modify the same object simultaneously —
        an entire universe of multithreading bugs (locks, races) simply cannot happen. The price
        is discipline: keep every turn on the stack SHORT.
      </p>
      <p>
        <strong>Fun fact:</strong> a busy restaurant runs on this model. One waiter (the thread)
        never stands at your table while the kitchen cooks (blocking) — they take the order, hand
        it to the kitchen (the environment), serve other tables, and come back when the bell
        rings. One waiter, forty tables, nobody starves — as long as the waiter never stops to
        stir a pot personally.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the LAST line this prints:',
      code: 'console.log("A");\nsetTimeout(() => console.log("C"), 1000);\nconsole.log("B");',
      accept: ['C'],
      placeholder: 'type the console output…',
      why: 'setTimeout schedules and returns immediately — the thread prints A, then B, and only after the timer fires (and the stack is free) does C run. Scheduled ≠ executed.',
    },
    {
      kind: 'type-output',
      question: 'JavaScript executes your code on how many threads? Type the number.',
      accept: ['1', 'one', 'One'],
      placeholder: 'a number…',
      why: 'One — hence one call stack, one line at a time. It’s why blocking freezes everything and why the async machinery of this phase exists at all.',
    },
    {
      kind: 'type-output',
      question: 'While a long while-loop spins on the stack, a user clicks a button. Does its handler run during the loop? Type yes or no.',
      accept: ['no', 'No', 'NO', 'no!'],
      placeholder: 'yes / no…',
      why: 'No — the handler needs the one stack, and the loop holds it. The click waits in line (next lesson shows exactly where that line IS). Blocking code = a frozen page.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DING_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: what does “JavaScript is single-threaded” mean, what is blocking and why is it so bad in a browser, and how does setTimeout let one thread handle waiting without standing still?',
    modelAnswer:
      'Single-threaded means one worker and one call stack: exactly one piece of code executes at any instant, and everything — your code, click handlers, animation frames — takes turns on that one stack. Blocking is code that holds the stack for a long time (a heavy loop, or any attempt to WAIT on the thread): while it holds, nothing else can run, so the page freezes — dead clicks, stuck animations. That’s why waiting on the thread is forbidden. setTimeout shows the alternative: it hands the timer plus a callback to the ENVIRONMENT (the browser, which has its own machinery for waiting) and returns immediately — the thread moves on, prints the next lines, and only later, when the timer fires and the stack is free, the callback gets its turn. Scheduled now, executed later — asynchronous, non-blocking.',
  },
  recap: [
    'One thread, one call stack, one line at a time — all code (yours, clicks, frames) takes turns on it.',
    'Blocking = holding the stack (heavy loop, waiting on-thread) → the whole page freezes. The rule: never block, always schedule.',
    'setTimeout hands the WAITING to the environment and returns instantly: A, B… then C. How “later” safely reaches the stack = next lesson’s famous machine.',
  ],
}
