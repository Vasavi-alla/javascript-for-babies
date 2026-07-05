import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 1.9 — Type coercion & comparison
 * Viz: CoercionMachine — two typed tokens enter, one gets silently converted,
 * a result comes out. Then == vs === head to head.
 */

const CODE = `console.log("5" + 5);
console.log("5" - 5);
console.log(5 == "5");
console.log(5 === "5");`

function Token({ cx, cy, label, kind, seed }: { cx: number; cy: number; label: string; kind: 'number' | 'string' | 'boolean'; seed: number }) {
  const color = kind === 'number' ? 'var(--color-marker-yellow)' : kind === 'string' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'
  return (
    <g>
      <RoughEllipse cx={cx} cy={cy} width={74} height={40} seed={seed} fill={color} />
      <text x={cx} y={cy + 6} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={600} fill="var(--color-ink)">
        {label}
      </text>
    </g>
  )
}

// per step: [left token, right token, operator, converted note, result, resultKind]
interface Scene {
  left: { label: string; kind: 'number' | 'string' }
  right: { label: string; kind: 'number' | 'string' }
  op: string
  note: string
  result?: { label: string; kind: 'number' | 'string' | 'boolean' }
}

const SCENES: Array<Scene | null> = [
  {
    left: { label: '"5"', kind: 'string' }, right: { label: '5', kind: 'number' },
    op: '+', note: '', result: undefined,
  },
  {
    left: { label: '"5"', kind: 'string' }, right: { label: '"5"', kind: 'string' },
    op: '+', note: '+ saw a string → converted 5 into "5", then glued', result: { label: '"55"', kind: 'string' },
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '5', kind: 'number' },
    op: '−', note: '− has no meaning for text → converted "5" into 5, then did math', result: { label: '0', kind: 'number' },
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '5', kind: 'number' },
    op: '−', note: 'same operands as line 1 — OPPOSITE conversion. The operator picks the direction', result: { label: '0', kind: 'number' },
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '"5"', kind: 'string' },
    op: '==', note: '', result: undefined,
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '5', kind: 'number' },
    op: '==', note: '== converted first, THEN compared — the friendly liar', result: { label: 'true', kind: 'boolean' },
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '"5"', kind: 'string' },
    op: '===', note: '=== compares value AND type — no conversion allowed', result: { label: 'false', kind: 'boolean' },
  },
  {
    left: { label: '5', kind: 'number' }, right: { label: '"5"', kind: 'string' },
    op: '===', note: 'strict === : what you see is what gets compared', result: { label: 'false', kind: 'boolean' },
  },
]

function CoercionMachine({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]!
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        the coercion machine
      </text>

      {/* the machine body */}
      <RoughRect x={140} y={95} width={160} height={90} seed={240} fill="var(--color-paper-shade)" fillStyle="solid" />
      <text x={220} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={34} fontWeight={700} fill="var(--color-ink)">
        {scene.op}
      </text>

      {/* input tokens */}
      <AnimatePresence mode="popLayout">
        <motion.g key={`L-${stepIndex}-${scene.left.label}`} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 15 }}>
          <Token cx={85} cy={70} label={scene.left.label} kind={scene.left.kind} seed={241} />
        </motion.g>
        <motion.g key={`R-${stepIndex}-${scene.right.label}`} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 15, delay: 0.1 }}>
          <Token cx={355} cy={70} label={scene.right.label} kind={scene.right.kind} seed={242} />
        </motion.g>
      </AnimatePresence>
      <HandArrow from={{ x: 105, y: 92 }} to={{ x: 165, y: 112 }} seed={243} curve={0.15} stroke="var(--color-ink-soft)" strokeWidth={2} />
      <HandArrow from={{ x: 335, y: 92 }} to={{ x: 275, y: 112 }} seed={244} curve={-0.15} stroke="var(--color-ink-soft)" strokeWidth={2} />

      {/* result */}
      <AnimatePresence mode="popLayout">
        {scene.result && (
          <motion.g key={`res-${stepIndex}`} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 14, delay: 0.2 }}>
            <HandArrow from={{ x: 220, y: 190 }} to={{ x: 220, y: 218 }} seed={245} stroke="var(--color-ink)" />
            <Token cx={220} cy={242} label={scene.result.label} kind={scene.result.kind} seed={246 + stepIndex} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* conversion note */}
      {scene.note && (
        <text x={40} y={282} fontFamily="var(--font-hand)" fontSize={15.5} fill="var(--color-marker-coral)"><WrapTspans text={scene.note} x={40} maxPx={388} fontSize={15.5} /></text>
      )}
    </svg>
  )
}

