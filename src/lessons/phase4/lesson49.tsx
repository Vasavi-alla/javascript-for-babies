import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.9 — map / filter / reduce (flagship)
 * Viz: PipelineBelt — a conveyor line. map = a stamping station every element
 * passes through (same count out); filter = a trapdoor gate (some fall);
 * reduce = an accumulator jar whose running value grows lap by lap.
 */

const CODE = `const prices = [120, 45, 200, 80];

const withTax = prices.map(p => p * 1.1);

const cheap = prices.filter(p => p < 100);

const total = prices.reduce(
  (sum, p) => sum + p,
  0
);

console.log(withTax.length);
console.log(cheap);
console.log(total);`

type Mode = 'idle' | 'map' | 'filter' | 'reduce'
interface View {
  mode: Mode
  stationLabel: string
  /** input elements + their fate: out = transformed/passed value, or null = dropped */
  rows: { input: string; out: string | null }[]
  /** reduce: laps shown so far */
  laps?: { acc: string; el: string; next: string }[]
  console: string[]
  note?: string
}

const PRICES = ['120', '45', '200', '80']

const VIEWS: View[] = [
  {
    mode: 'idle',
    stationLabel: '',
    rows: PRICES.map((p) => ({ input: p, out: null })),
    console: [],
    note: 'three machines, one belt — you write the per-element function, they run the loop',
  },
  {
    mode: 'map',
    stationLabel: 'p => p * 1.1',
    rows: [
      { input: '120', out: '132' },
      { input: '45', out: '49.5' },
      { input: '200', out: '220' },
      { input: '80', out: '88' },
    ],
    console: [],
    note: 'map: every element passes the station once — 4 in, 4 out, NEW array',
  },
  {
    mode: 'map',
    stationLabel: 'p => p * 1.1',
    rows: [
      { input: '120', out: '132' },
      { input: '45', out: '49.5' },
      { input: '200', out: '220' },
      { input: '80', out: '88' },
    ],
    console: [],
    note: 'prices itself is untouched — the trio never mutates the original',
  },
  {
    mode: 'filter',
    stationLabel: 'p => p < 100',
    rows: [
      { input: '120', out: null },
      { input: '45', out: '45' },
      { input: '200', out: null },
      { input: '80', out: '80' },
    ],
    console: [],
    note: 'filter: your function is a yes/no gate — true passes, false drops through the trapdoor',
  },
  {
    mode: 'reduce',
    stationLabel: '(sum, p) => sum + p, start 0',
    rows: PRICES.map((p) => ({ input: p, out: null })),
    laps: [{ acc: '0', el: '120', next: '120' }],
    console: [],
    note: 'reduce: a running value (the accumulator) meets each element — 0 is its starting value',
  },
  {
    mode: 'reduce',
    stationLabel: '(sum, p) => sum + p, start 0',
    rows: PRICES.map((p) => ({ input: p, out: null })),
    laps: [
      { acc: '0', el: '120', next: '120' },
      { acc: '120', el: '45', next: '165' },
      { acc: '165', el: '200', next: '365' },
      { acc: '365', el: '80', next: '445' },
    ],
    console: [],
    note: 'each lap returns the NEXT accumulator; the last one is the answer',
  },
  {
    mode: 'reduce',
    stationLabel: '(sum, p) => sum + p, start 0',
    rows: PRICES.map((p) => ({ input: p, out: null })),
    laps: [
      { acc: '0', el: '120', next: '120' },
      { acc: '120', el: '45', next: '165' },
      { acc: '165', el: '200', next: '365' },
      { acc: '365', el: '80', next: '445' },
    ],
    console: ['4', '[45,80]', '445'],
    note: 'map: transform each · filter: keep some · reduce: boil down to one',
  },
]

