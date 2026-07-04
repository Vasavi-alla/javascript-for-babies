import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 5.8 — Error handling
 * throw = launch an Error object up the stack (return's emergency sibling);
 * the red spark falls down the CallStackTower until a catch net snags it.
 * try/catch/finally anatomy; Error as a class (5.6 pays off); the direct
 * bridge to test runners: a failing assertion IS a throw.
 */

const CODE = `function withdraw(amount) {
  if (amount > 100) {
    throw new Error("limit is 100");
  }
  return "you got " + amount;
}

try {
  console.log(withdraw(50));
  console.log(withdraw(500));
  console.log("never reached");
} catch (err) {
  console.log("caught: " + err.message);
} finally {
  console.log("receipt printed");
}`

interface View {
  stack: { label: string; hot?: boolean }[]
  spark: number | null
  netAt: number | null
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the spark/stack */
  badge?: string
}

const VIEWS: View[] = [
  {
    stack: [{ label: 'global — inside try' }, { label: 'withdraw(50)', hot: true }],
    spark: null, netAt: null,
    console: ['you got 50'],
    note: 'the happy path: withdraw returns normally, the try block continues',
  },
  {
    stack: [{ label: 'global — inside try' }, { label: 'withdraw(500)', hot: true }],
    spark: 1, netAt: null,
    console: ['you got 50'],
    note: 'throw fires: the function STOPS instantly (return’s emergency sibling) and launches an Error object — picture it as a spark, about to fall',
  },
  {
    stack: [{ label: 'global — inside try' }, { label: 'withdraw(500)', hot: true }],
    spark: 1, netAt: null,
    console: ['you got 50'],
    note: 'new Error(...) is 5.6’s class syntax in the wild',
    badge: 'err.message holds your text, err.name says "Error", err.stack carries the snapshot — the trace you learned to read in 0.5',
  },
  {
    stack: [{ label: 'global — inside try', hot: true }],
    spark: 0, netAt: null,
    console: ['you got 50'],
    note: 'the error falls DOWN the call stack: withdraw’s frame pops without returning anything, and the error keeps falling…',
  },
  {
    stack: [{ label: 'global — inside try', hot: true }],
    spark: 0, netAt: null,
    console: ['you got 50'],
    note: 'if the next frame down had no catch either, it would keep falling',
    badge: 'an UNCAUGHT error unwinds the whole tower and crashes the program — every red screen you’ve ever seen',
  },
  {
    stack: [{ label: 'global — catch (err)', hot: true }],
    spark: null, netAt: 0,
    console: ['you got 50', 'caught: limit is 100'],
    note: '…until the catch block snags it. err IS the Error object — .message, .name, .stack. Notice "never reached" was skipped entirely; execution resumes healthy INSIDE catch',
  },
  {
    stack: [{ label: 'global — finally', hot: true }],
    spark: null, netAt: null,
    console: ['you got 50', 'caught: limit is 100', 'receipt printed'],
    note: 'finally runs NO MATTER WHAT — success, catch, or even an uncaught disaster',
  },
  {
    stack: [{ label: 'global — finally', hot: true }],
    spark: null, netAt: null,
    console: ['you got 50', 'caught: limit is 100', 'receipt printed'],
    note: 'the job bridge, plainly: a failing test assertion IS a throw',
    badge: 'expect(total).toBe(42) throws an AssertionError when wrong; the runner wraps each test in try/catch, marks it red, moves on',
  },
]

function ErrorSpark({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 322" className="w-full">
      <text x={24} y={32} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the call stack (3.6’s tower) — errors travel DOWN it
      </text>
      {view.stack.map((f, i) => {
        const y = 180 - i * 56
        return (
          <motion.g key={f.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect x={70} y={y} width={220} height={44} seed={941 + i} strokeWidth={f.hot ? 2.6 : 1.8} stroke={f.hot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
            <text x={180} y={y + 27} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">{f.label}</text>
          </motion.g>
        )
      })}

      {/* the falling spark */}
      <AnimatePresence>
        {view.spark !== null && (
          <motion.g key={`spark-${view.spark}`} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 12 }}>
            <circle cx={320} cy={186 - view.spark * 56} r={13} fill="var(--color-marker-coral)" opacity={0.9} />
            <text x={320} y={191 - view.spark * 56} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff">!</text>
            <text x={342} y={190 - view.spark * 56} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-marker-coral)">
              Error("limit is 100")
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the catch net */}
      {view.netAt !== null && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RoughRect x={300} y={196 - view.netAt * 56} width={110} height={26} seed={951} strokeWidth={1.8} stroke="var(--color-marker-teal)" roughness={2.4} fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
          <text x={355} y={213 - view.netAt * 56} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">
            catch net
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={228} width={352} height={30} seed={953} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={247} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={270} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={282} width={360} height={32} seed={952} strokeWidth={1.5} />
      <text x={58} y={303} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(console: nothing yet)' : view.console.join('  ·  ')}
      </text>
    </svg>
  )
}

const DIVIDE_EXERCISE: CodeExerciseDef = {
  id: 'l58-divide',
  title: 'the division desk with a complaints window',
  task: 'Build a function that refuses impossible work by THROWING — and a caller that survives the refusal gracefully and always signs off.',
  steps: [
    <>
      A function <code>divide(a, b)</code>: if <code>b</code> is exactly <code>0</code>, THROW a
      new <code>Error</code> with the message <code>"cannot divide by zero"</code>. Otherwise
      return <code>a / b</code>.
    </>,
    <>
      In a <code>try</code>: print <code>divide(10, 2)</code>, then print{' '}
      <code>divide(5, 0)</code>.
    </>,
    <>
      In the <code>catch</code>: print the caught error's <code>.message</code> (just the
      message). In a <code>finally</code>: print <code>"done"</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['5', 'cannot divide by zero', 'done'],
  mustUse: [
    { test: /throw\s+new\s+Error\s*\(/, label: 'the refusal is thrown: throw new Error(…)' },
    { test: /try\s*\{/, label: 'the risky calls sit in a try block' },
    { test: /catch\s*\(\s*\w+\s*\)/, label: 'a catch receives the error object' },
    { test: /\.message/, label: 'the catch prints err.message' },
    { test: /finally\s*\{/, label: 'finally signs off no matter what' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']cannot divide/, label: 'the message must travel INSIDE the thrown Error, not be printed directly' },
  ],
  modelAnswer: `function divide(a, b) {
  if (b === 0) {
    throw new Error("cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 2));
  console.log(divide(5, 0));
} catch (err) {
  console.log(err.message);
} finally {
  console.log("done");
}`,
}

export const lesson58: LessonDef = {
  id: '5.8',
  hook: (
    <>
      <p>
        Lesson 0.5 taught you to <em>read</em> errors — the machine's notes asking for help. Every
        error you've met since was thrown <em>at</em> you by the engine. Today the tables turn:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          you throw them
        </HighlightMark>{' '}
        — and you catch them.
      </p>
      <p>
        Why would code deliberately crash? Because "limp onward with garbage" is worse: a{' '}
        <code>withdraw(-500)</code> that quietly proceeds corrupts an account; one that{' '}
        <code>throw</code>s stops the wrongness at its source (5.2's loud-beats-silent philosophy,
        now as a tool you wield).
      </p>
      <p>
        And here's the career secret hiding in this lesson: a failing test assertion{' '}
        <em>is a throw</em> — <code>expect</code> throws, the runner catches. You're about to learn
        the exact mechanism your future job runs on.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'happy',
      caption:
        'The try block starts running its lines normally. withdraw(50) passes the guard, returns "you got 50", printed. A try block costs nothing when nothing goes wrong — it’s just a marked stretch of road with a safety net below.',
      highlightLines: [8, 9],
    },
    {
      id: 'throw',
      caption:
        'withdraw(500) trips the guard and line 3 fires: throw new Error("limit is 100"). Two things, instantly: the function STOPS — like return’s emergency sibling, nothing below the throw runs — and an ERROR OBJECT is launched, falling toward the stack below.',
      highlightLines: [2, 3],
    },
    {
      id: 'throw-details',
      caption:
        'new Error(…) is 5.6’s class syntax in the wild: err.message holds your text, err.name says "Error", err.stack carries the snapshot of the tower — the stack trace you learned to read in 0.5, written at this very moment.',
      highlightLines: [2, 3],
    },
    {
      id: 'unwind',
      caption:
        'The launched error FALLS down the call stack: withdraw’s frame pops without returning anything.',
      highlightLines: [8, 12],
    },
    {
      id: 'uncaught-would-crash',
      caption:
        'If the next frame down had no net either, it would pop too — an UNCAUGHT error unwinds the whole tower and crashes the program (that’s every red screen you’ve ever seen). But our next frame down is the try in global…',
      highlightLines: [8, 12],
    },
    {
      id: 'catch',
      caption:
        'The catch net snags it. err is the very Error object that was thrown — read err.message for your text. Notice what did NOT happen: line 11, "never reached", was skipped — the throw abandoned the rest of the try block mid-flight. Execution resumes INSIDE catch, and after it, the program is healthy again: caught means handled.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'finally',
      caption:
        'finally runs in EVERY ending: normal success, caught error — even an uncaught one passing through on its way down. It’s the cleanup lane: close the file, stop the timer, print the receipt.',
      highlightLines: [14, 15, 16],
    },
    {
      id: 'job-bridge',
      caption:
        'The job bridge, plainly: in Phase 10, expect(total).toBe(42) THROWS an AssertionError when wrong; the test runner wraps each test in a try/catch, marks it red, and moves to the next test. One failing test not killing the suite = this lesson, industrialized.',
      highlightLines: [14, 15, 16],
    },
  ],
  Viz: ErrorSpark,
  underTheHood: (
    <>
      <p>
        Error is a class with a family tree (5.6's chains, in the wild): <code>TypeError</code>,{' '}
        <code>ReferenceError</code>, <code>SyntaxError</code> all <code>extends Error</code> —
        which is why every error you've read since 0.5 had the same shape (.name, .message,
        .stack).
      </p>
      <p>
        You can extend it too: <code>class PaymentError extends Error</code> lets a catch block
        tell YOUR errors apart with <code>instanceof</code> (5.6's chain question, earning its
        keep).
      </p>
      <p>
        Throw stops functions the way return does, but travels differently: return hands a value
        to the immediate caller; throw keeps falling <em>through</em> callers until a net appears.
      </p>
      <p>
        Catch what you can handle, let the rest keep falling — catching everything and doing
        nothing ("swallowing") turns loud bugs back into silent ones, undoing the whole point.
      </p>
      <p>
        One honest boundary: try/catch guards the <em>synchronous</em> stack. Errors born inside
        callbacks that run <em>later</em> (a setTimeout, a network reply) happen after your try has
        already finished — catching those needs Phase 6's machinery (promises carry their errors;{' '}
        <code>await</code> makes try/catch work on them again). Foreshadowed, on purpose.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Does "B" ever print? Type yes or no:',
      code: 'try {\n  throw new Error("stop");\n  console.log("B");\n} catch (e) {\n  console.log("C");\n}',
      accept: ['no', 'No', 'NO', 'no!'],
      placeholder: 'yes / no…',
      why: 'No — throw abandons the rest of the try block instantly, exactly like return abandons a function. Execution resumes in catch, which prints "C".',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'try {\n  throw new Error("oven too hot");\n} catch (e) {\n  console.log(e.message);\n}',
      accept: ['oven too hot'],
      placeholder: 'type the console output…',
      why: 'The catch receives the thrown Error OBJECT; .message holds the text you packed into it. (.name would say "Error", .stack the tower snapshot.)',
    },
    {
      kind: 'type-output',
      question: 'A try block succeeds with no error at all. Does its finally still run? Type yes or no:',
      accept: ['yes', 'Yes', 'YES', 'yes!'],
      placeholder: 'yes / no…',
      why: 'Yes — finally runs on EVERY exit: success, caught error, or an uncaught error passing through. That’s what makes it the cleanup lane you can trust.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DIVIDE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what happens from the instant `throw` fires to the moment life is normal again — the stopping, the falling, the net, the finally — and why a failing test in a big suite doesn’t crash the other tests.',
    modelAnswer:
      'throw stops the current function instantly — nothing below it runs — and launches an Error object (a real class instance carrying .message, .name and .stack, the stack snapshot taken at the throw). That object falls DOWN the call stack: each frame without protection pops unfinished, and if nothing catches it, the program crashes with the red trace. The first try whose catch net is in the fall path snags it: the rest of that try block is skipped, the catch runs with the error object in hand, and after catch the program is healthy again — caught means handled. finally runs on every exit — success, caught, or passing-through — so cleanup always happens. Test runners industrialize exactly this: expect() THROWS on a failed assertion, and the runner wraps every test in its own try/catch — the throw ends that one test, gets caught, marked red, and the suite moves on.',
  },
  recap: [
    'throw = return’s emergency sibling: stop instantly, launch an Error object (class instance: .message, .name, .stack) DOWN the stack.',
    'The first catch net in the fall path snags it — the rest of the try is skipped; caught = handled. Uncaught = the tower unwinds = crash.',
    'finally runs on EVERY exit. And the job secret: expect() throws, test runners catch per test — red tests are this machinery.',
  ],
}
