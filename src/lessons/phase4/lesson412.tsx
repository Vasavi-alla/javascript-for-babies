import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 4.12 — Map, Set & JSON
 * Set = the uniqueness machine (4.5's hash machinery guarding the door);
 * Map = the hash map as a dedicated tool, keys of ANY type;
 * JSON = objects flattened to text for the wire — stringify out, parse back.
 * The bridge lesson to every API your tests will ever read.
 */

const CODE = `const seen = new Set(["ana", "ben", "ana"]);
console.log(seen.size);
console.log(seen.has("ben"));

const votes = new Map();
votes.set("pizza", 3);
votes.set(7, "lucky");
console.log(votes.get(7));

const order = { id: 7, items: ["mug", "pen"] };
const text = JSON.stringify(order);
console.log(text);

const back = JSON.parse(text);
console.log(back.items[1]);`

interface View {
  mode: 'set' | 'map' | 'stringify' | 'parse'
  rejected?: boolean
  console: string[]
  note: string
}

const VIEWS: View[] = [
  { mode: 'set', console: [], note: 'a Set stores each value ONCE — the duplicate "ana" is absorbed at the door' },
  { mode: 'set', rejected: true, console: ['2', 'true'], note: '.size counts uniques; .has answers in O(1) — 4.5’s hash machinery guards the door' },
  { mode: 'map', console: ['2', 'true'], note: 'object keys become strings — a Map’s keys keep their true type: 7 stays a number' },
  { mode: 'map', console: ['2', 'true', 'lucky'], note: 'set / get / size — the 4.5 hash map, offered as a dedicated tool' },
  { mode: 'stringify', console: ['2', 'true', 'lucky', '{"id":7,"items":["mug","pen"]}'], note: 'stringify flattens a heap object into pure TEXT — the only thing wires and files can carry' },
  { mode: 'parse', console: ['{"id":7,"items":["mug","pen"]}', 'pen'], note: 'parse rebuilds a BRAND-NEW object from the text — fresh addresses, a reconstruction' },
]

function JsonWire({ stepIndex }: { stepIndex: number }) {
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

      {(view.mode === 'stringify' || view.mode === 'parse') && (
        <g>
          {/* object side */}
          <RoughRect x={30} y={56} width={140} height={80} seed={801} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
          <text x={38} y={50} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            {view.mode === 'parse' ? 'back — a NEW object' : 'order — an object in the heap'}
          </text>
          <text x={44} y={84} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">id: 7</text>
          <text x={44} y={106} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">items: ➝ ["mug","pen"]</text>

          {/* the ribbon */}
          <motion.g key={view.mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RoughRect x={30} y={176} width={384} height={34} seed={802} strokeWidth={1.8} stroke="var(--color-pencil-blue)" />
            <text x={222} y={198} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
              {'{"id":7,"items":["mug","pen"]}'}
            </text>
            <text x={38} y={170} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-pencil-blue)">
              pure text — every character just a character
            </text>
          </motion.g>

          {view.mode === 'stringify' ? (
            <HandArrow from={{ x: 110, y: 140 }} to={{ x: 130, y: 172 }} curve={0.15} seed={803} stroke="var(--color-marker-teal)" strokeWidth={2.4} headLength={10} />
          ) : (
            <HandArrow from={{ x: 130, y: 172 }} to={{ x: 110, y: 140 }} curve={-0.15} seed={804} stroke="var(--color-marker-coral)" strokeWidth={2.4} headLength={10} />
          )}
          <text x={250} y={130} fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill={view.mode === 'stringify' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
            {view.mode === 'stringify' ? 'JSON.stringify — flatten ↓' : 'JSON.parse — rebuild ↑'}
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
  title: 'count the crowd, ship the report',
  task: 'An event scanner logs every badge tap — including people tapping twice. Count the UNIQUE visitors, then package the result as JSON text ready to send to a server.',
  steps: [
    <>
      Start with <code>checkins</code> = <code>["mia", "raj", "mia", "raj", "zoe"]</code>.
    </>,
    <>
      Build the structure that keeps each name once, call it <code>unique</code>, and print how
      many people actually came.
    </>,
    <>
      Build the report: turn the object <code>{'{ count: …, ok: true }'}</code> into a JSON string
      — where <code>count</code> comes <em>from your structure</em>, not your keyboard — and print
      it.
    </>,
  ],
  starter: '',
  expectedOutput: ['3', '{"count":3,"ok":true}'],
  mustUse: [
    { test: /new\s+Set\s*\(/, label: 'uniqueness is a Set’s job' },
    { test: /\w+\.size/, label: 'the count comes from .size' },
    { test: /JSON\.stringify\s*\(/, label: 'the report is JSON.stringify-ed' },
  ],
  mustNotUse: [
    { test: /count\s*:\s*3/, label: 'no hand-typed 3 — the Set must produce the count' },
  ],
  modelAnswer: `const checkins = ["mia", "raj", "mia", "raj", "zoe"];

const unique = new Set(checkins);
console.log(unique.size);

const payload = JSON.stringify({ count: unique.size, ok: true });
console.log(payload);`,
}

export const lesson412: LessonDef = {
  id: '4.12',
  hook: (
    <>
      <p>
        Two honest limits have been hiding in plain sight. Arrays happily hold duplicates — ask
        "how many <em>unique</em> visitors?" and you're writing a loop with checks. And object
        keys are <em>always strings</em> (4.5 hashed strings, remember) — try to use the number{' '}
        <code>7</code> or a whole object as a key, and it gets quietly converted to text.
      </p>
      <p>
        JavaScript ships two purpose-built collections for exactly these gaps —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Set (each value once) and Map (keys of any type)
        </HighlightMark>{' '}
        — both running on 4.5's hash machinery. And then the bridge out of your program entirely:{' '}
        <strong>JSON</strong>, the text format that carries objects across networks and into files
        — the format every API your future tests talk to speaks.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'set',
      caption:
        'new Set([...]) feeds the array through a door with one rule: already inside? Then you don’t come in again. Three names go in, the second "ana" bounces off, and the Set holds two values. No duplicates, ever — that’s the whole contract.',
      highlightLines: [1],
    },
    {
      id: 'set-ops',
      caption:
        'seen.size → 2 (uniques only). seen.has("ben") → true — and that check is O(1), because behind the door is 4.5’s hash machinery: hash the value, jump to its bucket, see if it’s there. Sets also offer add() and delete(). The pattern to remember: “have I seen this before?” at any scale = Set.',
      highlightLines: [2, 3],
    },
    {
      id: 'map-why',
      caption:
        'Now the object limit. In lesson 4.4 keys were strings — always. Write shoppingCart[7] and the 7 becomes "7"; use an object as a key and it becomes the useless text "[object Object]". A Map removes the limit: votes.set(7, "lucky") stores the NUMBER 7 as a genuine key. Any type works — numbers, objects, anything.',
      highlightLines: [5, 6, 7],
    },
    {
      id: 'map-ops',
      caption:
        'The Map API says its intentions out loud: set(key, value), get(key) → the value, plus .size and .has like Set. votes.get(7) → "lucky". Rule of thumb: a fixed record with known named fields → plain object (4.4); a lookup table that grows and shrinks at runtime, or needs non-string keys → Map. Same O(1) hash lookups either way.',
      highlightLines: [8],
    },
    {
      id: 'stringify',
      caption:
        'Now leave the program. Your order object lives in the heap — addresses, arrows, engine internals. A network wire or a file can carry none of that; they carry TEXT. JSON.stringify(order) flattens the whole object — nested array included — into one string: {"id":7,"items":["mug","pen"]}. Note the dialect: every key in double quotes, no functions, no undefined. It LOOKS like code, but it’s just characters now.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'parse',
      caption:
        'JSON.parse(text) is the return trip: it reads the characters and builds a BRAND-NEW object — new heap addresses, fresh arrows (back === order would be false; 4.7 nods). back.items[1] → "pen": fully usable data again. stringify to send or save, parse to receive or load. Every API response your Playwright tests will ever read arrives as JSON text and goes through exactly this parse.',
      highlightLines: [14, 15],
    },
  ],
  Viz: JsonWire,
  underTheHood: (
    <>
      <p>
        JSON (JavaScript Object Notation) is a <em>stricter dialect</em> than JS literal syntax:
        keys must be double-quoted, strings double-quoted, and only objects, arrays, strings,
        numbers, booleans and <code>null</code> exist. <code>undefined</code>, functions and dates
        don't survive the trip (dates become plain strings) — which is exactly why the old{' '}
        <code>JSON.parse(JSON.stringify(x))</code> deep-copy trick from 4.7 is lossy.
      </p>
      <p>
        It stopped being "JavaScript's format" long ago: Python, Java, databases, and every REST
        API speak it. When lesson 9.7 has you <code>fetch</code> an API from a Node script and
        Phase 11 has you assert on API responses, the payload will be JSON text and{' '}
        <code>parse</code>/<code>stringify</code> will be the door in and out.
      </p>
      <p>
        <strong>Fun fact:</strong> this very notebook runs on it. Your streak, your finished
        lessons, your journal — one object, <code>JSON.stringify</code>-ed into your browser's
        localStorage after every change. Open DevTools → Application → Local Storage and you can
        read your own progress as JSON, right now.
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
      question: 'Type the exact string this prints (every character counts):',
      code: 'console.log(JSON.stringify({ a: 1 }));',
      accept: ['{"a":1}'],
      placeholder: 'type the console output…',
      why: 'JSON’s dialect: the key gets double quotes, no spaces are added — {"a":1}. If you typed {a:1}, that’s JS literal syntax, not JSON; the quoted key is the tell.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: "const o = JSON.parse('{\"n\":5}');\nconsole.log(o.n + 1);",
      accept: ['6'],
      placeholder: 'type the console output…',
      why: 'parse rebuilt a real object from the text, so o.n is the number 5 and o.n + 1 is 6. After parse, it’s ordinary data again — dot access, math, everything.',
    },
  ],
  PlayExtra: () => <CodeExercise def={CHECKIN_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: when would you reach for a Set instead of an array, a Map instead of a plain object — and what do JSON.stringify and JSON.parse actually do to your data?',
    modelAnswer:
      'Set: when each value must exist once — dedupe a list, or ask "have I seen this before?" — it refuses duplicates at the door and .has answers in O(1) via hashing. Map: when I need a lookup table whose keys aren’t strings (object keys always become strings — Map keeps a number 7 as a real 7) or that grows/shrinks at runtime; plain objects stay best for fixed records with named fields. JSON.stringify flattens an object — nested parts included — into pure text in a strict dialect (double-quoted keys; no functions or undefined), because networks and files can only carry text. JSON.parse does the reverse: reads the text and builds a brand-new object with fresh references. Send and save with stringify; receive and load with parse — every API response arrives as JSON text.',
  },
  recap: [
    'Set = each value once; .has/.add in O(1) (hash door). The “unique visitors / seen before?” tool.',
    'Map = a hash map with keys of ANY type (object keys are always strings). set/get/size. Fixed named record → object; runtime lookup table → Map.',
    'JSON.stringify: object → strict text (double-quoted keys; no undefined/functions). JSON.parse: text → brand-new object. The wire format of every API.',
  ],
}
