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
 * 11.13 — Tags, selective runs & suite hygiene
 * 500 tests ≠ one blob: @smoke tags + --grep (4.9 on tests), the smoke-set
 * definition, honest skipping (skip with reasons, fixme), the .only
 * disaster + forbidOnly guard, test.step chapters, soft assertions. The
 * difference between a suite and a junk drawer.
 */

const CODE = `test("checkout works @smoke", async ({ page }) => {…});
test("coupon math @regression", async ({ page }) => {…});

// $ npx playwright test --grep @smoke
// $ npx playwright test --grep-invert @slow

test.skip(({ browserName }) => browserName === "webkit",
  "drag flaky on webkit — issue #142");

test.fixme("drag-and-drop reorders", async () => {…});

test.only("the one I'm debugging", async () => {…});
// ⚠ NEVER commit — forbidOnly catches it on CI (11.3)

await test.step("add three items", async () => {…});
expect.soft(price).toBe(900);`

interface View {
  mode: 'wall' | 'skips' | 'only' | 'steps'
  filter?: string | null
  shrunk?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'wall', filter: null, console: [],
    note: '500 tests is not ONE thing: pre-merge wants a 2-minute pulse check; nightly wants everything. Selection is a daily need',
  },
  {
    mode: 'wall', filter: null, console: [],
    note: 'a TAG is a convention, not a feature: “@smoke” written in the title. Grep-able, visible, zero machinery',
  },
  {
    mode: 'wall', filter: '@smoke', console: ['$ npx playwright test --grep @smoke', '12 of 500 ran (2m 04s)'],
    note: '--grep @smoke filters titles by regex — 4.9’s filter, applied to the suite itself. The wall shrinks to the tagged cards',
  },
  {
    mode: 'wall', filter: '@smoke', console: [],
    note: 'the SMOKE set, defined: the 10–15 tests proving the app BREATHES — login, checkout, search. Fast, critical paths only',
    badge: '“smoke test” is old hardware slang: power it on — does smoke come out? The software version: deploy it — do the vital signs hold?',
  },
  {
    mode: 'skips', console: ['− skipped: drag flaky on webkit — issue #142'],
    note: 'honest skipping: test.skip(condition, reason) — reported as SKIPPED, never silently green. The reason string is mandatory kindness',
  },
  {
    mode: 'skips', console: ['⚠ fixme: drag-and-drop reorders'],
    note: 'test.fixme = known-broken, don’t run, keep the debt VISIBLE on every report — a to-do that can’t be forgotten',
  },
  {
    mode: 'only', shrunk: true, console: ['1 of 500 ran — all “passing” ✓?!'],
    note: 'test.only shrinks the run to ONE test — priceless while debugging, catastrophic if committed: the suite “passes” having tested nothing',
  },
  {
    mode: 'only', shrunk: true, console: [],
    note: 'the guard you already decoded: forbidOnly: !!process.env.CI (11.3) — a committed .only FAILS the CI build instead of lying green',
    badge: 'the .only disaster is famous enough to have a config option dedicated to it. Now you know why that line exists.',
  },
  {
    mode: 'steps', console: [],
    note: 'test.step(name, fn) groups actions into named chapters — reports and traces (11.14) read as a story, not 40 raw clicks',
  },
  {
    mode: 'steps', console: [],
    note: 'expect.soft: record the failure, keep checking — several independent facts in one screen pass. The test still FAILS at the end: soft ≠ optional',
    badge: 'hygiene roundup: consistent tag names · reasons on every skip · zero .onlys merged · steps in long tests. The difference between a suite and a junk drawer.',
  },
]

