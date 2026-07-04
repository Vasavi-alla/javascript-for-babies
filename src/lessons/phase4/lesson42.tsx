import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.2 — Inside an array: memory & the O(1) trick
 * Viz: a strip of the memory wall (0.4 returns!) with REAL addresses. The
 * array is a contiguous run of slots; reading scores[i] is address arithmetic:
 * start + i × slotSize → one jump. A tiny hand-drawn cost graph introduces
 * O(1) vs O(n) honestly.
 */

const CODE = `const scores = [82, 95, 71];

// the engine's arithmetic for scores[2]:
//   address = start + index × slotSize
//           = 5000  +   2   ×    8
//           = 5016  → jump straight there

console.log(scores[2]);
console.log(scores.length);
console.log(scores[9]);`

interface View {
  /** which slot the jump lands on (0-2), or null */
  jumpTo: number | null
  formula: string | null
  showGraph: boolean
  showLength: boolean
  ghostAddress: boolean
  console: string[]
  note?: { text: string; color: 'teal' | 'coral' }
}

const VIEWS: View[] = [
  {
    jumpTo: null, formula: null, showGraph: false, showLength: false, ghostAddress: false, console: [],
    note: { text: 'an array = a CONTIGUOUS run of memory slots — side by side, no gaps', color: 'teal' },
  },
  {
    jumpTo: null, formula: null, showGraph: false, showLength: false, ghostAddress: false, console: [],
    note: { text: 'same-size slots, no gaps → every address is PREDICTABLE', color: 'teal' },
  },
  {
    jumpTo: 2, formula: '5000 + 2 × 8 = 5016', showGraph: false, showLength: false, ghostAddress: false, console: [],
    note: { text: 'no searching: one multiply, one add, one jump', color: 'teal' },
  },
  {
    jumpTo: 2, formula: '5000 + 2 × 8 = 5016', showGraph: false, showLength: false, ghostAddress: false, console: [],
    note: { text: 'an index is a DISTANCE — a number the engine can do math on', color: 'teal' },
  },
  {
    jumpTo: 0, formula: '5000 + 0 × 8 = 5000', showGraph: false, showLength: false, ghostAddress: false, console: [],
    note: { text: 'element 0 sits ZERO steps from the start — that’s why indexes begin at 0', color: 'teal' },
  },
  {
    jumpTo: 2, formula: '5000 + 2 × 8 = 5016', showGraph: false, showLength: false, ghostAddress: false, console: ['71'],
    note: { text: 'index 2 or index 2,000,000 — the same three operations', color: 'teal' },
  },
  {
    jumpTo: 2, formula: null, showGraph: true, showLength: false, ghostAddress: false, console: ['71'],
    note: { text: 'O(1) = flat cost at any size. O(n) = cost grows with the element count', color: 'teal' },
  },
  {
    jumpTo: null, formula: null, showGraph: false, showLength: true, ghostAddress: false, console: ['71', '3'],
    note: { text: '.length is bookkeeping the array keeps up to date — no counting happens', color: 'teal' },
  },
  {
    jumpTo: null, formula: '5000 + 9 × 8 = 5072 …not ours!', showGraph: false, showLength: false, ghostAddress: true, console: ['71', '3', 'undefined'],
    note: { text: 'the math happily computes 5072 — but the array never claimed that slot: undefined', color: 'coral' },
  },
  {
    jumpTo: null, formula: null, showGraph: false, showLength: false, ghostAddress: true, console: ['71', '3', 'undefined'],
    note: { text: 'big[50] = 1 forces growth out to index 50 — the gap breaks the tidy picture', color: 'coral' },
  },
  {
    jumpTo: null, formula: null, showGraph: false, showLength: false, ghostAddress: false, console: ['71', '3', 'undefined'],
    note: { text: 'the catch: the run MUST stay contiguous… so what happens when element 0 leaves?', color: 'coral' },
  },
]

const ADDRESSES = ['5000', '5008', '5016']
const VALUES = ['82', '95', '71']

