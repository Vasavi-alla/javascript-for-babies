import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.1 — if / else
 * Viz: FlowRoad — the program as a road that forks; a token travels the
 * taken path, the untaken path grays out.
 */

const CODE = `let age = 16;
if (age >= 18) {
  console.log("Welcome in!");
} else {
  console.log("Adults only.");
}
console.log("Program continues…");`

// token position per step
const TOKEN: Array<{ x: number; y: number } | null> = [
  { x: 220, y: 30 },
  { x: 220, y: 95 },
  { x: 220, y: 95 }, // prediction — still at the fork
  { x: 320, y: 185 },
  { x: 220, y: 262 },
  { x: 220, y: 262 },
]

function FlowRoad({ stepIndex }: { stepIndex: number }) {
  const token = TOKEN[stepIndex] ?? TOKEN[0]
  const decided = stepIndex >= 3
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      {/* roads */}
      <RoughLine x1={220} y1={38} x2={220} y2={68} seed={320} strokeWidth={2} />
      {/* the fork: condition */}
      <RoughEllipse cx={220} cy={95} width={150} height={50} seed={321} fill="var(--color-sticky)" fillStyle="solid" />
      <text x={220} y={101} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
        age &gt;= 18 ?
      </text>
      {/* left road (true) */}
      <g opacity={decided ? 0.25 : 1}>
        <RoughLine x1={185} y1={115} x2={120} y2={155} seed={322} strokeWidth={2} />
        <text x={115} y={135} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-teal)">
          true
        </text>
        <RoughRect x={55} y={160} width={135} height={46} seed={323} />
        <text x={122} y={188} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
          "Welcome in!"
        </text>
        <RoughLine x1={122} y1={210} x2={200} y2={245} seed={324} strokeWidth={2} />
        {decided && (
          <text x={70} y={228} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
            (never ran)
          </text>
        )}
      </g>
      {/* right road (false) */}
      <g>
        <RoughLine x1={255} y1={115} x2={320} y2={155} seed={325} strokeWidth={2} />
        <text x={300} y={135} fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-marker-coral)">
          false
        </text>
        <RoughRect x={252} y={160} width={135} height={46} seed={326} />
        <text x={320} y={188} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
          "Adults only."
        </text>
        <RoughLine x1={320} y1={210} x2={240} y2={245} seed={327} strokeWidth={2} />
      </g>
      {/* rejoined road */}
      <RoughRect x={130} y={248} width={180} height={40} seed={328} strokeWidth={1.5} />
      <text x={220} y={273} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">
        "Program continues…"
      </text>

      {/* the traveling token */}
      <AnimatePresence>
        {token && (
          <motion.g animate={{ x: token.x, y: token.y }} transition={{ type: 'spring', damping: 16 }}>
            <circle cx={0} cy={0} r={10} fill="var(--color-marker-yellow)" stroke="var(--color-ink)" strokeWidth={2} />
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

export const lesson21: LessonDef = {
  id: '2.1',
  hook: (
    <>
      <p>
        Until now, every program ran straight down like a shopping list — the same thing, every
        time. Today your programs learn to <em>choose</em>. The tool is <code>if</code>/<code>else</code>,
        and the picture is a{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          fork in the road
        </HighlightMark>
        : the program travels down, hits a question, and takes exactly one of two paths.
      </p>
      <p>
        Every login screen, every discount rule, every “test passed / test failed” verdict is this
        fork. Master the picture here, and Phase 2 is mostly downhill.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'road',
      caption:
        'Meet the road. The program (our yellow traveler) starts at the top and moves down, line by line — that part you know. But ahead: a fork, guarded by a question.',
      highlightLines: [1],
    },
    {
      id: 'condition',
      caption:
        'The traveler reaches the fork. The if takes whatever is in its parentheses and EVALUATES it — the expression tree from lesson 1.10 runs right here: age >= 18 → 16 >= 18 → false. The fork’s question always boils down to one boolean.',
      highlightLines: [2],
    },
    {
      id: 'predict-path',
      caption: 'The condition came out false. Before pressing next — which message gets printed?',
      highlightLines: [2],
      prediction: {
        question: 'age is 16, so age >= 18 is false. What does this program print?',
        options: [
          '"Welcome in!" then "Program continues…"',
          '"Adults only." then "Program continues…"',
          'Both messages, then "Program continues…"',
        ],
        correctIndex: 1,
        why: 'false sends the traveler down the else road — the if road is simply never walked. One fork, ONE path taken, always. (And the line after the whole if/else runs regardless — the roads rejoin.)',
      },
    },
    {
      id: 'else-road',
      caption:
        'Down the false road. Look at the left branch: grayed out, never ran. Remember lesson 0.5, where an error made line 3 unreachable? Same “never ran” — but this time by design. Choosing which code does NOT run is half the power of if.',
      highlightLines: [4, 5],
    },
    {
      id: 'rejoin',
      caption:
        'And the roads rejoin: line 7 runs no matter which path was taken. The braces { } are the road markers — everything inside belongs to that branch, everything after the closing brace is common road again.',
      highlightLines: [7],
    },
    {
      id: 'wrap',
      caption:
        'That’s the whole machine: evaluate one boolean, walk one road, rejoin. else is optional, by the way — an if alone just means “maybe do this extra bit, then continue.” Everything else in this phase is variations on this fork.',
    },
  ],
  Viz: FlowRoad,
  underTheHood: (
    <>
      <p>
        Anatomy, properly named: <code>if</code> is a keyword; the parenthesized part is the{' '}
        <strong>condition</strong> (any expression — it gets evaluated to a boolean, coercing if it
        must, which is tomorrow’s lesson); each braced section is a <strong>block</strong>; and the
        two blocks are the <strong>branches</strong>. Programmers say “the code branches” or “take
        the else branch” — the road picture, in words. A subtlety worth knowing early: the braces
        are technically optional for single statements, but professionals write them <em>always</em>{' '}
        — a famous Apple security bug (“goto fail”, 2014) happened exactly because an unbraced
        branch silently swallowed a second line.
      </p>
      <p>
        For your future job: test code is <em>full</em> of forks — “if the element is visible,
        click it; else fail with a screenshot.” But more importantly, <strong>every bug report
        you’ll ever write is a story about a branch</strong>: expected the true road, the program
        took the false one. Being able to point at the exact fork — and the exact boolean that
        misfired — is what separates “it’s broken” from a bug report developers love.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> your processor
        literally gambles on these forks. Modern CPUs use a <em>branch predictor</em> — dedicated
        silicon that guesses which road the code will take BEFORE the condition is even evaluated,
        and starts working ahead on the guessed path. It guesses right well over 90% of the time,
        and when it’s wrong it throws the work away and starts over. Billions of tiny bets per
        second, happening under every if you’ll ever write.
      </p>
    </>
  ),
  quiz: [
    {
      question: 'let temp = 30; if (temp > 25) { console.log("Hot"); } console.log("Done"); — what prints?',
      options: ['Only "Hot"', '"Hot" then "Done"', 'Only "Done"'],
      correctIndex: 1,
      why: '30 > 25 is true → the if block runs ("Hot"). Then the roads rejoin: "Done" is after the whole if, so it runs regardless. No else here — an if alone is a legal “maybe do extra” fork.',
    },
    {
      question: 'In if (score >= 50) { … } else { … }, when the condition is true, what happens to the else block?',
      options: [
        'It runs after the if block finishes',
        'It is skipped entirely — one fork, one road',
        'It runs only if the if block errors',
      ],
      correctIndex: 1,
      why: 'Exactly one branch runs, ever. The untaken road isn’t postponed or saved — it simply never happens on this run. (Next run, with different data, it might be the chosen one.)',
    },
    {
      question: 'What must the condition inside if (…) ultimately become?',
      options: [
        'A number',
        'A single boolean — the expression is evaluated first, like any expression',
        'Text describing the choice',
      ],
      correctIndex: 1,
      why: 'The fork asks one yes/no question. Whatever you put in the parentheses — comparison, && tree, even a lone variable — gets evaluated down to one true or false. (What if it isn’t a boolean at all? That’s truthy/falsy — next lesson.)',
    },
  ],
  teachBack: {
    prompt:
      'Explain if/else to a friend using the fork-in-the-road picture: what happens at the fork, what happens to the road not taken, and where do the roads rejoin?',
    modelAnswer:
      'A program normally runs straight down, but an if statement puts a fork in the road. At the fork, the machine evaluates the condition in parentheses down to a single true or false. True sends it down the if road; false sends it down the else road — exactly one road is ever walked, and the code on the other road simply never runs that time. The braces mark where each road starts and ends, and after the closing brace the roads rejoin: whatever comes next runs no matter which branch was taken. Every decision software makes — logins, discounts, pass/fail — is one of these forks.',
  },
  recap: [
    'if evaluates its condition to ONE boolean, then walks exactly one road. The other branch never runs — by design.',
    'Braces mark the branch territory; after them, the roads rejoin and code runs regardless. else is optional.',
    'Fun fact: CPUs bet on your forks (branch prediction) and win >90% of the time — billions of gambles per second.',
  ],
}
