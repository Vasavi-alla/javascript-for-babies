import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.8 — Checkpoint: environment setup
 * The one checkpoint that happens OUTSIDE the app: install Node LTS, make a
 * project, npm init, write a script that reads env + writes a file, run it,
 * verify the exit code. Checklist viz; in-sandbox dress rehearsal exercise.
 * iPad-safe: the real install waits for a computer; nothing else blocks.
 */

const CODE = `// the mission (on a real computer):
// 1  install Node LTS → node --version
// 2  mkdir first-node && cd first-node
// 3  npm init -y      → package.json
// 4  create hello.js:

import { writeFileSync } from "node:fs";

const who = process.env.USER_NAME ?? "friend";
const line = \`hello, \${who}!\`;
console.log(line);
writeFileSync("hello.txt", line);

// 5  node hello.js
// 6  USER_NAME=Lijas node hello.js
// 7  cat hello.txt    → hello, Lijas!
// 8  echo $?          → 0`

interface Check {
  label: string
  done: boolean
}
interface View {
  checks: Check[]
  termLines?: string[]
  verdict?: boolean
  console: string[]
  note: string
  badge?: string
}

const CHECKLIST = [
  'install Node LTS',
  'make a project folder',
  'npm init -y',
  'write hello.js',
  'run it (defaults)',
  'run it (env aimed)',
  'verify the file',
  'verify exit code 0',
]

function checks(doneCount: number): Check[] {
  return CHECKLIST.map((label, i) => ({ label, done: i < doneCount }))
}

const VIEWS: View[] = [
  {
    checks: checks(0), console: [],
    note: 'the one checkpoint that happens OUTSIDE this app: build a real Node workspace, end to end',
  },
  {
    checks: checks(1), termLines: ['$ node --version', 'v22.14.0'], console: [],
    note: 'nodejs.org → the LTS button (long-term support — what real teams run). node --version proves it landed',
  },
  {
    checks: checks(2), termLines: ['$ mkdir first-node', '$ cd first-node'], console: [],
    note: '9.2’s legs: mkdir makes the folder, cd steps inside — every command from here acts in it',
  },
  {
    checks: checks(3), termLines: ['$ npm init -y', 'Wrote package.json'], console: [],
    note: 'npm init -y births 8.2’s ID card with defaults — you now own a real project',
    badge: 'add "type": "module" to it by hand — 9.3’s switch, flipped consciously for the first time',
  },
  {
    checks: checks(4), console: [],
    note: 'hello.js — six lines using half the course: env (9.4), ?? (8.4), template (1.6), fs (9.5)',
  },
  {
    checks: checks(5), termLines: ['$ node hello.js', 'hello, friend!'], console: [],
    note: 'first run, nothing set: the ?? default speaks — hello, friend!',
  },
  {
    checks: checks(6), termLines: ['$ USER_NAME=Lijas node hello.js', 'hello, Lijas!'], console: [],
    note: 'same code, re-aimed by the environment alone — 9.4’s whole lesson in one line',
  },
  {
    checks: checks(7), termLines: ['$ cat hello.txt', 'hello, Lijas!'], console: [],
    note: 'cat prints the file — writeFileSync really wrote to your real disk (9.5)',
  },
  {
    checks: checks(8), termLines: ['$ echo $?', '0'], console: [],
    note: 'echo $? → 0: the run succeeded and LEFT PROOF — 9.2’s contract, witnessed on your machine',
  },
  {
    checks: checks(8), verdict: true, console: [],
    note: 'environment: OPERATIONAL. This exact workspace is what Playwright installs into (Phase 11’s npm init playwright)',
    badge: 'on an iPad right now? Do the dress rehearsal below — the real install waits for a computer, and nothing else in the course blocks on it.',
  },
]

function ChecklistBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the setup checklist
      </text>
      {view.checks.map((check, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        return (
          <g key={check.label}>
            <RoughRect x={26 + col * 200} y={36 + row * 38} width={188} height={30} seed={2601 + i} strokeWidth={check.done ? 2 : 1.4} stroke={check.done ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={check.done ? 'color-mix(in srgb, var(--color-marker-teal) 9%, transparent)' : 'transparent'} fillStyle="solid" />
            <text x={40 + col * 200} y={56 + row * 38} fontFamily="var(--font-hand)" fontSize={10} fontWeight={check.done ? 700 : 400} fill={check.done ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>
              {check.done ? '☑' : '☐'}  {check.label}
            </text>
          </g>
        )
      })}

      {(view.termLines ?? []).length > 0 && (
        <g>
          <RoughRect x={40} y={196} width={360} height={50} seed={2620} strokeWidth={1.8} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
          {(view.termLines ?? []).map((line, i) => (
            <text key={i} x={54} y={216 + i * 17} fontFamily="var(--font-code)" fontSize={9.5} fill={line.startsWith('$') ? 'var(--color-marker-teal)' : 'var(--color-ink)'}>
              {line}
            </text>
          ))}
        </g>
      )}

      {view.verdict && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <RoughRect x={110} y={200} width={220} height={34} seed={2630} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 12%, transparent)" fillStyle="solid" />
          <text x={220} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
            ENVIRONMENT: OPERATIONAL ✓
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={262} width={392} fontSize={9.5} seed={2640} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={300} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>
    </svg>
  )
}

