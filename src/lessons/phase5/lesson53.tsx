import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 5.3 — The scope chain, precisely
 * Every execution context carries an OUTER LINK — a rope to the context of
 * the place the function was WRITTEN (lexical). Name lookup walks the rope
 * outward, never inward. Closures re-explained with the accurate machinery:
 * a kept-alive context at the end of a rope.
 */

const CODE = `const app = "notebook";

function outer() {
  const page = 3;

  function inner() {
    const line = 7;
    console.log(line + " " + page + " " + app);
  }

  inner();
}

outer();`

interface Frame {
  name: string
  vars: string[]
  hot?: boolean
}
interface View {
  frames: Frame[]
  /** lookup: which frame index the ray is checking, and for what */
  seeking?: { name: string; at: number; found: boolean }
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the lookup */
  badge?: string
}

const FRAMES_BASE: Frame[] = [
  { name: 'global context', vars: ['app: "notebook"', 'outer: ƒ'] },
  { name: 'outer’s context', vars: ['page: 3', 'inner: ƒ'] },
  { name: 'inner’s context', vars: ['line: 7'] },
]

const VIEWS: View[] = [
  {
    frames: FRAMES_BASE,
    console: [],
    note: 'by the time line 8 runs, three execution contexts exist — global, outer’s, and inner’s — each holding its own names',
  },
  {
    frames: FRAMES_BASE,
    console: [],
    note: 'each context ALSO carries one OUTER LINK to another context — tied at creation time to the place its function was WRITTEN',
    badge: 'picture the link as a rope: inner is written inside outer → a rope ties inner to outer',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 2 ? { ...f, hot: true } : f)),
    seeking: { name: 'line', at: 2, found: true },
    console: [],
    note: 'looking up “line”: found in the CURRENT context — search over. Lookup ALWAYS starts local and stops at the first hit',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 1 ? { ...f, hot: true } : f)),
    seeking: { name: 'page', at: 1, found: true },
    console: [],
    note: '“page”: miss locally → follow ONE outer link → found in outer’s context',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 0 ? { ...f, hot: true } : f)),
    seeking: { name: 'app', at: 0, found: true },
    console: ['7 3 notebook'],
    note: '“app”: two outer links out, found in global. The full print assembles: 7 3 notebook',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 0 ? { ...f, hot: true } : f)),
    seeking: { name: 'app', at: 0, found: true },
    console: ['7 3 notebook'],
    note: 'had global missed too, the walk is OVER — no more links left to follow',
    badge: 'ReferenceError, precisely defined: the name isn’t registered anywhere on the chain',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 0 ? { ...f, hot: true } : f)),
    console: ['7 3 notebook'],
    note: 'the walk goes OUTWARD only — global could never reach in and read page or line. Privacy by direction.',
  },
  {
    frames: FRAMES_BASE.map((f, i) => (i === 0 ? { ...f, hot: true } : f)),
    console: ['7 3 notebook'],
    note: 'now say 3.7’s closure precisely: a function that outlives its maker keeps its outer link',
    badge: 'the “backpack” was always a kept-alive context at the end of a link',
  },
]

