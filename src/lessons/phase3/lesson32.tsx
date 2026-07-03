import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.2 — Parameters vs arguments
 * Viz: the FunctionMachine's two labeled slots; argument tokens fly in by
 * position at each call. Key beats: parameters are slot NAMES, arguments are
 * the VALUES dropped in, every call gets fresh slots, and a missing argument
 * quietly becomes undefined.
 */

const CODE = `function orderCoffee(drink, size) {
  console.log("One " + size + " " + drink + "!");
}

orderCoffee("latte", "large");
orderCoffee("mocha", "small");
orderCoffee("espresso");`

interface SlotState {
  drink: string | null
  size: string | null
  /** an argument token hovering above the hopper, not yet in a slot */
  hovering: string | null
  output: string[]
  note?: string
}

const SLOTS: SlotState[] = [
  { drink: null, size: null, hovering: null, output: [], note: 'slots don’t exist yet — made fresh at every call' },
  { drink: '"latte"', size: '"large"', hovering: null, output: ['One large latte!'] },
  { drink: '"mocha"', size: '"small"', hovering: null, output: ['One large latte!', 'One small mocha!'] },
  { drink: null, size: null, hovering: '"espresso"', output: ['One large latte!', 'One small mocha!'], note: 'fresh empty slots… but only ONE value arrived' },
  { drink: '"espresso"', size: 'undefined', hovering: null, output: ['One large latte!', 'One small mocha!', 'One undefined espresso!'] },
  { drink: null, size: null, hovering: null, output: ['One large latte!', 'One small mocha!', 'One undefined espresso!'] },
]

function Slot({ x, label, value, ghost }: { x: number; label: string; value: string | null; ghost: boolean }) {
  const isUndefined = value === 'undefined'
  return (
    <g>
      <text x={x + 44} y={92} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink-soft)">
        {label}
      </text>
      <g opacity={ghost ? 0.35 : 1}>
        <RoughRect
          x={x}
          y={100}
          width={88}
          height={40}
          seed={341 + x}
          fill={isUndefined ? 'color-mix(in srgb, var(--color-marker-coral) 30%, transparent)' : 'var(--color-paper, #fdf8ee)'}
          fillStyle="solid"
          strokeWidth={1.5}
        />
        <AnimatePresence mode="popLayout">
          {value && (
            <motion.text
              key={value}
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              x={x + 44}
              y={125}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={12.5}
              fontWeight={600}
              fill={isUndefined ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
            >
              {value}
            </motion.text>
          )}
        </AnimatePresence>
        {!value && (
          <text x={x + 44} y={125} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            empty
          </text>
        )}
      </g>
    </g>
  )
}

