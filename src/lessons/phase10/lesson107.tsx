import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ChatBubble } from '../../design/JobScene'

/**
 * 10.7 — Checkpoint: test the tip calculator
 * 3.11's brain comes under guard: enumerate behaviors, write the suite
 * (expected values from arithmetic on paper), sabotage tipAmount (the 8.3
 * percent bug), watch the CASCADE of red expose the dependency graph, fix,
 * re-green. Full red-green loop experienced firsthand. Real-Vitest box for
 * the 9.8 workspace; iPad-safe.
 */

const CODE = `// the Phase 3 brain, back under guard
function tipAmount(bill, percent) {
  return bill * percent / 100;
}
function totalWithTip(bill, percent) {
  return bill + tipAmount(bill, percent);
}
function perPerson(bill, percent, people) {
  return totalWithTip(bill, percent) / people;
}

// the suite (10.3's shape, 10.5's spirit)
check("tip: 10% of 1200 is 120",
      tipAmount(1200, 10),      120);
check("total: 1200 + tip is 1320",
      totalWithTip(1200, 10),   1320);
check("split: 1320 across 4 is 330",
      perPerson(1200, 10, 4),   330);
check("solo diner pays it all",
      perPerson(1200, 10, 1),   1320);`

interface TestCard {
  name: string
  state: 'idle' | 'pass' | 'fail'
}
interface View {
  cards: TestCard[]
  sabotage?: boolean
  cascade?: boolean
  verdict?: 'green' | 'red' | null
  console: string[]
  note: string
  badge?: string
}

const NAMES = ['tip: 10% of 1200 is 120', 'total: 1200 + tip is 1320', 'split: 1320 across 4 is 330', 'solo diner pays it all']
const cards = (states: Array<'idle' | 'pass' | 'fail'>): TestCard[] => NAMES.map((name, i) => ({ name, state: states[i] }))

const VIEWS: View[] = [
  {
    cards: cards(['idle', 'idle', 'idle', 'idle']), console: [],
    note: 'the mission: 3.11’s three functions have run unguarded for seven phases — today they get a suite',
  },
  {
    cards: cards(['idle', 'idle', 'idle', 'idle']), console: [],
    note: 'step zero, BEFORE any code: enumerate the behaviors — happy path per function, plus the edges (10.3’s craft)',
  },
  {
    cards: cards(['pass', 'idle', 'idle', 'idle']), console: ['PASS: tip: 10% of 1200 is 120'],
    note: 'test one — expected 120 comes from PAPER: 1200 × 10 ÷ 100. Never from running the code (10.3’s soul-rule)',
  },
  {
    cards: cards(['pass', 'pass', 'idle', 'idle']), console: ['PASS: total: 1200 + tip is 1320'],
    note: 'test two guards the next machine up the chain: 1200 + 120 = 1320, worked out by hand',
  },
  {
    cards: cards(['pass', 'pass', 'pass', 'pass']), verdict: 'green', console: ['PASS: split: 1320 across 4 is 330', 'PASS: solo diner pays it all'],
    note: 'tests three and four: the top machine, and its edge — people = 1. All green: the brain is UNDER GUARD',
  },
  {
    cards: cards(['pass', 'pass', 'pass', 'pass']), sabotage: true, console: [],
    note: 'now SABOTAGE — on purpose: delete the ÷ 100 from tipAmount. (8.3’s percent bug, planted by your own hand)',
    badge: 'breaking your own code to watch the suite catch it is a real professional ritual — it proves the net exists before you need it',
  },
  {
    cards: cards(['fail', 'fail', 'fail', 'fail']), cascade: true, verdict: 'red', console: ['FAIL: tip … got 12000', 'FAIL: total … got 13200', 'FAIL: split … got 3300', 'FAIL: solo … got 13200'],
    note: 'ONE broken line — FOUR red tests. The cascade IS the dependency graph: total calls tip, split calls total (10.1, live)',
  },
  {
    cards: cards(['fail', 'fail', 'fail', 'fail']), cascade: true, verdict: 'red', console: ['FAIL: tip: 10% of 1200 is 120 — got 12000'],
    note: 'diagnosis reads top-down: the DEEPEST red is the culprit — tipAmount got 12000 where 120 was expected. ÷100 is missing',
  },
  {
    cards: cards(['pass', 'pass', 'pass', 'pass']), verdict: 'green', console: ['4 passed, 0 failed'],
    note: 'restore the ÷ 100 → all green in one run. THAT — red in seconds, not in production — is what 10.1 promised you',
  },
  {
    cards: cards(['pass', 'pass', 'pass', 'pass']), verdict: 'green', console: [],
    note: 'do it for REAL too: in the 9.8 workspace — npm install -D vitest, tip.test.js, npm run test, then sabotage and watch',
    badge: 'on an iPad? The dress version below is the full loop. Phase 10 complete — Phase 11 hands this exact discipline a browser.',
  },
]

function RedGreenBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
        the suite board
      </text>
      {view.cards.map((card, i) => {
        const color = card.state === 'pass' ? 'var(--color-marker-teal)' : card.state === 'fail' ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)'
        return (
          <g key={card.name}>
            <RoughRect x={30} y={38 + i * 42} width={290} height={34} seed={3301 + i} strokeWidth={card.state === 'idle' ? 1.4 : 2.2} stroke={color} roughness={card.state === 'fail' ? 2.2 : 1.3} fill={card.state === 'idle' ? 'transparent' : `color-mix(in srgb, ${color} 9%, transparent)`} fillStyle="solid" />
            <text x={44} y={60 + i * 42} fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill={color}>
              {card.state === 'pass' ? '✓' : card.state === 'fail' ? '✗' : '·'}  {card.name}
            </text>
          </g>
        )
      })}
      {view.cascade && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <HandArrow from={{ x: 330, y: 56 }} to={{ x: 330, y: 96 }} curve={0.3} seed={3310} stroke="var(--color-marker-coral)" strokeWidth={1.8} />
          <HandArrow from={{ x: 330, y: 98 }} to={{ x: 330, y: 138 }} curve={0.3} seed={3311} stroke="var(--color-marker-coral)" strokeWidth={1.8} />
          <text x={352} y={100} fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-marker-coral)">
            <WrapTspans text="one bug, cascading up the call chain" x={352} maxPx={80} fontSize={9.5} />
          </text>
        </motion.g>
      )}
      {view.sabotage && (
        <motion.g initial={{ opacity: 0, scale: 0.7, rotate: -4 }} animate={{ opacity: 1, scale: 1, rotate: -2 }} transition={{ type: 'spring', damping: 13 }}>
          <RoughRect x={310} y={40} width={112} height={44} seed={3315} strokeWidth={2.4} stroke="var(--color-marker-coral)" roughness={2.4} fill="color-mix(in srgb, var(--color-marker-coral) 12%, transparent)" fillStyle="solid" />
          <text x={366} y={58} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-marker-coral)">SABOTAGE:</text>
          <text x={366} y={74} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">÷ 100 deleted</text>
        </motion.g>
      )}
      {view.verdict && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <RoughRect x={140} y={214} width={160} height={32} seed={3320} strokeWidth={2.4} stroke={view.verdict === 'green' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.verdict === 'green' ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 12%, transparent)`} fillStyle="solid" />
          <text x={220} y={235} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">
            {view.verdict === 'green' ? 'SUITE: GREEN ✓' : 'SUITE: RED ✗'}
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={258} width={392} fontSize={9.5} seed={3330} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={316} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const CHECKPOINT_EXERCISE: CodeExerciseDef = {
  id: 'l107-guard-the-brain',
  title: 'guard the brain — find the saboteur',
  task: 'The starter ships the Phase 3 tip calculator — but ONE function is already sabotaged. Write the suite first, let the red point at the culprit, fix it, and leave everything green with an honest summary.',
  steps: [
    <>
      Write <code>check(name, actual, expected)</code>: strict compare; print{' '}
      <code>PASS: name</code> or <code>FAIL: name — got actual</code>, and count into outer{' '}
      <code>passed</code>/<code>failed</code> counters (5.3’s outer variables).
    </>,
    <>
      Write the suite — expected values from PAPER, never from running: tip of 10% on 1200 is{' '}
      <code>120</code>; the total is <code>1320</code>; split 4 ways is <code>330</code>. Names
      are sentences.
    </>,
    <>
      Run it. Read the red top-down: the DEEPEST failing machine is the culprit. Fix the ONE
      broken line (a division has gone missing…), never the tests.
    </>,
    <>
      Finish green with the summary line <code>3 passed, 0 failed</code> — built from the
      counters.
    </>,
  ],
  starter: `// the Phase 3 brain — ONE line is sabotaged. Tests first!
function tipAmount(bill, percent) {
  return bill * percent;
}
function totalWithTip(bill, percent) {
  return bill + tipAmount(bill, percent);
}
function perPerson(bill, percent, people) {
  return totalWithTip(bill, percent) / people;
}

// your suite below:
`,
  expectedOutput: ['PASS: tip: 10% of 1200 is 120', 'PASS: total: 1200 + tip is 1320', 'PASS: split: 1320 across 4 is 330', '3 passed, 0 failed'],
  mustUse: [
    { test: /function\s+check\s*\(|const\s+check\s*=/, label: 'a reusable check helper' },
    { test: /===|!==/, label: 'asserts compare strictly' },
    { test: /\/\s*100/, label: 'the sabotage is repaired — the division restored' },
    { test: /(passed|failed)\s*(\+\+|\+=|=\s*\w+\s*\+)/, label: 'the summary comes from real counters' },
    { test: /check\s*\(\s*["']tip: 10% of 1200 is 120["']/, label: 'test one carries its sentence-name' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']3 passed, 0 failed["']\s*\)/, label: 'no hard-coded summary — count in check' },
    { test: /check\s*\(\s*["'][^"']*["']\s*,\s*120\s*,/, label: 'actual must be the function’s answer, not a typed number' },
  ],
  modelAnswer: `// the Phase 3 brain — ONE line is sabotaged. Tests first!
function tipAmount(bill, percent) {
  return bill * percent / 100;
}
function totalWithTip(bill, percent) {
  return bill + tipAmount(bill, percent);
}
function perPerson(bill, percent, people) {
  return totalWithTip(bill, percent) / people;
}

// your suite below:
let passed = 0;
let failed = 0;

function check(name, actual, expected) {
  if (actual === expected) {
    console.log("PASS: " + name);
    passed = passed + 1;
  } else {
    console.log("FAIL: " + name + " — got " + actual);
    failed = failed + 1;
  }
}

check("tip: 10% of 1200 is 120", tipAmount(1200, 10), 120);
check("total: 1200 + tip is 1320", totalWithTip(1200, 10), 1320);
check("split: 1320 across 4 is 330", perPerson(1200, 10, 4), 330);

console.log(passed + " passed, " + failed + " failed");`,
}

export const lesson107: LessonDef = {
  id: '10.7',
  hook: (
    <>
      <p>
        Checkpoint — and a homecoming. In 3.11 you built the tip calculator: three small machines,
        chained. They’ve run unguarded for seven phases. Today,{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          you put them under guard, then sabotage your own code and watch the suite catch you in
          seconds
        </HighlightMark>{' '}
        — the red-green loop of 10.1’s promise, experienced firsthand instead of believed.
      </p>
      <p>
        Nothing new is taught today. Everything from 10.1–10.6 gets used.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-mission',
      caption:
        'The brain, reread with Phase 10 eyes: tipAmount is a pure function (unit-layer perfect), totalWithTip calls it, perPerson calls THAT — a three-link call chain, which is a three-link dependency graph. Remember 10.1: graphs are where regressions travel. Today we guard every link.',
      highlightLines: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      id: 'enumerate-first',
      caption:
        'Step zero happens BEFORE any test code — enumerate the behaviors on paper (10.3’s professional move): each machine’s happy path, plus the edges: one diner (people = 1), zero tip percent. Four questions chosen deliberately. THEN we write.',
      highlightLines: [12],
    },
    {
      id: 'test-one',
      caption:
        'Test one, in 10.3’s three beats: arrange bill 1200 and percent 10, act with ONE call, assert against 120 — computed on PAPER: 1200 × 10 ÷ 100. Not by running the function and copying. The name is a sentence: “tip: 10% of 1200 is 120.”',
      highlightLines: [13, 14],
    },
    {
      id: 'tests-up-the-chain',
      caption:
        'Test two climbs one link: totalWithTip should answer 1200 + 120 = 1320 (paper again). Notice we test it THROUGH its real dependency — no stubbing tipAmount: 10.6’s rule, don’t mock what you own. The chain is ours end to end.',
      highlightLines: [15, 16],
    },
    {
      id: 'all-green',
      caption:
        'Tests three and four: the top machine (1320 ÷ 4 = 330) and its edge — the solo diner, people = 1, who pays the whole 1320. Run: four PASS lines reading like a specification of the brain. Green board. The guard is up.',
      highlightLines: [17, 18, 19, 20],
    },
    {
      id: 'sabotage',
      caption:
        'Now the checkpoint’s heart: SABOTAGE YOUR OWN CODE. Open tipAmount and delete the ÷ 100 — exactly 8.3’s percent-vs-fraction bug, planted by your own hand, on purpose. This ritual is real professional practice: prove the net exists BEFORE you’re relying on it.',
      highlightLines: [3],
    },
    {
      id: 'the-cascade',
      caption:
        'Run. ONE broken line — FOUR red tests. Read what the cascade is telling you: totalWithTip failed because it CALLS tipAmount; perPerson failed because it calls totalWithTip. The red pattern is 10.1’s dependency graph, photographed at the moment of failure.',
      highlightLines: [3, 5, 6, 8, 9],
    },
    {
      id: 'diagnose',
      caption:
        'Diagnosis is a reading skill now: when reds cascade, suspect the DEEPEST one — the machine that depends on nothing. tipAmount got 12000 where 120 was expected: exactly 100× too big. The missing ÷ 100 names itself. Fix the CODE — never “fix” the tests to match the bug (10.3’s enshrined-bug warning).',
      highlightLines: [3, 13, 14],
    },
    {
      id: 're-green',
      caption:
        'Restore the division, run once more: four greens, one summary line. Total elapsed time from sabotage to catch: seconds. That is the entire economic argument of 10.1 — this bug died at desk prices, and every future change to the brain gets interrogated the same way, forever, for free.',
      highlightLines: [3],
    },
    {
      id: 'do-it-for-real',
      caption:
        'Finish like a professional — run this loop for REAL: in your 9.8 workspace, npm install -D vitest, write tip.test.js with describe/it/expect (10.5), npm run test, sabotage, watch real red, fix, real green. (iPad? The dress version below IS the full loop.) Phase 10 complete: next phase, this discipline gets a browser.',
      highlightLines: [12],
    },
  ],
  Viz: RedGreenBoard,
  underTheHood: (
    <>
      <p>
        The cascade teaches a real triage rule used daily. When many tests fail at once, sort by{' '}
        <strong>depth of dependency</strong> and read the deepest failure first. It’s usually
        the one true cause; the rest are echoes. Some runners even help: Vitest prints
        failures in file order, but a well-structured suite (one describe per machine, bottom-up)
        makes the deepest machine’s block appear first.
      </p>
      <p>
        Should you ALSO test totalWithTip with a stubbed tipAmount, to isolate it perfectly?
        You could — but 10.6’s rule says no. tipAmount is yours, fast, and deterministic;
        stubbing it would only prove wiring you can already see. Save doubles for boundaries.
        This judgment call — where isolation stops being worth it — is one you’ll make weekly on
        the job.
      </p>
      <p>
        Your four tests have one weakness worth naming: floats. perPerson(100, 15, 3) is
        38.333…, and toBe/=== on that invites 1.9’s dust. The professional habit: keep money in
        integer paise/cents, or assert with toBeCloseTo (10.4). Real invoice code keeps integer
        paise; real test suites do both.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'You deleted ÷100 in tipAmount only — yet the totalWithTip and perPerson tests ALSO turned red. Why? (one short phrase)',
      accept: ['they call tipAmount', 'they depend on tipAmount', 'the call chain', 'dependency', 'they use tipAmount', 'because they call it', 'the dependency graph', 'cascade'],
      placeholder: 'because…',
      why: 'They sit above tipAmount in the call chain — totalWithTip calls it, perPerson calls totalWithTip. The red cascade is the dependency graph made visible.',
    },
    {
      kind: 'type-output',
      question: 'Four tests are red in a cascade. Which failure do you read FIRST — the shallowest machine or the deepest?',
      accept: ['deepest', 'the deepest', 'the deepest one', 'deepest one', 'the deepest machine'],
      placeholder: 'which one…',
      why: 'The deepest — the machine that depends on nothing. It’s usually the one true cause; the failures above it are echoes traveling up the chain.',
    },
    {
      kind: 'type-output',
      question: 'The suite turns red after your change. You could fix the code — or edit the tests until they pass. Which is ever acceptable?',
      accept: ['fix the code', 'the code', 'code', 'fixing the code'],
      placeholder: 'which…',
      why: 'Fix the code. Editing tests to match buggy output is 10.3’s enshrined-bug trap: the suite would then DEFEND the bug against whoever tries to fix it properly. (Tests change only when the SPEC changes.)',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you this exact question:</Scene>
      <ChatBubble who="interviewer" face="🙂">Tell me about a time tests caught a bug.</ChatBubble>
      <ChatBubble who="you, after this lesson" face="😊" accent indent>
        I write the suite. I break the code deliberately to verify the net. The cascade pattern
        tells me exactly where to look.
      </ChatBubble>
      <Takeaway>
        <Key>That sentence sounds like five years of experience.</Key> You earned it in one
        lesson.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={CHECKPOINT_EXERCISE} />,
  teachBack: {
    prompt:
      'Tell the whole checkpoint as a story: enumerating behaviors, where expected values came from, the sabotage ritual and what the four-red cascade revealed, how you diagnosed the culprit, and what the seconds-long catch proves about 10.1’s cost curve.',
    modelAnswer:
      'I took the tip calculator from Phase 3 — three chained functions: tipAmount, totalWithTip which calls it, and perPerson which calls that — and before writing any test code I enumerated the behaviors on paper: each function’s happy path plus the edges, like a solo diner. Then I wrote the suite in Arrange–Act–Assert shape with sentence names, and every expected value came from arithmetic on paper — 1200 × 10 ÷ 100 is 120, plus the bill is 1320, split four ways is 330 — never from running the code, because copying output enshrines bugs. All green. Then the ritual: I sabotaged my own code deliberately, deleting the ÷100 — and one broken line turned FOUR tests red, because the failures cascade up the call chain: totalWithTip fails because it calls tipAmount, perPerson because it calls totalWithTip. The cascade is the dependency graph photographed at the moment of failure, so diagnosis reads bottom-up: the deepest red is the culprit, and tipAmount reporting 12000 instead of 120 — exactly 100× off — named the missing division itself. I fixed the code (never the tests), re-ran, and was green again within seconds. That’s the cost curve from 10.1 made personal: the same bug that would cost days in QA or a 2am call in production died at desk prices — and now every future change to this brain gets interrogated automatically, forever.',
  },
  recap: [
    'The full loop, lived: enumerate behaviors → suite with paper-computed expected values and sentence names → green → SABOTAGE (÷100 deleted) → four reds → fix the code → green in seconds. 10.1’s cost curve, experienced.',
    'One bug, four reds: failures cascade up the call chain — the red pattern IS the dependency graph. Triage rule: read the DEEPEST failure first; the rest are echoes.',
    'Never edit tests to match buggy output (the enshrined-bug trap). Do it for real in the 9.8 workspace with Vitest — then Phase 11 hands this exact discipline a browser.',
  ],
}
