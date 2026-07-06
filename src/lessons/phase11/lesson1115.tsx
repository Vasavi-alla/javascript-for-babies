import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.15 — Parallelism, retries & flakiness
 * Workers (why parallel browsers work — 9.6's insight at test scale),
 * sharding across machines, ordering non-guarantees, retries' double edge
 * (flaky mark ≠ pardon), the flakiness clinic (4 causes ↔ 4 cures, all
 * taught already), the triage method, and the zero-flake policy.
 */

const CODE = `workers: 4,          // 4 tests at once
fullyParallel: true,
retries: process.env.CI ? 2 : 0,

// CI splits across MACHINES:
// $ npx playwright test --shard=1/4

// the report’s honesty:
//   ✓ checkout works
//   ⚠ cart total updates (flaky: passed on retry)
//   ✗ profile saves

// reproduce a flake on purpose:
// $ npx playwright test cart.spec --repeat-each=20`

interface View {
  mode: 'lanes' | 'shards' | 'retry' | 'clinic' | 'triage'
  serial?: boolean
  flakyMark?: boolean
  clinicHot?: number | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'lanes', serial: true, console: ['200 tests × 8s = 27 minutes'],
    note: 'serial reality: 200 E2E tests, one after another ≈ 27 minutes. But look WHAT the time is: mostly browsers WAITING',
  },
  {
    mode: 'lanes', serial: false, console: ['4 workers ≈ 7 minutes'],
    note: 'a WORKER = an independent runner process with its own browser. 4 workers ≈ 4× — 9.6’s parked-jobs insight, at test scale',
  },
  {
    mode: 'lanes', serial: false, console: [],
    note: 'what makes this SAFE is 11.7: fresh context per test, no shared state — parallel tests cannot collide with each other',
    badge: 'and what breaks it: any test depending on another running first. Parallel order is NOT guaranteed — isolation isn’t politeness, it’s a prerequisite',
  },
  {
    mode: 'shards', console: ['machine 1: tests 1–50 · machine 2: 51–100 · …'],
    note: 'CI scales further: SHARDING splits the suite across MACHINES — --shard=1/4 on four runners quarters the clock',
  },
  {
    mode: 'retry', flakyMark: false, console: ['✗ cart total updates → retrying…'],
    note: 'retries: a failed test re-runs FRESH (new context, new bottle) up to N times. On CI: 2. Locally: 0 — raw truth at the desk (11.3)',
  },
  {
    mode: 'retry', flakyMark: true, console: ['⚠ cart total updates — flaky: passed on retry'],
    note: 'pass-on-retry is marked FLAKY in the report — never quietly green. The mark is a BUG REPORT, not a pardon',
  },
  {
    mode: 'retry', flakyMark: true, console: [],
    note: 'the double edge: retries keep one cosmic-ray blip from blocking 50 merges — AND they let real intermittent bugs hide',
    badge: 'the resolution is not picking a side: it’s the MARK (never quietly green) + the zero-flake policy (last step) — the first edge without the second.',
  },
  {
    mode: 'clinic', clinicHot: 0, console: [],
    note: 'the clinic: ① RACE — asserting before the page caught up → cured by 11.6 · ② SHARED STATE — colliding on one account → cured by 11.8’s unique data',
  },
  {
    mode: 'clinic', clinicHot: 3, console: [],
    note: 'cause ③: TIME — Date.now, midnight, timezones. Cure: 10.6’s fake clocks (page.clock). Cause ④: real-backend weather. Cure: 11.10’s mocking',
  },
  {
    mode: 'triage', console: ['$ npx playwright test cart.spec --repeat-each=20', '18 passed · 2 failed — read the failing trace'],
    note: 'the triage method: a flake IS reproducible — run it alone ×20, read the failing run’s trace (11.14), name the cause from the list of four',
  },
  {
    mode: 'triage', console: [],
    note: 'and the policy that separates great teams: quarantine the flake (fixme, 11.13) and fix it as P1 — priority one, before new work',
    badge: 'an ignored flake trains humans to ignore red — and THEN a real bug walks past everyone. Zero tolerance protects the suite’s one asset: trust (10.1).',
  },
]

