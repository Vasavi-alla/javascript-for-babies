import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ReviewCard } from '../../design/JobScene'

/**
 * 8.1 — Modules: import & export
 * One file = one module = one sealed scope. export opens a door, import
 * borrows by name, and the arrows between files form the dependency graph.
 * Imports are static (resolved before any line runs). Node's two module
 * systems are FLAGGED only (9.3 teaches them) — preview, not homework.
 */

const CODE = `// ---- math.js ----------------
export const TAX = 0.25;

export function withTax(price) {
  return price * (1 + TAX);
}

const secret = "internal only";

// ---- cart.js ----------------
import { withTax } from "./math.js";

console.log(withTax(100));`

const DEFAULT_CODE = `// ---- math.js ----------------
// ONE main thing? mark it default:
export default function withTax(price) {
  return price * 1.25;
}

// ---- cart.js ----------------
// no braces — and YOU pick the name:
import calc from "./math.js";

console.log(calc(100));`

interface Row {
  label: string
  kind: 'exported' | 'private' | 'import'
  hot?: boolean
}
interface View {
  mode: 'mess' | 'cards' | 'graph'
  mathRows?: Row[]
  cartRows?: Row[]
  /** the travelling function value, drawn mid-arrow */
  chip?: boolean
  arrow?: boolean
  console: string[]
  note: string
  badge?: string
}

const MATH_BASE: Row[] = [
  { label: 'TAX = 0.25', kind: 'exported' },
  { label: 'ƒ withTax', kind: 'exported' },
  { label: '🔒 secret', kind: 'private' },
]
const CART_BASE: Row[] = [{ label: 'import { withTax }', kind: 'import' }]

const VIEWS: View[] = [
  {
    mode: 'mess', console: [],
    note: 'one giant file = a junk drawer — every name can see every other name',
  },
  {
    mode: 'cards', mathRows: MATH_BASE, cartRows: CART_BASE, console: [],
    note: 'one FILE = one MODULE: two files, two cards, two separate worlds',
  },
  {
    mode: 'cards', mathRows: MATH_BASE.map((r) => (r.kind === 'private' ? { ...r, hot: true } : r)), cartRows: CART_BASE, console: [],
    note: 'each module is a sealed scope: secret belongs to math.js ALONE',
  },
  {
    mode: 'cards', mathRows: MATH_BASE.map((r) => (r.kind === 'exported' ? { ...r, hot: true } : r)), cartRows: CART_BASE, console: [],
    note: 'export marks the doors: TAX and withTax may leave — secret has no door',
  },
  {
    mode: 'cards', mathRows: MATH_BASE, cartRows: CART_BASE.map((r) => ({ ...r, hot: true })), arrow: true, console: [],
    note: 'import { withTax } borrows by NAME — spelled exactly like the export',
  },
  {
    mode: 'cards', mathRows: MATH_BASE, cartRows: CART_BASE, arrow: true, chip: true, console: ['125'],
    note: 'the function VALUE (3.4!) is now usable in cart.js: withTax(100) → 125',
  },
  {
    mode: 'graph', console: ['125'],
    note: 'zoom out: files + arrows = the DEPENDENCY GRAPH. An arrow means “I need you”',
  },
  {
    mode: 'graph', console: ['125'],
    note: 'imports are STATIC — the engine reads the whole graph BEFORE running line 1',
    badge: 'that’s why import lives at the top of the file and can never hide inside an if',
  },
  {
    mode: 'cards', mathRows: [{ label: 'ƒ withTax (default)', kind: 'exported', hot: true }], cartRows: [{ label: 'import calc', kind: 'import', hot: true }], arrow: true, console: ['125'],
    note: 'export default = “the ONE main thing here” — imported without braces, any name',
  },
  {
    mode: 'cards', mathRows: MATH_BASE, cartRows: CART_BASE, arrow: true, console: ['125'],
    note: 'habitat check: browsers load modules via <script type="module">',
    badge: 'Node has TWO module systems (require vs import) — 9.3 untangles them. A preview, not homework.',
  },
]

