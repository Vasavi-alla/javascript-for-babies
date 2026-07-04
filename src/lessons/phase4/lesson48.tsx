import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.8 — Iterating collections
 * Viz: a hopping token visits array elements (for...of) and object keys
 * (for...in); Object.keys / values / entries produce little derived arrays.
 * The bridge beat: entries turns an object INTO an array, so array tools
 * (4.9 is next) work on objects too.
 */

const CODE = `const cart = ["pen", "mug", "fan"];

for (const item of cart) {
  console.log(item);
}

const prices = { pen: 2, mug: 9 };

for (const key in prices) {
  console.log(key);
}

console.log(Object.keys(prices));
console.log(Object.values(prices));
console.log(Object.entries(prices));`

interface View {
  mode: 'array' | 'object'
  /** which position the token is on (index into cells/keys), or null */
  tokenAt: number | null
  tokenLabel?: string
  derived?: { label: string; value: string } | null
  console: string[]
  note?: string
}

const VIEWS: View[] = [
  { mode: 'array', tokenAt: null, derived: null, console: [], note: 'for...of visits ELEMENTS, in order — no index bookkeeping' },
  { mode: 'array', tokenAt: 0, tokenLabel: 'item = "pen"', derived: null, console: ['pen'], note: 'each lap, item is a fresh binding holding the current element' },
  { mode: 'array', tokenAt: 2, tokenLabel: 'item = "fan"', derived: null, console: ['pen', 'mug', 'fan'], note: 'three elements, three laps, done — the loop ran itself' },
  { mode: 'object', tokenAt: 0, tokenLabel: 'key = "pen"', derived: null, console: ['pen'], note: 'for...in visits KEYS (as strings) — values need prices[key]' },
  { mode: 'object', tokenAt: null, derived: { label: 'Object.keys(prices)', value: '["pen","mug"]' }, console: ['pen', 'mug', '["pen","mug"]'], note: 'keys() hands you a real ARRAY of the keys' },
  { mode: 'object', tokenAt: null, derived: { label: 'Object.values(prices)', value: '[2,9]' }, console: ['["pen","mug"]', '[2,9]'], note: 'values() — just the values, as an array' },
  { mode: 'object', tokenAt: null, derived: { label: 'Object.entries(prices)', value: '[["pen",2],["mug",9]]' }, console: ['[2,9]', '[["pen",2],["mug",9]]'], note: 'entries() turns the whole object into an array of [key, value] pairs' },
]

function IterHop({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const arrayCells = ['"pen"', '"mug"', '"fan"']
  const objectComps = [
    { k: 'pen', v: '2' },
    { k: 'mug', v: '9' },
  ]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {view.mode === 'array' ? (
        <g>
          <text x={24} y={40} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            cart — an array: ordered elements
          </text>
          {arrayCells.map((v, i) => (
            <g key={v}>
              <RoughRect x={50 + i * 110 } y={64} width={96} height={48} seed={601 + i} strokeWidth={view.tokenAt === i ? 2.6 : 1.8} stroke={view.tokenAt === i ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={98 + i * 110} y={93} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
                {v}
              </text>
              <text x={98 + i * 110} y={128} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink-soft)">
                {i}
              </text>
            </g>
          ))}
        </g>
      ) : (
        <g>
          <text x={24} y={40} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            prices — an object: key → value
          </text>
          {objectComps.map((c, i) => (
            <g key={c.k}>
              <RoughRect x={60 + i * 160} y={64} width={140} height={48} seed={611 + i} strokeWidth={view.tokenAt === i ? 2.6 : 1.8} stroke={view.tokenAt === i ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-sticky)" fillStyle="solid" />
              <text x={130 + i * 160} y={93} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">
                <tspan fontWeight={700}>{c.k}</tspan>: {c.v}
              </text>
            </g>
          ))}
        </g>
      )}

      {/* the hopping token */}
      <AnimatePresence>
        {view.tokenAt !== null && (
          <motion.g
            key={`${view.mode}-${view.tokenAt}`}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0, x: view.mode === 'array' ? 98 + view.tokenAt * 110 : 130 + view.tokenAt * 160 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 14 }}
          >
            <circle cx={0} cy={48} r={9} fill="var(--color-marker-teal)" opacity={0.9} />
            <text x={0} y={34} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
              {view.tokenLabel}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* derived array card */}
      <AnimatePresence mode="wait">
        {view.derived && (
          <motion.g key={view.derived.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={60} y={150} width={320} height={54} seed={621} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="hachure" />
            <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
              {view.derived.label}
            </text>
            <text x={220} y={192} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
              {view.derived.value}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* note */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fontWeight={700} fill="var(--color-marker-teal)">
            {view.note}
          </motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      <RoughRect x={40} y={250} width={360} height={42} seed={622} strokeWidth={1.5} />
      <text x={52} y={246} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        console (latest)
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={276} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        <text x={58} y={276} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
          {view.console.slice(-2).join('   ·   ')}
        </text>
      )}
    </svg>
  )
}

