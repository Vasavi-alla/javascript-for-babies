import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, ChatBubble, Takeaway, Key } from '../../design/JobScene'

/**
 * 11.9 — Page Object Model
 * Locator duplication is the target: one CLASS per screen (5.6 employed),
 * locators as properties (cheap: they're descriptions — 11.4), user verbs
 * as methods; specs shrink to user stories; one edit heals N specs (8.1's
 * graph doing DRY work). Assertions stay in specs. POM earns at scale —
 * it's structure, not religion.
 */

const CODE = `// pages/checkout-page.ts
export class CheckoutPage {
  constructor(page) {
    this.page = page;
    this.coupon = page.getByLabel("Coupon");
    this.total = page.getByTestId("total");
  }
  async goto() {
    await this.page.goto("/checkout");
  }
  async applyCoupon(code) {
    await this.coupon.fill(code);
    await this.page
      .getByRole("button", { name: "Apply" }).click();
  }
}

// in the spec — reads as a user story:
const checkout = new CheckoutPage(page);
await checkout.goto();
await checkout.applyCoupon("SAVE10");
await expect(checkout.total).toHaveText("900");`

interface View {
  mode: 'smell' | 'class' | 'ripple' | 'rules'
  healed?: boolean
  classPart?: 'locators' | 'methods' | 'spec' | null
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'smell', console: [],
    note: 'the smell: twenty spec files, each containing getByLabel("Coupon") — the same locator, copy-pasted twenty times',
  },
  {
    mode: 'smell', console: [],
    note: 'now the UI team renames the label. Twenty files to edit. Miss one and it fails for the wrong reason — 11.8’s drift, at locator scale',
  },
  {
    mode: 'class', classPart: null, console: [],
    note: 'the cure: one CLASS per screen — 5.6’s classes, finally employed. The page’s knowledge lives in ONE place',
  },
  {
    mode: 'class', classPart: 'locators', console: [],
    note: 'locators become PROPERTIES, built once in the constructor — cheap, because a locator is a description (11.4), not a lookup',
  },
  {
    mode: 'class', classPart: 'methods', console: [],
    note: 'user actions become METHODS named by the USER’s verb: applyCoupon(code) — not “fillInputAndClickButton”',
  },
  {
    mode: 'class', classPart: 'spec', console: [],
    note: 'the spec shrinks to a user story: new → goto → applyCoupon → expect. Intention-revealing, zero selectors in sight',
  },
  {
    mode: 'ripple', healed: false, console: [],
    note: 'the payoff, replayed: the UI renames the Coupon label again…',
  },
  {
    mode: 'ripple', healed: true, console: ['1 edit → 20 specs healed'],
    note: 'ONE edit, in ONE file — every spec that imports the page object heals instantly. 8.1’s module graph, doing DRY work',
    badge: 'DRY — don’t repeat yourself: knowledge lives in exactly one place, so change costs one edit. The POM is DRY applied to page knowledge.',
  },
  {
    mode: 'rules', console: [],
    note: 'the discipline: page objects DO and LOCATE — specs ASSERT. Keep expect() in the test, where a failure belongs to a behavior',
    badge: 'teams vary on this rule (some allow assertion helpers in pages) — know the default, then follow the house style you join',
  },
  {
    mode: 'rules', console: [],
    note: 'and the honest boundary: three specs don’t need the ceremony. POM earns at SCALE — it’s structure for growth, not religion',
    badge: 'repeating widgets (header, product card) get component objects too — composition over one thousand-line god-page',
  },
]

