import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.6 — Node's event loop & non-blocking I/O
 * 6.2's machine, backstage edition: the Web-API waiting room becomes the
 * libuv workshop. readFile parks a disk job; A-B-C order unchanged; one
 * thread serves many files; readFileSync contrast; microtask priority
 * (6.5) transfers unchanged; await page.click() rides this machine.
 */

const CODE = `import { readFile } from "node:fs/promises";

console.log("A — ask for the file");

const p = readFile("report.txt", "utf8");
p.then((text) => console.log("C —", text));

console.log("B — thread moves on");

// $ node loop.js
// A — ask for the file
// B — thread moves on
// C — suite: 12 passed, 1 failed`

interface Job {
  label: string
  done?: boolean
}
interface View {
  stack: string[]
  jobs: Job[]
  queue: string[]
  console: string[]
  workshopHot?: boolean
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    stack: ['global'], jobs: [], queue: [], console: [],
    note: '6.2’s machine, remembered: one thread, one stack; slow work parks OFF the stack; the loop feeds results back',
  },
  {
    stack: ['global'], jobs: [], queue: [], console: [], workshopHot: true,
    note: 'in the browser the waiting room was “Web APIs” — Node’s room has a name: libuv, a C workshop talking to the OS',
  },
  {
    stack: ['global'], jobs: [{ label: '💾 read report.txt' }], queue: [], console: ['A — ask for the file'],
    note: 'readFile hands the disk job to libuv and returns a PROMISE instantly (6.3’s receipt) — A prints',
  },
  {
    stack: ['global'], jobs: [{ label: '💾 read report.txt' }], queue: [], console: ['A — ask for the file', 'B — thread moves on'],
    note: 'the thread never waits: B prints while the disk spins in the workshop — non-blocking',
  },
  {
    stack: [], jobs: [{ label: '💾 read report.txt', done: true }], queue: ['.then callback'], console: ['A — ask for the file', 'B — thread moves on'],
    note: 'the disk finishes → the .then callback joins the queue → the loop waits for an empty stack',
  },
  {
    stack: ['(callback)'], jobs: [], queue: [], console: ['A — ask for the file', 'B — thread moves on', 'C — suite: 12 passed…'],
    note: 'stack empty → the loop delivers: C prints. A, B, C — 6.2’s choreography, new backstage crew',
  },
  {
    stack: ['global'], jobs: [{ label: '⏲ setTimeout 2000ms' }], queue: [], console: [],
    note: 'Node’s setTimeout? Also libuv — its timer desk. Same “at least this long” honesty from 6.2',
  },
  {
    stack: ['global'], jobs: [{ label: '💾 file 1' }, { label: '💾 file 2' }, { label: '🌐 request' }, { label: '⏲ timer' }], queue: [], console: [],
    note: 'the term on the tin: NON-BLOCKING I/O. I/O = input/output, the slow outside world (disks, networks)',
    badge: 'non-blocking = the thread never stands in line for I/O — libuv stands in line FOR it, one job per errand',
  },
  {
    stack: ['(callback for file 2)'], jobs: [{ label: '💾 file 1' }, { label: '🌐 request' }], queue: ['file 1 callback'], console: [],
    note: 'the superpower: 100 parked jobs, ONE thread collecting results as they finish — this is how Node conquered servers',
  },
  {
    stack: ['STUCK: readFileSync'], jobs: [], queue: [], console: [],
    note: 'contrast: readFileSync (9.5) BLOCKS — the thread stands in line itself. In a script: fine. In a server: 6.1’s frozen page, at datacenter scale',
  },
  {
    stack: [], jobs: [{ label: '🌐 page.click()' }], queue: [], console: [],
    note: 'your 6.x knowledge transfers whole: promises still beat timers to the front (6.5), and every await in a Playwright test rides exactly this machine',
    badge: 'await page.click() = park the job (a message to the browser), thread stays free, the loop resumes your test — 6.6, on Node',
  },
]

