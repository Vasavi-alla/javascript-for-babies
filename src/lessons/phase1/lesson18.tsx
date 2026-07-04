import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.8 — typeof & dynamic typing
 * Viz: one label re-pointed across differently-typed values; typeof as a
 * little inspector reading the tag on the VALUE, never on the label.
 */

const CODE = `let mystery = 42;
console.log(typeof mystery);
mystery = "forty-two";
console.log(typeof mystery);
console.log(typeof true);`

function TypeofScene({ stepIndex }: { stepIndex: number }) {
  const isString = stepIndex >= 2
  const value = isString ? '"forty-two"' : '42'
  const valueColor = isString ? 'var(--color-marker-teal)' : 'var(--color-marker-yellow)'
  const showInspector = stepIndex === 1 || stepIndex === 4
  const inspectorAnswer = stepIndex >= 2 ? '"string"' : '"number"'

  return (
    <svg viewBox="0 0 440 280" className="w-full">
      {/* label + box */}
      <text x={40} y={105} fontFamily="var(--font-hand)" fontSize={26} fontWeight={700} fill="var(--color-ink)">
        mystery
      </text>
      <HandArrow from={{ x: 145, y: 97 }} to={{ x: 205, y: 97 }} curve={0.12} seed={230} />
      <RoughRect x={212} y={58} width={160} height={78} seed={231} />

      <AnimatePresence mode="popLayout">
        <motion.g
          key={value}
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', damping: 15 }}
        >
          <RoughEllipse cx={292} cy={97} width={140} height={48} seed={isString ? 233 : 232} fill={valueColor} />
          <text x={292} y={104} textAnchor="middle" fontFamily="var(--font-code)" fontSize={15} fontWeight={600} fill="var(--color-ink)">
            {value}
          </text>
          {/* the type tag lives ON the value */}
          <RoughRect x={330} y={52} width={82} height={26} seed={234} strokeWidth={1.3} fill="var(--color-paper-raised)" fillStyle="solid" />
          <text x={371} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            {isString ? 'string 🏷️' : 'number 🏷️'}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* the typeof inspector */}
      <AnimatePresence>
        {showInspector && (
          <motion.g initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={120} y={190} fontFamily="var(--font-hand)" fontSize={21} fill="var(--color-ink)">
              🔍 typeof: “let me read the value’s tag…”
            </text>
            <HandArrow from={{ x: 210, y: 200 }} to={{ x: 300, y: 130 }} seed={236} curve={-0.2} stroke="var(--color-marker-coral)" />
            <RoughRect x={120} y={210} width={150} height={38} seed={237} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={137} y={234} fontFamily="var(--font-code)" fontSize={13.5} fill="var(--color-ink)">
              › {inspectorAnswer}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* boolean roundup */}
      <AnimatePresence>
        {stepIndex >= 5 && (
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <text x={40} y={195} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink)">
              typeof 42 → "number"      typeof "hi" → "string"
            </text>
            <text x={40} y={222} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink)">
              typeof true → "boolean"   typeof undefined → "undefined"
            </text>
            <text x={40} y={252} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-marker-coral)">
              typeof null → "object"  ← the 1995 bug, forever
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson18: LessonDef = {
  id: '1.8',
  hook: (
    <>
      <p>
        You’ve met the types. Now two questions with one answer: how do you <em>ask</em> the
        machine what type something is — and does a variable itself have a type at all?
      </p>
      <p>
        The tool is <code>typeof</code>, and the answer to the second question is the deep one:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          values have types — variables are just labels
        </HighlightMark>
        . The same label can point at a number today and a string tomorrow. That freedom has a
        name, dynamic typing, and it’s equal parts superpower and trap.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'setup',
      caption:
        'A box with 42 inside. Look closely at the picture: the type tag — “number” — hangs on the VALUE in the box, not on the label. Keep your eye on that tag through this lesson.',
      highlightLines: [1],
    },
    {
      id: 'inspect-1',
      caption:
        'Line 2: typeof mystery. The inspector follows the label, opens the box, and reads the tag on whatever value is currently inside: "number". Note the quotes in the answer — typeof always answers with a STRING naming the type.',
      highlightLines: [2],
    },
    {
      id: 'retype',
      caption:
        'Line 3 does something that shocks people coming from other languages: it puts a STRING into the same variable. No error, no complaint. The label simply points at a new value — with a different tag. Variables don’t have types; they’re just labels. THIS is dynamic typing.',
      highlightLines: [3],
    },
    {
      id: 'predict-typeof',
      caption: 'So — line 4 runs typeof mystery again. Same variable, same question. Predict the answer.',
      highlightLines: [4],
      prediction: {
        question: 'mystery now holds "forty-two". What does typeof mystery give?',
        options: [
          '"number" — the variable was born a number',
          '"string" — typeof reads the tag on the CURRENT value, not the label',
          'An error — a variable can’t change type',
        ],
        correctIndex: 1,
        why: 'The type lives on the value, and the box currently holds a string — so "string". The variable never had a type of its own to remember. In dynamically-typed languages like JavaScript, “what type is this variable?” really means “what type is the value it points at RIGHT NOW?”',
      },
    },
    {
      id: 'inspect-2',
      caption: '"string" — the inspector reads the new tag. Same label, different value, different answer.',
      highlightLines: [4],
    },
    {
      id: 'roundup',
      caption:
        'One crooked entry worth memorizing: typeof null claims "object" — the permanent 1995 bug from lesson 1.7.',
      highlightLines: [5],
    },
    {
      id: 'roundup-safe',
      caption:
        'One more handy fact: typeof never throws an error, even on names that don’t exist — which makes it a safe probe when you’re not sure something is defined.',
      highlightLines: [5],
    },
  ],
  Viz: TypeofScene,
  underTheHood: (
    <>
      <p>
        The proper vocabulary: JavaScript is <strong>dynamically typed</strong> — types are checked
        while the program <em>runs</em>, and any variable may hold any type at any moment.
      </p>
      <p>
        The opposite is <strong>statically typed</strong> (Java, C#, and JavaScript’s cousin{' '}
        <strong>TypeScript</strong>): there, a variable declares its type up front and the machine
        refuses mismatches <em>before</em> the program ever runs. You’ll get a taste of TypeScript
        in Phase 8 — most Playwright projects use it precisely to catch type mix-ups early.
      </p>
      <p>
        Because <code>typeof</code> answers with a string, the idiom you’ll see everywhere is a
        string comparison: <code>typeof x === "number"</code>. Mind the quotes on the right side —
        comparing against bare <code>number</code> would be a ReferenceError (no such variable!).
      </p>
      <p>
        A delightful brain-stretcher: <code>typeof typeof 42</code> is… <code>"string"</code> —
        because <code>typeof 42</code> produces the string "number", and the type of a string is
        "string". Evaluate inside-out, like always.
      </p>
      <p>
        Why should a tester care about dynamic typing? Because it’s a bug <em>factory</em>: nothing
        stops a variable that held a number from silently becoming a string (you saw how easily),
        and suddenly <code>total + 1</code> glues instead of adds. Entire categories of production
        bugs — and of test cases you’ll write — boil down to “this value wasn’t the type everyone
        assumed.” The next lesson shows exactly what happens when mixed types collide.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what typeof "42" gives (as the console would show it):',
      accept: ['string', '"string"'],
      why: 'Quotes make it a string — typeof reads the value’s tag, and the tag says string. The digits inside don’t matter; the wrapper decides.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what prints:',
      code: 'let x = 5;\nx = "five";\nconsole.log(typeof x);',
      accept: ['string', '"string"'],
      why: 'Perfectly legal — dynamic typing: the label now points at a string, because types live on VALUES, not variables. (Different from const, which forbids ANY reassignment.) Legal, but a common source of confusion — which is why TypeScript exists.',
    },
    {
      kind: 'type-output',
      question: 'The tiny puzzle: type what typeof typeof true gives.',
      accept: ['string', '"string"'],
      why: 'Inside-out: typeof true → "boolean" (a string!), then typeof "boolean" → "string". Every typeof answer is a string, so double-typeof is ALWAYS "string". Solving this proves you’ve internalized evaluate-first.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: what does “dynamic typing” mean, where does the type actually live (label or value?), and what does typeof really check?',
    modelAnswer:
      'In JavaScript, types belong to VALUES, not to variables. A variable is just a label pointing at a box — and the value in the box carries the type tag. That’s dynamic typing: the same label can point at a number now and a string a moment later, and the machine only checks types while the program runs. typeof follows the label and reads the tag on whatever value is currently there — answering with a string like "number" or "string". So asking “what type is this variable?” really means “what type is the value it points at right now?” — the answer can change, which is flexible but also a classic source of bugs.',
  },
  recap: [
    'Types live on VALUES; variables are typeless labels. Dynamic typing = any label may point at any type, any time.',
    'typeof reads the current value’s tag and always answers with a string: typeof x === "number".',
    'Cheat sheet: "number", "string", "boolean", "undefined" — and typeof null → "object" (the permanent bug). typeof never throws.',
  ],
}
