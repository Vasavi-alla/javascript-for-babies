import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.3 — return
 * Viz: the FunctionMachine's output chute. The returned value physically
 * travels back to the CALL SITE and replaces the call expression. Second act:
 * a machine with console.log but NO return — a window, not a chute — and the
 * classic "why is y undefined?!" confusion, tackled head-on.
 */

const CODE = `function double(n) {
  return n * 2;
}

let result = double(5) + 1;
console.log(result);

function shout(word) {
  console.log(word + "!");
}

let y = shout("hi");
console.log(y);`

interface Segment {
  text: string
  /** 'call' = the not-yet-replaced call, 'token' = the returned value that just landed */
  kind: 'plain' | 'call' | 'token'
}

interface View {
  name: 'double' | 'shout'
  input: string | null
  sealed: boolean
  /** value currently traveling out of the chute */
  outToken: string | null
  expr: Segment[]
  console: string[]
}

const VIEWS: View[] = [
  {
    name: 'double', input: null, sealed: false, outToken: null,
    expr: [{ text: 'let result = ', kind: 'plain' }, { text: 'double(5)', kind: 'call' }, { text: ' + 1;', kind: 'plain' }],
    console: [],
  },
  {
    name: 'double', input: '5', sealed: false, outToken: '10',
    expr: [{ text: 'let result = ', kind: 'plain' }, { text: '10', kind: 'token' }, { text: ' + 1;', kind: 'plain' }],
    console: [],
  },
  {
    name: 'double', input: null, sealed: false, outToken: null,
    expr: [{ text: 'let result = 11;', kind: 'plain' }],
    console: ['11'],
  },
  {
    name: 'shout', input: null, sealed: true, outToken: null,
    expr: [{ text: 'let y = ', kind: 'plain' }, { text: 'shout("hi")', kind: 'call' }, { text: ';', kind: 'plain' }],
    console: ['11'],
  },
  {
    name: 'shout', input: null, sealed: true, outToken: null,
    expr: [{ text: 'let y = ', kind: 'plain' }, { text: 'shout("hi")', kind: 'call' }, { text: ';', kind: 'plain' }],
    console: ['11'],
  },
  {
    name: 'shout', input: '"hi"', sealed: true, outToken: 'undefined',
    expr: [{ text: 'let y = ', kind: 'plain' }, { text: 'undefined', kind: 'token' }, { text: ';', kind: 'plain' }],
    console: ['11', 'hi!', 'undefined'],
  },
]