function PipelineBelt({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 330" className="w-full">
      {/* input belt */}
      <text x={24} y={34} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        prices — the input belt
      </text>
      {view.rows.map((row, i) => (
        <g key={`in-${i}`}>
          <RoughRect x={30 + i * 92} y={44} width={78} height={36} seed={641 + i} strokeWidth={1.7} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={69 + i * 92} y={67} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
            {row.input}
          </text>
        </g>
      ))}

      {/* the station */}
      {view.mode !== 'idle' && (
        <g>
          <RoughRect
            x={110}
            y={104}
            width={220}
            height={44}
            seed={651}
            strokeWidth={2.2}
            fill={view.mode === 'filter' ? 'color-mix(in srgb, var(--color-marker-coral) 16%, transparent)' : 'var(--color-marker-yellow)'}
            fillStyle="solid"
          />
          <text x={220} y={122} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            {view.mode === 'map' ? 'stamping station (your function)' : view.mode === 'filter' ? 'gate (your yes/no function)' : 'accumulator station'}
          </text>
          <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
            {view.stationLabel}
          </text>
        </g>
      )}

      {/* output row for map/filter */}
      {(view.mode === 'map' || view.mode === 'filter') && (
        <g>
          <text x={24} y={182} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            {view.mode === 'map' ? 'the NEW array — same count, transformed' : 'the NEW array — only the passers'}
          </text>
          {view.rows.map((row, i) =>
            row.out !== null ? (
              <motion.g key={`out-${i}`} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <RoughRect x={30 + i * 92} y={192} width={78} height={36} seed={661 + i} strokeWidth={1.7} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 14%, transparent)" fillStyle="solid" />
                <text x={69 + i * 92} y={215} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
                  {row.out}
                </text>
              </motion.g>
            ) : view.mode === 'filter' ? (
              <motion.g key={`drop-${i}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 0.55, y: 8 }} transition={{ delay: i * 0.08 }}>
                <text x={69 + i * 92} y={214} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-marker-coral)">
                  {view.rows[i].input} ✗
                </text>
              </motion.g>
            ) : null,
          )}
        </g>
      )}

      {/* reduce laps table + jar */}
      {view.mode === 'reduce' && view.laps && (
        <g>
          <text x={40} y={182} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            lap by lap: (accumulator, element) → next accumulator
          </text>
          {view.laps.map((lap, i) => (
            <motion.text
              key={`${lap.acc}-${lap.el}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              x={54}
              y={204 + i * 19}
              fontFamily="var(--font-code)"
              fontSize={12}
              fill="var(--color-ink)"
            >
              ({lap.acc}, {lap.el}) → {lap.next}
            </motion.text>
          ))}
          {/* the jar */}
          <RoughRect x={310} y={196} width={92} height={70} seed={671} strokeWidth={2} />
          <RoughLine x1={310} y1={196} x2={402} y2={196} seed={672} strokeWidth={1.2} stroke="var(--color-ink-soft)" />
          <motion.text
            key={view.laps[view.laps.length - 1].next}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            x={356}
            y={238}
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fontSize={17}
            fontWeight={700}
            fill="var(--color-ink)"
          >
            {view.laps[view.laps.length - 1].next}
          </motion.text>
          <text x={356} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the jar — one value out
          </text>
        </g>
      )}

      {/* note */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={view.mode === 'idle' ? 140 : 296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14.5} fontWeight={700} fill="var(--color-marker-teal)">
            {view.note}
          </motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      {view.console.length > 0 && (
        <g>
          <RoughRect x={40} y={302} width={360} height={26} seed={673} strokeWidth={1.4} />
          <text x={58} y={320} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
            {view.console.join('   ·   ')}
          </text>
        </g>
      )}
    </svg>
  )
}

const WISHLIST_EXERCISE: CodeExerciseDef = {
  id: 'l47-wishlist',
  title: 'wishlist, discounted and budgeted',
  task: 'A sale hits your wishlist: every price drops, you keep what fits the budget, and you total the damage — all without writing a single loop yourself.',
  steps: [
    <>
      Start with <code>wishlist</code> = <code>[1200, 350, 99, 500]</code>.
    </>,
    <>
      Take 50 off <em>every</em> price → a new array named <code>discounted</code>.
    </>,
    <>
      From <code>discounted</code>, keep only prices ≤ <code>450</code> → print that array.
    </>,
    <>
      Print the SUM of all <code>discounted</code> prices — a single value, built with a starting
      value of 0.
    </>,
  ],
  starter: '',
  expectedOutput: ['[300,49,450]', '1949'],
  mustUse: [
    { test: /\.map\s*\(/, label: 'the discount is a map — transform every element' },
    { test: /\.filter\s*\(/, label: 'the budget cut is a filter — keep some' },
    { test: /\.reduce\s*\(/, label: 'the total is a reduce — boil down to one value' },
  ],
  mustNotUse: [
    { test: /for\s*\(/, label: 'no hand-written loops — the trio runs the loop for you' },
    { test: /1949/, label: 'no hand-typed total' },
  ],
  modelAnswer: `const wishlist = [1200, 350, 99, 500];

const discounted = wishlist.map(p => p - 50);

const affordable = discounted.filter(p => p <= 450);
console.log(affordable);

console.log(discounted.reduce((sum, p) => sum + p, 0));`,
}

export const lesson49: LessonDef = {
  id: '4.9',
  hook: (
    <>
      <p>
        Every list job you'll ever do is one of three shapes: <em>transform every element</em>{' '}
        (prices → prices with tax), <em>keep some elements</em> (only the failures), or{' '}
        <em>boil everything down to one value</em> (the total). You could write a{' '}
        <code>for</code> loop for each. Professionals mostly don't.
      </p>
      <p>
        Arrays ship the three shapes as methods —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          map, filter, reduce
        </HighlightMark>{' '}
        — and each takes a <em>function</em> as its argument (lesson 3.8's callbacks, now earning
        their keep daily). You describe what happens to <em>one element</em>; the method runs the
        loop.
      </p>
      <p>
        This trio is the single most-used pattern in modern JavaScript — and the exact shape of
        every test-report you'll ever crunch.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'setup',
      caption:
        'One input array, three machines. Each machine takes YOUR function — written right there as an arrow function — and applies it element by element. You never write the loop; you write what one element deserves.',
      highlightLines: [1],
    },
    {
      id: 'map',
      caption:
        'prices.map(p => p * 1.1): every element rides through the stamping station. p is one price; p * 1.1 is what comes out. Four in, four out, ALWAYS the same count — and it’s a NEW array. withTax holds the results.',
      highlightLines: [3],
    },
    {
      id: 'non-mutating',
      caption:
        'Check the input belt: prices is exactly as it was. The whole trio is non-mutating — unlike push/pop/shift (4.2), these build new arrays and leave the original alone. (That habit has a name — pure functions, lesson 3.10 — and it’s why this style is so easy to test.)',
      highlightLines: [3],
    },
    {
      id: 'filter',
      caption:
        'prices.filter(p => p < 100): now your function answers yes or no. true → the element passes into the new array; false → trapdoor. 120 and 200 drop; [45, 80] survive. Same count or fewer, original untouched, and the elements themselves pass through UNCHANGED — filter selects, never transforms.',
      highlightLines: [5],
    },
    {
      id: 'reduce-anatomy',
      caption:
        'reduce is the odd one: two arguments. Second, the STARTING VALUE — here 0. First, a function of TWO things: the running total so far (the accumulator, sum) and the current element (p). Each lap must RETURN the next accumulator. Watch lap one: (0, 120) → 120.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'reduce-laps',
      caption:
        'The full run: (0,120)→120, (120,45)→165, (165,200)→365, (365,80)→445. The accumulator is a relay baton — each lap receives it, adds its element, hands it on. The final baton IS the result: one value out of many. Sum, max, count, “group these” — anything that folds a list into one thing is a reduce.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'console',
      caption:
        'The receipts: withTax.length is 4 (map never changes the count), cheap is [45, 80], total is 445. Say the trio in plain words and you’ll never mix them up: map TRANSFORMS each, filter KEEPS some, reduce BOILS DOWN to one. In 4.14 you’ll chain them into your first QA dashboard.',
      highlightLines: [12, 13, 14],
    },
  ],
  Viz: PipelineBelt,
  underTheHood: (
    <>
      <p>
        All three call your function once per element and never touch the original array. That
        makes chains natural: <code>runs.filter(...).map(...)</code> — each link takes the previous
        link's <em>new</em> array. Read chains top-down as a pipeline: “keep the failures, then
        take their names.”
      </p>
      <p>
        <code>reduce((acc, el) =&gt; …, start)</code> is the general one — map and filter could
        both be written with it.
      </p>
      <p>
        The two classic stumbles: forgetting the starting value (JS then uses the first element,
        which breaks on empty arrays), and forgetting to <code>return</code> the next accumulator
        (then the next lap receives <code>undefined</code> — lesson 3.3's chute rule, striking
        again).
      </p>
      <p>
        <strong>Fun fact:</strong> your photo app runs this exact trio every day — “show 2024
        photos” is a <em>filter</em>, the thumbnail grid is a <em>map</em> (every photo → a small
        version), and “storage used: 48 GB” is a <em>reduce</em>. You've been a pipeline user for
        years; now you're the one writing the stations.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type the resulting array exactly (no spaces):',
      code: 'console.log([1, 2, 3].map(n => n * 2));',
      accept: ['[2,4,6]', '[2, 4, 6]'],
      placeholder: 'type the console output…',
      why: 'map transforms every element with your function: 1→2, 2→4, 3→6. Same count, new array, original untouched.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'console.log([5, 12, 8].filter(n => n > 9).length);',
      accept: ['1'],
      placeholder: 'type the console output…',
      why: 'filter keeps elements whose answer is true — only 12 passes the gate — and the new array has length 1. filter changes the COUNT, never the elements.',
    },
    {
      kind: 'type-output',
      question: 'Careful with the second argument — type what this prints:',
      code: 'console.log([1, 2, 3].reduce((a, n) => a + n, 10));',
      accept: ['16'],
      placeholder: 'type the console output…',
      why: 'The accumulator STARTS at 10: (10,1)→11, (11,2)→13, (13,3)→16. The starting value is part of the answer — always read it before predicting a reduce.',
    },
  ],
  PlayExtra: () => <CodeExercise def={WISHLIST_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain map, filter, and reduce to a friend using one everyday example for all three (a playlist, a shopping cart, photos — your pick). Include what each returns and what happens to the original array.',
    modelAnswer:
      'Take a shopping cart of prices. map TRANSFORMS every element: cart.map(p => p * 1.1) runs my little function on each price and gives a NEW array of taxed prices — same count, original cart untouched. filter KEEPS some: cart.filter(p => p < 100) asks my yes/no function about each element and the new array holds only the ones that answered true — fewer (or equal) elements, still untouched original. reduce BOILS DOWN to one value: cart.reduce((sum, p) => sum + p, 0) carries a running accumulator that starts at 0, meets every element, and each lap returns the next accumulator — the last one is the total. All three take a function describing ONE element’s fate and run the loop for me; none of them mutates the original array.',
  },
  recap: [
    'map TRANSFORMS every element → new array, same count. filter KEEPS passers → new array, ≤ count, elements unchanged. reduce BOILS DOWN → one value.',
    'All three take your per-element function (callbacks!), run the loop for you, and never mutate the original.',
    'reduce((acc, el) => nextAcc, start): read the starting value first; every lap must RETURN the next accumulator.',
  ],
}
