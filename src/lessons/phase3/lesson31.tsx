import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.1 — What is a function? 🎬 hero lesson
 * Viz: FunctionMachine — a hand-drawn machine with an input hopper, a gear,
 * and an output chute. The key beat: DEFINING builds the machine (nothing
 * runs); CALLING drops a value in and makes it go.
 */

const CODE = `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Lijas");
greet("Ada");`

// What the machine is doing at each step.
const MACHINE: Array<{
  built: boolean
  input: string | null
  running: boolean
  output: string[]
}> = [
  { built: true, input: null, running: false, output: [] }, // definition read
  { built: true, input: null, running: false, output: [] }, // prediction
  { built: true, input: '"Lijas"', running: true, output: ['Hello, Lijas!'] },
  { built: true, input: '"Ada"', running: true, output: ['Hello, Lijas!', 'Hello, Ada!'] },
  { built: true, input: null, running: false, output: ['Hello, Lijas!', 'Hello, Ada!'] },
]

function Gear({ cx, cy, turned }: { cx: number; cy: number; turned: boolean }) {
  return (
    <motion.g
      animate={{ rotate: turned ? 150 : 0 }}
      transition={{ type: 'spring', damping: 14 }}
      style={{ originX: `${cx}px`, originY: `${cy}px` }}
    >
      <RoughEllipse cx={cx} cy={cy} width={44} height={44} seed={331} strokeWidth={2} />
      {[0, 60, 120].map((deg) => (
        <RoughLine
          key={deg}
          x1={cx + 21 * Math.cos((deg * Math.PI) / 180)}
          y1={cy + 21 * Math.sin((deg * Math.PI) / 180)}
          x2={cx - 21 * Math.cos((deg * Math.PI) / 180)}
          y2={cy - 21 * Math.sin((deg * Math.PI) / 180)}
          seed={332 + deg}
          strokeWidth={1.5}
        />
      ))}
    </motion.g>
  )
}

