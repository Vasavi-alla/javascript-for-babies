import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.4 — process: argv, env & exit
 * The program introspecting its own run: argv (inputs start at index 2!),
 * env vars as settings that live OUTSIDE the code (BASE_URL, secrets),
 * process.exit + the 9.2 exit-code contract, console.error/stderr. The same
 * script, aimed at different targets by the environment alone.
 */

const CODE = `// greet.js
console.log(process.argv[2]);
//  $ node greet.js Lijas   →  Lijas

// check-env.js
const base = process.env.BASE_URL ?? "http://localhost:3000";
console.log(\`testing against: \${base}\`);

//  $ node check-env.js
//  →  testing against: http://localhost:3000
//  $ BASE_URL=https://staging.shop.com node check-env.js
//  →  testing against: https://staging.shop.com

if (!process.env.API_KEY) {
  console.error("missing API_KEY");
  process.exit(1);
}`

interface View {
  mode: 'argv' | 'env' | 'exit'
  argvHot?: number | null
  envChip?: string | null
  termLines?: string[]
  exitChip?: '0' | '1' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'argv', argvHot: null, console: [],
    note: 'one global object describes THIS very run of your program: process — the program, introspecting itself',
  },
  {
    mode: 'argv', argvHot: null, console: [],
    note: 'process.argv = the command line, as an array: [node’s path, the script’s path, …your words]',
  },
  {
    mode: 'argv', argvHot: 2, termLines: ['$ node greet.js Lijas', 'Lijas'], console: [],
    note: 'your inputs start at INDEX 2 — the classic gotcha. argv[2] is "Lijas"',
    badge: 'scripts that take input with no UI at all — the terminal IS the interface',
  },
  {
    mode: 'env', envChip: null, termLines: ['$ node check-env.js', 'testing against: http://localhost:3000'], console: [],
    note: 'process.env = an object of ENVIRONMENT VARIABLES — named values the OS hands every program it starts',
  },
  {
    mode: 'env', envChip: 'BASE_URL=https://staging.shop.com', termLines: ['$ BASE_URL=… node check-env.js', 'testing against: https://staging.shop.com'], console: [],
    note: 'the payoff: the SAME code, aimed at a different target — the environment decided, not an edit',
  },
  {
    mode: 'env', envChip: 'BASE_URL=https://staging.shop.com', termLines: ['$ BASE_URL=… node check-env.js', 'testing against: https://staging.shop.com'], console: [],
    note: 'and notice ?? doing exactly what 8.4 promised: a default only when the setting is genuinely absent',
  },
  {
    mode: 'env', envChip: 'API_KEY=•••••••• (secret)', console: [],
    note: 'SECRETS live here too: keys and passwords never go in code — git remembers forever',
    badge: 'anyone with the repo has everything ever committed. Secrets arrive as env vars, injected by the machine that runs the suite.',
  },
  {
    mode: 'exit', exitChip: '1', termLines: ['$ node check-env.js', 'missing API_KEY'], console: [],
    note: 'process.exit(1) ends the run NOW with 9.2’s number — refuse loudly, turn CI red',
  },
  {
    mode: 'exit', exitChip: '1', termLines: ['$ node check-env.js', 'missing API_KEY'], console: [],
    note: 'detail: console.error prints to a SEPARATE stream (stderr) — same look, different pipe',
    badge: 'terminals and CI can split normal output from complaints — logs stay clean, errors stay findable',
  },
  {
    mode: 'env', envChip: 'BASE_URL · API_KEY · CI=true', console: [],
    note: 'real suites run on this plumbing: playwright.config reads process.env.BASE_URL; CI injects it per environment',
  },
]

const ARGV_CELLS = ['/usr/bin/node', '/…/greet.js', '"Lijas"']

function ProcessBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'argv' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            process.argv — the command line as an array
          </text>
          {ARGV_CELLS.map((cell, i) => {
            const hot = view.argvHot === i
            return (
              <g key={i}>
                <RoughRect x={30 + i * 130} y={48} width={120} height={46} seed={2201 + i} strokeWidth={hot ? 2.6 : 1.6} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
                <text x={90 + i * 130} y={76} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{cell}</text>
                <text x={90 + i * 130} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fontWeight={700} fill={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>[{i}]</text>
              </g>
            )
          })}
          <text x={220} y={136} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            [0] node itself · [1] the script · [2]+ YOUR inputs
          </text>
        </g>
      )}

      {view.mode === 'env' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the environment — settings from OUTSIDE the code
          </text>
          <RoughRect x={60} y={44} width={320} height={54} seed={2210} strokeWidth={2} stroke={view.envChip ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'} roughness={1.8} fill={view.envChip ? 'color-mix(in srgb, var(--color-marker-coral) 8%, transparent)' : 'transparent'} fillStyle="solid" />
          <text x={220} y={66} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill={view.envChip ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'}>
            process.env
          </text>
          <text x={220} y={84} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">
            {view.envChip ?? '{ }  — nothing set for this run'}
          </text>
          <text x={220} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">↓ handed to the program at launch</text>
          <RoughRect x={120} y={128} width={200} height={40} seed={2211} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={153} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">check-env.js — unchanged</text>
        </g>
      )}

      {view.mode === 'exit' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the guard pattern — refuse loudly
          </text>
          <RoughRect x={80} y={44} width={280} height={56} seed={2220} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={68} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">if (!process.env.API_KEY)</text>
          <text x={220} y={88} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-marker-coral)">console.error(…) · process.exit(1)</text>
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
            <RoughRect x={186} y={116} width={68} height={40} seed={2221} strokeWidth={2.4} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 12%, transparent)" fillStyle="solid" />
            <text x={220} y={142} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">1</text>
          </motion.g>
          <text x={220} y={172} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">exit code → CI turns red before a single wrong test runs</text>
        </g>
      )}

      {(view.termLines ?? []).length > 0 && (
        <g>
          <RoughRect x={40} y={184} width={360} height={52} seed={2230} strokeWidth={1.8} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
          {(view.termLines ?? []).map((line, i) => (
            <text key={i} x={54} y={204 + i * 17} fontFamily="var(--font-code)" fontSize={9} fill={line.startsWith('$') ? 'var(--color-marker-teal)' : 'var(--color-ink)'}>
              {line}
            </text>
          ))}
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={258} width={392} fontSize={9.5} seed={2240} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={316} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const PROCESS_EXERCISE: CodeExerciseDef = {
  id: 'l94-process-model',
  title: 'the environment-driven script',
  task: 'Model a real suite’s startup: read an input from argv, aim at a target from env (with an honest default), and guard a required secret with an exit code.',
  steps: [
    <>
      Model the run: <code>argv</code> as <code>["node", "greet.js", "Lijas"]</code> and{' '}
      <code>env</code> as <code>{'{ BASE_URL: "https://staging.shop.com" }'}</code>.
    </>,
    <>
      Print the user’s input — remember where inputs start in argv.
    </>,
    <>
      Write <code>targetUrl(env)</code> returning <code>env.BASE_URL</code> with the default{' '}
      <code>"http://localhost:3000"</code> when it’s absent (8.4’s honest default). Print it for{' '}
      <code>env</code>, then for an empty object.
    </>,
    <>
      Write <code>guard(env)</code> returning the exit code: <code>0</code> when{' '}
      <code>BASE_URL</code> is present, <code>1</code> when missing. Print it for both
      environments.
    </>,
  ],
  starter: '',
  expectedOutput: ['Lijas', 'https://staging.shop.com', 'http://localhost:3000', '0', '1'],
  mustUse: [
    { test: /\[\s*2\s*\]/, label: 'the input is read at argv index 2' },
    { test: /\?\?/, label: 'the default arrives via ?? (8.4)' },
    { test: /function\s+targetUrl\s*\(|const\s+targetUrl\s*=/, label: 'a function named targetUrl' },
    { test: /function\s+guard\s*\(|const\s+guard\s*=/, label: 'a function named guard' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']Lijas["']\s*\)/, label: 'no hard-coded input — read it from argv' },
    { test: /console\.log\s*\(\s*["']http:\/\/localhost:3000["']\s*\)/, label: 'no hard-coded default print — targetUrl must supply it' },
  ],
  modelAnswer: `const argv = ["node", "greet.js", "Lijas"];
const env = { BASE_URL: "https://staging.shop.com" };

console.log(argv[2]);

function targetUrl(env) {
  return env.BASE_URL ?? "http://localhost:3000";
}

console.log(targetUrl(env));
console.log(targetUrl({}));

function guard(env) {
  return env.BASE_URL ? 0 : 1;
}

console.log(guard(env));
console.log(guard({}));`,
}

export const lesson94: LessonDef = {
  id: '9.4',
  hook: (
    <>
      <p>
        How does the SAME test suite run against localhost on your machine, against staging — the
        team’s private practice copy of the site — in CI, and against the live site itself,
        without changing a line of code? Meet{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          process: the object through which a Node program reads its own run — its command line,
          its environment, its exit
        </HighlightMark>
        .
      </p>
      <p>
        This is where <code>BASE_URL</code> lives, where secrets hide, and where 9.2’s exit code
        gets set on purpose. Small lesson, permanent plumbing.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'meet-process',
      caption:
        'In Node, one built-in global describes THIS very run of your program: process. Not the file, not the language — this execution, right now: what command started it, what environment surrounds it, how it will end. A program, introspecting itself.',
      highlightLines: [2],
    },
    {
      id: 'argv',
      caption:
        'process.argv is the command line, delivered as an array (4.x): index 0 is node itself, index 1 is your script’s path — and YOUR words start at INDEX 2. That off-by-two is the classic first-day gotcha; now it’s yours in advance.',
      highlightLines: [2],
    },
    {
      id: 'argv-use',
      caption:
        'So node greet.js Lijas makes argv[2] the string "Lijas" — a script that takes input with no HTML form, no prompt box, no UI at all. The terminal IS the interface. (Real runners parse dozens of these — playwright test --headed is argv all the way down.)',
      highlightLines: [2, 3],
    },
    {
      id: 'env-what',
      caption:
        'Second channel: process.env — an object holding the ENVIRONMENT VARIABLES, named values the operating system hands every program it starts. They exist OUTSIDE your code: the same script can be launched with different surroundings.',
      highlightLines: [6],
    },
    {
      id: 'env-why',
      caption:
        'And that’s the payoff pattern of the whole lesson: line 6 reads process.env.BASE_URL. Launch plain → localhost. Launch with BASE_URL=https://staging.shop.com → staging. The code never changed; the ENVIRONMENT aimed it. One suite, many targets.',
      highlightLines: [6, 7, 9, 10, 11, 12],
    },
    {
      id: 'nullish-earns',
      caption:
        'Look closely at line 6’s ?? — 8.4 earning its keep already: “use BASE_URL if it’s genuinely set; fall back to localhost only when it’s absent.” Env values are strings or undefined, exactly the shape ?? was built for.',
      highlightLines: [6],
    },
    {
      id: 'secrets',
      caption:
        'The environment is also where SECRETS live: API keys, passwords, tokens. They never go in code — git (8.2) remembers forever, so anyone with the repo — the project’s shared git folder — would own every secret ever committed. Instead the machine running the suite injects them as env vars at launch.',
      highlightLines: [14],
    },
    {
      id: 'exit',
      caption:
        'Third channel: the exit. process.exit(1) ends the run RIGHT NOW with exit code 1 — 9.2’s number, set on purpose. Here it guards a requirement: no API_KEY? Refuse loudly before a single test runs, and CI turns red for the honest reason.',
      highlightLines: [14, 15, 16, 17],
    },
    {
      id: 'stderr',
      caption:
        'One detail worth owning: line 15 uses console.error, not console.log. It prints to a SEPARATE stream — stderr — so terminals and CI can split normal output from complaints. Same look on your screen, different pipe underneath: logs stay clean, errors stay findable.',
      highlightLines: [15],
    },
    {
      id: 'real-suite',
      caption:
        'Zoom out to the real thing: a Playwright repo’s config reads process.env.BASE_URL, CI provides a different value per environment, and secrets come from the CI’s locked vault — never the repo. You have now seen the entire plumbing that Phase 11 will simply assume.',
      highlightLines: [6, 14],
    },
  ],
  Viz: ProcessBoard,
  underTheHood: (
    <>
      <p>
        Everything in <code>process.env</code> is a <strong>string</strong> — always.{' '}
        <code>PORT=3000</code> arrives as <code>"3000"</code>, and <code>CI=true</code> arrives as{' '}
        <code>"true"</code> (the string!). The 1.9 coercion traps live here in the wild; real
        configs convert deliberately (<code>Number(process.env.PORT)</code>,{' '}
        <code>process.env.CI === "true"</code>).
      </p>
      <p>
        Where do env vars come from? Layered sources: your shell session, the launch line itself
        (<code>BASE_URL=… node app.js</code>), CI pipeline settings, and — very commonly — a{' '}
        <code>.env</code> file loaded by a small library, with <code>.env</code> listed in{' '}
        <code>.gitignore</code> (8.2’s rule again: local, regenerable, never committed).
      </p>
      <p>
        Honesty note on <code>process.exit()</code>: it’s an ejector seat — it ends the process{' '}
        <em>immediately</em>, without waiting for pending async work (6.x’s parked jobs are simply
        abandoned). Guard clauses at startup: perfect. Sprinkled mid-flight: a classic source of
        half-written files.
      </p>
      <p>
        Job note: the convention <code>CI=true</code> is set by virtually every CI provider, and
        real Playwright configs read it to switch behavior — more retries and no headed browser on
        CI, for example. One env var, two worlds correctly served.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'You run: node greet.js Lijas — what is process.argv[2]?',
      accept: ['Lijas', '"Lijas"'],
      placeholder: 'the value…',
      why: 'argv[0] is node itself, argv[1] is the script path — your inputs start at index 2. The classic off-by-two, now yours in advance.',
    },
    {
      kind: 'type-output',
      question: 'PORT=3000 arrives in process.env — what is typeof process.env.PORT?',
      accept: ['string', '"string"'],
      placeholder: 'the type…',
      why: 'Everything in process.env is a string, always — "3000", not 3000. Real configs convert deliberately with Number(...) to dodge 1.9’s traps.',
    },
    {
      kind: 'type-output',
      question: 'A startup guard finds a required secret missing and calls process.exit(1). What color does the CI pipeline turn?',
      accept: ['red', 'Red', 'RED'],
      placeholder: 'green / red…',
      why: 'Non-zero exit = failure (9.2’s contract) — the pipeline turns red before a single misconfigured test runs. Refusing loudly is a feature.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PROCESS_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend how one test suite runs against localhost, staging, and production without code changes — covering argv, env vars (and where secrets live), and the exit-code guard pattern.',
    modelAnswer:
      'A Node program can read its own run through the process object, and that’s the whole trick. First, process.argv is the command line as an array — node itself at index 0, the script at index 1, and your actual inputs from index 2 onward — so scripts take input straight from the terminal with no UI. Second, process.env is an object of environment variables: named string values the operating system hands the program at launch. The suite reads process.env.BASE_URL ?? "http://localhost:3000" — the ?? supplies the local default only when nothing is set — so launching with BASE_URL=staging aims every test at staging, and CI sets a different value per environment. The code never changes; the environment aims it. Secrets follow the same route: API keys never go in code, because git remembers forever — the CI’s vault injects them as env vars at run time. Third, the exit: process.exit(1) ends the run immediately with a non-zero exit code, so a startup guard that finds a required variable missing can refuse loudly and turn the pipeline red before any test runs — with the complaint printed via console.error, which goes to the separate stderr stream so CI can tell complaints from output.',
  },
  recap: [
    'process = this very run, introspected. argv = the command line as an array — YOUR inputs start at index 2. Everything in process.env is a STRING.',
    'Env vars are settings from OUTSIDE the code: BASE_URL aims the suite; secrets are injected (never committed — git remembers forever). ?? supplies honest defaults.',
    'process.exit(1) sets 9.2’s number on purpose — the startup guard pattern. console.error goes to stderr, a separate stream CI can split from normal output.',
  ],
}
