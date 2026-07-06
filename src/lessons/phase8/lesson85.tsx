import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 8.5 — A taste of TypeScript
 * Types as labels checked BEFORE running (the 1.1 pens, declared); the
 * checker rejects wrong-type calls at the desk; compiling ERASES types;
 * interfaces = named object shapes; editor autocomplete; why Playwright
 * projects are TS. Generics are FLAGGED only — preview, not homework.
 */

const CODE = `function withTax(price: number): number {
  return price * 1.25;
}

withTax(100);     // ✓
withTax("100");   // ✗ caught BEFORE running

interface User {
  name: string;
  age: number;
}

const u: User = { name: "Ada", age: 36 };`

interface View {
  mode: 'gate' | 'erase' | 'shape' | 'editor'
  gateHot?: boolean
  returnHot?: boolean
  chip?: { label: string; ok: boolean } | null
  stamp?: boolean
  shapeOk?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'gate', console: [],
    note: 'JavaScript discovers type mistakes only AT RUN TIME — 1.9 was an entire lesson of those surprises',
  },
  {
    mode: 'gate', gateHot: true, console: [],
    note: 'price: number — the pen from 1.1, declared right on the label',
  },
  {
    mode: 'gate', returnHot: true, console: [],
    note: '): number — the chute’s shape is declared too: this machine returns a number',
  },
  {
    mode: 'gate', chip: { label: '"100"', ok: false }, console: [],
    note: 'the CHECKER reads the file BEFORE it runs: "100" bounces at the gate — at your desk, not in production',
    badge: '“Argument of type ‘string’ is not assignable to parameter of type ‘number’” — your first TS error, decoded',
  },
  {
    mode: 'erase', console: [],
    note: 'compiling STRIPS the labels: what actually runs is plain JavaScript — types never exist at runtime',
  },
  {
    mode: 'shape', shapeOk: true, console: [],
    note: 'an interface names a SHAPE: u must carry name (string) and age (number) — a written contract for 4.x objects',
  },
  {
    mode: 'editor', console: [],
    note: 'the everyday superpower: your editor now KNOWS every shape — autocomplete that can’t go stale, typos underlined instantly',
  },
  {
    mode: 'gate', chip: { label: '100', ok: true }, console: ['125'],
    note: 'why testers care: Playwright projects are TypeScript by default — page. autocompletes every action',
    badge: 'playwright.config.ts — that .ts extension is exactly this lesson',
  },
  {
    mode: 'erase', stamp: true, console: ['125'],
    note: 'don’t fear it: every line of JavaScript you know IS valid TypeScript — types are opt-in labels on top',
  },
  {
    mode: 'shape', shapeOk: true, console: ['125'],
    note: 'your working set: annotations, interfaces, reading checker errors — that’s the job’s daily dose',
    badge: 'generics like Array<T> exist and can wait — a preview, not homework. You’ll read Phase 11’s TS natively.',
  },
]

