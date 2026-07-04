import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.5 — Inside an object: the hash trick
 * Viz: HashMachine — a key string enters the hash function (characters in,
 * a number out), the number selects a bucket row, and the value is there.
 * Same trip for writes and reads; a collision beat keeps it honest.
 * The payoff: O(1) lookup BY NAME, and the family name "hash map".
 */

const CODE = `const prices = { pen: 2, mug: 9, fan: 15 };

console.log(prices.mug);
console.log(prices["fan"]);

// under the hood, roughly:
//   hash("mug") → 7  →  bucket 7 holds 9`

interface View {
  keyIn: string | null
  hashOut: number | null
  /** bucket index (0-9) lit up */
  bucket: number | null
  bucketValue: string | null
  collision: boolean
  console: string[]
  note?: { text: string; color: 'teal' | 'coral' }
}

const VIEWS: View[] = [
  {
    keyIn: null, hashOut: null, bucket: null, bucketValue: null, collision: false, console: [],
    note: { text: 'arrays find by NUMBER (index math). Objects find by NAME. How do you do math on a word?', color: 'teal' },
  },
  {
    keyIn: '"mug"', hashOut: 7, bucket: null, bucketValue: null, collision: false, console: [],
    note: { text: 'a HASH FUNCTION scrambles any string into a number — same input, same number, every time', color: 'teal' },
  },
  {
    keyIn: '"mug"', hashOut: 7, bucket: 7, bucketValue: '9', collision: false, console: ['9'],
    note: { text: 'the number picks a BUCKET — and the value is sitting right there. One trip, no scanning.', color: 'teal' },
  },
  {
    keyIn: '"fan"', hashOut: 3, bucket: 3, bucketValue: '15', collision: false, console: ['9', '15'],
    note: { text: 'brackets ride the same machinery — the key’s value goes through the same hash', color: 'teal' },
  },
  {
    keyIn: '"cap"', hashOut: 7, bucket: 7, bucketValue: null, collision: true, console: ['9', '15'],
    note: { text: 'two keys CAN hash to one bucket (a collision) — the bucket keeps a small pile and checks it', color: 'coral' },
  },
  {
    keyIn: null, hashOut: null, bucket: null, bucketValue: null, collision: false, console: ['9', '15'],
    note: { text: 'this structure has a family name: a HASH MAP. You will hear it in every interview.', color: 'teal' },
  },
]

function HashMachine({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* key token */}
      <AnimatePresence mode="wait">
        {view.keyIn && (
          <motion.g key={view.keyIn} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={24} y={58} width={76} height={30} seed={721} strokeWidth={1.8} fill="var(--color-sticky)" fillStyle="solid" />
            <text x={62} y={78} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
              {view.keyIn}
            </text>
            <text x={62} y={48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
              the key
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the hash machine */}
      <RoughRect x={124} y={44} width={130} height={58} seed={722} strokeWidth={2.2} fill="var(--color-marker-yellow)" fillStyle="solid" />
      <text x={189} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
        hash function
      </text>
      <text x={189} y={86} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink-soft)">
        chars in → number out
      </text>

      {/* hash output */}
      <AnimatePresence mode="wait">
        {view.hashOut !== null && (
          <motion.g key={`h-${view.keyIn}-${view.hashOut}`} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <circle cx={294} cy={73} r={17} fill="var(--color-marker-teal)" opacity={0.85} />
            <text x={294} y={78} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
              {view.hashOut}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
      {view.keyIn && <HandArrow from={{ x: 102, y: 73 }} to={{ x: 122, y: 73 }} curve={0} seed={723} strokeWidth={2} headLength={8} />}
      {view.hashOut !== null && <HandArrow from={{ x: 256, y: 73 }} to={{ x: 275, y: 73 }} curve={0} seed={724} strokeWidth={2} headLength={8} />}

      {/* buckets */}
      <text x={24} y={132} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the buckets — numbered rows where values live
      </text>
      {Array.from({ length: 10 }, (_, b) => {
        const x = 26 + b * 39
        const lit = view.bucket === b
        return (
          <g key={b}>
            <RoughRect x={x} y={142} width={34} height={44} seed={730 + b} strokeWidth={lit ? 2.6 : 1.4} stroke={lit ? (view.collision ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)') : 'var(--color-ink-soft)'} fill={lit ? 'color-mix(in srgb, var(--color-marker-teal) 14%, transparent)' : undefined} />
            <text x={x + 17} y={200} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink-soft)">
              {b}
            </text>
            {b === 7 && (
              <text x={x + 17} y={162} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
                mug
              </text>
            )}
            {b === 7 && (
              <text x={x + 17} y={177} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
                9
              </text>
            )}
            {b === 3 && (
              <text x={x + 17} y={162} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
                fan
              </text>
            )}
            {b === 3 && (
              <text x={x + 17} y={177} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
                15
              </text>
            )}
            {b === 5 && (
              <text x={x + 17} y={162} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
                pen
              </text>
            )}
            {b === 5 && (
              <text x={x + 17} y={177} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
                2
              </text>
            )}
          </g>
        )
      })}

      {/* jump arrow from hash number to bucket */}
      {view.bucket !== null && (
        <HandArrow
          from={{ x: 294, y: 92 }}
          to={{ x: 43 + view.bucket * 39, y: 138 }}
          curve={0.18}
          seed={741}
          stroke={view.collision ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
          strokeWidth={2.4}
          headLength={10}
        />
      )}

      {/* collision pile note */}
      {view.collision && (
        <text x={306} y={168} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-marker-coral)">
          bucket 7 now holds a small
        </text>
      )}
      {view.collision && (
        <text x={306} y={184} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-marker-coral)">
          pile: mug ✓, cap ✓ — still fast
        </text>
      )}

      {/* verdict */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text key={view.note.text} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill={view.note.color === 'coral' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}>
            {view.note.text}
          </motion.text>
        )}
      </AnimatePresence>

      {/* console */}
      <RoughRect x={40} y={252} width={360} height={40} seed={742} strokeWidth={1.5} />
      <text x={52} y={248} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={277} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        <text x={58} y={277} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          {view.console.join('   ·   ')}
        </text>
      )}
    </svg>
  )
}

