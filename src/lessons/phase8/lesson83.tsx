import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 8.3 — Debugging like a pro
 * Breakpoints pause the world; the Scope panel is 3.5's bubbles live; the
 * Call Stack panel is 3.6's tower drawn by DevTools; step over/into; watch
 * expressions. A real bug (percent vs fraction) found by evidence.
 * iPad-safe framing: the notebook's stepper IS this machine.
 */

const CODE = `function priceAfterDiscount(price, percent) {
  const discount = price * percent;
  return price - discount;
}

const paid = priceAfterDiscount(200, 10);
console.log(paid);`

const FIXED_CODE = `function priceAfterDiscount(price, percent) {
  const discount = (price * percent) / 100;
  return price - discount;
}

const paid = priceAfterDiscount(200, 10);
console.log(paid);`

interface ScopeRow {
  name: string
  val: string
  hot?: boolean
}
interface View {
  bpLine: number | null
  pausedLine: number | null
  scope: ScopeRow[]
  scopeHot?: boolean
  stack: string[]
  stackHot?: boolean
  watch?: { expr: string; val: string } | null
  console: string[]
  note: string
  badge?: string
}

const PAUSED_SCOPE: ScopeRow[] = [
  { name: 'price', val: '200' },
  { name: 'percent', val: '10' },
  { name: 'discount', val: '⟨not yet⟩' },
]
const AFTER_STEP_SCOPE: ScopeRow[] = [
  { name: 'price', val: '200' },
  { name: 'percent', val: '10' },
  { name: 'discount', val: '2000', hot: true },
]
const STACK = ['priceAfterDiscount', '(global)']

const VIEWS: View[] = [
  {
    bpLine: null, pausedLine: null, scope: [], stack: [], console: ['-1800'],
    note: 'a 10% discount on 200 should be 180 — the machine paid the customer 1,800 instead',
  },
  {
    bpLine: null, pausedLine: null, scope: [], stack: [], console: ['-1800'],
    note: 'you could sprinkle console.log everywhere… but that edits the patient to examine it',
    badge: 'log-debugging loop: add lines → re-run → read → delete → repeat. Pausing beats printing.',
  },
  {
    bpLine: 2, pausedLine: 2, scope: PAUSED_SCOPE, stack: STACK, console: [],
    note: 'a BREAKPOINT on line 2: the run PAUSES before that line executes — the world stands still',
  },
  {
    bpLine: 2, pausedLine: 2, scope: PAUSED_SCOPE, scopeHot: true, stack: STACK, console: [],
    note: 'the Scope panel = 3.5’s bubbles, live: every name currently alive, with its value',
  },
  {
    bpLine: 2, pausedLine: 3, scope: AFTER_STEP_SCOPE, stack: STACK, console: [],
    note: 'STEP OVER runs exactly one line: discount is born holding 2000 — caught at its birth line',
  },
  {
    bpLine: 2, pausedLine: 3, scope: AFTER_STEP_SCOPE, stack: STACK, console: [],
    note: 'diagnosis, with evidence: percent arrived as 10; the formula expected 0.10',
    badge: 'price * percent = 200 × 10 = 2000. The formula wanted a fraction; the caller sent a percent.',
  },
  {
    bpLine: 2, pausedLine: 2, scope: PAUSED_SCOPE, stack: STACK, stackHot: true, console: [],
    note: 'the other button, STEP INTO: when the paused line CALLS a function, into dives inside it',
  },
  {
    bpLine: 2, pausedLine: 2, scope: PAUSED_SCOPE, stack: STACK, stackHot: true, console: [],
    note: 'the Call Stack panel IS 3.6’s tower, drawn by DevTools — click a frame to teleport there',
  },
  {
    bpLine: 2, pausedLine: 3, scope: AFTER_STEP_SCOPE, stack: STACK, watch: { expr: '(price * percent) / 100', val: '20' }, console: [],
    note: 'a WATCH pins an expression, recomputed at every pause: 20 — hypothesis confirmed live',
  },
  {
    bpLine: null, pausedLine: null, scope: [], stack: [], console: ['180'],
    note: 'the fix: divide by 100. discount 20, paid 180 — repaired with evidence, not luck',
  },
  {
    bpLine: null, pausedLine: null, scope: [], stack: [], console: ['180'],
    note: 'where to find it: browser DevTools → Sources (F12 or right-click → Inspect)',
    badge: 'no F12 on an iPad? This notebook’s “watch it happen” stepper IS this machine — you’ve been debugging all along.',
  },
]

