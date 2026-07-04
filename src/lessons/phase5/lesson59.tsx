import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 5.9 — Checkpoint: the explain-it-all interview
 * No new machinery. Three notorious snippets replayed with the phase's tools,
 * then heavy typed checks and two build exercises (one of which is secretly
 * the heart of a test runner). Passing this = interview-ready on hoisting,
 * this, prototypes, closures, and errors.
 */

const CODE = `// snippet A — hoisting
console.log(a);
var a = 1;
console.log(b);
let b = 2;

// snippet B — this
const obj = {
  n: "X",
  get() { return this.n; },
};
const g = obj.get;
// obj.get() vs g() ?

// snippet C — the chain
const base = { hi: "yo" };
const kid = Object.create(base);
// kid.hi ?  Object.keys(kid) ?`

interface View {
  title: string
  lines: { text: string; tone?: 'ok' | 'bad' }[]
  note: string
}

const VIEWS: View[] = [
  {
    title: 'the interview board',
    lines: [
      { text: 'A · hoisting — 5.1/5.2' },
      { text: 'B · this — 5.4' },
      { text: 'C · prototypes — 5.5' },
    ],
    note: 'three famous traps. You now own the machinery behind every one',
  },
  {
    title: 'A · pass 1 — register',
    lines: [
      { text: 'a → undefined (var)' },
      { text: 'b → ⛔ uninitialized (let, TDZ)' },
    ],
    note: 'pass 1 registers BOTH names differently — before either log runs',
  },
  {
    title: 'A · pass 2 — run',
    lines: [
      { text: 'log(a) → undefined', tone: 'ok' },
      { text: 'log(b) → ReferenceError', tone: 'bad' },
    ],
    note: 'never guess hoisting — RUN pass 1 in your head, then pass 2',
  },
  {
    title: 'B · call site 1',
    lines: [
      { text: 'obj.get() → dot rule → this = obj → "X"', tone: 'ok' },
    ],
    note: 'called through a dot: this is DECIDED, not guessed',
  },
  {
    title: 'B · call site 2',
    lines: [
      { text: 'g() → bare call → this lost → undefined', tone: 'bad' },
    ],
    note: 'same function, two calls, two answers — the call site decides',
  },
  {
    title: 'C · the climb',
    lines: [
      { text: 'kid.hi → miss → climb → "yo"', tone: 'ok' },
    ],
    note: 'dot-lookup climbs the chain until it finds the property',
  },
  {
    title: 'C · own vs inherited',
    lines: [
      { text: 'Object.keys(kid) → [] (own only)', tone: 'ok' },
    ],
    note: 'inspection tools see OWN properties only. Borrowed ≠ owned',
  },
  {
    title: 'you, in the interview',
    lines: [
      { text: 'hoisting = two passes' },
      { text: 'this = the call site' },
      { text: 'closure = kept context' },
      { text: 'prototype = the climb' },
    ],
    note: 'four sentences, four machineries — teach them back below, out loud',
  },
]

function InterviewBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 280" className="w-full">
      <RoughRect x={50} y={36} width={340} height={180} seed={961} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <AnimatePresence mode="wait">
        <motion.g key={view.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <text x={220} y={64} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fontWeight={700} fill="var(--color-ink)">
            {view.title}
          </text>
          {view.lines.map((l, i) => (
            <text
              key={l.text}
              x={220}
              y={96 + i * 26}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={12}
              fontWeight={600}
              fill={l.tone === 'bad' ? 'var(--color-marker-coral)' : l.tone === 'ok' ? 'var(--color-marker-teal)' : 'var(--color-ink)'}
            >
              {l.text}
            </text>
          ))}
        </motion.g>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={248} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>
    </svg>
  )
}

