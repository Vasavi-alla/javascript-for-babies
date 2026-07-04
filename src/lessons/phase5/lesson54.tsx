import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'

/**
 * 5.4 — this
 * The single sentence that dissolves the topic: `this` is decided AT CALL
 * TIME by HOW the call is made — never by where the function is written
 * (the exact opposite of 5.3's ropes). Viz: ONE function (whoAmI), called
 * four different ways, filling in a growing comparison table — same
 * function, different answer, every row. Four rules: implicit (dot),
 * default (bare), explicit (bind/call/apply). Arrows have NO own this —
 * they borrow lexically.
 */

const CODE = `function whoAmI() {
  return this.name;
}

const cat = { name: "Biscuit" };
cat.speak = whoAmI;

cat.speak();

const loose = cat.speak;
loose();

const bound = whoAmI.bind({ name: "Rex" });
bound();`

const ARROW_CODE = `const nest = {
  name: "Nest",
  hatch() {
    const peep = () => this.name;
    return peep();
  },
};

nest.hatch();`

interface Row {
  called: string
  result: string
  why: string
  bad?: boolean
  pending?: boolean
  extra?: string
}
interface View {
  rows: Row[]
  legend?: boolean
  console: string[]
  note: string
}

const ROW_IMPLICIT_PENDING: Row = { called: 'cat.speak()', result: '…', why: 'calculating…', pending: true }
const ROW_IMPLICIT: Row = { called: 'cat.speak()', result: 'cat { name: "Biscuit" }', why: 'dot → left of it' }
const ROW_DEFAULT_PENDING: Row = { called: 'loose()', result: '…', why: 'calculating…', pending: true }
const ROW_DEFAULT: Row = { called: 'loose()', result: 'nothing useful (global/undefined)', why: 'no dot → default rule', bad: true }
const ROW_DEFAULT_BUG: Row = { ...ROW_DEFAULT, extra: '⚠ classic bug: handed off as a callback, the dot vanishes' }
const ROW_EXPLICIT_PENDING: Row = { called: 'bound()', result: '…', why: 'calculating…', pending: true }
const ROW_EXPLICIT: Row = { called: 'bound()', result: 'Rex { name: "Rex" }', why: 'explicit → bind welded it' }
const ROW_EXPLICIT_APPLY: Row = { ...ROW_EXPLICIT, extra: 'cousins: call = same, right now. apply = same, args as array' }
const ROW_ARROWS: Row = { called: 'peep() — inside nest.hatch()', result: 'Nest { name: "Nest" }', why: 'no own this → borrows birthplace' }
const ROW_ARROWS_TRACE: Row = { ...ROW_ARROWS, extra: 'traced: hatch called via dot → nest; peep just borrows it' }

const VIEWS: View[] = [
  {
    rows: [], console: [],
    note: 'this.name can’t be answered by reading the function alone — it’s decided at CALL time. Watch the table fill in.',
  },
  {
    rows: [ROW_IMPLICIT_PENDING], console: [],
    note: 'First call: cat.speak() — through a DOT. This is the very same whoAmI function from above, just attached to cat.',
  },
  {
    rows: [ROW_IMPLICIT], console: ['Biscuit'],
    note: 'Revealed: this = cat. Rule one, IMPLICIT: called through a dot, this is whatever sits left of it.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_PENDING], console: ['Biscuit'],
    note: 'Second call: loose() — the SAME function, copied into a bare variable, called with no dot at all.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT], console: ['Biscuit', 'undefined'],
    note: 'Revealed: this is lost. Rule two, DEFAULT: no dot → the global object (or undefined in strict mode)',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG], console: ['Biscuit', 'undefined'],
    note: 'Name it precisely: this is the “lost this” bug — the single most common this-mistake in real code.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT_PENDING], console: ['Biscuit', 'undefined'],
    note: 'Third call: bound() — a NEW function made with whoAmI.bind({ name: "Rex" }). bind welds a this before the call ever happens.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT], console: ['Biscuit', 'undefined', 'Rex'],
    note: 'Revealed: this = Rex, permanently. Rule three, EXPLICIT: bind (or call, or apply) sets this directly — no future call can override it.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT_APPLY], console: ['Biscuit', 'undefined', 'Rex'],
    note: 'bind has two cousins worth knowing by name: call runs immediately with a chosen this; apply is call’s twin, arguments as an array.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT_APPLY, ROW_ARROWS], console: ['Biscuit', 'undefined', 'Rex', 'Nest'],
    note: 'New code, new kind of function: peep is an ARROW. Arrows have no this of their own — they read it like any outer variable, from where they’re written.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT_APPLY, ROW_ARROWS_TRACE], console: ['Biscuit', 'undefined', 'Rex', 'Nest'],
    note: 'Traced: hatch was called as nest.hatch() — the dot rule, this = nest. peep just borrows that same this.',
  },
  {
    rows: [ROW_IMPLICIT, ROW_DEFAULT_BUG, ROW_EXPLICIT_APPLY, ROW_ARROWS_TRACE], legend: true, console: ['Biscuit', 'undefined', 'Rex', 'Nest'],
    note: 'Four calls, four different answers, the SAME functions each time. That table IS the whole lesson.',
  },
]

