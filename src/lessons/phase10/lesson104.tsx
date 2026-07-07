import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, TestRunCard } from '../../design/JobScene'

/**
 * 10.4 — Assertions
 * expect(actual).matcher(expected) grammar; toBe = === (addresses for
 * objects — 4.6 pays off in the twin trap); toEqual walks the tree (4.7);
 * the matcher family incl. toBeCloseTo (1.9's floats get their tool);
 * toBeTruthy caution (1.8); .not; async flag. Exercise: BUILD toBe and
 * toEqual from raw materials.
 */

const CODE = `import { expect, test } from "vitest";

test("primitives compare by value", () => {
  expect(100 * 1.25).toBe(125);
});

test("objects compare by ADDRESS", () => {
  const a = { total: 125 };
  const b = { total: 125 };
  expect(a).toBe(b);      // ✗ FAILS!
  expect(a).toEqual(b);   // ✓ passes
});

expect(["a", "b"]).toContain("b");
expect("Playwright").toHaveLength(10);
expect(0.1 + 0.2).toBeCloseTo(0.3);
expect(125).not.toBe(126);`

interface View {
  mode: 'grammar' | 'scale' | 'failure' | 'family'
  pans?: { left: string; right: string; balanced: boolean; tags?: boolean }
  unpacked?: boolean
  familyHot?: number | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'grammar', console: [],
    note: 'the grammar reads as a sentence: expect(actual).toBe(expected) — “I expect the answer to be 125”',
  },
  {
    mode: 'scale', pans: { left: '125', right: '125', balanced: true }, console: ['✓ primitives compare by value'],
    note: 'toBe on primitives = 1.9’s strict === — value against value, no coercion, ever',
  },
  {
    mode: 'scale', pans: { left: '{ total: 125 }', right: '{ total: 125 }', balanced: false, tags: true }, console: ['✗ objects compare by ADDRESS'],
    note: 'the twin trap: identical CONTENTS, but toBe compares what the variables HOLD — two different addresses (4.6!)',
  },
  {
    mode: 'failure', console: [],
    note: 'read the failure like a pro: Expected/Received look IDENTICAL — the runner even hints “serializes to the same string”',
    badge: 'that hint is the runner telling you: same contents, different object — you wanted toEqual, not toBe',
  },
  {
    mode: 'scale', pans: { left: 'total: 125', right: 'total: 125', balanced: true }, unpacked: true, console: ['✓ toEqual: structural match'],
    note: 'toEqual UNPACKS both objects and compares structure — every key, every value, every layer deep (4.7’s tree)',
  },
  {
    mode: 'scale', pans: { left: 'total: 125', right: 'total: 125', balanced: true }, unpacked: true, console: ['✓ toEqual: structural match'],
    note: 'the rule: toBe for primitives and same-object identity · toEqual for objects and arrays. Data? toEqual.',
  },
  {
    mode: 'family', familyHot: 0, console: [],
    note: 'the family, tour one: toContain (arrays AND strings) · toHaveLength — precise questions, readable failures',
  },
  {
    mode: 'family', familyHot: 1, console: [],
    note: 'toBeCloseTo: 1.9’s 0.1 + 0.2 problem finally gets its official tool — never toBe on float math',
    badge: '0.1 + 0.2 === 0.30000000000000004 — toBe would fail honestly but unhelpfully; toBeCloseTo asks “equal enough?”',
  },
  {
    mode: 'family', familyHot: 2, console: [],
    note: 'caution: toBeTruthy accepts EVERYTHING except 1.8’s six falsy values — a blunt instrument',
    badge: 'expect(items.length).toBeTruthy() passes at length 1 AND length 999 — you meant toHaveLength(3). Prefer exact matchers.',
  },
  {
    mode: 'family', familyHot: 3, console: [],
    note: 'every matcher flips with .not — expect(125).not.toBe(126) — and still reads as English',
  },
  {
    mode: 'grammar', console: [],
    note: 'file away: promises get await expect(p).resolves.toBe(…) — and Phase 11’s web-first assertions grow from this exact grammar',
  },
]

