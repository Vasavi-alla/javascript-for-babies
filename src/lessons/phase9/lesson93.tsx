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
 * 9.3 — Modules in Node: CJS vs ESM
 * Pays off 8.1's and 8.6's flags. History (Node 2009 < ESM 2015) → CommonJS
 * mechanics (module.exports object + require as a plain function) → ESM in
 * Node → the "type": "module" switch → reading either cold → interop edges
 * flagged → why Playwright configs look the way they do.
 */

const CODE = `// ---- CommonJS (Node’s own, 2009) ----
// math.cjs
const TAX = 0.25;
function withTax(p) { return p * (1 + TAX); }
module.exports = { withTax };

// cart.cjs
const { withTax } = require("./math.cjs");
console.log(withTax(100));

// ---- ES Modules (the 8.1 standard) ----
// needs "type": "module" in package.json
import { withTax } from "./math.js";`

interface View {
  mode: 'history' | 'cjs' | 'esm' | 'switch' | 'both'
  hotSide?: 'cjs' | 'esm' | null
  switchOn?: boolean
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'history', console: [],
    note: 'the timeline explains everything: Node shipped in 2009, import/export arrived in 2015',
  },
  {
    mode: 'cjs', console: [],
    note: 'CommonJS exporting: build a plain OBJECT of everything public — module.exports = { withTax }',
  },
  {
    mode: 'cjs', console: ['125'],
    note: 'require("./math.cjs") is a normal FUNCTION CALL that returns that object — destructure it (4.11)',
  },
  {
    mode: 'cjs', console: ['125'],
    note: 'because require is just a function, it can run anywhere — even inside an if',
    badge: 'flexible, but the engine can’t know the graph before running — 8.1’s static superpower, gone',
  },
  {
    mode: 'esm', console: ['125'],
    note: 'then the standard arrived: Node adopted import/export too — “ESM.” Both systems now live in Node, forever',
  },
  {
    mode: 'switch', switchOn: false, console: [],
    note: 'so which does YOUR .js file speak? Without the switch: CommonJS — Node’s default',
  },
  {
    mode: 'switch', switchOn: true, console: [],
    note: '8.6’s line, fully explained: "type": "module" flips every .js file in the project to ESM',
    badge: 'per-file overrides exist: a .cjs extension forces CommonJS, .mjs forces ESM — whatever the switch says',
  },
  {
    mode: 'both', hotSide: null, console: [],
    note: 'reading code cold: require / module.exports = CJS · import / export = ESM. One glance at the top of the file',
  },
  {
    mode: 'both', hotSide: 'cjs', console: [],
    note: 'mixing them has sharp edges — file this away for the day you meet ERR_REQUIRE_ESM',
    badge: 'ESM can import most CJS packages fine; CJS require() of an ESM file is the restricted direction. Fix: the switch, or .mjs.',
  },
  {
    mode: 'both', hotSide: 'esm', console: [],
    note: 'why Playwright configs “look the way they do”: new docs use import; old tutorials use require — same machine, two costumes',
  },
]

