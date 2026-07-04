import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 4.6 — Primitives vs references (THE lesson of this phase)
 * Viz: MemoryDiagram in heap mode. The stack on the left (one slot per
 * variable), the heap on the right (where objects live). Primitive slots hold
 * the value itself; object slots hold an ARROW into the heap. Copying copies
 * whatever is in the slot — the value, or the arrow. Act two replays 3.2's
 * "fresh slots per call" with the upgraded picture: call by value vs call by
 * sharing. Pays off the "const, but we changed its contents?!" tease from
 * 4.1 and 4.4.
 */

const CODE_A = `let score = 10;
let backup = score;
backup = 99;
console.log(score);

const cat = { name: "Biscuit", age: 3 };
const alias = cat;
alias.age = 4;
console.log(cat.age);`

const CODE_B = `function bump(n) {
  n = n + 1;
}

let lives = 9;
bump(lives);
console.log(lives);

function birthday(pet) {
  pet.age = pet.age + 1;
}

const dog = { age: 5 };
birthday(dog);
console.log(dog.age);`

const CODE_C = `function replace(pet) {
  pet = { age: 100 };
}

const dog2 = { age: 5 };
replace(dog2);
console.log(dog2.age);`

interface SlotV {
  name: string
  val?: string
  arrow?: boolean
  hot?: boolean
  inFrame?: boolean
  /** where this slot's arrow lands on the heap object (y) */
  arrowY?: number
  /** which heap box this slot's arrow points at — defaults to the first */
  heapTarget?: 2
}
interface View {
  slots: SlotV[]
  obj: { text: string; hot?: boolean }[] | null
  /** a second, separate heap object — only used for the reassign-param step */
  obj2?: { text: string; hot?: boolean }[] | null
  frameLabel?: string
  console: string[]
  note?: { text: string; color: 'teal' | 'coral' }
}

