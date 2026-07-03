import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.2 — Parameters vs arguments (classic format, same as Phases 1–2)
 * Viz: a two-slot machine. Values fly into slots purely BY POSITION —
 * swapped order in, garbage out; a missing value quietly becomes undefined.
 */

const CODE = `function callOut(customer, drink) {
  console.log(customer + ", your " + drink + " is ready!");
}

callOut("Priya", "chai");
callOut("chai", "Priya");
callOut("Aisha");`

interface Scene {
  customer: string | null
  drink: string | null
  ghost: boolean
  lines: string[]
}

const SCENES: Scene[] = [
  { customer: null, drink: null, ghost: true, lines: [] }, // definition — slots don't exist yet
  { customer: '"Priya"', drink: '"chai"', ghost: false, lines: ['Priya, your chai is ready!'] },
  {
    customer: '"chai"',
    drink: '"Priya"',
    ghost: false,
    lines: ['Priya, your chai is ready!', 'chai, your Priya is ready!'],
  },
  {
    customer: '"chai"',
    drink: '"Priya"',
    ghost: false,
    lines: ['Priya, your chai is ready!', 'chai, your Priya is ready!'],
  }, // the no-error beat
  {
    customer: '"Aisha"',
    drink: 'undefined',
    ghost: false,
    lines: ['Priya, your chai is ready!', 'chai, your Priya is ready!', 'Aisha, your undefined is ready!'],
  },
  {
    customer: null,
    drink: null,
    ghost: true,
    lines: ['Priya, your chai is ready!', 'chai, your Priya is ready!', 'Aisha, your undefined is ready!'],
  }, // wrap — slots gone again
]

