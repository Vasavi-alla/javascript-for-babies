import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.12 — Map & Set
 * Set = the uniqueness machine (4.5's hash machinery guarding the door);
 * Map = the hash map as a dedicated tool, keys of ANY type.
 * (JSON split out into its own lesson, 4.13, so this one gets to breathe.)
 */

const CODE = `const seen = new Set(["ana", "ben", "ana"]);
console.log(seen.size);
console.log(seen.has("ben"));

const votes = new Map();
votes.set("pizza", 3);
votes.set(7, "lucky");
console.log(votes.get(7));`

interface View {
  mode: 'set' | 'map'
  rejected?: boolean
  console: string[]
  note: string
}

const VIEWS: View[] = [
  { mode: 'set', console: [], note: 'a Set stores each value ONCE — three names go in, one is a repeat' },
  { mode: 'set', rejected: true, console: [], note: 'the second "ana" bounces off the door — already inside, so it’s absorbed' },
  { mode: 'set', rejected: true, console: ['2'], note: '.size counts uniques only: 2, not 3' },
  { mode: 'set', rejected: true, console: ['2', 'true'], note: '.has("ben") answers in O(1) — 4.5’s hash machinery guards the door' },
  { mode: 'set', rejected: true, console: ['2', 'true'], note: 'Sets also offer .add() and .delete(). The pattern: "have I seen this?" at any scale = Set' },
  { mode: 'map', console: ['2', 'true'], note: 'object keys always become strings (4.4/4.5) — a Map’s keys keep their true type' },
  { mode: 'map', console: ['2', 'true'], note: 'votes.set(7, "lucky") stores the NUMBER 7 as a genuine key, not the text "7"' },
  { mode: 'map', console: ['2', 'true', 'lucky'], note: 'set / get / size / has — the 4.5 hash map, offered as a dedicated tool' },
]

function SetMapViz({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {view.mode === 'set' && (
        <g>
          {['"ana"', '"ben"', '"ana"'].map((v, i) => (
            <motion.g key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
              <RoughRect x={30} y={48 + i * 44} width={76} height={32} seed={781 + i} strokeWidth={1.7} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={68} y={69 + i * 44} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">{v}</text>
            </motion.g>
          ))}
          {/* the door */}
          <RoughRect x={160} y={60} width={110} height={110} seed={785} strokeWidth={2.2} fill="var(--color-marker-yellow)" fillStyle="solid" />
          <text x={215} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">the door</text>
          <text x={215} y={120} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink-soft)">already inside?</text>
          <text x={215} y={136} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink-soft)">(hash lookup, O(1))</text>
          {/* inside the set */}
          <RoughRect x={310} y={56} width={104} height={118} seed={786} strokeWidth={2} roughness={1.8} />
          <text x={362} y={48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">seen (uniques only)</text>
          <text x={362} y={96} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">"ana"</text>
          <text x={362} y={126} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">"ben"</text>
          {view.rejected && (
            <motion.text initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} x={215} y={198} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-coral)">
              the second "ana" bounced off — already inside
            </motion.text>
          )}
        </g>
      )}

      {view.mode === 'map' && (
        <g>
          <text x={30} y={48} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
            votes — a Map: keys keep their real type
          </text>
          {[{ k: '"pizza"', v: '3', kind: 'string key' }, { k: '7', v: '"lucky"', kind: 'NUMBER key — objects can’t do this' }].map((row, i) => (
            <motion.g key={row.k} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
              <RoughRect x={40} y={62 + i * 56} width={100} height={38} seed={791 + i} strokeWidth={1.8} fill="var(--color-sticky)" fillStyle="solid" />
              <text x={90} y={86 + i * 56} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill={i === 1 ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>{row.k}</text>
              <HandArrow from={{ x: 142, y: 81 + i * 56 }} to={{ x: 186, y: 81 + i * 56 }} curve={0} seed={793 + i} strokeWidth={2} headLength={8} />
              <RoughRect x={190} y={62 + i * 56} width={96} height={38} seed={795 + i} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={238} y={86 + i * 56} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">{row.v}</text>
              <text x={300} y={86 + i * 56} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">{row.kind}</text>
            </motion.g>
          ))}
          <text x={40} y={205} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
            votes.get(7) → "lucky"   ·   votes.size → 2
          </text>
        </g>
      )}

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={236} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={252} width={360} height={38} seed={806} strokeWidth={1.5} />
      <text x={52} y={248} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">console (latest)</text>
      {view.console.length === 0 ? (
        <text x={220} y={276} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">(nothing printed yet)</text>
      ) : (
        <text x={58} y={276} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{view.console.slice(-2).join('   ·   ')}</text>
      )}
    </svg>
  )
}

const CHECKIN_EXERCISE: CodeExerciseDef = {
  id: 'l412-checkins',
  title: 'count the crowd',
  task: 'An event scanner logs every badge tap — including people tapping twice. Count the UNIQUE visitors who actually came.',
  steps: [
    <>
      Start with <code>checkins</code> = <code>["mia", "raj", "mia", "raj", "zoe"]</code>.
    </>,
    <>
      Build the structure that keeps each name once, call it <code>unique</code>, and print how
      many people actually came.
    </>,
  ],
  starter: '',
  expectedOutput: ['3'],
  mustUse: [
    { test: /new\s+Set\s*\(/, label: 'uniqueness is a Set’s job' },
    { test: /\w+\.size/, label: 'the count comes from .size' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*3\s*\)/, label: 'no hand-typed 3 — the Set must produce the count' },
  ],
  modelAnswer: `const checkins = ["mia", "raj", "mia", "raj", "zoe"];

const unique = new Set(checkins);
console.log(unique.size);`,
}