const VIEWS: View[] = [
  {
    slots: [{ name: 'score', val: '10' }, { name: 'backup', val: '10', hot: true }],
    obj: null,
    console: [],
    note: { text: 'copying a primitive copies the VALUE — two independent 10s', color: 'teal' },
  },
  {
    slots: [{ name: 'score', val: '10' }, { name: 'backup', val: '99', hot: true }],
    obj: null,
    console: ['10'],
    note: { text: 'backup changed; score never felt a thing', color: 'teal' },
  },
  {
    slots: [{ name: 'cat', arrow: true, arrowY: 116 }],
    obj: [{ text: 'name: "Biscuit"' }, { text: 'age: 3' }],
    console: ['10'],
    note: { text: 'the object lives in the heap — cat’s slot holds only an ARROW to it', color: 'teal' },
  },
  {
    slots: [
      { name: 'cat', arrow: true, arrowY: 112 },
      { name: 'alias', arrow: true, hot: true, arrowY: 134 },
    ],
    obj: [{ text: 'name: "Biscuit"' }, { text: 'age: 3' }],
    console: ['10'],
    note: { text: '= copied the ARROW, not the object', color: 'coral' },
  },
  {
    slots: [
      { name: 'cat', arrow: true, arrowY: 112 },
      { name: 'alias', arrow: true, hot: true, arrowY: 134 },
    ],
    obj: [{ text: 'name: "Biscuit"' }, { text: 'age: 3' }],
    console: ['10'],
    note: { text: 'count the heap boxes: still ONE — two names, one cat', color: 'coral' },
  },
  {
    slots: [
      { name: 'cat', arrow: true, arrowY: 112 },
      { name: 'alias', arrow: true, hot: true, arrowY: 134 },
    ],
    obj: [{ text: 'name: "Biscuit"' }, { text: 'age: 4', hot: true }],
    console: ['10', '4'],
    note: { text: 'the aliasing bug: change through one name, see it through the other', color: 'coral' },
  },
  {
    slots: [
      { name: 'cat', arrow: true, arrowY: 112 },
      { name: 'alias', arrow: true, hot: true, arrowY: 134 },
    ],
    obj: [{ text: 'name: "Biscuit"' }, { text: 'age: 4', hot: true }],
    console: ['10', '4'],
    note: { text: 'const locked each ARROW in place — nobody ever locked the object', color: 'coral' },
  },
  {
    slots: [
      { name: 'lives', val: '9' },
      { name: 'n', val: '9', hot: true, inFrame: true },
    ],
    obj: null,
    frameLabel: 'bump’s call frame — fresh slots per call (lesson 3.2)',
    console: [],
    note: { text: 'the fresh slot n received a COPY of the value 9', color: 'teal' },
  },
  {
    slots: [
      { name: 'lives', val: '9' },
      { name: 'n', val: '10', hot: true, inFrame: true },
    ],
    obj: null,
    frameLabel: 'bump’s call frame — fresh slots per call (lesson 3.2)',
    console: ['9'],
    note: { text: 'n became 10 in bump’s own frame — lives untouched: CALL BY VALUE', color: 'teal' },
  },
  {
    slots: [
      { name: 'dog', arrow: true, arrowY: 112 },
      { name: 'pet', arrow: true, hot: true, inFrame: true, arrowY: 134 },
    ],
    obj: [{ text: 'age: 5' }],
    frameLabel: 'birthday’s call frame',
    console: ['9'],
    note: { text: 'pet received a copy of the ARROW — one shared object', color: 'coral' },
  },
  {
    slots: [
      { name: 'dog', arrow: true, arrowY: 112 },
      { name: 'pet', arrow: true, hot: true, inFrame: true, arrowY: 134 },
    ],
    obj: [{ text: 'age: 6', hot: true }],
    frameLabel: 'birthday’s call frame',
    console: ['9', '6'],
    note: { text: 'mutation through the arrow reaches the caller: CALL BY SHARING', color: 'coral' },
  },
  {
    slots: [
      { name: 'dog2', arrow: true, arrowY: 112 },
      { name: 'pet', arrow: true, hot: true, inFrame: true, heapTarget: 2, arrowY: 236 },
    ],
    obj: [{ text: 'age: 5' }],
    obj2: [{ text: 'age: 100', hot: true }],
    frameLabel: 'replace’s call frame',
    console: [],
    note: { text: 'pet now points at a BRAND NEW object — dog2’s arrow never moved', color: 'teal' },
  },
  {
    slots: [
      { name: 'dog2', arrow: true, arrowY: 112 },
      { name: 'pet', arrow: true, hot: true, inFrame: true, heapTarget: 2, arrowY: 236 },
    ],
    obj: [{ text: 'age: 5' }],
    obj2: [{ text: 'age: 100', hot: true }],
    frameLabel: 'replace’s call frame',
    console: ['5'],
    note: { text: 'mutate THROUGH an arrow = shared · REASSIGN the arrow = local only', color: 'teal' },
  },
]

