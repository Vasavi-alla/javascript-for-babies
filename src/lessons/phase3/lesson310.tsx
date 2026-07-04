import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.10 — Default parameters & pure functions
 * Viz part 1: a parameter with a penciled-in fallback that slides in when
 * no argument arrives. Viz part 2: a pure function (sealed box) next to an
 * impure one (a pipe leaking to an outside variable).
 */

const DEFAULT_CODE = `function greet(name = "friend") {
  console.log("Hello, " + name + "!");
}

greet();
greet("Vasavi");`

const REST_CODE = `function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5));`

const PURE_CODE = `let total = 0;

function addToTotal(n) {
  total = total + n;   // reaches OUTSIDE
}

function add(a, b) {
  return a + b;        // sealed: in → out
}`

type Scene =
  | { mode: 'default'; slot: string; fallback: boolean; lines: string[] }
  | { mode: 'rest'; gathered: boolean; result: number | null; lines: string[] }
  | { mode: 'pure'; focus: 'impure' | 'pure'; total: number; lines: string[] }

const REST_ARGS = [1, 2, 3, 4, 5]

const SCENES: Scene[] = [
  { mode: 'default', slot: '', fallback: false, lines: [] },
  { mode: 'default', slot: '"friend"', fallback: true, lines: ['Hello, friend!'] },
  { mode: 'default', slot: '"Vasavi"', fallback: false, lines: ['Hello, friend!', 'Hello, Vasavi!'] },
  { mode: 'rest', gathered: false, result: null, lines: [] },
  { mode: 'rest', gathered: true, result: 15, lines: ['15'] },
  { mode: 'pure', focus: 'impure', total: 5, lines: [] },
  { mode: 'pure', focus: 'pure', total: 5, lines: [] },
  { mode: 'pure', focus: 'pure', total: 5, lines: [] },
]