export const lesson412: LessonDef = {
  id: '4.12',
  hook: (
    <>
      <p>
        Two honest limits have been hiding in plain sight. Arrays happily hold duplicates — ask
        "how many <em>unique</em> visitors?" and you're writing a loop with checks.
      </p>
      <p>
        And object keys are <em>always strings</em> (4.5 hashed strings, remember) — try to use
        the number <code>7</code> as a key, and it gets quietly converted to text.
      </p>
      <p>
        JavaScript ships two purpose-built collections for exactly these gaps —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Set (each value once) and Map (keys of any type)
        </HighlightMark>{' '}
        — both running on 4.5's hash machinery.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'set',
      caption:
        'new Set([...]) feeds the array through a door with one rule: already inside? Then you don’t come in again. Three names are about to go in.',
      highlightLines: [1],
    },
    {
      id: 'set-dedupe',
      caption: 'The second "ana" bounces off the door — it was already inside, so it’s simply absorbed. Two uniques remain.',
      highlightLines: [1],
    },
    {
      id: 'set-size',
      caption: 'seen.size → 2. Uniques only — no duplicates, ever. That’s the whole contract of a Set.',
      highlightLines: [2],
    },
    {
      id: 'set-has',
      caption:
        'seen.has("ben") → true — and that check is O(1), because behind the door is 4.5’s hash machinery: hash the value, jump to its bucket, see if it’s there.',
      highlightLines: [3],
    },
    {
      id: 'set-pattern',
      caption:
        'Sets also offer .add() and .delete(). The pattern to remember: “have I seen this before?” at any scale = Set.',
      highlightLines: [3],
    },
    {
      id: 'map-why',
      caption:
        'Now the object limit. In lesson 4.4 keys were strings — always. Write shoppingCart[7] and the 7 becomes "7". A Map removes the limit: keys keep their real type.',
      highlightLines: [5, 6, 7],
    },
    {
      id: 'map-numberkey',
      caption:
        'votes.set(7, "lucky") stores the NUMBER 7 as a genuine key — not the text "7". Any type works as a Map key: numbers, objects, anything.',
      highlightLines: [7],
    },
    {
      id: 'map-ops',
      caption:
        'The Map API says its intentions out loud: set(key, value), get(key) → the value, plus .size and .has like Set. votes.get(7) → "lucky".',
      highlightLines: [8],
    },
    {
      id: 'map-vs-object',
      caption:
        'Rule of thumb: a fixed record with known named fields → plain object (4.4); a lookup table that grows and shrinks at runtime, or needs non-string keys → Map. Same O(1) hash lookups either way.',
      highlightLines: [8],
    },
  ],
  Viz: SetMapViz,
  underTheHood: (
    <>
      <p>
        Both Set and Map run on exactly the hash machinery from lesson 4.5: a hash function turns
        the key (or value, for a Set) into a bucket number, and that bucket is where the lookup,
        insert, or delete happens — all O(1), regardless of how many entries exist.
      </p>
      <p>
        Both also remember <strong>insertion order</strong> when you iterate them (with{' '}
        <code>for...of</code>, lesson 4.8) — unlike the historically unordered guarantees of plain
        objects. That predictability is one more reason Map is the safer choice for a runtime lookup
        table.
      </p>
      <p>
        There's a rarer sibling pair worth knowing exists: <code>WeakMap</code> and{' '}
        <code>WeakSet</code>. They only accept objects as keys/values, and they let the garbage
        collector (5.7) sweep an entry away the moment nothing else references that object —
        useful for caches that shouldn't outlive what they're caching. You'll recognize the names
        more than you'll write them.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'console.log(new Set([1, 1, 2, 2, 2]).size);',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 'The door admits each value once: 1 enters, 1 bounces, 2 enters, 2 and 2 bounce. Two uniques — .size is 2.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const m = new Map();\nm.set(1, "one");\nm.set("1", "ONE");\nconsole.log(m.size);',
      accept: ['2'],
      placeholder: 'type the console output…',
      why: 'A Map keeps keys’ real types: the number 1 and the string "1" are different keys — unlike a plain object, where both would collapse into the same "1" property. size is 2.',
    },
    {
      question: 'You need a lookup table that grows at runtime and might use numbers as keys. Which tool?',
      options: ['A plain object, like always', 'A Map', 'An array of arrays'],
      correctIndex: 1,
      why: 'Map is built for exactly this: any-type keys, and it’s designed to grow/shrink at runtime with O(1) operations throughout. Plain objects are best for fixed records with known named fields.',
    },
  ],
  PlayExtra: () => <CodeExercise def={CHECKIN_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: when would you reach for a Set instead of an array, and a Map instead of a plain object?',
    modelAnswer:
      'Set: when each value must exist once — dedupe a list, or ask "have I seen this before?" — it refuses duplicates at the door and .has answers in O(1) via hashing. Map: when I need a lookup table whose keys aren’t strings (object keys always become strings — Map keeps a number 7 as a real 7) or that grows/shrinks at runtime; plain objects stay best for fixed records with named fields. Both run on the same hash machinery as regular objects — just with fewer restrictions on what a key can be.',
  },
  recap: [
    'Set = each value once; .has/.add in O(1) (hash door). The “unique visitors / seen before?” tool.',
    'Map = a hash map with keys of ANY type (object keys are always strings). set/get/size/has.',
    'Fixed named record → plain object (4.4); runtime lookup table, or non-string keys → Map.',
  ],
}
