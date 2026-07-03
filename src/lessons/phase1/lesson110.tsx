import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 1.10 — Operators roundup
 * Viz: ExpressionTree — expressions parsed into trees, values bubbling up
 * from the leaves to the root.
 */

const CODE = `let age = 20;
let hasTicket = true;
console.log(age >= 18 && hasTicket);
console.log(!(age > 25) || age === 20);
console.log(2 + 3 * 4);`

function Node({ x, y, label, result, seed }: { x: number; y: number; label: string; result?: string; seed: number }) {
  return (
    <g>
      <RoughEllipse cx={x} cy={y} width={Math.max(64, label.length * 11)} height={40} seed={seed} fill={result ? 'var(--color-marker-yellow)' : undefined} />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={600} fill="var(--color-ink)">
        {label}
      </text>
      <AnimatePresence>
        {result && (
          <motion.text
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            x={x + 44}
            y={y - 14}
            fontFamily="var(--font-hand)"
            fontSize={18}
            fontWeight={700}
            fill="var(--color-marker-teal)"
          >
            → {result}
          </motion.text>
        )}
      </AnimatePresence>
    </g>
  )
}

function Edge({ x1, y1, x2, y2, seed }: { x1: number; y1: number; x2: number; y2: number; seed: number }) {
  return <RoughLine x1={x1} y1={y1} x2={x2} y2={y2} seed={seed} strokeWidth={1.6} stroke="var(--color-ink-soft)" />
}

function ExpressionTree({ stepIndex }: { stepIndex: number }) {
  // Scene A: age >= 18 && hasTicket (steps 1–3)
  if (stepIndex >= 1 && stepIndex <= 3) {
    return (
      <svg viewBox="0 0 440 280" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          age &gt;= 18 && hasTicket — as the machine sees it
        </text>
        <Edge x1={200} y1={80} x2={130} y2={140} seed={260} />
        <Edge x1={240} y1={80} x2={310} y2={140} seed={261} />
        <Edge x1={110} y1={175} x2={80} y2={215} seed={262} />
        <Edge x1={150} y1={175} x2={180} y2={215} seed={263} />
        <Node x={220} y={65} label="&&" seed={264} result={stepIndex >= 3 ? 'true' : undefined} />
        <Node x={130} y={158} label=">=" seed={265} result={stepIndex >= 2 ? 'true' : undefined} />
        <Node x={310} y={158} label="hasTicket" seed={266} result={stepIndex >= 3 ? 'true' : undefined} />
        <Node x={80} y={232} label="age" seed={267} result={stepIndex >= 2 ? '20' : undefined} />
        <Node x={180} y={232} label="18" seed={268} />
        <text x={40} y={278} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
          {stepIndex === 3 ? '&& asks: are BOTH branches true? yes → true' : 'values bubble UP from the leaves'}
        </text>
      </svg>
    )
  }
  // Scene B: !(age > 25) || age === 20 (steps 4–5)
  if (stepIndex === 4 || stepIndex === 5) {
    const done = stepIndex === 5
    return (
      <svg viewBox="0 0 440 280" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          !(age &gt; 25) || age === 20
        </text>
        <Edge x1={190} y1={80} x2={120} y2={140} seed={270} />
        <Edge x1={250} y1={80} x2={320} y2={140} seed={271} />
        <Edge x1={120} y1={175} x2={120} y2={215} seed={272} />
        <Node x={220} y={65} label="||" seed={273} result={done ? 'true' : undefined} />
        <Node x={120} y={158} label="!" seed={274} result={done ? 'true' : undefined} />
        <Node x={320} y={158} label="age === 20" seed={275} result={done ? '(skipped!)' : undefined} />
        <Node x={120} y={232} label="age > 25" seed={276} result={done ? 'false' : undefined} />
        {done && (
          <text x={40} y={278} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
            left side is already true → || never even looked right. Short-circuit!
          </text>
        )}
      </svg>
    )
  }
  // Scene C: 2 + 3 * 4 (step 6)
  if (stepIndex >= 6) {
    return (
      <svg viewBox="0 0 440 280" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          2 + 3 * 4 — precedence draws the tree
        </text>
        <Edge x1={200} y1={90} x2={130} y2={150} seed={280} />
        <Edge x1={240} y1={90} x2={310} y2={150} seed={281} />
        <Edge x1={290} y1={185} x2={260} y2={225} seed={282} />
        <Edge x1={330} y1={185} x2={360} y2={225} seed={283} />
        <Node x={220} y={75} label="+" seed={284} result="14" />
        <Node x={130} y={168} label="2" seed={285} />
        <Node x={310} y={168} label="*" seed={286} result="12" />
        <Node x={260} y={242} label="3" seed={287} />
        <Node x={360} y={242} label="4" seed={288} />
        <text x={40} y={278} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
          * sits DEEPER in the tree → happens first. Want (2+3)*4? Parentheses redraw the tree.
        </text>
      </svg>
    )
  }
  // Scene 0: the cast
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <text x={40} y={40} fontFamily="var(--font-hand)" fontSize={20} fill="var(--color-ink-soft)">
        today’s operators
      </text>
      <text x={40} y={90} fontFamily="var(--font-code)" fontSize={16} fill="var(--color-ink)">
        comparisons:  &gt;  &lt;  &gt;=  &lt;=  ===  !==
      </text>
      <text x={40} y={130} fontFamily="var(--font-code)" fontSize={16} fill="var(--color-ink)">
        logic:  &&  (and)   ||  (or)   !  (not)
      </text>
      <text x={40} y={180} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink-soft)">
        comparisons make booleans (lesson 1.7) —
      </text>
      <text x={40} y={206} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink-soft)">
        logic operators COMBINE those booleans
      </text>
      <text x={40} y={232} fontFamily="var(--font-hand)" fontSize={18} fill="var(--color-ink-soft)">
        into bigger questions.
      </text>
    </svg>
  )
}