function ParamSlots({ stepIndex }: { stepIndex: number }) {
  const state = SLOTS[stepIndex] ?? SLOTS[0]
  const ghost = stepIndex === 0
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* hovering argument (call 3's lone espresso) */}
      <AnimatePresence>
        {state.hovering && (
          <motion.g
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 14 }}
          >
            <RoughRect x={172} y={14} width={96} height={26} seed={347} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={220} y={32} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {state.hovering}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* machine body */}
      <RoughRect x={100} y={56} width={240} height={110} seed={342} fill="var(--color-sticky)" fillStyle="solid" />
      <RoughRect x={144} y={46} width={152} height={26} seed={343} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={220} y={64} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        orderCoffee
      </text>

      {/* the two parameter slots, in declaration order */}
      <Slot x={122} label="drink" value={state.drink} ghost={ghost} />
      <Slot x={230} label="size" value={state.size} ghost={ghost} />

      {/* positional arrows: 1st arg → 1st slot, 2nd arg → 2nd slot */}
      <text x={166} y={182} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        1st value
      </text>
      <text x={274} y={182} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        2nd value
      </text>
      <RoughLine x1={166} y1={158} x2={166} y2={144} seed={344} strokeWidth={1.5} />
      <RoughLine x1={274} y1={158} x2={274} y2={144} seed={345} strokeWidth={1.5} />

      {state.note && (
        <text x={220} y={206} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-marker-coral)">
          {state.note}
        </text>
      )}

      {/* console strip */}
      <RoughRect x={40} y={218} width={360} height={90} seed={346} strokeWidth={1.5} />
      <text x={52} y={214} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {state.output.length === 0 && (
        <text x={220} y={266} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {state.output.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={242 + i * 21}
          fontFamily="var(--font-code)"
          fontSize={12.5}
          fill={line.includes('undefined') ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

export const lesson32: LessonDef = {
  id: '3.2',
  hook: (
    <>
      <p>
        Last lesson, <code>greet</code> had one input slot. But look at any real machine — a coffee
        machine takes a drink choice AND a cup size. Two questions decide everything:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          how does each value know which slot to land in
        </HighlightMark>
        , and what happens to those slots between calls?
      </p>
      <p>
        Two words get confused by beginners (and, honestly, by professionals in code review):{' '}
        <strong>parameters</strong> and <strong>arguments</strong>. The machine picture keeps them
        apart forever: parameters are the <em>slot names painted on the machine</em> when you build
        it; arguments are the <em>actual values you drop in</em> each time you press GO. One
        machine, fixed slot names — a thousand calls, a thousand different values.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'two-slots',
      caption:
        'The definition declares TWO parameters: drink and size, in that order. Remember — defining runs nothing. And a subtlety: right now the slots don’t even exist. Parameter slots are created brand-new at every call, and thrown away when the call finishes.',
      highlightLines: [1],
    },
    {
      id: 'call-one',
      caption:
        'Line 5: orderCoffee("latte", "large"). The matching is purely POSITIONAL: first argument → first parameter, second → second. "latte" lands in drink, "large" lands in size. The machine never guesses by meaning — swap the order and you’d get "One latte large!".',
      highlightLines: [5],
    },
    {
      id: 'call-two',
      caption:
        'Line 6: a fresh call. Notice the slots did NOT remember "latte" — the old slots were destroyed when call #1 finished, and call #2 built brand-new ones. A function’s parameters have no memory between calls. (Hold that thought: in lesson 3.7 you’ll meet a spectacular exception.)',
      highlightLines: [6],
    },
    {
      id: 'predict-missing',
      caption:
        'Line 7: orderCoffee("espresso") — one argument, but the machine has TWO slots. Before pressing next: what happens?',
      highlightLines: [7],
      prediction: {
        question: 'orderCoffee("espresso") supplies one argument for two parameters. What happens?',
        options: [
          'An error: "missing argument for size"',
          'It prints "One undefined espresso!" — the unfilled slot holds undefined',
          'It prints "One espresso!" — empty slots are skipped',
        ],
        correctIndex: 1,
        why: 'JavaScript never complains about a missing argument. The unfilled slot gets undefined — the "never set" value from lesson 1.7, doing exactly its job: this slot was never given a value. Then string-gluing coerces it to the text "undefined" (lesson 1.9’s machine at work). No error, just a quietly weird output — which is why you’ll hunt "undefined" in test failure messages for the rest of your career.',
      },
    },
    {
      id: 'reveal-missing',
      caption:
        '"espresso" fills drink (first value → first slot), and size — never filled — holds undefined. The body runs anyway: "One undefined espresso!". No crash. JavaScript trusts you completely about argument counts; that trust is famous for producing sneaky bugs.',
      highlightLines: [7],
    },
    {
      id: 'wrap',
      caption:
        'Vocabulary, welded on: parameters live in the DEFINITION (the slot names: drink, size). Arguments live in the CALL (the values: "latte", "large"). Matching is by position. Every call gets fresh slots. Missing arguments become undefined; extra arguments are silently ignored.',
    },
  ],
  Viz: ParamSlots,
  underTheHood: (
    <>
      <p>
        What really happens at a call, in order: first, the engine works out the value of each
        argument — so in <code>orderCoffee("mo" + "cha", "small")</code>, the gluing happens{' '}
        <em>before</em> anything is dropped in. Second, it creates brand-new slots, one per
        parameter. Third, it fills them by position. The slots behave exactly like{' '}
        <code>let</code> variables that only exist inside the body — and when the call ends,
        they're thrown away.
      </p>
      <p>
        Why this matters for your future job: <code>page.fill("#email", "test@site.com")</code>{' '}
        means "find the box called #email, type test@site.com into it." Swap the two arguments
        and JavaScript won't complain at all — Playwright will just hunt for a box called
        test@site.com and fail. Because matching is only by position, putting arguments in the
        wrong order is a <em>silent</em> mistake. Double-check the order; the machine never will.
      </p>
      <p>
        By the way, this vocabulary is older than JavaScript itself — programmers were saying
        "parameters" for the slots and "arguments" for the values back in 1960, and the words
        haven't changed since.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'In function add(a, b) { … } and the call add(2, 3) — which words name the PARAMETERS?',
      options: ['2 and 3', 'a and b', 'add'],
      correctIndex: 1,
      why: 'Parameters are the slot names in the definition: a and b. The values 2 and 3 are the arguments — what you drop in at call time. add is just the machine’s name.',
    },
    {
      question: 'function label(name, count) { … } is called as label(7, "screws"). What lands where?',
      options: [
        'The machine matches by meaning: "screws" → name, 7 → count',
        'Purely by position: 7 → name, "screws" → count — even though it looks backwards',
        'An error — the types don’t match the slot names',
      ],
      correctIndex: 1,
      why: 'Matching is positional, always: first argument into first parameter. JavaScript neither reads slot names for meaning nor checks types — 7 lands in name without complaint. Swapped-argument bugs are silent, which is exactly why they’re dangerous.',
    },
    {
      question: 'A function has 2 parameters but is called with 3 arguments. What happens to the third?',
      options: ['A TypeError: too many arguments', 'It is silently ignored — no slot, no error', 'It overwrites the second slot'],
      correctIndex: 1,
      why: 'Extras are evaluated and then dropped on the floor. JavaScript polices neither too-few (→ undefined) nor too-many (→ ignored). The machine has exactly the slots it declared — everything else passes through without a sound.',
    },
  ],
  teachBack: {
    prompt:
      'Explain the difference between parameters and arguments to a friend, and what happens when a call supplies too few or too many arguments.',
    modelAnswer:
      'Parameters are the slot names written on the machine when you define it — in function orderCoffee(drink, size), the parameters are drink and size, and they never change. Arguments are the actual values you drop into those slots each time you call it — "latte" and "large" one call, "mocha" and "small" the next. Values land by position: first argument into first slot. The slots are created fresh at every call and destroyed after, so the machine remembers nothing between calls. If you pass too few arguments, the unfilled slots hold undefined — no error, just a quietly odd result. Too many, and the extras are silently ignored. JavaScript never checks the count, so argument mistakes fail silently — that’s why you double-check argument order instead of trusting the machine to complain.',
  },
  recap: [
    'Parameters = slot names in the DEFINITION. Arguments = values in the CALL. Matching is by position, always.',
    'Every call builds fresh slots and destroys them after — parameters have no memory between calls.',
    'Too few arguments → undefined in the leftover slots. Too many → silently ignored. No errors either way.',
  ],
}
