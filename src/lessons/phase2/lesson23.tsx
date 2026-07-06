import { AnimatePresence, motion } from 'motion/react'
import { RoughEllipse, RoughLine, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 2.3 — else-if chains & switch
 * Viz: FlowRoad multi-gate for the chain; a case-ladder with fall-through
 * for switch.
 */

const CODE = `let grade = 87;
if (grade >= 90) {
  console.log("A");
} else if (grade >= 80) {
  console.log("B");
} else if (grade >= 70) {
  console.log("C");
} else {
  console.log("Try again");
}`

const SWITCH_CODE = `let day = "SAT";
switch (day) {
  case "SAT":
  case "SUN":
    console.log("Weekend!");
    break;
  case "MON":
    console.log("Ugh.");
    break;
  default:
    console.log("Midweek.");
}`

function GateRow({ y, label, verdict, seed }: { y: number; label: string; verdict?: 'no' | 'yes' | 'skip'; seed: number }) {
  return (
    <g opacity={verdict === 'skip' ? 0.3 : 1}>
      <RoughEllipse cx={130} cy={y} width={150} height={44} seed={seed} fill="var(--color-sticky)" fillStyle="solid" />
      <text x={130} y={y + 5} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill="var(--color-ink)">
        {label}
      </text>
      {verdict === 'no' && (
        <text x={225} y={y + 6} fontFamily="var(--font-hand)" fontSize={17} fontWeight={700} fill="var(--color-marker-coral)">
          false → next gate ↓
        </text>
      )}
      {verdict === 'yes' && (
        <text x={225} y={y + 6} fontFamily="var(--font-hand)" fontSize={17} fontWeight={700} fill="var(--color-marker-teal)">
          true → “B”, done! ✓
        </text>
      )}
      {verdict === 'skip' && (
        <text x={225} y={y + 6} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-ink-soft)">
          never checked
        </text>
      )}
    </g>
  )
}

function ChainAndSwitch({ stepIndex }: { stepIndex: number }) {
  // steps 0–2: the gate chain; steps 3–5: the switch ladder
  if (stepIndex <= 3) {
    const decided = stepIndex >= 1
    return (
      <svg viewBox="0 0 440 300" className="w-full">
        <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={19} fill="var(--color-ink-soft)">
          gates checked top-down — first true wins
        </text>
        <GateRow y={70} label="grade >= 90 ?" verdict={decided ? 'no' : undefined} seed={360} />
        <RoughLine x1={130} y1={94} x2={130} y2={112} seed={361} strokeWidth={2} />
        <GateRow y={135} label="grade >= 80 ?" verdict={decided ? 'yes' : undefined} seed={362} />
        <RoughLine x1={130} y1={159} x2={130} y2={177} seed={363} strokeWidth={2} />
        <GateRow y={200} label="grade >= 70 ?" verdict={decided ? 'skip' : undefined} seed={364} />
        <RoughLine x1={130} y1={224} x2={130} y2={242} seed={365} strokeWidth={2} />
        <g opacity={decided ? 0.3 : 1}>
          <RoughRect x={70} y={248} width={120} height={40} seed={366} />
          <text x={130} y={273} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
            else
          </text>
        </g>
      </svg>
    )
  }
  const fell = stepIndex >= 5
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <text x={40} y={30} fontFamily="var(--font-hand)" fontSize={17} fill="var(--color-ink-soft)">
        switch: one value, a ladder of cases (uses ===)
      </text>
      <RoughRect x={40} y={48} width={140} height={38} seed={370} fill="var(--color-marker-yellow)" />
      <text x={110} y={72} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={600} fill="var(--color-ink)">
        day = "SAT"
      </text>

      {/* ladder */}
      <RoughRect x={220} y={48} width={180} height={40} seed={371} />
      <text x={310} y={73} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
        case "SAT": (empty)
      </text>
      <RoughRect x={220} y={98} width={180} height={40} seed={372} />
      <text x={310} y={123} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
        case "SUN": "Weekend!"
      </text>
      <g opacity={0.35}>
        <RoughRect x={220} y={148} width={180} height={40} seed={373} />
        <text x={310} y={173} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          case "MON": "Ugh."
        </text>
        <RoughRect x={220} y={198} width={180} height={40} seed={374} />
        <text x={310} y={223} textAnchor="middle" fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          default: "Midweek."
        </text>
      </g>

      {/* match arrow + fall-through */}
      <AnimatePresence>
        <motion.g key="match" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <RoughLine x1={182} y1={68} x2={216} y2={68} seed={375} strokeWidth={2} stroke="var(--color-marker-teal)" />
        </motion.g>
        {fell && (
          <motion.g key="fall" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', damping: 16 }}>
            <RoughLine x1={310} y1={88} x2={310} y2={98} seed={376} strokeWidth={2.5} stroke="var(--color-marker-coral)" />
            <text x={325} y={97} fontFamily="var(--font-hand)" fontSize={15} fill="var(--color-marker-coral)">
              ↓ falls through (no break!)
            </text>
            <text x={220} y={265} fontFamily="var(--font-hand)" fontSize={17} fontWeight={700} fill="var(--color-marker-teal)">
              › Weekend!   then break = 🛑 stop
            </text>
          </motion.g>
        )}
      </AnimatePresence>
      {stepIndex === 7 && (
        <text x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-teal)">
          else-if chains for RANGES · switch for exact options
        </text>
      )}
      {stepIndex >= 8 && (
        <text x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-marker-coral)">
          treat every missing break as a bug — until proven a grouping
        </text>
      )}
    </svg>
  )
}