function ScopeRopes({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const X = [26, 96, 166]
  return (
    <svg viewBox="0 0 440 350" className="w-full">
      {view.frames.map((f, i) => {
        const y = 40 + i * 74
        return (
          <motion.g key={f.name} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <RoughRect x={X[i]} y={y} width={220} height={56} seed={851 + i} strokeWidth={f.hot ? 2.6 : 1.8} stroke={f.hot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={f.hot ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={X[i] + 8} y={y - 5} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">{f.name}</text>
            {f.vars.map((v, j) => (
              <text key={v} x={X[i] + 12} y={y + 22 + j * 18} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{v}</text>
            ))}
            {/* rope to outer */}
            {i > 0 && (
              <HandArrow
                from={{ x: X[i] - 4, y: y + 28 }}
                to={{ x: X[i - 1] + 60, y: y - 18 }}
                curve={0.2}
                seed={861 + i}
                stroke="var(--color-pencil-blue)"
                strokeWidth={2.2}
                headLength={9}
              />
            )}
          </motion.g>
        )
      })}
      <text x={356} y={60} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-pencil-blue)">
        ropes =
      </text>
      <text x={356} y={76} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-pencil-blue)">
        outer links
      </text>

      {/* seeking badge */}
      <AnimatePresence mode="wait">
        {view.seeking && (
          <motion.g key={view.seeking.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={300} y={120} width={122} height={44} seed={865} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="solid" />
            <text x={361} y={138} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
              seeking: {view.seeking.name}
            </text>
            <text x={361} y={156} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-marker-teal)">
              ✓ found
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={250} width={352} height={26} seed={867} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={267} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={298} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={310} width={360} height={30} seed={866} strokeWidth={1.5} />
      <text x={52} y={306} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">console</text>
      <text x={58} y={330} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const LABEL_EXERCISE: CodeExerciseDef = {
  id: 'l53-label',
  title: 'a label maker with a long rope',
  task: 'Build a function factory whose product reaches through TWO ropes: its own context, its maker’s context, and the global context — all in one returned string.',
  steps: [
    <>
      A global <code>const brand = "jfb"</code>.
    </>,
    <>
      A function <code>makeLabel()</code> that declares <code>const sep = " · "</code> and RETURNS
      an inner function. The inner function takes one parameter <code>id</code> and returns{' '}
      <code>brand + sep + id</code> — one name from each context on the chain.
    </>,
    <>
      Call the factory once, store the product as <code>label</code>, and print{' '}
      <code>label("cart")</code>. (Note that makeLabel has RETURNED by then — and the rope still
      holds. That’s 3.7’s closure, now with its precise machinery.)
    </>,
  ],
  starter: '',
  expectedOutput: ['jfb · cart'],
  mustUse: [
    { test: /const\s+brand\s*=/, label: 'brand lives in the global context' },
    { test: /function\s+makeLabel|const\s+makeLabel\s*=/, label: 'a factory named makeLabel' },
    { test: /return\s+(function|\(?\s*\w+\s*\)?\s*=>)/, label: 'the factory RETURNS a function' },
    { test: /brand\s*\+\s*sep\s*\+\s*id/, label: 'the product concatenates one name per context: brand + sep + id' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']jfb/, label: 'no hand-built output string — the chain must assemble it' },
  ],
  modelAnswer: `const brand = "jfb";

function makeLabel() {
  const sep = " · ";
  return function (id) {
    return brand + sep + id;
  };
}

const label = makeLabel();
console.log(label("cart"));`,
}

export const lesson53: LessonDef = {
  id: '5.3',
  hook: (
    <>
      <p>
        Lesson 3.5 gave you the picture: nested bubbles, a lookup ray shooting outward. It worked.
        But now you own execution contexts, so you can have the <em>precise</em> version — the one
        interviewers mean when they say{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the scope chain
        </HighlightMark>
        .
      </p>
      <p>
        Here it is: every execution context carries, besides its memory table, one <strong>outer
        link</strong> — a rope to another context. Which one? The context of the place the function
        was <em>written</em> (that's what "lexical scoping" means — decided by text position, fixed
        forever, regardless of who calls it). Name lookup is a rope-walk: check the current table,
        miss, follow the rope, repeat — until found, or the global table misses too and you get a{' '}
        <code>ReferenceError</code>. And with this one picture, closures stop being magic for good.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'three-contexts',
      caption:
        'By the time line 8 runs, three execution contexts exist: global (holding app and outer), outer’s (holding page and inner), and inner’s (holding line). Each holds its own names, in its own memory table.',
      highlightLines: [1, 3, 6],
    },
    {
      id: 'the-outer-link',
      caption:
        'Besides its table, every context ALSO carries ONE outer link to another context — tied at creation time to the place its function’s text was WRITTEN: inner is written inside outer → linked to outer. outer is written at the top level → linked to global. Picture the link as a rope: it never re-ties, no matter who calls the function.',
      highlightLines: [3, 6],
    },
    {
      id: 'local-hit',
      caption:
        'Line 8 needs three names. First, line: check inner’s own table — found, 7. Lookup ALWAYS starts local and stops at the first hit (which is why an inner const page would SHADOW the outer one — 3.5’s shadowing, mechanized).',
      highlightLines: [7, 8],
    },
    {
      id: 'one-hop',
      caption:
        'Next, page: inner’s table — miss. Follow inner’s outer link to outer’s context — found, 3. One hop. The engine does exactly this walk, table by table, every time a name isn’t local.',
      highlightLines: [4, 8],
    },
    {
      id: 'two-hops',
      caption:
        'Last, app: inner — miss. outer — miss. One more outer link to global — found, "notebook". The full print assembles: 7 3 notebook.',
      highlightLines: [1, 8],
    },
    {
      id: 'reference-error-defined',
      caption:
        'Had global missed too, the walk would be OVER — no more links left to follow. THAT is ReferenceError, defined precisely: the name isn’t registered anywhere on the chain.',
      highlightLines: [1, 8],
    },
    {
      id: 'outward-only',
      caption:
        'The links point OUTWARD only. inner can read outward to page and app — but global code could never reach INTO outer’s context and read page. Privacy by direction.',
      highlightLines: [3, 6],
    },
    {
      id: 'closure-reframed',
      caption:
        'And now say 3.7’s closure precisely: when a function outlives its maker, its outer link keeps the maker’s CONTEXT alive — the “backpack” was a linked, kept-alive context all along. The exercise below has you build exactly that.',
      highlightLines: [11, 13],
    },
  ],
  Viz: ScopeRopes,
  underTheHood: (
    <>
      <p>
        "Lexical" (or "static") scoping means the ropes are tied by <em>where code is written</em>,
        not where it's called from. Call <code>inner</code> from anywhere — pass it around, store
        it in an array, invoke it in another function — its rope still points at <code>outer</code>
        's context. This is exactly the property <code>this</code> does NOT have (next lesson's
        drama: <code>this</code> is decided at call time).
      </p>
      <p>
        The precise closure story: a returned inner function keeps a reference to its outer
        context, so the garbage collector (lesson 5.7) cannot sweep that context — its variables
        stay alive and privately reachable only through the rope. One maker call = one kept
        context, which is why two counters from the same factory never share a count (3.7's
        independent counters, explained).
      </p>
      <p>
        Blocks count too: every <code>{'{ }'}</code> with a <code>let</code>/<code>const</code>{' '}
        inside gets its own small environment on the chain — that's the machinery behind 3.5's
        block scope and 5.2's note that <code>var</code> ignores it (var registers on the nearest{' '}
        <em>function</em> context, sailing straight past block environments).
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const size = "L";\nfunction shop() {\n  function tag() {\n    console.log(size);\n  }\n  tag();\n}\nshop();',
      accept: ['L'],
      placeholder: 'type the console output…',
      why: 'tag’s table misses, shop’s table misses, global has size — two ropes out, found. The walk is table → rope → table → rope, stopping at the first hit.',
    },
    {
      kind: 'type-output',
      question: 'This code throws when the last line runs. Type the ERROR NAME:',
      code: 'function bake() {\n  const temp = 200;\n}\nbake();\nconsole.log(temp);',
      accept: ['ReferenceError', 'referenceerror', 'Reference Error'],
      placeholder: 'the error name…',
      why: 'Ropes point OUTWARD only. Global’s lookup for temp checks its own table — miss — and global has no rope to walk. temp lives (lived!) in bake’s context, unreachable from outside: ReferenceError.',
    },
    {
      kind: 'type-output',
      question: 'The rope (outer link) is decided by where a function is ___ — type: written or called.',
      accept: ['written', 'Written', 'written!'],
      placeholder: 'written / called…',
      why: 'Written — lexical scoping. The rope is tied when the function is created, based on the text’s position, and never re-ties no matter who calls it. (this, next lesson, is the opposite: decided per CALL.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={LABEL_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the scope chain precisely to a friend: what each execution context carries, how a name lookup actually proceeds, what finally causes a ReferenceError — and use it to explain why closures work.',
    modelAnswer:
      'Every execution context has two things: its memory table of local names, and ONE outer link — a rope to the context of the place its function was WRITTEN (lexical: tied by text position, never by caller). Looking up a name: check the current table; on a miss, follow the rope and check that table; repeat outward. The first hit wins (that’s shadowing). If the global table also misses, there are no ropes left — ReferenceError, precisely defined: the name isn’t registered anywhere on the chain. The walk is strictly outward, so outer code can never read an inner context’s variables. And closures: when a function outlives its maker, its rope still holds the maker’s context, so the garbage collector must keep that context alive — the closure “backpack” from 3.7 is literally a kept-alive context at the end of a rope, private because only the rope can reach it.',
  },
  recap: [
    'Each execution context = a memory table + ONE outer link (rope) tied to where its function was WRITTEN — lexical, fixed forever.',
    'Lookup: current table → rope → table → rope… first hit wins (shadowing); global miss → ReferenceError. Outward only — privacy by direction.',
    'A closure is a kept-alive context at the end of a returned function’s rope — one maker call, one private context.',
  ],
}
