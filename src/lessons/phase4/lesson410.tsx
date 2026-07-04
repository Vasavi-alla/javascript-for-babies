import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.10 — Sorting & finding
 * Viz: the referee. sort() with no comparator holds two elements up AS STRINGS
 * and orders them alphabetically (the famous gotcha, in daylight); with a
 * comparator, the referee reads your function's sign. Then a scanner ray runs
 * the shelf for find / some / every / includes with ✓/✗ verdicts.
 */

const CODE = `const times = [9, 120, 45];

times.sort();
console.log(times);

times.sort((a, b) => a - b);
console.log(times);

const names = ["Mo", "Ada", "Liv"];
console.log(names.find(n => n.length === 3));
console.log(names.some(n => n === "Zed"));
console.log(names.every(n => n.length <= 3));`

interface View {
  mode: 'sort' | 'scan'
  cells: string[]
  refereeText?: string
  refereeBad?: boolean
  /** scan marks per cell: '✓' | '✗' | '' */
  marks?: string[]
  scanLabel?: string
  result?: string
  console: string[]
  note?: string
}

const VIEWS: View[] = [
  {
    mode: 'sort',
    cells: ['9', '120', '45'],
    refereeText: 'no comparator given…',
    console: [],
    note: 'sort() with no arguments has a default plan — and it’s not the one you think',
  },
  {
    mode: 'sort',
    cells: ['120', '45', '9'],
    refereeText: 'compared AS STRINGS: "1" < "4" < "9"',
    refereeBad: true,
    console: ['[120,45,9]'],
    note: 'alphabetical order on numbers: 120 first, 9 last. The most famous array gotcha in JS',
  },
  {
    mode: 'sort',
    cells: ['9', '45', '120'],
    refereeText: '(a, b) => a - b   · negative = a first',
    console: ['[120,45,9]', '[9,45,120]'],
    note: 'a comparator makes the referee numeric — YOUR function decides the order',
  },
  {
    mode: 'sort',
    cells: ['9', '45', '120'],
    refereeText: 'a − b ascends · b − a descends',
    console: ['[120,45,9]', '[9,45,120]'],
    note: 'the SIGN is the whole contract: negative = first argument first',
  },
  {
    mode: 'sort',
    cells: ['9', '45', '120'],
    refereeText: 'sort changed times ITSELF — in place',
    refereeBad: true,
    console: ['[120,45,9]', '[9,45,120]'],
    note: 'sort MUTATES — [...times].sort(…) keeps the original intact (4.7’s spread)',
  },
  {
    mode: 'scan',
    cells: ['"Mo"', '"Ada"', '"Liv"'],
    marks: ['✗', '✓', ''],
    scanLabel: 'find(n => n.length === 3) — first ✓ wins, scan stops',
    result: '"Ada"',
    console: ['Ada'],
    note: 'find returns the first passing ELEMENT (or undefined if none pass)',
  },
  {
    mode: 'scan',
    cells: ['"Mo"', '"Ada"', '"Liv"'],
    marks: ['✗', '✗', '✗'],
    scanLabel: 'some(n => n === "Zed") — is at least ONE a yes?',
    result: 'false',
    console: ['Ada', 'false'],
    note: 'some asks “does anyone pass?” — a boolean, not an element',
  },
  {
    mode: 'scan',
    cells: ['"Mo"', '"Ada"', '"Liv"'],
    marks: ['✓', '✓', '✓'],
    scanLabel: 'every(n => n.length <= 3) — do ALL pass?',
    result: 'true',
    console: ['Ada', 'false', 'true'],
    note: 'every asks “does everyone pass?” — one ✗ anywhere makes it false',
  },
  {
    mode: 'scan',
    cells: ['"Mo"', '"Ada"', '"Liv"'],
    marks: ['✓', '✓', '✓'],
    scanLabel: 'some = “anyone?” · every = “everyone?”',
    result: 'true',
    console: ['Ada', 'false', 'true'],
    note: 'some/every = the exact shape of a test assertion about a whole list',
  },
]

