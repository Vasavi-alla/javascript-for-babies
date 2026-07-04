import { motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.4 — Function expressions & arrow functions
 * Viz: MemoryDiagram-style slots, each holding a TINY function machine —
 * the bombshell that functions are values, stored under labels like any
 * number or string. Arrow syntax as the short costume for the same value.
 */

const CODE = `const double = function (n) {
  return n * 2;
};

const triple = (n) => n * 3;

console.log(double(4));
console.log(triple(4));
console.log(typeof double);`

interface View {
  doubleFilled: boolean
  tripleFilled: boolean
  typeTag: boolean
  console: string[]
}

const VIEWS: View[] = [
  { doubleFilled: true, tripleFilled: false, typeTag: false, console: [] },
  { doubleFilled: true, tripleFilled: false, typeTag: false, console: [] },
  { doubleFilled: true, tripleFilled: true, typeTag: false, console: [] },
  { doubleFilled: true, tripleFilled: true, typeTag: false, console: [] },
  { doubleFilled: true, tripleFilled: true, typeTag: false, console: ['8', '12'] },
  { doubleFilled: true, tripleFilled: true, typeTag: false, console: ['8', '12'] },
  { doubleFilled: true, tripleFilled: true, typeTag: true, console: ['8', '12', 'function'] },
  { doubleFilled: true, tripleFilled: true, typeTag: true, console: ['8', '12', 'function'] },
  { doubleFilled: true, tripleFilled: true, typeTag: true, console: ['8', '12', 'function'] },
]

function TinyMachine({ x, y, body, seed }: { x: number; y: number; body: string; seed: number }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
      {/* mini hopper */}
      <RoughLine x1={x + 22} y1={y} x2={x + 32} y2={y + 12} seed={seed} strokeWidth={1.5} />
      <RoughLine x1={x + 58} y1={y} x2={x + 48} y2={y + 12} seed={seed + 1} strokeWidth={1.5} />
      {/* mini body */}
      <RoughRect x={x + 20} y={y + 12} width={40} height={30} seed={seed + 2} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
      <RoughEllipse cx={x + 40} cy={y + 27} width={16} height={16} seed={seed + 3} strokeWidth={1.2} />
      {/* mini chute */}
      <RoughLine x1={x + 60} y1={y + 32} x2={x + 72} y2={y + 42} seed={seed + 4} strokeWidth={1.5} />
      <text x={x + 40} y={y + 58} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {body}
      </text>
    </motion.g>
  )
}

