import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.7 — Closures 🎬 hero lesson
 * Viz: ClosureBackpack — makeCounter's frame dies, but the little returned
 * machine walks away WEARING a backpack that contains count. The
 * "spectacular exception" promised back in lesson 3.2, delivered.
 */

const CODE = `function makeCounter() {
  let count = 0;
  return function () {
    count = count + 1;
    console.log(count);
  };
}

const tick = makeCounter();
tick();
tick();`

interface Scene {
  /** is makeCounter's frame alive on the stack? */
  frame: boolean
  /** what the frame's count shows (while alive) */
  frameCount: number | null
  /** has the little machine (with backpack) walked out yet? */
  walker: boolean
  /** what the backpack's count shows */
  packCount: number
  lines: string[]
}

const SCENES: Scene[] = [
  { frame: false, frameCount: null, walker: false, packCount: 0, lines: [] }, // definition read
  { frame: true, frameCount: 0, walker: false, packCount: 0, lines: [] }, // makeCounter running, count born
  { frame: true, frameCount: 0, walker: true, packCount: 0, lines: [] }, // inner machine returned, wearing the pack
  { frame: false, frameCount: null, walker: true, packCount: 0, lines: [] }, // frame popped — count SURVIVES in the pack
  { frame: false, frameCount: null, walker: true, packCount: 1, lines: ['1'] }, // tick()
  { frame: false, frameCount: null, walker: true, packCount: 2, lines: ['1', '2'] }, // tick() again
  { frame: false, frameCount: null, walker: true, packCount: 2, lines: ['1', '2'] }, // wrap
]