function WorkerLanes({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'lanes' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            {view.serial ? 'one lane, one test at a time' : 'four workers, four lanes'}
          </text>
          {view.serial ? (
            <g>
              <RoughRect x={40} y={60} width={360} height={40} seed={5401} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              {[0, 1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <RoughRect x={48 + i * 70} y={68} width={62} height={24} seed={5405 + i} strokeWidth={1.4} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 7%, transparent)" fillStyle="solid" />
                  <text x={79 + i * 70} y={84} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">t{i + 1} · 8s</text>
                </g>
              ))}
              <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">…195 more, single file. Most of each 8s is WAITING (network, render)</text>
            </g>
          ) : (
            <g>
              {[0, 1, 2, 3].map((lane) => (
                <g key={lane}>
                  <text x={34} y={72 + lane * 46} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">w{lane + 1}</text>
                  <RoughRect x={56} y={54 + lane * 46} width={344} height={34} seed={5410 + lane} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
                  {[0, 1, 2].map((i) => (
                    <g key={i}>
                      <RoughRect x={64 + i * 112} y={60 + lane * 46} width={100} height={22} seed={5415 + lane * 3 + i} strokeWidth={1.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
                      <text x={114 + i * 112} y={75 + lane * 46} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7} fill="var(--color-ink)">test {lane * 3 + i + 1}</text>
                    </g>
                  ))}
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {view.mode === 'shards' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            sharding: the suite, quartered across machines
          </text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <RoughRect x={40 + (i % 2) * 190} y={48 + Math.floor(i / 2) * 84} width={170} height={68} seed={5420 + i} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
              <text x={125 + (i % 2) * 190} y={74 + Math.floor(i / 2) * 84} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">CI machine {i + 1}</text>
              <text x={125 + (i % 2) * 190} y={94 + Math.floor(i / 2) * 84} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">--shard={i + 1}/4</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'retry' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the retry, honestly reported
          </text>
          <RoughRect x={60} y={48} width={140} height={44} seed={5430} strokeWidth={2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
          <text x={130} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">attempt 1: ✗</text>
          <text x={130} y={84} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">fresh context</text>
          <text x={218} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">→</text>
          <RoughRect x={240} y={48} width={140} height={44} seed={5431} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
          <text x={310} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">attempt 2: ✓</text>
          <text x={310} y={84} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">fresh again</text>
          {view.flakyMark && (
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
              <RoughRect x={120} y={124} width={200} height={40} seed={5432} strokeWidth={2.4} stroke="var(--color-marker-yellow)" fill="color-mix(in srgb, var(--color-marker-yellow) 18%, transparent)" fillStyle="solid" />
              <text x={220} y={149} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">⚠ FLAKY — on the record</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'clinic' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the flakiness clinic — four causes, four cures
          </text>
          {[
            { cause: '① race: assert before the page caught up', cure: 'cure: 11.6 web-first' },
            { cause: '② shared state: tests colliding on one account', cure: 'cure: 11.8 unique data' },
            { cause: '③ time: Date.now, midnight, timezones', cure: 'cure: 10.6 fake clocks' },
            { cause: '④ real-backend weather (shared staging)', cure: 'cure: 11.10 mocking' },
          ].map((row, i) => {
            const hot = (view.clinicHot === 0 && i <= 1) || (view.clinicHot === 3 && i >= 2)
            return (
              <g key={row.cause} opacity={view.clinicHot === null || hot ? 1 : 0.35}>
                <RoughRect x={36} y={44 + i * 46} width={368} height={38} seed={5440 + i} strokeWidth={hot ? 2.2 : 1.5} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 7%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={50} y={60 + i * 46} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink)">{row.cause}</text>
                <text x={50} y={76 + i * 46} fontFamily="var(--font-hand)" fontSize={8.5} fontWeight={700} fill="var(--color-marker-teal)">{row.cure}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'triage' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the triage: make it confess
          </text>
          {['run it ALONE, ×20 (--repeat-each)', 'read the FAILING run’s trace (11.14)', 'name the cause from the four', 'quarantine (fixme) + fix as P1'].map((step, i) => (
            <g key={step}>
              <RoughRect x={70} y={44 + i * 48} width={300} height={38} seed={5450 + i} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
              <text x={220} y={68 + i * 48} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink)">{i + 1}. {step}</text>
            </g>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={250} width={392} fontSize={9} seed={5460} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const FLAKE_EXERCISE: CodeExerciseDef = {
  id: 'l1115-flake-detector',
  title: 'build the flake detector',
  task: 'Given repeat-run results, classify each test the way the report does: stable, broken, or the dangerous third thing — with the failure rate computed as evidence.',
  steps: [
    <>
      Write <code>classify(results)</code> for an array of <code>"pass"</code>/<code>"fail"</code>{' '}
      strings: every one passing → <code>"stable"</code>; every one failing →{' '}
      <code>"broken"</code>; a mix → <code>"FLAKY — investigate"</code> (4.10’s every asks both
      questions).
    </>,
    <>
      Write <code>failRate(results)</code>: <code>N of M runs failed</code>, counted with a
      filter.
    </>,
    <>
      Run three histories: ten passes → print its class; ten fails → print its class; and{' '}
      <code>["pass","fail","pass","pass","fail","pass","pass","pass","pass","pass"]</code> →
      print its class AND its fail rate.
    </>,
  ],
  starter: '',
  expectedOutput: ['stable', 'broken', 'FLAKY — investigate', '2 of 10 runs failed'],
  mustUse: [
    { test: /\.every\s*\(/, label: 'classification asks with .every (4.10)' },
    { test: /\.filter\s*\(/, label: 'the rate counts with .filter' },
    { test: /function\s+classify|const\s+classify\s*=/, label: 'a function named classify' },
    { test: /function\s+failRate|const\s+failRate\s*=/, label: 'a function named failRate' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']2 of 10 runs failed["']\s*\)/, label: 'no hard-coded rates — count them' },
  ],
  modelAnswer: `function classify(results) {
  if (results.every((r) => r === "pass")) return "stable";
  if (results.every((r) => r === "fail")) return "broken";
  return "FLAKY — investigate";
}

function failRate(results) {
  const fails = results.filter((r) => r === "fail").length;
  return fails + " of " + results.length + " runs failed";
}

const allPass = ["pass","pass","pass","pass","pass","pass","pass","pass","pass","pass"];
const allFail = ["fail","fail","fail","fail","fail","fail","fail","fail","fail","fail"];
const mixed = ["pass","fail","pass","pass","fail","pass","pass","pass","pass","pass"];

console.log(classify(allPass));
console.log(classify(allFail));
console.log(classify(mixed));
console.log(failRate(mixed));`,
}

export const lesson1115: LessonDef = {
  id: '11.15',
  hook: (
    <>
      <p>
        Two hundred browser tests, run one at a time: twenty-seven minutes. The machinery of
        scale —{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          workers, sharding, retries — cuts that to minutes. And its price is the topic every
          team fights about: FLAKINESS
        </HighlightMark>
        . Today: the machinery, the honest retry debate, and the clinic — four causes of flakes,
        each with a cure you’ve already learned.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'serial-reality',
      caption:
        'The serial baseline: 200 E2E tests × 8s ≈ 27 minutes. But look INSIDE each 8 seconds: the browser mostly WAITS — for the network (6.7), for rendering (7.8), for auto-waiting polls (11.6). Waiting doesn’t need the whole machine. You’ve seen this shape before…',
      highlightLines: [1],
    },
    {
      id: 'workers',
      caption:
        '…in 9.6: parked jobs, one collector. Test-scale version: a WORKER is an independent runner process with its own browser. workers: 4 runs four tests simultaneously — while one waits on network, others compute. ≈4× speedup from a config line you decoded in 11.3.',
      highlightLines: [1, 2],
    },
    {
      id: 'isolation-prereq',
      caption:
        'What makes parallelism SAFE is everything 11.7 built: each test in a fresh context, no shared browser state — parallel tests CANNOT collide through the browser. And what breaks it: any test depending on another having run first. Parallel order is NOT guaranteed. Isolation was never politeness; it was this.',
      highlightLines: [2],
    },
    {
      id: 'sharding',
      caption:
        'CI scales the same idea across MACHINES: sharding. --shard=1/4 tells this runner “you own the first quarter” — four machines, each with its own workers, quarter the clock again. Exit codes (9.2) from all shards combine into the one verdict. 11.16 wires it; you already understand every part.',
      highlightLines: [5, 6],
    },
    {
      id: 'retries',
      caption:
        'Now the controversial one: retries. A failed test RE-RUNS, completely fresh — new context, re-bottled state — up to N times. The config split you decoded in 11.3: CI retries 2, local retries 0 (raw truth at the desk: a flake must LOOK flaky while you’re there to see it).',
      highlightLines: [3],
    },
    {
      id: 'flaky-mark',
      caption:
        'And the report’s crucial honesty: a test that fails then passes is marked FLAKY — visibly, permanently, in the report — never quietly green. Read that mark correctly: it is a BUG REPORT about your test (or your app!), not a pardon. Pass-on-retry means “something here is nondeterministic.”',
      highlightLines: [8, 9, 10, 11],
    },
    {
      id: 'retry-debate',
      caption:
        'The honest debate, both edges: retries keep one cosmic-ray blip (a shared staging hiccup) from blocking fifty people’s merges — real value. AND retries let genuinely intermittent bugs hide behind the mark — real cost. The resolution isn’t picking a side; it’s the mark + the policy in the last step.',
      highlightLines: [3],
    },
    {
      id: 'clinic-1',
      caption:
        'The flakiness clinic — because “it’s flaky” is a symptom, not a diagnosis. Cause ①: RACE — asserting before the page caught up. Cure: 11.6’s web-first assertions (and the relapse vector is waitForTimeout sneaking back in). Cause ②: SHARED STATE — two tests, one account, colliding in parallel. Cure: 11.8’s unique-per-run data.',
      highlightLines: [13, 14],
    },
    {
      id: 'clinic-2',
      caption:
        'Cause ③: TIME — Date.now(), tests that fail at midnight or in another timezone. Cure: 10.6’s fake clocks (page.clock, the browser edition). Cause ④: REAL-BACKEND WEATHER — the shared staging box having a bad day. Cure: 11.10’s mocking for most tests, and acceptance that the few unmocked journeys carry weather risk deliberately.',
      highlightLines: [13, 14],
    },
    {
      id: 'the-triage',
      caption:
        'The triage, when the mark appears: a flake IS reproducible in principle — run the test ALONE twenty times (--repeat-each=20), read the failing run’s trace (11.14’s five questions), and name the cause from the clinic’s four. Flakes confess under repetition.',
      highlightLines: [13, 14],
    },
    {
      id: 'zero-flake-policy',
      caption:
        'Then the policy that separates great teams: quarantine the flake (fixme — 11.13, visible debt) and fix it as P1 — priority one, before new work. Why so strict: an ignored flake trains humans to ignore red, and then a REAL bug walks past everyone. Zero tolerance protects the suite’s one asset — trust (10.1).',
      highlightLines: [13, 14],
    },
  ],
  Viz: WorkerLanes,
  underTheHood: (
    <>
      <p>
        Worker mechanics worth knowing. Tests from the SAME file run in one worker by default
        (fullyParallel: true loosens this). A worker that crashes is replaced, and its tests are
        re-queued. <code>workers: 1</code> on CI (11.3’s line) exists because shared CI boxes
        are slower and noisier — determinism beats speed where evidence quality matters.
      </p>
      <p>
        Worker-scoped fixtures (11.7’s scope option) build once per worker — a database
        connection, a seeded catalog. With 4 workers you get 4 of them; design them to coexist
        (unique schemas/accounts per worker — <code>testInfo.workerIndex</code> is the standard
        suffix, echoing 11.8).
      </p>
      <p>
        Sharding’s honest cost: the report fragments across machines. The fix is merging —{' '}
        <code>playwright merge-reports</code> combines shard blobs into one HTML report before
        upload (11.16’s artifact step often does exactly this). One suite, one verdict, one
        report — whatever the machine count.
      </p>
      <p>
        <strong>💼 On the job —</strong> “how do you deal with flaky tests?” is the interview
        question in this domain: asked everywhere, answered badly by most. Your answer now has
        four moves. Prevention: the clinic’s cures, by default. Detection: the flaky mark +
        repeat-each. Diagnosis: trace the failing run, name the cause. Policy: quarantine + P1
        fix, zero tolerance — trust is the suite’s only asset. Four moves, no hand-waving.
        That’s a hire.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A test fails, retries, and passes. What does the report mark it as?',
      accept: ['flaky', 'FLAKY', 'flaky (passed on retry)', '⚠ flaky', 'marked flaky'],
      placeholder: 'the mark…',
      why: 'FLAKY — visibly, never quietly green. The mark is a bug report about nondeterminism (in the test or the app), not a pardon.',
    },
    {
      kind: 'type-output',
      question: 'Why is it safe for 4 workers to run 4 tests simultaneously? (what guarantees no collisions — one phrase)',
      accept: ['isolation', 'fresh contexts', 'fresh context per test', 'test isolation', 'isolated contexts', '11.7 isolation', 'no shared state'],
      placeholder: 'because of…',
      why: 'Isolation — each test runs in its own fresh browser context (11.7), so there is no shared browser state to collide over. Parallelism is isolation’s payoff.',
    },
    {
      kind: 'type-output',
      question: 'A test flakes only when run with others, and its trace shows another test’s data in its cart. Which clinic cause?',
      accept: ['shared state', 'shared-state', 'cause 2', '② shared state', 'shared state collision', 'state collision'],
      placeholder: 'the cause…',
      why: 'Shared state — two tests colliding on one account/record in parallel. Cure: 11.8’s unique-per-run data (plus checking that nothing shares accounts across tests).',
    },
  ],
  PlayExtra: () => <CodeExercise def={FLAKE_EXERCISE} />,
  teachBack: {
    prompt:
      'Give the full scale-and-flakiness briefing: why workers speed things up (the 9.6 connection), what makes parallelism safe, the retry debate honestly (both edges + the mark), the four clinic causes with their cures, and the zero-flake policy’s reasoning.',
    modelAnswer:
      'Serial E2E is slow because browsers spend most of each test WAITING — network, rendering, polling — and waiting doesn’t need the machine: the same insight as Node’s parked jobs, at test scale. A worker is an independent runner process with its own browser; four workers run four tests at once for roughly four times the speed, and CI shards the suite across whole machines on top. It’s safe because of isolation: every test gets a fresh browser context, so parallel tests can’t collide through shared state — and it breaks the moment any test depends on another running first, since parallel order is never guaranteed. Retries re-run failures completely fresh, twice on CI and zero locally so flakes look flaky at the desk. The debate has two honest edges: retries stop one staging hiccup from blocking fifty merges, but they also let real intermittent bugs hide — resolved by the report’s FLAKY mark, which is a bug report, never a pardon. The clinic names four causes with cures already learned: races (cure: web-first assertions), shared state (cure: unique-per-run data), time (cure: fake clocks), and real-backend weather (cure: mocking, plus deliberate acceptance on the few unmocked journeys). Triage: run the flake alone twenty times, read the failing trace, name the cause. And the policy: quarantine and fix as P1 — because an ignored flake trains the team to ignore red, and then a real bug walks past everyone. Trust is the suite’s only asset.',
  },
  recap: [
    'Workers = independent runner processes (browsers mostly WAIT — 9.6’s insight at test scale): 4 workers ≈ 4×. Sharding splits across machines (--shard=1/4). Safe because of 11.7’s isolation; broken by any order-dependence.',
    'Retries re-run FRESH (CI 2 / local 0 — raw truth at the desk). Pass-on-retry = marked FLAKY: a bug report, never a pardon. Double edge: unblocks merges AND can hide real intermittents — the mark + policy resolve it.',
    'The clinic: ① race → 11.6 · ② shared state → 11.8 unique data · ③ time → 10.6 fake clocks · ④ backend weather → 11.10 mocks. Triage: --repeat-each ×20 alone → failing trace → name the cause. Policy: quarantine + P1 fix — ignored flakes teach humans to ignore red.',
  ],
}