function FunctionValueSlots({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={220} y={26} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">
        memory — same wall of boxes as Phase 1
      </text>

      {/* double slot */}
      <g>
        <RoughRect x={55} y={78} width={140} height={26} seed={371} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={125} y={96} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
          double
        </text>
        <RoughLine x1={125} y1={104} x2={125} y2={118} seed={372} strokeWidth={1.5} />
        <RoughRect x={45} y={118} width={160} height={100} seed={373} strokeWidth={2} />
        {view.doubleFilled && <TinyMachine x={45} y={128} body="return n * 2" seed={374} />}
        {/* type tag — tags live on VALUES (lesson 1.8) */}
        {view.typeTag && (
          <motion.g initial={{ opacity: 0, rotate: -8 }} animate={{ opacity: 1, rotate: -8 }}>
            <RoughRect x={150} y={124} width={68} height={22} seed={379} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={184} y={139} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">
              "function"
            </text>
          </motion.g>
        )}
      </g>

      {/* triple slot */}
      <g opacity={view.tripleFilled ? 1 : 0.3}>
        <RoughRect x={245} y={78} width={140} height={26} seed={375} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={315} y={96} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
          triple
        </text>
        <RoughLine x1={315} y1={104} x2={315} y2={118} seed={376} strokeWidth={1.5} />
        <RoughRect x={235} y={118} width={160} height={100} seed={377} strokeWidth={2} />
        {view.tripleFilled ? (
          <TinyMachine x={235} y={128} body="n * 3  (auto-return)" seed={378} />
        ) : (
          <text x={315} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            (not created yet)
          </text>
        )}
      </g>

      {/* console strip */}
      <RoughRect x={40} y={240} width={360} height={72} seed={380} strokeWidth={1.5} />
      <text x={52} y={236} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 && (
        <text x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {view.console.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={260 + i * 18}
          fontFamily="var(--font-code)"
          fontSize={12}
          fill={line === 'function' ? 'var(--color-marker-teal)' : 'var(--color-ink)'}
          fontWeight={line === 'function' ? 700 : 400}
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

const MAX_EXERCISE: CodeExerciseDef = {
  id: 'l34-max',
  title: 'an arrow with a decision inside',
  task: 'Arrows meet the ternary from 2.4: a one-line function that PICKS the bigger of two numbers. No braces, no return keyword — the expression does everything.',
  steps: [
    <>
      An arrow function stored in a variable named <code>bigger</code>, taking TWO parameters:{' '}
      <code>a</code> and <code>b</code>.
    </>,
    <>
      Its whole body is one ternary expression: if <code>a &gt; b</code> the result is{' '}
      <code>a</code>, otherwise <code>b</code>. Brace-less, so it auto-returns.
    </>,
    <>
      Print <code>bigger(3, 7)</code>, then <code>bigger(9, 2)</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['7', '9'],
  mustUse: [
    { test: /bigger\s*=\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/, label: 'bigger is an arrow function with two parameters' },
    { test: /\?[\s\S]*:/, label: 'a ternary makes the decision (2.4 pays a visit)' },
    { test: /console\.log\s*\(\s*bigger\s*\(\s*3\s*,\s*7\s*\)\s*\)/, label: 'prints bigger(3, 7)' },
    { test: /console\.log\s*\(\s*bigger\s*\(\s*9\s*,\s*2\s*\)\s*\)/, label: 'prints bigger(9, 2)' },
  ],
  mustNotUse: [
    { test: /=>\s*\{/, label: 'keep it brace-less — the auto-return is the exercise' },
    { test: /\breturn\b/, label: 'no return keyword anywhere: the expression IS the return' },
  ],
  modelAnswer: `const bigger = (a, b) => a > b ? a : b;

console.log(bigger(3, 7));
console.log(bigger(9, 2));`,
}

export const lesson34: LessonDef = {
  id: '3.4',
  hook: (
    <>
      <p>
        Time for a bombshell. In Phase 1 you learned that memory slots hold values — numbers,
        strings, booleans. Ready?{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Functions are values too.
        </HighlightMark>{' '}
        A whole machine — hopper, gears, chute — can sit <em>inside a memory slot</em>, with a
        variable label tied to it, exactly like the number 25 or the string "hello".
      </p>
      <p>
        This sounds like trivia. It is the opposite: it's the idea that powers half of modern
        JavaScript. Because functions are values, they can be stored, handed to other functions
        ("run this when the button is clicked"), and returned from functions. Every Playwright
        test you'll write leans on this.
      </p>
      <p>
        Today: two new ways to write a function that make the value-ness impossible to miss —
        including the famous <code>=&gt;</code> arrow.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'expression',
      caption:
        'Line 1 reads like any variable creation: const label, = , and a right-hand side. But the right-hand side is function (n) { return n * 2; } — an expression that PRODUCES A MACHINE as its value. That value drops into a memory slot and the label double ties onto it.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'expression-name',
      caption:
        'This way of building a machine is called a FUNCTION EXPRESSION. Notice it has no name of its own — the variable’s label provides the name.',
      highlightLines: [1],
    },
    {
      id: 'arrow',
      caption:
        'Line 5 builds the exact same kind of value in a shorter costume: (n) => n * 3. Read the arrow as “goes to”: n goes to n times 3. Parameters on the left, body on the right.',
      highlightLines: [5],
    },
    {
      id: 'auto-return',
      caption:
        'And when the body is a single expression like this, its result is returned AUTOMATICALLY — no braces, no return keyword needed. (Add braces, and you must write return yourself.)',
      highlightLines: [5],
    },
    {
      id: 'call-same',
      caption:
        'Calling is identical no matter how the machine was built: label + parentheses. double(4) → the slot’s machine runs → 8 travels back (lesson 3.3’s chute). triple(4) → 12. The engine doesn’t care which costume the function wore at birth.',
      highlightLines: [7, 8],
    },
    {
      id: 'predict-typeof',
      caption:
        'Line 9 asks typeof double. In lesson 1.8 you learned typeof reads the type tag that lives on a VALUE. Before pressing next — what tag is on the value inside double’s slot?',
      highlightLines: [9],
      prediction: {
        question: 'What does console.log(typeof double) print?',
        options: ['"object" — machines are complicated', '"function" — functions have their own type tag', 'undefined — machines have no type'],
        correctIndex: 1,
        why: 'It prints "function" — proof, from a tool you already trust, that the machine in that slot is a genuine VALUE with its own type tag, a full citizen of the value world alongside "number" and "string". If it has a type tag, it can go anywhere a value goes.',
      },
    },
    {
      id: 'reveal-typeof',
      caption:
        'typeof says "function" — proof from a tool you already trust: the machine in that slot is a genuine VALUE, with its own type tag, a full citizen alongside "number" and "string".',
      highlightLines: [9],
    },
    {
      id: 'permission-slip',
      caption:
        'And that certification is a permission slip: anything you can do with a value, you can do with a function. Store it (done!), pass it into another machine (lesson 3.8), even have a machine BUILD and return a new machine (lesson 3.7 — that one bends minds).',
      highlightLines: [9],
    },
    {
      id: 'wrap',
      caption:
        'Three costumes, one idea: function declarations (lesson 3.1) stand alone with their own name; function expressions get stored under a variable’s label; arrows are the compact modern costume — most professional JavaScript today is written with arrows. The machine inside is the same in all three.',
    },
  ],
  Viz: FunctionValueSlots,
  underTheHood: (
    <>
      <p>
        There's a proper name for "functions are values": <strong>first-class functions</strong>.
        It means a function has all the same rights as a number or a string — it can live in a
        variable, be handed to another function, and be handed back from one.
      </p>
      <p>
        One honest disclosure: <code>typeof</code> says <code>"function"</code>, but deep down a
        function value is a special kind of object — a bundle of stuff that happens to be runnable.
        Objects are Phase 4; keep this footnote for then.
      </p>
      <p>
        The arrow rules, all of them: two or more parameters need parentheses —{' '}
        <code>(a, b) =&gt; a + b</code>. One parameter can skip them — <code>n =&gt; n * 2</code>.
      </p>
      <p>
        No braces means the result comes back automatically. Braces mean "normal body" — you must
        write <code>return</code> yourself, or you get <code>undefined</code>. That last one
        causes real bugs, which is why the quiz drills it.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what prints:',
      code: 'const add1 = (x) => x + 1;\nconsole.log(add1(2));',
      accept: ['3'],
      why: 'A brace-less arrow body is a single expression, and its result IS the return value — that’s the whole point of the short costume. add1(2) → 2 + 1 → 3 travels back through the chute.',
    },
    {
      kind: 'type-output',
      question: 'One pair of braces added — now type exactly what prints:',
      code: 'const add1 = (x) => { x + 1; };\nconsole.log(add1(2));',
      accept: ['undefined'],
      why: 'Braces switch OFF auto-return. This body computes 3 and throws it away — no return, so the call produces undefined (lesson 3.3’s rule, striking again). One pair of braces, completely different behavior: a top-five JavaScript gotcha in real code.',
    },
    {
      kind: 'type-output',
      question: 'A function is a value with its own type tag. Type what this prints:',
      code: 'const double = (n) => n * 2;\nconsole.log(typeof double);',
      accept: ['function', '"function"'],
      why: 'function — its very own typeof answer, proof of full value citizenship: everything a number or string can do (sit in a slot, ride into a parameter, come back through a chute), a function can do too. Lessons 3.7 and 3.8 spend this permission slip in spectacular ways.',
    },
  ],
  PlayExtra: () => <CodeExercise def={MAX_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what it means that "functions are values" — use the memory-slot picture — and show them how an arrow function is just a shorter way to write one.',
    modelAnswer:
      'Remember how a variable is a label tied to a slot holding a value, like a number or a string? A function can BE that value. const double = function (n) { return n * 2; } builds a machine and drops the whole machine into a memory slot with the label double tied to it — typeof double even says "function", its own type tag. An arrow function is the same value in a shorter costume: const triple = (n) => n * 3 means "n goes to n times 3", and because the body is a single expression, the result is returned automatically — no braces or return needed (add braces and you must write return yourself). Calling either one is just label + parentheses. The payoff of value-ness: anything a value can do, a function can do — be stored, be passed into another function, be returned. That idea powers callbacks, closures, and basically all modern JavaScript.',
  },
  recap: [
    'Functions are VALUES: a machine can live in a memory slot under a label, like any number or string. typeof says "function".',
    'Arrow shorthand: (n) => n * 3 — "n goes to n times 3". Single-expression bodies auto-return; add braces and you must return yourself.',
    'First-class = full citizenship: store it, pass it, return it. This permission slip powers lessons 3.7 and 3.8.',
  ],
}
