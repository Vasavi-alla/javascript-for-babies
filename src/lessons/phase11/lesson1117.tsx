import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 11.17 — Visual & a11y testing (bonus)
 * toHaveScreenshot: baseline → pixel-compare → diff; baselines ARE expected
 * values (10.3's rule governs updates); tolerance for pixel weather; the
 * budget (few key screens). AxeBuilder: the a11y scan as an executable
 * floor — honest about the ~machine-checkable share; 11.4's roles already
 * did half the work.
 */

const CODE = `// visual: a pixel-level toEqual
await expect(page).toHaveScreenshot("checkout.png");
// 1st run: SAVES the baseline image
// later runs: pixel-compare → fail on diff

// intended redesign? update the expected value:
// $ npx playwright test --update-snapshots

// tolerance for pixel weather:
await expect(page).toHaveScreenshot({
  maxDiffPixels: 100,
});

// a11y: the automated floor
import AxeBuilder from "@axe-core/playwright";
const results = await new AxeBuilder({ page })
  .analyze();
expect(results.violations).toEqual([]);`

interface View {
  mode: 'gap' | 'diff' | 'axe'
  phase?: 'baseline' | 'match' | 'mismatch' | null
  violations?: number
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'gap', console: ['✓ all functional tests pass'],
    note: 'the gap: every functional test passes — toHaveText, toBeVisible, all green — while the page looks DESTROYED. CSS regressions are invisible to text assertions',
  },
  {
    mode: 'diff', phase: 'baseline', console: ['checkout.png saved (baseline)'],
    note: 'toHaveScreenshot("checkout.png"): the FIRST run saves a baseline image — the expected value, as pixels',
  },
  {
    mode: 'diff', phase: 'match', console: ['✓ pixels match'],
    note: 'every later run re-screenshots and pixel-compares against the baseline — a toEqual (10.4) for how things LOOK',
  },
  {
    mode: 'diff', phase: 'mismatch', console: ['✗ 4 312 pixels differ — diff image written'],
    note: 'a CSS regression lands: the compare fails and writes a DIFF image — the changed pixels highlighted. Evidence, not vibes (11.14’s kit grows)',
  },
  {
    mode: 'diff', phase: 'mismatch', console: [],
    note: 'an INTENDED redesign? --update-snapshots re-saves baselines. Baselines ARE expected values — 10.3’s law governs them',
    badge: 'they change only when the SPEC changes — and reviewing a baseline diff in a pull request IS reviewing a spec change. Never update to silence a red you don’t understand.',
  },
  {
    mode: 'diff', phase: 'match', console: [],
    note: 'pixel weather is real: fonts and antialiasing differ per machine. maxDiffPixels sets tolerance; suites disable animations; visual tests run same-OS (CI)',
  },
  {
    mode: 'diff', phase: 'match', console: [],
    note: 'the budget (10.2, one last time): pixel tests are the most brittle layer — a FEW key screens, not everything. Precision where looks ARE the spec',
  },
  {
    mode: 'axe', violations: 2, console: ['✗ violations: [ label-missing, low-contrast ]'],
    note: 'accessibility: AxeBuilder scans the LIVE page for machine-checkable violations — missing labels, low contrast, broken roles',
  },
  {
    mode: 'axe', violations: 0, console: ['✓ violations: []'],
    note: 'expect(results.violations).toEqual([]) — an executable a11y FLOOR. And 11.4 already did half the work: role-based locators kept your pages semantic',
    badge: 'honesty: axe catches the machine-checkable share (roughly a third to half). Real accessibility needs human judgment — the scan is a floor, never a certificate.',
  },
]