function FunctionMachine({ stepIndex }: { stepIndex: number }) {
  const state = MACHINE[stepIndex] ?? MACHINE[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* the machine, faded in once "built" */}
      <motion.g animate={{ opacity: state.built ? 1 : 0.25 }}>
        {/* hopper (funnel) */}
        <RoughLine x1={155} y1={38} x2={195} y2={86} seed={333} strokeWidth={2} />
        <RoughLine x1={285} y1={38} x2={245} y2={86} seed={334} strokeWidth={2} />
        <text x={330} y={50} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          input hopper
        </text>
        {/* body */}
        <RoughRect x={148} y={86} width={144} height={108} seed={335} fill="var(--color-sticky)" fillStyle="solid" />
        {/* name tape */}
        <RoughRect x={175} y={76} width={90} height={26} seed={336} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={220} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
          greet
        </text>
        {/* gear */}
        <Gear cx={220} cy={148} turned={state.running} />
        {/* parameter slot label */}
        <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
          slot: name
        </text>
        {/* output chute */}
        <RoughLine x1={292} y1={175} x2={340} y2={215} seed={337} strokeWidth={2} />
        <RoughLine x1={272} y1={192} x2={318} y2={230} seed={338} strokeWidth={2} />
        <text x={352} y={200} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          chute
        </text>
      </motion.g>

      {/* the input token dropping toward the hopper */}
      <AnimatePresence>
        {state.input && (
          <motion.g
            key={state.input}
            initial={{ x: 220, y: 8, opacity: 0 }}
            animate={{ x: 220, y: 52, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <RoughRect x={-42} y={-14} width={84} height={28} seed={339} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              {state.input}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* console strip at the bottom */}
      <RoughRect x={40} y={244} width={360} height={64} seed={340} strokeWidth={1.5} />
      <text x={52} y={240} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
        console
      </text>
      {state.output.length === 0 && (
        <text x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      )}
      {state.output.map((line, i) => (
        <motion.text
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x={58}
          y={268 + i * 20}
          fontFamily="var(--font-code)"
          fontSize={12.5}
          fill="var(--color-ink)"
        >
          {line}
        </motion.text>
      ))}
    </svg>
  )
}

export const lesson31: LessonDef = {
  id: '3.1',
  hook: (
    <>
      <p>
        In the FizzBuzz checkpoint you wrote fifteen lines of decision logic. Now imagine your
        program needs that logic in five different places. Copy-paste it five times? Then a bug is
        found… and you fix it in four places and forget the fifth. That disease has a cure, and the
        cure is the single most important idea in JavaScript: the{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          function
        </HighlightMark>{' '}
        — a machine you <em>build once</em> and <em>use forever</em>.
      </p>
      <p>
        A function is a named machine: values go in the hopper, work happens inside, something
        comes out. And here's a secret — you've been <em>using</em> these machines since your very
        first lesson. <code>console.log</code>? A function. <code>typeof</code>'s cousin{' '}
        <code>String()</code>? A function. Today you stop just using machines and start{' '}
        <strong>building</strong> them.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-definition',
      caption:
        'The engine reads lines 1–3 and does something surprising: it does NOT run the code inside the braces. It builds the machine — hopper, gears, an input slot called name — and stores the whole thing in memory under the label greet. Defining is construction, not execution.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'predict-printed',
      caption:
        'The engine has finished reading the definition and is about to move to line 5. Before pressing next — check the console strip in the picture. Think about what has printed so far.',
      highlightLines: [1, 2, 3],
      prediction: {
        question: 'The engine has read lines 1–3 (the whole function definition). What has printed to the console so far?',
        options: ['"Hello, undefined!" — the body ran with an empty slot', 'Nothing at all', 'An error — name has no value yet'],
        correctIndex: 1,
        why: 'Nothing! A definition just builds and stores the machine. The console.log inside is part of the machine\'s blueprint — it only runs when someone CALLS the machine. Defining and calling are two completely different moments. This distinction trips up more beginners than any other part of functions.',
      },
    },
    {
      id: 'first-call',
      caption:
        'Line 5: greet("Lijas") — the parentheses after the name are the "GO" button. The value "Lijas" drops into the hopper, lands in the slot called name, the gears turn, and the body finally runs: console.log("Hello, " + "Lijas" + "!"). First output!',
      highlightLines: [5],
    },
    {
      id: 'second-call',
      caption:
        'Line 6: same machine, different input. "Ada" drops into the same slot, the same body runs, a different sentence comes out. THIS is the payoff: one definition, endless calls. Fix a bug in the machine once, and every call everywhere is fixed.',
      highlightLines: [6],
    },
    {
      id: 'wrap',
      caption:
        'The anatomy, one more time: the keyword function says "machine ahead"; greet is the name label; (name) declares the input slot; the braces { } hold the body — the work. Define once (build), call many (run). Next lesson: what really happens inside that input slot.',
    },
  ],
  Viz: FunctionMachine,
  underTheHood: (
    <>
      <p>
        The proper vocabulary, worth owning: the whole recipe from <code>function</code> to the
        closing brace is called a <strong>function declaration</strong>. <code>greet</code> is its{' '}
        <strong>name</strong>, <code>name</code> is a <strong>parameter</strong> (the input
        slot — next lesson is all about these), and the code between the braces is the{' '}
        <strong>body</strong> (the work). Writing <code>greet("Lijas")</code> is called{' '}
        <strong>calling</strong> the function. The parentheses are the GO button — write the name
        without them and nothing runs.
      </p>
      <p>
        Inside the machine there are no real gears, of course. What actually happens: the engine
        saves the body's lines in memory and remembers "<code>greet</code> means this saved
        code" — the same label-on-a-box picture from Phase 1. When you call it, the engine jumps
        to the saved lines, runs them top to bottom, and jumps back to where the call was. That's
        it. And every Playwright line you'll write someday — <code>page.click()</code>,{' '}
        <code>expect()</code> — is just pressing GO on a machine someone else built.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> in 1995 Brendan
        Eich joined Netscape to put <em>Scheme</em> — a language built entirely around functions —
        into the browser. Management demanded it "look like Java" instead, so Eich kept the
        Java-ish braces but smuggled Scheme's function-loving soul inside, building the first
        version in about ten days. The syntax is a costume; underneath, functions rule.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'The engine reads a function definition (function tellJoke() { console.log("…") }). What runs at that moment?',
      options: [
        'The body runs once, as a test',
        'Nothing in the body runs — the machine is built and stored under its name',
        'The body runs every time the engine re-reads the file',
      ],
      correctIndex: 1,
      why: 'Defining is construction. The engine stores the body in memory and ties the name to it — the code inside waits, inert, until a call. If you define a function and never call it, its body never runs at all.',
    },
    {
      question: 'A function is defined once and called 3 times. How many times does its body run?',
      options: ['Once — it was only defined once', '3 times — once per call', '4 times — once at definition plus once per call'],
      correctIndex: 1,
      why: 'The body runs exactly once per CALL, never at definition. One blueprint, three button-presses, three runs. That "define once, call many" split is the entire point of functions.',
    },
    {
      question: 'You have been calling a function since lesson 0.3. Which one?',
      options: ['let — it creates variables', 'console.log — parentheses, inputs, work done: a machine', 'The = sign'],
      correctIndex: 1,
      why: 'console.log(...) has the full machine shape: a name, the call-operator parentheses, and values dropped into the hopper. let and = are keywords/operators, not functions. You were a function CALLER from day one — today you became a function BUILDER.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend what a function is, using the machine picture — and make sure you explain why defining it prints nothing, but calling it does something.',
    modelAnswer:
      'A function is a machine you build inside your program: it has a name, an input hopper, and a body of code that does the work. Writing the definition — function greet(name) { … } — only BUILDS the machine and stores it in memory under its name; none of the code inside runs yet, which is why defining prints nothing. To make it go you CALL it by writing its name with parentheses, like greet("Lijas") — that drops the value into the input slot and runs the body top to bottom. The payoff is reuse: you define the machine once, and you can call it a thousand times with different inputs. Even console.log is one of these machines — someone else built it, and we\'ve been pressing its GO button all along.',
  },
  recap: [
    'A function = a named machine: inputs → work → output. Build once, call many.',
    'Defining runs NOTHING. Only the call — name + parentheses, the GO button — runs the body.',
    'You\'ve called functions since day one: console.log is a machine someone else built.',
    'Fun fact: JS was supposed to be Scheme-in-the-browser. Eich kept Scheme\'s function-loving soul under a Java costume — built in ~10 days, May 1995.',
  ],
}
