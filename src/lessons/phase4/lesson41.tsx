import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.1 — Arrays
 * Viz: ArrayShelf — the array drawn as a row of indexed cells under one
 * variable name. Reads highlight a cell and produce a value token; a write
 * swaps a cell's contents; reading past the end shows a dashed ghost cell.
 * Phase 4 voice: real terms (array, element, index, length) lead everywhere.
 */

const CODE = `const scores = [82, 95, 71];

console.log(scores[0]);
console.log(scores.length);

scores[1] = 96;
console.log(scores);

console.log(scores[3]);`

interface View {
  cells: (number | null)[]
  /** index currently being read */
  readIndex: number | null
  /** token that just came out of a read */
  outToken: string | null
  /** index that just got overwritten */
  wroteIndex: number | null
  showLength: boolean
  /** show the dashed ghost cell past the end */
  ghost: boolean
  console: string[]
  /** small appearing annotation for elaboration-only steps */
  badge?: string
}

const VIEWS: View[] = [
  { cells: [82, 95, 71], readIndex: null, outToken: null, wroteIndex: null, showLength: false, ghost: false, console: [] },
  { cells: [82, 95, 71], readIndex: 0, outToken: '82', wroteIndex: null, showLength: false, ghost: false, console: ['82'] },
  { cells: [82, 95, 71], readIndex: null, outToken: null, wroteIndex: null, showLength: true, ghost: false, console: ['82', '3'] },
  { cells: [82, 95, 71], readIndex: null, outToken: null, wroteIndex: null, showLength: true, ghost: false, console: ['82', '3'], badge: 'length counts from 1, indexes from 0 — last = length − 1' },
  { cells: [82, 96, 71], readIndex: null, outToken: null, wroteIndex: 1, showLength: false, ghost: false, console: ['82', '3'] },
  { cells: [82, 96, 71], readIndex: null, outToken: null, wroteIndex: 1, showLength: false, ghost: false, console: ['82', '3'], badge: 'const… yet the contents changed?! → lesson 4.6' },
  { cells: [82, 96, 71], readIndex: null, outToken: null, wroteIndex: null, showLength: false, ghost: false, console: ['82', '3', '[82,96,71]'] },
  { cells: [82, 96, 71], readIndex: 3, outToken: 'undefined', wroteIndex: null, showLength: false, ghost: true, console: ['82', '3', '[82,96,71]', 'undefined'] },
]

const CELL_W = 86
const CELL_X0 = 70

