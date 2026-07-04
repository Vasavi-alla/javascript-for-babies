import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughEllipse, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.2 — What REALLY happens when you create a variable
 * The hero lesson of the foundation. Viz: MemoryDiagram (simple mode).
 */

const CODE = `let age = 25;
console.log(age);`

function MemoryDiagram({ stepIndex }: { stepIndex: number }) {
  return (
    <svg viewBox="0 0 420 280" className="w-full">
      <text x={230} y={36} fontFamily="var(--font-hand)" fontSize={22} fill="var(--color-ink-soft)">
        memory
      </text>

      {/* the borrowed box */}
      <AnimatePresence>
        {stepIndex >= 1 && (
          <motion.g
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', damping: 16 }}
            style={{ transformOrigin: '290px 100px' }}
          >
            <RoughRect x={230} y={62} width={120} height={74} seed={7} />
            <text x={236} y={78} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
              #7,204
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the value */}
      <AnimatePresence>
        {stepIndex >= 2 && (
          <motion.g initial={{ opacity: 0, y: -70 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 15 }}>
            <RoughEllipse cx={290} cy={100} width={70} height={44} seed={11} fill="var(--color-marker-yellow)" />
            <text x={290} y={109} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={27} fontWeight={700} fill="var(--color-ink)">
              25
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* the name */}
      <AnimatePresence>
        {stepIndex >= 3 && (
          <motion.g initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <text x={70} y={110} fontFamily="var(--font-hand)" fontSize={30} fontWeight={700} fill="var(--color-ink)">
              age
            </text>
            <HandArrow from={{ x: 125, y: 101 }} to={{ x: 222, y: 101 }} curve={0.12} seed={21} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* the lookup */}
      <AnimatePresence>
        {stepIndex >= 5 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <text x={55} y={185} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink)">
              “age? let me follow the label…”
            </text>
            <HandArrow from={{ x: 150, y: 196 }} to={{ x: 268, y: 142 }} seed={23} curve={-0.25} stroke="var(--color-marker-coral)" />
            <RoughRect x={55} y={215} width={160} height={34} seed={25} fill="var(--color-sticky)" fillStyle="solid" strokeWidth={1.5} />
            <text x={70} y={237} fontFamily="var(--font-code)" fontSize={13} fill="var(--color-ink)">
              › 25
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson12: LessonDef = {
  id: '1.2',
  hook: (
    <>
      <p>
        This is the most important lesson of the whole foundation. One tiny line —{' '}
        <code>let age = 25;</code> — and most people learn to read it as “age equals 25” and move
        on. But you’re here to <em>see</em> what the machine actually does. It does{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          three separate things
        </HighlightMark>
        , in order — and once you can draw them, half of JavaScript’s “weird” behavior stops being
        weird before you even meet it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'intro',
      caption:
        'Read the line as an instruction to the machine: “let there be a thing called age, and put 25 in it.” The keyword let announces: I’m creating a variable. Now watch what physically happens, piece by piece.',
      highlightLines: [1],
    },
    {
      id: 'slot',
      caption:
        'Thing one: the machine borrows a box from the memory wall (lesson 0.4!). A real one, with an address — this one happens to be box #7,204. You’ll never see or care about that number: the engine handles it.',
      highlightLines: [1],
    },
    {
      id: 'value',
      caption: 'Thing two: the value 25 — a number, as you now know — is created and placed into the box.',
      highlightLines: [1],
    },
    {
      id: 'label',
      caption:
        'Thing three, the clever part: the NAME “age” is tied to the box, like a label on a string. Look at the picture carefully: age is not the box, and it isn’t the 25 either. It’s the label pointing at the box. This distinction will pay you back for years.',
      highlightLines: [1],
    },
    {
      id: 'predict-use',
      caption: 'Now line 2 runs: console.log(age). Notice — no quotes around age. Predict.',
      highlightLines: [2],
      prediction: {
        question: 'Line 2 is console.log(age) — no quotes. What appears in the console?',
        options: [
          'The word age',
          '25 — the machine follows the label to the box and hands over what’s inside',
          'An error — the machine doesn’t know what age means',
        ],
        correctIndex: 1,
        why: 'A bare name (no quotes) tells the machine: “follow this label, fetch what’s in the box.” That fetch happens BEFORE console.log gets anything — the evaluate-first rule from lesson 0.3. With quotes, "age" would have been literal text and printed as the word age.',
      },
    },
    {
      id: 'lookup',
      caption:
        'There it is. The machine saw the name age, followed the label to box #7,204, took out 25, and handed it to console.log. Every single time you use a variable’s name, this label-following happens. It’s so fast you’ll forget it exists — but it always does.',
      highlightLines: [2],
    },
    {
      id: 'vocab',
      caption:
        'You just watched the two halves of the line: creating the variable is called DECLARING it (that’s the “let age” part), and putting a value in is called ASSIGNING (that’s the “= 25” part). One line, two acts, three physical things: box, value, label.',
      highlightLines: [1],
    },
  ],
  Viz: MemoryDiagram,
  underTheHood: (
    <>
      <p>
        The proper vocabulary, worth owning: <code>let</code> is a <strong>keyword</strong> (a
        word reserved by the language), and <code>age</code> is an <strong>identifier</strong> (a
        name you chose).
      </p>
      <p>
        <code>=</code> is the <strong>assignment operator</strong>, and the whole line is a{' '}
        <strong>declaration</strong> with an <strong>initial value</strong>. When someone says
        “declare a variable and initialize it to 25,” they mean exactly the three pictures you
        just watched: reserve a box, place a value, bind a name.
      </p>
      <p>
        That word <strong>bind</strong> is the precise one: the engine keeps a private table
        mapping names to boxes — “age → box #7,204” — and consults it every time a name appears.
      </p>
      <p>
        You never see the table, but knowing it exists explains so much: why a name used before
        it’s created gives a ReferenceError (nothing in the table yet!), and why two variables can
        hold the same value without being connected (two boxes, two labels).
      </p>
      <p>
        One honest disclosure, because this app never lies to you: “a labeled box holding the
        value” is 90% true, and it’s the right picture for numbers, strings and booleans. In Phase
        4 you’ll discover that for big things (objects, arrays), the box holds an <em>arrow</em> to
        the thing instead of the thing itself — and that upgrade explains the single most common
        bug family in JavaScript. The label-and-box picture you learned today is the foundation
        that upgrade stands on.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'In let city = "Chennai";, what is city exactly?',
      options: [
        'The box in memory',
        'The value "Chennai"',
        'A name, bound to the box where "Chennai" is stored',
      ],
      correctIndex: 2,
      why: 'The name is a label pointing at the box — it isn’t the box and isn’t the value. Keeping these three things separate in your head is the entire point of this lesson, and it becomes crucial in Phase 4.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what the console shows:',
      code: 'let age = 25;\nconsole.log("age");',
      accept: ['age'],
      why: 'The quotes make it literal text — the machine prints the characters a-g-e, not the stored 25. Without quotes it would follow the label to the box and print 25. Same quotes-rule as lesson 0.3, now with variables.',
    },
    {
      kind: 'type-output',
      question: 'You run console.log(salary) but never created salary. Type the NAME of the error that stops the program (one word, ends in Error).',
      accept: ['ReferenceError'],
      placeholder: 'SomethingError…',
      why: 'ReferenceError: salary is not defined. The machine checked its name→box table, found no “salary”, and stopped with the exact error you learned to read in lesson 0.5. (Not undefined — that’s for a label that EXISTS with an empty box.)',
    },
  ],
  teachBack: {
    prompt:
      'The big one. Explain to a friend what REALLY happens when let age = 25 runs — the three things, in order — and why “age is not the 25” matters.',
    modelAnswer:
      'When let age = 25 runs, the machine does three things: it borrows a box from memory, it puts the value 25 inside, and it ties the name “age” to that box like a label. So age isn’t the number and isn’t the box — it’s a label pointing at the box. Whenever the program uses age later, the machine follows the label, opens the box, and hands over whatever is inside. That’s why a variable can change (new contents, same label) and why using a name that was never created is an error — there’s no label with that name in the machine’s table.',
  },
  recap: [
    'let age = 25 = three acts: borrow a box, place the value, tie on the name. Declaring + assigning.',
    'The name is a LABEL pointing at the box — it is not the box and not the value.',
    'Using a name = the machine follows the label and fetches the contents. Every time, automatically.',
  ],
}