export const lesson110: LessonDef = {
  id: '1.10',
  hook: (
    <>
      <p>
        One skill left before your first project: combining small questions into big ones. “Is the
        user an adult AND holding a ticket?” “Is this field empty OR over the limit?” Real
        conditions are built from pieces — glued together with the logic operators{' '}
        <code>&&</code>, <code>||</code> and <code>!</code>.
      </p>
      <p>
        And there’s a secret about how the machine reads them: not left-to-right like you read
        text, but as a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          tree, evaluated from the leaves up
        </HighlightMark>
        . See the tree once, and operator precedence stops being a memorized table and becomes a
        picture.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'cast',
      caption:
        'The cast. Comparisons (>, >=, ===, !==…) each produce a boolean — they’re the boolean factories from lesson 1.7. Logic operators combine those booleans: && means “both must be yes,” || means “at least one yes,” ! flips a yes to a no.',
      highlightLines: [1, 2],
    },
    {
      id: 'tree',
      caption:
        'Line 3: age >= 18 && hasTicket. Here’s how the machine actually reads it — as a tree. The last operator to act (&&) sits at the top; its ingredients hang below. The machine never evaluates left-to-right; it evaluates bottom-to-top.',
      highlightLines: [3],
    },
    {
      id: 'bubble',
      caption:
        'Evaluation starts at the leaves: age is looked up (label → box → 20), and 20 >= 18 becomes true. One branch done — the answer bubbles UP toward the root.',
      highlightLines: [3],
    },
    {
      id: 'root',
      caption:
        'The other branch: hasTicket → true. Now the root has both ingredients: true && true → true. That single boolean is what console.log receives. Every condition you will ever write is a tree like this, evaluated leaves-to-root.',
      highlightLines: [3],
    },
    {
      id: 'predict-combo',
      caption: 'Line 4 stacks three operators: !(age > 25) || age === 20. Work it out on paper if you like — inside-out.',
      highlightLines: [4],
      prediction: {
        question: 'age is 20. What does !(age > 25) || age === 20 evaluate to?',
        options: ['true', 'false', 'An error — too many operators'],
        correctIndex: 0,
        why: 'Inside-out: age > 25 → false. The ! flips it → true. Now || asks “at least one yes?” — the left side is already true, so the answer is true. (In fact the machine didn’t even evaluate age === 20 — more on that laziness in a second.)',
      },
    },
    {
      id: 'short-circuit',
      caption:
        'Watch the right branch: SKIPPED. Once ||’s left side is true, the answer can’t be anything but true — so the machine doesn’t bother with the right side at all. This is called short-circuiting, and && does it too (a false left side ends the story). It’s an optimization today; in Phase 2 it becomes a technique.',
      highlightLines: [4],
    },
    {
      id: 'precedence',
      caption:
        'Last: 2 + 3 * 4 is 14, not 20 — because * binds tighter than +, so the tree puts * deeper, and deeper runs first. That’s all “operator precedence” is: rules for drawing the tree. And the professional cheat code: when in doubt, add parentheses — they redraw the tree exactly how you want, and make your intent readable for free.',
      highlightLines: [5],
    },
  ],
  Viz: ExpressionTree,
  underTheHood: (
    <>
      <p>
        The full operator families, for reference: <strong>arithmetic</strong> (<code>+ − * / %</code>{' '}
        and <code>**</code> for powers), <strong>comparison</strong> (<code>&gt; &lt; &gt;= &lt;=</code>{' '}
        and the strict pair <code>=== !==</code> you swore loyalty to in lesson 1.9),{' '}
        <strong>logical</strong> (<code>&& || !</code>), and <strong>assignment</strong> (<code>=</code>{' '}
        plus the shortcuts <code>+= −= *= /=</code> from lesson 1.3). Precedence order, roughly:{' '}
        <code>!</code> first, then arithmetic (<code>*</code> before <code>+</code>), then
        comparisons, then <code>&&</code>, then <code>||</code>, with <code>=</code> dead last.
        Don’t memorize it — parenthesize it.
      </p>
      <p>
        A small honest disclosure for later: <code>&&</code> and <code>||</code> secretly return{' '}
        <em>the actual value</em> of one of their sides, not always a manufactured boolean —{' '}
        <code>"hello" || "fallback"</code> gives "hello", which programmers exploit for defaults.
        That trick only makes full sense after truthy/falsy (lesson 2.2), so file it as a preview,
        not homework. Short-circuiting is also load-bearing in real code:{' '}
        <code>user && user.name</code> deliberately uses the skip to avoid touching{' '}
        <code>.name</code> when there’s no user.
      </p>
      <p>
        Why this lesson matters to your career, in one sentence: <strong>a test assertion IS a
        boolean expression</strong> — every “did it pass?” your future test suites answer is one of
        these trees evaluating to true or false. Reading and writing compound conditions fluently
        (“status is 200 AND body includes the id AND response time under 2s”) is the daily grammar
        of test automation. You now have the full grammar of Phase 1 — time for the checkpoint.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type what 10 > 5 && 3 > 7 evaluates to:',
      accept: ['false'],
      placeholder: 'a value…',
      why: '10 > 5 is true, but 3 > 7 is false — and && demands BOTH. One false anywhere in an && chain sinks the whole thing → false. (Bonus: the machine short-circuits && the moment it meets a false.)',
    },
    {
      kind: 'type-output',
      question: 'A tree you have not climbed yet — type what 5 + 2 * 3 gives:',
      accept: ['11'],
      placeholder: 'a value…',
      why: 'Precedence draws the tree: * binds tighter, so 2 * 3 is a subtree that resolves to 6, then 5 + 6 = 11. Left-to-right reading is a human habit; the machine climbs trees. Want 21? Write (5 + 2) * 3 — parentheses redraw the tree.',
    },
    {
      kind: 'type-output',
      question: 'true || someScaryExpression — no matter how scary the right side is, the whole thing always evaluates to? Type it.',
      accept: ['true'],
      placeholder: 'a value…',
      why: '|| stops the instant its left side is true — the answer is locked in, so the scary right side is NEVER evaluated. Real code leans on this deliberately (e.g. avoiding a lookup that would fail). Laziness as a feature.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: how does the machine evaluate age >= 18 && hasTicket (use the tree picture), and why is 2 + 3 * 4 equal to 14 without any memorized rules?',
    modelAnswer:
      'The machine doesn’t read an expression left to right — it builds a tree. The operator that acts last sits at the top, and its ingredients hang below: for age >= 18 && hasTicket, the && is the root, with the comparison on one branch and hasTicket on the other. Evaluation starts at the leaves and bubbles up: age becomes 20, then 20 >= 18 becomes true, hasTicket becomes true, and finally the root asks “both true?” — yes → true. Precedence is just the rulebook for drawing that tree: * binds tighter than +, so in 2 + 3 * 4 the multiplication sits deeper and runs first (12), then 2 + 12 = 14. And if you ever doubt the tree, add parentheses — they force it to look exactly how you intend.',
  },
  recap: [
    'Expressions are TREES: the last operator to act sits at the root, and values bubble up from the leaves.',
    '&& = both must be true. || = at least one. ! flips. And both && and || short-circuit — they stop the moment the answer is locked in.',
    'Precedence just draws the tree (* deeper than +, so 2 + 3 * 4 = 14). When in doubt: parentheses — free clarity, zero cost.',
  ],
}
