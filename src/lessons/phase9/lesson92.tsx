import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.2 — The terminal, properly
 * pwd/cd/ls, running scripts, and the two skills testers use daily: reading
 * a terminal stack trace (it's 3.6's tower, printed) and exit codes — the
 * single number CI uses to decide pass/fail.
 */

const CODE = `$ pwd
/Users/lijas

$ cd shop-tests
$ ls
package.json   tests/   report.js

$ node report.js
ReferenceError: totl is not defined
    at makeReport (report.js:4:15)
    at main (report.js:9:3)
    at report.js:12:1

$ echo $?
1`

interface TermLine {
  text: string
  kind: 'cmd' | 'out' | 'err'
  hot?: boolean
}
interface View {
  lines: TermLine[]
  /** label drawn beside the hot line(s) */
  annotation?: string
  exitChip?: '0' | '1' | null
  console: string[]
  note: string
  badge?: string
}

const L = {
  pwd: { text: '$ pwd', kind: 'cmd' } as TermLine,
  pwdOut: { text: '/Users/lijas', kind: 'out' } as TermLine,
  cd: { text: '$ cd shop-tests', kind: 'cmd' } as TermLine,
  ls: { text: '$ ls', kind: 'cmd' } as TermLine,
  lsOut: { text: 'package.json   tests/   report.js', kind: 'out' } as TermLine,
  run: { text: '$ node report.js', kind: 'cmd' } as TermLine,
  err0: { text: 'ReferenceError: totl is not defined', kind: 'err' } as TermLine,
  err1: { text: '    at makeReport (report.js:4:15)', kind: 'err' } as TermLine,
  err2: { text: '    at main (report.js:9:3)', kind: 'err' } as TermLine,
  err3: { text: '    at report.js:12:1', kind: 'err' } as TermLine,
  echo: { text: '$ echo $?', kind: 'cmd' } as TermLine,
  echoOut: { text: '1', kind: 'out' } as TermLine,
}

const VIEWS: View[] = [
  {
    lines: [], console: [],
    note: 'the terminal: a text conversation with the operating system — type, get answered',
  },
  {
    lines: [L.pwd, L.pwdOut], console: [],
    note: 'the $ is the PROMPT — “your turn.” pwd = print working directory: “where am I standing?”',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd], console: [],
    note: 'cd = change directory. The terminal always stands IN a folder; commands act from there',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut], console: [],
    note: 'ls lists the current folder’s contents (Windows says dir) — eyes before hands',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run], console: [],
    note: 'node report.js — 9.1’s ritual, run from the folder where the file lives',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, L.err0, L.err1, L.err2, L.err3], console: [],
    note: 'it crashed — a STACK TRACE. Scarier-looking than 0.5’s errors, same anatomy underneath',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, { ...L.err0, hot: true }, L.err1, L.err2, L.err3],
    annotation: 'the WHAT: category + message (0.5)',
    console: [],
    note: 'line one: ReferenceError: totl is not defined — a typo’d name, plainly stated',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, L.err0, { ...L.err1, hot: true }, L.err2, L.err3],
    annotation: 'file : line 4 : column 15 — the bug’s address',
    console: [],
    note: 'each “at …” line is a CALL-STACK frame (3.6’s tower, printed) — innermost first',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, L.err0, { ...L.err1, hot: true }, { ...L.err2, hot: true }, { ...L.err3, hot: true }],
    annotation: 'died in makeReport ← called by main ← called by line 12',
    console: [],
    note: 'read top-down: WHERE it died, inside WHO, called by WHOM — the tower at the moment of death',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, L.err0, L.err1, L.err2, L.err3, L.echo, { ...L.echoOut, hot: true }],
    exitChip: '1',
    console: [],
    note: 'every finished program leaves ONE number behind: the EXIT CODE. 0 = success, anything else = failure',
  },
  {
    lines: [L.pwd, L.pwdOut, L.cd, L.ls, L.lsOut, L.run, L.err0, L.err1, L.err2, L.err3, L.echo, L.echoOut],
    exitChip: '1',
    console: [],
    note: 'exit codes are how CI knows pass from fail — no human reads first, the NUMBER decides',
    badge: 'Playwright exits non-zero when any test fails — that single number is the entire CI contract',
  },
]