function TypeGate({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'gate' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the function machine — now with a checked gate
          </text>
          <RoughRect x={130} y={64} width={180} height={110} seed={1701} strokeWidth={2.4} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={106} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">withTax</text>
          <text x={220} y={128} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink-soft)">price * 1.25</text>
          {/* the gate */}
          <RoughRect x={64} y={96} width={64} height={46} seed={1702} strokeWidth={view.gateHot ? 2.8 : 2} stroke={view.gateHot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={view.gateHot ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={96} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill={view.gateHot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>gate:</text>
          <text x={96} y={132} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">number</text>
          {/* the chute */}
          <RoughRect x={312} y={96} width={64} height={46} seed={1703} strokeWidth={view.returnHot ? 2.8 : 2} stroke={view.returnHot ? 'var(--color-marker-teal)' : 'var(--color-ink)'} fill={view.returnHot ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={344} y={116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill={view.returnHot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>chute:</text>
          <text x={344} y={132} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">number</text>

          <AnimatePresence mode="wait">
            {view.chip && (
              <motion.g key={view.chip.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 16 }}>
                <RoughRect x={20} y={186} width={84} height={34} seed={1710} strokeWidth={2.2} stroke={view.chip.ok ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.chip.ok ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 12%, transparent)`} fillStyle="solid" />
                <text x={62} y={208} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fill="var(--color-ink)">{view.chip.label}</text>
                <text x={128} y={208} fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill={view.chip.ok ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
                  {view.chip.ok ? '→ passes the gate ✓' : '→ BOUNCES at the gate ✗'}
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      )}

      {view.mode === 'erase' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            compile = check, then strip the labels
          </text>
          <RoughRect x={24} y={48} width={180} height={120} seed={1720} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={114} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">what you write (.ts)</text>
          <text x={38} y={94} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">function withTax(</text>
          <text x={48} y={110} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-marker-coral)">price: number</text>
          <text x={38} y={126} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">)<tspan fill="var(--color-marker-coral)">: number</tspan> {'{'}</text>
          <text x={48} y={142} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">return price * 1.25;</text>
          <text x={38} y={158} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">{'}'}</text>

          <HandArrow from={{ x: 208, y: 108 }} to={{ x: 232, y: 108 }} curve={0} seed={1725} stroke="var(--color-marker-teal)" strokeWidth={2} />

          <RoughRect x={236} y={48} width={180} height={120} seed={1721} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={326} y={68} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">what runs (.js)</text>
          <text x={250} y={94} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">function withTax(</text>
          <text x={260} y={110} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">price</text>
          <text x={250} y={126} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">) {'{'}</text>
          <text x={260} y={142} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">return price * 1.25;</text>
          <text x={250} y={158} fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">{'}'}</text>

          {view.stamp && (
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 14 }}>
              <RoughRect x={110} y={182} width={220} height={30} seed={1726} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
              <text x={220} y={202} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-marker-teal)">
                every JS line you know is already TS ✓
              </text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'shape' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            an interface = a named shape, checked
          </text>
          <RoughRect x={40} y={48} width={160} height={110} seed={1730} strokeWidth={2.2} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 6%, transparent)" fillStyle="solid" />
          <text x={120} y={70} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">interface User</text>
          <text x={56} y={96} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">name: string</text>
          <text x={56} y={118} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">age: number</text>
          <text x={120} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">the contract</text>

          <text x={220} y={106} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={16} fill="var(--color-ink-soft)">⇄</text>

          <RoughRect x={244} y={48} width={160} height={110} seed={1731} strokeWidth={2.2} stroke={view.shapeOk ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={324} y={70} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">const u = {'{'}</text>
          <text x={260} y={96} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">name: "Ada"</text>
          <text x={260} y={118} fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink)">age: 36</text>
          <text x={324} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill={view.shapeOk ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'}>
            {view.shapeOk ? 'fits the contract ✓' : 'breaks the contract ✗'}
          </text>
        </g>
      )}

      {view.mode === 'editor' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            inside your editor, from now on
          </text>
          <RoughRect x={40} y={48} width={360} height={64} seed={1740} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={56} y={84} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">u.</text>
          <RoughRect x={80} y={62} width={120} height={40} seed={1741} strokeWidth={1.6} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
          <text x={92} y={79} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">name  (string)</text>
          <text x={92} y={95} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">age   (number)</text>
          <text x={240} y={84} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-marker-teal)">← it KNOWS the shape</text>

          <RoughRect x={40} y={132} width={360} height={48} seed={1742} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={56} y={160} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">u.nmae</text>
          <path d="M 56 166 q 6 5 12 0 q 6 -5 12 0 q 6 5 12 0 q 6 -5 12 0" stroke="var(--color-marker-coral)" strokeWidth={1.6} fill="none" />
          <text x={140} y={160} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-marker-coral)">typo underlined the instant you type it</text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={1750} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={312} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const CHECKER_EXERCISE: CodeExerciseDef = {
  id: 'l85-mini-checker',
  title: 'build the type checker',
  task: 'The sandbox speaks plain JavaScript, so build the essence of TypeScript yourself: a gate that inspects a value’s type BEFORE the real work is allowed to happen.',
  steps: [
    <>
      Write <code>typeOk(value)</code>: returns <code>true</code> exactly when the value’s type is{' '}
      <code>"number"</code> — one operator from 1.1 tells you a value’s type.
    </>,
    <>
      Write <code>withTaxChecked(price)</code>: if <code>typeOk(price)</code> fails, RETURN the
      string <code>"type error: not a number"</code>; otherwise return <code>price * 1.25</code>.
    </>,
    <>
      Print <code>withTaxChecked(100)</code>, then <code>withTaxChecked("100")</code> — one honest
      answer, one caught mistake.
    </>,
  ],
  starter: '',
  expectedOutput: ['125', 'type error: not a number'],
  mustUse: [
    { test: /typeof/, label: 'the gate reads the type with typeof' },
    { test: /function\s+typeOk\s*\(|const\s+typeOk\s*=/, label: 'a function named typeOk' },
    { test: /function\s+withTaxChecked\s*\(|const\s+withTaxChecked\s*=/, label: 'a function named withTaxChecked' },
    { test: /typeOk\s*\(/, label: 'withTaxChecked must consult typeOk' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*125\s*\)|console\.log\s*\(\s*["']125["']\s*\)/, label: 'no hard-coded 125 — the machine computes it' },
  ],
  modelAnswer: `function typeOk(value) {
  return typeof value === "number";
}

function withTaxChecked(price) {
  if (!typeOk(price)) {
    return "type error: not a number";
  }
  return price * 1.25;
}

console.log(withTaxChecked(100));
console.log(withTaxChecked("100"));`,
}

export const lesson85: LessonDef = {
  id: '8.5',
  hook: (
    <>
      <p>
        Every type disaster you’ve met — <code>"5" - 5</code> coercion (1.9), reading properties
        off undefined (8.4) — shares one trait: JavaScript only notices <em>while running</em>,
        sometimes in front of a user. TypeScript’s bet:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          declare each value’s type as a label, and let a checker verify the whole file BEFORE it
          ever runs
        </HighlightMark>
        .
      </p>
      <p>
        This is a taste, not a course — but a necessary taste: Playwright projects are TypeScript
        by default, so the job you’re training for reads it every day.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'js-fails-late',
      caption:
        'Start with the pain: JavaScript discovers type mistakes at RUN TIME. "5" - 5 silently coerces (1.9); user.cat.name explodes mid-run (8.4). If the wrong value only arrives on the 97th test run, that’s when you find out. What if mistakes surfaced while WRITING?',
      highlightLines: [6],
    },
    {
      id: 'ts-idea',
      caption:
        'TypeScript = JavaScript + type labels. Line 1: price: number reads “price must be a number.” Remember 1.1 — every value lives in a typed pen? TypeScript lets you declare the pen right on the label, in writing.',
      highlightLines: [1],
    },
    {
      id: 'return-type',
      caption:
        'After the parameter list: ): number — “and this machine RETURNS a number.” Gate and chute (3.3) both declared. A reader — human or tool — now knows this function’s complete contract without reading its body.',
      highlightLines: [1, 2],
    },
    {
      id: 'the-checker',
      caption:
        'Now the payoff. TypeScript ships a CHECKER that reads your file before anything runs. Line 5 passes. Line 6 — withTax("100") — is rejected on the spot: a string bounced off the number gate. The bug dies at your desk, as a red squiggle, not in production at 2am.',
      highlightLines: [5, 6],
    },
    {
      id: 'types-are-erased',
      caption:
        'Then the twist that makes TS approachable: compiling STRIPS every annotation. The .ts file is checked, then translated into plain JavaScript — the exact language you’ve spent eight phases learning. Types never exist at runtime; they’re scaffolding, removed before the building opens.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'interface',
      caption:
        'For objects, shapes get NAMES: interface User says any User carries name (a string) and age (a number). Line 13 promises u fits — leave out age, or send a string where a number belongs, and the checker refuses the file. Your 4.x objects, now under written contract.',
      highlightLines: [8, 9, 10, 11, 13],
    },
    {
      id: 'autocomplete',
      caption:
        'The everyday superpower isn’t even error-catching — it’s that your EDITOR now knows every shape. Type u. and it lists name and age with their types; typo u.nmae and it’s underlined the instant you type it. Documentation that cannot go stale, living in the keystrokes.',
      highlightLines: [13],
    },
    {
      id: 'playwright-why',
      caption:
        'Why this matters to YOU specifically: Playwright projects are TypeScript by default — the config file is literally playwright.config.ts. Type page. in a test and every action autocompletes; test data gets interfaces. You will READ TypeScript daily, even on days you barely write it.',
      highlightLines: [1],
    },
    {
      id: 'still-javascript',
      caption:
        'And the fear-killer: TypeScript is not a different language. Every line of JavaScript you have learned is ALREADY valid TypeScript — types are opt-in labels layered on top. You currently speak about 95% of TS; today added most of the rest.',
      highlightLines: [2],
    },
    {
      id: 'working-set',
      caption:
        'How deep does a test engineer go? Annotations, interfaces, and reading checker errors — that’s the daily working set, and you now hold all three. Fancier machinery (generics like Array<T>, unions, utility types) exists and can wait: a preview, not homework.',
      highlightLines: [8, 13],
    },
  ],
  Viz: TypeGate,
  underTheHood: (
    <>
      <p>
        The checker is a program called <code>tsc</code> (the TypeScript compiler), and it’s
        usually wired into an npm script (8.2!) plus your editor. Files end in <code>.ts</code> —
        the same code, one letter of extension, a whole safety net.
      </p>
      <p>
        You annotate less than you’d think: TypeScript <strong>infers</strong>. Write{' '}
        <code>const x = 5</code> and x is already known to be a number — no label needed.
        Professionals annotate the <em>boundaries</em> (function parameters, returns, API shapes)
        and let inference handle the middle.
      </p>
      <p>
        There’s an escape door: the type <code>any</code> turns checking off for a value. It
        exists for migrations and emergencies. Every <code>any</code> is a hole in the net, and
        teams work to remove them.
      </p>
      <p>
        One honest boundary: the checker verifies your <em>source code’s</em> promises. It
        cannot check data arriving at runtime from the outside world — an API response is
        whatever the server sent. That’s why tests still matter in typed projects: types catch
        the mistakes you write, tests catch the behavior you ship. You need both — and you’re
        training for the second.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'TypeScript rejects withTax("100"). Does it catch this before the program runs, or while it runs?',
      accept: ['before', 'before running', 'Before', 'before the program runs', 'before it runs'],
      placeholder: 'before / while…',
      why: 'Before — the checker reads the whole file at your desk and rejects wrong-type calls as red squiggles, long before any user is involved.',
    },
    {
      kind: 'type-output',
      question: 'After compiling to JavaScript, do the type annotations still exist in the running code? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — compiling checks, then STRIPS every annotation. What runs is plain JavaScript; types are scaffolding, removed before the building opens.',
    },
    {
      kind: 'type-output',
      question: 'interface User requires name: string and age: number. Does { name: "Mo" } satisfy it? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — age is missing, so the object breaks the contract and the checker refuses the assignment at compile time.',
    },
  ],
  PlayExtra: () => <CodeExercise def={CHECKER_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain TypeScript to a friend in three beats: what a type annotation is, when the checking happens (and what happens to the types afterward), and why Playwright projects choose TS.',
    modelAnswer:
      'TypeScript is JavaScript plus type labels. An annotation like price: number declares which pen a value must come from — the same typed-pens idea as day one, now written down and enforceable. The checking happens BEFORE the program runs: a checker (tsc, also live inside the editor) reads the whole file and rejects contract violations — call withTax("100") and a string bounces off the number gate as a red squiggle at your desk, instead of a runtime surprise in front of a user. Then compiling strips every annotation: what actually runs is plain JavaScript, so types never exist at runtime — they’re scaffolding, removed before the building opens, which also means every line of JS you know is already valid TypeScript. Interfaces extend the idea to object shapes: interface User { name: string; age: number } is a named contract objects must fit. Playwright projects default to TS because test code benefits doubly: the editor autocompletes every page action and locator, typos die instantly, and test data carries declared shapes — fewer silly failures, faster writing. Types catch the mistakes you write; tests catch the behavior you ship.',
  },
  recap: [
    'TypeScript = JS + type labels: price: number declares the pen (1.1) on the label; interfaces name whole object shapes. Annotate boundaries; inference fills the middle.',
    'Checking happens BEFORE running (tsc + your editor) — wrong-type calls bounce at your desk. Compiling then ERASES all types: what runs is plain JavaScript.',
    'Playwright projects are TS by default (playwright.config.ts): autocomplete on every page action, instant typo-catching. Types catch written mistakes; tests catch shipped behavior — you need both.',
  ],
}
