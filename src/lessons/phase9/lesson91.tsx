import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.1 — What is Node, really?
 * 0.2's engine diagram revisited: V8 unbolted from the browser, a terminal
 * shell dropped on instead. document/window vanish (they were the browser's
 * gifts), files/env/network arrive. node script.js + the REPL. Everything
 * from Phases 1–6 runs identically.
 */

const CODE = `// hello.js — a plain file on YOUR computer
console.log("hello from my computer");

// the terminal:
//   $ node hello.js
//   hello from my computer

// browser things, asked in Node:
console.log(typeof document);
console.log(typeof window);

// Node-only powers (this phase):
// files · folders · env vars · network`

interface Chip {
  label: string
  gone?: boolean
}
interface View {
  mode: 'browser' | 'liftoff' | 'terminal' | 'repl' | 'compare'
  chips?: Chip[]
  termLines?: string[]
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'browser',
    chips: [{ label: 'DOM tree' }, { label: 'window' }, { label: 'tabs & pages' }],
    console: [],
    note: '0.2, remembered: your JS always ran inside an ENGINE (V8) — bolted inside a browser',
  },
  {
    mode: 'liftoff',
    chips: [{ label: 'DOM tree', gone: true }, { label: 'window', gone: true }, { label: 'tabs & pages', gone: true }],
    console: [],
    note: '2009, Node’s idea: unbolt V8 and run it directly on the computer — no browser around it',
  },
  {
    mode: 'liftoff',
    chips: [{ label: 'DOM tree', gone: true }, { label: 'window', gone: true }, { label: 'tabs & pages', gone: true }],
    console: ['undefined', 'undefined'],
    note: 'document and window were never JavaScript — they were the BROWSER’s gifts. Gone.',
  },
  {
    mode: 'terminal',
    chips: [{ label: 'files & folders' }, { label: 'process & env' }, { label: 'raw network' }],
    console: ['undefined', 'undefined'],
    note: 'new gifts instead: the computer itself — files, environment, network, exit codes',
  },
  {
    mode: 'terminal',
    chips: [{ label: 'files & folders' }, { label: 'process & env' }, { label: 'raw network' }],
    termLines: ['$ node hello.js', 'hello from my computer'],
    console: ['undefined', 'undefined'],
    note: 'the ritual: write a .js file, run it with node — no HTML, no <script> tag, no page',
  },
  {
    mode: 'repl',
    termLines: ['$ node', '> 2 + 3', '5', '> "Ada".toUpperCase()', "'ADA'"],
    console: ['undefined', 'undefined'],
    note: 'type just node and you get a REPL — 0.3’s console conversation, in the terminal',
  },
  {
    mode: 'terminal',
    chips: [{ label: 'files & folders' }, { label: 'process & env' }, { label: 'raw network' }],
    console: ['undefined', 'undefined'],
    note: 'everything from Phases 1–6 works IDENTICALLY here: closures, promises, the event loop',
    badge: 'one backstage difference in the async machinery — 9.6 opens that door',
  },
  {
    mode: 'compare',
    console: ['undefined', 'undefined'],
    note: 'the precise word: JavaScript has multiple RUNTIMES — same engine core, different toolbelts',
  },
  {
    mode: 'compare',
    console: ['undefined', 'undefined'],
    note: 'why testers care: Playwright IS a Node program — your tests run in Node and remote-control browsers',
    badge: 'two worlds, one language: the test code lives in Node’s world, the tested page in the browser’s',
  },
  {
    mode: 'terminal',
    chips: [{ label: 'files & folders' }, { label: 'process & env' }, { label: 'raw network' }],
    termLines: ['$ node hello.js', 'hello from my computer'],
    console: ['undefined', 'undefined'],
    note: 'next: driving this world properly — the terminal itself',
  },
]