const CHAIN_EXERCISE: CodeExerciseDef = {
  id: 'l59-chainable',
  title: 'part 1 — the chainable scorekeeper',
  task: 'Build a class whose method calls CHAIN — s.add(5).add(7) — the fluent style you’ll meet all over Playwright. The trick is one line: a method that returns the object it was called on.',
  steps: [
    <>
      A class <code>ScoreKeeper</code>: its constructor sets <code>this.points = 0</code>.
    </>,
    <>
      A method <code>add(n)</code> that increases <code>this.points</code> by <code>n</code> — and
      then <strong>returns the keeper itself</strong>, so another call can hang off the result.
    </>,
    <>
      Make one instance, chain <code>add(5).add(7)</code> in a single expression, then print{' '}
      <code>points</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['12'],
  mustUse: [
    { test: /class\s+ScoreKeeper/, label: 'a class named ScoreKeeper' },
    { test: /return\s+this\s*;?/, label: 'add returns this — that’s what makes chaining possible' },
    { test: /\.add\s*\(\s*5\s*\)\s*\.add\s*\(\s*7\s*\)/, label: 'the calls chain: .add(5).add(7)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*12\s*\)/, label: 'no hand-typed 12' },
  ],
  modelAnswer: `class ScoreKeeper {
  constructor() {
    this.points = 0;
  }

  add(n) {
    this.points = this.points + n;
    return this;
  }
}

const s = new ScoreKeeper();
s.add(5).add(7);
console.log(s.points);`,
}

const RUNNER_EXERCISE: CodeExerciseDef = {
  id: 'l59-runner',
  title: 'part 2 — the heart of a test runner',
  task: 'Write the ten lines every test framework is built around: run a function, catch its failure, report either way — and never let one failure stop the next run.',
  steps: [
    <>
      A function <code>attempt(fn)</code>: inside a <code>try</code>, call <code>fn()</code> and
      RETURN its result. In the <code>catch</code>, return <code>"failed: " + </code> the error's
      message.
    </>,
    <>
      Two candidate functions: <code>safe</code>, an arrow returning <code>7</code>; and{' '}
      <code>risky</code>, an arrow that THROWS a new Error with message <code>"nope"</code>.
    </>,
    <>
      Print <code>attempt(safe)</code>, then <code>attempt(risky)</code> — proof that the failure
      was contained and life went on.
    </>,
  ],
  starter: '',
  expectedOutput: ['7', 'failed: nope'],
  mustUse: [
    { test: /function\s+attempt\s*\(\s*fn\s*\)|const\s+attempt\s*=/, label: 'a runner named attempt taking a function' },
    { test: /try\s*\{[\s\S]*fn\s*\(\s*\)/, label: 'the candidate runs INSIDE the try' },
    { test: /catch[\s\S]*\.message/, label: 'the catch reports via the error’s .message' },
    { test: /throw\s+new\s+Error\s*\(\s*["']nope["']\s*\)/, label: 'risky throws new Error("nope")' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']failed/, label: 'the failure text must come out of attempt’s return, not a direct print' },
  ],
  modelAnswer: `function attempt(fn) {
  try {
    return fn();
  } catch (err) {
    return "failed: " + err.message;
  }
}

const safe = () => 7;
const risky = () => {
  throw new Error("nope");
};

console.log(attempt(safe));
console.log(attempt(risky));`,
}

export const lesson59: LessonDef = {
  id: '5.9',
  hook: (
    <>
      <p>
        Checkpoint — and this one has a special shape, because Phase 5's material <em>is</em> the
        JavaScript interview. Hoisting puzzles, <code>this</code> traps, prototype questions:
        they're not trivia, they're checks for exactly the machinery you now own — two passes,
        call sites, ropes, chains, reachability, falling sparks.
      </p>
      <p>
        Today: three notorious snippets replayed with your tools, a battery of typed checks, and
        two builds — one of which is, quietly, <strong>the heart of every test runner ever
        written</strong>. No new concepts. Just proof.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'board',
      caption:
        'The three snippet families that appear in some form in nearly every JavaScript interview. The untrained answer them by memory and get one wrong. You’ll answer by SIMULATION — running the machinery in your head. That difference is the whole phase.',
      highlightLines: [1, 7, 15],
    },
    {
      id: 'replay-hoisting-pass1',
      caption:
        'Snippet A, by the machinery: run pass 1 FIRST, before either log has run. var a registers as undefined. let b registers uninitialized — the ⛔ temporal dead zone.',
      highlightLines: [2, 3, 4, 5],
    },
    {
      id: 'replay-hoisting-pass2',
      caption:
        'Now pass 2: log(a) reads a registered name → undefined. log(b) touches the dead zone → ReferenceError at that exact line. Two passes, zero guessing. (5.1, 5.2)',
      highlightLines: [2, 3, 4, 5],
    },
    {
      id: 'replay-this-dot',
      caption:
        'Snippet B, by the machinery: don’t stare at the body — read the CALL SITE. obj.get() has a dot → this = obj → "X".',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'replay-this-bare',
      caption:
        'g() is the SAME function, called bare → default rule → this is global/undefined → this.n is undefined. Same function twice, two different answers, both certain once you look at the calls. (5.4)',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'replay-proto-climb',
      caption:
        'Snippet C, by the machinery: kid.hi misses on kid, CLIMBS the [[Prototype]] link to base, finds "yo".',
      highlightLines: [16, 17],
    },
    {
      id: 'replay-proto-own',
      caption:
        'But Object.keys(kid) is [] — inspection lists OWN properties only, and kid owns nothing. Borrowed is not owned. (5.5)',
      highlightLines: [16, 18],
    },
    {
      id: 'graduate',
      caption:
        'Your four-sentence interview kit: hoisting is the two-pass creation phase. this is decided by the call site, four rules. A closure is a kept-alive context at the end of a rope. Property lookup climbs the prototype chain. Say them in your own words in the teach-back — that IS the interview. Then build the two exercises: a chainable class, and a ten-line test runner.',
      highlightLines: [1],
    },
  ],
  Viz: InterviewBoard,
  underTheHood: (
    <>
      <p>
        Why interviewers ask these: not to see if you memorized outcomes, but to hear{' '}
        <em>which model you reason with</em>. "undefined because hoisting" is a memorizer's
        answer. "Pass one registered the name with undefined; the assignment is pass-two work" is
        an understander's answer. Same output, different career.
      </p>
      <p>
        The runner you're about to write (part 2) is genuinely the core loop of Vitest and
        Playwright's runner: each test is a function; the framework calls it inside a try; a
        thrown assertion becomes a red result with the error's message; the loop continues to the
        next test. When you meet <code>test('name', fn)</code> in Phase 10, you'll recognize an
        old friend wearing a suit.
      </p>
      <p>
        And the chainable class (part 1) is the fluent style behind{' '}
        <code>locator.filter(...).first()</code> and every builder API: methods that return{' '}
        <code>this</code> so calls read as sentences. Two small builds, two large habits.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Pass 1 then pass 2 — type exactly what this prints:',
      code: 'console.log(crew);\nvar crew = "alpha";',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'Pass 1: crew registered as undefined. Pass 2: the log runs before the assignment line. Registered name, no value yet → undefined.',
    },
    {
      kind: 'type-output',
      question: 'This throws — type the ERROR NAME:',
      code: 'console.log(mode);\nconst mode = "dark";',
      accept: ['ReferenceError', 'referenceerror', 'Reference Error'],
      placeholder: 'the error name…',
      why: 'const registers uninitialized — the temporal dead zone. Touching it before its line → ReferenceError, loudly, locally.',
    },
    {
      kind: 'type-output',
      question: 'Read the call site — type exactly what this prints:',
      code: 'const mic = {\n  id: "M1",\n  tag() { return this.id; },\n};\nconst t = mic.tag.bind(mic);\nconsole.log(t());',
      accept: ['M1'],
      placeholder: 'type the console output…',
      why: 'bind welded this to mic before the handoff — the bare call can’t lose it. Explicit rule beats default rule, every time.',
    },
    {
      kind: 'type-output',
      question: 'Walk the chain — type exactly what the FIRST console.log line prints:',
      code: 'const tool = { grip: "firm" };\nconst axe = Object.create(tool);\nconsole.log(axe.grip);\nconsole.log(Object.keys(axe).length);',
      accept: ['firm', 'firm 0'],
      placeholder: 'the first line…',
      why: 'axe.grip misses locally, climbs to tool → "firm". (And keys(axe).length is 0 — borrowed, not owned.)',
    },
    {
      kind: 'type-output',
      question: 'References, one last time — type exactly what this prints:',
      code: 'const a = { v: 1 };\nconst b = { v: 1 };\nconsole.log(a === b);',
      accept: ['false'],
      placeholder: 'type the console output…',
      why: 'Two objects, two heap addresses — === compares addresses only (4.6/4.7). Contents never entered the conversation. If a phase-4 idea shows up in a phase-5 interview, you’re ready for that too.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={CHAIN_EXERCISE} />
      <CodeExercise def={RUNNER_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'The mock interview, for real: in your own words, explain (1) what hoisting actually is, (2) how this is decided, (3) what a closure is precisely, and (4) how property lookup works on objects. Four short paragraphs — as if the interviewer is across the table.',
    modelAnswer:
      '(1) Hoisting is the visible effect of the engine’s two-pass execution: before running any line, a creation pass registers every declaration in the scope — var as undefined, let/const as uninitialized (touching them early throws: the temporal dead zone), function declarations complete. Nothing moves; registration just happens first. (2) this is decided at call time by the call’s shape, in priority: new → the fresh object; bind/call → what you passed; a dot → the object left of it; bare → global/undefined (the lost-this bug). Arrows have no this and borrow lexically from where they’re written. (3) A closure is a function that keeps its scope-chain link to the context it was created in — so that context stays reachable (the GC must keep it), giving the function private, persistent state after its maker returned. (4) Property lookup checks the object’s own properties, then climbs the hidden [[Prototype]] chain link by link — methods live once on a prototype and are borrowed by every instance — ending at Object.prototype, then null, and only then undefined.',
  },
  recap: [
    'Answer by SIMULATION, not memory: run pass 1/pass 2 for hoisting; read the call site for this; walk the chain for properties.',
    'The four-sentence kit: hoisting = two passes · this = call site · closure = kept context · lookup = the climb.',
    'You built a fluent (return this) class and a real test-runner core (try → run fn → catch → report → continue). Phase 10 will feel like coming home.',
  ],
}