const RECEIPT_EXERCISE: CodeExerciseDef = {
  id: 'l46-receipt',
  title: 'total the receipt, whatever it holds',
  task: 'A café receipt arrives as an object — item names as keys, prices as values. Total it by LOOPING, so the same code still works when tomorrow’s receipt has 40 items.',
  steps: [
    <>
      Create <code>receipt</code>: <code>coffee</code> = <code>120</code>, <code>cake</code> ={' '}
      <code>80</code>, <code>water</code> = <code>40</code>.
    </>,
    <>
      Compute the total by <strong>iterating over the object's values</strong> — any of today's
      tools works. No arithmetic with hand-typed prices.
    </>,
    <>Print the total.</>,
  ],
  starter: '',
  expectedOutput: ['240'],
  mustUse: [
    { test: /for\s*\(|Object\.(values|entries|keys)\s*\(/, label: 'the total comes from a loop or an Object.values/entries walk' },
  ],
  mustNotUse: [
    { test: /240/, label: 'no hand-typed 240' },
    { test: /120\s*\+\s*80|80\s*\+\s*40/, label: 'no adding the prices by hand — iterate!' },
  ],
  modelAnswer: `const receipt = { coffee: 120, cake: 80, water: 40 };

let total = 0;
for (const price of Object.values(receipt)) {
  total = total + price;
}

console.log(total);`,
}

export const lesson48: LessonDef = {
  id: '4.8',
  hook: (
    <>
      <p>
        You already know one way to walk an array: lesson 2.6's{' '}
        <code>for (let i = 0; i &lt; cart.length; i++)</code>. It works — and it makes you manage a
        counter, remember <code>&lt; length</code>, and type <code>cart[i]</code> everywhere, just
        to say “each element, please.”
      </p>
      <p>
        Collections deserve loops that speak collection:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          <code>for...of</code> hands you each array element; <code>for...in</code> hands you each
          object key
        </HighlightMark>
        ; and <code>Object.keys / values / entries</code> convert an object into arrays — the
        bridge that lets every array tool (including next lesson's big three) work on objects too.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'for-of',
      caption:
        'for (const item of cart) — read it as “for each element of cart.” No counter, no length check, no cart[i]: the loop feeds elements to item one at a time, in order. Use it whenever you want the elements and don’t care about their indexes. (Need the index too? The classic 2.6 for loop is still the tool.)',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'laps',
      caption:
        'Each lap, item is a FRESH const binding holding the current element — "pen", then "mug", then "fan" — and the body runs once per element. const is fine here because each lap gets a new item rather than reassigning the old one.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'for-in',
      caption:
        'Objects aren’t ordered shelves, so they get their own loop: for (const key in prices) visits the KEYS — "pen", then "mug" — always as strings. Want the values while looping? prices[key] — and notice this is EXACTLY what 4.4’s dynamic keys were built for: the loop hands you each key at RUNTIME, so brackets are the only accessor that can follow along. House rule worth adopting: for...of for arrays, for...in for objects. (for...in on an ARRAY hands you index strings "0", "1" — almost never what you meant.)',
      highlightLines: [9, 10, 11],
    },
    {
      id: 'keys',
      caption:
        'Sometimes you don’t want a loop — you want the keys AS AN ARRAY: Object.keys(prices) → ["pen","mug"]. Now array powers apply: .length to count properties, includes to check one exists…',
      highlightLines: [13],
    },
    {
      id: 'values',
      caption: 'Object.values(prices) → [2, 9] — just the values, ready for math. Summing an object’s prices is suddenly a one-array problem.',
      highlightLines: [14],
    },
    {
      id: 'entries',
      caption:
        'And the full bridge: Object.entries(prices) → [["pen",2], ["mug",9]] — the whole object as an array of [key, value] pairs. This matters for tomorrow: the transform trio (map/filter/reduce) only speaks array — entries() is how objects get a ticket onto that conveyor belt.',
      highlightLines: [15],
    },
  ],
  Viz: IterHop,
  underTheHood: (
    <>
      <p>
        <code>for...of</code> works on anything <em>iterable</em> — arrays, strings (character by
        character), and two structures arriving in 4.12 (Map and Set). Plain objects are{' '}
        <em>not</em> iterable — that's why they need <code>for...in</code> or the{' '}
        <code>Object.*</code> converters instead, and why <code>for (const x of {'{}'})</code>{' '}
        throws a TypeError.
      </p>
      <p>
        The three converters return <em>plain arrays</em>, built fresh at that moment — snapshots,
        not live views. And a subtle everyday win: <code>Object.keys(obj).length</code> is how you
        count an object's properties, since objects have no <code>.length</code> of their own.
      </p>
      <p>
        All of today's loops <em>read</em>; none of them copy. The loop variable receives what the
        collection holds — which, for elements that are objects, is an arrow (4.4 forever): mutate{' '}
        <code>item.done = true</code> inside a loop and you've changed the real thing.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'What prints on the FIRST lap? Type it exactly:',
      code: 'const xs = ["a", "b", "c"];\nfor (const v of xs) {\n  console.log(v);\n}',
      accept: ['a'],
      placeholder: 'type the console output…',
      why: 'for...of hands over ELEMENTS in order — first lap, first element: "a". No indexes involved.',
    },
    {
      kind: 'type-output',
      question: 'What prints on the FIRST lap? Type it exactly:',
      code: 'const obj = { x: 1, y: 2 };\nfor (const k in obj) {\n  console.log(k);\n}',
      accept: ['x'],
      placeholder: 'type the console output…',
      why: 'for...in visits KEYS, not values — the first key is "x". To reach 1 you’d write obj[k].',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const cfg = { a: 1, b: 2, c: 3 };\nconsole.log(Object.keys(cfg).length);',
      accept: ['3'],
      placeholder: 'type the console output…',
      why: 'Object.keys returns a real array of the keys — ["a","b","c"] — and .length counts it. This is THE way to count an object’s properties.',
    },
  ],
  PlayExtra: () => <CodeExercise def={RECEIPT_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend wrote for (const x in ["a","b"]) and got confused by what x was. Explain the difference between for...of and for...in, which belongs to which collection — and how to loop over an object’s VALUES.',
    modelAnswer:
      'for...of hands you the ELEMENTS of an iterable, in order — it’s the array loop: for (const v of list) gives "a" then "b". for...in hands you the KEYS — it’s the object loop, and keys are strings. Their friend used for...in on an array, so x was the index strings "0" and "1", not the elements. House rule: of for arrays, in for objects. To loop an object’s values, either take the keys loop and read obj[key], or convert first: for (const v of Object.values(obj)). And Object.entries(obj) turns the object into [key, value] pairs — an array — which is how objects get access to every array tool.',
  },
  recap: [
    'for...of → array ELEMENTS in order (no counters); for...in → object KEYS (as strings).',
    'Object.keys / values / entries snapshot an object into arrays — entries gives [key, value] pairs, the bridge to array tools.',
    'Objects have no .length: count properties with Object.keys(obj).length.',
  ],
}