function MemoryStrip({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        the memory wall (lesson 0.4) — every slot has an ADDRESS
      </text>

      {/* neighboring foreign slots to show contiguity */}
      <RoughRect x={16} y={46} width={44} height={50} seed={700} strokeWidth={1.2} stroke="var(--color-ink-soft)" roughness={2.2} />
      <text x={38} y={76} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
        …
      </text>

      {VALUES.map((v, i) => (
        <g key={i}>
          <RoughRect
            x={66 + i * 96}
            y={46}
            width={88}
            height={50}
            seed={701 + i}
            strokeWidth={view.jumpTo === i ? 2.8 : 1.8}
            stroke={view.jumpTo === i ? 'var(--color-marker-teal)' : 'var(--color-ink)'}
            fill={view.jumpTo === i ? 'color-mix(in srgb, var(--color-marker-teal) 14%, transparent)' : 'var(--color-paper-raised, #fff)'}
            fillStyle="solid"
          />
          <text x={110 + i * 96} y={76} textAnchor="middle" fontFamily="var(--font-code)" fontSize={15} fontWeight={700} fill="var(--color-ink)">
            {v}
          </text>
          <text x={110 + i * 96} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
            addr {ADDRESSES[i]}
          </text>
          <text x={110 + i * 96} y={128} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={600} fill="var(--color-ink)">
            index {i}
          </text>
        </g>
      ))}

      {/* ghost slot at index 9 territory */}
      {view.ghostAddress ? (
        <g>
          <RoughRect x={354} y={46} width={72} height={50} seed={706} strokeWidth={1.5} stroke="var(--color-marker-coral)" roughness={2.6} />
          <text x={390} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-marker-coral)">
            5072 —
          </text>
          <text x={390} y={85} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-marker-coral)">
            not ours
          </text>
        </g>
      ) : (
        <g>
          <RoughRect x={354} y={46} width={44} height={50} seed={707} strokeWidth={1.2} stroke="var(--color-ink-soft)" roughness={2.2} />
          <text x={376} y={76} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
            …
          </text>
        </g>
      )}

      {/* the arithmetic card */}
      <AnimatePresence mode="wait">
        {view.formula && (
          <motion.g key={view.formula} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={90} y={150} width={260} height={54} seed={708} strokeWidth={2} fill="var(--color-marker-yellow)" fillStyle="solid" />
            <text x={220} y={170} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
              address = start + index × slotSize
            </text>
            <text x={220} y={192} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
              {view.formula}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* length badge */}
      <AnimatePresence>
        {view.showLength && (
          <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={150} y={156} width={140} height={40} seed={709} strokeWidth={1.8} fill="var(--color-marker-teal)" fillStyle="hachure" />
            <text x={220} y={181} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
              .length = 3
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the tiny cost graph: O(1) flat, O(n) rising */}
      <AnimatePresence>
        {view.showGraph && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <RoughLine x1={70} y1={262} x2={70} y2={216} seed={710} strokeWidth={1.6} stroke="var(--color-ink-soft)" />
            <RoughLine x1={70} y1={262} x2={200} y2={262} seed={711} strokeWidth={1.6} stroke="var(--color-ink-soft)" />
            <text x={135} y={278} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">
              array size →
            </text>
            <text x={58} y={240} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)" transform="rotate(-90 58 240)">
              cost
            </text>
            {/* O(n) rising */}
            <RoughLine x1={74} y1={258} x2={196} y2={220} seed={712} strokeWidth={2} stroke="var(--color-marker-coral)" />
            <text x={204} y={222} fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-coral)">
              O(n) — grows
            </text>
            {/* O(1) flat */}
            <RoughLine x1={74} y1={246} x2={196} y2={245} seed={713} strokeWidth={2.2} stroke="var(--color-marker-teal)" />
            <text x={204} y={248} fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)">
              O(1) — flat
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* verdict */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text key={view.note.text} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={view.showGraph ? 300 : 232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14.5} fontWeight={700} fill={view.note.color === 'coral' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}><WrapTspans text={view.note.text} x={220} maxPx={426} fontSize={14.5} /></motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      {!view.showGraph && (
        <g>
          <RoughRect x={40} y={248} width={360} height={40} seed={714} strokeWidth={1.5} />
          <text x={52} y={244} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            console
          </text>
          {view.console.length === 0 ? (
            <text x={220} y={273} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
              (nothing printed yet)
            </text>
          ) : (
            <text x={58} y={273} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
              {view.console.join('   ·   ')}
            </text>
          )}
        </g>
      )}
    </svg>
  )
}