function SortScan({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* cells */}
      {view.cells.map((v, i) => (
        <motion.g key={`${v}-${i}`} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <RoughRect x={62 + i * 112} y={54} width={94} height={46} seed={681 + i} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={109 + i * 112} y={82} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13.5} fill="var(--color-ink)">
            {v}
          </text>
          {view.marks && view.marks[i] && (
            <motion.text
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.14 }}
              x={109 + i * 112}
              y={40}
              textAnchor="middle"
              fontSize={16}
              fontWeight={700}
              fill={view.marks[i] === '✓' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}
            >
              {view.marks[i]}
            </motion.text>
          )}
        </motion.g>
      ))}

      {view.mode === 'sort' ? (
        <g>
          {/* the referee */}
          <RoughRect x={90} y={130} width={260} height={52} seed={691} strokeWidth={2} fill={view.refereeBad ? 'color-mix(in srgb, var(--color-marker-coral) 16%, transparent)' : 'var(--color-marker-yellow)'} fillStyle="solid" />
          <text x={220} y={150} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            the referee — how sort compares a pair
          </text>
          <AnimatePresence mode="wait">
            <motion.text key={view.refereeText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={170} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill={view.refereeBad ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
              {view.refereeText}
            </motion.text>
          </AnimatePresence>
        </g>
      ) : (
        <g>
          <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={600} fill="var(--color-ink)">
            {view.scanLabel}
          </text>
          {view.result && (
            <motion.g key={view.result} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
              <RoughRect x={160} y={156} width={120} height={32} seed={692} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="solid" />
              <text x={220} y={177} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
                {view.result}
              </text>
            </motion.g>
          )}
        </g>
      )}

      {/* note */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14.5} fontWeight={700} fill={view.refereeBad ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}><WrapTspans text={view.note} x={220} maxPx={426} fontSize={14.5} /></motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      <RoughRect x={40} y={244} width={360} height={42} seed={693} strokeWidth={1.5} />
      <text x={52} y={240} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={270} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        <text x={58} y={270} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
          {view.console.join('   ·   ')}
        </text>
      )}
    </svg>
  )
}