function Slot({ x, label, value, ghost }: { x: number; label: string; value: string | null; ghost: boolean }) {
  const isUndefined = value === 'undefined'
  return (
    <g opacity={ghost ? 0.35 : 1}>
      <text x={x + 54} y={78} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12.5} fontWeight={600} fill="var(--color-ink-soft)">
        {label}
      </text>
      <RoughRect
        x={x}
        y={86}
        width={108}
        height={40}
        seed={341 + x}
        fill={isUndefined ? 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)' : 'var(--color-paper, #fdf8ee)'}
        fillStyle="solid"
        strokeWidth={1.5}
      />
      <AnimatePresence mode="popLayout">
        {value ? (
          <motion.text
            key={value}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            x={x + 54}
            y={111}
            textAnchor="middle"
            fontFamily="var(--font-code)"
            fontSize={12.5}
            fontWeight={600}
            fill={isUndefined ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
          >
            {value}
          </motion.text>
        ) : (
          <text x={x + 54} y={111} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            empty
          </text>
        )}
      </AnimatePresence>
    </g>
  )
}

function SlotMachine({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 170" className="w-full">
        <RoughRect x={90} y={44} width={260} height={100} seed={342} fill="var(--color-sticky)" fillStyle="solid" />
        <RoughRect x={136} y={34} width={168} height={26} seed={343} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={220} y={52} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
          callOut
        </text>
        <Slot x={112} label="customer" value={scene.customer} ghost={scene.ghost} />
        <Slot x={228} label="drink" value={scene.drink} ghost={scene.ghost} />
        <text x={220} y={162} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          slot 1 · slot 2 — filled in that order, always
        </text>
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

// ── your turn: write a two-slot machine, for real ────────────────────────

const CITYTEMP_EXERCISE: CodeExerciseDef = {
  id: 'l32-citytemp',
  title: 'two slots, one trap',
  task: 'A weather announcer with two parameters — where a swapped argument produces obvious nonsense (“It is Chennai degrees in 30”). Build it so the order comes out right, twice.',
  steps: [
    <>
      A function named <code>weather</code> with TWO parameters: <code>city</code> first, then{' '}
      <code>temp</code> (a number).
    </>,
    <>
      Each call prints <code>It is &lt;temp&gt; degrees in &lt;city&gt;</code> — note the twist:
      the parameters arrive city-first, but the sentence says temp-first. You must place each slot
      where the sentence needs it, not where it arrived.
    </>,
    <>
      Two reports: Chennai at 30, then Oslo at 3 — numbers without quotes.
    </>,
  ],
  starter: '',
  expectedOutput: ['It is 30 degrees in Chennai', 'It is 3 degrees in Oslo'],
  mustUse: [
    { test: /function\s+weather\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'weather has two parameters' },
    { test: /weather\s*\(\s*["']Chennai["']\s*,\s*30\s*\)/, label: 'calls weather("Chennai", 30) — city first, number unquoted' },
    { test: /weather\s*\(\s*["']Oslo["']\s*,\s*3\s*\)/, label: 'calls weather("Oslo", 3)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']It is 3/, label: 'the sentences must be built from the slots, not typed by hand' },
  ],
  modelAnswer: `function weather(city, temp) {
  console.log("It is " + temp + " degrees in " + city);
}

weather("Chennai", 30);
weather("Oslo", 3);`,
}

const GREET_TIME_EXERCISE: CodeExerciseDef = {
  id: 'd3a-greet-time',
  title: 'a machine that decides',
  task: 'Build a greeting machine with a brain: given the hour of the day, it picks the right greeting by itself. Functions meet Phase 2’s if/else.',
  steps: [
    <>
      A function named <code>greetByTime</code> with one input slot: <code>hour</code> (a number,
      0–23).
    </>,
    <>
      For hours before 12 it prints exactly <code>Good morning!</code> — for every other hour,
      exactly <code>Good evening!</code>.
    </>,
    <>
      Prove it works by calling it for hour 9 and for hour 20 — matching the expected output
      below.
    </>,
  ],
  starter: '',
  expectedOutput: ['Good morning!', 'Good evening!'],
  mustUse: [
    { test: /function\s+greetByTime\s*\(\s*\w+\s*\)/, label: 'greetByTime is a function with one input slot' },
    { test: /if\s*\(/, label: 'the body decides with an if' },
    { test: /else/, label: 'the other path is covered' },
    { test: /greetByTime\s*\(\s*9\s*\)/, label: 'called with 9' },
    { test: /greetByTime\s*\(\s*20\s*\)/, label: 'called with 20' },
  ],
  modelAnswer: `function greetByTime(hour) {
  if (hour < 12) {
    console.log("Good morning!");
  } else {
    console.log("Good evening!");
  }
}

greetByTime(9);
greetByTime(20);`,
}

export const lesson32: LessonDef = {
  id: '3.2',
  hook: (
    <>
      <p>
        One input slot was nice — but real machines usually need several. Picture a café
        announcer: when an order is ready it shouts the customer’s name <em>and</em> their drink —{' '}
        <em>“Priya, your chai is ready!”</em>. Two pieces of information, two input slots.
      </p>
      <p>
        And with two slots comes a brand-new way to fail. Hand the machine the same two values in
        the wrong order and it happily shouts{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
          “chai, your Priya is ready!”
        </HighlightMark>{' '}
        — no error, no warning, just confident nonsense. Why? Because the machine matches values to
        slots by <strong>position, and position only</strong>. That rule — and the two words
        everyone mixes up, <em>parameter</em> and <em>argument</em> — is today’s whole lesson.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-definition',
      caption:
        'The engine reads the definition: a machine named callOut with TWO input slots, customer and drink — in that order. Nothing runs, and the slots don’t even exist yet: they get built fresh at every call, and demolished when the call ends.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'call-correct',
      caption:
        'Line 5: callOut("Priya", "chai") — the values fly into the slots BY POSITION: first value → first slot (customer), second value → second slot (drink). The body glues the sentence from the slots and the shout is exactly right.',
      highlightLines: [5],
    },
    {
      id: 'call-swapped',
      caption:
        'Line 6: same two values, opposite order — and the machine has no common sense. "chai" arrives first, so "chai" BECOMES the customer. Position is the only rule there is; the machine never reads your intentions.',
      highlightLines: [6],
    },
    {
      id: 'no-error',
      caption:
        'Read the console again: no error, anywhere. To JavaScript nothing went wrong — values arrived, slots were filled, the body ran. Wrong-order bugs are silent, which is exactly why testers get paid to catch them.',
      highlightLines: [6],
    },
    {
      id: 'call-missing',
      caption:
        'Line 7: callOut("Aisha") — two slots, one value. "Aisha" fills customer, and drink gets NOTHING… so it holds undefined, lesson 1.7’s “never set” value, glued straight into the sentence. No crash: just quiet nonsense.',
      highlightLines: [7],
    },
    {
      id: 'wrap',
      caption:
        'The vocabulary: the slot NAMES in the definition (customer, drink) are parameters. The VALUES you pass at a call ("Priya", "chai") are arguments. First argument → first parameter, always. And remember: every call got brand-new empty slots — hold that thought for lesson 3.7.',
    },
  ],
  Viz: SlotMachine,
  underTheHood: (
    <>
      <p>
        The two words everyone mixes up, now yours for good: a <strong>parameter</strong> is a
        slot’s <em>name</em>, written once in the definition — <code>customer</code>,{' '}
        <code>drink</code>. An <strong>argument</strong> is the actual <em>value</em> you drop in
        at one specific call — <code>"Priya"</code>, <code>"chai"</code>. Parameters live in the
        blueprint; arguments arrive at GO time, and they’re matched{' '}
        <strong>purely by position</strong>: first argument → first parameter, second → second.
      </p>
      <p>
        Too few arguments? No error — the leftover slot holds <code>undefined</code>, the same
        “never set” value from lesson 1.7, and the body runs with it. Too many? The extras are
        quietly ignored. Both are famous sources of sneaky bugs, because nothing crashes — the
        program just produces confident nonsense, which is exactly what automation testers get paid
        to catch.
      </p>
      <p>
        One more thing you saw without noticing: every call gets <strong>brand-new, empty
        slots</strong> — Priya’s values didn’t linger into the next call. Slots are born at the
        call and destroyed the moment it finishes. Hold onto that fact: in lesson{' '}
        <strong>3.7</strong> you’ll meet the spectacular exception — a function that walks away{' '}
        <em>still carrying its slots</em>.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'No options — type exactly what the console shows:',
      code: `function tag(animal, sound) {\n  console.log(animal + " says " + sound);\n}\n\ntag("moo", "cow");`,
      accept: ['moo says cow'],
      why: 'Position, not meaning: "moo" arrived first so it landed in the animal slot, and "cow" fell into sound. The machine happily reports that moo says cow — no error, just an argument order the caller got backwards.',
    },
    {
      kind: 'type-output',
      question: 'callOut("Aisha") — two slots, one value. Type what the drink slot holds while the body runs:',
      accept: ['undefined'],
      placeholder: 'a value…',
      why: 'undefined — the “never set” value from lesson 1.7, making its promised comeback. No error, no waiting: the body runs with it and glues it right into the sentence.',
    },
    {
      kind: 'type-output',
      question: 'In the call callOut("Priya", "chai") — is "chai" a parameter or an argument? Type the word.',
      accept: ['argument', 'an argument', 'Argument'],
      placeholder: 'parameter / argument…',
      why: 'An argument — arguments are the VALUES that arrive at call time; parameters are the slot NAMES in the definition (customer, drink). "chai" arrives second, so it’s the argument that fills the second parameter.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={CITYTEMP_EXERCISE} />
      <CodeExercise def={GREET_TIME_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'A friend asks: “parameter, argument — same thing, right?” Set them straight: explain the difference, and why callOut("chai", "Priya") comes out wrong even though both values are right there.',
    modelAnswer:
      'Not the same thing! A parameter is a slot NAME written in the machine’s blueprint — callOut has two: customer and drink. An argument is the actual VALUE you drop in when you call it, like "Priya" or "chai". The machine matches them by position only: the first argument pours into the first slot, the second into the second. That’s why callOut("chai", "Priya") goes wrong — "chai" arrives first, so it becomes the customer, and the machine shouts “chai, your Priya is ready!” with no error at all, because the machine can’t know chai isn’t a person. And if an argument is missing entirely, its slot quietly holds undefined — which is why you always check the order and count of what you pass in.',
  },
  recap: [
    'Parameter = the slot’s NAME in the definition. Argument = the VALUE you drop in at one call.',
    'Matching is pure position: first argument → first slot. The machine never guesses meaning.',
    'A slot no value arrived in holds undefined — no error, just confident nonsense in the output.',
    'Every call gets fresh empty slots, wiped after. (The spectacular exception lives in 3.7…)',
  ],
}
