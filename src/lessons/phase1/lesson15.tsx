import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughLine } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.5 — Numbers
 * Viz: NumberLine — operations as hops, then the honest 0.1 + 0.2 zoom-in.
 */

const CODE = `console.log(4 + 3);
console.log(7 / 2);
console.log(10 % 3);
console.log(0.1 + 0.2);`

/** x position for a value 0..10 on the drawn line */
const px = (n: number) => 30 + n * 36

// per step: where the marker sits, and which hop-arc is drawn
const MARKER: Array<number | null> = [null, 7, 3.5, 1, 1, 1, null, null, null, null]

function NumberLineViz({ stepIndex }: { stepIndex: number }) {
  const marker = MARKER[stepIndex] ?? null
  const showZoom = stepIndex >= 6
  return (
    <svg viewBox="0 0 420 280" className="w-full">
      <text x={30} y={30} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        the number line — where all math lives
      </text>

      {/* the line and ticks */}
      <RoughLine x1={px(0)} y1={90} x2={px(10)} y2={90} seed={170} strokeWidth={2} />
      {Array.from({ length: 11 }, (_, n) => (
        <g key={n}>
          <RoughLine x1={px(n)} y1={84} x2={px(n)} y2={96} seed={171 + n} strokeWidth={1.5} />
          <text x={px(n)} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            {n}
          </text>
        </g>
      ))}

      {/* hop arcs */}
      <AnimatePresence>
        {stepIndex === 1 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HandArrow from={{ x: px(4), y: 78 }} to={{ x: px(7), y: 78 }} curve={0.45} seed={182} stroke="var(--color-marker-teal)" />
            <text x={px(5.5)} y={40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-teal)">
              4 + 3
            </text>
          </motion.g>
        )}
        {stepIndex === 2 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HandArrow from={{ x: px(7), y: 78 }} to={{ x: px(3.5), y: 78 }} curve={0.4} seed={183} stroke="var(--color-marker-coral)" />
            <text x={px(5.2)} y={40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-coral)">
              7 / 2 → 3.5
            </text>
          </motion.g>
        )}
        {(stepIndex === 3 || stepIndex === 4) && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={px(5)} y={40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-pencil-blue)">
              10 % 3 → “3 fits three times… 1 left over”
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the marker */}
      <AnimatePresence>
        {marker !== null && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: px(marker) }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <circle cx={0} cy={90} r={9} fill="var(--color-marker-yellow)" stroke="var(--color-ink)" strokeWidth={2} />
            <text x={0} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={20} fontWeight={700} fill="var(--color-ink)">
              {marker}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the 0.1 + 0.2 microscope */}
      <AnimatePresence>
        {showZoom && (
          <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={30} y={165} fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
              0.1 + 0.2 under the microscope 🔎
            </text>
            <text x={30} y={200} fontFamily="var(--font-code)" fontSize={16} fill="var(--color-ink)">
              0.3
              <tspan fill="var(--color-marker-coral)" fontWeight={700}>
                0000000000000004
              </tspan>
            </text>
            <text x={30} y={232} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
              off by 0.00000000000000004 — a dust speck,
            </text>
            <text x={30} y={254} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
              but NOT exactly 0.3. And that’s normal!
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const AGE_EXERCISE: CodeExerciseDef = {
  id: 'd1b-age',
  title: 'the machine does your math',
  task: 'Compute an age from a birth year. Programmers don’t do arithmetic in their heads — they write the formula, so the answer stays right when the inputs change.',
  steps: [
    <>
      <code>birthYear</code> holds the number <code>2000</code> and never changes.
    </>,
    <>
      A variable named <code>age</code> gets the age in the year 2026 — <em>calculated by the
      machine</em> from those two numbers. The number 26 may not appear in your code.
    </>,
    <>Print <code>age</code>.</>,
  ],
  starter: '',
  expectedOutput: ['26'],
  mustUse: [
    { test: /const\s+birthYear\s*=\s*2000/, label: 'birthYear is stored as a never-changing 2000' },
    { test: /2026\s*-\s*birthYear/, label: 'age is CALCULATED from 2026 and birthYear' },
  ],
  mustNotUse: [{ test: /=\s*26\b/, label: 'no pre-computed 26 — the subtraction is the machine’s job' }],
  modelAnswer: `const birthYear = 2000;
const age = 2026 - birthYear;

console.log(age);`,
}

export const lesson15: LessonDef = {
  id: '1.5',
  hook: (
    <>
      <p>
        Numbers are the workhorse type: scores, prices, timeouts, how many tests passed. The good
        news — JavaScript keeps it simple:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          one number type for everything
        </HighlightMark>
        , whole or decimal, positive or negative.
      </p>
      <p>
        The spicy news: at the end of this lesson we’ll ask the machine for 0.1 + 0.2 and it will
        answer <em>slightly wrong</em> — famously, honestly, and for a reason you’ll be able to
        explain at parties (well… programmer parties).
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'line',
      caption:
        'Picture every number living on a line. Math operations are just movement on it: + hops right, − hops left, * and / stretch and squeeze. The operators you know — plus two new friends coming up.',
      highlightLines: [1],
    },
    {
      id: 'add',
      caption: 'Line 1: 4 + 3. Start at 4, hop 3 to the right, land on 7. The machine prints the landing spot.',
      highlightLines: [1],
    },
    {
      id: 'divide',
      caption:
        'Line 2: 7 / 2 lands BETWEEN the ticks: 3.5. Notice there’s no drama — no separate “decimal type”, no conversion. Whole and fractional are the same number pen from lesson 1.1.',
      highlightLines: [2],
    },
    {
      id: 'remainder-intro',
      caption:
        'Line 3 is the operator nobody learned in school: % — the remainder. 10 % 3 asks “how much is LEFT OVER after 3 fits into 10 as many whole times as possible?” 3 fits three times (=9), leaving 1.',
      highlightLines: [3],
    },
    {
      id: 'remainder-trick',
      caption: 'Weirdly useful, worth remembering forever: n % 2 tells you odd or even, instantly.',
      highlightLines: [3],
    },
    {
      id: 'predict-float',
      caption: 'And now the famous one. Line 4: 0.1 + 0.2. Surely… 0.3? Commit to a prediction.',
      highlightLines: [4],
      prediction: {
        question: 'What does console.log(0.1 + 0.2) print?',
        options: [
          '0.3 — obviously',
          '0.30000000000000004 — very slightly off',
          'An error',
        ],
        correctIndex: 1,
        why: 'Not a bug in your machine — every JavaScript engine on earth prints this. The machine stores numbers in binary, and 0.1 simply cannot be written exactly in binary (the same way 1/3 can’t be written exactly in decimal — 0.3333… forever). A microscopic rounding error sneaks in, and addition exposes it.',
      },
    },
    {
      id: 'zoom',
      caption:
        'There it is under the microscope. Here’s the honest explanation: computers store numbers in binary (base 2). In binary, 0.1 is an infinitely repeating fraction — like 1/3 is in our decimal system. The machine has to cut it off somewhere, and that microscopic trim is what you’re seeing.',
      highlightLines: [4],
    },
    {
      id: 'live-cents',
      caption:
        'So how does the world’s software cope? First habit: money code counts in whole cents or paise, never rupees or dollars as decimals — integers are always exact.',
      highlightLines: [4],
    },
    {
      id: 'live-round',
      caption: 'Second habit: displays round for humans — you never actually see 0.30000000000000004 on a receipt.',
      highlightLines: [4],
    },
    {
      id: 'live-tolerance',
      caption:
        'Third habit, the one that matters most to YOU: comparisons allow a tolerance instead of demanding exactness. Test assertions on decimals use “close to”, not “equals” — now you know exactly why.',
      highlightLines: [4],
    },
  ],
  Viz: NumberLineViz,
  underTheHood: (
    <>
      <p>
        The storage format has a name worth knowing: <strong>floating point</strong> (the standard
        is called IEEE 754 — every mainstream language uses it, which is why Python and Java give
        the same 0.30000000000000004).
      </p>
      <p>
        Each number gets 64 bits — 64 tiny on/off switches — which is plenty for whole numbers up
        to about 9 quadrillion (<code>Number.MAX_SAFE_INTEGER</code>) but means <em>some</em>{' '}
        decimals are stored as their nearest representable neighbor. Whole numbers are always
        exact; it’s only certain fractions that get trimmed.
      </p>
      <p>
        One special citizen of the number type, born from impossible math: <code>1 / 0</code>{' '}
        gives <strong>Infinity</strong> — no crash, just a special value meaning “beyond all
        numbers.”
      </p>
      <p>
        Another: <code>0 / 0</code> gives <strong>NaN</strong> — “Not a Number”, which is ironically
        itself a value of type number, meaning “this calculation lost all meaning.” When you see
        NaN in a test report, some math upstream went wrong — it spreads through calculations like
        ink in water, so hunt for where it was born.
      </p>
      <p>
        Practical toolkit: <code>Math.round(x)</code>, <code>Math.floor(x)</code> (always down),{' '}
        <code>Math.ceil(x)</code> (always up), and <code>x.toFixed(2)</code> for showing “3.50” to
        humans.
      </p>
      <p>
        For comparing decimals in tests, remember the pattern “difference smaller than a speck”:{' '}
        <code>Math.abs(a - b) &lt; 0.000001</code> — test frameworks wrap exactly this idea in an
        assertion called <code>toBeCloseTo</code>, which you’ll use in Phase 9.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what 9 % 4 gives:',
      accept: ['1'],
      placeholder: 'a value…',
      why: '% is the remainder, not division: 4 fits into 9 twice (=8), leaving 1 over. (9 / 4 would be 2.25 — different operator, different question.)',
    },
    {
      question: 'WHY does 0.1 + 0.2 come out as 0.30000000000000004?',
      options: [
        'A famous bug in JavaScript that was never fixed',
        'Binary can’t store 0.1 exactly — like 1/3 in decimal, it repeats forever and must be trimmed',
        'The + operator is unreliable with decimals',
      ],
      correctIndex: 1,
      why: 'It’s physics-of-storage, not a bug: base-2 has no exact finite form for 0.1, so the machine stores the nearest neighbor and tiny errors surface in math. Every IEEE-754 language behaves identically — saying this sentence in an interview earns instant respect.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what 1 / 0 gives in JavaScript — capitalization counts:',
      accept: ['Infinity'],
      placeholder: 'a special value…',
      why: 'JavaScript never crashes on this — it answers with the special value Infinity (capital I) and keeps running. (0 / 0, where even infinity makes no sense, gives NaN instead.) Programs surviving weird math is very JavaScript — you’ll learn to test for these values.',
    },
  ],
  PlayExtra: () => <CodeExercise def={AGE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend why the computer says 0.1 + 0.2 is 0.30000000000000004 — using the 1/3 analogy — and what programmers do about it.',
    modelAnswer:
      'Computers store numbers in binary — base 2. Some fractions just can’t be written exactly in a given base: in our decimal system, 1/3 is 0.3333… repeating forever, so anywhere you stop writing, it’s slightly off. In binary, 0.1 is exactly like that — an infinite repeating fraction that must be trimmed to fit in memory. So the machine stores a number a hair away from 0.1, and adding exposes the error: 0.30000000000000004. It’s not a bug — every language does it. Programmers cope by counting money in whole cents, rounding for display, and comparing decimals with a tolerance (“close enough”) instead of exact equality — which is exactly how test assertions handle decimals too.',
  },
  recap: [
    'One number type for everything — whole, decimal, negative. 7 / 2 = 3.5, no ceremony.',
    '% gives the remainder: 10 % 3 = 1. Party trick: n % 2 === 0 means even.',
    '0.1 + 0.2 = 0.30000000000000004 because binary can’t store 0.1 exactly (like 1/3 in decimal). Compare decimals with tolerance, count money in integers.',
  ],
}
