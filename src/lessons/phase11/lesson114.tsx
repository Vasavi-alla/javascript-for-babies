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
 * 11.4 — Locators
 * A locator = a saved DESCRIPTION, re-resolved fresh at every use. CSS
 * works but is the developer's furniture (redesign kills it); user-facing
 * getByRole/Label/Text survive. Role = the accessibility tree (7.1 tags
 * mapped). Priority ladder, strict mode, chaining/filtering for lists.
 * The redesign-survival demo is the heart.
 */

const CODE = `// the same button, three ways:
page.locator("#btn-a4f2");           // dev furniture
page.locator(".btn.btn-primary");    // dev furniture
page.getByRole("button",
  { name: "Add to cart" });          // user-facing ✓

await page.getByLabel("Email").fill("ada@shop.com");
await page.getByPlaceholder("Search…").fill("mug");
await expect(page.getByText("Free shipping"))
  .toBeVisible();

// narrowing inside a list:
page.getByRole("listitem")
  .filter({ hasText: "Blue mug" })
  .getByRole("button", { name: "Add" });`

interface LocCard {
  label: string
  alive: boolean
}
interface View {
  mode: 'definition' | 'survival' | 'ladder' | 'strict' | 'chain'
  redesigned?: boolean
  cards?: LocCard[]
  ladderHot?: number | null
  console: string[]
  note: string
  badge?: string
}

const CARDS_V1: LocCard[] = [
  { label: '#btn-a4f2', alive: true },
  { label: '.btn.btn-primary', alive: true },
  { label: 'getByRole("button", { name: "Add to cart" })', alive: true },
]
const CARDS_V2: LocCard[] = [
  { label: '#btn-x9k1  (id regenerated)', alive: false },
  { label: '.button.cta-new  (classes renamed)', alive: false },
  { label: 'getByRole("button", { name: "Add to cart" })', alive: true },
]

const VIEWS: View[] = [
  {
    mode: 'definition', console: [],
    note: 'a locator is a saved DESCRIPTION of how to find something — not the element itself',
  },
  {
    mode: 'definition', console: [],
    note: 'it re-resolves FRESH at every use: today’s lookup, not a stale bookmark — 7.1’s live tree, respected',
    badge: 'this freshness is half of 11.6’s magic: a description can be retried; a grabbed element can only go stale',
  },
  {
    mode: 'survival', redesigned: false, cards: CARDS_V1, console: ['v1: all three find the button'],
    note: '7.2’s CSS selectors still work — on today’s page, all three locators find the button',
  },
  {
    mode: 'survival', redesigned: true, cards: CARDS_V2, console: ['v2: CSS dead · getByRole survives'],
    note: 'REDESIGN: ids regenerate, classes get renamed — the CSS locators die while the app works FINE',
  },
  {
    mode: 'survival', redesigned: true, cards: CARDS_V2, console: ['v2: CSS dead · getByRole survives'],
    note: 'why: ids and classes are the DEVELOPER’s furniture. The button’s ROLE and NAME are what the USER sees — redesigns rarely touch those',
    badge: 'a suite that dies on every restyle cries wolf — false alarms teach the team to ignore red (10.1’s trust, spent)',
  },
  {
    mode: 'definition', console: [],
    note: '“role” comes from accessibility: button, link, heading, textbox — 7.1’s tag vocabulary, mapped to MEANINGS',
    badge: 'screen readers navigate by this same tree — user-facing locators and accessible apps are the same discipline, two birds',
  },
  {
    mode: 'ladder', ladderHot: null, console: [],
    note: 'the getBy family: Role (with name) · Label (forms — 7.6) · Placeholder · Text · TestId — each a different user-visible handle',
  },
  {
    mode: 'ladder', ladderHot: 4, console: [],
    note: 'the ladder is a PRIORITY: role > label > text > testId > raw CSS — reach down a rung only when the one above can’t grip',
    badge: 'getByTestId is the honest escape hatch: data-testid="…" — 7.2’s tester hooks, for things with no user-visible handle',
  },
  {
    mode: 'strict', console: ['Error: strict mode violation — 2 elements match'],
    note: 'STRICT MODE: a locator matching TWO elements throws on action — ambiguity is an error, never a coin flip',
  },
  {
    mode: 'chain', console: [],
    note: 'lists: CHAIN to narrow scope — within the listitem containing “Blue mug”, find the Add button. Filter beats nth(3): order changes, content is meaning',
  },
  {
    mode: 'survival', redesigned: true, cards: CARDS_V2, console: [],
    note: 'the craft in one line: write locators for the USER’s eyes, and redesigns stop being your problem',
  },
]

