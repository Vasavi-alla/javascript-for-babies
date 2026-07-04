import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 0.5 — Errors are messages, not failures
 * Viz: ErrorAnatomy — a real error dissected: name, message, location.
 */

const CODE = `console.log("Starting…");
console.lgo("Hello!");
console.log("Done");`

const FIXED_CODE = `console.log("Starting…");
console.log("Hello!");
console.log("Done");`

function OutputLine({ y, text, seed }: { y: number; text: string; seed: number }) {
  return (
    <>
      <RoughRect x={55} y={y} width={220} height={32} seed={seed} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
      <text x={68} y={y + 21} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
        {text}
      </text>
    </>
  )
}

function ErrorAnatomy({ stepIndex }: { stepIndex: number }) {
  const fixed = stepIndex >= 7
  const showError = stepIndex >= 2 && !fixed
  return (
    <svg viewBox="0 0 480 310" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        the console
      </text>
      <RoughRect x={35} y={40} width={410} height={260} seed={140} />

      {/* line 1 always ran */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <OutputLine y={55} text="Starting…" seed={141} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* the error card */}
      <AnimatePresence>
        {showError && (
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 14 }}
            style={{ transformOrigin: '240px 150px' }}
          >
            <RoughRect x={55} y={112} width={370} height={72} seed={143} fill="var(--color-marker-coral)" />
            <text x={72} y={140} fontFamily="var(--font-code)" fontSize={13.5} fontWeight={600} fill="var(--color-ink)">
              TypeError: console.lgo is not a function
            </text>
            <text x={72} y={166} fontFamily="var(--font-code)" fontSize={12.5} fill="var(--color-ink)">
              at script.js — line 2
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* dissection arrows */}
      <AnimatePresence>
        {stepIndex >= 3 && !fixed && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={62} y={225} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
              ① the category
            </text>
            <HandArrow from={{ x: 100, y: 208 }} to={{ x: 100, y: 148 }} seed={145} stroke="var(--color-ink)" curve={0.25} />
          </motion.g>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {stepIndex >= 4 && !fixed && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={205} y={250} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink)">
              ② what went wrong, in its words
            </text>
            <HandArrow from={{ x: 280, y: 232 }} to={{ x: 280, y: 148 }} seed={146} stroke="var(--color-ink)" curve={-0.15} />
          </motion.g>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {stepIndex >= 5 && !fixed && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x={62} y={285} fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-marker-coral)">
              ③ WHERE it got stuck
            </text>
            <HandArrow from={{ x: 130, y: 268 }} to={{ x: 145, y: 172 }} seed={147} stroke="var(--color-marker-coral)" curve={0.2} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* the fixed run */}
      <AnimatePresence>
        {fixed && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <OutputLine y={102} text="Hello!" seed={150} />
            <OutputLine y={149} text="Done" seed={151} />
            <text x={62} y={230} fontFamily="var(--font-hand)" fontSize={20} fontWeight={700} fill="var(--color-marker-teal)">
              ✓ one letter fixed — everything runs
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson05: LessonDef = {
  id: '0.5',
  hook: (
    <>
      <p>
        Very soon you’ll write real code — and sometimes the machine will answer in red. Most
        beginners see red text and feel they failed. Let’s permanently install the opposite
        reflex:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-coral) 30%, transparent)">
          an error is the machine asking you for help
        </HighlightMark>{' '}
        — and it always tells you what went wrong and where.
      </p>
      <p>
        Learning to read errors calmly is a superpower — and for a future tester it’s doubly true:
        provoking errors and reading them carefully is literally part of the job.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'typo',
      caption:
        'Three instructions — but look closely at line 2. There’s a typo: lgo instead of log. We’ll run it anyway, on purpose, and watch what the machine does.',
      highlightLines: [2],
    },
    {
      id: 'line-1-ran',
      caption:
        'First thing to notice: line 1 ran fine — Starting… printed. An error never erases the work that already happened before it.',
      highlightLines: [1],
    },
    {
      id: 'error-appears',
      caption:
        'Then the machine reached line 2… and stopped. Out comes the red text. Don’t skim it, don’t panic — we’re going to read it like a short letter, because that’s what it is.',
      highlightLines: [2],
    },
    {
      id: 'part-name',
      caption:
        'Part ①: the first word is the CATEGORY of problem. “TypeError” means: “you asked a thing to do something it can’t do.” There are only a handful of categories — you’ll know them all by the end of this lesson.',
      highlightLines: [2],
    },
    {
      id: 'part-message',
      caption:
        'Part ②: the message — “console.lgo is not a function.” Translated from machine-speak: “I looked inside console for something called lgo, and there’s nothing there I can run.” It is describing YOUR typo back to you.',
      highlightLines: [2],
    },
    {
      id: 'part-location',
      caption:
        'Part ③, the gift: WHERE. “line 2.” The machine literally points its finger at the exact line where it got stuck. You never have to hunt blindly — start where it points.',
      highlightLines: [2],
    },
    {
      id: 'predict-done',
      caption: 'One more observation hiding in plain sight. Check the console: did “Done” (line 3) ever print?',
      highlightLines: [3],
      prediction: {
        question: 'Line 3 says console.log("Done") — and it’s spelled correctly. Why did “Done” never appear?',
        options: [
          'console.log stopped working for the rest of the program',
          'The error stopped the program at line 2 — so line 3 was never reached at all',
          '“Done” did print, but errors hide everything after them',
        ],
        correctIndex: 1,
        why: 'An error halts the program at the exact point of failure. Everything BEFORE it already happened (Starting… printed); everything AFTER it never runs. That’s also why the location matters so much: it marks the border between “ran” and “never ran.”',
      },
    },
    {
      id: 'fixed',
      caption:
        'It never printed — the error stopped the program at line 2, so line 3 was never reached: everything BEFORE an error already ran, everything AFTER never runs. Now we fix the single letter — lgo → log — and run again. Everything flows. That’s the ritual you’ll repeat thousands of times: read it, go where it points, fix, re-run.',
      codeOverride: FIXED_CODE,
      highlightLines: [2],
    },
  ],
  Viz: ErrorAnatomy,
  underTheHood: (
    <>
      <p>
        Meet the big three error categories — between them they cover most of what you’ll see for
        months. <strong>SyntaxError</strong>: “I couldn’t even read this” — the grammar is broken
        (a missing quote or bracket), so the program doesn’t start at all.
      </p>
      <p>
        <strong>ReferenceError</strong>: “you used a name that doesn’t exist anywhere” — like{' '}
        <code>consoel.log(…)</code> or using a variable you never created.
      </p>
      <p>
        <strong>TypeError</strong>: “that thing exists, but it can’t do what you asked” — like our{' '}
        <code>console.lgo</code> (console exists; lgo isn’t something inside it you can call).
      </p>
      <p>
        Real errors usually come with extra lines underneath, called a <strong>stack trace</strong>{' '}
        — a list of “who called whom” leading to the failure. It looks scary and is actually a
        breadcrumb trail; it becomes genuinely useful once you know functions (Phase 3), and we’ll
        read them together then. Until that day: <em>the first line is the letter, the rest is the
        envelope.</em>
      </p>
      <p>
        A professional habit to start now: when several errors appear,{' '}
        <strong>read the first one</strong> — later errors are often just fallout from it.
      </p>
      <p>
        And keep this framing forever: errors are evidence, not verdicts. Your future job
        description literally includes making software fail on purpose and reading what it says —
        a tester who reads error messages calmly and precisely is worth their weight in gold.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'The console says: “ReferenceError: userName is not defined.” What is the machine telling you?',
      options: [
        'The computer is broken and should be restarted',
        'It looked for something called userName and couldn’t find it anywhere',
        'userName exists but contains the wrong value',
      ],
      correctIndex: 1,
      why: '“Not defined” = that name doesn’t exist as far as the machine can see. Usually a typo in the name, or you used it before creating it. Note how much it told you: the exact name, and the exact problem.',
    },
    {
      kind: 'type-output',
      question: 'An error appeared at line 12. Lines 1–11 already ___ — type the one word (ran / waited / cancelled).',
      accept: ['ran', 'Ran'],
      placeholder: 'one word…',
      why: 'They already RAN — execution is top-to-bottom, and the error is a stop sign at line 12. Everything above it executed and its effects are real. That border between “ran” and “never ran” is often the biggest clue for finding the bug.',
    },
    {
      kind: 'type-output',
      question: 'Red text fills the console — several errors at once. Which one do you read first? Type "first" or "last".',
      accept: ['first', 'First', 'the first', 'the first one'],
      placeholder: 'first / last…',
      why: 'The FIRST — one real problem often triggers a cascade, so the later errors are frequently just fallout. Fix the first and re-run; the rest often vanish. (And if red text makes your heart jump: that fades with every error you read. It really does.)',
    },
  ],
  teachBack: {
    prompt:
      'Your friend just got their first error and wants to give up. Explain: what IS an error really, what are the three parts to read in one, and what should they do next?',
    modelAnswer:
      'An error isn’t the computer saying “you failed” — it’s the machine stopping to ask for help, with a note attached. The note has three parts: the category (like TypeError — what kind of problem), the message (what it couldn’t do, in its own words), and the location (the exact line where it got stuck). Everything before that line already ran; everything after never did. So: read the category, read the message slowly, go to the line it points at, fix, and run again. The red text isn’t the wall — it’s the map.',
  },
  recap: [
    'An error = the machine asking for help: a category, a message, and the exact line. Read it like a letter, not an alarm.',
    'Errors stop the program AT the failure point: everything before ran, everything after never did.',
    'The big three: SyntaxError (couldn’t read it), ReferenceError (name doesn’t exist), TypeError (thing can’t do that). Read the FIRST error first.',
  ],
}
