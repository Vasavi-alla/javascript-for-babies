import { AnimatePresence, motion } from 'motion/react'
import { RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { StickyNote } from '../../design/StickyNote'
import { ConsolePane } from '../../design/ConsolePane'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 3.1 — What is a function? 🎬 hero lesson (classic format, same as Phases 1–2)
 * Viz: an assembly line where the work is VISIBLE — a value rides the belt in
 * through the input window, the workbench glues "Hello, " + value + "!", and
 * the finished sentence rides out to the console. Key beat: DEFINING builds
 * the machine (nothing runs); CALLING makes it go.
 */

const CODE = `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Sam");
greet("Maya");`

interface Scene {
  input: string | null
  output: string | null
  lines: string[]
}

const SCENES: Scene[] = [
  { input: null, output: null, lines: [] }, // definition read — machine built
  { input: null, output: null, lines: [] }, // the nothing-printed beat
  { input: '"Sam"', output: 'Hello, Sam!', lines: ['Hello, Sam!'] },
  { input: '"Maya"', output: 'Hello, Maya!', lines: ['Hello, Sam!', 'Hello, Maya!'] },
  { input: null, output: null, lines: ['Hello, Sam!', 'Hello, Maya!'] }, // anatomy wrap
]

/** One puzzle piece on the workbench. */
function Piece({ x, w, text, teal, dashed }: { x: number; w: number; text: string; teal?: boolean; dashed?: boolean }) {
  return (
    <g>
      <RoughRect
        x={x}
        y={88}
        width={w}
        height={26}
        seed={410 + x}
        fill={teal ? 'var(--color-marker-teal)' : 'var(--color-paper, #fdf8ee)'}
        fillStyle="solid"
        strokeWidth={1.2}
        roughness={dashed ? 2.2 : 1.2}
      />
      <text
        x={x + w / 2}
        y={105}
        textAnchor="middle"
        fontFamily="var(--font-code)"
        fontSize={11}
        fontWeight={600}
        fill={dashed ? 'var(--color-ink-soft)' : 'var(--color-ink)'}
      >
        {text}
      </text>
    </g>
  )
}

function GreetMachine({ stepIndex }: { stepIndex: number }) {
  const scene = SCENES[stepIndex] ?? SCENES[0]
  const working = scene.input !== null
  return (
    <div className="flex flex-col gap-3 p-2">
      <svg viewBox="0 0 470 215" className="w-full">
        {/* the belt: in on the left, out on the right */}
        <RoughLine x1={10} y1={150} x2={92} y2={150} seed={401} strokeWidth={2} />
        <RoughLine x1={84} y1={144} x2={94} y2={150} seed={402} strokeWidth={2} />
        <RoughLine x1={84} y1={156} x2={94} y2={150} seed={403} strokeWidth={2} />
        <text x={8} y={196} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          values ride in →
        </text>
        <RoughLine x1={352} y1={150} x2={448} y2={150} seed={404} strokeWidth={2} />
        <RoughLine x1={440} y1={144} x2={450} y2={150} seed={405} strokeWidth={2} />
        <RoughLine x1={440} y1={156} x2={450} y2={150} seed={406} strokeWidth={2} />
        <text x={340} y={196} fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
          → result rides out
        </text>

        {/* the machine housing */}
        <RoughRect x={102} y={44} width={262} height={130} seed={407} fill="var(--color-sticky)" fillStyle="solid" />

        {/* the name tape */}
        <RoughRect x={173} y={46} width={120} height={26} seed={408} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
        <text x={233} y={64} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
          greet
        </text>

        {/* the input window on the left wall */}
        <RoughRect x={96} y={132} width={48} height={36} seed={409} fill="var(--color-paper, #fdf8ee)" fillStyle="solid" strokeWidth={1.5} />
        <text x={120} y={126} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink-soft)">
          in: name
        </text>

        {/* the workbench — the sentence being glued, visibly */}
        <text x={160} y={82} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          the work: glue the sentence
        </text>
        <Piece x={158} w={62} text={'"Hello, "'} />
        {working ? (
          <motion.g key={scene.input} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ originX: '256px', originY: '101px' }}>
            <Piece x={224} w={64} text={scene.input ?? ''} teal />
          </motion.g>
        ) : (
          <Piece x={224} w={64} text="name" dashed />
        )}
        <Piece x={292} w={28} text={'"!"'} />

        {/* a value riding the belt into the input window */}
        <AnimatePresence>
          {scene.input && (
            <motion.g
              key={scene.input}
              initial={{ x: -95, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <RoughRect x={78} y={136} width={84} height={28} seed={411} fill="var(--color-marker-teal)" fillStyle="solid" strokeWidth={1.5} />
              <text x={120} y={155} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
                {scene.input}
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the finished sentence riding out */}
        <AnimatePresence>
          {scene.output && (
            <motion.g
              key={scene.output}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 16 }}
            >
              <RoughRect x={342} y={124} width={120} height={26} seed={412} fill="var(--color-marker-yellow)" fillStyle="solid" strokeWidth={1.5} />
              <text x={402} y={141} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={600} fill="var(--color-ink)">
                {scene.output}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      <ConsolePane lines={scene.lines} />
    </div>
  )
}

// ── your turn: write a whole machine, for real ───────────────────────────

const WELCOME_EXERCISE: CodeExerciseDef = {
  id: 'l31-welcome',
  title: 'build a machine from scratch',
  task: 'You watched greet get built — now build your own greeting machine, with your own fingers. Press RUN and it really executes.',
  steps: [
    <>
      A function named <code>welcome</code> with one input slot: <code>name</code>.
    </>,
    <>
      Each call prints <code>Welcome, &lt;name&gt;!</code> — built from whatever is in the slot,
      matching the expected output <em>exactly</em> (mind the comma, the space, the{' '}
      <code>!</code>).
    </>,
    <>
      Prove it works: one call for <code>"Ida"</code>, one for <code>"Omar"</code>, in that order.
    </>,
  ],
  starter: '// build the welcome machine here\n\n\n// then call it for "Ida" and for "Omar"\n',
  expectedOutput: ['Welcome, Ida!', 'Welcome, Omar!'],
  mustUse: [
    { test: /function\s+welcome\s*\(\s*\w+\s*\)/, label: 'defines a function named welcome with one input slot' },
    { test: /welcome\s*\(\s*["']Ida["']\s*\)/, label: 'calls welcome("Ida")' },
    { test: /welcome\s*\(\s*["']Omar["']\s*\)/, label: 'calls welcome("Omar")' },
  ],
  mustNotUse: [
    {
      test: /console\.log\s*\(\s*["']Welcome, (Ida|Omar)/,
      label: 'no typing the finished sentences by hand — the machine must build them from its slot',
    },
  ],
  modelAnswer: `function welcome(name) {
  console.log("Welcome, " + name + "!");
}

welcome("Ida");
welcome("Omar");`,
}

const REPEATED = ['Sam', 'Maya', 'Priya']

export const lesson31: LessonDef = {
  id: '3.1',
  hook: (
    <>
      <p>
        Imagine your program greets visitors. Sam arrives — you write a line that prints{' '}
        <em>“Hello Sam, very good morning!”</em>. Maya arrives — you write the whole line again.
        Then Priya. A hundred visitors, a hundred nearly identical lines:
      </p>
      <div className="flex flex-wrap items-start gap-3">
        {REPEATED.map((visitor) => (
          <StickyNote id={`l31-note-${visitor}`} key={visitor} className="max-w-56">
            <p className="text-[15px]">
              Hello{' '}
              <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 40%, transparent)">
                {visitor}
              </HighlightMark>
              , very good morning!
            </p>
          </StickyNote>
        ))}
      </div>
      <p>
        Everything except <em>one word</em> is identical. That feeling — “I’m writing the same
        thing again and again with one tiny change” — is the exact signal that a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          function
        </HighlightMark>{' '}
        should exist: a machine you <em>build once</em> and <em>use forever</em>. Programmers even
        have a rule about it — <strong>DRY: Don’t Repeat Yourself</strong>. And you’ve been{' '}
        <em>using</em> such machines since your very first lesson: <code>console.log</code> is one.
        Today you stop just pressing other people’s buttons and start <strong>building</strong>.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-definition',
      caption:
        'The engine reads lines 1–3 and does something surprising: it does NOT run the code inside the braces. It builds the machine — the name tape greet, an input window called name, and a workbench that will glue "Hello, " + name + "!" — and stores the whole thing in memory. Defining is construction, not execution.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'nothing-printed',
      caption:
        'Look at the console: nothing. Not one letter. The console.log inside is part of the machine’s blueprint — it only runs when someone CALLS the machine. Defining and calling are two completely different moments; this distinction trips up more beginners than any other part of functions.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'first-call',
      caption:
        'Line 5: greet("Sam") — the parentheses after the name are the GO button. "Sam" rides the belt into the input window, becomes the slot’s value, the workbench glues the sentence, and the result rides out to the console. First output!',
      highlightLines: [5],
    },
    {
      id: 'second-call',
      caption:
        'Line 6: same machine, different input. "Maya" enters the same window, the same workbench runs, a different sentence comes out. THIS is the payoff: one definition, endless calls — and if you ever fix a bug inside the machine, every call everywhere is fixed at once.',
      highlightLines: [6],
    },
    {
      id: 'wrap',
      caption:
        'The anatomy, one more time: the keyword function says “machine ahead”; greet is the name label; (name) declares the input window; the braces { } hold the body — the work. Define once (build), call many (run). Next lesson: machines with TWO input slots — and why their order matters.',
    },
  ],
  Viz: GreetMachine,
  underTheHood: (
    <>
      <p>
        The proper vocabulary, worth owning: the whole recipe from <code>function</code> to the
        closing brace is a <strong>function declaration</strong>. <code>greet</code> is its{' '}
        <strong>name</strong>, <code>name</code> is a <strong>parameter</strong> (the input slot —
        next lesson is all about these), and the code between the braces is the{' '}
        <strong>body</strong> — the work. Writing <code>greet("Sam")</code> is called{' '}
        <strong>calling</strong> the function; the parentheses are the GO button, and without them
        nothing runs.
      </p>
      <p>
        Inside there’s no real belt, of course. What actually happens: the engine saves the body’s
        lines in memory and remembers “<code>greet</code> means this saved code” — the same
        label-on-a-box picture from Phase 1, with <em>code</em> in the box. A call makes the engine
        jump to the saved lines, run them top to bottom, and jump back to where the call was.
        That’s the entire trick — and every Playwright line you’ll write someday,{' '}
        <code>page.click()</code>, <code>expect()</code>, is pressing GO on a machine someone else
        built.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> in 1995 Brendan
        Eich joined Netscape to put <em>Scheme</em> — a language built entirely around functions —
        into the browser. Management demanded it “look like Java,” so Eich kept the Java-ish braces
        but smuggled Scheme’s function-loving soul inside, building the first version in about ten
        days. The syntax is a costume; underneath, functions rule.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A function is defined but NOBODY ever calls it. How many times does its body run? Type the number.',
      code: 'function tellJoke() {\n  console.log("…");\n}',
      accept: ['0', 'zero'],
      placeholder: 'a number…',
      why: 'Zero — defining is construction, not execution. The engine stores the body and ties the name to it; the code inside waits, inert, until somebody calls. No call, no run. Ever.',
    },
    {
      kind: 'type-output',
      question: 'No options — type exactly what the console shows:',
      code: `function shout(word) {\n  console.log(word + "!");\n}\n\nshout("tools");`,
      accept: ['tools!'],
      why: 'The value "tools" drops into the slot called word, and the body glues a "!" onto it. (No quotes in the output — quotes live in code, not on the console.)',
    },
    {
      kind: 'type-output',
      question: 'You have been pressing one machine’s GO button since lesson 0.3. Type its full name.',
      accept: ['console.log', 'console.log()'],
      placeholder: 'the machine’s name…',
      why: 'console.log — it has the full machine shape: a name, the GO-button parentheses, and a value dropped in. Someone else built it; you were a function CALLER from day one. Today you became a BUILDER.',
    },
  ],
  PlayExtra: () => <CodeExercise def={WELCOME_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what a function is, using the machine picture — and make sure you explain why defining one prints nothing, but calling it does something.',
    modelAnswer:
      'A function is a machine you build inside your program: it has a name, an input slot, and a body of code that does the work. Writing the definition — function greet(name) { … } — only BUILDS the machine and stores it in memory under its name; none of the code inside runs yet, which is why defining prints nothing. To make it go you CALL it by writing its name with parentheses, like greet("Sam") — that drops the value into the slot and runs the body top to bottom. The payoff is reuse: build once, call a thousand times with different inputs — and fix a bug once to fix it for every call. Even console.log is such a machine; someone else built it, and we’ve been pressing its GO button since our very first lesson.',
  },
  recap: [
    'Writing the same thing over and over with one small change = a function’s job. DRY: Don’t Repeat Yourself.',
    'Four parts: the word function, a name, an input slot (parameter), and a body — the work.',
    'Defining runs NOTHING. The parentheses are the GO button: greet("Sam") runs the body with "Sam" in the slot.',
    'You’ve called functions since day one — console.log is a machine someone else built.',
  ],
}