const LADDER = ['getByRole("button", { name })', 'getByLabel("Email")', 'getByText("Free shipping")', 'getByTestId("cart-total")', 'locator(".css-fallback")']

function SelectorLabV2({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'definition' && (
        <g>
          <RoughRect x={50} y={60} width={160} height={70} seed={4301} strokeWidth={2.2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 8%, transparent)" fillStyle="solid" />
          <text x={130} y={90} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">the DESCRIPTION</text>
          <text x={130} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink-soft)">“button named Add to cart”</text>
          <text x={230} y={98} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">→ resolved fresh →</text>
          <RoughRect x={300} y={60} width={110} height={70} seed={4302} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={355} y={90} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink)">today’s page</text>
          <text x={355} y={110} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-marker-teal)">( Add to cart )</text>
        </g>
      )}

      {view.mode === 'survival' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            {view.redesigned ? 'the page after the redesign 🎨' : 'the page, version 1'}
          </text>
          <RoughRect x={280} y={40} width={140} height={54} seed={4310} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill={view.redesigned ? 'color-mix(in srgb, var(--color-marker-coral) 6%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={350} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">( Add to cart )</text>
          <text x={350} y={80} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8} fill="var(--color-ink-soft)">
            {view.redesigned ? 'same button, new skin' : 'the target'}
          </text>
          {(view.cards ?? []).map((card, i) => (
            <g key={card.label}>
              <RoughRect x={26} y={44 + i * 52} width={230} height={40} seed={4315 + i} strokeWidth={card.alive ? 2 : 1.6} stroke={card.alive ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} roughness={card.alive ? 1.3 : 2.4} fill={`color-mix(in srgb, ${card.alive ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 7%, transparent)`} fillStyle="solid" />
              <text x={40} y={62 + i * 52} fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)" style={card.alive ? undefined : { textDecoration: 'line-through' }}>
                {card.label}
              </text>
              <text x={40} y={77 + i * 52} fontFamily="var(--font-hand)" fontSize={9} fontWeight={700} fill={card.alive ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
                {card.alive ? 'finds it ✓' : 'no match ✗'}
              </text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'ladder' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the priority ladder — top rung first
          </text>
          {LADDER.map((rung, i) => {
            const hot = view.ladderHot === i
            return (
              <g key={rung} opacity={view.ladderHot !== null && !hot ? 0.4 : 1}>
                <RoughRect x={50 + i * 12} y={40 + i * 38} width={330 - i * 24} height={32} seed={4330 + i} strokeWidth={hot ? 2.4 : 1.6} stroke={i === 4 ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} fill={`color-mix(in srgb, ${i === 4 ? 'var(--color-marker-coral)' : 'var(--color-marker-teal)'} ${8 - i}%, transparent)`} fillStyle="solid" />
                <text x={66 + i * 12} y={60 + i * 38} fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{i + 1}. {rung}</text>
              </g>
            )
          })}
        </g>
      )}

      {view.mode === 'strict' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            strict mode: ambiguity is an ERROR
          </text>
          {[0, 1].map((i) => (
            <g key={i}>
              <RoughRect x={80 + i * 160} y={60} width={120} height={44} seed={4340 + i} strokeWidth={2.2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
              <text x={140 + i * 160} y={87} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">( Add )</text>
            </g>
          ))}
          <text x={220} y={140} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-marker-coral)">getByRole("button", {'{ name: "Add" }'}) → matched 2 ✗</text>
          <text x={220} y={168} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            better a loud error than clicking the WRONG one silently
          </text>
        </g>
      )}

      {view.mode === 'chain' && (
        <g>
          <text x={24} y={28} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            chaining: narrow the world, then act
          </text>
          {['Red mug — ( Add )', 'Blue mug — ( Add )', 'Green mug — ( Add )'].map((item, i) => {
            const target = i === 1
            return (
              <g key={item}>
                <RoughRect x={60} y={44 + i * 48} width={320} height={40} seed={4350 + i} strokeWidth={target ? 2.6 : 1.4} stroke={target ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={target ? 'color-mix(in srgb, var(--color-marker-teal) 10%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={80} y={68 + i * 48} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{item}</text>
                {target && <text x={344} y={68 + i * 48} fontFamily="var(--font-hand)" fontSize={9} fontWeight={700} fill="var(--color-marker-teal)">← filter({'{hasText}'})</text>}
              </g>
            )
          })}
        </g>
      )}

      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={4360} color="var(--color-pencil-blue)" />
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

const LOCATOR_EXERCISE: CodeExerciseDef = {
  id: 'l114-redesign-survival',
  title: 'the redesign survival test',
  task: 'Model both locator strategies against two versions of the same page — before and after a redesign — and let the numbers show which strategy survives.',
  steps: [
    <>
      Model the pages: <code>v1</code> is an array with one element{' '}
      <code>{'{ role: "button", name: "Add to cart", cls: "btn-primary" }'}</code>;{' '}
      <code>v2</code> is the SAME button after a redesign — same role and name, but{' '}
      <code>cls</code> is now <code>"cta-new"</code>.
    </>,
    <>
      Write <code>byClass(els, cls)</code> and <code>byRole(els, role, name)</code> — each
      filters and returns how MANY match (4.9 + length).
    </>,
    <>
      Print four labeled counts: <code>v1 byClass: 1</code>, <code>v1 byRole: 1</code>,{' '}
      <code>v2 byClass: 0</code>, <code>v2 byRole: 1</code> — then the verdict line{' '}
      <code>survivor: getByRole</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['v1 byClass: 1', 'v1 byRole: 1', 'v2 byClass: 0', 'v2 byRole: 1', 'survivor: getByRole'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'matching is a filter' },
    { test: /function\s+byClass|const\s+byClass\s*=/, label: 'a function named byClass' },
    { test: /function\s+byRole|const\s+byRole\s*=/, label: 'a function named byRole' },
    { test: /&&/, label: 'byRole checks role AND name' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']v2 byClass: 0/, label: 'no hard-coded counts — the filters must compute them' },
  ],
  modelAnswer: `const v1 = [{ role: "button", name: "Add to cart", cls: "btn-primary" }];
const v2 = [{ role: "button", name: "Add to cart", cls: "cta-new" }];

function byClass(els, cls) {
  return els.filter((el) => el.cls === cls).length;
}

function byRole(els, role, name) {
  return els.filter((el) => el.role === role && el.name === name).length;
}

console.log("v1 byClass: " + byClass(v1, "btn-primary"));
console.log("v1 byRole: " + byRole(v1, "button", "Add to cart"));
console.log("v2 byClass: " + byClass(v2, "btn-primary"));
console.log("v2 byRole: " + byRole(v2, "button", "Add to cart"));
console.log("survivor: getByRole");`,
}

export const lesson114: LessonDef = {
  id: '11.4',
  hook: (
    <>
      <p>
        7.2 called selectors “THE locator skill of the job” — today the job’s actual tool arrives,
        with an upgrade in philosophy:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          find elements the way a USER finds them — by role and visible name — and redesigns stop
          killing your suite
        </HighlightMark>
        .
      </p>
      <p>
        You’ll watch the same page get restyled and see exactly which locators survive. This
        single lesson prevents more future misery than any other in the phase.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'what-a-locator-is',
      caption:
        'First, precision: a locator is a saved DESCRIPTION of how to find element(s) — “the button named Add to cart” — not the element itself. Creating one touches nothing and can’t fail; it’s a note, not a lookup.',
      highlightLines: [2, 3, 4, 5],
    },
    {
      id: 'fresh-every-time',
      caption:
        'Because it’s a description, it RE-RESOLVES fresh at every use: each click, each assertion runs today’s lookup against the live tree (7.1), never a stale bookmark. Hold this — it’s half the machinery of 11.6’s auto-waiting: descriptions can be retried; a grabbed element can only go stale.',
      highlightLines: [4, 5],
    },
    {
      id: 'css-works',
      caption:
        'Your 7.2 skills still work: page.locator("#btn-a4f2") and .btn.btn-primary both find the button on today’s page. Nothing you learned is wasted — but watch what happens to these two next step.',
      highlightLines: [2, 3],
    },
    {
      id: 'the-redesign',
      caption:
        'THE REDESIGN: the team restyles the shop. The generated id becomes #btn-x9k1; btn-primary becomes cta-new. The app works PERFECTLY — same button, new skin — and both CSS locators are dead. Your suite turns red over nothing.',
      highlightLines: [2, 3],
    },
    {
      id: 'why-user-facing',
      caption:
        'The diagnosis: ids and classes are the DEVELOPER’s furniture — free to change any sprint. What survived: getByRole("button", { name: "Add to cart" }) — because the button’s role and visible name are what the USER sees, and redesigns almost never change what things ARE. False alarms spend 10.1’s trust; user-facing locators don’t raise them.',
      highlightLines: [4, 5],
    },
    {
      id: 'role-is-a11y',
      caption:
        'Where “role” comes from: the accessibility tree. Browsers map 7.1’s tags to MEANINGS — button, link, heading, textbox, listitem — the same tree screen readers navigate. Two birds, permanently: locators written by role both survive redesigns AND quietly audit that your app is accessible.',
      highlightLines: [4],
    },
    {
      id: 'getby-family',
      caption:
        'The family beyond role: getByLabel("Email") — form fields by their label (7.6’s pairing, paying off); getByPlaceholder for the hint text; getByText for visible words; getByTestId — the escape hatch: data-testid attributes, 7.2’s tester hooks, for things with no user-visible handle.',
      highlightLines: [7, 8, 9, 10],
    },
    {
      id: 'the-ladder',
      caption:
        'The family is a LADDER, not a menu: role first, then label, then text, then testId, then raw CSS last. Reach down a rung only when the rung above genuinely can’t grip. A suite’s health is visible in its locator mix — mostly-role reads like the user; mostly-CSS reads like a time bomb.',
      highlightLines: [2, 4, 7, 10],
    },
    {
      id: 'strict-mode',
      caption:
        'A safety rail you’ll hit in week one: STRICT MODE. If a locator matches TWO elements, acting on it throws — “strict mode violation” — instead of picking one at random. Read the error as a gift: ambiguity was going to bite someone; better a loud error now than clicking the wrong Add silently.',
      highlightLines: [4, 5],
    },
    {
      id: 'chaining',
      caption:
        'Which brings us to lists: three products, three Add buttons — name alone is ambiguous. CHAIN to narrow the world first: getByRole("listitem").filter({ hasText: "Blue mug" }).getByRole("button", { name: "Add" }) — within THAT item, THE button. Filter by content beats .nth(1): order changes; meaning doesn’t.',
      highlightLines: [12, 13, 14, 15],
    },
    {
      id: 'the-craft',
      caption:
        'The craft, one line: write locators for the USER’s eyes. Everything else in this lesson — the ladder, strictness, chaining — is that sentence, operationalized. Do this and the redesign that killed the CSS suite is, for you, a quiet tuesday.',
      highlightLines: [4, 5],
    },
  ],
  Viz: SelectorLabV2,
  underTheHood: (
    <>
      <p>
        The “name” in <code>getByRole("button", {'{ name }'})</code> is the{' '}
        <strong>accessible name</strong> — computed from visible text, or a label, or an{' '}
        <code>aria-label</code> attribute. It matches case-insensitively, tolerates surrounding
        whitespace, and accepts a regex (<code>name: /add to cart/i</code>) when text varies.
      </p>
      <p>
        Where do you LEARN an element’s role without memorizing tables? Two tools: the trace/UI
        mode’s locator picker (11.14) writes the best locator for whatever you click —
        and <code>npx playwright codegen URL</code> records your clicks as locator code. Use them
        as teachers, then edit with the ladder in mind.
      </p>
      <p>
        Locators compose beyond filter: <code>.first()</code>, <code>.last()</code>,{' '}
        <code>.nth(i)</code> exist (use sparingly — position is the weakest meaning), and{' '}
        <code>page.getByRole(...).or(page.getByText(...))</code> tries alternatives. And{' '}
        <code>getByText</code> matches substrings by default — <code>exact: true</code> when
        “Log” must not match “Logout”.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A redesign renames every CSS class but changes no text or behavior. Which locator still finds the button: .btn-primary or getByRole("button", { name: "Add to cart" })?',
      accept: ['getByRole', 'getByRole("button", { name: "Add to cart" })', 'the getByRole one', 'get by role', 'the role one'],
      placeholder: 'which locator…',
      why: 'getByRole — role and visible name are the user’s view, and redesigns rarely change what things ARE. Classes are developer furniture, freely renamed any sprint.',
    },
    {
      kind: 'type-output',
      question: 'Your locator matches TWO buttons and you call .click(). What does Playwright do — click the first, or throw an error?',
      accept: ['throw', 'throws', 'throw an error', 'error', 'it throws', 'strict mode violation', 'throws an error'],
      placeholder: 'click / throw…',
      why: 'It throws — strict mode. Ambiguity is an error, never a coin flip: better a loud failure than silently clicking the wrong element and passing.',
    },
    {
      kind: 'type-output',
      question: 'Three product rows each have an "Add" button. You want Blue mug’s. What do you narrow by first — position (nth) or content (filter hasText)?',
      accept: ['content', 'filter', 'hasText', 'filter hasText', 'content (filter)', 'by content', 'filter by content'],
      placeholder: 'position / content…',
      why: 'Content — filter({ hasText: "Blue mug" }) then find the button within. Order changes when sorting or data changes; content IS the meaning you care about.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, you will inherit a suite full of CSS selectors.</Scene>
      <ChatBubble who="you · six months in" face="🙂">
        Every locator I touch, I promote one rung up the ladder.
      </ChatBubble>
      <ChatBubble who="teammate" face="😊" accent indent>
        Selector maintenance used to be a weekly chore. Now it is a rarity.
      </ChatBubble>
      <Takeaway>
        <Key>A boring suite is the highest compliment a suite can earn.</Key> Migrate
        gradually, rung by rung.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={LOCATOR_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what a locator actually is (description vs element, and why freshness matters), the redesign story that justifies user-facing locators, where “role” comes from, and the priority ladder.',
    modelAnswer:
      'A locator is a saved description of how to find something — “the button named Add to cart” — not the element itself. That distinction matters because a description re-resolves fresh at every use: each click and each assertion runs today’s lookup against the live DOM, so it can be retried patiently (that’s half of auto-waiting), while a grabbed element could only go stale. CSS selectors from the DOM phase still work, but ids and classes are the developer’s furniture: a redesign regenerates #btn-a4f2 and renames btn-primary, the app works perfectly, and the CSS locators die — the suite turns red over nothing, spending the team’s trust on false alarms. getByRole("button", { name: "Add to cart" }) survives because role and visible name are what the USER sees, and redesigns rarely change what things are. “Role” comes from the accessibility tree — the browser maps tags to meanings like button, link, and textbox, the same tree screen readers navigate — so user-facing locators also quietly audit accessibility. The family is a priority ladder: role first, then label (forms), then text, then data-testid as the honest escape hatch, then raw CSS last, reaching down only when the rung above can’t grip. Strict mode makes ambiguity an error instead of a coin flip, and for lists you chain: filter the row by its content, then find the button inside it — content over position, because order changes and meaning doesn’t.',
  },
  recap: [
    'A locator = a saved DESCRIPTION, re-resolved fresh at every use (never a stale element) — the freshness that makes 11.6’s retrying possible.',
    'The redesign test: CSS (developer furniture) dies on restyles; getByRole(name) survives — role/name come from the accessibility tree (7.1’s tags, mapped), so good locators = accessible app.',
    'Ladder: role > label > text > testId > CSS (reach down reluctantly). Strict mode: 2 matches = loud error. Lists: chain + filter({ hasText }) — content beats position.',
  ],
}
