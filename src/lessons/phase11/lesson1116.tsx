import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, ChatBubble, Takeaway, Key } from '../../design/JobScene'

/**
 * 11.16 — CI: the pipeline, decoded
 * The third detective file: .github/workflows/playwright.yml line by line.
 * YAML glossed via 4.13; triggers; the fresh cloud box (WHY reproducibility
 * mattered all along); npm ci; browser install; secrets → env (9.4
 * completed); artifact upload if:always(); the exit-code verdict as
 * gatekeeper; publishing the report = the suite's real "deploy".
 */

const CODE = `# .github/workflows/playwright.yml
name: Playwright Tests
on:
  push: { branches: [main] }
  pull_request:
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
        env:
          BASE_URL: \${{ secrets.STAGING_URL }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/`

interface Sticky {
  label: string
  color: string
}
interface View {
  mode: 'board' | 'ribbon'
  stickies?: Sticky[]
  ribbonStage?: number
  verdict?: 'green' | 'red' | null
  console: string[]
  note: string
  badge?: string
}

const TEAL = 'var(--color-marker-teal)'
const BLUE = 'var(--color-pencil-blue)'
const CORAL = 'var(--color-marker-coral)'

const S1: Sticky = { label: 'on: push + pull_request → EVERY change interrogated', color: TEAL }
const S2: Sticky = { label: 'runs-on: ubuntu-latest → a fresh cloud box, every run', color: CORAL }
const S3: Sticky = { label: 'checkout + setup-node → 9.8’s checklist, robotized', color: BLUE }
const S4: Sticky = { label: 'npm ci → the exact lockfile tree (8.2), or fail loud', color: TEAL }
const S5: Sticky = { label: 'playwright install --with-deps → browsers + OS libs', color: BLUE }
const S6: Sticky = { label: 'env: BASE_URL from secrets → 9.4, completed', color: CORAL }
const S7: Sticky = { label: 'upload-artifact if: always() → evidence survives', color: TEAL }

const VIEWS: View[] = [
  {
    mode: 'ribbon', ribbonStage: 0, console: [],
    note: '8.2 introduced CI as “a robot teammate.” Today you read its instruction sheet — the third and final detective file',
  },
  {
    mode: 'board', stickies: [], console: [],
    note: 'the format is YAML: 4.13’s objects wearing indentation instead of braces — keys, values, lists. Read it like JSON without the punctuation',
  },
  {
    mode: 'board', stickies: [S1], console: [],
    note: 'on: — the TRIGGERS: every push to main and every pull request. 10.1’s dream, wired: no change escapes interrogation',
  },
  {
    mode: 'board', stickies: [S1, S2], console: [],
    note: 'runs-on: ubuntu-latest — a FRESH cloud Linux box per run: nothing installed, nothing remembered, destroyed after',
    badge: 'THIS box is why the reproducibility obsession was never pedantry: lockfiles (8.2), env config (9.4), webServer (11.12) — all of it exists so a blank machine can rebuild your world identically.',
  },
  {
    mode: 'board', stickies: [S1, S2, S3], console: ['✓ checkout · ✓ setup-node'],
    note: 'steps one and two: clone the repo, install Node — 9.8’s checklist, performed by a robot in seconds',
  },
  {
    mode: 'board', stickies: [S1, S2, S3, S4], console: ['✓ npm ci'],
    note: 'npm ci — not install: 8.2’s exact-lockfile command. The identical tree, or a loud failure. On a fresh box, exact is everything',
  },
  {
    mode: 'board', stickies: [S1, S2, S3, S4, S5], console: ['✓ playwright install --with-deps'],
    note: 'playwright install --with-deps: the browser binaries (11.2) PLUS the Linux system libraries they need — the blank box gets its puppets',
  },
  {
    mode: 'board', stickies: [S1, S2, S3, S4, S5, S6], console: ['✓ npx playwright test — BASE_URL aimed at staging'],
    note: 'the run itself, with env: from secrets — the CI VAULT injects STAGING_URL at run time. 9.4’s promise, completed end to end',
    badge: '${{ … }} is the workflow’s template slot; secrets.* live encrypted in repo settings — visible to the run, never to the repo. The plumbing you traced since 9.4 terminates here.',
  },
  {
    mode: 'board', stickies: [S1, S2, S3, S4, S5, S6, S7], console: ['⬆ playwright-report uploaded'],
    note: 'upload-artifact with if: always() — the report uploads EVEN WHEN TESTS FAIL (especially then): 11.14’s evidence kit survives the box’s death',
  },
  {
    mode: 'ribbon', ribbonStage: 4, verdict: 'red', console: ['exit 1 → ❌ on the pull request'],
    note: 'the verdict: the runner’s EXIT CODE (9.2, one last time) becomes the red ✗ or green ✓ on the pull request',
    badge: 'branch protection can FORBID merging on red — the suite becomes a gatekeeper no human has to enforce. That’s what “deploying” a test suite means: its VERDICTS guard every change.',
  },
  {
    mode: 'ribbon', ribbonStage: 4, verdict: 'green', console: [],
    note: 'and the report can publish to a URL (GitHub Pages) — a link your manager opens. The suite ships its verdicts and its evidence; that IS its deployment',
  },
]

function PipelineBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const STAGES = ['push', 'fresh box', 'npm ci + browsers', 'suite runs', 'verdict']
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'ribbon' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the pipeline, end to end
          </text>
          {STAGES.map((stage, i) => {
            const active = (view.ribbonStage ?? 0) >= i
            const isVerdict = i === 4
            return (
              <g key={stage} opacity={active ? 1 : 0.3}>
                <RoughRect x={20 + i * 84} y={70} width={76} height={54} seed={5501 + i} strokeWidth={active ? 2.2 : 1.4} stroke={isVerdict && view.verdict ? (view.verdict === 'green' ? TEAL : CORAL) : TEAL} fill={`color-mix(in srgb, ${isVerdict && view.verdict === 'red' ? CORAL : TEAL} ${active ? 9 : 3}%, transparent)`} fillStyle="solid" />
                <text x={58 + i * 84} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fontWeight={700} fill="var(--color-ink)">
                  <WrapTspans text={isVerdict && view.verdict ? (view.verdict === 'green' ? '✓ green' : '✗ red') : stage} x={58 + i * 84} maxPx={68} fontSize={8.5} />
                </text>
                {i < 4 && <text x={98 + i * 84} y={100} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">→</text>}
              </g>
            )
          })}
          {view.verdict === 'red' && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={110} y={150} width={220} height={40} seed={5510} strokeWidth={2.2} stroke={CORAL} fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
              <text x={220} y={168} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">merge blocked — the suite said no</text>
              <text x={220} y={184} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">evidence one click away (the uploaded report)</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'board' && (
        <g>
          <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the workflow case board
          </text>
          {(view.stickies ?? []).length === 0 && (
            <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
              (YAML: indentation-shaped objects — step through)
            </text>
          )}
          {(view.stickies ?? []).map((sticky, i) => (
            <motion.g key={sticky.label} initial={{ opacity: 0, y: -8, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 1 }} transition={{ type: 'spring', damping: 15 }}>
              <RoughRect x={40} y={34 + i * 30} width={360} height={25} seed={5520 + i} strokeWidth={1.6} stroke={sticky.color} fill={`color-mix(in srgb, ${sticky.color} 8%, transparent)`} fillStyle="solid" />
              <text x={220} y={51 + i * 30} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.6} fontWeight={700} fill="var(--color-ink)">{sticky.label}</text>
            </motion.g>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={250} width={392} fontSize={9} seed={5530} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={294} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const PIPELINE_EXERCISE: CodeExerciseDef = {
  id: 'l1116-run-the-pipeline',
  title: 'run the pipeline',
  task: 'Model the robot: steps run in order, a failure stops everything after it (2.7’s break, career edition), and the pipeline’s color comes from 9.2’s number. Run a healthy day and a broken one.',
  steps: [
    <>
      Write <code>runPipeline(steps)</code> for an array of{' '}
      <code>{'{ name, ok }'}</code> steps: walk them in order — print <code>✓ name</code> and
      continue while they pass; on the first failure print <code>✗ name</code> and STOP (break —
      nothing after a failed step runs).
    </>,
    <>
      After the loop, print the verdict: <code>pipeline: green (exit 0)</code> if everything
      passed, <code>pipeline: red (exit 1)</code> otherwise.
    </>,
    <>
      Run a healthy day (checkout, setup node, npm ci, playwright test — all ok), then a broken
      one where <code>npm ci</code> fails (a lockfile mismatch, say) — and notice the suite
      never even ran.
    </>,
  ],
  starter: '',
  expectedOutput: ['✓ checkout', '✓ setup node', '✓ npm ci', '✓ playwright test', 'pipeline: green (exit 0)', '✓ checkout', '✓ setup node', '✗ npm ci', 'pipeline: red (exit 1)'],
  mustUse: [
    { test: /function\s+runPipeline|const\s+runPipeline\s*=/, label: 'a function named runPipeline' },
    { test: /break/, label: 'a failed step STOPS the pipeline (2.7’s break)' },
    { test: /for\s*\(/, label: 'steps run in an ordered loop' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']pipeline: green \(exit 0\)["']\s*\)\s*;?\s*console\.log\s*\(\s*["']✓ checkout/, label: 'verdicts must be computed per run, not scripted' },
  ],
  modelAnswer: `function runPipeline(steps) {
  let failed = false;
  for (const step of steps) {
    if (step.ok) {
      console.log("✓ " + step.name);
    } else {
      console.log("✗ " + step.name);
      failed = true;
      break;
    }
  }
  console.log(failed ? "pipeline: red (exit 1)" : "pipeline: green (exit 0)");
}

const healthy = [
  { name: "checkout", ok: true },
  { name: "setup node", ok: true },
  { name: "npm ci", ok: true },
  { name: "playwright test", ok: true },
];

const broken = [
  { name: "checkout", ok: true },
  { name: "setup node", ok: true },
  { name: "npm ci", ok: false },
  { name: "playwright test", ok: true },
];

runPipeline(healthy);
runPipeline(broken);`,
}

export const lesson1116: LessonDef = {
  id: '11.16',
  hook: (
    <>
      <p>
        8.2 introduced CI as “a robot teammate that re-runs your suite on every change.” You’ve
        traced its fingerprints ever since — exit codes, lockfiles, secrets, the fresh-box
        philosophy.{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Today you read the robot’s actual instruction sheet — the workflow file 11.2 scaffolded
          — line by line, and wire the suite in as a gatekeeper on every change
        </HighlightMark>
        . This is what “deploying” a test suite means.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'third-file',
      caption:
        'The method is the one you’ve used twice: 8.6 decoded package.json, 11.3 decoded the config — this is the third and final detective file: .github/workflows/playwright.yml, created back in 11.2 when you answered “true” to the GitHub Actions question. Every line, no mystery.',
      highlightLines: [1, 2],
    },
    {
      id: 'yaml',
      caption:
        'First, the format: YAML — 4.13’s objects wearing INDENTATION instead of braces. name: is a key with a string value; on: holds a nested object; steps: is a list (each - a list item). Read it exactly like JSON with the punctuation removed, and it stops looking alien immediately.',
      highlightLines: [2, 3, 9],
    },
    {
      id: 'triggers',
      caption:
        'on: — the TRIGGERS: this workflow fires on every push to main AND every pull request (a PULL REQUEST = a proposed change, submitted for teammates’ review before it may join main — git’s change-proposal ritual, 8.2’s gloss extended). 10.1’s entire dream — re-ask every question after every change — is these four lines.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'fresh-box',
      caption:
        'runs-on: ubuntu-latest — GitHub boots a FRESH cloud Linux machine for this run: nothing installed, nothing remembered from last time, destroyed afterward. And here’s the retrospective payoff: THIS box is why reproducibility was never pedantry — lockfiles, env config, webServer all exist so a blank machine can rebuild your world identically.',
      highlightLines: [8],
    },
    {
      id: 'checkout-node',
      caption:
        'The first two steps: actions/checkout clones the repo onto the box; actions/setup-node installs Node. Recognize it? It’s 9.8’s checklist — “install Node, get the project” — performed by a robot in seconds. (uses: means “run a published, versioned action” — someone else’s step, from a registry. Sound familiar? 8.2 thinking, for CI steps.)',
      highlightLines: [10, 11],
    },
    {
      id: 'npm-ci',
      caption:
        'npm ci — not npm install: 8.2’s exact-lockfile command, finally in its natural habitat. It installs the IDENTICAL dependency tree the lockfile pins, or fails loudly if package.json and the lockfile disagree. On a fresh box, “roughly the same” is worthless; exact is everything.',
      highlightLines: [12],
    },
    {
      id: 'install-browsers',
      caption:
        'npx playwright install --with-deps: the browser binaries from 11.2 — the blank box has none — plus the Linux system libraries those browsers need to run headless. One command and the puppets arrive. (Real pipelines often cache this step; the idea is unchanged.)',
      highlightLines: [13],
    },
    {
      id: 'run-with-secrets',
      caption:
        'The run itself: npx playwright test, with an env: block injecting BASE_URL from secrets.STAGING_URL. Follow the whole chain you built: the CI vault holds the secret (never the repo — 9.4), the ${{ … }} template slot injects it at run time, the config reads process.env.BASE_URL (11.3), and every test aims at staging. The plumbing, complete, end to end.',
      highlightLines: [14, 15, 16],
    },
    {
      id: 'artifact-upload',
      caption:
        'Then the step that saves your 3am self: upload-artifact with if: always() — upload the report EVEN WHEN TESTS FAILED. Especially then: the box is about to be destroyed, and 11.14’s entire evidence kit (screenshots, videos, traces, inside the HTML report) survives only if it ships out. always() is two words doing enormous work.',
      highlightLines: [17, 18, 19, 20, 21],
    },
    {
      id: 'the-verdict',
      caption:
        'And the verdict: the test run’s EXIT CODE — 9.2’s number, on its final appearance — becomes the green ✓ or red ✗ on the pull request. With branch protection (a repo rule: no MERGING — no accepting the change into main — while checks are red), the suite is a gatekeeper no human has to enforce.',
      highlightLines: [14],
    },
    {
      id: 'publishing',
      caption:
        'Last piece — the “deploy” question answered honestly: a test suite doesn’t deploy like an app; its VERDICTS and EVIDENCE do. The uploaded report is downloadable per run, and teams publish it to a URL (GitHub Pages) so anyone — your manager, your future self — opens last night’s results in a browser. The suite ships its judgment. That is its deployment.',
      highlightLines: [17, 20, 21],
    },
  ],
  Viz: PipelineBoard,
  underTheHood: (
    <>
      <p>
        The pieces compose exactly as you’d guess: shards (11.15) become a matrix of jobs
        (<code>strategy: matrix: shard: [1, 2, 3, 4]</code>), each running{' '}
        <code>--shard={'${{ matrix.shard }}'}</code>, with a final job merging reports. Nightly
        full-matrix runs (11.12’s budget) use an <code>on: schedule:</code> cron trigger. The
        YAML grows; the concepts don’t.
      </p>
      <p>
        GitHub Actions is one CI among peers — GitLab CI, Jenkins, CircleCI — all the same
        anatomy: triggers, a fresh runner, ordered steps, secrets, artifacts, an exit-code
        verdict. Read one fluently (you now do) and the others are dialects, like 9.2’s shells.
      </p>
      <p>
        The <code>CI=true</code> convention completes here. Actions sets it automatically. That
        flips every <code>process.env.CI ? … : …</code> you decoded in 11.3 — retries on,
        workers pinned, forbidOnly armed, webServer never reused. One ambient variable, and the
        whole config shifts into robot mode.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Why npm ci instead of npm install on the CI box? (what does ci guarantee)',
      accept: ['exact lockfile tree', 'the exact lockfile versions', 'installs exactly what the lockfile says', 'identical tree from the lockfile', 'exact versions or fail', 'lockfile-exact install', 'exact versions', 'the exact versions'],
      placeholder: 'it guarantees…',
      why: 'npm ci installs the IDENTICAL tree the lockfile pins — or fails loudly on any mismatch (8.2). On a machine born blank every run, exact reproduction is the whole game.',
    },
    {
      kind: 'type-output',
      question: 'Why does the artifact-upload step say if: always()?',
      accept: ['so the report uploads even on failure', 'upload even when tests fail', 'evidence survives failures', 'so evidence uploads on failure too', 'reports upload even if tests failed'],
      placeholder: 'so that…',
      why: 'So the report — with 11.14’s screenshots, videos, and traces — uploads EVEN WHEN tests fail. Especially then: the box is destroyed after the run; unuploaded evidence dies with it.',
    },
    {
      kind: 'type-output',
      question: 'What single value turns the pull request’s check red or green?',
      accept: ['the exit code', 'exit code', 'the runner’s exit code', '9.2’s exit code', 'the exit code (0 or 1)'],
      placeholder: 'the value…',
      why: 'The exit code (9.2, full circle): 0 → green ✓, non-zero → red ✗ — and with branch protection, red blocks the merge. The suite as gatekeeper, no human enforcement needed.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, standup will panic over three words.</Scene>
      <ChatBubble who="teammate" face="😨">CI is broken!</ChatBubble>
      <ChatBubble who="you · ninety seconds later" face="😊" accent indent>
        npm ci failed. Lockfile drift, not a test problem.
      </ChatBubble>
      <Takeaway>
        <Key>Being the person who can read the pipeline is powerful.</Key> That person gets
        handed the release keys.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={PIPELINE_EXERCISE} />,
  teachBack: {
    prompt:
      'Read the whole pipeline aloud for a friend: triggers, the fresh box (and what it retroactively justifies), each step in order, how secrets reach the config, why if: always() matters, and what the verdict + published report make the suite BE.',
    modelAnswer:
      'The workflow file is YAML — JSON’s indentation-based cousin — and it starts with triggers: on every push to main and every pull request, the pipeline fires, which is literally 10.1’s dream of re-asking every question after every change, automated. runs-on boots a fresh cloud Linux box with nothing installed and nothing remembered — the machine that retroactively justifies the whole reproducibility obsession: lockfiles, env-driven config, and webServer exist so a blank box can rebuild the world identically. The steps then run in order: checkout clones the repo, setup-node installs Node — 9.8’s checklist robotized — then npm ci installs the exact lockfile tree or fails loudly, then playwright install --with-deps fetches the browser binaries plus the Linux libraries they need. The suite runs with an env block injecting BASE_URL from the encrypted secrets vault through the ${{ }} template slot — the 9.4 plumbing completed end to end: vault → env → config → every test aimed at staging. Next, upload-artifact with if: always() ships the HTML report out EVEN when tests fail — especially then, because the box is destroyed and the traces die with it otherwise. Finally the run’s exit code — 9.2, full circle — becomes the red or green check on the pull request, and branch protection makes red block the merge. Publish the report to a URL and the suite has truly deployed: not its code — its verdicts and evidence, guarding every change automatically.',
  },
  recap: [
    'The third detective file: YAML = 4.13’s objects in indentation. Triggers (push/PR) = every change interrogated. runs-on = a FRESH box per run — the machine all your reproducibility work was secretly for.',
    'Steps in order: checkout → setup-node (9.8 robotized) → npm ci (exact lockfile — 8.2) → playwright install --with-deps → test with secrets→env→config (9.4 completed) → upload-artifact if: always() (evidence outlives the box — 11.14).',
    'The verdict = the exit code (9.2, full circle): red blocks merges under branch protection — the suite as automatic gatekeeper. “Deploying” a suite = publishing its VERDICTS + report (e.g. GitHub Pages), not its code.',
  ],
}
