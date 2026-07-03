import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.4 — let vs const vs var
 * Viz: two labeled boxes — a let box that swaps happily, a const box with a
 * padlocked label that throws when you try.
 */

const CODE = `let score = 10;
score = 20;
const pi = 3.14;
pi = 3.15;`

function ConstScene({ stepIndex }: { stepIndex: number }) {
  const scoreValue = stepIndex >= 1 ? '20' : '10'
  const showConst = stepIndex >= 2
  const showError = stepIndex === 3 || stepIndex === 4
  const showVar = stepIndex >= 6

  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* let box */}
      <text x={40} y={72} fontFamily="var(--font-hand)" fontSize={26} fontWeight={700} fill="var(--color-ink)">
        score
      </text>
      <text x={40} y={94} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
        (let)
      </text>
      <HandArrow from={{ x: 115, y: 64 }} to={{ x: 185, y: 64 }} curve={0.12} seed={41} />
      <RoughRect x={192} y={28} width={110} height={70} seed={42} />
      <AnimatePresence mode="popLayout">
        <motion.g
          key={scoreValue}
          initial={{ opacity: 0, y: -55 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 38 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <RoughEllipse cx={247} cy={63} width={62} height={40} seed={scoreValue === '10' ? 43 : 44} fill="var(--color-marker-yellow)" />
          <text x={247} y={71} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={24} fontWeight={700} fill="var(--color-ink)">
            {scoreValue}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* const box */}
      <AnimatePresence>
        {showConst && (
          <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={40} y={175} fontFamily="var(--font-hand)" fontSize={26} fontWeight={700} fill="var(--color-ink)">
              pi 🔒
            </text>
            <text x={40} y={197} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
              (const — label welded on)
            </text>
            <HandArrow from={{ x: 115, y: 167 }} to={{ x: 185, y: 167 }} curve={0.12} seed={45} stroke="var(--color-marker-teal)" />
            <RoughRect x={192} y={131} width={110} height={70} seed={46} stroke="var(--color-marker-teal)" />
            <RoughEllipse cx={247} cy={166} width={66} height={40} seed={47} fill="var(--color-marker-teal)" />
            <text x={247} y={174} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={22} fontWeight={700} fill="var(--color-ink)">
              3.14
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the refusal */}
      <AnimatePresence>
        {showError && (
          <motion.g
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: [0, -5, 5, -3, 3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <RoughRect x={92} y={222} width={330} height={44} seed={48} fill="var(--color-marker-coral)" />
            <text x={108} y={249} fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
              TypeError: Assignment to constant variable
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* var, the ghost of tutorials past */}
      <AnimatePresence>
        {showVar && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <RoughRect x={318} y={222} width={104} height={52} seed={49} strokeWidth={1.5} />
            <text x={370} y={244} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={18} fontWeight={700} fill="var(--color-ink-soft)">
              var
            </text>
            <text x={370} y={263} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
              old &amp; leaky
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const RIGHT_KEYWORD_EXERCISE: CodeExerciseDef = {
  id: 'd1a-right-keyword',
  title: 'the right keyword for the job',
  task: 'Two facts to store: one will never change, one changes all the time. Picking the right keyword for each — that IS the exercise.',
  steps: [
    <>
      A variable named <code>name</code> holds <code>"Lijas"</code>. A person’s name doesn’t
      change.
    </>,
    <>
      A variable named <code>mood</code> starts as <code>"sleepy"</code> — and later becomes{' '}
      <code>"curious"</code> (the coffee kicked in).
    </>,
    <>
      Print <code>name</code>, then the final <code>mood</code> — in that order.
    </>,
  ],
  starter: '',
  expectedOutput: ['Lijas', 'curious'],
  mustUse: [
    { test: /const\s+name\s*=\s*["']Lijas["']/, label: 'the never-changing name uses the permanent keyword' },
    { test: /let\s+mood\s*=\s*["']sleepy["']/, label: 'the changing mood uses the changeable keyword' },
    { test: /mood\s*=\s*["']curious["']/, label: 'mood actually changes to "curious"' },
  ],
  mustNotUse: [{ test: /const\s+mood/, label: 'const mood would throw a TypeError the moment it changes' }],
  modelAnswer: `const name = "Lijas";
let mood = "sleepy";

mood = "curious";

console.log(name);
console.log(mood);`,
}

const COUNTER_EXERCISE: CodeExerciseDef = {
  id: 'd1a-counter',
  title: 'the visitor counter',
  task: 'A counter that counts visitors as they arrive. It has to survive being changed — twice.',
  steps: [
    <>
      A variable named <code>count</code> starts at the number <code>0</code> — a number, so no
      quotes.
    </>,
    <>
      First visitor: <code>count</code> becomes <code>1</code> — print it. Second visitor: it
      becomes <code>2</code> — print it again.
    </>,
    <>Same variable the whole time. Choose its keyword so the changes don’t crash.</>,
  ],
  starter: '',
  expectedOutput: ['1', '2'],
  mustUse: [
    { test: /let\s+count\s*=\s*0/, label: 'count starts at 0 with a keyword that survives change' },
    { test: /count\s*=\s*1/, label: 'count becomes 1' },
    { test: /count\s*=\s*2/, label: 'count becomes 2' },
  ],
  mustNotUse: [
    { test: /const\s+count/, label: 'a counter that can never count is furniture — const is the wrong tool' },
  ],
  modelAnswer: `let count = 0;

count = 1;
console.log(count);

count = 2;
console.log(count);`,
}

export const lesson14: LessonDef = {
  id: '1.4',
  hook: (
    <>
      <p>
        You’ve been creating variables with <code>let</code>. But some values should{' '}
        <em>never</em> change: the value of pi, a tax rate, the address of the server your tests
        talk to. For those, JavaScript gives you a second keyword —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-teal) 35%, transparent)">
          const
        </HighlightMark>{' '}
        — which welds the label on. And lurking in older tutorials there’s a third, <code>var</code>,
        that you need to recognize but shouldn’t write. Three keywords, one clear rule by the end.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'let-recap',
      caption:
        'The top pair is yesterday’s news: a let box swaps its contents without complaint. let means “this variable is allowed to change.”',
      highlightLines: [1],
    },
    {
      id: 'let-swap',
      caption: 'Line 2 runs — 20 replaces 10. Same dance as lesson 1.3.',
      highlightLines: [2],
    },
    {
      id: 'const-born',
      caption:
        'Line 3: const pi = 3.14. Watch closely — the same three acts happen (box, value, label)… but this label is welded on, padlock and all. const is a promise TO the machine: “this name will always point at this value.”',
      highlightLines: [3],
    },
    {
      id: 'predict-const',
      caption: 'And now line 4 tries pi = 3.15. The machine remembers your promise. Predict.',
      highlightLines: [4],
      prediction: {
        question: 'Line 4 says pi = 3.15 — but pi was declared with const. What happens?',
        options: [
          'It works like let — 3.15 replaces 3.14',
          'The machine refuses and stops: TypeError: Assignment to constant variable',
          'It quietly ignores the line and keeps 3.14',
        ],
        correctIndex: 1,
        why: 'const means the promise is enforced: any attempt to reassign is an error that halts the program right there (nothing is “quietly ignored” — the machine is never quiet about broken promises). And look at you — reading “TypeError” and knowing exactly what kind of problem it is. Lesson 0.5 paying rent already.',
      },
    },
    {
      id: 'error',
      caption:
        'There’s the refusal, in a category you already know how to read. This error is your friend: it caught a broken promise the instant it happened, instead of letting a wrong pi value poison calculations somewhere far away.',
      highlightLines: [4],
    },
    {
      id: 'which',
      caption:
        'So which do you use? Here’s the professional habit, and it surprises beginners: default to const, and switch to let only when you KNOW the value must change. Most variables, it turns out, never need to change — and every const is one less moving part to keep track of.',
      highlightLines: [3],
    },
    {
      id: 'var',
      caption:
        'Finally, the ghost: var. It’s how ALL variables were made before 2015, so old tutorials are full of it. It works — but its rules about where the variable can be seen are leaky in ways that cause sneaky bugs (the full autopsy is a Phase 5 lesson). Recognize it, understand it, don’t write it.',
    },
  ],
  Viz: ConstScene,
  underTheHood: (
    <>
      <p>
        Why does <code>const</code> exist at all, when <code>let</code> can do everything? Because
        code is read far more often than it’s written. A <code>const</code> tells every future
        reader — including future you, and the teammates whose test suites you’ll maintain — “stop
        tracking this one; it never changes.” In a 500-line file, knowing that 40 of 50 variables
        are frozen is a massive gift to your working memory. const is less about the machine and
        more about <em>communication between humans</em>.
      </p>
      <p>
        One honest fine-print note for later: const welds the <em>label to the box</em> — it does
        not weld the box shut. For simple values (numbers, strings, booleans) that distinction
        doesn’t matter: they can’t be changed “in place,” so const truly freezes them. But in Phase
        4, when boxes start holding <em>arrows</em> to bigger things, you’ll see that a const
        arrow can still point at a thing whose insides change. File that away; it’ll make perfect
        sense with the reference picture.
      </p>
      <p>
        And <code>var</code>, concretely: it ignores some boundaries that let/const respect (it’s
        “function-scoped” rather than “block-scoped”) and it behaves oddly when used before its
        line (no error — you silently get undefined). Those words will fully click in Phases 3 and
        5 (lessons 3.5 and 5.2). Until then the practical rule stands: <strong>read var
        fluently, write let and const only.</strong>
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The second line halts the program. Type the NAME of the error (one word, ends in Error).',
      code: 'const city = "Chennai";\ncity = "Mumbai";',
      accept: ['TypeError'],
      placeholder: 'SomethingError…',
      why: 'TypeError: Assignment to constant variable. const enforces the never-reassign promise with an error at the exact line that broke it. Everything before that line already ran (lesson 0.5!); everything after never does.',
    },
    {
      kind: 'type-output',
      question: 'You’re creating a variable and you’re not sure yet if it will need to change. Type the keyword professionals reach for FIRST.',
      accept: ['const'],
      placeholder: 'a keyword…',
      why: 'const — start locked, upgrade to let only when a reassignment actually appears. If you guessed wrong, the machine tells you instantly (a clear TypeError) and switching takes two seconds. The reverse mistake — a let that silently changes when it shouldn’t — can hide for weeks.',
    },
    {
      question: 'You open a tutorial from 2012 and every line uses var. What’s the right move?',
      options: [
        'Close it — the JavaScript is too old to be valid',
        'Read it fine (var still works), but write let/const in your own code',
        'Use var too, for consistency with the tutorial',
      ],
      correctIndex: 1,
      why: 'var is legal and everywhere in older code — you must be able to read it. But it has leaky visibility rules that let/const fixed in 2015. Understanding old code and writing modern code are both part of the job.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={RIGHT_KEYWORD_EXERCISE} />
      <CodeExercise def={COUNTER_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'Explain to a friend: what’s the difference between let and const, why do professionals default to const, and what should they do when they meet var in an old tutorial?',
    modelAnswer:
      'Both let and const create a variable — a labeled box in memory. The difference is the label: let ties it on normally, so you can swap the contents later; const welds it on — a promise that this name will always point to this value, and the machine enforces it with a TypeError if you try to reassign. Professionals default to const because most values never actually need to change, and every const is one less thing readers have to track — you only use let when something genuinely varies, like a score. var is the pre-2015 way: it still works and you should be able to read it, but its visibility rules are leaky, so never write it in new code.',
  },
  recap: [
    'let = swappable contents. const = the label is welded on; reassigning throws TypeError: Assignment to constant variable.',
    'Professional default: const first, let only when the value truly must change. Most variables never do.',
    'var = the old, leaky pre-2015 keyword: read it fluently in old code, never write it. (Autopsy in Phase 5.)',
  ],
}