const THOUSAND_EXERCISE: CodeExerciseDef = {
  id: 'l42-thousand',
  title: 'a thousand elements, one jump',
  task: 'Prove the O(1) claim with your own hands: build a 1000-element array, then read its two ends — the far end must cost the same one line as the near end.',
  steps: [
    <>
      Create an empty array <code>big</code>, then use a loop (lesson 2.6 style) to fill it:
      element at index <code>i</code> holds <code>i * 2</code>, for indexes 0 through 999.
    </>,
    <>
      Print the FIRST element, then the LAST element — the last one's index must be{' '}
      <em>computed from the array's length</em>, no hand-typed 999.
    </>,
    <>Print the length itself.</>,
  ],
  starter: '',
  expectedOutput: ['0', '1998', '1000'],
  mustUse: [
    { test: /for\s*\(/, label: 'the array is filled by a loop' },
    { test: /big\s*\[\s*i\s*\]\s*=|big\s*\[\s*\w+\s*\]\s*=\s*\w+\s*\*\s*2/, label: 'elements are written by index: big[i] = i * 2' },
    { test: /big\s*\[\s*big\.length\s*-\s*1\s*\]/, label: 'the last element is read via big.length - 1' },
  ],
  mustNotUse: [
    { test: /\[\s*999\s*\]/, label: 'no hand-typed index 999 — length does the counting' },
    { test: /1998/, label: 'no hand-typed 1998 — the array must produce it' },
  ],
  modelAnswer: `const big = [];

for (let i = 0; i < 1000; i++) {
  big[i] = i * 2;
}

console.log(big[0]);
console.log(big[big.length - 1]);
console.log(big.length);`,
}

export const lesson42: LessonDef = {
  id: '4.2',
  hook: (
    <>
      <p>
        Yesterday you read <code>scores[2]</code> and the value just… appeared. Here's the question
        that separates people who <em>use</em> arrays from people who <em>understand</em> them:
        if the array had <strong>two million</strong> elements, would <code>scores[1999999]</code>{' '}
        be slower? Intuition says the engine must walk two million cells to get there. Intuition is
        wrong.
      </p>
      <p>
        The answer is one line of arithmetic, and it's the reason arrays exist at all:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          address = start + index × slot size
        </HighlightMark>
        . Today you learn how an array actually sits in memory (lesson 0.4's wall of slots
        returns), and why that makes every index lookup a single jump.
      </p>
      <p>
        That kind of cost has a name professionals use: <strong>O(1)</strong>. This is your first
        piece of real computer science, and interviewers love asking about it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'contiguous',
      caption:
        'When line 1 runs, the array asks memory for a CONTIGUOUS run of slots — side by side, no gaps, one block. The array itself remembers just ONE number: where the block starts. Here, address 5000.',
      highlightLines: [1],
    },
    {
      id: 'addresses',
      caption:
        'Every slot is the same size — say 8 bytes each. So element 0 lives at address 5000, element 1 at 5008, element 2 at 5016. Same-size slots with no gaps make every address PREDICTABLE. Hold that word.',
      highlightLines: [1],
    },
    {
      id: 'formula',
      caption:
        'Now scores[2]. The engine does NOT walk the array. It computes: start + index × slotSize = 5000 + 2 × 8 = 5016 — and jumps straight to that address. One multiplication, one addition, one jump.',
      highlightLines: [3, 4, 5, 6, 8],
    },
    {
      id: 'index-is-distance',
      caption:
        'THAT is what an index really is: not a label — a DISTANCE the engine can do math on. scores[2] means “two slot-widths from the start.”',
      highlightLines: [8],
    },
    {
      id: 'zero-based',
      caption:
        'And the old zero mystery dissolves: element 0 sits 0 × 8 bytes from the start — the first element is zero steps in. Indexes start at 0 because the distance math starts at 0.',
      highlightLines: [8],
    },
    {
      id: 'same-at-any-size',
      caption:
        'Here’s the beautiful part: the formula doesn’t care how big the array is. Index 2 or index 2,000,000 — same multiply, same add, same single jump. The 71 arrives just as fast either way.',
      highlightLines: [8],
    },
    {
      id: 'big-o',
      caption:
        'That kind of cost has a name professionals use daily: O(1), read “constant time” — the cost stays FLAT as data grows. The graph shows the two shapes you’ll meet forever: O(1) flat, O(n) climbing with size (n = the number of elements).',
      highlightLines: [8],
    },
    {
      id: 'length',
      caption:
        'scores.length is also O(1) — and not because the engine counts quickly. It never counts at all: the array carries a length number in its own bookkeeping and updates it on every change.',
      highlightLines: [9],
    },
    {
      id: 'bounds',
      caption:
        'scores[9]: the arithmetic shrugs and computes 5000 + 9 × 8 = 5072… but that slot was never part of the array’s block — it might belong to a completely different variable! JavaScript checks the index against the length first and answers undefined instead of raiding a stranger’s memory.',
      highlightLines: [10],
    },
    {
      id: 'write-past-the-end',
      caption:
        'WRITING past the end is different, and messier: big[50] = 1 forces the array to grow all the way out to index 50 — leaving a gap behind that breaks the tidy contiguous picture (and the fast math with it). Honest details below.',
      highlightLines: [10],
    },
    {
      id: 'the-catch',
      caption:
        'One law made all this speed possible: the block must stay CONTIGUOUS. No gaps, ever. So think ahead: if element 0 is removed, a gap appears at the start — and the only way to close it is to move EVERY remaining element one slot over. Hold that thought for exactly one lesson: it’s about to become a bill named O(n).',
      highlightLines: [1],
    },
  ],
  Viz: MemoryStrip,
  underTheHood: (
    <>
      <p>
        Big-O notation is nothing more than a label for <em>how cost grows with data size</em>.
        O(1): flat — index reads, <code>.length</code>, writing <code>a[i]</code>.
      </p>
      <p>
        O(n): grows in step with the element count — anything that must visit or move every
        element. You now own the two labels that describe 90% of everyday performance
        conversations (and a healthy share of interview questions).
      </p>
      <p>
        Honesty note: JavaScript engines are craftier than one diagram — an array of mixed types,
        or one with holes, makes V8 fall back to slower internal layouts. The contiguous picture
        is the honest mental model <em>and</em> the practical advice: keep arrays same-typed and
        gap-free, and the engine keeps the fast math.
      </p>
      <p>
        <strong>Fun fact:</strong> hotels run on the same trick. Room 507 isn't found by checking
        every door — the number IS the address: floor 5, corridor position 07, walk straight
        there. An array index is a room number for memory; nobody in a hotel ever does an O(n)
        search for their bed.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'An array starts at address 3000; each slot is 8 bytes. Type the address of a[3].',
      accept: ['3024'],
      placeholder: 'an address…',
      why: '3000 + 3 × 8 = 3024. You just did the exact arithmetic the engine does — one multiply, one add, no walking.',
    },
    {
      kind: 'type-output',
      question: 'Reading a[1] costs the same on a 3-element and a 3-million-element array. Type the big-O name for that kind of cost.',
      accept: ['O(1)', 'o(1)', 'O(1) constant time', 'constant time'],
      placeholder: 'O(…)',
      why: 'O(1) — constant time. The address formula never looks at the array’s size, so the cost line stays flat as data grows.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const a = [1, 2];\nconsole.log(a[5]);',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'The formula would compute an address, but slot 5 was never part of a’s block — JavaScript checks the bounds and answers undefined rather than reading a stranger’s memory.',
    },
  ],
  PlayExtra: () => <CodeExercise def={THOUSAND_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how scores[1999999] can be just as fast as scores[2] — walk them through what an array looks like in memory, the address formula, and what O(1) means.',
    modelAnswer:
      'An array sits in memory as one contiguous block of equal-sized slots, and the array remembers where the block starts. An index isn’t a label — it’s a distance. To read scores[i], the engine computes start + i × slotSize and jumps straight to that address: one multiply, one add, one jump. Nothing about that formula depends on how many elements exist, so index 2 and index 1,999,999 cost the same — that’s O(1), “constant time”: cost stays flat as data grows (versus O(n), where cost grows with the element count, like anything that must touch every element). It’s also why indexes start at zero — the first element is zero slots from the start — and why reading past the end gives undefined: the math could compute an address, but it’s outside the array’s block, so JavaScript refuses.',
  },
  recap: [
    'An array is a CONTIGUOUS block of equal-sized slots; the array stores where the block starts.',
    'scores[i] = start + i × slotSize → one jump. O(1), constant time — flat cost no matter the size. (Index = distance, hence 0-based.)',
    '.length is stored bookkeeping (also O(1)). Reading past the end: bounds-checked → undefined. The contiguity law is why removing the front will cost O(n) — next lesson’s bill.',
  ],
}