function ArrayShelf({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* the variable name, tied to the whole array */}
      <RoughRect x={20} y={26} width={92} height={26} seed={411} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={66} y={44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        scores
      </text>
      <text x={126} y={44} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        — one name for the whole array
      </text>

      {/* the cells */}
      {view.cells.map((value, i) => (
        <g key={i}>
          <RoughRect
            x={CELL_X0 + i * CELL_W}
            y={80}
            width={CELL_W - 10}
            height={54}
            seed={420 + i}
            strokeWidth={view.readIndex === i ? 2.6 : 1.8}
            stroke={view.readIndex === i ? 'var(--color-marker-teal)' : view.wroteIndex === i ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
            fill={view.wroteIndex === i ? 'color-mix(in srgb, var(--color-marker-coral) 22%, transparent)' : 'var(--color-paper-raised, #fff)'}
            fillStyle="solid"
          />
          <AnimatePresence mode="popLayout">
            <motion.text
              key={String(value)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              x={CELL_X0 + i * CELL_W + (CELL_W - 10) / 2}
              y={114}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={17}
              fontWeight={700}
              fill="var(--color-ink)"
            >
              {value}
            </motion.text>
          </AnimatePresence>
          {/* the index, written under the cell */}
          <text
            x={CELL_X0 + i * CELL_W + (CELL_W - 10) / 2}
            y={156}
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fontSize={12.5}
            fontWeight={view.readIndex === i ? 700 : 400}
            fill={view.readIndex === i ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}
          >
            {i}
          </text>
        </g>
      ))}
      <text x={CELL_X0 + 3} y={173} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        indexes — each one is a distance from the start
      </text>

      {/* ghost cell past the end */}
      {view.ghost && (
        <g>
          <RoughRect x={CELL_X0 + 3 * CELL_W} y={80} width={CELL_W - 10} height={54} seed={429} strokeWidth={1.6} stroke="var(--color-ink-soft)" roughness={2.4} />
          <text x={CELL_X0 + 3 * CELL_W + (CELL_W - 10) / 2} y={112} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            nothing here
          </text>
          <text x={CELL_X0 + 3 * CELL_W + (CELL_W - 10) / 2} y={156} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink-soft)">
            3
          </text>
        </g>
      )}

      {/* length badge */}
      <AnimatePresence>
        {view.showLength && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={330} y={22} width={92} height={32} seed={431} fill="var(--color-marker-teal)" fillStyle="hachure" strokeWidth={1.6} />
            <text x={376} y={43} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
              .length = 3
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* value token coming out of a read */}
      <AnimatePresence>
        {view.outToken && (
          <motion.g
            key={view.outToken}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 190 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect
              x={168}
              y={0}
              width={104}
              height={26}
              seed={433}
              fill={view.outToken === 'undefined' ? 'color-mix(in srgb, var(--color-marker-coral) 35%, transparent)' : 'var(--color-marker-yellow)'}
              fillStyle="solid"
              strokeWidth={1.5}
            />
            <text x={220} y={18} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
              {view.outToken}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* elaboration badge */}
      <AnimatePresence>
        {view.badge && (
          <motion.text
            key={view.badge}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x={220}
            y={208}
            textAnchor="middle"
            fontFamily="var(--font-hand)"
            fontSize={14}
            fontWeight={700}
            fill="var(--color-marker-coral)"
          ><WrapTspans text={view.badge} x={220} maxPx={330} fontSize={14} /></motion.text>
        )}
      </AnimatePresence>

      {/* console strip */}
      <RoughRect x={40} y={228} width={360} height={62} seed={434} strokeWidth={1.5} />
      <text x={52} y={224} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={264} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        view.console.slice(-3).map((line, i) => (
          <motion.text
            key={`${line}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={58}
            y={247 + i * 15}
            fontFamily="var(--font-code)"
            fontSize={11.5}
            fill={line === 'undefined' ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
          >
            {line}
          </motion.text>
        ))
      )}
    </svg>
  )
}

const PLAYLIST_EXERCISE: CodeExerciseDef = {
  id: 'l41-playlist',
  title: 'the last song, wherever it is',
  task: 'You manage a music playlist. Print its final song in a way that keeps working when the playlist grows to 50 songs — then swap the opener.',
  steps: [
    <>
      Create an array named <code>playlist</code> holding exactly these three strings, in this
      order: <code>"Shape of You"</code>, <code>"Believer"</code>, <code>"Perfect"</code>.
    </>,
    <>
      Print the LAST element — its index must be <em>computed from the array's length</em>, not
      typed as a number. (Imagine the playlist had 50 songs tomorrow: your line must still print
      the last one.)
    </>,
    <>
      Replace the FIRST element with <code>"Golden Hour"</code>, then print element 0.
    </>,
  ],
  starter: '',
  expectedOutput: ['Perfect', 'Golden Hour'],
  mustUse: [
    { test: /playlist\s*\[\s*playlist\.length\s*-\s*1\s*\]/, label: 'the last index is computed: playlist[playlist.length - 1]' },
    { test: /playlist\s*\[\s*0\s*\]\s*=/, label: 'element 0 is replaced by assigning to it' },
  ],
  mustNotUse: [
    { test: /\[\s*2\s*\]/, label: 'no hard-coded index 2 — .length does the counting' },
  ],
  modelAnswer: `const playlist = ["Shape of You", "Believer", "Perfect"];

console.log(playlist[playlist.length - 1]);

playlist[0] = "Golden Hour";
console.log(playlist[0]);`,
}

export const lesson41: LessonDef = {
  id: '4.1',
  hook: (
    <>
      <p>
        So far, every variable held <em>one</em> value. Now imagine tracking exam scores for a
        class of thirty. Thirty separate variables — <code>score1</code>, <code>score2</code>,{' '}
        <code>score3</code>… — would be unbearable to write and impossible to loop over. What we
        want is <strong>one name for many values, kept in order</strong>.
      </p>
      <p>
        That is an{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          array
        </HighlightMark>
        : an ordered collection of values under a single variable name. Each value inside is called
        an <strong>element</strong>, and each element sits at a numbered position called its{' '}
        <strong>index</strong>.
      </p>
      <p>
        Arrays are the data structure you will meet most often for the rest of your career — every
        list of test results Playwright hands you is one.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'create',
      caption:
        'Line 1 builds the array: three elements, in order, under the single name scores. The square brackets [ ] are the array literal — “make an ordered collection of what’s between the brackets.” The order you write is the order it keeps: 82 first, 95 second, 71 third.',
      highlightLines: [1],
    },
    {
      id: 'read',
      caption:
        'scores[0] reads the element at index 0 — and that’s 82, the FIRST element. Indexes start at 0 because an index measures the distance from the start of the array: the first element is zero steps in. So scores[1] is 95 (one step in), and scores[2] is 71.',
      highlightLines: [3],
    },
    {
      id: 'length',
      caption:
        'scores.length asks the array how many elements it currently holds: 3.',
      highlightLines: [4],
    },
    {
      id: 'length-offbyone',
      caption:
        'Careful with the off-by-one: length COUNTS elements (starting from 1, like humans do), while indexes measure distance (starting from 0). Three elements, but the last one lives at index 2 — always length minus 1.',
      highlightLines: [4],
    },
    {
      id: 'write',
      caption:
        'You can assign INTO an index: scores[1] = 96 replaces the element at index 1. The array’s shape didn’t change — same three positions — only the value at position 1 did.',
      highlightLines: [6],
    },
    {
      id: 'write-const-tease',
      caption:
        'Wait — scores was declared with const, and we just changed its contents? Hold that thought. Lesson 4.6 explains exactly why this is allowed, and it’s the most important idea of this phase.',
      highlightLines: [6],
    },
    {
      id: 'print-all',
      caption:
        'Printing the whole array shows all elements in order — with our change in place: 82, 96, 71. An array is still one value (one thing you can store, pass, and print); it just contains others.',
      highlightLines: [7],
    },
    {
      id: 'past-the-end',
      caption:
        'scores[3] asks for an element three steps from the start — but the array ends at index 2. No crash, no error: JavaScript answers undefined, the same “nothing was ever put here” value from lesson 1.7. Quietly getting undefined from a too-big index is one of the most common bugs you’ll ever hunt.',
      highlightLines: [9],
    },
  ],
  Viz: ArrayShelf,
  underTheHood: (
    <>
      <p>
        An array keeps its elements <em>in order, in memory</em>, and the index is what makes that
        useful: when you write <code>scores[2]</code>, the engine doesn't search — it jumps
        straight to position 2. Reading by index is instant whether the array holds three elements
        or three million — the address arithmetic behind that jump is the whole story of the next
        lesson.
      </p>
      <p>
        That's the trade arrays make: you find things by <em>position</em>, not by name.
      </p>
      <p>
        <code>.length</code> is not something you compute — the array maintains it live, always
        equal to the number of elements.
      </p>
      <p>
        The last element therefore always sits at <code>length - 1</code>, and asking for any
        index at <code>length</code> or beyond returns <code>undefined</code> — no error, which is
        both convenient and sneaky.
      </p>
      <p>
        <strong>Fun fact:</strong> indexes start at 0 for the same reason many buildings in Europe
        call the ground floor “floor 0”: the number says how far you <em>climb</em>, not which room
        you're in. You climb zero flights to the ground floor — and you step zero elements to
        reach the first one.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const colors = ["red", "green", "blue"];\nconsole.log(colors[1]);',
      accept: ['green'],
      placeholder: 'type the console output…',
      why: 'Index 1 means one step from the start — the SECOND element, "green". The console prints the string’s characters without quotes.',
    },
    {
      kind: 'type-output',
      question: 'a.length is 4. Type the INDEX where the last element lives.',
      code: 'const a = [10, 20, 30, 40];',
      accept: ['3'],
      placeholder: 'a number…',
      why: 'length counts elements the human way (1, 2, 3, 4); indexes measure distance the array way (0, 1, 2, 3). The last element is always at length - 1.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const list = ["a", "b"];\nconsole.log(list[2]);',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'The array ends at index 1. Reading past the end never crashes — it answers undefined, “nothing was ever put here.” Silent undefineds like this cause real bugs, which is why you just typed it with your own hands.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PLAYLIST_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend sees fruits[0] and asks: “why 0? The banana is obviously the FIRST fruit.” Explain what an index really measures, and how they can always find the last element of any array.',
    modelAnswer:
      'An index doesn’t say “which one” the human way — it measures the distance from the start of the array. The first element is zero steps in, so it lives at index 0; the second is one step in, at index 1. That’s also why the last element is at fruits.length - 1: length counts the elements (say, 3), but the last one is only 2 steps from the start. And if you ask for an index past the end, JavaScript doesn’t error — it hands back undefined, meaning nothing was ever stored there.',
  },
  recap: [
    'An array is an ordered collection of elements under one variable name: const scores = [82, 95, 71].',
    'An index measures distance from the start — first element at 0, last at length - 1. Read with scores[i], replace with scores[i] = newValue.',
    '.length is the live element count. Reading past the end gives undefined — no error, so watch for it.',
  ],
}