function HeapDiagram({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const frameSlots = view.slots.filter((s) => s.inFrame)
  return (
    <svg viewBox="0 0 440 330" className="w-full">
      {/* stack side */}
      <text x={24} y={38} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        the stack — one slot per variable
      </text>
      {view.slots.map((slot, i) => {
        const y = 56 + i * 52
        return (
          <motion.g key={slot.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <RoughRect
              x={24}
              y={y}
              width={128}
              height={38}
              seed={520 + i}
              strokeWidth={slot.hot ? 2.5 : 1.8}
              stroke={slot.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
              fill="var(--color-paper-raised, #fff)"
              fillStyle="solid"
            />
            <text x={32} y={y - 4} fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">
              {slot.name}
            </text>
            {slot.val && (
              <AnimatePresence mode="popLayout">
                <motion.text
                  key={slot.val}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  x={88}
                  y={y + 24}
                  textAnchor="middle"
                  fontFamily="var(--font-code)"
                  fontSize={15}
                  fontWeight={700}
                  fill="var(--color-ink)"
                >
                  {slot.val}
                </motion.text>
              </AnimatePresence>
            )}
            {slot.arrow && (
              <circle cx={140} cy={y + 19} r={4} fill={slot.hot ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} />
            )}
          </motion.g>
        )
      })}

      {/* frame around a function call's fresh slots */}
      {frameSlots.length > 0 && (
        <g>
          <RoughRect
            x={14}
            y={56 + view.slots.findIndex((s) => s.inFrame) * 52 - 14}
            width={150}
            height={frameSlots.length * 52 + 12}
            seed={531}
            strokeWidth={1.5}
            stroke="var(--color-pencil-blue)"
            roughness={2.2}
          />
          <text
            x={20}
            y={56 + view.slots.findIndex((s) => s.inFrame) * 52 + frameSlots.length * 52 + 12}
            fontFamily="var(--font-hand)"
            fontSize={12.5}
            fill="var(--color-pencil-blue)"
          >
            {view.frameLabel}
          </text>
        </g>
      )}

      {/* heap side */}
      <text x={250} y={38} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        the heap — where objects live
      </text>
      <RoughRect x={246} y={48} width={176} height={150} seed={532} strokeWidth={1.4} roughness={2.4} stroke="var(--color-ink-soft)" />
      <AnimatePresence>
        {view.obj && (
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={262} y={92} width={144} height={26 + view.obj.length * 22} seed={533} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
            <text x={270} y={88} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
              {view.obj2 ? 'two objects now, two addresses' : 'one object, at one address'}
            </text>
            {view.obj.map((line, j) => (
              <motion.text
                key={line.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={274}
                y={116 + j * 22}
                fontFamily="var(--font-code)"
                fontSize={12}
                fontWeight={line.hot ? 700 : 400}
                fill={line.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
              >
                {line.text}
              </motion.text>
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* the second heap object — only appears for the reassign-param step */}
      <AnimatePresence>
        {view.obj2 && (
          <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <RoughRect x={262} y={214} width={144} height={26 + view.obj2.length * 22} seed={536} strokeWidth={2} fill="var(--color-sticky)" fillStyle="solid" />
            <text x={270} y={210} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
              a brand-new object
            </text>
            {view.obj2.map((line, j) => (
              <motion.text
                key={line.text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                x={274}
                y={238 + j * 22}
                fontFamily="var(--font-code)"
                fontSize={12}
                fontWeight={line.hot ? 700 : 400}
                fill={line.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
              >
                {line.text}
              </motion.text>
            ))}
          </motion.g>
        )}
      </AnimatePresence>

      {/* arrows from slots into the heap */}
      {view.obj &&
        view.slots.map((slot, i) =>
          slot.arrow ? (
            <HandArrow
              key={`arrow-${slot.name}`}
              from={{ x: 146, y: 56 + i * 52 + 19 }}
              to={{ x: 262, y: slot.arrowY ?? (slot.heapTarget === 2 ? 236 : 116) }}
              curve={0.1}
              seed={540 + i}
              stroke={slot.hot ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
              strokeWidth={2.4}
              headLength={10}
            />
          ) : null,
        )}

      {/* the step's one-line verdict */}
      <AnimatePresence mode="wait">
        {view.note && (
          <motion.text
            key={view.note.text}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x={220}
            y={252}
            textAnchor="middle"
            fontFamily="var(--font-hand)"
            fontSize={15.5}
            fontWeight={700}
            fill={view.note.color === 'coral' ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
          ><WrapTspans text={view.note.text} x={220} maxPx={426} fontSize={15.5} /></motion.text>
        )}
      </AnimatePresence>

      {/* console strip */}
      <RoughRect x={40} y={268} width={360} height={48} seed={534} strokeWidth={1.5} />
      <text x={52} y={264} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        view.console.map((line, i) => (
          <motion.text
            key={`${line}-${i}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            x={58 + i * 60}
            y={296}
            fontFamily="var(--font-code)"
            fontSize={13}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {line}
          </motion.text>
        ))
      )}
    </svg>
  )
}

const SCOREBOARD_EXERCISE: CodeExerciseDef = {
  id: 'l44-scoreboard',
  title: 'one player, two names',
  task: 'A scoreboard bug hunt, in reverse: build the situation where two variables and a function parameter all reach ONE object — and prove it with an identity check.',
  steps: [
    <>
      Create an object <code>alice</code> with <code>name</code> = <code>"Alice"</code> and{' '}
      <code>score</code> = <code>10</code>.
    </>,
    <>
      Create <code>sameAlice</code> so that it points at <strong>the same object</strong> — no new
      object may be built.
    </>,
    <>
      Write a function <code>addPoints(player, points)</code> that increases the player's{' '}
      <code>score</code> by <code>points</code> — computed from the current score.
    </>,
    <>
      Call <code>addPoints</code> passing <code>sameAlice</code> and <code>5</code>. Then print{' '}
      <code>alice.score</code>, and print <code>alice === sameAlice</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['15', 'true'],
  mustUse: [
    { test: /sameAlice\s*=\s*alice\b/, label: 'sameAlice receives alice — copying the reference' },
    { test: /player\.score\s*(\+=\s*points|=\s*player\.score\s*\+\s*points)/, label: 'the score grows from its current value, by points' },
    { test: /console\.log\s*\(\s*alice\s*===\s*sameAlice\s*\)/, label: 'identity is proven with ===' },
  ],
  mustNotUse: [
    { test: /\b15\b/, label: 'no hand-typed 15 — the function must earn it' },
    { test: /sameAlice\s*=\s*\{/, label: 'sameAlice must not be a second object — copy the reference, not the shape' },
  ],
  modelAnswer: `function addPoints(player, points) {
  player.score = player.score + points;
}

const alice = { name: "Alice", score: 10 };
const sameAlice = alice;

addPoints(sameAlice, 5);

console.log(alice.score);
console.log(alice === sameAlice);`,
}

export const lesson46: LessonDef = {
  id: '4.6',
  hook: (
    <>
      <p>
        Earlier this phase you caught JavaScript doing something suspicious: <code>scores</code> was
        declared with <code>const</code>, yet <code>scores[1] = 96</code> worked. Then objects did
        it too. Today the mystery resolves — and the answer is the single most important fact in
        this phase, the one behind the <strong>#1 source of real-world JavaScript bugs</strong>.
      </p>
      <p>
        Here it is:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          a variable's slot never holds an object — it holds a reference to where the object lives
        </HighlightMark>{' '}
        (you'll see it drawn as an arrow). Numbers and strings sit <em>in</em> the slot; objects
        and arrays live elsewhere, in a region of memory called the <strong>heap</strong>, and the
        slot only points at them.
      </p>
      <p>
        Every "spooky action at a distance" bug you will ever debug — two variables mysteriously
        changing together — is this one picture.
      </p>
    </>
  ),
  code: CODE_A,
  steps: [
    {
      id: 'copy-value',
      caption:
        'Act one: primitives. score holds 10 — a number is a primitive, small enough to sit right in the slot. Line 2 copies it: backup gets its OWN 10. Two slots, two separate values. This is everything you learned in 1.3, unchanged.',
      highlightLines: [1, 2],
    },
    {
      id: 'independent',
      caption:
        'backup = 99 rewrites backup’s slot — and score’s slot is a different slot. Printing score gives 10, untouched. Copies of primitives are fully independent. Keep this boring picture in mind; the contrast is about to arrive.',
      highlightLines: [3, 4],
    },
    {
      id: 'heap',
      caption:
        'Line 6 creates an object — and watch WHERE it goes. The object itself is built in the heap, off to the right. cat’s slot on the stack holds only a REFERENCE: the object’s address, drawn as an arrow. The object could hold two properties or two thousand; cat’s slot stays one arrow, always the same size.',
      highlightLines: [6],
    },
    {
      id: 'copy-arrow',
      caption:
        'Line 7 looks exactly like line 2 — same = sign — but copying a slot copies WHAT THE SLOT HOLDS. backup got a copy of a value. alias gets a copy of the ARROW.',
      highlightLines: [7],
    },
    {
      id: 'count-the-objects',
      caption:
        'Now count the objects on the right: still ONE. Two variables, two arrows, one object. alias is not a copy of the cat — it’s a second name for the same cat.',
      highlightLines: [7],
    },
    {
      id: 'aliasing',
      caption:
        'alias.age = 4 follows alias’s arrow and changes the one object — so cat.age, following cat’s arrow to that SAME object, reads 4. Nobody touched cat, and yet cat changed: the aliasing bug, seen in daylight.',
      highlightLines: [8, 9],
    },
    {
      id: 'const-resolved',
      caption:
        'And the const mystery finally dissolves: const locks the ARROW in the slot — cat can never point elsewhere — but the object at the end of the arrow was never locked. 4.1’s scores[1] = 96 changed the object, not the arrow.',
      highlightLines: [8, 9],
    },
    {
      id: 'call-by-value',
      caption:
        'Act two: functions — new code, same picture. Lesson 3.2 taught that each call gets fresh parameter slots. Now upgrade it: the fresh slot receives a copy of WHAT THE ARGUMENT’S SLOT HOLDS. lives holds the value 9, so n gets its own copy of 9.',
      codeOverride: CODE_B,
      highlightLines: [1, 5, 6],
    },
    {
      id: 'call-by-value-proof',
      caption:
        'Inside, n becomes 10 — in bump’s own frame. lives never felt it: the console prints 9. This is CALL BY VALUE.',
      codeOverride: CODE_B,
      highlightLines: [2, 7],
    },
    {
      id: 'call-by-sharing',
      caption:
        'Pass an object and the same rule produces the opposite outcome: dog’s slot holds an ARROW, so pet’s fresh slot gets a copy of the ARROW — pointing at the caller’s one object.',
      codeOverride: CODE_B,
      highlightLines: [9, 13, 14],
    },
    {
      id: 'call-by-sharing-proof',
      caption:
        'pet.age = pet.age + 1 mutates that shared object; dog.age reads 6. This is CALL BY SHARING (you’ll often hear it loosely called call by reference). One nuance left: what if the function REASSIGNS pet itself? Watch, next.',
      codeOverride: CODE_B,
      highlightLines: [10, 15],
    },
    {
      id: 'reassign-param',
      caption:
        'replace(pet) does pet = { age: 100 } — that builds a BRAND NEW object and re-points pet’s own local arrow at it. dog2’s arrow never moved; it still points at the original { age: 5 }.',
      codeOverride: CODE_C,
      highlightLines: [1, 2, 5, 6],
    },
    {
      id: 'reassign-proof',
      caption:
        'console.log(dog2.age) proves it: 5, unchanged. Reassigning a parameter only ever redirects the function’s own copy of the arrow — it can never reach back and re-point the caller’s variable.',
      codeOverride: CODE_C,
      highlightLines: [7],
    },
  ],
  Viz: HeapDiagram,
  underTheHood: (
    <>
      <p>
        One rule runs this whole lesson: <strong>copying a slot copies what the slot holds</strong>
        . Primitives (numbers, strings, booleans, <code>null</code>, <code>undefined</code>) sit
        directly in the slot, so copies are independent.
      </p>
      <p>
        The “stack” in this lesson’s diagram is the very same stack that held your call frames
        back in lesson 3.9 — same structure, one slot per variable. This lesson just looks closer
        at what’s actually sitting <em>inside</em> each slot: a value, or an arrow.
      </p>
      <p>
        Objects and arrays live in the heap, and slots hold only their reference — so{' '}
        <code>=</code>, function arguments, even <code>push</code>-ing an object into an array,
        all copy <em>arrows</em>, never the object.
      </p>
      <p>
        Technically JavaScript is <em>always</em> call by value — it's just that for objects, the
        value being copied <strong>is the reference</strong>. That's why the polite name is{' '}
        <strong>call by sharing</strong>: caller and function share one object. Mutating through
        the parameter reaches it; reassigning the parameter only re-points the local copy.
      </p>
      <p>
        And <code>===</code> on two references asks one question: same arrow? — which is why two
        variables naming one object are <code>===</code>, and why <code>{'{} === {}'}</code> is{' '}
        <code>false</code> (two objects, two addresses — lesson 4.7 runs with this).
      </p>
      <p>
        <strong>Fun fact:</strong> you already use both models daily. Emailing someone a Word{' '}
        <em>attachment</em> is a primitive copy — they edit their copy, yours never changes.
        Sending a Google Docs <em>link</em> is a reference copy — one document, and their edits
        appear in "your" file, because it was never <em>your</em> file. Every aliasing bug is a
        Google-Docs link someone mistook for an attachment.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const team = ["Ana", "Ben"];\nconst squad = team;\nsquad.push("Cara");\nconsole.log(team.length);',
      accept: ['3'],
      placeholder: 'type the console output…',
      why: 'squad = team copied the arrow — both variables point at ONE array. squad.push grew that array, so team (same arrow, same array) counts 3. Arrays are objects: reference rules apply.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'let gold = 50;\nlet silver = gold;\nsilver = silver + 10;\nconsole.log(gold);',
      accept: ['50'],
      placeholder: 'type the console output…',
      why: 'Numbers are primitives: silver received its own copy of 50. Changing the copy can’t reach the original — gold is still 50. Same = sign as the array question, opposite outcome; the difference is what the slot held.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'function rename(user) {\n  user.name = "Zoe";\n}\n\nconst u = { name: "Mia" };\nrename(u);\nconsole.log(u.name);',
      accept: ['Zoe'],
      placeholder: 'type the console output…',
      why: 'u’s slot holds an arrow, so the parameter user got a copy of that arrow — call by sharing. user.name = "Zoe" mutated the one shared object, and the caller sees it. (Had rename done user = { name: "Zoe" } instead, u would still say Mia — reassigning only re-points the local arrow.)',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'function reset(box) {\n  box = { count: 0 };\n}\n\nconst counter = { count: 7 };\nreset(counter);\nconsole.log(counter.count);',
      accept: ['7'],
      placeholder: 'type the console output…',
      why: 'reset’s box = { count: 0 } builds a BRAND NEW object and re-points box’s own local arrow at it — counter’s arrow, back at the caller, never moves. counter.count is still 7. Compare this to the Zoe question above: mutating THROUGH the arrow (user.name = …) reaches the shared object; reassigning the arrow ITSELF does not.',
    },
  ],
  PlayExtra: () => <CodeExercise def={SCOREBOARD_EXERCISE} />,
  teachBack: {
    prompt:
      'The interview classic — a friend shows you: const a = { n: 1 }; const b = a; b.n = 2; and is horrified that a.n is now 2. Explain what b = a really copied, why const didn’t prevent any of it, and what a function could and couldn’t do if they passed a to it.',
    modelAnswer:
      'a’s slot never held the object — objects live in the heap, and the slot holds a reference (an arrow) to it. So const b = a copied the ARROW, not the object: two variables, one object, and b.n = 2 edited the single shared object that a also points at. const was never violated — const locks the arrow in the slot (you can’t re-point b at something else), but the object at the end of the arrow was never locked. Pass a to a function and the parameter receives a copy of the arrow too (call by sharing): the function CAN mutate the object (obj.n = 5 shows up everywhere), but it CANNOT re-point the caller’s variable — reassigning the parameter only moves the function’s local arrow. Primitives are the opposite: the slot holds the value itself, so every copy is independent — that’s call by value.',
  },
  recap: [
    'Slots hold primitives directly, but only REFERENCES (arrows) to objects/arrays — the objects themselves live in the heap.',
    'Copying a slot copies what it holds: primitives → independent copies; objects → two arrows, ONE object (aliasing).',
    'const locks the arrow, never the object’s contents. Functions get a copy of the arrow: they can MUTATE what you pass, never re-point your variable.',
  ],
}