function DiffOverlay({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'gap' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            functionally perfect · visually destroyed
          </text>
          <RoughRect x={60} y={44} width={150} height={130} seed={5601} strokeWidth={2} stroke="var(--color-marker-teal)" fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={135} y={66} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">how it should look</text>
          <text x={135} y={96} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">Total: ₹900</text>
          <text x={135} y={120} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">[ Pay now ]</text>
          <RoughRect x={230} y={44} width={150} height={130} seed={5602} strokeWidth={2} stroke="var(--color-marker-coral)" roughness={2.4} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={305} y={66} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink)">after the CSS regression</text>
          <text x={352} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)" transform="rotate(8 352 110)">Total: ₹900</text>
          <text x={258} y={150} textAnchor="middle" fontFamily="var(--font-code)" fontSize={6.5} fill="var(--color-ink)">[Pay now]</text>
          <text x={220} y={206} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            toHaveText("₹900") passes on BOTH — the text is there
          </text>
        </g>
      )}

      {view.mode === 'diff' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            baseline · actual · diff
          </text>
          {['baseline', 'actual', 'diff'].map((pane, i) => {
            const mismatch = view.phase === 'mismatch'
            const isDiff = i === 2
            return (
              <g key={pane}>
                <RoughRect x={40 + i * 128} y={48} width={112} height={110} seed={5610 + i} strokeWidth={isDiff && mismatch ? 2.6 : 1.8} stroke={isDiff ? (mismatch ? 'var(--color-marker-coral)' : 'var(--color-ink-soft)') : 'var(--color-ink)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
                <text x={96 + i * 128} y={70} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">{pane}</text>
                {view.phase === 'baseline' && i > 0 ? (
                  <text x={96 + i * 128} y={115} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">(first run: none yet)</text>
                ) : (
                  <g>
                    <text x={96 + i * 128} y={100} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">Total: ₹900</text>
                    <text x={96 + i * 128} y={122} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill={isDiff && mismatch ? 'var(--color-marker-coral)' : 'var(--color-ink)'} transform={!isDiff && i === 1 && mismatch ? `rotate(6 ${96 + i * 128} 122)` : undefined}>
                      {isDiff ? (mismatch ? '▓▓ 4 312 px ▓▓' : '(no differences)') : '[ Pay now ]'}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'axe' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the axe scan — machine-checkable violations
          </text>
          {(view.violations ?? 0) === 0 ? (
            <g>
              <RoughRect x={120} y={60} width={200} height={60} seed={5620} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
              <text x={220} y={95} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-ink)">violations: [] ✓</text>
            </g>
          ) : (
            <g>
              {[
                { rule: 'label — form field has no label', el: 'input#coupon (7.6’s pairing, missing)' },
                { rule: 'color-contrast — text 2.1:1', el: '.price-muted (needs 4.5:1)' },
              ].map((row, i) => (
                <g key={row.rule}>
                  <RoughRect x={50} y={48 + i * 66} width={340} height={54} seed={5625 + i} strokeWidth={2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
                  <text x={70} y={70 + i * 66} fontFamily="var(--font-hand)" fontSize={10} fontWeight={700} fill="var(--color-ink)">✗ {row.rule}</text>
                  <text x={70} y={90 + i * 66} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">{row.el}</text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9} seed={5630} color="var(--color-pencil-blue)" />
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

const DIFF_EXERCISE: CodeExerciseDef = {
  id: 'l1117-pixel-differ',
  title: 'build the pixel differ',
  task: 'toHaveScreenshot is a comparison engine with a tolerance dial. Build it on strings-as-pixel-rows: count differences position by position, then let maxDiffPixels decide pass or fail.',
  steps: [
    <>
      Write <code>diffCount(baseline, actual)</code> for two same-length strings: split each into
      characters (1.6’s train, car by car) and count positions where they differ — filter’s
      callback accepts the INDEX as its second argument (4.9’s fine print, finally used).
    </>,
    <>
      Write <code>compare(baseline, actual, maxDiffPixels)</code>: compute the count, print{' '}
      <code>diff pixels: N</code>, then print <code>within tolerance: pass</code> or{' '}
      <code>beyond tolerance: FAIL</code>.
    </>,
    <>
      Run twice: <code>"##########"</code> vs <code>"#########_"</code> with tolerance{' '}
      <code>2</code> (antialiasing dust — passes), then <code>"##########"</code> vs{' '}
      <code>"____######"</code> with tolerance <code>2</code> (a real regression — fails).
    </>,
  ],
  starter: '',
  expectedOutput: ['diff pixels: 1', 'within tolerance: pass', 'diff pixels: 4', 'beyond tolerance: FAIL'],
  mustUse: [
    { test: /\.split\s*\(\s*["']{2}\s*\)/, label: 'rows split into character-pixels' },
    { test: /\.filter\s*\(\s*\(\s*\w+\s*,\s*\w+\s*\)/, label: 'the filter callback uses the index parameter' },
    { test: /function\s+diffCount|const\s+diffCount\s*=/, label: 'a function named diffCount' },
    { test: /function\s+compare|const\s+compare\s*=/, label: 'a function named compare' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']diff pixels: 1["']\s*\)/, label: 'no hard-coded counts — count the pixels' },
  ],
  modelAnswer: `function diffCount(baseline, actual) {
  return baseline
    .split("")
    .filter((pixel, i) => pixel !== actual[i])
    .length;
}

function compare(baseline, actual, maxDiffPixels) {
  const count = diffCount(baseline, actual);
  console.log("diff pixels: " + count);
  if (count <= maxDiffPixels) {
    console.log("within tolerance: pass");
  } else {
    console.log("beyond tolerance: FAIL");
  }
}

compare("##########", "#########_", 2);
compare("##########", "____######", 2);`,
}

export const lesson1117: LessonDef = {
  id: '11.17',
  hook: (
    <>
      <p>
        Bonus lesson — two specialist tools for the gaps everything else misses:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          visual testing (a pixel-level toEqual, because functional tests can’t see a destroyed
          layout) and the automated accessibility scan
        </HighlightMark>
        . Know they exist, know their honest limits, reach for them when the question is theirs.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-gap',
      caption:
        'The gap first: a CSS regression rotates the total and shrinks the Pay button to unreadable — and every functional test PASSES, because toHaveText("₹900") only asks whether the text exists (11.6). The words are all there. The page is destroyed. Text assertions are blind to LOOKS.',
      highlightLines: [1],
    },
    {
      id: 'baseline',
      caption:
        'toHaveScreenshot("checkout.png") closes it: on the FIRST run there’s nothing to compare against, so it SAVES the screenshot as the baseline — the expected value, stored as pixels. (It fails that first run, deliberately: “no baseline existed, I made one, re-run.”)',
      highlightLines: [2, 3],
    },
    {
      id: 'pixel-compare',
      caption:
        'Every later run takes a fresh screenshot and compares pixel by pixel against the baseline. Recognize the shape: it’s 10.4’s toEqual — a structural comparison — where the structure is the rendered image. Same grammar, await expect(page), one more matcher in the family.',
      highlightLines: [2, 4],
    },
    {
      id: 'the-diff',
      caption:
        'When the CSS regression lands, the compare fails AND writes a DIFF IMAGE — the changed pixels highlighted against the baseline. Three files in the report: expected, actual, diff (11.14’s evidence kit grows a member). You don’t squint at two screenshots; the diff points.',
      highlightLines: [4],
    },
    {
      id: 'updating-baselines',
      caption:
        'And when the change is an INTENDED redesign? --update-snapshots re-saves the baselines. Governance matters here: baselines ARE expected values, so 10.3’s law applies in full — they change only when the SPEC changes. Reviewing a baseline diff in a pull request IS reviewing a spec change; updating to silence a red you don’t understand is the enshrined-bug trap with pictures.',
      highlightLines: [6, 7],
    },
    {
      id: 'pixel-weather',
      caption:
        'Now the honesty tax: pixels have WEATHER. Fonts render differently across OSes; antialiasing differs by GPU; animations smear. The kit: maxDiffPixels (or ratio) tolerates dust, suites disable animations for visual tests, and baselines are generated on ONE OS — CI’s — so comparisons are apples to apples.',
      highlightLines: [9, 10, 11],
    },
    {
      id: 'visual-budget',
      caption:
        'Which is why the budget matters (10.2, one final time): pixel tests are the most brittle layer of all — every intended restyle touches them. A FEW key screens where looks ARE the spec — the checkout, the landing page, the invoice PDF — not a screenshot of everything. Precision spent deliberately.',
      highlightLines: [2],
    },
    {
      id: 'axe',
      caption:
        'Second tool: accessibility. AxeBuilder({ page }).analyze() scans the LIVE page against machine-checkable rules: form fields without labels (7.6’s pairing, audited), text contrast below thresholds, broken ARIA roles (ARIA = extra HTML attributes that add accessibility meaning). The result is a violations array — each entry naming the rule, the element, and the fix.',
      highlightLines: [14, 15, 16],
    },
    {
      id: 'a11y-floor',
      caption:
        'expect(results.violations).toEqual([]) turns the scan into an executable FLOOR: the page cannot merge with detectable violations. Two honest notes: 11.4 already did half this work (role-based locators kept your pages semantic — the same tree axe reads), and the scan catches only the machine-checkable share — roughly a third to half. Real accessibility needs human judgment. A floor, never a certificate.',
      highlightLines: [17],
    },
  ],
  Viz: DiffOverlay,
  underTheHood: (
    <>
      <p>
        Screenshot scope composes: <code>expect(locator).toHaveScreenshot()</code> snapshots ONE
        component instead of the page — much less brittle (only that widget’s pixels can fail),
        and usually the better default. <code>fullPage: true</code>, <code>mask: [locator]</code>{' '}
        (hide dynamic regions like timestamps), and <code>stylePath</code> (inject
        test-only CSS) handle the classic instabilities.
      </p>
      <p>
        Baselines are stored per-platform and per-project (11.12) —{' '}
        <code>checkout-chromium-linux.png</code> — which is exactly why teams generate them on CI
        and treat local visual runs as advisory. The <code>--update-snapshots</code> flag exists
        on CI reruns for that reason.
      </p>
      <p>
        The axe engine behind AxeBuilder is the industry’s shared standard (the same one inside
        browser devtools’ accessibility audits). Its rules map to WCAG — the Web Content
        Accessibility Guidelines — the spec accessibility law references worldwide. “Passes axe”
        is the floor; “meets WCAG AA” is the certificate humans verify toward.
      </p>
      <p>
        <strong>💼 On the job —</strong> teams increasingly staff “quality” to cover both of
        these. Interviewers probe with “how would you catch a CSS regression?” Answer:
        component-scoped toHaveScreenshot on key screens, baselines governed like spec changes.
        And “what does automated a11y testing miss?” Answer: everything needing judgment — focus
        order sensibility, alt-text QUALITY, screen-reader flow. The scan is a floor. Both
        answers are now yours.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The first-ever run of toHaveScreenshot("checkout.png") — what does it do?',
      accept: ['saves the baseline', 'creates the baseline', 'saves a baseline image', 'saves the screenshot as baseline', 'creates the baseline and fails'],
      placeholder: 'it …',
      why: 'It saves the screenshot AS the baseline (and fails that run, deliberately: “no baseline existed — made one, re-run”). Every later run pixel-compares against it.',
    },
    {
      kind: 'type-output',
      question: 'A teammate runs --update-snapshots to make a red visual test green, without knowing why it was red. Which 10.3 trap is that?',
      accept: ['the enshrined bug', 'enshrined bug', 'enshrined-bug trap', 'the enshrined-bug trap', 'copying output as expected'],
      placeholder: 'the trap…',
      why: 'The enshrined-bug trap, with pictures: baselines ARE expected values, so updating one blesses whatever the page currently looks like — bug included — as the law.',
    },
    {
      kind: 'type-output',
      question: 'Does a passing axe scan certify the page as fully accessible? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — axe catches the machine-checkable share (roughly a third to half): labels, contrast, roles. Focus order sensibility, alt-text quality, and screen-reader flow need human judgment. A floor, never a certificate.',
    },
  ],
  PlayExtra: () => <CodeExercise def={DIFF_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain both bonus tools to a friend: the gap visual testing fills, the baseline/compare/diff cycle (and who governs baseline updates), the pixel-weather kit, and what the axe scan is — including what it honestly can’t do.',
    modelAnswer:
      'Functional assertions are blind to looks: a CSS regression can rotate the total and shrink the button to unreadable while toHaveText still passes, because the words are all present. Visual testing closes that gap: toHaveScreenshot saves a baseline image on its first run — the expected value stored as pixels — and every later run screenshots fresh and compares pixel by pixel, a toEqual for rendering. On mismatch it writes a diff image highlighting exactly the changed pixels, so the evidence points instead of making you squint. Baselines are governed by the same law as every expected value: they change only when the spec changes — --update-snapshots is for intended redesigns, and reviewing a baseline diff in a pull request is reviewing a spec change; updating one to silence a red you don’t understand is the enshrined-bug trap with pictures. Pixels also have weather — fonts and antialiasing vary by machine — so suites set maxDiffPixels tolerance, disable animations, and generate baselines on one OS, usually CI’s; and because pixel tests are the most brittle layer, the budget is a few key screens where looks ARE the spec. The second tool is the axe accessibility scan: AxeBuilder analyzes the live page for machine-checkable violations — missing labels, low contrast, broken roles — and asserting the violations array is empty makes an executable accessibility floor. Honestly: that’s roughly a third to half of real accessibility; focus order, alt-text quality, and screen-reader flow need human judgment. A floor, never a certificate.',
  },
  recap: [
    'Visual = pixel-level toEqual: first run SAVES the baseline; later runs compare and write a DIFF image on mismatch. Baselines ARE expected values — 10.3’s law governs updates (--update-snapshots = a reviewed spec change, never a silencer).',
    'Pixel weather kit: maxDiffPixels tolerance, animations disabled, baselines generated on ONE OS (CI’s), component-scoped screenshots over full pages. Budget: a FEW key screens — the most brittle layer buys precision, spent deliberately.',
    'Axe scan = executable a11y FLOOR: violations (labels, contrast, roles — the tree 11.4’s locators already kept semantic) must be []. Machine-checkable ≈ a third to half; the rest needs human judgment. Floor, never certificate.',
  ],
}