function TagWall({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const CARDS = [
    { name: 'checkout works', tag: '@smoke' },
    { name: 'login works', tag: '@smoke' },
    { name: 'coupon math', tag: '@regression' },
    { name: 'sort by price', tag: '@regression' },
    { name: 'bulk import', tag: '@slow' },
    { name: 'profile update', tag: '@regression' },
  ]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'wall' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the suite as a card wall {view.filter ? `— filtered: ${view.filter}` : ''}
          </text>
          {CARDS.map((card, i) => {
            const dimmed = view.filter !== null && view.filter !== undefined && card.tag !== view.filter
            return (
              <g key={card.name} opacity={dimmed ? 0.18 : 1}>
                <RoughRect x={34 + (i % 2) * 196} y={42 + Math.floor(i / 2) * 58} width={180} height={46} seed={5201 + i} strokeWidth={1.7} stroke={card.tag === '@smoke' ? 'var(--color-marker-teal)' : card.tag === '@slow' ? 'var(--color-marker-coral)' : 'var(--color-pencil-blue)'} fill={`color-mix(in srgb, ${card.tag === '@smoke' ? 'var(--color-marker-teal)' : card.tag === '@slow' ? 'var(--color-marker-coral)' : 'var(--color-pencil-blue)'} 6%, transparent)`} fillStyle="solid" />
                <text x={124 + (i % 2) * 196} y={62 + Math.floor(i / 2) * 58} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">{card.name}</text>
                <text x={124 + (i % 2) * 196} y={79 + Math.floor(i / 2) * 58} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">{card.tag}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'skips' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            honest skipping — visible debt
          </text>
          {[
            { mark: '−', label: 'skipped: drag on webkit', sub: 'reason: issue #142 — conditional, documented', color: 'var(--color-pencil-blue)' },
            { mark: '⚠', label: 'fixme: drag-and-drop reorders', sub: 'known-broken, kept on the report every run', color: 'var(--color-marker-coral)' },
          ].map((row, i) => (
            <g key={row.label}>
              <RoughRect x={50} y={48 + i * 74} width={340} height={58} seed={5220 + i} strokeWidth={2} stroke={row.color} fill={`color-mix(in srgb, ${row.color} 6%, transparent)`} fillStyle="solid" />
              <text x={70} y={72 + i * 74} fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">{row.mark}  {row.label}</text>
              <text x={70} y={92 + i * 74} fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{row.sub}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'only' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the .only disaster
          </text>
          <RoughRect x={140} y={48} width={160} height={50} seed={5230} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
          <text x={220} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">the one I’m debugging ✓</text>
          <text x={220} y={88} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">test.only(…)</text>
          <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">…499 tests silently NOT RUN…</text>
          <text x={220} y={158} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-marker-coral)">suite: “passing” — having tested nothing</text>
        </g>
      )}

      {view.mode === 'steps' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            test.step: chapters, not raw clicks
          </text>
          {['step: log in as shopper ✓', 'step: add three items ✓', 'step: apply coupon ✗ ← the failing chapter'].map((line, i) => (
            <g key={line}>
              <RoughRect x={60} y={44 + i * 54} width={320} height={42} seed={5240 + i} strokeWidth={1.8} stroke={line.includes('✗') ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${line.includes('✗') ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} 7%, transparent)`} fillStyle="solid" />
              <text x={80} y={70 + i * 54} fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink)">{line}</text>
            </g>
          ))}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9} seed={5250} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const GREP_EXERCISE: CodeExerciseDef = {
  id: 'l1113-build-grep',
  title: 'build --grep (and witness the .only disaster)',
  task: 'Two selection mechanisms, one lesson: a grep that filters the suite by tag, and an .only simulation that shows exactly how the disaster lies.',
  steps: [
    <>
      Create <code>suite</code>: five test names —{' '}
      <code>"checkout works @smoke"</code>, <code>"login works @smoke"</code>,{' '}
      <code>"coupon math @regression"</code>, <code>"sort by price @regression"</code>,{' '}
      <code>"bulk import @slow"</code>.
    </>,
    <>
      Write <code>grep(suite, tag)</code>: the tests whose names include the tag (4.9 + 1.6’s
      includes). Run the smoke set: print each match, then{' '}
      <code>2 of 5 ran</code> (computed from both lengths).
    </>,
    <>
      Simulate the disaster: <code>only(suite, name)</code> returns just the one matching test.
      Run it for <code>"coupon math @regression"</code> and print{' '}
      <code>1 of 5 ran — 4 silently skipped ⚠</code> — the counts computed.
    </>,
  ],
  starter: '',
  expectedOutput: ['checkout works @smoke', 'login works @smoke', '2 of 5 ran', '1 of 5 ran — 4 silently skipped ⚠'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'grep is a filter' },
    { test: /\.includes\s*\(/, label: 'tags match with .includes' },
    { test: /function\s+grep|const\s+grep\s*=/, label: 'a function named grep' },
    { test: /\.length/, label: 'counts come from lengths' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']2 of 5 ran["']\s*\)/, label: 'no hard-coded counts — compute from the arrays' },
  ],
  modelAnswer: `const suite = [
  "checkout works @smoke",
  "login works @smoke",
  "coupon math @regression",
  "sort by price @regression",
  "bulk import @slow",
];

function grep(suite, tag) {
  return suite.filter((name) => name.includes(tag));
}

const smoke = grep(suite, "@smoke");
for (const name of smoke) {
  console.log(name);
}
console.log(smoke.length + " of " + suite.length + " ran");

function only(suite, name) {
  return suite.filter((t) => t === name);
}

const lonely = only(suite, "coupon math @regression");
const skipped = suite.length - lonely.length;
console.log(lonely.length + " of " + suite.length + " ran — " + skipped + " silently skipped ⚠");`,
}

export const lesson1113: LessonDef = {
  id: '11.13',
  hook: (
    <>
      <p>
        Five hundred tests is not one thing — pre-merge wants a two-minute pulse check, nightly
        wants everything, and you want just the one you’re debugging.{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Tags, grep, honest skips, and the hygiene habits that separate a professional suite
          from a junk drawer
        </HighlightMark>{' '}
        — including the famous <code>.only</code> disaster and the config line that guards it.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'why-select',
      caption:
        'The need first: different moments want different slices. Pre-merge: a fast pulse check, minutes. Nightly: the full matrix (11.12), hours are fine. Debugging: exactly one test, over and over. A suite you can only run WHOLE is a suite you’ll avoid running — selection is daily bread.',
      highlightLines: [1, 2],
    },
    {
      id: 'tags',
      caption:
        'The mechanism is beautifully low-tech: a TAG is just a word in the title — “@smoke”, “@regression”. No registry, no metadata system; it travels with the name through every report, and it greps.',
      highlightLines: [1, 2],
    },
    {
      id: 'grep',
      caption:
        'npx playwright test --grep @smoke — the runner filters test TITLES by regex and runs the matches: 4.9’s filter, applied to the suite itself. --grep-invert @slow runs everything EXCEPT a tag. Compose with 11.12: --project=chromium --grep @smoke = one lane, one slice.',
      highlightLines: [4, 5],
    },
    {
      id: 'smoke-defined',
      caption:
        'The tag every team has, defined properly: the SMOKE set — 10–15 tests proving the app BREATHES: login works, checkout completes, search returns. Fast, critical-path only, run before anything else matters. (The name is old hardware slang: power it on — does smoke come out?)',
      highlightLines: [1, 4],
    },
    {
      id: 'honest-skip',
      caption:
        'Sometimes a test SHOULDN’T run — a known webkit quirk, a feature behind a flag. test.skip(condition, reason) skips it HONESTLY: reported as skipped, never silently green, and the reason string travels to the report. Future-you, reading “issue #142” at 2am, sends thanks.',
      highlightLines: [7, 8],
    },
    {
      id: 'fixme',
      caption:
        'test.fixme is skip’s blunter sibling: this test is known-BROKEN — don’t run it, but keep it on every report as visible debt. A to-do that cannot be quietly forgotten, because it shows up yellow forever until someone fixes it. Deleting a broken test hides debt; fixme displays it.',
      highlightLines: [10],
    },
    {
      id: 'the-only-disaster',
      caption:
        'Now the famous one. test.only runs JUST that test — priceless while debugging: save, run, one test, repeat. The disaster: COMMIT it, and the suite silently shrinks to one test. CI runs, one test passes, pipeline green — while 499 tests silently didn’t run. The suite is lying with a straight face.',
      highlightLines: [12, 13],
    },
    {
      id: 'forbidonly',
      caption:
        'The guard you already decoded in 11.3: forbidOnly: !!process.env.CI. On CI, ANY committed .only fails the build loudly — the lie becomes impossible. That one config line exists because this exact disaster happened to enough teams to earn a dedicated option. Locally .only stays your debugging friend.',
      highlightLines: [12, 13],
    },
    {
      id: 'test-step',
      caption:
        'Hygiene for LONG tests: test.step(name, fn) groups actions into named chapters — “log in as shopper”, “add three items”, “apply coupon”. Reports and traces (11.14) then read as a story, and a failure names its CHAPTER instead of pointing at click #37 of 40. 10.3’s naming discipline, applied inside a test.',
      highlightLines: [15],
    },
    {
      id: 'soft-assertions',
      caption:
        'Last tool: expect.soft — record the failure but KEEP GOING. For checking several independent facts in one screen pass (price, title, badge — three soft expects), you collect ALL the wrongness in one run instead of fix-rerun-fix-rerun. The test still FAILS at the end: soft is about gathering evidence, never about forgiving.',
      highlightLines: [16],
    },
  ],
  Viz: TagWall,
  underTheHood: (
    <>
      <p>
        Playwright also supports tags as a first-class option — <code>test("name", {'{ tag: "@smoke" }'}, fn)</code>{' '}
        — which reports can group by. The in-title convention and the option coexist; teams pick
        one style and stay consistent (the hygiene is the point, not the syntax).
      </p>
      <p>
        Selection composes into PROJECTS (11.12). A <code>smoke</code> project with{' '}
        <code>grep: /@smoke/</code> built in means CI can run “the smoke lane” by name. That’s
        how 11.16’s pipeline will ask for it. Tags feed grep; grep feeds projects;
        projects feed CI. One convention, all the way up.
      </p>
      <p>
        skip has more moods. <code>test.skip(true, reason)</code> skips unconditionally.{' '}
        <code>test.skip(({'{ browserName }'}) =&gt; …, reason)</code> skips conditionally, per
        fixture values. <code>test.slow()</code> is not a skip at all: it triples the timeout
        for a legitimately slow test, on the record.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A committed test.only reaches CI with forbidOnly enabled. What happens to the build?',
      accept: ['it fails', 'fails', 'the build fails', 'fails loudly', 'red', 'it fails the build'],
      placeholder: 'what happens…',
      why: 'The build FAILS — loudly and immediately. Without the guard, the suite silently shrinks to one test and “passes” having tested nothing: the most dangerous green there is.',
    },
    {
      kind: 'type-output',
      question: 'What defines a good smoke set? (roughly how many tests, covering what)',
      accept: ['10-15 critical path tests', '10–15 tests, critical paths', 'a few fast critical-path tests', '10 to 15 critical tests', 'small set of critical paths', '10-15 tests proving the app breathes'],
      placeholder: 'size + coverage…',
      why: '10–15 fast tests proving the app BREATHES — login, checkout, search. Critical paths only: it answers “is anything fundamental on fire?” in about two minutes.',
    },
    {
      kind: 'type-output',
      question: 'expect.soft(price).toBe(900) fails mid-test. Does the test keep running, and does it still fail overall? (yes/yes, yes/no, …)',
      accept: ['yes/yes', 'yes, yes', 'yes and yes', 'keeps running and still fails', 'yes yes'],
      placeholder: 'runs on? / fails?…',
      why: 'Yes and yes — soft assertions record the failure and continue (gather ALL the evidence in one pass), but the test still fails at the end. Soft ≠ optional.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, someone will read your suite before they read your code.</Scene>
      <ChatBubble who="lead" face="🙂">
        Consistent tags, a reason on every skip, no merged .onlys, steps in the long tests.
      </ChatBubble>
      <ChatBubble who="lead" face="😊" accent indent>
        None of that is clever. All of it adds up.
      </ChatBubble>
      <Takeaway>
        <Key>The engineer whose suite reads like a spec sheet gets trusted with the release
        button.</Key> That is the promotion path in this lesson.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={GREP_EXERCISE} />,
  teachBack: {
    prompt:
      'Teach suite hygiene to a friend: tags and grep (what a smoke set is), honest skipping vs fixme, the .only disaster and its config guard, and what test.step and expect.soft each buy.',
    modelAnswer:
      'A 500-test suite serves different moments: pre-merge wants a two-minute pulse check, nightly wants everything. Tags make that possible with zero machinery — a word like @smoke in the test title — and --grep filters titles by regex, running just the matches; --grep-invert excludes instead. The smoke set is the tag every team has: ten to fifteen fast tests proving the app breathes — login, checkout, search — critical paths only. Skipping is done honestly: test.skip with a condition AND a reason string reports the test as skipped, never silently green, with the reason on the report; test.fixme marks known-broken tests that shouldn’t run but must stay visible as debt on every report. The famous disaster is test.only: perfect for debugging because it runs just one test, catastrophic if committed because the suite silently shrinks — CI runs one test, passes, and the pipeline goes green while 499 tests never ran. The guard is the config’s forbidOnly on CI, which fails the build loudly on any committed .only — that line exists because this disaster is that common. Finally, test.step groups long tests into named chapters so failures name a chapter instead of click #37, and expect.soft records failures while continuing — gathering all the evidence in one pass — with the test still failing at the end: soft gathers, it never forgives.',
  },
  recap: [
    'Tags = words in titles (@smoke) — zero machinery; --grep runs the slice (4.9 on the suite), --grep-invert excludes; composes with --project. Smoke set = 10–15 critical-path tests proving the app breathes.',
    'Skip HONESTLY: test.skip(condition, reason) — reported, reasoned, never silently green. fixme = known-broken, visible debt. test.slow() = tripled timeout, on the record.',
    'The .only disaster: committed → suite silently shrinks → green while testing nothing; forbidOnly on CI (11.3) makes it fail loudly. test.step = named chapters (traces read as stories); expect.soft = gather all evidence, still fail at the end.',
  ],
}