function TerminalPane({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <RoughRect x={20} y={22} width={400} height={216} seed={2001} strokeWidth={2.2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
      <text x={220} y={16} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
        the terminal
      </text>
      {view.lines.length === 0 && (
        <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
          (empty — step through the session)
        </text>
      )}
      {view.lines.map((line, i) => (
        <g key={i}>
          {line.hot && <RoughRect x={28} y={36 + i * 16.5} width={330} height={16} seed={2005 + i} strokeWidth={1.4} stroke="var(--color-marker-yellow)" fill="color-mix(in srgb, var(--color-marker-yellow) 22%, transparent)" fillStyle="solid" />}
          <text x={34} y={48 + i * 16.5} fontFamily="var(--font-code)" fontSize={9} fill={line.kind === 'cmd' ? 'var(--color-marker-teal)' : line.kind === 'err' ? 'var(--color-marker-coral)' : 'var(--color-ink)'}>
            {line.text}
          </text>
        </g>
      ))}
      {view.annotation && (
        <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
          <text x={432} y={252} textAnchor="end" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)">
            {view.annotation}
          </text>
        </motion.g>
      )}
      {view.exitChip && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
          <RoughRect x={366} y={30} width={46} height={30} seed={2030} strokeWidth={2.2} stroke={view.exitChip === '0' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.exitChip === '0' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 12%, transparent)`} fillStyle="solid" />
          <text x={389} y={50} textAnchor="middle" fontFamily="var(--font-code)" fontSize={13} fontWeight={700} fill="var(--color-ink)">{view.exitChip}</text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={262} width={392} fontSize={9.5} seed={2040} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={300} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>
    </svg>
  )
}

const EXITCODE_EXERCISE: CodeExerciseDef = {
  id: 'l92-exit-codes',
  title: 'the CI verdict machine',
  task: 'CI never reads test output — it reads ONE number. Model the contract: a suite produces an exit code, and CI turns that code into a verdict.',
  steps: [
    <>
      Write <code>runSuite(failures)</code>: given how many tests failed, return the exit code —{' '}
      <code>0</code> when nothing failed, <code>1</code> otherwise.
    </>,
    <>
      Write <code>ciVerdict(code)</code>: return <code>"green"</code> for exit code{' '}
      <code>0</code>, <code>"red"</code> for anything else.
    </>,
    <>
      Print, in order: <code>runSuite(0)</code>, <code>runSuite(3)</code>, then the verdict of a
      clean run, then the verdict of a run with 3 failures — always passing runSuite’s answer
      into ciVerdict.
    </>,
  ],
  starter: '',
  expectedOutput: ['0', '1', 'green', 'red'],
  mustUse: [
    { test: /function\s+runSuite\s*\(|const\s+runSuite\s*=/, label: 'a function named runSuite' },
    { test: /function\s+ciVerdict\s*\(|const\s+ciVerdict\s*=/, label: 'a function named ciVerdict' },
    { test: /===\s*0|!==\s*0|>\s*0/, label: 'the checks compare against 0' },
    { test: /ciVerdict\s*\(\s*runSuite\s*\(/, label: 'CI reads the suite’s code: ciVerdict(runSuite(…))' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']green["']\s*\)/, label: 'no hard-coded verdicts — ciVerdict must decide' },
  ],
  modelAnswer: `function runSuite(failures) {
  return failures === 0 ? 0 : 1;
}

function ciVerdict(code) {
  return code === 0 ? "green" : "red";
}

console.log(runSuite(0));
console.log(runSuite(3));
console.log(ciVerdict(runSuite(0)));
console.log(ciVerdict(runSuite(3)));`,
}

export const lesson92: LessonDef = {
  id: '9.2',
  hook: (
    <>
      <p>
        Every automation tester’s day starts in the same window:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the terminal — a text conversation with the operating system
        </HighlightMark>
        . Run the suite from it, read the failures in it, and understand the one NUMBER it leaves
        behind — the exit code CI lives by.
      </p>
      <p>
        Today: the four commands you’ll actually use, how to read a stack trace without flinching
        (spoiler: it’s 3.6’s tower, printed), and why 0 means green.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'what-terminal',
      caption:
        'The terminal is a text conversation with the operating system: you type a command, it answers in text. No buttons, no icons — which is exactly why machines (and CI servers) love it: everything is scriptable, repeatable, loggable.',
      highlightLines: [1],
    },
    {
      id: 'prompt-pwd',
      caption:
        'The $ at line start is the PROMPT — the machine saying “your turn.” (Windows shows > instead.) First question to ask, always: pwd — print working directory. “Where am I standing?” Answer: /Users/lijas.',
      highlightLines: [1, 2],
    },
    {
      id: 'cd',
      caption:
        'The terminal always stands INSIDE one folder, and every command acts from there. cd shop-tests — change directory — steps into the project folder. Get lost? pwd again. Go up one level? cd .. — two dots means “the parent folder.”',
      highlightLines: [4],
    },
    {
      id: 'ls',
      caption:
        'ls lists what’s in the current folder (on Windows: dir). There’s our package.json from Phase 8, a tests folder, and report.js. Professionals run ls constantly — eyes before hands.',
      highlightLines: [5, 6],
    },
    {
      id: 'run-script',
      caption:
        'Now 9.1’s ritual from inside the right folder: node report.js. Node loads the file and runs it. Everything the script prints appears right here in the conversation — and this time, something is wrong.',
      highlightLines: [8],
    },
    {
      id: 'the-crash',
      caption:
        'A crash, terminal-style: the STACK TRACE. Four red lines that scare every beginner — and shouldn’t scare you, because you already own every piece: it’s an error message (0.5) stapled to a call stack (3.6). Let’s read it line by line.',
      highlightLines: [9, 10, 11, 12],
    },
    {
      id: 'trace-what',
      caption:
        'Line one is 0.5’s old friend: category + message. ReferenceError: totl is not defined — someone typed totl where total was meant. The WHAT, stated plainly before anything else.',
      highlightLines: [9],
    },
    {
      id: 'trace-where',
      caption:
        'Each “at …” line below is a CALL-STACK FRAME — the tower from 3.6, printed innermost-first. Read the address on the top frame: makeReport (report.js:4:15) means file report.js, line 4, column 15. That is the exact spot where it died.',
      highlightLines: [10],
    },
    {
      id: 'trace-order',
      caption:
        'And the frames below answer “how did we get there?”: the crash happened inside makeReport, which was called by main (line 9), which was called from the file’s top level (line 12). The tower, frozen at the moment of death — bottom of the trace = bottom of the tower.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'exit-codes',
      caption:
        'One more thing happened, invisibly: the crashed program left behind a NUMBER — its EXIT CODE. echo $? reveals the last one: 1. The convention is universal: 0 means success; anything else means failure. Every program you will ever run leaves this number.',
      highlightLines: [14, 15],
    },
    {
      id: 'ci-payoff',
      caption:
        'And that number is the entire pass/fail mechanism of CI — continuous integration, 8.2’s robot teammate that re-runs the whole suite on every code change. Exit 0 → its pipeline (the checklist of steps it runs) turns green; non-zero → red, and the release stops. No human reads the output first — the NUMBER decides.',
      highlightLines: [15],
    },
  ],
  Viz: TerminalPane,
  underTheHood: (
    <>
      <p>
        The terminal window and the program interpreting your commands are technically two things
        — the interpreter is called a <strong>shell</strong> (bash and zsh on Mac/Linux,
        PowerShell on Windows). Same conversation, slightly different dialects:{' '}
        <code>ls</code> vs <code>dir</code>, <code>$?</code> vs <code>$LASTEXITCODE</code>. The
        concepts today are identical in all of them.
      </p>
      <p>
        A handful of extra commands covers 95% of daily work: <code>mkdir name</code> (make a
        folder), <code>cat file</code> (print a file’s contents), <code>Tab</code> to
        autocomplete paths, <code>↑</code> to repeat history, and <code>Ctrl+C</code> to stop a
        running program. Learn the Tab key especially — professionals never type full paths.
      </p>
      <p>
        Exit codes compose: in CI configs you’ll see <code>npm test && npm run deploy</code> —
        the <code>&&</code> is 2.4’s guard working on programs: deploy runs only if tests exited
        0. The same short-circuit logic, one level up.
      </p>
      <p>
        Job note: when a Playwright test fails in CI, what you get is exactly today’s artifact — a
        terminal log with stack traces, and a red pipeline driven by the exit code. Reading traces
        calmly, innermost frame first, is the debugging skill interviewers quietly test with “walk
        me through this failure.”
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A program finishes with exit code 0. Did it succeed or fail?',
      accept: ['succeed', 'succeeded', 'success', 'it succeeded', 'pass', 'passed'],
      placeholder: 'succeed / fail…',
      why: '0 = success, anything else = failure — the universal convention CI relies on to turn pipelines green or red.',
    },
    {
      kind: 'type-output',
      question: 'In the trace line "at makeReport (report.js:4:15)" — which LINE of the file did the crash happen on?',
      accept: ['4', 'line 4'],
      placeholder: 'line number…',
      why: 'The address reads file : line : column — report.js, line 4, column 15. The top “at” frame is always the exact spot of death.',
    },
    {
      kind: 'type-output',
      question: 'Which command lists the contents of the folder the terminal is standing in (Mac/Linux)?',
      accept: ['ls'],
      placeholder: 'the command…',
      why: 'ls (dir on Windows). Paired with pwd and cd, that’s the eyes-and-legs of terminal navigation.',
    },
  ],
  PlayExtra: () => <CodeExercise def={EXITCODE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how to read a terminal stack trace line by line (what each part is), and how CI uses exit codes to decide pass or fail without reading any output.',
    modelAnswer:
      'A stack trace is two old friends stapled together. The first line is the error anatomy from 0.5: category and message — ReferenceError: totl is not defined tells you a name was typed that doesn’t exist. Every “at …” line below is a frame of the call stack from 3.6, printed innermost first: the top frame shows where the crash actually happened, with a precise address in file:line:column form, like report.js line 4 column 15. Reading downward answers “how did we get here”: the crash was inside makeReport, which was called by main, which was called from the file’s top level. So: what died on line one, where on the top frame, the path that led there below it. Separately, every finished program leaves behind one number — the exit code. Zero means success; anything else means failure. CI runs the suite and reads only that number: exit 0 turns the pipeline green, non-zero turns it red and stops the deploy. No human parses the logs first — the number is the contract, and it’s why a test runner like Playwright exits non-zero the moment any test fails.',
  },
  recap: [
    'Terminal basics: $ is the prompt; pwd = where am I, cd = move, ls = look. The terminal always stands in one folder and commands act from there.',
    'A stack trace = 0.5’s error message + 3.6’s call stack, printed innermost-first. Top “at” frame = the death spot, addressed as file:line:column.',
    'Every program leaves an EXIT CODE: 0 = success, non-zero = failure. CI reads only this number — Playwright exiting 1 is what turns a pipeline red.',
  ],
}