export const lesson19: LessonDef = {
  id: '1.9',
  hook: (
    <>
      <p>
        Every lesson so far kept the types apart. Time for the collision: what happens when a
        string and a number meet at the same operator? The machine never stops to ask — it{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
          silently converts one of them
        </HighlightMark>{' '}
        and carries on. That silent conversion is called <strong>coercion</strong>, and it’s behind
        some of the most famous “JavaScript is weird” screenshots on the internet — and behind very
        real bugs you’ll be paid to catch. Today the weirdness becomes predictable.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'collision',
      caption:
        'Line 1: "5" + 5. A string (teal) and a number (yellow) drop into the + machine. Two different types, one operator. The machine must make them match before it can work — and it will NOT ask your permission.',
      highlightLines: [1],
    },
    {
      id: 'plus-glues',
      caption:
        'The + operator has a house rule: if EITHER side is a string, everything becomes a string. So the number 5 was quietly converted to "5", the trains were glued (lesson 1.6!), and out comes "55". Not 10. No warning.',
      highlightLines: [1],
    },
    {
      id: 'minus-math',
      caption:
        'Line 2 flips it: "5" - 5. Minus has NO meaning for text — you can’t subtract trains — so this time the STRING gets converted to a number, and real math happens: 0.',
      highlightLines: [2],
    },
    {
      id: 'operator-decides',
      caption:
        'Look closely: the same operands as line 1 (an operand is just one of the values an operator works on — here, "5" and 5), but the OPPOSITE conversion. The operator picks the direction: + prefers strings, − prefers numbers.',
      highlightLines: [1, 2],
    },
    {
      id: 'predict-loose',
      caption: 'Now the comparisons. Line 3 asks: is 5 == "5"? A number versus a string — can they be equal?',
      highlightLines: [3],
      prediction: {
        question: 'What does 5 == "5" evaluate to?',
        options: [
          'false — a number and a string can never be equal',
          'true — the double = converts them to match before comparing',
          'An error — you can’t compare different types',
        ],
        correctIndex: 1,
        why: 'The double-equals == is the “friendly liar”: it coerces the values to a common type FIRST, then compares — so "5" becomes 5, and 5 == 5 is true. Helpful-looking… but it also makes "" == 0 true, null == undefined true, and other surprises nobody asked for.',
      },
    },
    {
      id: 'loose',
      caption:
        'true — because == converted before comparing. It was designed in 1995 to be forgiving for the early messy web. Forgiving sounds nice until different things start counting as “equal” and a bug slips through a check that LOOKED airtight.',
      highlightLines: [3],
    },
    {
      id: 'strict',
      caption:
        'Line 4: the professional’s comparison. Triple-equals === refuses to convert: it checks value AND type, as-is. A number and a string? Different types → false, conversation over. No surprises, ever.',
      highlightLines: [4],
    },
    {
      id: 'rule',
      caption:
        'The rule to tattoo somewhere: ALWAYS write ===. Know that == exists so you can read older code — but never reach for it. And next time someone shows you "5" + 5 = "55" as proof JavaScript is broken, you can smile and explain exactly which conversion fired and why.',
      highlightLines: [4],
    },
  ],
  Viz: CoercionMachine,
  underTheHood: (
    <>
      <p>
        The conversion cheat sheet: <code>+</code> prefers strings — one string infects the whole
        operation, gluing wins.
      </p>
      <p>
        <code>−</code>, <code>*</code>, <code>/</code> and <code>%</code> prefer numbers instead —
        strings get converted. If the conversion fails (<code>"abc" * 2</code>), you get{' '}
        <code>NaN</code>: the “math lost all meaning” value from lesson 1.5.
      </p>
      <p>
        Comparison with <code>==</code> follows a genuinely strange rulebook. Programmers keep
        actual lookup tables for it. That is the argument for never using it: a comparison you
        need a table to predict is a comparison you cannot trust at a glance.
      </p>
      <p>
        <strong>💼 On the job —</strong> this one will bite you as an automation tester:
        everything typed into a form arrives as a <em>string</em> (lesson 1.1 called it). So{' '}
        <code>age + 1</code>, where age came from an input field, is <code>"25" + 1</code> →{' '}
        <code>"251"</code> — a birthday bug, silently.
      </p>
      <p>
        The fix is explicit conversion — coercion you control: <code>Number("25")</code> → 25,{' '}
        <code>String(25)</code> → "25". Explicit conversion is honest and easy to search for.
        Implicit coercion is a surprise waiting to happen. Prefer the honest kind.
      </p>
      <p>
        Also in the family: <code>!=</code> is loose not-equals (same liar, negated) and{' '}
        <code>!==</code> is the strict one you’ll actually use.
      </p>
      <p>
        Real projects enforce this automatically — a <strong>linter</strong> (ESLint, Phase 8)
        flags every <code>==</code> the instant it is typed.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what console.log("10" + 1) shows:',
      accept: ['101', '"101"'],
      why: '+ prefers strings: one string on either side turns + into the gluing operator. "10" + 1 → "10" + "1" → "101". The single most common form-input bug in existence.',
    },
    {
      kind: 'type-output',
      question: 'And console.log("10" - 1)? Type it:',
      accept: ['9'],
      why: 'Minus has no string meaning, so coercion runs the OTHER way: "10" becomes 10, and 10 − 1 = 9 (a number). The +/− asymmetry is the heart of this lesson — same operands, opposite conversions.',
    },
    {
      kind: 'type-output',
      question: 'status holds the NUMBER 200. Type what status == "200" (loose, double =) evaluates to — then read why that answer is dangerous in a test.',
      accept: ['true'],
      placeholder: 'a value…',
      why: 'true! == coerces the string into a number before comparing — so a test written with == would happily PASS even if the API wrongly returned the string "200", hiding a real bug. That’s a bug detector with its batteries removed. === would answer false and catch it. Always === in tests.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: what is coercion, why does "5" + 5 give "55" but "5" - 5 give 0, and why should they always write === instead of ==?',
    modelAnswer:
      'Coercion is JavaScript silently converting a value’s type so an operation can proceed — without asking. Which way it converts depends on the operator: + has a rule that if either side is a string, everything becomes a string, so "5" + 5 glues into "55". But minus has no meaning for text, so "5" - 5 converts the string into a number instead and does real math: 0. Comparisons have the same split: == coerces before comparing (so 5 == "5" is true — it’s a friendly liar with genuinely weird rules), while === compares value AND type with no conversion (5 === "5" is false). Always use ===: what you see is what gets compared, no surprises — which is exactly what you want in code, and doubly what you want in a test.',
  },
  recap: [
    'Coercion = the machine silently converting types to make an operation work. The operator picks the direction: + glues (string wins), − * / % do math (number wins).',
    '"5" + 5 → "55", but "5" - 5 → 0. Form inputs are strings — convert them yourself with Number(…) before math.',
    '== converts before comparing (the friendly liar). === compares value AND type. Always write === / !== — especially in tests.',
  ],
}