const FAMILY = [
  { code: 'expect(["a","b"]).toContain("b")', note: 'membership — arrays & strings' },
  { code: 'expect(0.1 + 0.2).toBeCloseTo(0.3)', note: 'floats: “equal enough”' },
  { code: 'expect(list).toBeTruthy()  ⚠', note: 'blunt — prefer exact matchers' },
  { code: 'expect(125).not.toBe(126)', note: 'every matcher, flipped' },
]

function AssertionScale({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'grammar' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the sentence shape
          </text>
          {[
            { part: 'expect(actual)', sub: 'what the code produced', color: 'var(--color-marker-teal)' },
            { part: '.toBe / .toEqual / …', sub: 'the matcher: which QUESTION', color: 'var(--color-pencil-blue)' },
            { part: '(expected)', sub: 'from the spec (10.3!)', color: 'var(--color-marker-coral)' },
          ].map((seg, i) => (
            <g key={seg.part}>
              <RoughRect x={40} y={48 + i * 56} width={360} height={44} seed={3001 + i} strokeWidth={2} stroke={seg.color} fill={`color-mix(in srgb, ${seg.color} 8%, transparent)`} fillStyle="solid" />
              <text x={60} y={70 + i * 56} fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{seg.part}</text>
              <text x={390} y={70 + i * 56} textAnchor="end" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">{seg.sub}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'scale' && view.pans && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the assertion scale
          </text>
          {/* the beam */}
          <line x1={110} y1={view.pans.balanced ? 90 : 78} x2={330} y2={view.pans.balanced ? 90 : 102} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={220} y1={90} x2={220} y2={150} stroke="var(--color-ink)" strokeWidth={2.5} strokeLinecap="round" />
          {/* pans */}
          {[
            { x: 110, y: view.pans.balanced ? 100 : 88, label: view.pans.left, tag: 'actual' },
            { x: 330, y: view.pans.balanced ? 100 : 112, label: view.pans.right, tag: 'expected' },
          ].map((pan, i) => (
            <g key={pan.tag}>
              <RoughRect x={pan.x - 70} y={pan.y} width={140} height={40} seed={3010 + i} strokeWidth={2} stroke={view.pans!.balanced ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={pan.x} y={pan.y + 20} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{pan.label}</text>
              <text x={pan.x} y={pan.y + 34} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">{pan.tag}</text>
              {view.pans!.tags && (
                <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                  <RoughRect x={pan.x - 42} y={pan.y - 26} width={84} height={20} seed={3015 + i} strokeWidth={1.6} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
                  <text x={pan.x} y={pan.y - 12} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">@heap:{i === 0 ? '0x2f' : '0x9c'}</text>
                </motion.g>
              )}
            </g>
          ))}
          <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill={view.pans.balanced ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
            {view.pans.balanced ? 'balanced ✓' : 'toBe weighs the ADDRESS TAGS — not balanced ✗'}
          </text>
          {view.unpacked && (
            <text x={220} y={208} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
              toEqual tipped the boxes out and weighed the CONTENTS
            </text>
          )}
        </g>
      )}

      {view.mode === 'failure' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the failure message, decoded
          </text>
          <RoughRect x={40} y={44} width={360} height={124} seed={3020} strokeWidth={2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 4%, transparent)" fillStyle="solid" />
          <text x={56} y={68} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-marker-coral)">✗ objects compare by ADDRESS</text>
          <text x={56} y={92} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-teal)">Expected: {'{ "total": 125 }'}</text>
          <text x={56} y={110} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-coral)">Received: {'{ "total": 125 }'}</text>
          <text x={56} y={136} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-pencil-blue)">(serializes to the same string — did you mean toEqual?)</text>
          <text x={56} y={156} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink-soft)">at tax.test.js:10:15   ← 9.2’s address, pointing at YOUR expect</text>
        </g>
      )}

      {view.mode === 'family' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the matcher family
          </text>
          {FAMILY.map((row, i) => {
            const hot = view.familyHot === i
            return (
              <g key={row.code} opacity={view.familyHot === null || hot ? 1 : 0.35}>
                <RoughRect x={36} y={44 + i * 44} width={368} height={36} seed={3030 + i} strokeWidth={hot ? 2.4 : 1.5} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 8%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={50} y={66 + i * 44} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{row.code}</text>
                <text x={392} y={66 + i * 44} textAnchor="end" fontFamily="var(--font-hand)" fontSize={9} fill="var(--color-ink-soft)">{row.note}</text>
              </g>
            )
          })}
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={3040} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={312} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const MATCHER_EXERCISE: CodeExerciseDef = {
  id: 'l104-build-matchers',
  title: 'build toBe and toEqual yourself',
  task: 'The two most important matchers are shallow tools you already own. Build both, then prove the twin trap on purpose — once you’ve written toEqual, you’ll never confuse the two again.',
  steps: [
    <>
      Write <code>toBe(a, b)</code>: strict comparison, one line — exactly what the real matcher
      does.
    </>,
    <>
      Write <code>toEqual(a, b)</code> for flat objects: the key lists must be the same length
      (4.8), and EVERY key’s value must match strictly (4.10 gave you the one-word tool for
      “all of them pass”).
    </>,
    <>
      Arrange the twins: <code>a</code> and <code>b</code>, both <code>{'{ total: 125 }'}</code>{' '}
      — two separate literals.
    </>,
    <>
      Print three verdicts, labeled exactly: <code>toBe twins: false</code>,{' '}
      <code>toEqual twins: true</code>, <code>toBe same box: true</code> (that last one compares{' '}
      <code>a</code> with <code>a</code>).
    </>,
  ],
  starter: '',
  expectedOutput: ['toBe twins: false', 'toEqual twins: true', 'toBe same box: true'],
  mustUse: [
    { test: /function\s+toBe\s*\(|const\s+toBe\s*=/, label: 'a function named toBe' },
    { test: /function\s+toEqual\s*\(|const\s+toEqual\s*=/, label: 'a function named toEqual' },
    { test: /===/, label: 'comparisons are strict' },
    { test: /Object\.keys/, label: 'toEqual walks the keys' },
    { test: /\.every\s*\(/, label: '“all values match” is asked with .every (4.10)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']toBe twins: false["']\s*\)/, label: 'no hard-coded verdicts — your matchers must compute them' },
    { test: /JSON\.stringify/, label: 'no stringify shortcut — compare structure the honest way' },
  ],
  modelAnswer: `function toBe(a, b) {
  return a === b;
}

function toEqual(a, b) {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => a[key] === b[key]);
}

const a = { total: 125 };
const b = { total: 125 };

console.log("toBe twins: " + toBe(a, b));
console.log("toEqual twins: " + toEqual(a, b));
console.log("toBe same box: " + toBe(a, a));`,
}

export const lesson104: LessonDef = {
  id: '10.4',
  hook: (
    <>
      <p>
        The assert beat from 10.3 gets its professional vocabulary today — and hiding inside it is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the single most-asked beginner question in testing: why does expect(a).toBe(b) FAIL
          when a and b are identical objects?
        </HighlightMark>
      </p>
      <p>
        You already own the answer — you learned it in 4.6, watching arrows point into the heap.
        Today it pays off, along with the whole matcher family and the skill of reading a failure
        message like a letter addressed to you.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-grammar',
      caption:
        'First the grammar, because it’s designed to be read aloud: expect(actual).toBe(expected) — “I expect the answer to be 125.” actual is what the code produced (10.3’s Act); the matcher is which QUESTION you’re asking; expected comes from the spec (10.3’s soul-rule, still in force).',
      highlightLines: [3, 4],
    },
    {
      id: 'tobe-primitives',
      caption:
        'toBe on primitives is exactly 1.9’s strict ===: value against value, no coercion, no mercy. 100 * 1.25 is 125, the scale balances, the test passes. For numbers, strings, and booleans, toBe is your default — precise and honest.',
      highlightLines: [4],
    },
    {
      id: 'the-twin-trap',
      caption:
        'Now the famous trap. a and b hold IDENTICAL contents — { total: 125 } twice. expect(a).toBe(b)… FAILS. Why: 4.6, verbatim — variables holding objects hold ARROWS to heap boxes, and toBe compares the arrows. Two literals built two boxes at two addresses. The scale is weighing address tags.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'read-the-failure',
      caption:
        'Read the failure message before fixing anything — this is a skill. Expected and Received print IDENTICALLY, which looks like the runner has lost its mind — until you spot its hint: “serializes to the same string.” That’s the runner literally telling you: same contents, different objects, you probably meant toEqual.',
      highlightLines: [10],
    },
    {
      id: 'toequal',
      caption:
        'toEqual is the matcher that tips the boxes out: it UNPACKS both objects and compares STRUCTURE — every key, every value, and if a value is itself an object, it walks in (4.7’s layers, all the way down). The twins pass. Contents were never the problem; the question was.',
      highlightLines: [11],
    },
    {
      id: 'which-when',
      caption:
        'The rule, once and forever: toBe for primitives and for “is this the SAME box?” identity checks. toEqual for objects and arrays — any time you mean “does the DATA match?” When you’re asserting on data (and in testing you usually are), reach for toEqual.',
      highlightLines: [10, 11],
    },
    {
      id: 'family-tour',
      caption:
        'The family beyond the big two — each one a more PRECISE question with a more READABLE failure: toContain asks membership (works on arrays and strings both); toHaveLength asks size. expect(list).toHaveLength(3) failing tells you “had 5” — an if-based check would just say false.',
      highlightLines: [14, 15],
    },
    {
      id: 'tobecloseto',
      caption:
        'And a debt from 1.9 finally settles: 0.1 + 0.2 is 0.30000000000000004, so toBe(0.3) fails on CORRECT code. toBeCloseTo asks the right question for floats — “equal within rounding dust?” Any assertion on float math uses it, always.',
      highlightLines: [16],
    },
    {
      id: 'truthy-caution',
      caption:
        'One family member to distrust: toBeTruthy passes for EVERYTHING except 1.8’s six falsy values — so expect(items.length).toBeTruthy() passes at length 1, 3, or 999. You didn’t ask a question; you asked “is it not-nothing?” Prefer the exact matcher that says what you mean: toHaveLength(3), toBe(true).',
      highlightLines: [16],
    },
    {
      id: 'not',
      caption:
        'Every matcher flips with .not — expect(125).not.toBe(126), expect(list).not.toContain("banned") — and the sentence still reads as English. Negative expectations are real expectations: “the error message does NOT appear” is half of UI testing.',
      highlightLines: [17],
    },
    {
      id: 'async-flag',
      caption:
        'File away, a preview not homework: promises get their own grammar — await expect(promise).resolves.toBe(…) — and Phase 11’s web-first assertions (expect(locator).toHaveText(…)) grow from exactly this family, with auto-retry built in. Same sentences, patient edition.',
      highlightLines: [1],
    },
  ],
  Viz: AssertionScale,
  underTheHood: (
    <>
      <p>
        Precisely what <code>toBe</code> uses: <code>Object.is</code> — <code>===</code>{' '}
        with two exotic exceptions (<code>NaN</code> matches <code>NaN</code>, and{' '}
        <code>+0</code>/<code>-0</code> differ). You can go years without meeting either; “toBe is
        strict ===” is the working truth.
      </p>
      <p>
        <code>toEqual</code>’s full contract: it walks both trees (4.7), comparing
        primitives strictly at the leaves — and it treats <code>undefined</code> properties as
        ignorable (<code>{'{ a: 1, b: undefined }'}</code> equals <code>{'{ a: 1 }'}</code>).
        Its stricter sibling <code>toStrictEqual</code> counts those too. If a suite you join uses
        the strict one everywhere, that’s why.
      </p>
      <p>
        Why your exercise ban on <code>JSON.stringify</code> comparison matters: it’s
        order-sensitive — <code>{'{ a, b }'}</code> and <code>{'{ b, a }'}</code> serialize
        differently but ARE structurally equal. It silently drops undefined and functions
        (4.13’s translation losses). It explodes on circular references (self-containing
        objects). Real toEqual walks the tree so it doesn’t inherit those lies.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'const a = { total: 125 }; const b = { total: 125 }; — does expect(a).toBe(b) pass or fail?',
      accept: ['fail', 'fails', 'FAIL', 'it fails', 'fail!'],
      placeholder: 'pass / fail…',
      why: 'Fails — toBe compares what the variables hold, and for objects that’s heap ADDRESSES (4.6). Two literals = two boxes = two addresses. toEqual is the structural question.',
    },
    {
      kind: 'type-output',
      question: 'You’re asserting that 0.1 + 0.2 equals 0.3. Which matcher?',
      accept: ['toBeCloseTo', 'tobecloseto', 'to be close to', 'toBeCloseTo(0.3)'],
      placeholder: 'matcher name…',
      why: 'toBeCloseTo — 0.1 + 0.2 is 0.30000000000000004 (1.9’s float dust), so toBe fails on correct code. Float math always gets the “equal enough” question.',
    },
    {
      kind: 'type-output',
      question: 'items.length is 999 but you expected 3. Does expect(items.length).toBeTruthy() catch the bug? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — 999 is truthy, so it passes. toBeTruthy only fails on 1.8’s six falsy values; it’s a blunt instrument. toHaveLength(3) asks the real question.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, at 2am, a failure message will need to explain itself:</Scene>
      <TestRunCard lines={[<>expect(items).toHaveLength(3)</>, <>✗ expected length 3, received 5</>]} />
      <Takeaway>
        Failure messages are the product you ship to your future self. <Key>Choosing precise
        matchers IS writing documentation for the night something breaks.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={MATCHER_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the twin trap to a friend: why toBe fails on two identical-looking objects (use 4.6’s picture), what toEqual does differently, and the rule for choosing between them — plus which matcher float math always gets.',
    modelAnswer:
      'toBe is strict === — and for primitives that’s exactly what you want: value against value, no coercion. The trap comes with objects: variables holding objects don’t hold the object, they hold an ARROW to a box in the heap (4.6). Two separate literals — even with identical contents like { total: 125 } twice — build two boxes at two different addresses, so toBe compares two different arrows and fails. The failure message even looks absurd — Expected and Received print identically — until you read the runner’s hint, “serializes to the same string,” which is it telling you: same contents, different objects. toEqual asks the structural question instead: it unpacks both objects and walks every key, every value, every nested layer, comparing the actual data — so the twins pass. The rule: toBe for primitives and for same-box identity; toEqual whenever you mean “does the data match” — which in testing is most of the time. And float math always gets toBeCloseTo, because 0.1 + 0.2 is 0.30000000000000004, so toBe fails on perfectly correct code. One more caution: toBeTruthy passes for anything that isn’t one of the six falsy values — length 999 passes when you expected 3 — so prefer the exact matcher that says what you actually mean.',
  },
  recap: [
    'Grammar: expect(actual).matcher(expected) — reads as a sentence; expected still comes from the spec. toBe = strict === (value for primitives, ADDRESS for objects — 4.6).',
    'The twin trap: two identical literals = two heap boxes → toBe fails; toEqual unpacks and compares structure (every layer — 4.7). Rule: toBe for primitives/identity, toEqual for data.',
    'Family: toContain, toHaveLength, toBeCloseTo (floats, always — 1.9 settled), .not flips anything. Distrust toBeTruthy (passes everything non-falsy). Async/web-first assertions grow from this grammar in Phase 11.',
  ],
}