const MINI_CODE = ['function priceAfterDiscount(…)', '  const discount = …', '  return price - discount;', '}', '', 'const paid = …', 'console.log(paid);']

function DebuggerPanel({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* sources pane */}
      <RoughRect x={20} y={30} width={225} height={158} seed={1501} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={132} y={24} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">Sources — your code, pausable</text>
      {MINI_CODE.map((line, i) => {
        const lineNo = i + 1
        const paused = view.pausedLine === lineNo
        return (
          <g key={i}>
            {view.bpLine === lineNo && <circle cx={34} cy={48 + i * 20} r={5} fill="var(--color-marker-coral)" />}
            {paused && <RoughRect x={42} y={38 + i * 20} width={196} height={19} seed={1510 + i} strokeWidth={1.6} stroke="var(--color-marker-yellow)" fill="color-mix(in srgb, var(--color-marker-yellow) 22%, transparent)" fillStyle="solid" />}
            <text x={48} y={52 + i * 20} fontFamily="var(--font-code)" fontSize={8.5} fill={paused ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>
              {lineNo}  {line}
            </text>
            {paused && <text x={228} y={52 + i * 20} textAnchor="end" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-marker-coral)">⏸</text>}
          </g>
        )
      })}

      {/* scope panel */}
      <RoughRect x={258} y={30} width={162} height={92} seed={1520} strokeWidth={view.scopeHot ? 2.6 : 1.6} stroke={view.scopeHot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={339} y={46} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill={view.scopeHot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>Scope</text>
      {view.scope.length === 0 && (
        <text x={339} y={80} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">(not paused)</text>
      )}
      {view.scope.map((row, i) => (
        <text key={row.name} x={270} y={64 + i * 17} fontFamily="var(--font-code)" fontSize={9} fill={row.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'} fontWeight={row.hot ? 700 : 400}>
          {row.name}: {row.val}
        </text>
      ))}

      {/* call stack panel */}
      <RoughRect x={258} y={132} width={162} height={70} seed={1521} strokeWidth={view.stackHot ? 2.6 : 1.6} stroke={view.stackHot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={339} y={148} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill={view.stackHot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>Call Stack — 3.6’s tower</text>
      {view.stack.length === 0 && (
        <text x={339} y={180} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">(not paused)</text>
      )}
      {view.stack.map((frame, i) => (
        <text key={frame} x={270} y={166 + i * 16} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">
          {i === 0 ? '▶ ' : '   '}{frame}
        </text>
      ))}

      {/* watch panel */}
      <AnimatePresence>
        {view.watch && (
          <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={20} y={198} width={400} height={30} seed={1522} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
            <text x={32} y={217} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
              watch: {view.watch.expr}  →  {view.watch.val}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={392} fontSize={9.5} seed={1530} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={290} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={312} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const BUGHUNT_EXERCISE: CodeExerciseDef = {
  id: 'l83-bug-hunt',
  title: 'the haunted discount machine',
  task: 'The starter code below PAYS the customer instead of discounting. Play debugger: find the line where the wrong number is born, fix it so percent means a human percent (10 = 10%), and prove it on two purchases.',
  steps: [
    <>
      Run the starter first and read the wrong outputs — that’s your bug report.
    </>,
    <>
      Fix <code>priceAfterDiscount</code> so <code>percent</code> arriving as <code>10</code>{' '}
      means ten percent. Change the formula, not the calls.
    </>,
    <>
      The two existing prints must now show the honest prices for (200, 10) and (50, 10).
    </>,
  ],
  starter: `function priceAfterDiscount(price, percent) {
  const discount = price * percent;
  return price - discount;
}

console.log(priceAfterDiscount(200, 10));
console.log(priceAfterDiscount(50, 10));`,
  expectedOutput: ['180', '45'],
  mustUse: [
    { test: /\/\s*100/, label: 'the fix converts the percent — divide by 100 somewhere' },
    { test: /function\s+priceAfterDiscount\s*\(\s*price\s*,\s*percent\s*\)/, label: 'the function keeps its name and both parameters' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*180\s*\)|console\.log\s*\(\s*45\s*\)/, label: 'no hard-coded answers — the repaired machine must compute them' },
    { test: /priceAfterDiscount\s*\(\s*200\s*,\s*0?\.1\s*\)/, label: 'don’t change the calls — 10 must stay 10; fix the formula' },
  ],
  modelAnswer: `function priceAfterDiscount(price, percent) {
  const discount = (price * percent) / 100;
  return price - discount;
}

console.log(priceAfterDiscount(200, 10));
console.log(priceAfterDiscount(50, 10));`,
}

export const lesson83: LessonDef = {
  id: '8.3',
  hook: (
    <>
      <p>
        Until now you’ve hunted bugs the way everyone starts: sprinkle <code>console.log</code>,
        re-run, squint. There’s a sharper tool, and it’s been under your fingers all phase:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a debugger pauses the running program mid-flight, so you can inspect every variable at
          the exact moment things go wrong
        </HighlightMark>
        .
      </p>
      <p>
        Best part: you already know its panels. The Scope panel is 3.5’s bubbles. The Call Stack
        panel is 3.6’s tower. Today they get their professional names — and a real bug to catch.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-bug',
      caption:
        'The setup: a discount function. priceAfterDiscount(200, 10) should take 10% off 200 and return 180. It returns MINUS 1,800 — the shop is paying customers. Somewhere inside, a wrong number is born.',
      highlightLines: [6, 7],
    },
    {
      id: 'log-limits',
      caption:
        'The beginner move is console.log on every line — it works, but slowly: add lines, re-run, read, delete, repeat. And you’re editing the very code you’re examining. Professionals PAUSE the program instead.',
      highlightLines: [7],
    },
    {
      id: 'breakpoint',
      caption:
        'A BREAKPOINT is a pause order pinned to a line — the red dot on line 2. Run the code: execution stops just BEFORE line 2 runs. Nothing is printed, nothing is lost; the entire program stands frozen, waiting for you.',
      highlightLines: [2],
    },
    {
      id: 'scope-panel',
      caption:
        'While paused, the Scope panel lists every variable alive right now, with its current value: price 200, percent 10 — and discount marked “not yet,” because its line hasn’t run. This is 3.5’s bubbles, drawn live by the machine.',
      highlightLines: [1, 2],
    },
    {
      id: 'step-over',
      caption:
        'The STEP OVER button runs exactly one line, then pauses again. Line 2 executes: discount is born holding 2000. A two-thousand discount on a 200 purchase — the wrong number, caught at the exact line where it came to life.',
      highlightLines: [2, 3],
    },
    {
      id: 'diagnosis',
      caption:
        'Now diagnosis is just reading: percent arrived as 10 — a human percent — but the formula price * percent treats it like a fraction. 200 × 10 = 2000 where 20 was intended. Evidence, not guesswork.',
      highlightLines: [2],
    },
    {
      id: 'step-into',
      caption:
        'The neighboring button, STEP INTO: if the paused line CALLS a function, over hops the whole call in one go, while into dives inside it and pauses at its first line. Over = “trust this call.” Into = “show me.”',
      highlightLines: [6],
    },
    {
      id: 'call-stack-panel',
      caption:
        'And the Call Stack panel is exactly 3.6’s tower, drawn by DevTools: priceAfterDiscount on top, the global frame beneath. Clicking any frame teleports the Scope view to where THAT call stands — time travel along the tower.',
      highlightLines: [1, 6],
    },
    {
      id: 'watch',
      caption:
        'One more power: a WATCH expression. Pin (price * percent) / 100 and the debugger recomputes it at every pause — it shows 20, exactly the discount you wanted. Your hypothesis, evaluated live against the frozen world.',
      highlightLines: [2],
    },
    {
      id: 'the-fix',
      caption:
        'The fix writes itself now: divide by 100 on line 2. Step through once more: discount 20, return 180. Repaired with evidence — you watched the wrong number be born, then watched the right one replace it.',
      codeOverride: FIXED_CODE,
      highlightLines: [2],
    },
    {
      id: 'where-to-find-it',
      caption:
        'Where this lives: browser DevTools → the Sources tab (F12, or right-click → Inspect). On an iPad, no DevTools — but you haven’t been missing it: this notebook’s “watch it happen” stepper IS a debugger view. You’ve been stepping code all course.',
      codeOverride: FIXED_CODE,
      highlightLines: [1],
    },
  ],
  Viz: DebuggerPanel,
  underTheHood: (
    <>
      <p>
        You can write a breakpoint <em>into</em> code: the statement <code>debugger;</code> pauses
        execution at that line whenever DevTools is open — and does nothing when it isn’t. Handy;
        just never commit it.
      </p>
      <p>
        Real debuggers also offer <strong>conditional breakpoints</strong> — “pause here only when{' '}
        <code>i === 97</code>” — which is the sane way to catch a bug that appears on the 97th lap
        of a loop. And <strong>step out</strong> finishes the current function and pauses back at
        the caller: the up-elevator of the tower.
      </p>
      <p>
        Honesty note: professionals still use <code>console.log</code> daily — logs are
        breadcrumbs, the debugger is the autopsy table. Quick look → log. Confusing state →
        pause.
      </p>
      <p>
        Job note: Playwright ships this exact experience for tests —{' '}
        <code>npx playwright test --debug</code> opens an inspector where you step through your
        test actions the same way: pause, inspect, step. Same buttons, same tower, Phase 11
        territory.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'You’re paused on a line that calls helper(). Which button pauses INSIDE helper — step over or step into?',
      accept: ['step into', 'into', 'Step into', 'step-into'],
      placeholder: 'step …',
      why: 'Step INTO dives into the call and pauses at its first line; step over runs the whole call as one hop and pauses after it.',
    },
    {
      kind: 'type-output',
      question: 'A breakpoint pauses on line 2, which reads const discount = price * percent. Has discount received its value yet? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — a breakpoint pauses BEFORE its line runs. That’s why the Scope panel showed discount as “not yet” until you stepped.',
    },
    {
      kind: 'type-output',
      question: 'Which DevTools panel is this course’s call-stack tower, drawn for real?',
      accept: ['call stack', 'Call Stack', 'the call stack', 'call stack panel', 'the call stack panel'],
      placeholder: 'panel name…',
      why: 'The Call Stack panel — every paused moment shows the tower of active calls, top card running, and clicking a frame moves your Scope view to it.',
    },
  ],
  PlayExtra: () => <CodeExercise def={BUGHUNT_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how you’d find a wrong-number bug with a debugger instead of console.log: what a breakpoint does, what the Scope and Call Stack panels show, and the difference between step over and step into.',
    modelAnswer:
      'Instead of printing values and re-running, a debugger pauses the live program. You pin a breakpoint to a line — a pause order — and when the run reaches it, everything freezes just before that line executes. While paused, the Scope panel lists every variable currently alive with its exact value (the scope bubbles from 3.5, drawn live), and the Call Stack panel shows the tower of active calls from 3.6 — which function is running and who called it; clicking a frame shows that call’s variables. Then you advance deliberately: step over runs one line and pauses again — perfect for watching a wrong value be born — while step into dives inside a function call on the current line and pauses at its first line. A watch expression pins any formula you like and recomputes it at every pause, so you can test a hypothesis against the frozen state. You find the exact line where the bad number appears, read the evidence, and fix the cause — no guessing, no scattered logs.',
  },
  recap: [
    'A breakpoint pauses the program BEFORE its line runs — the whole world frozen and inspectable. The debugger; statement does the same from inside code.',
    'Scope panel = 3.5’s bubbles live. Call Stack panel = 3.6’s tower, clickable. Watch = a pinned expression recomputed at every pause.',
    'Step over = run one line (hop calls whole). Step into = dive inside the call. Logs for breadcrumbs, the debugger for autopsies — Playwright’s --debug gives tests the same buttons.',
  ],
}
