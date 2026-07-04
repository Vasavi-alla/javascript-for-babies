import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 5.7 — Garbage collection
 * The rule is REACHABILITY: anything you can walk to from the roots stays;
 * unreachable islands fade and the broom sweeps them. Closures keep contexts
 * alive (5.3's rope, seen from the GC's side). Leaks = accidental reachability.
 */

const CODE = `let user = { name: "Mia" };
user = null;

function makeCounter() {
  let count = 0;
  return () => {
    count = count + 1;
    return count;
  };
}

const tick = makeCounter();
console.log(tick());
console.log(tick());`

interface Island {
  label: string
  reachable: boolean
  via?: string
}
interface View {
  islands: Island[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing reachability */
  badge?: string
}

const VIEWS: View[] = [
  {
    islands: [{ label: '{ name: "Mia" }', reachable: true, via: 'user →' }],
    console: [],
    note: 'reachable: a rope from a ROOT (a global, the running stack) leads to it → it stays. JavaScript employs a collector for this — picture a janitor, sweeping continuously.',
  },
  {
    islands: [{ label: '{ name: "Mia" }', reachable: false }],
    console: [],
    note: 'user = null cut the only rope — the object is an unreachable island → swept, automatically',
  },
  {
    islands: [{ label: '{ name: "Mia" }', reachable: false }],
    console: [],
    note: 'note what did NOT happen: no “free”, no “delete the object” — that’s not a thing you can do',
    badge: 'you can only drop references. The collector decides when to reclaim the memory.',
  },
  {
    islands: [{ label: 'makeCounter’s context { count }', reachable: true }],
    console: [],
    note: 'makeCounter RETURNS — its frame pops off the call stack (3.6). Is this context now unreachable?',
  },
  {
    islands: [
      { label: 'makeCounter’s context { count }', reachable: true, via: 'tick’s rope →' },
    ],
    console: [],
    note: 'walk from the roots: tick (a global) → the arrow function → its rope → makeCounter’s context. REACHABLE — the collector must keep it',
  },
  {
    islands: [
      { label: 'makeCounter’s context { count: 2 }', reachable: true, via: 'tick’s rope →' },
    ],
    console: ['1', '2'],
    note: 'kept means ALIVE, not frozen — count updates across calls. Closures = reachability, by design',
  },
  {
    islands: [
      { label: 'log: [big, big, big, …]', reachable: true, via: 'global cache →' },
    ],
    console: ['1', '2'],
    note: 'so how do real programs leak memory? By ACCIDENTAL reachability: a global you keep pushing into, a cache no code ever trims',
  },
  {
    islands: [
      { label: 'log: [big, big, big, …]', reachable: true, via: 'global cache →' },
    ],
    console: ['1', '2'],
    note: 'the collector cannot take what you can still reach — so memory just grows',
    badge: 'the fix is never “call the collector” — you can’t. It’s dropping the references you forgot you held.',
  },
]

function GcBroom({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* roots */}
      <RoughRect x={30} y={50} width={120} height={44} seed={921} strokeWidth={2.2} fill="var(--color-marker-yellow)" fillStyle="solid" />
      <text x={90} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">the roots</text>
      <text x={90} y={86} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">globals · running stack</text>

      {view.islands.map((isl, i) => {
        const y = 60 + i * 70
        return (
          <motion.g key={isl.label} animate={{ opacity: isl.reachable ? 1 : 0.35 }}>
            <RoughRect x={230} y={y} width={186} height={44} seed={925 + i} strokeWidth={isl.reachable ? 2 : 1.6} stroke={isl.reachable ? 'var(--color-ink)' : 'var(--color-marker-coral)'} roughness={isl.reachable ? 1.3 : 2.5} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
            <text x={323} y={y + 27} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{isl.label}</text>
            {isl.reachable && isl.via ? (
              <g>
                <HandArrow from={{ x: 152, y: 72 }} to={{ x: 226, y: y + 22 }} curve={0.1} seed={931 + i} stroke="var(--color-marker-teal)" strokeWidth={2.4} headLength={9} />
                <text x={180} y={y + 6} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-marker-teal)">{isl.via}</text>
              </g>
            ) : (
              !isl.reachable && (
                <motion.text initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} x={236} y={y - 8} fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-coral)">
                  🧹 unreachable — swept
                </motion.text>
              )
            )}
          </motion.g>
        )
      })}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={150} width={352} height={34} seed={937} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={171} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={240} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={256} width={360} height={30} seed={936} strokeWidth={1.5} />
      <text x={58} y={276} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const WALLET_EXERCISE: CodeExerciseDef = {
  id: 'l57-wallet',
  title: 'privacy by reachability',
  task: 'Build a wallet whose balance is IMPOSSIBLE to touch from outside — not hidden by convention, but unreachable by the rules of the language. Then prove it.',
  steps: [
    <>
      A function <code>makeWallet()</code> with a local <code>let balance = 0</code>, returning an
      OBJECT with two methods: <code>add(amount)</code> (adds to balance, returns nothing) and{' '}
      <code>total()</code> (returns balance). Both reach balance through their closure — never
      through <code>this</code>.
    </>,
    <>
      Make one wallet. Add <code>40</code>, then <code>60</code>. Print <code>total()</code>.
    </>,
    <>
      Now the proof: print <code>w.balance</code> — it must be <code>undefined</code>, because
      balance is NOT a property. It lives in the kept-alive context, reachable only through the
      two ropes.
    </>,
  ],
  starter: '',
  expectedOutput: ['100', 'undefined'],
  mustUse: [
    { test: /let\s+balance\s*=\s*0/, label: 'balance is a closure variable, starting at 0' },
    { test: /return\s*\{/, label: 'the factory returns an object of methods' },
    { test: /\.balance/, label: 'the proof: reading .balance from outside' },
  ],
  mustNotUse: [
    { test: /this\./, label: 'no this — the whole point is closure reachability, not properties' },
    { test: /balance\s*:/, label: 'balance must never become a property' },
  ],
  modelAnswer: `function makeWallet() {
  let balance = 0;
  return {
    add(amount) {
      balance = balance + amount;
    },
    total() {
      return balance;
    },
  };
}

const w = makeWallet();
w.add(40);
w.add(60);
console.log(w.total());
console.log(w.balance);`,
}

export const lesson57: LessonDef = {
  id: '5.7',
  hook: (
    <>
      <p>
        Since lesson 0.4 you've been borrowing memory slots by the thousand — every object, every
        array, every kept-alive closure context. Nothing you've written ever gave one back. So why
        hasn't your laptop melted? Because JavaScript employs a janitor: the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          garbage collector
        </HighlightMark>
        , sweeping continuously, on one beautifully simple rule.
      </p>
      <p>
        The rule is <strong>reachability</strong>: start from the <em>roots</em> — global
        variables, the currently running call stack — and walk every rope and arrow you can
        (4.6's references, 5.3's outer links). Everything reached: kept. Everything unreached: an
        island, swept. That one rule explains why closures "magically" stay alive — and exactly
        how real programs leak memory anyway.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'reachable',
      caption:
        'Line 1: the object lives in the heap (4.6), and the global variable user holds an arrow to it. From the roots you can walk to it → reachable → kept. Every object you can still use is, by definition, reachable.',
      highlightLines: [1],
    },
    {
      id: 'swept',
      caption:
        'user = null re-points the only arrow. Now start at the roots and walk: NO path leads to { name: "Mia" } anymore. It’s an unreachable island — and at some point soon, the collector reclaims its memory.',
      highlightLines: [2],
    },
    {
      id: 'swept-no-free',
      caption:
        'Notice what you did NOT do: no “free”, no “delete the object”. Those aren’t things you can do in JavaScript. You can only drop references — the garbage collector decides when to reclaim the memory.',
      highlightLines: [2],
    },
    {
      id: 'frame-pops',
      caption:
        'Now the case that confuses everyone else but not you: makeCounter RETURNS, and its frame pops off the call stack (3.6). Its context — holding count — should be sweepable now… shouldn’t it?',
      highlightLines: [4, 5, 6, 7, 8, 9],
    },
    {
      id: 'closure-kept',
      caption:
        'Walk from the roots to check: tick (a global) → the arrow function → its 5.3 rope → makeCounter’s context. REACHABLE. The collector must keep it. The closure “backpack” is literally the GC obeying the reachability rule.',
      highlightLines: [9, 12],
    },
    {
      id: 'alive',
      caption:
        'And kept means ALIVE, not frozen: tick() increments count to 1, then 2 — state surviving between calls, privately. Nothing but tick’s rope can reach that count.',
      highlightLines: [13, 14],
    },
    {
      id: 'leaks',
      caption:
        'So how do real programs leak memory if a collector exists? By ACCIDENTAL reachability: a global array you push into forever, a cache no code ever trims, a timer callback holding a reference to a huge object.',
      highlightLines: [1, 2],
    },
    {
      id: 'leaks-fix',
      caption:
        'The collector cannot take what you can still reach — so memory grows. The fix is never “call the collector” (you can’t); it’s dropping the references you forgot you held.',
      highlightLines: [1, 2],
    },
  ],
  Viz: GcBroom,
  underTheHood: (
    <>
      <p>
        Engines implement reachability with mark-and-sweep: periodically mark everything walkable
        from the roots, then sweep the unmarked. V8 runs this in generations (new objects are
        checked often — most die young; survivors graduate to a rarely-checked old space) and
        mostly in tiny pauses interleaved with your code. When exactly? The engine decides; no API
        asks it to run.
      </p>
      <p>
        The practical posture: <em>don't fear creating objects; fear holding them forever.</em>{' '}
        Creation is cheap and short-lived objects are collected almost free. The dangerous pattern
        is the long-lived container that only ever grows — logs, caches, listener lists. In test
        suites this appears as runs that get slower over hours: something is keeping every page
        object reachable.
      </p>
      <p>
        <strong>Fun fact:</strong> hotel housekeeping runs mark-and-sweep. They don't ask "is this
        towel garbage?" — they check whether it's still <em>reachable from a guest</em> (in a
        occupied room, held by someone). Checkout cuts the rope; everything unreachable gets
        swept. You never call housekeeping to collect a specific towel — you just stop holding it.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'After line 2 runs, can the collector reclaim the object from line 1? Type yes or no:',
      code: 'let box = { size: "XL" };\nbox = { size: "S" };',
      accept: ['yes', 'Yes', 'yes!', 'YES'],
      placeholder: 'yes / no…',
      why: 'Re-pointing box dropped the only rope to { size: "XL" } — it’s an unreachable island now, eligible for sweeping. (The new { size: "S" } is safely held.)',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what the SECOND log prints:',
      code: 'function makeTick() {\n  let n = 0;\n  return () => {\n    n = n + 1;\n    return n;\n  };\n}\nconst t = makeTick();\nconsole.log(t());\nconsole.log(t());',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 't’s rope keeps makeTick’s context reachable, so n survives BETWEEN calls: 1, then 2. The GC keeps what closures can reach — that’s the feature.',
    },
    {
      kind: 'type-output',
      question: 'The collector keeps anything ___ from the roots. Type the word.',
      accept: ['reachable', 'Reachable', 'reachable!'],
      placeholder: 'one word…',
      why: 'Reachable — walkable via references and scope ropes from globals and the running stack. Unreachable islands get swept; reachable things never do, which is both why closures work and how leaks happen.',
    },
  ],
  PlayExtra: () => <CodeExercise def={WALLET_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: how does JavaScript decide what memory to free, why do closure variables survive after their function returns, and how can a program with a garbage collector still leak memory?',
    modelAnswer:
      'The collector uses one rule: reachability. It starts from the roots — global variables and the currently running call stack — and walks every reference and scope link it can. Everything it reaches is kept; anything it cannot reach is an unreachable island and gets swept (mark-and-sweep). You never free memory yourself — you just drop references, and the janitor notices. Closure variables survive because of the same rule, not despite it: a returned inner function carries a rope (its outer link) to its maker’s context, so that context is still reachable through the function — the GC must keep it, which is why a counter’s count lives on between calls. And leaks are accidental reachability: a forever-growing global array, an untrimmed cache, a forgotten listener — the broom can’t take what you still hold, so memory grows. The fix is dropping ropes, never “calling the GC.”',
  },
  recap: [
    'One rule: REACHABILITY. Walkable from the roots (globals, running stack) → kept; unreachable islands → swept. You drop ropes; the janitor sweeps.',
    'Closures survive by the same rule: the returned function’s rope keeps its maker’s context reachable — private state between calls (and true privacy: no property, no access).',
    'Leaks = accidental reachability (growing globals, caches, forgotten listeners). Don’t fear creating objects; fear holding them forever.',
  ],
}