function ModuleGraph({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'mess' && (
        <g>
          <RoughRect x={90} y={40} width={260} height={170} seed={1301} strokeWidth={2.2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
          <text x={220} y={66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-ink)">
            app.js — 4,000 lines 😵
          </text>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line key={i} x1={110} y1={84 + i * 17} x2={110 + 180 - (i % 3) * 40} y2={84 + i * 17} stroke="var(--color-ink-soft)" strokeWidth={2} opacity={0.5} strokeLinecap="round" />
          ))}
          <text x={220} y={232} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            everything sees everything — nothing is private
          </text>
        </g>
      )}

      {view.mode === 'cards' && (
        <g>
          {/* math.js card */}
          <RoughRect x={26} y={40} width={172} height={150} seed={1305} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={112} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">math.js</text>
          {(view.mathRows ?? []).map((row, i) => {
            const color = row.kind === 'exported' ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'
            return (
              <g key={row.label}>
                <RoughRect x={40} y={74 + i * 36} width={144} height={28} seed={1310 + i} strokeWidth={row.hot ? 2.4 : 1.4} stroke={color} fill={row.hot ? `color-mix(in srgb, ${color} 12%, transparent)` : 'transparent'} fillStyle="solid" />
                <text x={112} y={92 + i * 36} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{row.label}</text>
                {row.kind === 'exported' && (
                  <text x={188} y={92 + i * 36} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-marker-teal)">⇢</text>
                )}
              </g>
            )
          })}

          {/* cart.js card */}
          <RoughRect x={242} y={40} width={172} height={150} seed={1306} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={328} y={62} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">cart.js</text>
          {(view.cartRows ?? []).map((row, i) => (
            <g key={row.label}>
              <RoughRect x={256} y={74 + i * 36} width={144} height={28} seed={1320 + i} strokeWidth={row.hot ? 2.4 : 1.4} stroke="var(--color-pencil-blue)" fill={row.hot ? 'color-mix(in srgb, var(--color-pencil-blue) 12%, transparent)' : 'transparent'} fillStyle="solid" />
              <text x={328} y={92 + i * 36} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{row.label}</text>
            </g>
          ))}

          {view.arrow && (
            <HandArrow from={{ x: 200, y: 118 }} to={{ x: 240, y: 118 }} curve={0.2} seed={1330} stroke="var(--color-marker-teal)" strokeWidth={2} />
          )}
          <AnimatePresence>
            {view.chip && (
              <motion.g initial={{ x: -110, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: 'spring', damping: 18 }}>
                <RoughRect x={252} y={140} width={100} height={26} seed={1331} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 14%, transparent)" fillStyle="solid" />
                <text x={302} y={157} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">ƒ withTax</text>
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      )}

      {view.mode === 'graph' && (
        <g>
          {[
            { label: 'app.js', x: 165, y: 40 },
            { label: 'cart.js', x: 60, y: 120 },
            { label: 'ui.js', x: 270, y: 120 },
            { label: 'math.js', x: 165, y: 200 },
          ].map((card, i) => (
            <g key={card.label}>
              <RoughRect x={card.x} y={card.y} width={110} height={44} seed={1340 + i} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={card.x + 55} y={card.y + 27} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{card.label}</text>
            </g>
          ))}
          <HandArrow from={{ x: 185, y: 86 }} to={{ x: 135, y: 118 }} curve={0.2} seed={1345} stroke="var(--color-marker-teal)" strokeWidth={1.8} />
          <HandArrow from={{ x: 255, y: 86 }} to={{ x: 305, y: 118 }} curve={-0.2} seed={1346} stroke="var(--color-marker-teal)" strokeWidth={1.8} />
          <HandArrow from={{ x: 135, y: 166 }} to={{ x: 190, y: 198 }} curve={-0.2} seed={1347} stroke="var(--color-marker-teal)" strokeWidth={1.8} />
          <text x={330} y={210} fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">arrow = “I need you”</text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={380} fontSize={9.5} seed={1350} color="var(--color-pencil-blue)" />
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

const MODULE_EXERCISE: CodeExerciseDef = {
  id: 'l81-module-machine',
  title: 'build the import machine',
  task: 'The sandbox runs a single file, so build the mechanism yourself: a module is a box of named things, and importing means fetching one OUT of the box by its name.',
  steps: [
    <>
      Create <code>TAX</code> set to <code>0.25</code>, a function <code>withTax(price)</code>{' '}
      returning <code>price * (1 + TAX)</code>, and an object <code>mathModule</code> holding both
      under those exact names.
    </>,
    <>
      Write <code>importFrom(module, name)</code>: it returns whatever the module holds under that
      name — the name arrives as a <em>string variable</em>, so pick the right property syntax
      (4.4 knows).
    </>,
    <>
      Use it twice: fetch <code>"withTax"</code> into a variable and print calling it with{' '}
      <code>100</code>; then print fetching <code>"TAX"</code> directly.
    </>,
  ],
  starter: '',
  expectedOutput: ['125', '0.25'],
  mustUse: [
    { test: /function\s+importFrom\s*\(|const\s+importFrom\s*=/, label: 'a function named importFrom' },
    { test: /module\s*\[\s*name\s*\]/, label: 'the lookup uses dynamic brackets: module[name]' },
    { test: /importFrom\s*\(\s*mathModule\s*,/, label: 'imports go through importFrom(mathModule, …)' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*mathModule\.withTax/, label: 'don’t call mathModule.withTax directly — fetch it through importFrom' },
    { test: /console\.log\s*\(\s*["']?125["']?\s*\)|console\.log\s*\(\s*["']?0\.25["']?\s*\)/, label: 'no hard-coded answers — the machine must compute them' },
  ],
  modelAnswer: `const TAX = 0.25;

function withTax(price) {
  return price * (1 + TAX);
}

const mathModule = { TAX: TAX, withTax: withTax };

function importFrom(module, name) {
  return module[name];
}

const borrowed = importFrom(mathModule, "withTax");
console.log(borrowed(100));
console.log(importFrom(mathModule, "TAX"));`,
}

export const lesson81: LessonDef = {
  id: '8.1',
  hook: (
    <>
      <p>
        Every program you’ve written fits in one file. No real project does: a Playwright test
        suite is dozens of files — tests, helpers, configuration, page models — working together.
        Split carelessly and nothing can find anything; the language’s answer is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          modules: one file = one sealed module, sharing only what it explicitly exports
        </HighlightMark>
        .
      </p>
      <p>
        Two new keywords, <code>export</code> and <code>import</code> — and one new picture, the
        dependency graph — and you can read the folder structure of any professional codebase.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'one-file-problem',
      caption:
        'First, the problem. Real projects are thousands of lines; one file becomes a junk drawer where every variable can see every other variable, and two far-apart lines can silently fight over one name. The fix has a name: MODULES.',
      highlightLines: [1],
    },
    {
      id: 'file-equals-module',
      caption:
        'The rule is beautifully simple: one file = one module. This code pane shows two files side by side — math.js and cart.js. Two files, two modules, two cards.',
      highlightLines: [1, 10],
    },
    {
      id: 'module-scope',
      caption:
        'Each module is a sealed scope — 3.5’s bubbles, one size larger: a bubble around the whole FILE. secret on line 8 belongs to math.js alone; cart.js cannot see it, touch it, or even know it exists.',
      highlightLines: [8],
    },
    {
      id: 'export',
      caption:
        'To share something, a module marks it with export — a door in the wall. math.js exports TAX and withTax. secret has no export keyword, so it has no door: private by default, shared by choice.',
      highlightLines: [2, 4],
    },
    {
      id: 'import',
      caption:
        'cart.js borrows with import { withTax } from "./math.js". The braces name EXACTLY which exports to pull in, matched by name, spelled identically. (It looks like 4.11’s destructuring — a deliberate look-alike, though the engine treats imports specially.)',
      highlightLines: [11],
    },
    {
      id: 'value-travels',
      caption:
        'Watch the arrow: the function VALUE travels — withTax is a value like any other (3.4 said so, and it keeps paying). Now cart.js calls it: withTax(100) → 125.',
      highlightLines: [11, 13],
    },
    {
      id: 'dependency-graph',
      caption:
        'Zoom out and every real project looks like this: files as cards, imports as arrows — the DEPENDENCY GRAPH. An arrow means “I need you”: app needs cart, cart needs math. Tools, bundlers, and your own debugging all walk this graph.',
      highlightLines: [11],
    },
    {
      id: 'static-imports',
      caption:
        'One strict rule: imports are STATIC. The engine reads every import and builds the whole graph BEFORE running a single line — which is why import lines live at the top of a file and can never hide inside an if.',
      highlightLines: [11],
    },
    {
      id: 'default-export',
      caption:
        'Besides named exports, a module may declare ONE export default — “the main thing this file is about.” Importing it needs no braces, and the importer picks any name it likes. You’ll meet both flavors constantly; libraries love default exports.',
      codeOverride: DEFAULT_CODE,
      highlightLines: [3, 9],
    },
    {
      id: 'habitat-flag',
      caption:
        'Last, a habitat note: in a browser page, this syntax needs <script type="module">. In Node there are TWO module systems — require and import — and Playwright configs meet both. 9.3 untangles that fully; today’s import/export is the modern standard both worlds speak.',
      highlightLines: [11],
    },
  ],
  Viz: ModuleGraph,
  underTheHood: (
    <>
      <p>
        What travels, precisely: a named import is not a copy — it’s a{' '}
        <strong>live binding</strong> to the exporting module’s variable. If math.js reassigns an
        exported <code>let</code> counter, every importer sees the new value. You read through the
        door; you don’t take a photocopy home.
      </p>
      <p>
        Each module runs <strong>once</strong>, no matter how many files import it. The first
        import executes the file and caches the result; every later import receives that same
        cached module. That’s why a module is a safe place for shared setup — and why test
        frameworks depend on this heavily.
      </p>
      <p>
        “Static” has real rewards. The graph is known before execution, so the engine can report
        a misspelled import name <em>immediately</em>. Build tools can also drop exports nobody
        imports (you’ll hear this called tree-shaking).
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'cart.js runs console.log(withTax(100)) with TAX = 0.25. What prints?',
      accept: ['125'],
      why: '100 × (1 + 0.25) = 125. The imported function is the same function value math.js exported — one machine, borrowed by name.',
    },
    {
      kind: 'type-output',
      question: 'math.js has const secret = "internal only" — with no export. Can cart.js import secret? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — module scope seals the file. Only names marked with export have a door; everything else is private by default.',
    },
    {
      kind: 'type-output',
      question: 'True or false: an import line may sit inside an if block, so you only load the module sometimes.',
      accept: ['false', 'False', 'FALSE'],
      placeholder: 'true / false…',
      why: 'False — imports are static and resolved before any code runs, so they must live at the top level of the file.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, every test file you write will start with this line:</Scene>
      <ReviewCard file="login.spec.js" lines={[{ text: 'import { test, expect } from "@playwright/test";' }]} />
      <Takeaway>
        A named import from an installed package, not a ./file path. <Key>Installing packages
        is exactly the next lesson.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={MODULE_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain modules to a friend: why one giant file breaks down, what export and import each do, what a module can see of another module, and what the dependency graph is.',
    modelAnswer:
      'One giant file turns into a junk drawer — every variable can see every other variable, and far-apart lines fight over names. Modules fix this: one file = one module, and each module is a sealed scope, like a scope bubble around the whole file. Everything inside is private by default. To share something, the module marks it with export — that’s a door in the wall. Another file borrows it with import { name } from "./file.js", matching the exported name exactly, and what arrives is the real value — a function is still the same function. Only exported things can ever cross; a const with no export is invisible to every other file. Zoom out and the imports draw a picture: files as cards, arrows meaning “I need you” — the dependency graph, which is how tools and teammates read a project’s structure. And imports are static — resolved before any line runs — so they live at the top of the file, never inside an if.',
  },
  recap: [
    'One file = one module = one sealed scope. Private by default; export opens a door, import { name } borrows through it — matched by exact name.',
    'Imports are STATIC: the engine reads the whole dependency graph before running anything — top of file, never inside an if. Files + arrows = the dependency graph.',
    'export default marks a file’s one main thing (imported without braces, any name). Browsers need <script type="module">; Node’s two systems wait in 9.3.',
  ],
}
