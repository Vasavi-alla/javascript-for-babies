import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 5.2 — Hoisting, demystified
 * Pass 1 registers the three declaration kinds DIFFERENTLY: var → name +
 * undefined; let/const → name registered but UNINITIALIZED (the temporal dead
 * zone — reads throw); function declarations → complete. Function expressions
 * are just variables holding functions and follow their variable's rules.
 * Pays the hoisting IOU written back in lesson 1.4.
 */

const CODE = `console.log(a);
var a = 1;

console.log(b);
let b = 2;`

const EXPR_CODE = `hoisted();

function hoisted() {
  console.log("declarations: ready early");
}

notYet();

const notYet = () => {
  console.log("expressions: just a variable");
};`

interface Row {
  name: string
  kind: string
  value: string
  tone: 'ok' | 'warn' | 'dead'
}
interface View {
  rows: Row[]
  verdict?: { text: string; error?: boolean }
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the table/verdict */
  badge?: string
}

const VIEWS: View[] = [
  {
    rows: [
      { name: 'a', kind: 'var', value: 'undefined', tone: 'ok' },
      { name: 'b', kind: 'let', value: '⛔ uninitialized', tone: 'dead' },
    ],
    console: [],
    note: 'same pass 1, DIFFERENT registrations — this table is the whole lesson',
  },
  {
    rows: [
      { name: 'a', kind: 'var', value: 'undefined', tone: 'warn' },
      { name: 'b', kind: 'let', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'reading a var early: silent undefined' },
    console: ['undefined'],
    note: 'silent — the program limps on with a wrong value. The classic ancient-bug source.',
  },
  {
    rows: [
      { name: 'a', kind: 'var', value: '1', tone: 'ok' },
      { name: 'b', kind: 'let', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'ReferenceError: Cannot access \'b\' before initialization', error: true },
    console: ['undefined'],
    note: 'let/const in the dead zone THROW — loud, immediate, at the exact guilty line',
  },
  {
    rows: [
      { name: 'a', kind: 'var', value: '1', tone: 'ok' },
      { name: 'b', kind: 'let', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'ReferenceError: Cannot access \'b\' before initialization', error: true },
    console: ['undefined'],
    note: 'this “error” is let/const’s gift: it converts var’s silent, far-away bug into a loud, local one',
    badge: 'you met the name “temporal dead zone” in 3.5 — now you own its machinery',
  },
  {
    rows: [
      { name: 'hoisted', kind: 'function', value: 'ƒ complete', tone: 'ok' },
      { name: 'notYet', kind: 'const', value: '⛔ uninitialized', tone: 'dead' },
    ],
    console: ['declarations: ready early'],
    note: 'a function DECLARATION is registered whole — callable before its line',
  },
  {
    rows: [
      { name: 'hoisted', kind: 'function', value: 'ƒ complete', tone: 'ok' },
      { name: 'notYet', kind: 'const', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'ReferenceError: Cannot access \'notYet\' before initialization', error: true },
    console: ['declarations: ready early'],
    note: 'notYet() throws too — the SAME temporal dead zone, on a completely different-looking declaration',
  },
  {
    rows: [
      { name: 'hoisted', kind: 'function', value: 'ƒ complete', tone: 'ok' },
      { name: 'notYet', kind: 'const', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'ReferenceError: Cannot access \'notYet\' before initialization', error: true },
    console: ['declarations: ready early'],
    note: 'why: notYet is not a function declaration — it’s a CONST that happens to hold a function (3.4: functions are values!)',
    badge: 'function EXPRESSIONS follow their VARIABLE’s rule. const’s rule is the dead zone.',
  },
  {
    rows: [
      { name: 'hoisted', kind: 'function', value: 'ƒ complete', tone: 'ok' },
      { name: 'notYet', kind: 'const', value: '⛔ uninitialized', tone: 'dead' },
    ],
    verdict: { text: 'ReferenceError: Cannot access \'notYet\' before initialization', error: true },
    console: ['declarations: ready early'],
    note: 'one question settles every hoisting puzzle you will ever meet',
    badge: '“what KIND of declaration is this name?” — the function part is irrelevant',
  },
]

function HoistTable({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 336" className="w-full">
      <text x={24} y={32} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the registry after pass 1 — three kinds, three treatments
      </text>
      {/* header */}
      <text x={50} y={62} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink-soft)">name</text>
      <text x={150} y={62} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink-soft)">declared with</text>
      <text x={280} y={62} fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink-soft)">registered as</text>

      {view.rows.map((r, i) => {
        const y = 78 + i * 48
        const color = r.tone === 'dead' ? 'var(--color-marker-coral)' : r.tone === 'warn' ? 'var(--color-marker-coral)' : 'var(--color-ink)'
        return (
          <motion.g key={`${r.name}-${r.value}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <RoughRect x={36} y={y} width={368} height={36} seed={841 + i} strokeWidth={1.6} stroke={r.tone === 'dead' ? 'var(--color-marker-coral)' : 'var(--color-ink)'} roughness={r.tone === 'dead' ? 2.2 : 1.2} fill={r.tone === 'dead' ? 'color-mix(in srgb, var(--color-marker-coral) 10%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
            <text x={50} y={y + 23} fontFamily="var(--font-code)" fontSize={12.5} fontWeight={700} fill="var(--color-ink)">{r.name}</text>
            <text x={150} y={y + 23} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">{r.kind}</text>
            <text x={280} y={y + 23} fontFamily="var(--font-code)" fontSize={12} fontWeight={600} fill={color}>{r.value}</text>
          </motion.g>
        )
      })}

      {/* dead zone label */}
      {view.rows.some((r) => r.tone === 'dead') && (
        <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-marker-coral)">
          ⛔ = the temporal dead zone — using the name before its line THROWS
        </text>
      )}

      {/* verdict card */}
      <AnimatePresence mode="wait">
        {view.verdict && (
          <motion.g key={view.verdict.text} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={44} y={200} width={352} height={32} seed={845} strokeWidth={1.8} stroke={view.verdict.error ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={view.verdict.error ? 'color-mix(in srgb, var(--color-marker-coral) 12%, transparent)' : 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)'} fillStyle="solid" />
            <text x={220} y={221} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={600} fill={view.verdict.error ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
              {view.verdict.text}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={253} width={352} fontSize={10.5} seed={847} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={286} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={13} /></motion.text>
      </AnimatePresence>

      <RoughRect x={40} y={298} width={360} height={30} seed={846} strokeWidth={1.5} />
      <text x={52} y={294} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">console</text>
      <text x={58} y={318} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const ROUTINE_EXERCISE: CodeExerciseDef = {
  id: 'l52-routine',
  title: 'early birds and patient variables',
  task: 'Demonstrate mastery of both hoisting behaviors in one small program: a function declaration you deliberately call early, and a function expression you correctly call only after its line.',
  steps: [
    <>
      Very first line: call <code>stretch()</code> — its function DECLARATION lives at the bottom
      of the file and returns <code>"10 min"</code>. Print the returned value.
    </>,
    <>
      Then define <code>wake</code> as a <code>const</code> ARROW function returning{' '}
      <code>"6am"</code>, and print <code>wake()</code> — called after its line, as expressions
      require.
    </>,
  ],
  starter: '',
  expectedOutput: ['10 min', '6am'],
  mustUse: [
    { test: /stretch\s*\(\s*\)[\s\S]*function\s+stretch\s*\(/, label: 'stretch is CALLED above its declaration' },
    { test: /const\s+wake\s*=\s*\(?\s*\)?\s*=>/, label: 'wake is a const arrow function (an expression)' },
    { test: /const\s+wake[\s\S]*wake\s*\(\s*\)/, label: 'wake is called only AFTER its line' },
  ],
  mustNotUse: [
    { test: /function\s+wake/, label: 'wake must be an expression, not a declaration — that’s the point' },
  ],
  modelAnswer: `console.log(stretch());

const wake = () => "6am";
console.log(wake());

function stretch() {
  return "10 min";
}`,
}

export const lesson52: LessonDef = {
  id: '5.2',
  hook: (
    <>
      <p>
        Lesson 1.4 called <code>var</code> "old and leaky" and promised the full story in Phase 5.
        This is that lesson. The word you'll hear in every interview is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          hoisting
        </HighlightMark>{' '}
        — and after 5.1 you already know the machinery behind it: pass 1 registers names before
        any line runs.
      </p>
      <p>
        Today's whole lesson is one table: the three declaration kinds get{' '}
        <strong>three different registrations</strong>. <code>var</code> → name + <code>undefined</code>{' '}
        (reads early, silently wrong). <code>let</code>/<code>const</code> → name registered but{' '}
        <em>untouchable</em> until their line (the <strong>temporal dead zone</strong> — reads
        throw, loudly).
      </p>
      <p>
        Function declarations → registered <em>complete</em>. Learn the table and every hoisting
        puzzle ever written becomes arithmetic.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-table',
      caption:
        'Pass 1 sweeps this code and registers both names — but look at the registry: a (var) holds the placeholder undefined, while b (let) is marked UNINITIALIZED. Both names exist before any line runs. What differs is what touching them early DOES.',
      highlightLines: [2, 5],
    },
    {
      id: 'var-silent',
      caption:
        'Line 1 reads a → undefined, no complaint. This is var’s leak from 1.4, precisely: your program continues with a value you never meant, and the bug surfaces far away from its cause — maybe as NaN in some calculation three files later. Silent wrongness is the most expensive kind.',
      highlightLines: [1, 2],
    },
    {
      id: 'tdz-throws',
      caption:
        'Line 4 reads b → ReferenceError: Cannot access \'b\' before initialization. b IS registered (pass 1 saw it) but sits in the TEMPORAL DEAD ZONE — the stretch of time between the scope starting and its let line running. Touching it there throws AT THE GUILTY LINE.',
      highlightLines: [4, 5],
    },
    {
      id: 'tdz-loud-vs-silent',
      caption:
        'This “error” is let/const’s gift, not a flaw: it converts var’s silent, far-away bug into a loud, local one. You met the name “temporal dead zone” back in 3.5 — now you own the exact machinery that produces it.',
      highlightLines: [4, 5],
    },
    {
      id: 'declarations-early',
      caption:
        'New code, the other axis: FUNCTIONS. hoisted() on line 1 works — function declarations register complete during pass 1, as 5.1 showed. For declarations, hoisting is a genuine convenience: you can order a file top-down, main logic first, helpers below.',
      codeOverride: EXPR_CODE,
      highlightLines: [1, 3, 4, 5],
    },
    {
      id: 'notyet-throws',
      caption:
        'But notYet() on line 7 throws — ReferenceError, the TDZ again. Same-looking "call it above its line" move as hoisted() just made work perfectly — and this time it crashes.',
      highlightLines: [7, 9, 10, 11],
    },
    {
      id: 'expressions-are-variables',
      caption:
        'Why the difference? notYet is not a function declaration; it’s a CONST that happens to hold a function (lesson 3.4: functions are values!). Expressions follow their VARIABLE’s hoisting rules, and const’s rule is the dead zone.',
      highlightLines: [9, 10, 11],
    },
    {
      id: 'one-question-settles',
      caption:
        'One sentence settles every hoisting puzzle you will ever meet: “what kind of DECLARATION is this name?” — the function part is irrelevant. Ask that question first, always.',
      highlightLines: [1, 3, 4, 5, 7, 9, 10, 11],
    },
  ],
  Viz: HoistTable,
  underTheHood: (
    <>
      <p>
        The full table, worth memorizing: <code>function f() {'{}'}</code> → registered complete.{' '}
        <code>var x</code> → registered as <code>undefined</code>. <code>let</code>/<code>const</code>{' '}
        → registered uninitialized (TDZ; reads throw ReferenceError).
      </p>
      <p>
        And <code>var</code> has a second leak this table explains: it ignores block scope — a{' '}
        <code>var</code> inside an <code>if</code> registers on the whole <em>function's</em>{' '}
        context, escaping the braces that 3.5 said contain things.
      </p>
      <p>
        Why does <code>var</code> still exist? Compatibility — the web never breaks old pages. Your
        rule as a modern developer stands exactly as 1.4 stated it: <code>const</code> by default,{' '}
        <code>let</code> when reassigning, <code>var</code> only when reading old code. Now you can
        also <em>explain</em> the rule, which is what interviews actually test.
      </p>
      <p>
        Interviewers phrase this a dozen ways — "is let hoisted?" being the trap. The precise
        answer: <em>yes, all declarations are registered in pass 1 — but let/const are registered
        uninitialized, so unlike var they throw instead of reading undefined.</em> That one
        sentence separates memorizers from understanders.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'console.log(x);\nvar x = 3;',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'var registers the name with undefined in pass 1; the assignment waits for pass 2. Silent, no error — the leak.',
    },
    {
      kind: 'type-output',
      question: 'This code throws. Type the ERROR NAME (the part before the colon):',
      code: 'console.log(y);\nlet y = 3;',
      accept: ['ReferenceError', 'referenceerror', 'Reference Error'],
      placeholder: 'the error name…',
      why: 'y is registered but uninitialized — the temporal dead zone. Touching it before its line throws ReferenceError: Cannot access \'y\' before initialization. Loud beats silent.',
    },
    {
      kind: 'type-output',
      question: 'Which kind can be safely CALLED above its line — a function declaration or a function expression? Type one word: declaration or expression.',
      accept: ['declaration', 'Declaration', 'a declaration', 'function declaration'],
      placeholder: 'declaration / expression…',
      why: 'Declarations register complete in pass 1. Expressions are just variables holding functions — they follow their variable’s rules (const/let → dead zone; var → undefined, and calling undefined throws TypeError).',
    },
  ],
  PlayExtra: () => <CodeExercise def={ROUTINE_EXERCISE} />,
  teachBack: {
    prompt:
      'The interview classic: “Is let hoisted?” Give the precise answer — covering what pass 1 does to var, let/const, and function declarations, and what the temporal dead zone actually is.',
    modelAnswer:
      'Yes — ALL declarations are hoisted, in the sense that pass 1 (the creation phase) registers every name before any line runs. What differs is the registration. var is registered holding undefined, so reading it early silently gives undefined. let and const are registered but marked uninitialized — the stretch between the scope starting and their line executing is the temporal dead zone, and touching the name there throws ReferenceError at that exact line. Function declarations are registered complete, body and all, so they’re callable above their line. Function expressions are just variables that hold functions, so they follow their variable’s rule — a const arrow function is in the dead zone like any const. let/const’s throwing is a feature: it turns var’s silent far-away bug into a loud local one.',
  },
  recap: [
    'All declarations register in pass 1 — differently: var → undefined; let/const → uninitialized (TDZ, reads THROW); function declarations → complete.',
    'The TDZ error is a feature: loud and local beats var’s silent undefined leaking into calculations far away.',
    'Function expressions are variables holding functions — they hoist by their variable’s rules. Ask “what kind of declaration?”, never “is it a function?”.',
  ],
}
