import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.5 — while loops
 * Viz: a circular road with a gate; the token laps while fuel lasts,
 * then the infinite-loop nightmare scenario.
 */

const CODE = `let fuel = 3;
while (fuel > 0) {
  console.log("Vroom! fuel: " + fuel);
  fuel = fuel - 1;
}
console.log("Out of fuel.");`

// per step: [fuel value, laps completed, exited?]
const STATE: Array<[number, number, boolean]> = [
  [3, 0, false],
  [2, 1, false],
  [0, 3, false],
  [0, 3, true],
  [0, 3, true], // prediction
  [0, 3, true],
]

function WhileTrack({ stepIndex }: { stepIndex: number }) {
  const [fuel, laps, exited] = STATE[stepIndex] ?? STATE[0]
  const infinite = stepIndex >= 5
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* the circular road */}
      <RoughEllipse cx={200} cy={150} width={260} height={180} seed={430} strokeWidth={2.5} fill="none" />
      {/* the gate */}
      <RoughEllipse cx={200} cy={60} width={150} height={46} seed={431} fill={infinite ? 'var(--color-marker-coral)' : 'var(--color-sticky)'} fillStyle="solid" />
      <text x={200} y={66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
        fuel &gt; 0 ?
      </text>
      {/* the body */}
      <RoughRect x={115} y={210} width={170} height={44} seed={432} />
      <text x={200} y={230} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        console.log("Vroom!…")
      </text>
      <text x={200} y={246} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        fuel = fuel - 1
      </text>

      {/* fuel gauge */}
      <text x={370} y={60} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
        fuel
      </text>
      <RoughRect x={345} y={70} width={52} height={44} seed={433} />
      <AnimatePresence mode="popLayout">
        <motion.text
          key={infinite ? '∞3' : fuel}
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          x={371}
          y={100}
          textAnchor="middle"
          fontFamily="var(--font-hand)"
          fontSize={24}
          fontWeight={700}
          fill="var(--color-ink)"
        >
          {infinite ? '3' : fuel}
        </motion.text>
      </AnimatePresence>
      {/* lap counter */}
      <text x={371} y={145} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
        laps: {infinite ? '∞' : laps}
      </text>

      {/* exit road */}
      <g opacity={exited && !infinite ? 1 : 0.3}>
        <HandArrow from={{ x: 280, y: 62 }} to={{ x: 340, y: 190 }} seed={434} stroke="var(--color-marker-teal)" curve={-0.3} />
        <text x={330} y={215} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-marker-teal)">
          false → exit:
        </text>
        <text x={330} y={233} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
          "Out of fuel."
        </text>
      </g>

      {/* the frozen tab */}
      <AnimatePresence>
        {infinite && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <text x={45} y={155} fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-coral)">
              fuel never changes →
            </text>
            <text x={45} y={178} fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-coral)">
              gate is ALWAYS true →
            </text>
            <text x={45} y={201} fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-marker-coral)">
              ⚠ tab frozen
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson25: LessonDef = {
  id: '2.5',
  hook: (
    <>
      <p>
        Deciding was half the power. The other half:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          repeating without getting tired
        </HighlightMark>
        . A loop tells the machine “keep doing this while a condition holds” — and suddenly
        checking 10,000 items costs you three lines. The simplest loop is <code>while</code>: a
        circular road with a gate. We’ll also deliberately break it, freeze a hypothetical browser
        tab, and understand exactly why that happens.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'track',
      caption:
        'The shape: a circular road. At the top, a gate — the condition, checked BEFORE every lap. In the loop body: some work, and crucially, something that CHANGES (fuel goes down). fuel starts at 3.',
      highlightLines: [1, 2],
    },
    {
      id: 'lap1',
      caption:
        'Lap 1: gate check — 3 > 0? true → drive the body: print "Vroom!", burn fuel (3 → 2, the read-change-store from lesson 1.3). Back to the gate. That’s the entire rhythm: check, body, check, body…',
      highlightLines: [3, 4],
    },
    {
      id: 'laps',
      caption:
        'Laps 2 and 3 fly by the same way: fuel 2 → 1 → 0, printing each time. Three Vrooms in the console. And now the gate gets asked once more…',
      highlightLines: [2, 3, 4],
    },
    {
      id: 'exit',
      caption:
        '0 > 0? FALSE → the gate refuses, the loop is over, and the traveler takes the exit road to line 6: "Out of fuel." Count carefully: the body ran 3 times, but the gate was checked 4 times — the last check is the one that says no. (That off-by-one awareness will serve you forever.)',
      highlightLines: [6],
    },
    {
      id: 'predict-infinite',
      caption: 'Now let’s vandalize it. Suppose we DELETE line 4 — fuel = fuel - 1 — and run again. Predict.',
      highlightLines: [4],
      prediction: {
        question: 'Without fuel = fuel - 1, what happens when this runs?',
        options: [
          'The loop runs 3 times anyway, then stops',
          'An infinite loop — fuel stays 3, the gate is true forever, and the page freezes',
          'JavaScript detects the mistake and throws an error',
        ],
        correctIndex: 1,
        why: 'Nothing in the body changes fuel anymore, so the gate’s answer can never change: 3 > 0, forever. The machine — perfectly obedient, remember lesson 0.1 — loops millions of times per second, doing exactly what you asked. No error is thrown, because nothing is “wrong” by its rules. The page just… stops responding.',
      },
    },
    {
      id: 'frozen',
      caption:
        'THIS is the infinite loop — and why it freezes the whole tab: JavaScript is single-threaded (one worker, remember the Phase 6 preview), and that worker is now trapped on this racetrack, unable to handle your clicks or anything else. The takeaway rule for every loop you ever write: something inside the body must move the condition toward false.',
      highlightLines: [2],
    },
  ],
  Viz: WhileTrack,
  underTheHood: (
    <>
      <p>
        Vocabulary: each trip around is an <strong>iteration</strong> (“the loop iterates”), and
        because the gate is checked <em>before</em> each lap, a while loop can run{' '}
        <strong>zero times</strong> — if the condition is false on arrival, the body is never
        entered at all (start our fuel at 0 and you get no Vrooms, straight to "Out of fuel.").
        There’s a rarer sibling, <code>do…while</code>, that checks the gate <em>after</em> the
        lap, guaranteeing at least one run — you’ll recognize it when you meet it; almost nobody
        writes it.
      </p>
      <p>
        The frozen tab, precisely: the browser gives your JavaScript one thread, and it can’t
        repaint the page, respond to clicks, or run anything else while your code holds that
        thread. A tight infinite loop holds it forever, so browsers eventually show the “This page
        is slowing down your browser” dialog and offer to kill it. Real-world infinite loops are
        rarely a deleted line — they’re usually a condition that <em>seems</em> like it changes
        but doesn’t (updating the wrong variable, a comparison that coerces unexpectedly — your
        lesson 1.9 senses should tingle).
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> you might expect
        browsers to just… detect infinite loops and stop them. They can’t — and it’s not laziness,
        it’s mathematics. Alan Turing proved in 1936 (before electronic computers existed!) that
        it’s <em>impossible</em> to write a program that reliably determines whether any given
        program will finish or loop forever. It’s called the <strong>Halting Problem</strong>, one
        of the most famous results in computer science. The browser’s humble “kill this page?”
        dialog is the practical answer to a provably unsolvable problem.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Trace the gate lap by lap: how many times does the body run? Type the number.',
      code: 'let n = 10;\nwhile (n > 0) {\n  n = n - 3;\n}',
      accept: ['4', 'four'],
      placeholder: 'a number…',
      why: 'Four: 10>0 run (n=7), 7>0 run (n=4), 4>0 run (n=1), 1>0 run (n=-2), then -2>0 is false → stop. And notice n ends at -2 — loops don’t stop AT the boundary, they stop when the check fails. Tracing like this is a daily testing skill.',
    },
    {
      kind: 'type-output',
      question: 'A while loop’s condition is false the very first time it’s checked. How many times does the body run? Type the number.',
      accept: ['0', 'zero'],
      placeholder: 'a number…',
      why: 'Zero — the gate comes BEFORE the road: false on arrival means the body is skipped entirely and life continues after the loop. Zero-iteration cases are classic test scenarios (empty cart, no results found).',
    },
    {
      kind: 'type-output',
      question: 'JavaScript runs your code on how many threads? Type the number — it explains every frozen tab.',
      accept: ['1', 'one'],
      placeholder: 'a number…',
      why: 'One worker, one racetrack, no exits: while the single thread is trapped in an infinite loop, nothing else — clicks, rendering — can run. The page can’t even repaint. (Phase 6 turns this constraint into the async story.)',
    },
  ],
  teachBack: {
    prompt:
      'Explain while loops to a friend with the circular-road picture: when is the gate checked, why can a loop run zero times, and what exactly makes a loop infinite (and the tab freeze)?',
    modelAnswer:
      'A while loop is a circular road with a gate: BEFORE every lap, the machine checks the condition. True → run the body and come back around; false → take the exit and continue after the loop. Because the check comes first, a loop can legally run zero times — false on arrival means the body is never entered. A loop becomes infinite when nothing in the body moves the condition toward false: the gate answers true forever, and the machine — perfectly obedient — keeps lapping millions of times a second. The tab freezes because JavaScript has a single thread: while it’s trapped in the loop, no clicks, no rendering, nothing else can run. Every healthy loop needs something inside that pushes the condition toward its end. Fun fact: browsers can’t auto-detect infinite loops — Turing proved in 1936 that no program can (the Halting Problem).',
  },
  recap: [
    'while = a circular road: check the gate BEFORE each lap. Body 3 runs = gate checked 4 times (the last one says no).',
    'Zero iterations is legal and common — false on arrival skips the body entirely. Test that case.',
    'Infinite loop = nothing moves the condition toward false. One thread → frozen tab. Turing proved auto-detecting this is impossible (Halting Problem, 1936).',
  ],
}