function LibuvWorkshop({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* the stack */}
      <text x={90} y={30} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">the ONE stack</text>
      <RoughRect x={30} y={40} width={120} height={110} seed={2401} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      {view.stack.length === 0 && (
        <text x={90} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">(empty)</text>
      )}
      {view.stack.map((frame, i) => (
        <g key={frame}>
          <RoughRect x={40} y={112 - i * 34} width={100} height={30} seed={2405 + i} strokeWidth={1.8} stroke={frame.includes('STUCK') ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fill={frame.includes('STUCK') ? 'color-mix(in srgb, var(--color-marker-coral) 12%, transparent)' : 'transparent'} fillStyle="solid" />
          <text x={90} y={131 - i * 34} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7} fill="var(--color-ink)">{frame}</text>
        </g>
      ))}

      {/* libuv workshop */}
      <text x={310} y={30} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill={view.workshopHot ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'}>
        the libuv workshop 🔧
      </text>
      <RoughRect x={200} y={40} width={220} height={110} seed={2410} strokeWidth={view.workshopHot ? 2.8 : 2} stroke={view.workshopHot ? 'var(--color-marker-coral)' : 'var(--color-ink)'} roughness={1.8} fill="color-mix(in srgb, var(--color-marker-coral) 5%, transparent)" fillStyle="solid" />
      {view.jobs.length === 0 && (
        <text x={310} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">(no parked jobs)</text>
      )}
      {view.jobs.map((job, i) => (
        <motion.g key={job.label} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
          <RoughRect x={210 + (i % 2) * 102} y={50 + Math.floor(i / 2) * 34} width={94} height={28} seed={2415 + i} strokeWidth={1.6} stroke={job.done ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={job.done ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={257 + (i % 2) * 102} y={68 + Math.floor(i / 2) * 34} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">
            {job.label}{job.done ? ' ✓' : ''}
          </text>
        </motion.g>
      ))}

      {/* queue + loop */}
      <text x={90} y={182} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">the queue</text>
      <RoughRect x={30} y={190} width={180} height={34} seed={2420} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={120} y={211} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill={view.queue.length ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>
        {view.queue.length ? view.queue.join(' · ') : '(empty)'}
      </text>
      <text x={320} y={211} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
        ⟳ the loop: stack empty? deliver next
      </text>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={2430} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const ORDER_EXERCISE: CodeExerciseDef = {
  id: 'l96-node-order',
  title: 'prove the order, in miniature',
  task: 'The sandbox’s runner captures async output — so stage the whole machine: synchronous prints, a parked timer, and a microtask, then predict-and-prove the delivery order.',
  steps: [
    <>
      Print <code>"A"</code> synchronously.
    </>,
    <>
      Park a job: a <code>setTimeout</code> with delay <code>0</code> whose callback prints{' '}
      <code>"C"</code>.
    </>,
    <>
      Queue a microtask: <code>Promise.resolve().then(...)</code> printing <code>"P"</code>{' '}
      (6.5’s fast lane).
    </>,
    <>
      Print <code>"B"</code> synchronously. Before running: write down the order you expect —
      then run and check yourself against the two-queues rule.
    </>,
  ],
  starter: '',
  expectedOutput: ['A', 'B', 'P', 'C'],
  mustUse: [
    { test: /setTimeout\s*\(/, label: 'a timer parks the "C" job' },
    { test: /Promise\.resolve\s*\(\s*\)\s*\.then/, label: 'a microtask queues "P" via Promise.resolve().then' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']C["']\s*\)\s*;?\s*console\.log\s*\(\s*["']B["']/, label: 'C must come from the timer callback, not a plain print' },
  ],
  modelAnswer: `console.log("A");

setTimeout(() => {
  console.log("C");
}, 0);

Promise.resolve().then(() => {
  console.log("P");
});

console.log("B");`,
}

export const lesson96: LessonDef = {
  id: '9.6',
  hook: (
    <>
      <p>
        6.2 promised this day would come: the event loop, backstage edition. In the browser, slow
        work parked in the “Web APIs” waiting room. In Node,{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the waiting room is a C workshop called libuv — and it’s how one thread reads a hundred
          files at once
        </HighlightMark>
        .
      </p>
      <p>
        Nothing you learned changes — A, B, C still print in that order. What changes is that you
        finally meet the crew that made it possible, on the runtime your tests will live in.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'recall-62',
      caption:
        'The machine you already own, in one breath: ONE thread, ONE call stack; anything slow parks OFF the stack in a waiting room; finished work queues up; the event loop delivers each callback when the stack is empty. That machine is identical in Node — only the waiting room changes.',
      highlightLines: [1],
    },
    {
      id: 'libuv',
      caption:
        'Node’s waiting room has a name: libuv (say “lib-you-vee”) — a workshop written in C, wired straight to the operating system. Disks, network sockets, timers: libuv runs the errands the browser’s Web APIs used to run. Different crew, same architecture.',
      highlightLines: [1],
    },
    {
      id: 'park-the-job',
      caption:
        'Line 5: readFile — the PROMISE flavor from 9.5 — hands the disk errand to libuv and instantly returns a promise (6.3’s receipt). No waiting happened: A has printed, and the file isn’t read yet.',
      highlightLines: [3, 5],
    },
    {
      id: 'thread-moves-on',
      caption:
        'Line 8 proves the whole idea: B prints while the disk is still spinning in the workshop. The thread never stood in line — that is the entire meaning of non-blocking, watched live.',
      highlightLines: [8],
    },
    {
      id: 'delivery',
      caption:
        'The disk finishes; libuv marks the job done; the .then callback (line 6) joins the queue; the loop waits for the stack to empty. This is 6.2’s rule, unchanged: callbacks NEVER interrupt — they wait their turn.',
      highlightLines: [6],
    },
    {
      id: 'c-prints',
      caption:
        'Stack empty → the loop delivers → C prints with the file’s text. A, B, C: the exact choreography you learned in 6.2, danced by a new backstage crew. Every ordering instinct you built in Phase 6 transfers to Node whole.',
      highlightLines: [10, 11, 12, 13],
    },
    {
      id: 'timers-too',
      caption:
        'setTimeout in Node? Also libuv — its timer desk. Same behavior you know, including 6.2’s honesty clause: the delay means “at LEAST this long,” because delivery still waits for an empty stack.',
      highlightLines: [1],
    },
    {
      id: 'non-blocking-io',
      caption:
        'Now the term on the tin, precisely: NON-BLOCKING I/O. I/O — input/output — is the slow outside world: disks, networks. Non-blocking means the thread never stands in line for it; libuv stands in line FOR the thread, one workshop job per errand. (Blocking, sync, async — all three words now have exact meanings for you.)',
      highlightLines: [5],
    },
    {
      id: 'many-jobs',
      caption:
        'And the superpower this buys: ask for 100 files and libuv parks 100 jobs — the single thread just keeps collecting whichever finishes next. One modest Node process can serve thousands of network connections this way. This is, in one picture, why Node conquered servers.',
      highlightLines: [5],
    },
    {
      id: 'sync-contrast',
      caption:
        'The contrast that locks it in: readFileSync (9.5) BLOCKS — the thread itself stands in the disk’s line, and nothing else runs. In a five-line script, harmless. In a server, it’s 6.1’s frozen page at datacenter scale. Now the Sync/promise choice is a real decision you understand.',
      highlightLines: [1],
    },
    {
      id: 'playwright-hook',
      caption:
        'Everything transfers: promises still beat timers to the front of the line (6.5’s two queues — Node keeps the same rule). And look ahead: every await page.click() in Phase 11 parks a job (a message to the browser), keeps the thread free, and resumes your test through THIS loop. You’ve now met the machine your career runs on.',
      highlightLines: [5, 6],
    },
  ],
  Viz: LibuvWorkshop,
  underTheHood: (
    <>
      <p>
        Two honest details for later. First: some libuv errands (like file reads) use a
        small <strong>thread pool</strong> inside the workshop — but those threads are libuv’s C
        threads, not JavaScript. Your JS still runs on exactly one thread; the pool is plumbing.
      </p>
      <p>
        Second: Node’s loop technically runs in <strong>phases</strong> (timers, I/O callbacks,
        and a Node-special <code>setImmediate</code> among them). The 6.2/6.5 model — sync first,
        then microtasks, then queued callbacks — predicts the right order for everything you’ll
        write in this course. The phase diagram is there when you someday need microscopic
        ordering.
      </p>
      <p>
        Vocabulary you now own precisely: <strong>synchronous</strong> = runs to completion on the
        thread, in order. <strong>Asynchronous</strong> = parked now, delivered later via the
        queue. <strong>Blocking</strong> = holds the thread while waiting.{' '}
        <strong>Non-blocking I/O</strong> = the waiting happens in libuv, never on the thread.
      </p>
      <p>
        <strong>💼 On the job —</strong> this is why one Playwright process can drive several
        browser contexts in parallel without threads. Every await is a parked job, and the loop
        interleaves them. When Phase 11 shows tests overlapping, you’ll recognize the workshop.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'console.log("A"); then readFile(...).then(() => console.log("C")); then console.log("B"). What order prints?',
      accept: ['A B C', 'A, B, C', 'A,B,C', 'ABC', 'a b c', 'a, b, c', 'a,b,c', 'abc'],
      placeholder: 'the order…',
      why: 'A and B are synchronous; the file job parks in libuv and its callback is delivered by the loop only after the stack empties. Sync first, always.',
    },
    {
      kind: 'type-output',
      question: 'In the browser the waiting room was the Web APIs. What is Node’s waiting room called?',
      accept: ['libuv', 'Libuv', 'LIBUV', 'lib-uv'],
      placeholder: 'the name…',
      why: 'libuv — a C workshop wired to the operating system, running the disk, network, and timer errands so the one JS thread never stands in line.',
    },
    {
      kind: 'type-output',
      question: 'readFileSync in the middle of a busy server: does the thread keep serving other work while the disk answers? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — Sync means BLOCKING: the thread itself stands in the disk’s line and nothing else runs. That’s 6.1’s frozen page at server scale, and why the promise flavor exists.',
    },
  ],
  PlayExtra: () => <CodeExercise def={ORDER_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how Node reads 100 files with one thread: the loop, libuv, what non-blocking I/O means, and why readFileSync would ruin it.',
    modelAnswer:
      'Node runs JavaScript on one thread with one call stack — same as the browser — and uses the same event-loop machine from 6.2: slow work parks off the stack, finished callbacks wait in a queue, and the loop delivers them one at a time whenever the stack is empty. The difference is the waiting room: in the browser it was the Web APIs; in Node it’s libuv, a workshop written in C that talks directly to the operating system about disks, network sockets, and timers. Ask for a file with the promise flavor of readFile and the errand is handed to libuv immediately — you get a promise receipt, your next lines keep running, and when the disk answers, the callback is queued and delivered. That’s non-blocking I/O: I/O is the slow outside world, and non-blocking means the thread never stands in its line — libuv stands in line for it. So 100 readFile calls just park 100 jobs in the workshop, and the single thread keeps collecting whichever finishes next; that’s how one Node process serves thousands of connections, and why Node took over servers. readFileSync ruins it because Sync means blocking: the thread itself waits at the disk and nothing else runs — fine in a small script, a frozen server in production. And the ordering rules I already know still hold: sync code first, promise microtasks beat timer callbacks, delays mean “at least this long.”',
  },
  recap: [
    'Same machine as 6.2 — one thread, one stack, queue, loop. Only the waiting room changed: libuv, a C workshop wired to the OS (disks, network, timers).',
    'NON-BLOCKING I/O = the thread never stands in line; libuv queues the errand and the loop delivers the callback later. 100 parked jobs, one thread collecting — why Node conquered servers.',
    'readFileSync = BLOCKING (the thread waits itself) — script-fine, server-fatal. All Phase 6 rules transfer: sync first, microtasks beat timers, and every Phase-11 await rides this exact loop.',
  ],
}