const LEADERBOARD_EXERCISE: CodeExerciseDef = {
  id: 'l48-leaderboard',
  title: 'leaderboard, highest first',
  task: 'Game night ends and the scores come in unordered. Build the leaderboard — biggest score on top — and run two sanity checks on it.',
  steps: [
    <>
      Start with <code>scores</code> = <code>[340, 90, 1200, 505]</code>.
    </>,
    <>
      Sort it so the HIGHEST score comes first (the lesson sorted ascending — this is the other
      direction), then print the top score using an index.
    </>,
    <>
      Print whether the board <em>contains</em> a score of exactly <code>90</code>.
    </>,
    <>
      Print whether <em>every</em> score is at least <code>90</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['1200', 'true', 'true'],
  mustUse: [
    { test: /\.sort\s*\(\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=>/, label: 'sort gets a comparator — no default string sort' },
    { test: /\.includes\s*\(\s*90\s*\)/, label: 'membership is asked with includes' },
    { test: /\.every\s*\(/, label: 'the "all of them?" question is every' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*1200\s*\)/, label: 'no hand-typed 1200 — the sort must put it on top' },
  ],
  modelAnswer: `const scores = [340, 90, 1200, 505];

scores.sort((a, b) => b - a);
console.log(scores[0]);

console.log(scores.includes(90));
console.log(scores.every(s => s >= 90));`,
}

export const lesson410: LessonDef = {
  id: '4.10',
  hook: (
    <>
      <p>
        Two jobs remain in every list-worker's toolbelt: putting elements <em>in order</em>, and{' '}
        <em>asking questions</em> about them.
      </p>
      <p>
        The question-askers (<code>find</code>, <code>some</code>, <code>every</code>,{' '}
        <code>includes</code>) are honest tools. The sorter is a honest tool with{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
          the most famous default in JavaScript
        </HighlightMark>
        : call <code>sort()</code> on numbers without telling it how to compare, and it will
        happily order <code>120</code> before <code>9</code>. Today you see exactly why — and never
        fall for it again.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'default-sort',
      caption:
        'times.sort() — no arguments. The referee needs SOME rule to compare a pair… and the default rule is: convert both to STRINGS, compare alphabetically. Brace yourself.',
      highlightLines: [3],
    },
    {
      id: 'gotcha',
      caption:
        'There it is: [120, 45, 9]. As strings, "120" starts with "1", "45" with "4", "9" with "9" — and alphabetically 1 < 4 < 9, so 120 wins. Numbers sorted like words. Every JavaScript developer alive has been bitten by this line exactly once.',
      highlightLines: [3, 4],
    },
    {
      id: 'comparator',
      caption:
        'The fix: hand the referee YOUR comparison — times.sort((a, b) => a - b). The rule: your function returns a number, and NEGATIVE means “a goes first”, positive means “b goes first”.',
      highlightLines: [6, 7],
    },
    {
      id: 'comparator-sign',
      caption:
        'a - b is negative exactly when a is smaller → ascending order. Want descending? b - a flips the sign. The comparator’s SIGN is the entire contract — nothing else about your function matters.',
      highlightLines: [6, 7],
    },
    {
      id: 'sort-mutates',
      caption:
        'Note well: unlike yesterday’s trio, sort MUTATES the array in place — times itself is now reordered. Need the original intact? Sort a copy: [...times].sort(...) — 4.7’s spread, useful already.',
      highlightLines: [6, 7],
    },
    {
      id: 'find',
      caption:
        'Now the questions. names.find(n => n.length === 3) scans left to right and returns the FIRST element whose answer is true — "Ada" — then STOPS scanning. Nothing passes? You get undefined (the polite non-answer you now know well).',
      highlightLines: [9, 10],
    },
    {
      id: 'some',
      caption:
        'names.some(n => n === "Zed") asks: does at least ONE element pass? Every name gets checked… all ✗ → false. some returns a boolean, not an element. (For simple exact membership, includes("Zed") says the same thing without a function.)',
      highlightLines: [11],
    },
    {
      id: 'every',
      caption:
        'names.every(n => n.length <= 3) asks the opposite: do ALL pass? ✓ ✓ ✓ → true. One ✗ anywhere would make it false. some = “anyone?”, every = “everyone?”',
      highlightLines: [12],
    },
    {
      id: 'assert-bridge',
      caption:
        'Together they’re how code asserts things about whole lists. Hold that word, assert: in Phase 10 you’ll write expect-style checks that are exactly these two questions wearing a suit.',
      highlightLines: [12],
    },
  ],
  Viz: SortScan,
  underTheHood: (
    <>
      <p>
        Why is string-sort the default? <code>sort</code> predates most of modern JS and had to
        work on arrays of <em>anything</em> — strings were the one common denominator. The rule to
        internalize: <strong>sorting numbers always needs a comparator</strong>. The comparator
        contract is just the sign: negative → first argument first, positive → second first, zero →
        tie.
      </p>
      <p>
        The scanners short-circuit smartly: <code>find</code> and <code>some</code> stop at the
        first ✓, <code>every</code> stops at the first ✗ — on a million-element array that matters.
      </p>
      <p>
        <code>includes</code> uses exact <code>===</code> comparison, which means (4.6 forever) it
        matches objects only by <em>address</em>: <code>list.includes({'{ id: 1 }'})</code> is
        false even if a same-shaped object sits right there — for objects, ask{' '}
        <code>some(el =&gt; el.id === 1)</code> instead.
      </p>
      <p>
        <strong>Fun fact:</strong> your file explorer falls for the same default: name photos{' '}
        <code>photo1, photo2, … photo10</code> and watch <code>photo10</code> sort right after{' '}
        <code>photo1</code> — alphabetical order on digits, exactly JavaScript's default sort. The
        workaround humans invented (naming files <code>photo01</code>) is a comparator you apply by
        hand.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The classic. Type the FIRST element after this sort:',
      code: 'const a = [100, 25, 3];\na.sort();\nconsole.log(a[0]);',
      accept: ['100'],
      placeholder: 'type the console output…',
      why: 'No comparator → string comparison: "100" < "25" < "3" because "1" < "2" < "3" alphabetically. 100 lands first. Numbers need a comparator, always.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const a = [3, 10, 1];\na.sort((x, y) => x - y);\nconsole.log(a[0]);',
      accept: ['1'],
      placeholder: 'type the console output…',
      why: 'x - y is negative when x is smaller → ascending order → [1, 3, 10], and index 0 holds 1. The comparator’s SIGN is the whole contract.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'console.log([4, 8, 15].some(n => n > 10));',
      accept: ['true'],
      placeholder: 'type the console output…',
      why: '“Does at least one pass?” — 15 does, so true. (every would ask “do all pass?” — 4 and 8 fail, so that one would be false.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={LEADERBOARD_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend sorted [9, 30, 200] and got [200, 30, 9]-ish nonsense. Explain what sort does without a comparator, how the comparator’s return value steers the order, and one more surprise sort hides (hint: what happens to the original array?).',
    modelAnswer:
      'Without a comparator, sort converts every element to a STRING and orders alphabetically — "2" comes before "3" comes before "9", so 200, 30, 9. Numbers always need a comparator: sort((a, b) => a - b). The contract is the SIGN of what my function returns — negative means a comes first, positive means b comes first, zero is a tie. a - b is negative when a is smaller, so it sorts ascending; b - a descends. The extra surprise: sort MUTATES the array in place (unlike map/filter/reduce, which build new arrays) — if the original order matters, sort a spread copy: [...arr].sort((a, b) => a - b).',
  },
  recap: [
    'sort() defaults to STRING comparison — 120 before 45 before 9. Numbers always need a comparator; the SIGN of (a, b) => … decides who goes first.',
    'sort mutates in place — [...arr].sort(...) to keep the original. find → first passing element (else undefined), and it stops early.',
    'some = “does anyone pass?”, every = “does everyone pass?” (booleans); includes = exact === membership — which for objects means same address.',
  ],
}