const PHONEBOOK_EXERCISE: CodeExerciseDef = {
  id: 'l45-phonebook',
  title: 'the same lookup, two costs',
  task: 'Feel the difference with your own hands: find Zoe’s number in an ARRAY (walk and check — the O(n) way), then in an OBJECT (one hash jump — the O(1) way).',
  steps: [
    <>
      Create <code>contacts</code>, an ARRAY of two objects: <code>{'{ name: "ana", num: 111 }'}</code>{' '}
      and <code>{'{ name: "zoe", num: 333 }'}</code>.
    </>,
    <>
      Find Zoe the array way: a variable <code>found</code> starting at <code>0</code>, a 2.6-style{' '}
      <code>for</code> loop over the array, an <code>if</code> comparing each element's{' '}
      <code>name</code> to <code>"zoe"</code> — store the matching <code>num</code>. Print{' '}
      <code>found</code>.
    </>,
    <>
      Now build <code>contactsObj</code>, an OBJECT: key <code>ana</code> → <code>111</code>, key{' '}
      <code>zoe</code> → <code>333</code>. Print Zoe's number with a single direct lookup — no
      loop.
    </>,
  ],
  starter: '',
  expectedOutput: ['333', '333'],
  mustUse: [
    { test: /for\s*\(/, label: 'the array search walks with a for loop' },
    { test: /===\s*["']zoe["']/, label: 'each element’s name is compared to "zoe"' },
    { test: /contactsObj\s*(\.\s*zoe|\[\s*["']zoe["']\s*\])/, label: 'the object answers in ONE direct lookup' },
  ],
  mustNotUse: [
    { test: /\.find\s*\(/, label: 'no .find here — walk the array yourself and feel the O(n)' },
  ],
  modelAnswer: `const contacts = [
  { name: "ana", num: 111 },
  { name: "zoe", num: 333 },
];

let found = 0;
for (let i = 0; i < contacts.length; i++) {
  if (contacts[i].name === "zoe") {
    found = contacts[i].num;
  }
}
console.log(found);

const contactsObj = { ana: 111, zoe: 333 };
console.log(contactsObj.zoe);`,
}

export const lesson45: LessonDef = {
  id: '4.5',
  hook: (
    <>
      <p>
        Lesson 4.2 explained the array's speed: an index is a <em>number</em>, and numbers do
        arithmetic — <code>start + index × size</code>, jump, done. But an object finds values by{' '}
        <strong>name</strong>: <code>prices.mug</code> answers instantly even in an object with ten
        thousand keys. And you can't multiply <code>"mug"</code> by eight. So… how?
      </p>
      <p>
        The answer is one of the great tricks of computer science:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          turn the word into a number first
        </HighlightMark>
        . A <strong>hash function</strong> scrambles any string into a number, the number picks a
        storage bucket, and lookup-by-name becomes lookup-by-number — O(1) again.
      </p>
      <p>
        The structure this builds is called a <strong>hash map</strong>, and once you see it, half
        of computing (and half of interview questions) clicks into place.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'problem',
      caption:
        'State the problem honestly. Without a trick, finding "mug" among an object’s keys would mean scanning them one by one — O(n), the climbing cost line from 4.2. Fine for 3 keys; a disaster for the 10,000-key objects real programs juggle. Objects need what arrays have: a way to COMPUTE where a thing lives.',
      highlightLines: [1],
    },
    {
      id: 'hash',
      caption:
        'Enter the hash function: a scrambler that eats any string and spits out a number. hash("mug") → 7. Two properties make it magic: it’s FAST (a quick pass over the characters), and it’s DETERMINISTIC — "mug" hashes to 7 today, tomorrow, and on your grandmother’s laptop. Same input, same number, always.',
      highlightLines: [6, 7],
    },
    {
      id: 'bucket',
      caption:
        'That number picks a BUCKET — row 7 of the object’s internal storage — and mug’s value 9 is sitting in it. Reading prices.mug re-runs the same hash: "mug" → 7 → bucket 7 → 9. One trip, zero scanning, regardless of how many other keys exist. O(1), by NAME.',
      highlightLines: [3],
    },
    {
      id: 'bracket-same',
      caption:
        'Brackets ride the exact same machinery: prices["fan"] → hash("fan") → 3 → bucket 3 → 15. And when the key arrives in a variable at runtime — 4.4’s greetings[lang] — it’s still just a string reaching the same hash. Dot and bracket differ only in WHERE the key string comes from; after that, same hash, same jump.',
      highlightLines: [4],
    },
    {
      id: 'collision',
      caption:
        'The honest wrinkle: with limited buckets, two keys sometimes hash to the SAME number — hash("cap") might also give 7. That’s a collision. The bucket simply keeps a small pile, and lookup checks the two or three things in it. Engines keep buckets so sparse that the pile is nearly always tiny — so the cost stays effectively O(1).',
      highlightLines: [6, 7],
    },
    {
      id: 'name',
      caption:
        'What you’ve just seen has a family name: a HASH MAP (also called a hash table, or a dictionary in other languages). JavaScript objects are hash maps wearing a friendly syntax. Remember the name twice over: interviewers say “use a hashmap” meaning exactly this — and in lesson 4.12 you’ll meet Map, this machinery offered as a dedicated tool.',
      highlightLines: [1],
    },
  ],
  Viz: HashMachine,
  underTheHood: (
    <>
      <p>
        The full honest picture: a hash function maps a string to a number, the number is squeezed
        into the bucket range (commonly with a remainder — <code>%</code> means “what’s left over
        after dividing”: <code>hash % bucketCount</code>), and the key AND value are stored in
        that bucket. Lookup re-hashes and jumps.
      </p>
      <p>
        Collisions put a small pile in one bucket; when piles grow, the engine quietly makes more
        buckets and re-files everything — keeping average lookup O(1).
      </p>
      <p>
        Even more honestly: V8 gives objects an extra optimization layer first (it calls them
        <em> hidden classes</em> — objects with the same property layout share a lookup shortcut),
        and falls back to true hash-map mode for objects used like dictionaries. Both roads end at
        the same promise: <strong>finding a property does not scan the keys</strong>.
      </p>
      <p>
        <strong>Fun fact:</strong> a cloakroom runs the same algorithm. You hand over your coat and
        get ticket 47; retrieval is “hook 47, walk straight there” — nobody searches the racks.
        The ticket machine is the hash function: it turns <em>you</em> (a name) into a number the
        room can jump to.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'hash("mug") gave 7 today. You restart the program and hash "mug" again tomorrow. Type the number it gives.',
      accept: ['7'],
      placeholder: 'a number…',
      why: 'Deterministic is the whole point: same input → same number, every single time. If the hash could change, nothing stored under "mug" would ever be found again.',
    },
    {
      kind: 'type-output',
      question: 'An object holds 10,000 keys. Does reading obj.zebra SCAN through the keys? Type yes or no.',
      accept: ['no', 'No', 'no!', 'NO'],
      placeholder: 'yes or no…',
      why: 'No — "zebra" is hashed to a number, the number picks a bucket, one jump. That’s why object lookup is O(1) and why objects are the right tool for lookup-by-name at any size.',
    },
    {
      kind: 'type-output',
      question: 'The array-lookup cost from 4.2 was O(1) by INDEX. Object lookup is O(1) by ___ — type the missing word.',
      accept: ['name', 'key', 'NAME', 'the name', 'the key'],
      placeholder: 'one word…',
      why: 'By NAME (the key). Arrays do arithmetic on the index; objects hash the key into a number first, then jump. Two different tricks, same flat cost line.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PHONEBOOK_EXERCISE} />,
  teachBack: {
    prompt:
      'An interviewer asks: “Why is looking up a value by key in an object O(1)? Strings aren’t numbers — what’s actually happening?” Give the full answer: hash function, buckets, collisions.',
    modelAnswer:
      'The object stores its properties in numbered buckets, and a hash function bridges words to numbers: it scrambles the key string into a number — fast, and deterministic, so "mug" always produces the same number. That number (squeezed into the bucket range) says exactly which bucket holds the value, so lookup is hash → jump → done, with no scanning of the other keys — that’s why the cost stays flat, O(1), whether the object has ten keys or ten thousand. Occasionally two keys hash to the same bucket — a collision — so the bucket keeps a tiny pile and lookup checks it; engines keep buckets sparse (making more and re-filing when piles grow), so the average stays constant. This structure is a hash map — JavaScript objects are hash maps with friendly syntax.',
  },
  recap: [
    'A hash function turns any key string into a number — fast and deterministic (same input, same number, always).',
    'The number picks a bucket where the value lives: lookup = hash → jump. O(1) by NAME, no key scanning — at any size.',
    'Collisions (two keys, one bucket) are handled with tiny per-bucket piles; the structure’s family name is a HASH MAP — Map in 4.12 is it, as a dedicated tool.',
  ],
}
