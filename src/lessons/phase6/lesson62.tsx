import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { JobScene, Scene, Takeaway, Key, ChatBubble } from '../../design/JobScene'

/**
 * 6.2 — The event loop (THE flagship)
 * Four parts: the call stack, the environment's Web APIs (waiting room),
 * the callback queue (conveyor), and the loop arm with one rule: stack
 * empty → move ONE callback on. setTimeout(fn, 0) explained forever.
 */

const CODE = `console.log("1");

setTimeout(() => {
  console.log("3");
}, 0);

console.log("2");`

interface View {
  stack: string[]
  webApi: string | null
  queue: string[]
  armActive: boolean
  console: string[]
  note: string
}

const VIEWS: View[] = [
  {
    stack: ['global'], webApi: null, queue: [], armActive: false, console: [],
    note: 'four parts: the stack (JS runs here), the Web APIs (the environment), the callback queue, and the loop connecting them',
  },
  {
    stack: ['global', 'console.log("1")'], webApi: null, queue: [], armActive: false, console: ['1'],
    note: 'plain synchronous work: pushed onto the stack, runs, prints, pops off — the right half of the machine is untouched',
  },
  {
    stack: ['global'], webApi: '⏲ 0ms timer + callback', queue: [], armActive: false, console: ['1'],
    note: 'setTimeout(callback, 0) registers: timer + callback move to the Web APIs, off the stack — and it returns INSTANTLY',
  },
  {
    stack: ['global'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1'],
    note: 'the 0ms timer fires almost immediately — but firing only moves the callback into the QUEUE, a waiting line. Still not the stack',
  },
  {
    stack: ['global', 'console.log("2")'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1', '2'],
    note: 'meanwhile the stack, oblivious to all of that, already reached line 7 and printed "2"',
  },
  {
    stack: ['(empty)'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1', '2'],
    note: 'line 7 is done — the global context finishes. The call stack is now, for the first time, completely EMPTY',
  },
  {
    stack: ['(empty)'], webApi: null, queue: ['() => log("3")'], armActive: true, console: ['1', '2'],
    note: 'THE one rule, checked forever: stack empty? → move the oldest callback from the queue onto it. That is the entire event loop',
  },
  {
    stack: ['() => log("3")'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'the callback is on the stack now — it runs, prints "3", pops off. Final order: 1, 2, 3',
  },
  {
    stack: ['(empty)'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'setTimeout(fn, 0) never means "run now" — it means "queue it now." It still waits behind every line of sync code',
  },
  {
    stack: ['(empty)'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'and if the stack never emptied (6.1\'s frozen page) — the loop\'s one rule never gets to fire. Every timer and click piles up behind the hog, forever',
  },
]

function EventLoopMachine({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* stack */}
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">call stack</text>
      <RoughRect x={30} y={38} width={150} height={140} seed={981} strokeWidth={2} roughness={1.6} />
      {view.stack.map((f, i) => (
        <motion.g key={f} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={42} y={140 - i * 44} width={126} height={34} seed={985 + i} strokeWidth={1.7} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={105} y={162 - i * 44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">{f}</text>
        </motion.g>
      ))}

      {/* web APIs */}
      <text x={250} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">Web APIs — the waiting room</text>
      <RoughRect x={240} y={38} width={180} height={62} seed={991} strokeWidth={2} roughness={1.6} stroke="var(--color-pencil-blue)" />
      <AnimatePresence>
        {view.webApi && (
          <motion.text key={view.webApi} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={330} y={74} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-pencil-blue)">
            {view.webApi}
          </motion.text>
        )}
      </AnimatePresence>

      {/* queue */}
      <text x={250} y={132} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">callback queue (first in, first out)</text>
      <RoughRect x={240} y={140} width={180} height={44} seed={992} strokeWidth={2} roughness={1.6} stroke="var(--color-marker-teal)" />
      {view.queue.map((q, i) => (
        <motion.text key={q} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} x={330 + i * 10} y={167} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-marker-teal)">
          {q}
        </motion.text>
      ))}

      {/* the loop arm */}
      <motion.g animate={{ opacity: view.armActive ? 1 : 0.35 }}>
        <HandArrow from={{ x: 250, y: 196 }} to={{ x: 150, y: 196 }} curve={0.35} seed={995} stroke={view.armActive ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'} strokeWidth={2.6} headLength={11} />
        <text x={200} y={228} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill={view.armActive ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'}>
          the event loop: “stack empty? → move ONE”
        </text>
      </motion.g>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={262} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={13.5} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={276} width={360} height={30} seed={996} strokeWidth={1.5} />
      <text x={58} y={296} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const TICKETS_EXERCISE: CodeExerciseDef = {
  id: 'l62-tickets',
  title: 'the ticket counter',
  task: 'Choreograph four prints so the output proves you can predict the machine: two scheduled callbacks must both wait for ALL the sync code — and keep their queue order.',
  steps: [
    <>
      Print <code>"opens"</code>.
    </>,
    <>
      Schedule (0ms) a print of <code>"ticket 1 served"</code>, then schedule (0ms) a print of{' '}
      <code>"ticket 2 served"</code>.
    </>,
    <>
      Print <code>"queue forms"</code>. Required output order: opens, queue forms, ticket 1
      served, ticket 2 served — sync first, then the queue in first-in-first-out order.
    </>,
  ],
  starter: '',
  expectedOutput: ['opens', 'queue forms', 'ticket 1 served', 'ticket 2 served'],
  mustUse: [
    { test: /setTimeout[\s\S]*setTimeout/, label: 'two separate scheduled callbacks' },
  ],
  mustNotUse: [
    { test: /,\s*[1-9]\d*\s*\)/, label: 'use 0ms delays — this is about the queue, not the clock' },
  ],
  modelAnswer: `console.log("opens");

setTimeout(() => {
  console.log("ticket 1 served");
}, 0);

setTimeout(() => {
  console.log("ticket 2 served");
}, 0);

console.log("queue forms");`,
}

export const lesson62: LessonDef = {
  id: '6.2',
  hook: (
    <>
      <p>
        Last lesson ended on a cliffhanger: the timer rings <em>off</em> the thread — so how does
        its callback get back <em>onto</em> the one and only stack without crashing into whatever's
        running? The answer is the most famous diagram in JavaScript:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the event loop
        </HighlightMark>
        .
      </p>
      <p>
        Four parts, one rule. The <strong>call stack</strong> you know. The <strong>Web APIs</strong>{' '}
        — the environment's waiting room where timers tick and network replies land.
      </p>
      <p>
        The <strong>callback queue</strong> — a first-in-first-out line of callbacks ready to run.
        And the <strong>event loop</strong> itself, a tireless arm with a single rule:{' '}
        <em>is the stack empty? Then move exactly one callback from the queue onto it.</em>
      </p>
      <p>
        Learn this machine and <code>setTimeout(fn, 0)</code> stops being a riddle forever.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-machine',
      caption:
        'Meet the machine, four parts. The call stack — the ONLY place JavaScript executes. The Web APIs — the environment’s own machinery, running on separate threads. The callback queue — a first-in-first-out waiting line. And the event loop — an arm that checks one thing, forever. Nothing is moving yet.',
      highlightLines: [1],
    },
    {
      id: 'sync',
      caption:
        'console.log("1") is plain synchronous work: pushed onto the stack, it runs, prints "1", and pops off. The right half of the machine — Web APIs, queue, loop — isn’t involved at all. Most of your code lives and dies right here.',
      highlightLines: [1],
    },
    {
      id: 'register-handoff',
      caption:
        'Line 3: setTimeout(callback, 0) is CALLED. Watch closely what this call does — it does NOT run the callback. It registers it: the browser’s timer machinery takes both the 0ms delay and your callback function into the Web APIs, off the JS stack entirely. setTimeout returns INSTANTLY — control passes straight to the next line.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'timer-to-queue',
      caption:
        'The 0ms timer fires almost immediately — but firing does not mean running. Look at where the callback actually goes: into the callback QUEUE, a waiting line. NOT the stack. Nothing is ever allowed to jump onto the stack mid-flight — that rule is what keeps single-threaded JavaScript sane.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'stack-unbothered',
      caption:
        'Meanwhile the stack has no idea any of that happened. It already moved past the setTimeout line, reached line 7, and printed "2". Two separate stories, running side by side: the stack finishing its sync work, the callback quietly waiting in its queue.',
      highlightLines: [7],
    },
    {
      id: 'stack-empties',
      caption:
        'Line 7 is done. The global context finishes running. For the first time since the program started, the call stack is completely EMPTY.',
      highlightLines: [7],
    },
    {
      id: 'the-rule',
      caption:
        'And here is the ENTIRE event loop — one rule, checked forever: "is the stack empty? Then move exactly one callback from the queue onto it." Not two. Not "whichever is ready." Exactly one, and only when the stack has nothing else to do.',
      highlightLines: [3],
    },
    {
      id: 'callback-runs',
      caption:
        'The callback moves onto the stack. It runs, prints "3", and pops off. Read the console in order: 1, 2, 3 — sync code always finishes first, no matter how small the delay looked.',
      highlightLines: [4],
    },
    {
      id: 'zero-explained',
      caption:
        'Say it with authority now: setTimeout(fn, 0) does not mean "run immediately." It means "put fn in the queue immediately" — and queued things always wait for every line of synchronous code to finish, because the loop only ever feeds an EMPTY stack.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'blocking-corollary',
      caption:
        'One corollary you already lived through in 6.1: if the stack never empties — a long blocking loop hogging it — the loop’s one rule never gets a chance to fire. Every timer, every click, every network reply piles up behind that one hog, forever. Every mysterious async ordering you’ll ever debug is this exact machine, running precisely as designed.',
      highlightLines: [1],
    },
  ],
  Viz: EventLoopMachine,
  underTheHood: (
    <>
      <p>
        Where do clicks fit? Same machine, no special case: the browser watches the mouse (Web-API
        side), and a click puts your handler <em>in the queue</em>. That's why 6.1's blocked page
        had dead buttons — the handlers were queued behind a stack that never emptied. Every
        "later" in the browser — timers, clicks, network replies, even Playwright's simulated
        events — is a callback taking its turn through this one queue.
      </p>
      <p>
        Also the queue is honest FIFO: two timers with equal delay run in scheduling order — your
        exercise proves it.
      </p>
      <p>
        One seat is still empty in this diagram: promises (lesson 6.4) don't use this queue —
        they get a <em>faster</em> one. That's lesson 6.5, and it's the last piece of the machine.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the FULL output order, separated by spaces:',
      code: 'console.log("a");\nsetTimeout(() => console.log("b"), 0);\nconsole.log("c");',
      accept: ['a c b', 'a, c, b', 'acb', 'a c b '],
      placeholder: 'e.g. x y z…',
      why: 'a runs (sync), the callback is handed off and QUEUED, c runs (sync), the stack empties, the loop moves the callback: b. Zero delay ≠ zero waiting — it waits for the stack.',
    },
    {
      kind: 'type-output',
      question: 'The event loop moves a callback onto the stack only when the stack is ___. Type the word.',
      accept: ['empty', 'Empty', 'empty!'],
      placeholder: 'one word…',
      why: 'Empty — the single rule of the whole machine. Nothing ever interrupts running code; callbacks wait their turn in the queue. That guarantee is what makes one-threaded JavaScript safe.',
    },
    {
      kind: 'type-output',
      question: 'A click happens while your code runs a long sync loop. Where does the click’s handler wait — the stack, or the queue? Type it.',
      accept: ['queue', 'the queue', 'Queue', 'callback queue', 'the callback queue'],
      placeholder: 'stack / queue…',
      why: 'The queue — clicks are Web-API events whose handlers line up like any other callback. They run only when the loop finds the stack empty, which is why blocking code makes buttons feel dead.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, someone will ask you this question:</Scene>
      <ChatBubble who="interviewer" face="🙂">Is the event loop part of the JavaScript engine?</ChatBubble>
      <ChatBubble who="you, after this lesson" face="😊" accent indent>
        No. The engine only has the stack and the heap. The loop, timers, and queue live in the
        browser. Node has its own version, coming in lesson 9.6.
      </ChatBubble>
      <Takeaway>
        <Key>The event loop is not part of the JavaScript engine.</Key> It lives in the
        environment around it.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={TICKETS_EXERCISE} />,
  teachBack: {
    prompt:
      'The interview favorite: “Explain the event loop.” Name the four parts, the one rule, and use setTimeout(fn, 0) as your worked example — including why its callback can never run before the sync code finishes.',
    modelAnswer:
      'Four parts. The call stack: the only place JavaScript executes, one frame at a time. The Web APIs: the environment’s machinery (browser threads) where timers tick and network waits happen — waiting lives here, off the JS thread. The callback queue: a first-in-first-out line of callbacks that are ready. And the event loop: a permanent checker with one rule — if the stack is empty, move exactly one callback from the queue onto the stack. Worked example: setTimeout(fn, 0) hands fn to the timer machinery and returns; the timer fires immediately, but that only places fn in the QUEUE. The loop won’t touch it until the stack is empty, so every remaining line of synchronous code runs first — zero means “queue it now,” never “run it now.” Same machine handles clicks and network replies, which is why blocking the stack freezes a page: the queue backs up behind code that never leaves.',
  },
  recap: [
    'Four parts: call stack (JS runs here) · Web APIs (environment waits here) · callback queue (FIFO) · the loop.',
    'ONE rule: stack empty → move one callback from queue to stack. Nothing ever interrupts running code.',
    'setTimeout(fn, 0) = “queue it now”: all sync code first, then the callback. Blocking starves the queue — dead buttons, frozen pages.',
  ],
}