function ReturnChute({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const isShout = view.name === 'shout'
  return (
    <svg viewBox="0 0 440 330" className="w-full">
      {/* machine body */}
      <RoughRect x={60} y={40} width={170} height={96} seed={351} fill="var(--color-sticky)" fillStyle="solid" />
      <RoughRect x={90} y={30} width={110} height={26} seed={352} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
      <text x={145} y={48} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
        {view.name}
      </text>
      <text x={145} y={95} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {isShout ? 'console.log(word + "!")' : 'return n * 2'}
      </text>

      {/* input token */}
      <AnimatePresence>
        {view.input && (
          <motion.g
            key={view.input}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect x={118} y={106} width={54} height={22} seed={353} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={145} y={121} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={600} fill="var(--color-ink)">
              {view.input}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* chute — or the sealed wall where the chute should be */}
      {!view.sealed ? (
        <g>
          <RoughLine x1={230} y1={80} x2={295} y2={110} seed={354} strokeWidth={2} />
          <RoughLine x1={230} y1={106} x2={288} y2={132} seed={355} strokeWidth={2} />
          <text x={288} y={98} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            return chute
          </text>
        </g>
      ) : (
        <g>
          <RoughLine x1={238} y1={78} x2={262} y2={102} seed={356} strokeWidth={2.5} stroke="var(--color-marker-coral)" />
          <RoughLine x1={262} y1={78} x2={238} y2={102} seed={357} strokeWidth={2.5} stroke="var(--color-marker-coral)" />
          <text x={272} y={95} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-marker-coral)">
            no return — chute sealed
          </text>
        </g>
      )}

      {/* window: the console.log side-door on shout */}
      {isShout && (
        <g>
          <RoughRect x={72} y={140} width={110} height={24} seed={358} strokeWidth={1.5} />
          <text x={127} y={156} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            window to the human
          </text>
          <RoughLine x1={127} y1={164} x2={127} y2={228} seed={359} strokeWidth={1.5} />
        </g>
      )}

      {/* the traveling returned value */}
      <AnimatePresence>
        {view.outToken && (
          <motion.g
            key={view.outToken}
            initial={{ x: 250, y: 95, opacity: 0 }}
            animate={{ x: 330, y: 172, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
          >
            <RoughRect
              x={-40}
              y={-13}
              width={80}
              height={26}
              seed={360}
              fill={view.outToken === 'undefined' ? 'color-mix(in srgb, var(--color-marker-coral) 35%, transparent)' : 'var(--color-marker-yellow)'}
              fillStyle="solid"
              strokeWidth={1.5}
            />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
              {view.outToken}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the call site strip */}
      <RoughRect x={40} y={190} width={360} height={44} seed={361} strokeWidth={1.5} />
      <text x={52} y={186} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        the call site — where the value lands
      </text>
      <text x={220} y={217} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13}>
        {view.expr.map((seg, i) => (
          <tspan
            key={i}
            fill={seg.kind === 'token' ? 'var(--color-marker-coral)' : seg.kind === 'call' ? 'var(--color-marker-teal)' : 'var(--color-ink)'}
            fontWeight={seg.kind === 'plain' ? 400 : 700}
          >
            {seg.text}
          </tspan>
        ))}
      </text>

      {/* console strip */}
      <RoughRect x={40} y={248} width={360} height={72} seed={362} strokeWidth={1.5} />
      <text x={52} y={244} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 && (
        <text x={220} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {view.console.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={268 + i * 19}
          fontFamily="var(--font-code)"
          fontSize={12}
          fill={line === 'undefined' ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

export const lesson33: LessonDef = {
  id: '3.3',
  hook: (
    <>
      <p>
        Our <code>greet</code> machine could only shout at the console. Useful — but a real machine
        should <em>hand you something back</em>. A juicer doesn't display a picture of juice; it
        gives you juice you can pour into something else. That handing-back is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          return
        </HighlightMark>{' '}
        — the machine's output chute.
      </p>
      <p>
        And this lesson meets the single most common beginner confusion in all of JavaScript
        head-on: <strong>return is not console.log</strong>. One hands a value back to your{' '}
        <em>program</em>; the other shows a value to <em>you, the human</em>. Mixing them up
        produces the mysterious <code>undefined</code> that has haunted every beginner since 1995.
        After today, it will never haunt you.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'chute',
      caption:
        'Meet double: one slot (n), and a body whose only job is return n * 2. The keyword return names what leaves through the chute. Note there’s no console.log anywhere in this machine — it produces a value, silently.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'travel-back',
      caption:
        'Line 5 calls double(5). Inside: n is 5, n * 2 evaluates to 10, and return fires — TWO things happen at once. The machine STOPS instantly (any code below a return never runs), and the value 10 travels back to the call site, where it REPLACES the call. Watch the strip: double(5) just became 10.',
      highlightLines: [2, 5],
    },
    {
      id: 'use-it',
      caption:
        'Now line 5 is just arithmetic: 10 + 1 → 11 → stored in result. This is the superpower: because the call becomes its value, you can use calls ANYWHERE a value goes — in math, inside other calls, in an if condition. double(5) + 1 is an expression tree (lesson 1.10) with a machine as one of its leaves.',
      highlightLines: [5, 6],
    },
    {
      id: 'sealed',
      caption:
        'Now the troublemaker. shout has a console.log inside but NO return — look at the machine: the chute is sealed shut. console.log is not a chute; it’s a window. During the call, text appears on the console for the human to read — but nothing is handed back to the program.',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'predict',
      caption:
        'Line 12 stores shout’s output in y, and line 13 prints y. Before pressing next — think about what appears in the console, and in what order.',
      highlightLines: [12, 13],
      prediction: {
        question: 'let y = shout("hi"); then console.log(y); — what does the console show?',
        options: [
          '"hi!" then "hi!" — y holds what shout printed',
          '"hi!" then undefined — printing is not returning',
          'undefined then "hi!" — the assignment happens first',
        ],
        correctIndex: 1,
        why: 'During the call, shout’s console.log prints "hi!" — the window. But the machine returns nothing, so shout("hi") is replaced by undefined, and THAT lands in y. Line 13 then prints undefined. The text you saw on screen was never a value your program could hold — it went out the window, straight to your eyeballs, bypassing the program entirely.',
      },
    },
    {
      id: 'reveal',
      caption:
        'There it is: "hi!" appeared during the call (the window), then y got undefined (the sealed chute), then line 13 printed that undefined. The rule to engrave: console.log SHOWS a value to the human; return HANDS a value to the program. If you ever want to USE a function’s result — store it, add to it, test it — the function must return it.',
      highlightLines: [12, 13],
    },
  ],
  Viz: ReturnChute,
  underTheHood: (
    <>
      <p>
        The one rule to keep: wherever you write a call like <code>double(5)</code>, JavaScript
        replaces it with whatever the function hands back. And <em>every</em> call hands back
        something. Wrote no <code>return</code>? The call hands back <code>undefined</code>. Even{' '}
        <code>console.log</code> hands back <code>undefined</code> — try{' '}
        <code>console.log(console.log("hi"))</code> in your F12 console: it prints{' '}
        <code>hi</code>, then <code>undefined</code>.
      </p>
      <p>
        This idea is the heart of your future job. A test line like{' '}
        <code>expect(getTotal()).toBe(42)</code> means "run getTotal, take what it hands back,
        check it's 42" — which only works if <code>getTotal</code> <em>returns</em> its answer. A
        function that only prints its answer can't be tested this way: the text went to the
        screen, and no program can read the screen.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> the keyword is
        named after the <em>going back</em>, not the value. In Dartmouth BASIC (1964),{' '}
        <code>RETURN</code> carried no value at all — it just meant "jump back to where you came
        from" after a <code>GOSUB</code>. The value-carrying return came from the math/Lisp side
        of the family tree; modern <code>return</code> is both ancestors fused.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'function check(n) { return n > 10; console.log("checked!"); } — when does "checked!" print?',
      options: [
        'After the return delivers its value',
        'Never — return stops the function instantly; that line is unreachable',
        'Only when n > 10 is false',
      ],
      correctIndex: 1,
      why: 'return is a full stop. The instant it fires, the machine halts and the value departs — nothing below it in the function ever runs, no matter what. Editors literally gray that line out as dead code.',
    },
    {
      question: 'function mystery() { 3 + 4; } — what is the value of let a = mystery();?',
      options: ['7 — the machine computed it', 'undefined — computed, then thrown away, never returned', 'An error: nothing to assign'],
      correctIndex: 1,
      why: 'The body really does evaluate 3 + 4 to 7… and then discards it. Without return, the result never reaches the chute, so the call produces undefined. Doing work and returning work are separate acts.',
    },
    {
      question: 'What is the ONE-sentence difference between console.log and return?',
      options: [
        'console.log is faster; return is safer',
        'console.log shows a value to the human; return hands a value back to the program',
        'They are interchangeable inside functions',
      ],
      correctIndex: 1,
      why: 'The window vs the chute. Logged text goes to your eyeballs and is gone — no code can read it back. A returned value replaces the call expression, so the rest of the program can store it, add to it, or test it. This one sentence dissolves the most common beginner bug in JavaScript.',
    },
  ],
  teachBack: {
    prompt:
      'A friend writes a function that console.logs the answer, then wonders why let x = theirFunction() gives undefined. Explain the window vs chute difference — and what return actually does when it fires.',
    modelAnswer:
      'Their function shows the answer but never hands it back. console.log is a window: during the call, the value is displayed to the human and then it’s gone — the program can’t read the screen. return is the chute: when it fires, the function stops instantly, and the returned value travels back to the call site and replaces the call itself — so let x = double(5) becomes let x = 10. Their function has no return, and every call to a function with no return produces undefined — that’s what landed in x. The fix is to return the answer instead of (or as well as) logging it; then the program can store it, do math with it, or — later, in testing — assert on it.',
  },
  recap: [
    'return does two things at once: stops the machine instantly, and sends its value back to REPLACE the call expression.',
    'Every call produces a value. No return (or bare return;) → undefined. Even console.log returns undefined.',
    'console.log = window (shows the human). return = chute (hands the program). To USE a result, it must be returned.',
    'Fun fact: in Dartmouth BASIC (1964), RETURN carried no value — it just meant "jump back." The value came from the math/Lisp side of the family.',
  ],
}