function ClosureBackpack({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 440 230" className="w-full">
        {/* the stack side */}
        <text x={30} y={30} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          the call stack
        </text>
        <RoughRect x={24} y={172} width={180} height={30} seed={701} fill="var(--color-paper-shade)" fillStyle="solid" />
        <text x={114} y={192} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          global
        </text>
        <AnimatePresence>
          {scene.frame && (
            <motion.g
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -36 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <RoughRect x={34} y={112} width={160} height={52} seed={702} fill="var(--color-sticky)" fillStyle="solid" />
              <text x={48} y={132} fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">
                makeCounter()
              </text>
              <text x={48} y={150} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
                count: {scene.frameCount}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        {!scene.frame && (
          <text x={114} y={140} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            (frame gone)
          </text>
        )}

        {/* the walker: the returned machine wearing its backpack */}
        <AnimatePresence>
          {scene.walker && (
            <motion.g
              initial={{ x: -140, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              {/* the little machine */}
              <RoughRect x={268} y={96} width={104} height={72} seed={703} fill="var(--color-sticky)" fillStyle="solid" />
              <text x={320} y={124} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
                tick
              </text>
              <text x={320} y={142} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
                the returned machine
              </text>
              {/* legs */}
              <RoughLine x1={292} y1={168} x2={288} y2={192} seed={704} strokeWidth={2.2} />
              <RoughLine x1={348} y1={168} x2={352} y2={192} seed={705} strokeWidth={2.2} />
              {/* the backpack, strapped on */}
              <motion.g
                key={scene.packCount}
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                style={{ originX: '246px', originY: '120px' }}
              >
                <RoughRect x={218} y={92} width={56} height={56} seed={706} fill="var(--color-marker-teal)" fillStyle="hachure" />
                <text x={246} y={114} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink)">
                  count
                </text>
                <text x={246} y={134} textAnchor="middle" fontFamily="var(--font-code)" fontSize={15} fontWeight={700} fill="var(--color-ink)">
                  {scene.packCount}
                </text>
              </motion.g>
              <RoughEllipse cx={272} cy={104} width={26} height={12} seed={707} strokeWidth={1.6} />
              <text x={320} y={216} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
                the backpack: outer variables, alive
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

const GREETER_EXERCISE: CodeExerciseDef = {
  id: 'l37-greeter',
  title: 'build a machine that remembers',
  task: 'A factory that builds personalized greeting machines — each one remembering its own name forever, long after the factory call is gone.',
  steps: [
    <>
      A function named <code>makeGreeter</code> with one input slot: <code>name</code>. It RETURNS
      a function.
    </>,
    <>
      The returned function, when called, prints <code>Hello, &lt;name&gt;!</code> — using the
      name it remembers from its backpack.
    </>,
    <>
      Prove the memory: <code>const greetSam = makeGreeter("Sam");</code> then call{' '}
      <code>greetSam()</code> twice — same greeting both times, from a factory call that finished
      long ago.
    </>,
  ],
  starter: '',
  expectedOutput: ['Hello, Sam!', 'Hello, Sam!'],
  mustUse: [
    { test: /function\s+makeGreeter\s*\(\s*\w+\s*\)/, label: 'makeGreeter is a function with one input slot' },
    { test: /return\s+(function|\(?\s*\)?\s*=>)/, label: 'it RETURNS a function (the closure)' },
    { test: /makeGreeter\s*\(\s*["']Sam["']\s*\)/, label: 'the factory is called with "Sam"' },
    { test: /greetSam\s*\(\s*\)[\s\S]*greetSam\s*\(\s*\)/, label: 'the returned machine is called twice' },
  ],
  modelAnswer: `function makeGreeter(name) {
  return function () {
    console.log("Hello, " + name + "!");
  };
}

const greetSam = makeGreeter("Sam");
greetSam();
greetSam();`,
}

export const lesson37: LessonDef = {
  id: '3.7',
  hook: (
    <>
      <p>
        Time to pay a debt. Back in lesson 3.2 you learned that a function’s slots are{' '}
        <em>born at the call and destroyed when it ends</em> — and I promised you a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          spectacular exception
        </HighlightMark>
        . This is it. Today you meet a function that walks away from its birthplace{' '}
        <em>still carrying its variables</em> — alive, private, and remembering.
      </p>
      <p>
        Why would you want that? Think of a counter: something must remember the count between
        clicks, but nothing outside should be able to tamper with it. Scope’s one-way glass (3.5)
        gives the privacy; today’s trick gives the memory. Together they’re called a{' '}
        <strong>closure</strong> — the concept JavaScript interviewers love most, about to become
        a picture you can’t forget.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'definition',
      caption:
        'The engine stores makeCounter. Notice what its body does: it creates a variable count, and then RETURNS A FUNCTION (allowed since 3.4 — functions are values!). The inner function uses count, a variable from its birthplace.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'factory-runs',
      caption:
        'Line 9 calls makeCounter(). A frame appears on the stack with count: 0 inside — exactly like every function call you’ve seen. So far, nothing unusual.',
      highlightLines: [9],
    },
    {
      id: 'the-return',
      caption:
        'Now the magic moment: the inner function is returned and stored under the label tick. Watch it leave the factory — it steps out WEARING A BACKPACK, and inside that backpack is count. It doesn’t copy count; it keeps the living variable itself.',
      highlightLines: [3, 4, 5, 9],
    },
    {
      id: 'frame-dies',
      caption:
        'makeCounter finishes and its frame pops off the stack — by 3.2’s rule, count should be destroyed with it. But look: count is safe in the backpack. THIS is the spectacular exception: a variable outlives its function because a surviving inner function still holds it.',
      highlightLines: [9],
    },
    {
      id: 'first-tick',
      caption:
        'tick() runs the little machine. It opens its backpack, finds count (0), adds 1, prints 1, and closes the backpack with count now holding 1. No one else in the whole program can see or touch that count — scope’s one-way glass protects it.',
      highlightLines: [10],
    },
    {
      id: 'second-tick',
      caption:
        'tick() again: same machine, SAME backpack — count goes 1 → 2. The memory persists between calls. Compare with 3.2’s fresh-slots rule: parameters reset every call, but backpack variables live on. That difference is the entire power of closures.',
      highlightLines: [11],
    },
    {
      id: 'wrap',
      caption:
        'Name it: a CLOSURE is a function bundled with the variables from the place it was born. Every makeCounter() call hands out a fresh backpack — two counters never share. You’ll meet closures constantly: event handlers, Playwright helpers, and half the tools in your future — all backpacks.',
    },
  ],
  Viz: ClosureBackpack,
  underTheHood: (
    <>
      <p>
        The precise definition: a <strong>closure</strong> is a function together with its{' '}
        <strong>lexical environment</strong>. That environment is the outer variables in scope
        where the function was <em>defined</em> — not where it is called.
      </p>
      <p>
        When the engine sees an inner function referencing an outer variable, it keeps that
        variable alive. It lives on in a longer-lived memory area (the heap — Phase 4 draws it
        properly) instead of dying with the stack frame. The inner function “closes over” the
        variable — hence the name.
      </p>
      <p>
        Two facts worth engraving: closures capture the <em>variable</em>, not a snapshot of its
        value — that’s why count keeps advancing. And each call to the outer function creates a{' '}
        <em>new</em> environment: <code>makeCounter()</code> twice gives two independent counters
        with two private counts.
      </p>
      <p>
        This combination — persistent + private — is how JavaScript did “private state” for
        decades before classes got <code>#private</code> fields.
      </p>
      <p>
        <strong>💼 On the job —</strong> this is why a Playwright helper like{' '}
        <code>makeLogin(page)</code> can hand back a function that still knows its page,
        wherever the call happens. Backpacks everywhere.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what the SECOND tick() prints:',
      accept: ['2'],
      why: 'The backpack persists between calls: first tick took count from 0 to 1, the second finds it at 1 and prints 2. Same machine, same backpack, living memory.',
    },
    {
      kind: 'type-output',
      question: 'Two factories, two backpacks — type what b() prints:',
      code: 'const a = makeCounter();\nconst b = makeCounter();\n\na();\na();\nb();',
      accept: ['1'],
      why: 'Each makeCounter() call creates a FRESH environment — a’s backpack went 1, 2, but b’s backpack was born separately and starts at its own 0 → prints 1. Two counters never share.',
    },
    {
      kind: 'type-output',
      question: 'A function bundled with the outer variables from its birthplace — type the name of this concept.',
      accept: ['closure', 'a closure', 'Closure', 'closures'],
      placeholder: 'the concept…',
      why: 'A closure — the function “closes over” its outer variables, keeping them alive and private after the outer function is gone. The most asked-about concept in JavaScript interviews, and you now own the picture.',
    },
  ],
  PlayExtra: () => <CodeExercise def={GREETER_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain closures to a friend with the backpack picture — including why lesson 3.2’s "slots die with the call" rule has this exception, and why two counters from the same factory never share a count.',
    modelAnswer:
      'Normally, when a function finishes, its variables are destroyed with its stack frame — that’s 3.2’s rule. The exception: if the function RETURNS an inner function, and that inner function uses the outer variables, the inner function walks away wearing a backpack containing those variables — the living variables themselves, not copies. So makeCounter() creates count, hands back a little machine holding count in its backpack, and even after makeCounter’s frame is gone, every call to the machine opens the backpack, updates count, and remembers it for next time. Nothing outside can touch the backpack — scope’s one-way glass makes it private. And every call to the factory sews a brand-new backpack, which is why two counters made by the same factory count independently. That bundle — function plus remembered birthplace variables — is a closure.',
  },
  recap: [
    'A closure = a function wearing a backpack of the variables from where it was BORN. They stay alive after the outer call dies.',
    'The backpack holds the living variable, not a copy — that’s why count keeps advancing between calls.',
    'Every factory call sews a fresh backpack: two counters never share state. Persistent AND private.',
    'The debt from 3.2 is paid: slots die with the call — UNLESS a returned inner function carries them away.',
  ],
}