const REHEARSAL_EXERCISE: CodeExerciseDef = {
  id: 'l98-dress-rehearsal',
  title: 'the dress rehearsal',
  task: 'Before (or instead of, for now) the real terminal: stage the entire hello.js mission in the sandbox — env-driven greeting, model-disk write, honest exit code.',
  steps: [
    <>
      Model the run: <code>env</code> as <code>{'{ USER_NAME: "Lijas" }'}</code> and a model disk{' '}
      <code>const disk = {'{}'}</code> (9.5’s trick).
    </>,
    <>
      Write <code>greet(env)</code>: build <code>hello, NAME!</code> with a template literal,
      where NAME is <code>env.USER_NAME</code> with the honest default <code>"friend"</code>.
    </>,
    <>
      Run the mission: print <code>greet({'{}'})</code> (the default run), then print{' '}
      <code>greet(env)</code>, then store <code>greet(env)</code> on the disk under{' '}
      <code>"hello.txt"</code> and print what the disk holds there.
    </>,
    <>
      Finish like a good process: print the exit code — <code>0</code> if the disk’s{' '}
      <code>"hello.txt"</code> now holds a value, <code>1</code> otherwise (a real check, not a
      bare 0).
    </>,
  ],
  starter: '',
  expectedOutput: ['hello, friend!', 'hello, Lijas!', 'hello, Lijas!', '0'],
  mustUse: [
    { test: /function\s+greet\s*\(|const\s+greet\s*=/, label: 'a function named greet' },
    { test: /\?\?/, label: 'the default arrives via ??' },
    { test: /`/, label: 'the greeting is a template literal' },
    { test: /disk\s*\[/, label: 'the file is stored on the model disk with brackets' },
    { test: /\?\s*0\s*:\s*1|===\s*undefined|!==\s*undefined|if\s*\(\s*disk\s*\[/, label: 'the exit code comes from a real check on the disk' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']hello, Lijas!["']\s*\)/, label: 'no hard-coded greetings — greet must build them' },
    { test: /console\.log\s*\(\s*0\s*\)/, label: 'no bare 0 — the exit code must come from the check' },
  ],
  modelAnswer: `const env = { USER_NAME: "Lijas" };
const disk = {};

function greet(env) {
  const who = env.USER_NAME ?? "friend";
  return \`hello, \${who}!\`;
}

console.log(greet({}));
console.log(greet(env));

disk["hello.txt"] = greet(env);
console.log(disk["hello.txt"]);

const exitCode = disk["hello.txt"] !== undefined ? 0 : 1;
console.log(exitCode);`,
}

export const lesson98: LessonDef = {
  id: '9.8',
  hook: (
    <>
      <p>
        Checkpoint — and a special one: it happens{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          outside this app, on your real computer
        </HighlightMark>
        . You’ll install Node, create a project from nothing, write a script that reads the
        environment and writes a file, run it from the terminal, and verify the exit code — the
        complete life cycle of everything Phase 9 taught.
      </p>
      <p>
        This exact workspace is what Playwright installs into. (On an iPad right now? The dress
        rehearsal below covers you — the real install can wait for a computer.)
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'briefing',
      caption:
        'The mission has eight boxes, and every one uses a lesson you already own. Nothing new gets taught today — that’s what makes it a checkpoint: 9.1’s runtime, 9.2’s terminal, 8.2’s npm, 9.3’s switch, 9.4’s env, 9.5’s files, all assembled into one working environment.',
      highlightLines: [1, 2, 3, 4, 5],
    },
    {
      id: 'install',
      caption:
        'Box one: nodejs.org, the LTS button — long-term support, the even-numbered line real teams run (9.1). Install like any app, then prove it in a fresh terminal: node --version answers with a v-number. That reply means the runtime lives on your machine.',
      highlightLines: [2],
    },
    {
      id: 'make-folder',
      caption:
        'Box two, with 9.2’s legs: mkdir first-node creates the project folder, cd first-node steps inside. Every command from here on acts in that folder — run pwd anytime you doubt where you stand.',
      highlightLines: [3],
    },
    {
      id: 'npm-init',
      caption:
        'Box three: npm init -y — the -y accepts all defaults — and 8.2’s ID card is born: a real package.json you own. Open it and add one line by hand: "type": "module". That’s 9.3’s switch, flipped consciously by you, so your files speak import/export.',
      highlightLines: [4],
    },
    {
      id: 'write-script',
      caption:
        'Box four: create hello.js — the import at the top (8.1’s rule, kept), then five lines spending half the course: process.env (9.4) read with an ?? default (8.4) into a template literal (1.6), printed (0.3), then written to a REAL file with writeFileSync (9.5). Type it yourself; copy-paste teaches nothing.',
      highlightLines: [7, 9, 10, 11, 12],
    },
    {
      id: 'run-default',
      caption:
        'Box five — first flight, nothing set: node hello.js prints hello, friend! The ?? default spoke, exactly as designed. (ESM note from 9.3: with "type": "module" set, the import line is legal in a plain .js file.)',
      highlightLines: [14],
    },
    {
      id: 'run-aimed',
      caption:
        'Box six — re-aim without editing: USER_NAME=Lijas node hello.js prints hello, Lijas! Same file, different environment, different behavior: 9.4’s entire philosophy witnessed on your own machine. (Windows PowerShell spells it $env:USER_NAME="Lijas"; node hello.js.)',
      highlightLines: [15],
    },
    {
      id: 'verify-file',
      caption:
        'Box seven: cat hello.txt (or open it in any editor) shows hello, Lijas! — writeFileSync genuinely wrote to your disk. Run ls too: the file sits beside your script, because relative paths resolved against your cwd (9.5’s two-heres, behaving exactly as taught).',
      highlightLines: [16],
    },
    {
      id: 'verify-exit',
      caption:
        'Box eight: echo $? answers 0 — the run left 9.2’s success number behind. You have now personally witnessed the full contract CI lives by: a program ran, did its work, and left machine-readable proof that it succeeded.',
      highlightLines: [17],
    },
    {
      id: 'operational',
      caption:
        'ENVIRONMENT: OPERATIONAL. What you built — Node LTS, a folder with package.json, scripts run from a terminal, env-driven behavior, written artifacts, clean exit codes — is precisely the substrate Phase 11’s npm init playwright installs into. The dress rehearsal below stages the whole mission in the sandbox; do it even if the real one went perfectly.',
      highlightLines: [1, 17],
    },
  ],
  Viz: ChecklistBoard,
  underTheHood: (
    <>
      <p>
        Troubleshooting the two classic snags: <strong>“node: command not found”</strong> right
        after installing usually means the terminal was already open — close and reopen it so it
        re-reads its PATH (the list of folders the shell searches for commands).{' '}
        <strong>“Cannot use import statement outside a module”</strong> means box three’s{' '}
        <code>"type": "module"</code> line is missing — 9.3 told you this error’s whole story in
        advance.
      </p>
      <p>
        Windows note: the inline <code>NAME=value command</code> form is a Mac/Linux shell
        feature. PowerShell splits it: <code>$env:USER_NAME="Lijas"; node hello.js</code> — and
        reads the last exit code as <code>$LASTEXITCODE</code> instead of <code>$?</code>. Same
        machine, different dialect (9.2’s shells).
      </p>
      <p>
        What you did NOT need today is worth noticing: no bundler, no framework, no config beyond
        one JSON line. A runtime, a folder, a file, a terminal — that’s the irreducible core of
        every Node project, including the grandest test suite you’ll ever maintain.
      </p>
      <p>
        Job note: “set up a project from scratch” is a real interview task for automation roles —
        and you just rehearsed it end to end. In Phase 11, <code>npm init playwright@latest</code>{' '}
        will do a fancier version of boxes three-and-four for you; now you’ll know exactly what it
        scaffolded and why.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Fresh machine, Node just installed. Which command proves the install worked?',
      accept: ['node --version', 'node -v', 'node --version (or node -v)'],
      placeholder: 'the command…',
      why: 'node --version (short form: node -v) — a v-number reply means the runtime is installed and findable on your PATH.',
    },
    {
      kind: 'type-output',
      question: 'hello.js reads process.env.USER_NAME ?? "friend". You run it with nothing set. What prints?',
      accept: ['hello, friend!', 'hello, friend'],
      placeholder: 'the output…',
      why: 'Nothing set means USER_NAME is undefined, so ?? supplies the honest default: hello, friend! Launch with USER_NAME=Lijas and the same code re-aims.',
    },
    {
      kind: 'type-output',
      question: 'The run succeeded. What does echo $? print?',
      accept: ['0'],
      placeholder: 'a number…',
      why: '0 = success, the exit code every clean run leaves behind — the machine-readable proof CI reads instead of the logs.',
    },
  ],
  PlayExtra: () => <CodeExercise def={REHEARSAL_EXERCISE} />,
  teachBack: {
    prompt:
      'Brief a friend through the whole setup mission from memory: install and verify, project + init (+ which line you add by hand and why), the script’s moving parts, the two runs, and the two verifications at the end.',
    modelAnswer:
      'First the runtime: download Node LTS from nodejs.org — the long-term-support line teams actually run — install it, and prove it with node --version in a fresh terminal; a v-number means it landed. Then a home for the project: mkdir first-node, cd first-node, and npm init -y to generate package.json — the project ID card — plus one line added by hand: "type": "module", so .js files speak import/export instead of Node’s older require system. The script itself, hello.js, chains the course together: it reads process.env.USER_NAME with an ?? default of "friend", builds the greeting with a template literal, prints it, and writes the same line to a real file with writeFileSync. Two runs show the environment philosophy: plain node hello.js prints hello, friend! — the default speaking — while USER_NAME=Lijas node hello.js prints hello, Lijas! with zero code changes, because the environment aimed it. Two verifications close the loop: cat hello.txt proves the file was genuinely written to disk, and echo $? answering 0 proves the run left the success exit code behind — the same machine-readable number CI uses to turn pipelines green. That workspace is exactly what Playwright installs into.',
  },
  recap: [
    'The mission: Node LTS (verify: node --version) → mkdir + cd → npm init -y (+ add "type": "module" yourself) → hello.js (env + ?? + template + writeFileSync) → run plain, run aimed → cat the file, echo $? → 0.',
    'Every box was a lesson: 9.1 runtime, 9.2 terminal & exit codes, 8.2 npm, 9.3 module switch, 9.4 env, 9.5 files. Checkpoints assemble; they don’t introduce.',
    'This workspace is the exact substrate Playwright installs into (Phase 11). Classic snags: reopen the terminal after installing (PATH); “Cannot use import statement” = the missing "type": "module" line.',
  ],
}