const TABLE_TOP = 34
const ROW_SLOT = 44

function ThisTable({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const legendY = TABLE_TOP + 4 * ROW_SLOT + 10
  const noteY = legendY + (view.legend ? 56 : 8)
  const consoleY = noteY + 24

  return (
    <svg viewBox={`0 0 440 ${consoleY + 40}`} className="w-full">
      <text x={26} y={20} fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">called as</text>
      <text x={186} y={20} fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">this becomes</text>
      <text x={326} y={20} fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">why</text>

      {view.rows.map((row, i) => {
        const y = TABLE_TOP + i * ROW_SLOT
        return (
          <motion.g key={row.called} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            <RoughRect
              x={20}
              y={y}
              width={400}
              height={30}
              seed={880 + i}
              strokeWidth={row.bad ? 2.2 : 1.7}
              roughness={row.pending ? 2.4 : 1.3}
              stroke={row.bad ? 'var(--color-marker-coral)' : 'var(--color-ink)'}
              fill={row.bad ? 'color-mix(in srgb, var(--color-marker-coral) 8%, transparent)' : 'var(--color-paper-raised, #fff)'}
              fillStyle="solid"
            />
            <text x={26} y={y + 20} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{row.called}</text>
            <AnimatePresence mode="wait">
              <motion.text
                key={row.result}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                x={186}
                y={y + 20}
                fontFamily="var(--font-code)"
                fontSize={9}
                fontWeight={row.pending ? 400 : 700}
                fill={row.pending ? 'var(--color-ink-soft)' : row.bad ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}
              >
                {row.result}
              </motion.text>
            </AnimatePresence>
            <text x={326} y={y + 20} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{row.why}</text>
            {row.extra && (
              <motion.text initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={26} y={y + 40} fontFamily="var(--font-hand)" fontSize={9} fontWeight={700} fill={row.bad ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'}>
                {row.extra}
              </motion.text>
            )}
          </motion.g>
        )
      })}

      {view.legend && (
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <RoughRect x={20} y={legendY} width={400} height={44} seed={999} strokeWidth={1.8} fill="var(--color-marker-yellow)" fillStyle="solid" />
          <text x={220} y={legendY + 19} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">
            new › explicit (bind/call/apply) › implicit (dot) › default (bare)
          </text>
          <text x={220} y={legendY + 36} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">
            arrows skip this list — they borrow from their birthplace
          </text>
        </motion.g>
      )}

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={noteY} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={12} /></motion.text>
      </AnimatePresence>

      <RoughRect x={20} y={consoleY} width={400} height={30} seed={1000} strokeWidth={1.5} />
      <text x={30} y={consoleY - 6} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">console</text>
      <text x={36} y={consoleY + 20} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
        {view.console.length === 0 ? '(nothing yet)' : view.console.join('   ·   ')}
      </text>
    </svg>
  )
}

const ANNOUNCER_EXERCISE: CodeExerciseDef = {
  id: 'l54-announcer',
  title: 'the announcer that never loses its team',
  task: 'Build a method that works through the dot — then make a detached copy that STILL works, by welding its this before handing it off.',
  steps: [
    <>
      An object <code>team</code> with <code>name</code> = <code>"Rockets"</code> and a method{' '}
      <code>announce()</code> that prints <code>"Go " + this.name + "!"</code>.
    </>,
    <>
      Call it through the dot once.
    </>,
    <>
      Now create <code>shout</code> — a detached, SAFE copy of the method whose <code>this</code>{' '}
      is permanently pointed at <code>team</code> — and call <code>shout()</code> bare. It must
      still print the same line.
    </>,
  ],
  starter: '',
  expectedOutput: ['Go Rockets!', 'Go Rockets!'],
  mustUse: [
    { test: /this\.name/, label: 'the method reads this.name — no hardcoded team name inside' },
    { test: /\.bind\s*\(\s*team\s*\)/, label: 'the detached copy is welded with .bind(team)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']Go Rockets/, label: 'no printing the literal — this.name must produce it' },
  ],
  modelAnswer: `const team = {
  name: "Rockets",
  announce() {
    console.log("Go " + this.name + "!");
  },
};

team.announce();

const shout = team.announce.bind(team);
shout();`,
}

export const lesson54: LessonDef = {
  id: '5.4',
  hook: (
    <>
      <p>
        Every function you’ve written since Phase 3 has quietly avoided one keyword:{' '}
        <code>this</code>. Here’s its full, precise story — and it fits in one sentence that most
        JavaScript developers never learn precisely:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          <code>this</code> is decided at CALL time, by HOW the call is made
        </HighlightMark>
        . Not by where the function is written. Not by which object "owns" it. By the call.
      </p>
      <p>
        Today's proof is the plainest kind: ONE small function, <code>whoAmI</code>, never
        changes for the whole lesson. We're going to call it four different ways and watch a
        table fill in — same function, four rows, four different answers. Four rules cover
        every row — and one function kind (arrows) that plays by a completely different rule.
        Learn the four, and a whole genre of interview questions becomes mechanical.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'meet-function',
      caption:
        'Here is ONE small function, unchanged for the rest of this lesson: whoAmI returns this.name. Read its body all you like — it cannot tell you what this.name will be, because this has no value until the function is actually CALLED. We’re about to call this exact function several different ways and watch a table fill in below, one row per call.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'call-implicit',
      caption:
        'First call: cat.speak(). Line 6 attached the very SAME whoAmI function onto cat as speak — nothing new was written, just borrowed. Watch the table: the call appears first; the answer comes next.',
      highlightLines: [5, 6, 8],
    },
    {
      id: 'row-implicit',
      caption:
        'Revealed: this = cat, so this.name is "Biscuit". Rule one, IMPLICIT: called through a DOT, this is whatever object sits left of it. This single rule covers most everyday method calls.',
      highlightLines: [8],
    },
    {
      id: 'call-default',
      caption:
        'Second call: loose(). Line 10 copied the identical function into a bare variable — and line 11 calls it with no dot anywhere. Same whoAmI, different wrapping.',
      highlightLines: [10, 11],
    },
    {
      id: 'row-default',
      caption:
        'Revealed: this comes back as nothing useful — the global object, or undefined in strict mode. Rule two, DEFAULT: no dot means this falls back to a default, not to whatever object you were "thinking of." Same function as row one, different call, completely different answer — that IS the whole lesson in one row.',
      highlightLines: [10, 11],
    },
    {
      id: 'default-bug',
      caption:
        'Give this row a name, because you will meet it constantly: the "lost this" bug. It strikes whenever a method is handed off as a plain reference — passed to setTimeout, used as an event handler, stored in a variable exactly like loose was — the dot disappears, and the default rule silently takes over.',
      highlightLines: [10, 11],
    },
    {
      id: 'call-explicit',
      caption:
        'Third call: bound(). Line 13 built a brand-new function with whoAmI.bind({ name: "Rex" }) — binding sets this BEFORE the call ever happens, permanently.',
      highlightLines: [13, 14],
    },
    {
      id: 'row-explicit',
      caption:
        'Revealed: this = Rex, and nothing can change it — bound() could be called bare, through a dot, anywhere, and this stays welded. Rule three, EXPLICIT: bind (or call, or apply) sets this directly, and it outranks the dot.',
      highlightLines: [13, 14],
    },
    {
      id: 'call-apply-note',
      caption:
        'bind has two cousins worth knowing by name: whoAmI.call({ name: "Rex" }) does the identical job for ONE call, right now, with no new function created. apply is call’s twin — same idea, arguments passed as an array instead of listed one by one.',
      highlightLines: [13],
    },
    {
      id: 'row-arrows',
      caption:
        'New code, and a genuinely different kind of function. peep is an ARROW — and arrows have no this of their own to decide at all. An arrow reads this exactly like it reads any other outer variable: through the scope chain, from where it is WRITTEN (5.3’s rope). peep is written inside hatch, so its this IS hatch’s this — Nest.',
      codeOverride: ARROW_CODE,
      highlightLines: [1, 2, 3, 4, 5, 9],
    },
    {
      id: 'arrows-trace',
      caption:
        'Trace the whole thing: hatch was called as nest.hatch() — the implicit rule, this = nest. peep, written inside hatch, simply borrows that same this. This is exactly why arrows are beloved for callbacks written INSIDE a method… and forbidden AS a method itself (an arrow method’s this would rope straight past the object to global).',
      codeOverride: ARROW_CODE,
      highlightLines: [3, 4, 5, 9],
    },
    {
      id: 'priority-order',
      caption:
        'Step back and read the whole table: four calls, four different answers, the SAME function each time (arrows aside). The complete decision list, priority order — check it at any call site: (1) called with NEW? this = the freshly made object (next two lessons live here). (2) bind/call/apply? this = what you passed. (3) a dot? this = left of the dot. (4) bare call? global/undefined — probably a bug. Arrows skip the list entirely; they borrow from their birthplace.',
      highlightLines: [1, 2, 3],
    },
  ],
  Viz: ThisTable,
  underTheHood: (
    <>
      <p>
        Why does the default rule sometimes give the global object and sometimes{' '}
        <code>undefined</code>? Strict mode — a per-file/function opt-in (<code>"use strict"</code>)
        that modern tooling and class bodies enable automatically. Sloppy mode papers over the
        lost-this bug with the global object; strict mode surfaces it as{' '}
        <code>TypeError: Cannot read properties of undefined</code> — same philosophy as 5.2's TDZ:
        loud beats silent.
      </p>
      <p>
        The rules compose with everything you know: <code>this</code> is stored per{' '}
        <em>execution context</em> (each call's context gets its own), which is exactly why arrows
        — which don't create a <code>this</code> in their context — fall back to the rope.
      </p>
      <p>
        And the table's whole point is honest: the same function object can be attached to
        different owners freely — borrow a method with <code>a.speak = b.speak</code> and the dot
        rule follows whoever calls.
      </p>
      <p>
        Job note: Playwright test code uses arrows almost everywhere precisely to avoid this
        entire topic — but Page Object classes (11.7) use <code>this.page</code> constantly, via
        the implicit and new rules. You'll use all four rules weekly; you'll debug rule 2 (lost
        this) at least once in your career. Today you'll recognize it in seconds.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'const drum = {\n  sound: "boom",\n  hit() {\n    console.log(this.sound);\n  },\n};\ndrum.hit();',
      accept: ['boom'],
      placeholder: 'type the console output…',
      why: 'Called through a dot → implicit rule → this = drum. this.sound is "boom". The call site decided; the body just obeyed.',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'function who() {\n  console.log(this.label);\n}\nconst tagged = who.bind({ label: "A7" });\ntagged();',
      accept: ['A7'],
      placeholder: 'type the console output…',
      why: 'bind welded this to { label: "A7" } permanently — the bare call can’t change it. Explicit beats default, always.',
    },
    {
      kind: 'type-output',
      question: 'this is decided at ___ time — type: write or call.',
      accept: ['call', 'Call', 'call time', 'call-time'],
      placeholder: 'write / call…',
      why: 'CALL time — the opposite of the scope chain’s write-time ropes. Same function, different call shapes, different this. The call site is the only place with the answer (except arrows, which have no this and borrow from their birthplace).',
    },
  ],
  PlayExtra: () => <CodeExercise def={ANNOUNCER_EXERCISE} />,
  teachBack: {
    prompt:
      'The interview question: “Explain this in JavaScript.” Give the one-sentence core, the four rules in priority order, the arrow-function exception — and name the classic bug the default rule causes.',
    modelAnswer:
      'this is decided at CALL time by how the call is made — never by where the function is written. At any call site, check four rules in priority order: (1) new — this is the freshly created object; (2) explicit — bind/call/apply set this to whatever you pass (bind welds a permanent copy); (3) implicit — called through a dot, this is the object left of the dot; (4) default — a bare call gets the global object, or undefined in strict mode. The exception: arrow functions have NO this of their own — they read it lexically from where they’re written, like any outer variable through the scope chain, which makes them perfect for callbacks inside methods and wrong as methods themselves. The classic bug is rule 4: detach a method (const f = obj.method, or pass it as a callback) and the dot is gone, so this is lost — fix with .bind(obj) or an arrow wrapper.',
  },
  recap: [
    'this = decided at CALL time by the call’s shape. The body can’t know; the call site can. (Opposite of 5.3’s write-time ropes.)',
    'Priority: new → bind/call/apply (explicit) → dot (implicit) → bare (default: global/undefined — the lost-this bug; fix with bind).',
    'Arrows have NO this — they borrow lexically from their birthplace: ideal inside methods as callbacks, wrong AS methods.',
  ],
}
