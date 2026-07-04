import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 5.1 — Execution contexts: the two passes
 * Viz: TwoPassScanner — pass 1 is a scanner bar sweeping the code and filling
 * a registry panel (declarations only); pass 2 is a cursor executing lines.
 * The foundation for hoisting (5.2), scope chain (5.3), and closures-precise.
 */

const CODE = `sayHi();

function sayHi() {
  console.log("hi!");
}

console.log(score);
var score = 10;
console.log(score);`

interface RegEntry {
  name: string
  value: string
  hot?: boolean
}
interface View {
  phase: 'idle' | 'scan' | 'run'
  /** scanner bar position: which code line (1-based) it's sweeping, or null */
  scanLine: number | null
  /** execution cursor line */
  runLine: number | null
  registry: RegEntry[]
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without moving the scanner/cursor */
  badge?: string
}

const VIEWS: View[] = [
  {
    phase: 'idle', scanLine: null, runLine: null, registry: [], console: [],
    note: 'every scope gets ONE execution context: a memory table for its names, plus the code to run',
  },
  {
    phase: 'scan', scanLine: null, runLine: null, registry: [], console: [],
    note: 'the context fills in TWO visits: pass 1 CREATION (fill the table), pass 2 EXECUTION (run the lines)',
  },
  {
    phase: 'scan', scanLine: 3, runLine: null,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)', hot: true }],
    console: [],
    note: 'the scanner hits line 3 — a function DECLARATION. Registered WHOLE: name and complete body',
  },
  {
    phase: 'scan', scanLine: 8, runLine: null,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: 'undefined', hot: true }],
    console: [],
    note: 'var score registers the NAME, filled with the placeholder undefined — the = 10 part is NOT run yet',
  },
  {
    phase: 'scan', scanLine: null, runLine: null,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: 'undefined' }],
    console: [],
    note: 'pass 1 is done. Two names sit in the table — and ZERO lines have run so far',
    badge: 'pass 1 complete ✓ — 2 names registered, 0 lines executed',
  },
  {
    phase: 'run', scanLine: null, runLine: 1,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)', hot: true }, { name: 'score', value: 'undefined' }],
    console: ['hi!'],
    note: 'pass 2 — EXECUTION begins. Line 1 calls sayHi… and it EXISTS, fully, thanks to pass 1',
  },
  {
    phase: 'run', scanLine: null, runLine: 7,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: 'undefined', hot: true }],
    console: ['hi!', 'undefined'],
    note: 'line 7 reads score — the name exists, but the assignment hasn’t run yet → undefined, no crash',
  },
  {
    phase: 'run', scanLine: null, runLine: 7,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: 'undefined', hot: true }],
    console: ['hi!', 'undefined'],
    note: 'compare precisely: this name IS registered, just valueless. A truly UNregistered name behaves differently',
    badge: 'registered, no value yet → undefined.  Never registered at all → ReferenceError',
  },
  {
    phase: 'run', scanLine: null, runLine: 9,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: '10', hot: true }],
    console: ['hi!', 'undefined', '10'],
    note: 'line 8 finally executed the assignment — the registry entry gets its real value, 10',
  },
  {
    phase: 'run', scanLine: null, runLine: 9,
    registry: [{ name: 'sayHi', value: 'ƒ (complete!)' }, { name: 'score', value: '10' }],
    console: ['hi!', 'undefined', '10'],
    note: 'this whole two-pass effect has a name you’ll hear constantly — and every function call builds its own context, the same way',
    badge: '🏷 this effect is called HOISTING — dissected fully next lesson',
  },
]

const CODE_LINES = CODE.split('\n')

