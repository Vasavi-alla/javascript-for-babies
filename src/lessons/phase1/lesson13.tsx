import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.3 — Reassignment
 * Viz: MemoryDiagram with an evaluation bubble — score = score + 5.
 */

const CODE = `let score = 10;
score = score + 5;
console.log(score);`

function ReassignScene({ stepIndex }: { stepIndex: number }) {
  const value = stepIndex >= 4 ? '15' : '10'
  return (
    <svg viewBox="0 0 420 280" className="w-full">
      <text x={230} y={36} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        memory
      </text>

      {/* box + label appear together at step 0 (we know this dance now) */}
      <RoughRect x={230} y={62} width={120} height={74} seed={7} />
      <text x={55} y={110} fontFamily="var(--font-hand)" fontSize={28} fontWeight={700} fill="var(--color-ink)">
        score
      </text>
      <HandArrow from={{ x: 130, y: 101 }} to={{ x: 222, y: 101 }} curve={0.12} seed={21} />

      <AnimatePresence mode="popLayout">
        <motion.g
          key={value}
          initial={{ opacity: 0, y: -70 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 45 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <RoughEllipse cx={290} cy={100} width={70} height={44} seed={value === '10' ? 11 : 13} fill="var(--color-marker-yellow)" />
          <text x={290} y={109} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={27} fontWeight={700} fill="var(--color-ink)">
            {value}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* the evaluation bubble */}
      <AnimatePresence>
        {stepIndex === 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }} style={{ transformOrigin: '200px 205px' }}>
            <RoughRect x={70} y={175} width={270} height={60} seed={30} fill="var(--color-sticky-pink)" fillStyle="solid" strokeWidth={1.5} />
            <text x={205} y={202} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fill="var(--color-ink)">
              score + 5 → 10 + 5 → 15
            </text>
            <text x={205} y={224} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              right side first, using the CURRENT value
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* console output */}
      <AnimatePresence>
        {stepIndex >= 5 && (
          <motion.g initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <RoughRect x={70} y={205} width={160} height={34} seed={32} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={85} y={227} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
              › 15
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const MESSAGE_EXERCISE: CodeExerciseDef = {
  id: 'd1a-message',
  title: 'a sentence that grows',
  task: 'You watched score = score + 5 with numbers — now do the same read-change-store move with TEXT: one variable, growing itself twice.',
  steps: [
    <>
      A variable named <code>sentence</code> starts as <code>"I"</code>.
    </>,
    <>
      Grow it twice using ITSELF on the right side — first to <code>"I love"</code>, then to{' '}
      <code>"I love JS"</code>. Each step must read the current value and add to it:{' '}
      <code>sentence = sentence + …</code> — retyping the whole text is not allowed.
    </>,
    <>
      ONE <code>console.log(sentence)</code> at the very end. (Mind the spaces — they have to
      come from the added pieces.)
    </>,
  ],
  starter: '',
  expectedOutput: ['I love JS'],
  mustUse: [
    { test: /let\s+sentence\s*=\s*["']I["']/, label: 'sentence starts as "I", created with a keyword that allows change' },
    { test: /sentence\s*=\s*sentence\s*\+[\s\S]*sentence\s*=\s*sentence\s*\+/, label: 'it grows from ITSELF twice: sentence = sentence + …' },
    { test: /console\.log\s*\(\s*sentence\s*\)/, label: 'the variable is printed once, at the end' },
  ],
  mustNotUse: [
    { test: /["']I love JS["']/, label: 'no retyping the finished sentence — each step builds on the current value' },
    { test: /console\.log[\s\S]*console\.log/, label: 'exactly one console.log' },
  ],
  modelAnswer: `let sentence = "I";

sentence = sentence + " love";
sentence = sentence + " JS";

console.log(sentence);`,
}

export const lesson13: LessonDef = {
  id: '1.3',
  hook: (
    <>
      <p>
        Variables would be pointless if they couldn’t change — a score that can’t go up isn’t much
        of a score. Changing what a variable remembers is called{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          reassignment
        </HighlightMark>
        , and it hides a line that breaks every math-trained brain on first sight:{' '}
        <code>score = score + 5</code>. In math class that’s impossible. In JavaScript it’s the
        single most common move in all of programming. Let’s fix your intuition permanently.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'setup',
      caption:
        'Line 1 you can already narrate in your sleep: box borrowed, 10 placed inside, label “score” tied on. (Drawn in one go — you’ve earned the shortcut.)',
      highlightLines: [1],
    },
    {
      id: 'weird-line',
      caption:
        'Now line 2: score = score + 5. If = meant “equals”, this line would be nonsense — nothing equals itself plus five. First truth of this lesson: = does NOT mean equals. It’s an instruction: “take what’s on the right, put it into what’s on the left.”',
      highlightLines: [2],
    },
    {
      id: 'predict',
      caption: 'So knowing that = means “put into”… what does this line actually do?',
      highlightLines: [2],
      prediction: {
        question: 'What does score = score + 5 do?',
        options: [
          'Nothing — it’s a contradiction, so it’s skipped',
          'Works out the right side using score’s current value (10 + 5 = 15), then stores 15 back into score',
          'Creates a second variable, also called score',
        ],
        correctIndex: 1,
        why: 'The machine ALWAYS evaluates the right side first — and at that moment, score still means 10. So the right side becomes 10 + 5 = 15. Only then does = store the finished 15 into the box. Read = out loud as “gets”: “score gets score plus five.”',
      },
    },
    {
      id: 'evaluate',
      caption:
        'Watch the order. Step one: the right side is evaluated. The machine follows the label (score → 10), does the math, and ends up holding a finished value: 15. The box hasn’t been touched yet.',
      highlightLines: [2],
    },
    {
      id: 'store',
      caption:
        'Step two: NOW the = fires. The 15 goes into the box, replacing the 10. Same box, same label — new contents. The old 10 is forgotten, swept away by the garbage collector.',
      highlightLines: [2],
    },
    {
      id: 'print',
      caption:
        'And line 3 confirms it: 15. This little pattern — read the current value, change it, store it back — is everywhere: game scores, retry counters, shopping totals, loop counters in Phase 2. You’ll write it ten thousand times, and now you know exactly what it does.',
      highlightLines: [3],
    },
  ],
  Viz: ReassignScene,
  underTheHood: (
    <>
      <p>
        The <code>=</code> sign is the <strong>assignment operator</strong>, and the golden rule
        is: <strong>right side first, completely, then store left</strong>.
      </p>
      <p>
        The left side isn’t a value at all — it’s a <em>destination</em> (which box to fill).
        That’s why <code>10 = score</code> is an error: 10 isn’t a box.
      </p>
      <p>
        Programmers hear “score gets 15” in their heads, never “score equals 15” — adopt that
        reading today and the confusion never returns. (The “does it equal?” question uses
        different symbols, <code>===</code>, coming in lesson 1.9.)
      </p>
      <p>
        The read-change-store pattern is so common that JavaScript ships shortcuts:{' '}
        <code>score += 5</code> is exactly <code>score = score + 5</code>, and{' '}
        <code>score++</code> adds 1. They do nothing new — same box, same label, new contents — so
        learn the long form first (you just did) and treat the shortcuts as abbreviations, not
        magic.
      </p>
      <p>
        One boundary worth knowing early: reassignment only works on variables declared with{' '}
        <code>let</code>. If score had been declared with <code>const</code> (“constant” — a label
        welded on), line 2 would throw{' '}
        <code>TypeError: Assignment to constant variable</code> — an error you can now read
        fluently. The full let-vs-const decision is the very next lesson.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what ends up in count’s box:',
      code: 'let count = 3;\ncount = count * 2;',
      accept: ['6'],
      placeholder: 'a value…',
      why: 'Right side first: count * 2 → 3 * 2 → 6. Then = stores 6, replacing the 3. A box holds exactly one value; the old one is gone.',
    },
    {
      kind: 'type-output',
      question: 'How should you read the = symbol out loud? Type the one word.',
      accept: ['gets', 'Gets', '"gets"'],
      placeholder: 'one word…',
      why: '“score GETS score plus five” — an action, not a statement of fact. Math’s = describes a truth; JavaScript’s = performs a move. Same symbol, completely different meaning.',
    },
    {
      kind: 'type-output',
      question: 'Trace it box-by-box, then type the final value of total:',
      code: 'let total = 100;\ntotal = total - 30;\ntotal = total - 30;',
      accept: ['40'],
      placeholder: 'a value…',
      why: 'Each line reads the CURRENT value: 100 − 30 stores 70, then 70 − 30 stores 40. Being able to run this movie in your head is exactly the skill this lesson builds.',
    },
  ],
  PlayExtra: () => <CodeExercise def={MESSAGE_EXERCISE} />,
  teachBack: {
    prompt:
      'Your friend says “score = score + 5 is impossible — nothing can equal itself plus 5!” Set them straight: what does = really mean, and what happens step by step?',
    modelAnswer:
      'The trap is reading = as “equals” — in JavaScript it isn’t. = is an instruction: “work out the right side, then put the result into the box on the left.” So score = score + 5 happens in two steps: first the machine evaluates the right side using score’s CURRENT value (if it’s 10, then 10 + 5 = 15); only then does it store 15 into score’s box, replacing the 10. Same box, same label, new contents. Read it as “score GETS score plus five” and it makes perfect sense.',
  },
  recap: [
    '= means “gets”, never “equals”: work out the right side completely, then store it into the left side’s box.',
    'score = score + 5 → right side uses the CURRENT value (10+5=15), then 15 replaces the 10. Same box, same label.',
    'Read-change-store is programming’s most common move (score += 5 is its shortcut). And const boxes refuse it — next lesson.',
  ],
}