function TwoModuleWorlds({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]

  const moduleCards = (x: number, title: string, exportLine: string, importLine: string, color: string, dim: boolean) => (
    <g opacity={dim ? 0.35 : 1}>
      <text x={x + 90} y={46} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill={color}>{title}</text>
      <RoughRect x={x} y={56} width={180} height={52} seed={2101 + x} strokeWidth={1.8} stroke={color} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={x + 90} y={76} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">math</text>
      <text x={x + 90} y={94} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill={color}>{exportLine}</text>
      <HandArrow from={{ x: x + 90, y: 112 }} to={{ x: x + 90, y: 136 }} curve={0.15} seed={2110 + x} stroke={color} strokeWidth={1.8} />
      <RoughRect x={x} y={140} width={180} height={52} seed={2102 + x} strokeWidth={1.8} stroke={color} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={x + 90} y={160} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8} fill="var(--color-ink)">cart</text>
      <text x={x + 90} y={178} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill={color}>{importLine}</text>
    </g>
  )

  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'history' && (
        <g>
          <line x1={50} y1={110} x2={390} y2={110} stroke="var(--color-ink-soft)" strokeWidth={2} strokeLinecap="round" />
          {[
            { x: 90, year: '2009', label: 'Node ships — invents CommonJS', color: 'var(--color-marker-coral)' },
            { x: 230, year: '2015', label: 'the language gets import/export', color: 'var(--color-marker-teal)' },
            { x: 350, year: 'today', label: 'both live in Node, side by side', color: 'var(--color-pencil-blue)' },
          ].map((ev) => (
            <g key={ev.year}>
              <circle cx={ev.x} cy={110} r={6} fill={ev.color} />
              <text x={ev.x} y={92} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">{ev.year}</text>
              <text x={ev.x} y={136} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">
                <WrapTspans text={ev.label} x={ev.x} maxPx={120} fontSize={10} />
              </text>
            </g>
          ))}
          <text x={220} y={196} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">
            six years with no official system → Node built its own
          </text>
        </g>
      )}

      {view.mode === 'cjs' && moduleCards(130, 'CommonJS', 'module.exports = { withTax }', 'require("./math.cjs")', 'var(--color-marker-coral)', false)}
      {view.mode === 'esm' && moduleCards(130, 'ES Modules', 'export function withTax…', 'import { withTax } from…', 'var(--color-marker-teal)', false)}

      {view.mode === 'switch' && (
        <g>
          <RoughRect x={120} y={44} width={200} height={94} seed={2120} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={66} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">package.json</text>
          <text x={220} y={92} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill={view.switchOn ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>
            {view.switchOn ? '"type": "module"  ✓' : '(no "type" field)'}
          </text>
          <text x={220} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">the one-line switch</text>
          <HandArrow from={{ x: 220, y: 142 }} to={{ x: 220, y: 168 }} curve={0} seed={2125} stroke={view.switchOn ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} strokeWidth={2.2} />
          <RoughRect x={100} y={172} width={240} height={54} seed={2126} strokeWidth={2.2} stroke={view.switchOn ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} fill={`color-mix(in srgb, ${view.switchOn ? 'var(--color-marker-teal)' : 'var(--color-marker-coral)'} 10%, transparent)`} fillStyle="solid" />
          <text x={220} y={196} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-ink)">
            every .js file speaks {view.switchOn ? 'ESM' : 'CommonJS'}
          </text>
          <text x={220} y={216} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
            {view.switchOn ? 'import { withTax } from "./math.js"' : 'const { withTax } = require("./math.js")'}
          </text>
        </g>
      )}

      {view.mode === 'both' && (
        <g>
          {moduleCards(30, 'CommonJS', 'module.exports = { … }', 'require("./math.cjs")', 'var(--color-marker-coral)', view.hotSide === 'esm')}
          {moduleCards(230, 'ES Modules', 'export function withTax…', 'import { withTax } from…', 'var(--color-marker-teal)', view.hotSide === 'cjs')}
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={2130} color="var(--color-pencil-blue)" />
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

const CJS_EXERCISE: CodeExerciseDef = {
  id: 'l93-build-require',
  title: 'build require yourself',
  task: 'CommonJS is refreshingly unmagical: exports is a plain object, require is a plain function. Prove it by building the whole mechanism in the sandbox.',
  steps: [
    <>
      Model a module: create <code>moduleBox</code> as an object whose <code>exports</code>{' '}
      property starts as an empty object.
    </>,
    <>
      Model the module’s sealed file scope with a bare <code>{'{ }'}</code> block (3.5’s bubble!).
      Inside it: <code>TAX</code> set to <code>0.25</code>, <code>withTax</code> as a const arrow
      function returning <code>price * (1 + TAX)</code>, and finally assign{' '}
      <code>moduleBox.exports</code> an object holding <code>withTax</code>.
    </>,
    <>
      Outside the block, write <code>requireFrom(box)</code>: it simply returns the box’s{' '}
      <code>exports</code>. Destructure <code>withTax</code> out of a{' '}
      <code>requireFrom(moduleBox)</code> call (4.11) — the name is free out here, because the
      block kept the module’s own copy private.
    </>,
    <>
      Print <code>withTax(100)</code>, then print <code>typeof requireFrom(moduleBox)</code> —
      proof that what require hands back is just an object.
    </>,
  ],
  starter: '',
  expectedOutput: ['125', 'object'],
  mustUse: [
    { test: /\.exports\s*=/, label: 'exporting assigns to .exports' },
    { test: /function\s+requireFrom\s*\(|const\s+requireFrom\s*=/, label: 'a function named requireFrom' },
    { test: /const\s*\{\s*withTax\s*\}\s*=\s*requireFrom/, label: 'the import side destructures requireFrom(...)' },
    { test: /typeof/, label: 'the proof uses typeof' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*125\s*\)|console\.log\s*\(\s*["']125["']\s*\)/, label: 'no hard-coded 125 — the borrowed function computes it' },
  ],
  modelAnswer: `const moduleBox = { exports: {} };

{
  const TAX = 0.25;
  const withTax = (price) => price * (1 + TAX);
  moduleBox.exports = { withTax: withTax };
}

function requireFrom(box) {
  return box.exports;
}

const { withTax } = requireFrom(moduleBox);
console.log(withTax(100));
console.log(typeof requireFrom(moduleBox));`,
}

export const lesson93: LessonDef = {
  id: '9.3',
  hook: (
    <>
      <p>
        Twice now a note has said “Node has TWO module systems — 9.3 untangles them” (8.1), and
        8.6 showed you the mysterious <code>"type": "module"</code> switch. Time to pay the debt:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          Node speaks both CommonJS (its own invention, 2009) and ES Modules (8.1’s standard,
          2015) — and one package.json line decides which your files speak
        </HighlightMark>
        .
      </p>
      <p>
        After today you can read any Node file cold — old tutorial or new config — without
        blinking at <code>require</code>.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'history',
      caption:
        'The timeline explains everything. Node shipped in 2009; the language didn’t get import/export until 2015. Six years of real projects needed SOME way to split files — so Node invented its own system: CommonJS. Not a rival standard by arrogance; a gap-filler by necessity.',
      highlightLines: [1],
    },
    {
      id: 'cjs-export',
      caption:
        'CommonJS exporting, line 5: module.exports = { withTax }. No keyword, no magic — you build a plain OBJECT (4.x!) holding everything public and assign it to module.exports. What isn’t in the object stays private, exactly like 8.1’s doors.',
      highlightLines: [5],
    },
    {
      id: 'cjs-require',
      caption:
        'The borrowing side, line 8: require("./math.cjs") — a normal FUNCTION CALL that runs the module (once, cached — same singleton rule as 8.1) and returns its exports object. Then 4.11’s destructuring unpacks withTax from it. Two old tools, no new syntax.',
      highlightLines: [8, 9],
    },
    {
      id: 'dynamic-tradeoff',
      caption:
        'Because require is just a function, it can run ANYWHERE — inside an if, with a computed path. Flexible! But it costs 8.1’s superpower: the engine cannot know the dependency graph before running the code. Static analysis, tree-shaking, instant typo errors — all weaker in CJS.',
      highlightLines: [8],
    },
    {
      id: 'esm-arrives',
      caption:
        'Then 2015 happened: the language itself gained import/export — “ES Modules,” ESM for short. Node adopted the standard too. But millions of CommonJS packages already existed and still work — so BOTH systems live in Node today, side by side, permanently.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'the-default',
      caption:
        'So which system does YOUR .js file speak? Node’s answer, for history’s sake: CommonJS by default. A brand-new .js file with an import line will crash a default Node project — the syntax belongs to the other system.',
      highlightLines: [12],
    },
    {
      id: 'the-switch',
      caption:
        'The fix is 8.6’s line, now fully explained: "type": "module" in package.json flips every .js file in the project to ESM. One line, whole-project effect. (Per-file overrides exist: .cjs forces CommonJS, .mjs forces ESM, regardless of the switch.)',
      highlightLines: [12],
    },
    {
      id: 'read-cold',
      caption:
        'The practical skill — identify the system in one glance at the top of a file: require(...) and module.exports mean CommonJS; import and export mean ESM. That’s the entire recognition test, and you’ll use it weekly on tutorials, configs, and Stack Overflow answers.',
      highlightLines: [5, 8, 13],
    },
    {
      id: 'interop-flag',
      caption:
        'Mixing them has sharp edges — filed as a flag, not homework: an ESM file can import most CommonJS packages fine, but CommonJS require() of an ESM file is the restricted direction. The day you meet the error ERR_REQUIRE_ESM, you’ll know exactly what happened — and that the fix is the switch or a rename.',
      highlightLines: [8, 13],
    },
    {
      id: 'playwright-why',
      caption:
        'And the career payoff: this is why Playwright materials “look different” across the years. Modern docs and playwright.config.ts use import/export; older tutorials use require(...). Same runner, same concepts — two costumes. You now read both natively.',
      highlightLines: [13],
    },
  ],
  Viz: TwoModuleWorlds,
  underTheHood: (
    <>
      <p>
        Under CommonJS, Node wraps every file in a hidden function —{' '}
        <code>function (exports, require, module, __filename, __dirname) {'{ … }'}</code> — and
        calls it. That’s why <code>require</code> and <code>module</code> “just exist” in CJS
        files: they’re parameters (3.1!), not globals. ESM files don’t get this wrapper, which is
        also why <code>__dirname</code> vanishes there (9.5 shows the replacement).
      </p>
      <p>
        The deeper difference from 8.1 still applies: ESM imports are <strong>live bindings</strong>{' '}
        resolved before execution; CJS hands you a snapshot object whenever the require call
        runs. Most days this changes nothing. It matters when you hit circular imports (two
        files importing each other) — and then it matters a lot.
      </p>
      <p>
        ESM in Node also unlocks <strong>top-level await</strong> (6.6’s await outside any
        function) — CJS files can’t do that, another reason new projects flip the switch.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A file’s top line is: const { test } = require("@playwright/test"). Which module system — CommonJS or ESM?',
      accept: ['CommonJS', 'commonjs', 'cjs', 'CJS', 'common js'],
      placeholder: 'system name…',
      why: 'require + module.exports = CommonJS; import/export = ESM. One glance at the top of a file is the whole recognition test.',
    },
    {
      kind: 'type-output',
      question: 'A default Node project (no "type" field in package.json) — which system do its .js files speak?',
      accept: ['CommonJS', 'commonjs', 'cjs', 'CJS', 'common js'],
      placeholder: 'system name…',
      why: 'CommonJS, for historical compatibility. "type": "module" flips the project to ESM; .cjs/.mjs extensions override per file.',
    },
    {
      kind: 'type-output',
      question: 'Is require a keyword like import, or a normal function? Type keyword or function.',
      accept: ['function', 'a function', 'normal function', 'a normal function'],
      placeholder: 'keyword / function…',
      why: 'A normal function — which is why it can run inside an if with computed paths, and why the engine can’t know a CJS graph before running the code.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, you will write a config file like this:</Scene>
      <ReviewCard file="playwright.config.ts" lines={[{ text: 'import { defineConfig } from "@playwright/test";' }]} />
      <Takeaway>
        You write the standard: import and export. <Key>The compiler outputs whichever system
        the project’s settings ask for.</Key>
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={CJS_EXERCISE} />,
  interview: {
    question: 'What’s the difference between CommonJS and ES modules?',
    say: 'CommonJS uses require and module.exports and loads modules at run time. ES modules use import and export and are resolved statically before the code runs. ESM is the modern standard, and mixing the two causes errors.',
    example: {
      code: '// CommonJS, loads at run time\nconst fs = require("fs")\nmodule.exports = { run }\n\n// ES modules, resolved before running\nimport fs from "fs"\nexport { run }',
      note: 'require and module.exports are CommonJS. import and export are ES modules, and "type": "module" selects them.',
    },
    deeper:
      'require returns a value you can call conditionally (9.3). import is static, so tools can analyze it. "type": "module" or an .mjs file selects ESM.',
    dontSay: {
      wrong: 'They are interchangeable.',
      why: 'Mixing them causes errors like ERR_REQUIRE_ESM. import is static, require is dynamic (9.3).',
    },
  },
  teachBack: {
    prompt:
      'Explain to a friend why Node has two module systems, how to recognize each in one glance, and what "type": "module" in package.json actually does.',
    modelAnswer:
      'It’s a history story: Node shipped in 2009, but JavaScript didn’t get official import/export until 2015 — so for six years Node needed its own way to split code across files and invented CommonJS. In CommonJS, exporting means assigning a plain object to module.exports, and importing means calling require("./file") — a normal function that runs the module once, caches it, and returns that exports object, which you usually destructure. Because require is just a function it can run anywhere, but the engine can’t know the dependency graph before execution — the static-analysis superpower ES Modules have. When the 2015 standard arrived, Node adopted it too, but millions of CommonJS packages already existed, so both systems live in Node permanently. Recognition takes one glance at the top of a file: require and module.exports mean CommonJS; import and export mean ESM. And the switch: Node’s default for .js files is CommonJS, so "type": "module" in package.json flips the whole project’s .js files to ESM — with .cjs and .mjs extensions as per-file overrides. That’s also why old Playwright tutorials say require while new configs say import: same machine, two costumes.',
  },
  recap: [
    'Node (2009) predates import/export (2015) → it invented CommonJS: module.exports = a plain object; require("./file") = a plain function returning it (run once, cached).',
    'Recognition in one glance: require/module.exports = CJS · import/export = ESM. Node’s .js default is CJS; "type": "module" flips the project to ESM (.cjs/.mjs override per file).',
    'CJS is dynamic (require anywhere) but loses static-graph powers; ESM is static and adds top-level await. ERR_REQUIRE_ESM = CJS trying to require an ESM file — fix with the switch or a rename.',
  ],
}