function TwoPassScanner({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {/* mini code column */}
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the program
      </text>
      {CODE_LINES.map((line, i) => {
        const n = i + 1
        const scanned = view.scanLine === n
        const running = view.runLine === n
        return (
          <g key={n}>
            {(scanned || running) && (
              <motion.rect
                layoutId="linebar"
                x={18}
                y={40 + i * 19 - 12}
                width={230}
                height={17}
                rx={3}
                fill={scanned ? 'color-mix(in srgb, var(--color-marker-yellow) 55%, transparent)' : 'color-mix(in srgb, var(--color-marker-teal) 30%, transparent)'}
              />
            )}
            <text x={26} y={40 + i * 19} fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">
              {line || ' '}
            </text>
          </g>
        )
      })}

      {/* phase badge */}
      <AnimatePresence mode="wait">
        <motion.g key={view.phase} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <RoughRect x={270} y={20} width={150} height={30} seed={831} strokeWidth={1.8} fill={view.phase === 'scan' ? 'var(--color-marker-yellow)' : view.phase === 'run' ? 'color-mix(in srgb, var(--color-marker-teal) 25%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={345} y={40} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13.5} fontWeight={700} fill="var(--color-ink)">
            {view.phase === 'scan' ? 'pass 1 · creation' : view.phase === 'run' ? 'pass 2 · execution' : 'about to start…'}
          </text>
        </motion.g>
      </AnimatePresence>

      {/* the registry (the context's memory) */}
      <RoughRect x={270} y={64} width={150} height={112} seed={832} strokeWidth={2} roughness={1.6} />
      <text x={278} y={58} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        global context — registered names
      </text>
      {view.registry.length === 0 ? (
        <text x={345} y={124} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
          (empty)
        </text>
      ) : (
        view.registry.map((r, i) => (
          <motion.g key={r.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <text x={282} y={90 + i * 26} fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill={r.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
              {r.name}
            </text>
            <motion.text key={r.value} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={340} y={90 + i * 26} fontFamily="var(--font-code)" fontSize={11.5} fill={r.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
              {r.value}
            </motion.text>
          </motion.g>
        ))
      )}

      {/* badge — a small appearing annotation for steps that add insight without moving the scanner/cursor */}
      <AnimatePresence>
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={205} width={360} fontSize={11} seed={834} color="var(--color-marker-coral)" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* verdict */}
      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={240} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={426} fontSize={14} /></motion.text>
      </AnimatePresence>

      {/* console */}
      <RoughRect x={40} y={256} width={360} height={38} seed={833} strokeWidth={1.5} />
      <text x={52} y={252} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        console
      </text>
      {view.console.length === 0 ? (
        <text x={220} y={280} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
          (nothing printed yet)
        </text>
      ) : (
        <text x={58} y={280} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
          {view.console.join('   ·   ')}
        </text>
      )}
    </svg>
  )
}

const BANNER_EXERCISE: CodeExerciseDef = {
  id: 'l51-banner',
  title: 'prove the two passes',
  task: 'Write a program that could only work because of pass 1 — a function called before its definition, and a var read before its assignment. You’re not fixing this behavior; you’re demonstrating you can predict it.',
  steps: [
    <>
      First line of your program: print <code>banner</code> — a <code>var</code> that is declared{' '}
      <em>further down</em>. It must print <code>undefined</code> (and you must know why).
    </>,
    <>
      Then call <code>setBanner()</code> — a function DECLARATION written at the very bottom of
      the file — which assigns <code>"Grand Opening!"</code> to <code>banner</code>.
    </>,
    <>
      Print <code>banner</code> again, then place the <code>var</code> declaration and the
      function declaration at the bottom.
    </>,
  ],
  starter: '',
  expectedOutput: ['undefined', 'Grand Opening!'],
  mustUse: [
    { test: /console\.log\s*\(\s*banner\s*\)[\s\S]*var\s+banner/, label: 'banner is read BEFORE its var line' },
    { test: /setBanner\s*\(\s*\)[\s\S]*function\s+setBanner\s*\(/, label: 'setBanner is called BEFORE its declaration' },
    { test: /var\s+banner/, label: 'banner is declared with var (the pass-1 undefined behavior)' },
  ],
  mustNotUse: [
    { test: /let\s+banner|const\s+banner/, label: 'var only here — let/const behave differently (next lesson!)' },
  ],
  modelAnswer: `console.log(banner);

setBanner();
console.log(banner);

var banner;
function setBanner() {
  banner = "Grand Opening!";
}`,
}

export const lesson51: LessonDef = {
  id: '5.1',
  hook: (
    <>
      <p>
        Here's a small impossibility: line 1 of today's code <em>calls</em> a function that isn't
        written until line 3 — and it works. If code truly ran top-to-bottom, line 1 should crash
        with "sayHi is not defined." It doesn't. Which means the story you've had since lesson 0.3
        — <em>code runs top to bottom</em> — is missing a chapter.
      </p>
      <p>
        The missing chapter:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the engine reads your code TWICE
        </HighlightMark>
        . Pass one — the <strong>creation phase</strong> — sweeps the scope and registers every
        declaration into a memory table. Pass two — the <strong>execution phase</strong> — actually
        runs the lines.
      </p>
      <p>
        The table plus the code being run is called an <strong>execution context</strong>, and it
        is THE concept this whole phase is built on: hoisting, scope chain, closures-done-precisely,
        even <code>this</code> all live here.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-context',
      caption:
        'Before executing a single line, the engine builds ONE EXECUTION CONTEXT for this scope: a memory table for its names, plus the code to run. Every scope — global, every function call — gets one.',
      highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      id: 'two-phases',
      caption:
        'Filling that context happens in TWO visits, always. Pass 1, the CREATION phase: sweep the scope and register every declaration. Pass 2, the EXECUTION phase: run the lines, top to bottom. Watch pass 1 first — no line has "run" yet.',
      highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      id: 'register-function',
      caption:
        'The scanner hits line 3: a function DECLARATION. These get the royal treatment in pass 1 — the name sayHi is registered with the COMPLETE function attached, body and all. Not a note that it exists: the whole machine, ready to call.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'register-var',
      caption:
        'The scanner hits line 8: var score = 10. Pass 1 splits it in two: the DECLARATION (var score) is registered now, with the placeholder undefined — but the ASSIGNMENT (= 10) is execution-phase work, left for later. The registry now knows the name but not the value.',
      highlightLines: [8],
    },
    {
      id: 'pass1-done',
      caption:
        'Pass 1 is finished. Two names sit in the table, complete and placeholder alike — and ZERO lines of your program have executed yet. That gap between "registered" and "run" is the entire engine behind hoisting.',
      highlightLines: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      id: 'run-call',
      caption:
        'Pass 2 begins — NOW lines run, top to bottom. Line 1: sayHi(). Look it up in the registry: there it is, complete, courtesy of pass 1. It runs and prints. This is why function declarations can be called “before” they’re written — by the time any line runs, ALL of them are already registered.',
      highlightLines: [1],
    },
    {
      id: 'run-undefined',
      caption:
        'Line 7 reads score. The registry HAS the name (pass 1 put it there) holding its placeholder undefined — so it prints undefined instead of crashing.',
      highlightLines: [7],
    },
    {
      id: 'undefined-vs-error',
      caption:
        'Compare precisely, because interviews love this exact distinction: a registered-but-unassigned var reads as undefined. A name that was NEVER registered anywhere on the chain throws ReferenceError instead. Same-looking crash-free line, two very different underlying situations.',
      highlightLines: [7],
    },
    {
      id: 'run-assign',
      caption:
        'Line 8 finally executes the assignment — the registry entry becomes 10 — and line 9 prints it.',
      highlightLines: [8, 9],
    },
    {
      id: 'hoisting-named',
      caption:
        'One more thing before next lesson: EVERY function call builds its own execution context with its own two passes (that’s what each 3.6 stack frame really is). And this “names exist before their line” phenomenon has a famous name: HOISTING. Lesson 5.2 dissects it, kind by kind.',
      highlightLines: [8, 9],
    },
  ],
  Viz: TwoPassScanner,
  underTheHood: (
    <>
      <p>
        Precision matters here: nothing physically moves in your file. "Hoisting" describes the{' '}
        <em>effect</em> of the creation phase — names are registered before any line runs, so they
        behave as if declared at the top.
      </p>
      <p>
        What differs per declaration kind (var / let / const / function) is <em>how</em> they're
        registered — that's the entire next lesson.
      </p>
      <p>
        The execution context is the phase's master picture: each one holds its memory table, a
        reference to its outer scope (lesson 5.3's chain), and — for function calls — its own{' '}
        <code>this</code> (lesson 5.4).
      </p>
      <p>
        The call stack from 3.6 is, precisely, a stack of execution contexts. One concept, four
        lessons of payoff.
      </p>
      <p>
        <strong>Fun fact:</strong> you use two-pass reading too. Skim a recipe before cooking —
        "ah, there's an oven step, a marinade, a sauce" — then execute it step by step. A cook who
        starts frying at word one discovers "marinate overnight" too late; the skim is your
        creation phase.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'greet();\n\nfunction greet() {\n  console.log("yo");\n}',
      accept: ['yo'],
      placeholder: 'type the console output…',
      why: 'Pass 1 registered greet — complete — before any line ran, so the line-1 call finds a fully-built function. Declarations are usable “early.”',
    },
    {
      kind: 'type-output',
      question: 'Type exactly what this prints:',
      code: 'console.log(x);\nvar x = 5;',
      accept: ['undefined'],
      placeholder: 'type the console output…',
      why: 'Pass 1 registered the NAME x with the placeholder undefined; the = 5 assignment is pass-2 work that hasn’t happened yet at line 1. Name known, value not — undefined.',
    },
    {
      kind: 'type-output',
      question: 'The engine’s first sweep — where declarations are registered before anything runs — is called the ___ phase. Type the word.',
      accept: ['creation', 'Creation', 'creation phase', 'the creation phase'],
      placeholder: 'one word…',
      why: 'The creation phase. Then the execution phase runs the lines. Together with the memory table they form an execution context — the concept the rest of Phase 5 stands on.',
    },
  ],
  PlayExtra: () => <CodeExercise def={BANNER_EXERCISE} />,
  teachBack: {
    prompt:
      'A friend is baffled that calling a function above its definition works, but reading a var above its line gives undefined. Explain the two passes — and why the two cases behave differently.',
    modelAnswer:
      'Before running a single line, the engine does a creation pass over the scope and registers every declaration into the context’s memory table. Function DECLARATIONS are registered complete — name and full body — so by the time the execution pass starts, calling one “early” just finds a finished function in the table. A var is registered by NAME only, holding the placeholder undefined; its assignment is ordinary execution-phase work that happens when its line is reached. So reading the var early finds a known name with no value yet — undefined, not an error (a truly unknown name would throw ReferenceError). The whole effect is called hoisting, and nothing actually moves in the file — it’s just the two-pass order: register everything, then run.',
  },
  recap: [
    'Every scope runs in TWO passes: creation (register declarations into the context’s memory) then execution (run lines top to bottom).',
    'Function declarations register COMPLETE (callable before their line); var registers the name with undefined (assignment happens in pass 2).',
    'The memory table + running code = an EXECUTION CONTEXT; each function call gets its own. The 3.6 call stack is a stack of these.',
  ],
}