function PureViz({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]

  if (scene.mode === 'default') {
    return (
      <div className="flex flex-col gap-3 p-2">
        <svg viewBox="0 0 440 190" className="w-full">
          <RoughRect x={110} y={40} width={220} height={110} seed={1001} fill="var(--color-sticky)" fillStyle="solid" />
          <RoughRect x={156} y={30} width={128} height={26} seed={1002} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
          <text x={220} y={48} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
            greet
          </text>
          {/* the slot with its penciled fallback */}
          <RoughRect x={160} y={78} width={120} height={42} seed={1003} fill="var(--color-paper, #fdf8ee)" fillStyle="solid" strokeWidth={1.5} />
          <text x={220} y={72} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink-soft)">
            name
          </text>
          <AnimatePresence mode="popLayout">
            {scene.slot ? (
              <motion.text
                key={scene.slot}
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                x={220}
                y={104}
                textAnchor="middle"
                fontFamily="var(--font-code)"
                fontSize={13}
                fontWeight={700}
                fill={scene.fallback ? 'var(--color-pencil-blue)' : 'var(--color-ink)'}
              >
                {scene.slot}
              </motion.text>
            ) : (
              <text x={220} y={104} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
                empty
              </text>
            )}
          </AnimatePresence>
          <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-pencil-blue)">
            penciled-in fallback: "friend"
          </text>
          <text x={220} y={178} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            {scene.fallback && scene.slot
              ? 'no argument arrived → the fallback slid in (not undefined!)'
              : scene.slot
                ? 'an argument arrived → the fallback stays penciled'
                : 'a parameter with a plan B'}
          </text>
        </svg>
        <ConsolePane lines={scene.lines} />
      </div>
    )
  }

  if (scene.mode === 'rest') {
    return (
      <div className="flex flex-col gap-3 p-2">
        <svg viewBox="0 0 440 210" className="w-full">
          <text x={220} y={24} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            sum(1, 2, 3, 4, 5) — five separate arguments arrive
          </text>
          {REST_ARGS.map((n, i) => {
            const x = 44 + i * 72
            return (
              <g key={i}>
                <RoughRect x={x} y={38} width={46} height={36} seed={1030 + i} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
                <text x={x + 23} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
                  {n}
                </text>
              </g>
            )
          })}
          <text x={220} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            ...numbers — gather them ALL into one array
          </text>
          <RoughRect x={90} y={108} width={260} height={42} seed={1040} fill="var(--color-paper, #fdf8ee)" fillStyle="solid" strokeWidth={1.5} />
          <text x={220} y={134} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill={scene.gathered ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>
            numbers = {scene.gathered ? `[${REST_ARGS.join(', ')}]` : '?'}
          </text>
          <AnimatePresence>
            {scene.result !== null && (
              <motion.text
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                x={220}
                y={182}
                textAnchor="middle"
                fontFamily="var(--font-hand)"
                fontSize={15}
                fill="var(--color-marker-teal)"
              >
                numbers.reduce(…) → {scene.result}
              </motion.text>
            )}
          </AnimatePresence>
        </svg>
        <ConsolePane lines={scene.lines} />
      </div>
    )
  }

  const impureActive = scene.focus === 'impure'
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 210" className="w-full">
        {/* impure: a pipe leaks to an outside variable */}
        <g opacity={impureActive ? 1 : 0.35}>
          <RoughRect x={24} y={60} width={160} height={80} seed={1010} fill="var(--color-sticky)" fillStyle="solid" />
          <text x={104} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
            addToTotal
          </text>
          <text x={104} y={110} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
            no return…
          </text>
          {/* the leaky pipe */}
          <RoughLine x1={104} y1={140} x2={104} y2={172} seed={1011} strokeWidth={3} stroke="var(--color-marker-coral)" />
          <RoughRect x={56} y={172} width={96} height={30} seed={1012} fill="color-mix(in srgb, var(--color-marker-coral) 25%, transparent)" fillStyle="solid" strokeWidth={1.5} />
          <text x={104} y={192} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
            total: {scene.total}
          </text>
          <text x={104} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-marker-coral)">
            impure — it leaks
          </text>
        </g>

        {/* pure: sealed box, in → out */}
        <g opacity={impureActive ? 0.35 : 1}>
          <RoughRect x={252} y={60} width={160} height={80} seed={1013} fill="var(--color-sticky)" fillStyle="solid" />
          {/* the seal: double border */}
          <RoughRect x={244} y={52} width={176} height={96} seed={1014} strokeWidth={1.4} />
          <text x={332} y={90} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
            add
          </text>
          <text x={332} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
            2, 3 → returns 5
          </text>
          <text x={332} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-marker-teal)">
            pure — sealed
          </text>
          <text x={332} y={170} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            same inputs → same output, touches nothing else
          </text>
        </g>
        {stepIndex >= 7 && (
          <text x={220} y={205} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
            testable in ONE line: expect(add(2, 3)).toBe(5) — no setup, no cleanup
          </text>
        )}
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const AREA_EXERCISE: CodeExerciseDef = {
  id: 'l310-area',
  title: 'a parameter with a plan B',
  task: 'An area function where the second side is optional — leave it out and you get a square. Defaults meet return.',
  steps: [
    <>
      A function named <code>area</code> with two parameters: <code>width</code>, and{' '}
      <code>height</code> whose default value is <code>width</code> itself.
    </>,
    <>
      It RETURNS width × height — no printing inside the function (keep it pure!).
    </>,
    <>
      Print <code>area(3)</code> (a 3×3 square — the default kicks in), then{' '}
      <code>area(2, 5)</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['9', '10'],
  mustUse: [
    { test: /function\s+area\s*\(\s*\w+\s*,\s*height\s*=\s*width\s*\)/, label: 'height defaults to width — a square unless told otherwise' },
    { test: /return/, label: 'the result is RETURNED, not printed inside' },
    { test: /console\.log\s*\(\s*area\s*\(\s*3\s*\)\s*\)/, label: 'prints area(3)' },
    { test: /console\.log\s*\(\s*area\s*\(\s*2\s*,\s*5\s*\)\s*\)/, label: 'prints area(2, 5)' },
  ],
  mustNotUse: [{ test: /console\.log[\s\S]*console\.log[\s\S]*console\.log/, label: 'exactly two prints — the function itself stays silent' }],
  modelAnswer: `function area(width, height = width) {
  return width * height;
}

console.log(area(3));
console.log(area(2, 5));`,
}

export const lesson310: LessonDef = {
  id: '3.10',
  hook: (
    <>
      <p>
        Three finishing touches for your function-building skills. First, a fix for an old wound:
        in 3.2, a missing argument left <code>undefined</code> in the parameter and the function
        shouted nonsense. Today the parameter gets a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          penciled-in plan B
        </HighlightMark>{' '}
        — a default value that slides in whenever nothing arrives.
      </p>
      <p>
        Second, the opposite problem: what if you don’t know how many arguments are coming? A{' '}
        <strong>rest parameter</strong> (<code>...numbers</code>) gathers ANY number of incoming
        values into one real array, so the function body can work with them as a group.
      </p>
      <p>
        Third, a distinction your future employer cares about deeply: some functions are{' '}
        <strong>pure</strong> — sealed boxes where the same inputs always produce the same returned
        output, touching nothing else — and some reach outside themselves and <em>change
        things</em>. Both are legal. But one of them is a dream to test, and testing is where
        you’re headed.
      </p>
    </>
  ),
  code: DEFAULT_CODE,
  steps: [
    {
      id: 'default-read',
      caption:
        'One new mark in the definition: name = "friend". That’s a DEFAULT PARAMETER — a fallback penciled into the slot itself. It does nothing while arguments arrive normally; it waits for the day one doesn’t.',
      highlightLines: [1],
    },
    {
      id: 'default-kicks-in',
      caption:
        'greet() — no argument at all. In 3.2 this meant undefined in the slot and “Hello, undefined!”. Now the fallback slides in instead: name becomes "friend", and the output stays humane. The default only fires when the slot would have been undefined.',
      highlightLines: [5],
    },
    {
      id: 'default-overridden',
      caption:
        'greet("Vasavi") — an argument arrived, so the fallback stays penciled and unused. Defaults never fight real arguments; they only fill silence.',
      highlightLines: [6],
      codeOverride: DEFAULT_CODE,
    },
    {
      id: 'rest-intro',
      caption:
        'New code, new trick: (...numbers). Three dots before a parameter name is a REST PARAMETER — “however many arguments show up, gather every single one into one real array named numbers.” One name, any number of incoming values.',
      codeOverride: REST_CODE,
      highlightLines: [1],
    },
    {
      id: 'rest-gathered',
      caption:
        'sum(1, 2, 3, 4, 5) hands over five separate arguments. Rest gathers all five into numbers = [1, 2, 3, 4, 5] — then .reduce (lesson 4.9 gives it the full spotlight) adds them lap by lap to 15. Call sum with three numbers, or eight — rest never complains, it just gathers a shorter or longer array.',
      codeOverride: REST_CODE,
      highlightLines: [2, 5],
    },
    {
      id: 'impure',
      caption:
        'New code, new idea. addToTotal(5) returns nothing — its entire effect is reaching OUTSIDE itself and changing the variable total. That reach is called a side effect, and functions that do it are IMPURE. Legal, common… and sneaky: calling it twice leaves a different world than calling it once.',
      codeOverride: PURE_CODE,
      highlightLines: [3, 4, 5],
    },
    {
      id: 'pure',
      caption:
        'add(2, 3) is the opposite: everything it needs comes in through parameters, everything it produces leaves through return, and it touches NOTHING outside. Sealed. add(2, 3) is 5 today, tomorrow, and on a Tuesday in 2031 — same inputs, same output, always.',
      codeOverride: PURE_CODE,
      highlightLines: [7, 8, 9],
    },
    {
      id: 'wrap',
      caption:
        'Why testers worship purity: a pure function is checkable with one line — expect(add(2, 3)).toBe(5) — no setup, no cleanup, no “it depends”. Impure code needs its whole world arranged first. Write pure where you can, impure only where you must (printing, saving, clicking).',
      codeOverride: PURE_CODE,
    },
  ],
  Viz: PureViz,
  underTheHood: (
    <>
      <p>
        Default parameters, precisely: <code>name = "friend"</code> evaluates the fallback only
        when the incoming argument is <code>undefined</code> — absent entirely, or explicitly
        passed as <code>undefined</code>. (Passing <code>null</code> does NOT trigger it —{' '}
        <code>null</code> is a deliberate value, as lesson 1.7 taught.)
      </p>
      <p>
        Defaults can even use earlier parameters:{' '}
        <code>function area(width, height = width)</code> is legal and genuinely useful.
      </p>
      <p>
        A <strong>rest parameter</strong>, precisely: <code>...numbers</code> must be the LAST
        parameter, and it always gathers into a genuine array (with <code>.reduce</code>,{' '}
        <code>.map</code> and friends all working on it) — never a fixed count of separate slots.
        It’s how functions like <code>Math.max(...)</code> accept any number of arguments at all.
      </p>
      <p>
        A <strong>pure function</strong> satisfies two promises: same inputs → same output, and{' '}
        <strong>no side effects</strong> — no changing outer variables, no printing, no saving, no
        network. Anything that breaks either promise makes the function <strong>impure</strong>.
      </p>
      <p>
        Note the fine print: even <code>console.log</code> is technically a side effect — the
        world (your console) changed. That’s why well-factored code computes with pure functions
        and keeps the printing at the edges.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> the world’s most
        used “functional programming language” is… Excel. Every spreadsheet cell is a little pure
        function of other cells — same inputs, same output, no side effects — which is exactly why
        a billion people trust it with their money without ever debugging it.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what greet() — no argument — prints now that the default exists:',
      accept: ['Hello, friend!'],
      why: 'The slot would have been undefined, so the penciled-in "friend" slides in instead. Defaults only fire on undefined — a real argument (or even null) keeps them unused.',
    },
    {
      kind: 'type-output',
      question: 'Same sum(...numbers) function. Type what sum(10, 20, 30) returns:',
      accept: ['60'],
      why: 'Rest gathers however many arguments arrive — 10, 20 and 30 — into numbers = [10, 20, 30], and reduce adds them: 60. Change the count of arguments and rest just gathers a differently-sized array; nothing else in the function has to change.',
    },
    {
      kind: 'type-output',
      question: 'add(2, 3) returns 5 today. Type what it returns if you call it again in five years:',
      accept: ['5'],
      why: '5, forever — that’s the pure-function promise: same inputs → same output, no dependence on anything outside. This predictability is exactly what makes purity testable with a single assertion.',
    },
    {
      kind: 'type-output',
      question: 'addToTotal changes a variable OUTSIDE itself. Functions like that are called ___ — type the word.',
      accept: ['impure', 'Impure', 'impure functions'],
      placeholder: 'pure / impure…',
      why: 'Impure — reaching outside (changing total) is a side effect. Legal and sometimes necessary, but each call changes the world, so tests need setup and cleanup. Compute pure, print at the edges.',
    },
  ],
  PlayExtra: () => <CodeExercise def={AREA_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: what a default parameter does (and when it does NOT fire), what a rest parameter gathers, and what makes a function pure — plus why testers prefer pure functions.',
    modelAnswer:
      'A default parameter is a fallback written into the slot itself: function greet(name = "friend"). If no argument arrives — the slot would have been undefined — the fallback slides in; if a real value arrives, the default stays unused. It fires ONLY on undefined: even null, being a deliberate value, keeps the default off. A rest parameter, written ...numbers, is the opposite tool: instead of one fixed slot, it gathers however many arguments actually arrive into one real array, so the function can work on them as a group (with reduce, map, and so on) no matter how many were passed. A pure function makes two promises: the same inputs always produce the same returned output, and it has no side effects — it doesn’t change outer variables, print, or save anything; everything enters through parameters and leaves through return. addToTotal is impure because its whole point is changing the outer total. Testers love pure functions because they’re checkable in one line — expect(add(2, 3)).toBe(5) — with no setup or cleanup, while impure code needs its world arranged first. So: compute with pure functions, and push the messy side effects to the edges.',
  },
  recap: [
    'Default parameter = a plan B penciled into the slot: fires only when the argument would be undefined (null doesn’t count).',
    'Rest parameter (...numbers) = gather ANY number of incoming arguments into one real array. Must be the last parameter.',
    'Pure = same inputs → same output + zero side effects. Everything in via parameters, out via return.',
    'Impure = reaches outside: changes variables, prints, saves. Legal — but every call changes the world.',
    'Tester’s rule: compute pure, side-effect at the edges. expect(add(2,3)).toBe(5) needs no setup — that’s the payoff.',
  ],
}