function PomGraph({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'smell' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the same locator, everywhere
          </text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <RoughRect x={40 + (i % 2) * 190} y={44 + Math.floor(i / 2) * 74} width={170} height={60} seed={4801 + i} strokeWidth={1.6} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 5%, transparent)" fillStyle="solid" />
              <text x={125 + (i % 2) * 190} y={66 + Math.floor(i / 2) * 74} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">spec {i + 1}.spec.ts</text>
              <text x={125 + (i % 2) * 190} y={86 + Math.floor(i / 2) * 74} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-marker-coral)">getByLabel("Coupon")</text>
            </g>
          ))}
          <text x={220} y={216} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">…and 16 more files just like these</text>
        </g>
      )}

      {view.mode === 'class' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            one class per screen
          </text>
          <RoughRect x={110} y={40} width={220} height={150} seed={4810} strokeWidth={2.4} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 5%, transparent)" fillStyle="solid" />
          <text x={220} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">class CheckoutPage</text>
          <RoughRect x={126} y={74} width={188} height={44} seed={4811} strokeWidth={view.classPart === 'locators' ? 2.6 : 1.4} stroke={view.classPart === 'locators' ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={view.classPart === 'locators' ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'transparent'} fillStyle="solid" />
          <text x={220} y={92} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">locators as properties</text>
          <text x={220} y={108} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">this.coupon · this.total</text>
          <RoughRect x={126} y={126} width={188} height={44} seed={4812} strokeWidth={view.classPart === 'methods' ? 2.6 : 1.4} stroke={view.classPart === 'methods' ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={view.classPart === 'methods' ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'transparent'} fillStyle="solid" />
          <text x={220} y={144} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">user verbs as methods</text>
          <text x={220} y={160} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">goto() · applyCoupon(code)</text>
          {view.classPart === 'spec' && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={80} y={206} width={280} height={40} seed={4815} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
              <text x={220} y={224} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">await checkout.applyCoupon("SAVE10")</text>
              <text x={220} y={239} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">the spec: a user story, zero selectors</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'ripple' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the rename, replayed with a POM
          </text>
          <RoughRect x={160} y={44} width={120} height={54} seed={4820} strokeWidth={2.4} stroke={view.healed ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.healed ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 10%, transparent)`} fillStyle="solid" />
          <text x={220} y={66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">CheckoutPage</text>
          <text x={220} y={84} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill={view.healed ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
            {view.healed ? '1 locator edited ✓' : 'the label renamed…'}
          </text>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <HandArrow from={{ x: 90 + i * 130, y: 160 }} to={{ x: 195 + i * 25, y: 102 }} curve={0.15} seed={4825 + i} stroke={view.healed ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} strokeWidth={1.6} />
              <RoughRect x={50 + i * 130} y={164} width={110} height={40} seed={4830 + i} strokeWidth={1.6} stroke={view.healed ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={105 + i * 130} y={188} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">spec {i + 1} {view.healed ? '✓' : ''}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'rules' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the division of labor
          </text>
          <RoughRect x={40} y={48} width={175} height={110} seed={4840} strokeWidth={2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={127} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">page objects</text>
          <text x={127} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">LOCATE (properties)</text>
          <text x={127} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">DO (methods)</text>
          <RoughRect x={225} y={48} width={175} height={110} seed={4841} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={312} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">specs</text>
          <text x={312} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">ASSERT (expect)</text>
          <text x={312} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">tell the user story</text>
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={392} fontSize={9.5} seed={4850} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={296} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={11.5} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={316} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const POM_EXERCISE: CodeExerciseDef = {
  id: 'l119-build-a-pom',
  title: 'build a page object',
  task: 'The starter fakes a checkout screen. Wrap it in a page object — locate once, act with user verbs — and write a spec that reads as a user story.',
  steps: [
    <>
      Keep the starter’s <code>app</code> — the fake screen with an <code>apply(code)</code>{' '}
      behavior and a <code>total</code>.
    </>,
    <>
      Write <code>class CheckoutPage</code> (5.6!): the constructor takes the app and stores it
      on <code>this</code>; an <code>applyCoupon(code)</code> method delegates to the app’s
      apply; a <code>readTotal()</code> method returns the app’s total.
    </>,
    <>
      The spec: <code>new CheckoutPage(app)</code>, apply <code>"SAVE10"</code>, print{' '}
      <code>total: 900</code> (built from readTotal). Then a second instance on a fresh app —
      apply <code>"BOGUS"</code>, print <code>total: 1000</code>.
    </>,
  ],
  starter: `// the fake screen — keep as is:
function makeApp() {
  return {
    total: 1000,
    apply(code) {
      if (code === "SAVE10") this.total = 900;
    },
  };
}

// your page object below:
`,
  expectedOutput: ['total: 900', 'total: 1000'],
  mustUse: [
    { test: /class\s+CheckoutPage/, label: 'a class named CheckoutPage (5.6)' },
    { test: /constructor\s*\(/, label: 'a constructor storing the app' },
    { test: /this\./, label: 'state lives on this' },
    { test: /new\s+CheckoutPage\s*\(/, label: 'the spec instantiates with new' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']total: 900["']\s*\)/, label: 'no hard-coded totals — read them through the page object' },
  ],
  modelAnswer: `// the fake screen — keep as is:
function makeApp() {
  return {
    total: 1000,
    apply(code) {
      if (code === "SAVE10") this.total = 900;
    },
  };
}

// your page object below:
class CheckoutPage {
  constructor(app) {
    this.app = app;
  }
  applyCoupon(code) {
    this.app.apply(code);
  }
  readTotal() {
    return this.app.total;
  }
}

const checkout = new CheckoutPage(makeApp());
checkout.applyCoupon("SAVE10");
console.log("total: " + checkout.readTotal());

const second = new CheckoutPage(makeApp());
second.applyCoupon("BOGUS");
console.log("total: " + second.readTotal());`,
}

export const lesson119: LessonDef = {
  id: '11.9',
  hook: (
    <>
      <p>
        Your suite is growing — and twenty spec files now contain the same{' '}
        <code>getByLabel("Coupon")</code>. One UI rename away from twenty edits.{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          The Page Object Model: one class per screen — locators as properties, user verbs as
          methods — so page knowledge lives in exactly ONE place
        </HighlightMark>
        . 5.6’s classes finally meet their killer app.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-smell',
      caption:
        'The smell, concretely: twenty specs each build getByLabel("Coupon") and click the Apply button themselves. The knowledge “how the checkout screen works” is smeared across the whole suite — every spec knows the DOM personally.',
      highlightLines: [5],
    },
    {
      id: 'the-rename',
      caption:
        'Now the UI team renames the label (their right — 11.4 made your locators resilient to STYLING, but wording legitimately changes). Twenty files need the same edit. Miss one and it fails for a stale reason. This is 11.8’s copy-paste drift, at locator scale — and the cure has the same shape: one source of truth.',
      highlightLines: [5],
    },
    {
      id: 'one-class-per-screen',
      caption:
        'The Page Object Model: ONE CLASS per screen of the app — CheckoutPage, LoginPage, CartPage. 5.6 taught you classes as blueprints for objects with data and behavior; here the data is “where things are” and the behavior is “what users do here.” Employed at last.',
      highlightLines: [2],
    },
    {
      id: 'locators-as-properties',
      caption:
        'The constructor takes the page fixture (11.7) and builds each locator ONCE, as a named property: this.coupon, this.total. Cheap by design — 11.4 taught that a locator is a DESCRIPTION, not a lookup: holding twenty of them costs nothing until they’re used, and they re-resolve fresh at use anyway.',
      highlightLines: [3, 4, 5, 6],
    },
    {
      id: 'verbs-as-methods',
      caption:
        'User actions become METHODS, named by the USER’s verb: applyCoupon(code) — fill the field, click Apply, one intention. Not “fillCouponInputAndClickApplyButton”: the method name is what a user would SAY they did. The DOM choreography hides inside.',
      highlightLines: [11, 12, 13, 14],
    },
    {
      id: 'specs-shrink',
      caption:
        'Watch the spec transform: new CheckoutPage(page) → goto → applyCoupon("SAVE10") → expect(total). It reads as a USER STORY — intention-revealing, zero selectors in sight. A new teammate (or you, in six months) reads WHAT is tested without wading through HOW the screen is wired.',
      highlightLines: [19, 20, 21, 22],
    },
    {
      id: 'the-ripple',
      caption:
        'Replay the rename with the POM in place: the label changes → ONE edit, in ONE file (the CheckoutPage constructor) → all twenty specs heal instantly, because they import the page object (8.1’s module graph, doing DRY work — knowledge in one place means change costs one edit).',
      highlightLines: [5],
    },
    {
      id: 'dry-named',
      caption:
        'That principle has a name worth owning: DRY — Don’t Repeat Yourself. Not about typing less; about knowledge living in exactly ONE place so change is cheap and consistent. The POM is DRY applied to page knowledge. (You’ve met DRY before without the name — 3.1’s whole argument for functions.)',
      highlightLines: [2],
    },
    {
      id: 'assertions-stay-out',
      caption:
        'The discipline that keeps POMs clean: page objects DO and LOCATE — specs ASSERT. expect() stays in the test, because a failure should belong to a BEHAVIOR (10.3), not hide inside a helper. Exposing locators as properties (checkout.total) is exactly what makes that split workable.',
      highlightLines: [22],
    },
    {
      id: 'when-not',
      caption:
        'And the honest boundary, because POM can become ceremony: three specs against one page don’t need a class — inline locators are fine, structure can wait. POM earns at SCALE. Corollary for big apps: repeating widgets (header, product card) get their own component objects — composition, never a thousand-line god-page.',
      highlightLines: [2],
    },
  ],
  Viz: PomGraph,
  underTheHood: (
    <>
      <p>
        In TypeScript (8.5, and your scaffold’s choice) the class gets typed:{' '}
        <code>constructor(private readonly page: Page)</code>, properties as{' '}
        <code>readonly coupon: Locator</code>. The types buy the usual: autocomplete on every
        page object, and typos die at the desk.
      </p>
      <p>
        POMs pair beautifully with fixtures (11.7): define a{' '}
        <code>checkoutPage</code> fixture that builds <code>new CheckoutPage(page)</code>, and
        specs just declare <code>{'{ checkoutPage }'}</code> — injection all the way down. Most
        mature suites you’ll join wire POMs through fixtures exactly this way.
      </p>
      <p>
        Methods that navigate somewhere often return the NEXT page object (
        <code>login() {'{ …; return new DashboardPage(this.page) }'}</code>) — chaining screens
        the way users flow through them. Nice when natural; forced fluent-chaining everywhere is
        a bad habit. Judgment, as always.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'The Coupon label is renamed. With a POM, how many FILES do you edit?',
      accept: ['1', 'one', 'One', '1 file', 'one file'],
      placeholder: 'how many…',
      why: 'One — the page object. Every spec imports it, so the fix propagates through 8.1’s module graph. Without a POM: every spec that touched the label.',
    },
    {
      kind: 'type-output',
      question: 'Where do expect() assertions belong — in the page object’s methods, or in the spec?',
      accept: ['the spec', 'in the spec', 'spec', 'specs', 'the test', 'in the test'],
      placeholder: 'where…',
      why: 'In the spec — page objects DO and LOCATE; specs ASSERT. A failure should belong to a named behavior (10.3), not hide inside a shared helper. (House styles vary; this is the strong default.)',
    },
    {
      kind: 'type-output',
      question: 'Storing twenty locators as properties in a constructor — expensive or cheap, and why? (one word for the reason)',
      accept: ['cheap', 'cheap — descriptions', 'cheap, they are descriptions', 'cheap (descriptions)'],
      placeholder: 'expensive / cheap…',
      why: 'Cheap — a locator is a DESCRIPTION (11.4), not a DOM lookup. Nothing touches the page until an action or assertion uses it, and then it resolves fresh anyway.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you this.</Scene>
      <ChatBubble who="interviewer" face="🙂">Explain the Page Object Model.</ChatBubble>
      <ChatBubble who="you · after this lesson" face="😊" accent indent>
        Locator duplication is a maintenance bug. One class per screen makes page knowledge
        single-sourced, so a UI change costs one edit. Specs read as user stories. Assertions
        stay in specs.
      </ChatBubble>
      <Takeaway>
        Four sentences out-answer most candidates. <Key>Bonus: you can also say when NOT to use
        it.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={POM_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain the POM to a friend: the duplication problem, the class shape (what becomes a property, what becomes a method), what specs look like after, the one-edit-heals-all payoff (name the principle), and when POM is overkill.',
    modelAnswer:
      'As a suite grows, the same locators get copy-pasted into dozens of spec files — twenty files all building getByLabel("Coupon") themselves. When the UI legitimately renames that label, twenty files need the same edit, and missing one leaves a spec failing for a stale reason: copy-paste drift at locator scale. The Page Object Model cures it with one class per screen — classes from 5.6, finally employed. Locators become properties built once in the constructor, which is cheap because a locator is a description, not a lookup — it resolves fresh when used. User actions become methods named by the user’s verb — applyCoupon(code) hides the fill-and-click choreography behind an intention. Specs then shrink to user stories: new CheckoutPage, goto, applyCoupon, expect on the exposed total locator — intention-revealing, zero selectors. The payoff is the principle called DRY — don’t repeat yourself: knowledge lives in exactly one place, so the rename now costs ONE edit in ONE file and every spec importing the page object heals instantly through the module graph. The discipline: page objects do and locate, specs assert — failures should belong to named behaviors. And the honest boundary: three specs don’t need the ceremony; POM earns at scale, with repeating widgets getting small component objects instead of a god-page.',
  },
  recap: [
    'The target: locator duplication (copy-paste drift at suite scale). Cure: one CLASS per screen (5.6) — locators as constructor-built properties (cheap: descriptions, 11.4), user VERBS as methods.',
    'Specs become user stories (zero selectors); a UI rename costs ONE edit that heals every importing spec (8.1’s graph) — the principle is DRY: knowledge in exactly one place.',
    'Discipline: pages DO and LOCATE, specs ASSERT (failures belong to behaviors). POM earns at SCALE — skip the ceremony for three specs; compose component objects instead of god-pages.',
  ],
}