function ShellSwap({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  const engine = (cx: number, cy: number) => (
    <g>
      <RoughRect x={cx - 55} y={cy - 26} width={110} height={52} seed={1901} strokeWidth={2.4} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-ink)">V8 engine</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">your JS runs here</text>
    </g>
  )
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'browser' && (
        <g>
          <RoughRect x={70} y={30} width={300} height={190} seed={1905} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={220} y={54} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">the browser shell</text>
          {engine(220, 120)}
          {(view.chips ?? []).map((chip, i) => (
            <g key={chip.label}>
              <RoughRect x={92 + i * 90} y={168} width={82} height={26} seed={1910 + i} strokeWidth={1.5} stroke="var(--color-ink-soft)" fill="transparent" fillStyle="solid" />
              <text x={133 + i * 90} y={185} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)">{chip.label}</text>
            </g>
          ))}
        </g>
      )}

      {view.mode === 'liftoff' && (
        <g>
          <motion.g initial={{ y: 0, opacity: 1 }} animate={{ y: -26, opacity: 0.3 }} transition={{ type: 'spring', damping: 18 }}>
            <RoughRect x={70} y={26} width={300} height={80} seed={1905} strokeWidth={2} stroke="var(--color-ink-soft)" fill="transparent" fillStyle="solid" />
            <text x={220} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">the browser shell — lifting off ↑</text>
            <g opacity={0.7}>
              {(view.chips ?? []).map((chip, i) => (
                <text key={chip.label} x={133 + i * 90} y={86} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink-soft)" style={{ textDecoration: 'line-through' }}>{chip.label}</text>
              ))}
            </g>
          </motion.g>
          {engine(220, 170)}
        </g>
      )}

      {(view.mode === 'terminal' || view.mode === 'repl') && (
        <g>
          <RoughRect x={70} y={30} width={300} height={196} seed={1920} strokeWidth={2.2} stroke="var(--color-ink)" fill="color-mix(in srgb, var(--color-ink) 5%, transparent)" fillStyle="solid" />
          <text x={220} y={52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">the terminal shell</text>
          {engine(220, 92)}
          {view.mode === 'terminal' &&
            (view.chips ?? []).map((chip, i) => (
              <motion.g key={chip.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <RoughRect x={88 + i * 92} y={128} width={86} height={26} seed={1925 + i} strokeWidth={1.6} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 8%, transparent)" fillStyle="solid" />
                <text x={131 + i * 92} y={145} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={8.5} fill="var(--color-ink)">{chip.label}</text>
              </motion.g>
            ))}
          {(view.termLines ?? []).map((line, i) => (
            <text key={i} x={92} y={(view.mode === 'repl' ? 130 : 176) + i * 17} fontFamily="var(--font-code)" fontSize={9.5} fill={line.startsWith('$') || line.startsWith('>') ? 'var(--color-marker-teal)' : 'var(--color-ink)'}>
              {line}
            </text>
          ))}
        </g>
      )}

      {view.mode === 'compare' && (
        <g>
          {[
            { title: 'browser runtime', extras: ['DOM & window', 'Web APIs (6.2)'], x: 40 },
            { title: 'Node runtime', extras: ['files & process', 'libuv (9.6)'], x: 232 },
          ].map((side, s) => (
            <g key={side.title}>
              <RoughRect x={side.x} y={40} width={168} height={170} seed={1930 + s} strokeWidth={2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={side.x + 84} y={62} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">{side.title}</text>
              <RoughRect x={side.x + 24} y={76} width={120} height={38} seed={1935 + s} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
              <text x={side.x + 84} y={99} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fontWeight={700} fill="var(--color-ink)">V8 — the same</text>
              {side.extras.map((ex, i) => (
                <text key={ex} x={side.x + 84} y={140 + i * 22} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">{ex}</text>
              ))}
            </g>
          ))}
          <text x={220} y={125} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">=</text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={248} width={392} fontSize={9.5} seed={1940} color="var(--color-pencil-blue)" />
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

const RUNTIME_EXERCISE: CodeExerciseDef = {
  id: 'l91-two-toolbelts',
  title: 'compare the two toolbelts',
  task: 'The two runtimes share a language but carry different gifts. Given both toolbelts, compute what they share and what only the browser has — with array tools, not eyeballs.',
  steps: [
    <>
      Create <code>browserGifts</code> as <code>["document", "window", "fetch"]</code> and{' '}
      <code>nodeGifts</code> as <code>["fs", "process", "fetch"]</code>.
    </>,
    <>
      Print every gift they SHARE — filter one list down to entries the other list includes
      (4.9’s gate + a method that answers “is this in there?”).
    </>,
    <>
      Then print each browser-ONLY gift, one per line, in order — same tools, opposite test.
    </>,
  ],
  starter: '',
  expectedOutput: ['fetch', 'document', 'window'],
  mustUse: [
    { test: /\.filter\s*\(/, label: 'the comparisons are filters, not manual checks' },
    { test: /\.includes\s*\(/, label: 'membership is asked with .includes' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+|\.forEach\s*\(/, label: 'a loop prints the results' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']fetch["']\s*\)/, label: 'no hard-coded answers — the filters must find them' },
  ],
  modelAnswer: `const browserGifts = ["document", "window", "fetch"];
const nodeGifts = ["fs", "process", "fetch"];

const shared = browserGifts.filter((gift) => nodeGifts.includes(gift));
const browserOnly = browserGifts.filter((gift) => !nodeGifts.includes(gift));

for (const gift of shared) {
  console.log(gift);
}
for (const gift of browserOnly) {
  console.log(gift);
}`,
}

export const lesson91: LessonDef = {
  id: '9.1',
  hook: (
    <>
      <p>
        Way back in 0.2 you learned that your JavaScript runs inside an engine called V8, bolted
        inside a browser. Here’s the twist that created half the modern software world:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          in 2009, Node.js unbolted that engine and ran it directly on the computer — no browser
          around it
        </HighlightMark>
        . Same engine. Same language. Completely different powers.
      </p>
      <p>
        This matters to you personally: Playwright is a Node program. The next two phases live in
        this world — time to meet it properly.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'same-engine',
      caption:
        'Recall the 0.2 picture: your code always ran inside an ENGINE — V8 — which itself sat inside a browser, next to the DOM, the tabs, the window. The engine never needed the browser; it was just built into one.',
      highlightLines: [1, 2],
    },
    {
      id: 'liftoff',
      caption:
        'Node’s move: lift the browser shell OFF and run V8 directly on your computer, like any other program. Watch the shell rise — tabs gone, pages gone, DOM tree gone. What remains is the engine you already know.',
      highlightLines: [1],
    },
    {
      id: 'what-vanishes',
      caption:
        'So what happened to document and window? They were never JavaScript — they were the BROWSER’s gifts (7.1 said exactly this about the DOM). Ask Node for them and typeof answers "undefined": politely absent, like any name that was never created.',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'what-arrives',
      caption:
        'In their place, new gifts — things no webpage is ever allowed to touch: real FILES and folders, the process and its environment variables, raw network access, exit codes. The computer itself, instead of a page.',
      highlightLines: [12, 13],
    },
    {
      id: 'run-a-file',
      caption:
        'The daily ritual: write a plain .js file, then in the terminal: node hello.js. Node reads the file, V8 runs it, output appears right there. No HTML, no <script> tag, no browser tab — this is exactly how every test suite starts.',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'repl',
      caption:
        'Type just node — nothing after it — and you get a REPL: read, evaluate, print, loop. It’s 0.3’s console conversation, relocated to the terminal: try a line, see its answer, try another. Perfect for testing an idea in five seconds.',
      highlightLines: [4],
    },
    {
      id: 'same-language',
      caption:
        'Here’s the reassurance that makes this phase easy: EVERYTHING from Phases 1–6 works identically in Node. Variables, closures, prototypes, promises, async/await, the event loop — same engine, so same rules. (One backstage difference in async’s waiting room — 9.6.)',
      highlightLines: [2],
    },
    {
      id: 'runtimes',
      caption:
        'The precise vocabulary: JavaScript has multiple RUNTIMES — environments that host the engine and hand it a toolbelt. Browser runtime: V8 + DOM + Web APIs. Node runtime: V8 + files + process + network. Same core, different gifts around it.',
      highlightLines: [12, 13],
    },
    {
      id: 'why-testers',
      caption:
        'And the career reason you’re here: Playwright IS a Node program. Your future test files run in Node’s world — reading env vars, writing report files — while remote-controlling a page that lives in the browser’s world. You’re about to own both sides.',
      highlightLines: [1],
    },
    {
      id: 'roundup',
      caption:
        'Roundup: Node = V8 without the browser, plus computer-level powers. node file.js runs a script; bare node opens the REPL; document and window stay behind. Next lesson: the terminal itself, properly — the cockpit this whole world is flown from.',
      highlightLines: [4, 5, 6],
    },
  ],
  Viz: ShellSwap,
  underTheHood: (
    <>
      <p>
        Precision on the name: Node isn’t “JavaScript on the server” so much as{' '}
        <strong>a JavaScript runtime</strong> — a C++ program embedding V8 and wiring it to the
        operating system. Servers became its most famous job, but scripts, build tools, and test
        runners are equally native citizens.
      </p>
      <p>
        The globals really are different: in the browser the global object is{' '}
        <code>window</code>; in Node it’s called <code>globalThis</code> (with an older alias,{' '}
        <code>global</code>). Some names exist in both worlds — <code>console</code>,{' '}
        <code>setTimeout</code>, <code>fetch</code> — because both runtimes chose to provide them,
        not because they come with the language.
      </p>
      <p>
        Version note: Node releases in even-numbered LTS lines (“long-term support”) — the ones
        real teams run. When 9.8 has you install Node, LTS is the button you’ll press.
      </p>
      <p>
        Job note: when a Playwright suite runs in CI, there is often <em>no browser window at
        all</em> — Node runs your test code and drives headless browsers. Understanding “my code
        lives in Node, the page lives in the browser” will explain a dozen Phase-11 mysteries
        before they happen (why you can’t just touch <code>document</code> from a test, for one).
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'In Node, what does console.log(typeof document) print?',
      accept: ['undefined', '"undefined"'],
      placeholder: 'type the output…',
      why: 'document was the browser’s gift, not JavaScript’s — Node never creates it, so typeof answers "undefined".',
    },
    {
      kind: 'type-output',
      question: 'Do closures, promises, and async/await behave differently in Node than in the browser? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — they’re engine-level features, and Node runs the same V8 engine. What differs is the toolbelt around the engine, not the language.',
    },
    {
      kind: 'type-output',
      question: 'What do you type in the terminal to run a file called report.js with Node?',
      accept: ['node report.js', 'node report'],
      placeholder: 'the command…',
      why: 'node report.js — Node reads the file and V8 executes it. No HTML, no script tag; this is how every test suite starts.',
    },
  ],
  PlayExtra: () => <CodeExercise def={RUNTIME_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what Node.js actually is — same engine, different shell — including what disappears compared to the browser, what appears instead, and why Playwright cares.',
    modelAnswer:
      'Node.js is the same V8 engine that runs JavaScript inside the browser, unbolted and run directly on the computer as a normal program. The language is identical — variables, closures, promises, async/await all behave exactly as I learned, because it’s the same engine. What changes is the shell around it. The browser’s gifts disappear: there’s no page, so no DOM, no document, no window — typeof document answers "undefined" because those were the browser’s objects, never JavaScript’s. In their place come computer-level gifts no webpage is allowed: reading and writing real files, the process and its environment variables, raw network access, exit codes. You run code with node file.js, or type bare node for a REPL — a console-style conversation in the terminal. The precise word is runtime: browser and Node are two runtimes hosting one engine with different toolbelts. And it matters for testing because Playwright is a Node program: test code runs in Node’s world and remote-controls pages living in the browser’s world.',
  },
  recap: [
    'Node = V8 unbolted from the browser, run as a normal program. Same engine → Phases 1–6 behave identically.',
    'The browser’s gifts vanish (document, window, DOM — typeof says "undefined"); computer gifts arrive: files, process & env, network, exit codes.',
    'node file.js runs a script; bare node opens the REPL. “Runtime” = engine + toolbelt. Playwright is a Node program driving browser pages — you’ll live in both worlds.',
  ],
}