export const lesson23: LessonDef = {
  id: '2.3',
  hook: (
    <>
      <p>
        One fork gives you two roads. Real decisions often need more: grade an exam, route a
        support ticket, price by age group. Two tools today: chaining forks with{' '}
        <code>else if</code>, and a purpose-built ladder called <code>switch</code>.
      </p>
      <p>
        switch comes with a famous trapdoor,{' '}
        <HighlightMark type="underline" color="var(--color-marker-coral)">fall-through</HighlightMark>
        , that once helped take down a national phone network. Really.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'chain',
      caption:
        'An else-if chain is a corridor of gates, checked strictly top-down. grade is 87 — walk with it: gate one asks >= 90?…',
      highlightLines: [2],
    },
    {
      id: 'walk',
      caption:
        '87 >= 90? No — next gate. 87 >= 80? YES → print "B" and the corridor is OVER: every remaining gate (and the else) is skipped without a glance. First true wins, everything after is dead air. One branch runs, always — even in a chain of ten.',
      highlightLines: [4, 5],
    },
    {
      id: 'predict-order',
      caption:
        'Now the question that catches almost everyone. Suppose grade were 95 — that satisfies >= 90 AND >= 80 AND >= 70, all three gates at once. Walk the corridor in your head: what prints?',
      highlightLines: [2, 4],
    },
    {
      id: 'order-answer',
      caption:
        'Only “A”. The first true gate wins and the corridor is OVER — the later gates are never even checked, so overlapping conditions are fine AS LONG AS you order them correctly. Flip the order (>= 70 first) and every grade above 70 would print “C”. The order IS the logic.',
      highlightLines: [2, 4],
    },
    {
      id: 'switch',
      caption:
        'When the question is “does ONE value match one of these exact options?”, the ladder reads cleaner: switch. It takes day, walks down the cases, and compares with strict === (your favorite — no coercion). "SAT" matches the first rung.',
      codeOverride: SWITCH_CODE,
      highlightLines: [2, 3],
    },
    {
      id: 'fall-through',
      caption:
        'But look — case "SAT": has NO code and NO break, so execution FALLS THROUGH into case "SUN" and runs "Weekend!". That’s deliberate here: it’s how you group cases (“SAT or SUN → same road”).',
      codeOverride: SWITCH_CODE,
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'fall-through-break',
      caption: 'Then break — the 🛑 — stops the fall. Without break, it would keep falling into "Ugh." too!',
      codeOverride: SWITCH_CODE,
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'rule',
      caption:
        'The working rules: else-if chains for ranges and mixed conditions (order = logic); switch for one-value-many-exact-options (and remember default = the ladder’s else).',
      codeOverride: SWITCH_CODE,
      highlightLines: [10, 11],
    },
    {
      id: 'rule-break-discipline',
      caption: 'Treat every missing break as a bug until proven a grouping. History agrees — see below.',
      codeOverride: SWITCH_CODE,
      highlightLines: [10, 11],
    },
  ],
  Viz: ChainAndSwitch,
  underTheHood: (
    <>
      <p>
        Precision notes: an else-if chain is not a special syntax — it’s literally an{' '}
        <code>else</code> whose branch contains another <code>if</code>, stacked. That’s why
        exactly one branch ever runs.
      </p>
      <p>
        <code>switch</code> compares with <strong>strict equality (===)</strong>, so{' '}
        <code>case "200"</code> will never match the number 200 — a coercion-free zone, which is
        exactly why we like it.
      </p>
      <p>
        <code>default</code> can sit anywhere in the ladder but belongs at the bottom by
        convention, and yes — it falls through too if unbroken.
      </p>
      <p>
        <strong>💼 On the job —</strong> chains of else-if handling <em>ranges</em> (like our
        grades) appear constantly in test logic. “Status 2xx → pass, 4xx → client error, 5xx →
        server error” is a textbook chain. Getting the gate ORDER wrong there is a classic silent
        test bug: every response matches the first loose gate. When you review test code someday,
        mis-ordered gates and missing breaks are two of the first things your eyes will learn to
        catch.
      </p>
      <p>
        <strong style={{ color: 'var(--color-marker-coral)' }}>Fun fact:</strong> on January 15,
        1990, AT&T’s long-distance phone network collapsed for nine hours. Over 60 million calls
        failed. The root cause: a single misplaced <code>break</code> in a <code>switch</code>{' '}
        statement — in C, the language JavaScript borrowed switch (and its fall-through) from.
        One keyword, one wrong rung of the ladder, a national outage. It remains one of the
        most-cited examples of why tiny control-flow details deserve tests. Languages designed
        after C (like Swift and Go) made break the default.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'For how many values of n can bigPrize() ever run? Type the number.',
      code: 'if (n > 10) { smallPrize(); }\nelse if (n > 100) { bigPrize(); }',
      accept: ['0', 'zero', 'none'],
      placeholder: 'a number…',
      why: 'Zero — a mis-ordered chain: n > 100 implies n > 10, so gate one always wins first. bigPrize() is dead code — no error, no warning, it just silently never runs. Order gates from most specific to least. (Spotting dead branches is a genuine code-review skill.)',
    },
    {
      kind: 'type-output',
      question: 'x is "a" — and notice the first case has NO break. How many numbers print? Type it.',
      code: 'switch (x) {\n  case "a": console.log(1);\n  case "b": console.log(2); break;\n  case "c": console.log(3);\n}',
      accept: ['2', 'two'],
      placeholder: 'a number…',
      why: 'Two — 1 and 2. Once a case matches, execution FALLS THROUGH downward until it hits a break (or the ladder ends), so "a" runs its own line AND case "b"’s. Useful for grouping cases; catastrophic when accidental — ask AT&T. Legal, silent, dangerous: the tester trifecta.',
    },
    {
      kind: 'type-output',
      question: 'status holds the NUMBER 200. Which branch runs? Type its label.',
      code: 'switch (status) {\n  case "200": ok();  break;\n  default:    huh();\n}',
      accept: ['default', 'huh', 'huh()'],
      placeholder: 'case label…',
      why: 'default — switch is an ===-zone: no coercion, ever (lesson 1.9’s liar is banned here). The number 200 slides past case "200" without a nibble. A wonderfully sneaky bug to plant in a quiz — and to find in real code.',
    },
  ],
  teachBack: {
    prompt:
      'Explain to a friend: how does an else-if chain decide which branch runs (and why does gate ORDER matter), and what is switch fall-through — feature and footgun?',
    modelAnswer:
      'An else-if chain is a corridor of gates checked strictly top-down: the first condition that comes out true wins, its branch runs, and every gate below is skipped without being checked. That makes the ORDER part of the logic — put a loose gate like “>= 70” first and it captures everything, turning the gates below into dead code. switch is the other tool: it takes one value and compares it against exact options using strict ===. Its quirk is fall-through: after a match, execution keeps flowing down into the next case until it hits a break. Leaving out break on purpose groups cases (“SAT and SUN both say Weekend”); leaving it out by accident runs code you never intended — a missing break in a switch once took down AT&T’s national phone network for nine hours.',
  },
  recap: [
    'else-if = a corridor of gates, top-down, FIRST true wins — the rest are never checked. Gate order IS the logic.',
    'switch = one value vs exact options, compared with strict === (no coercion). default is its else.',
    'Fall-through: no break → execution keeps falling into the next case. Grouping tool on purpose, national outage by accident (AT&T, 1990).',
  ],
}
