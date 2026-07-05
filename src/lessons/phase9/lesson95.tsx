import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 9.5 — The file system
 * The first browser-impossible power: write/read real files (fs), the Sync
 * suffix = blocking (promise flavors exist), node: built-ins, path.join vs
 * string-gluing, cwd vs the file's home — and where test artifacts
 * (reports, screenshots, traces) actually land.
 */

const CODE = `import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

const line = "suite: 12 passed, 1 failed";
writeFileSync("report.txt", line);

const back = readFileSync("report.txt", "utf8");
console.log(back);

const full = path.join("reports", "day1", "report.txt");
console.log(full);

console.log(process.cwd());   // the terminal’s folder
// vs. the folder this FILE lives in — two different “here”s`

interface TreeNode {
  label: string
  depth: number
  isNew?: boolean
  hot?: boolean
}
interface View {
  mode: 'tree' | 'join' | 'two-heres'
  tree?: TreeNode[]
  fileContent?: string | null
  joinParts?: boolean
  console: string[]
  note: string
  badge?: string
}

const BASE_TREE: TreeNode[] = [
  { label: 'shop-tests/', depth: 0 },
  { label: 'package.json', depth: 1 },
  { label: 'tests/', depth: 1 },
  { label: 'report.js', depth: 1 },
]

const VIEWS: View[] = [
  {
    mode: 'tree', tree: BASE_TREE, console: [],
    note: 'the first browser-impossible power: real files. Webpages are sandboxed away from your disk — Node isn’t',
  },
  {
    mode: 'tree',
    tree: [...BASE_TREE, { label: 'report.txt ✨', depth: 1, isNew: true }],
    fileContent: 'suite: 12 passed, 1 failed',
    console: [],
    note: 'writeFileSync(path, content) — a REAL file materializes on disk (or is overwritten)',
  },
  {
    mode: 'tree',
    tree: [...BASE_TREE, { label: 'report.txt', depth: 1, hot: true }],
    fileContent: 'suite: 12 passed, 1 failed',
    console: ['suite: 12 passed, 1 failed'],
    note: 'readFileSync(path, "utf8") reads it back — "utf8" means “decode the bytes into text”',
  },
  {
    mode: 'tree',
    tree: [...BASE_TREE, { label: 'report.txt', depth: 1 }],
    console: ['suite: 12 passed, 1 failed'],
    note: 'the Sync suffix = BLOCKING (6.1’s word): the thread stands and waits for the disk',
    badge: 'fine for scripts and test setup; servers use the promise flavor — fs/promises + await (6.6’s machinery)',
  },
  {
    mode: 'tree',
    tree: [...BASE_TREE, { label: 'report.txt', depth: 1 }],
    console: ['suite: 12 passed, 1 failed'],
    note: 'notice the import: "node:fs" — fs ships WITH Node. A built-in module: no npm install, the node: prefix marks it',
  },
  {
    mode: 'join', joinParts: true, console: ['suite: 12 passed, 1 failed', 'reports/day1/report.txt'],
    note: 'never glue paths with + : Windows separates with \\ while Mac/Linux use / — path.join picks correctly per OS',
  },
  {
    mode: 'two-heres', console: ['suite: 12 passed, 1 failed', 'reports/day1/report.txt', '/Users/lijas/shop-tests'],
    note: 'two different “here”s: process.cwd() = where the TERMINAL stood at launch (9.2’s pwd)',
  },
  {
    mode: 'two-heres', console: ['suite: 12 passed, 1 failed', 'reports/day1/report.txt', '/Users/lijas/shop-tests'],
    note: 'relative paths like "report.txt" resolve against cwd — NOT against the script’s own folder',
    badge: 'the classic bug: “works from the repo root, breaks from a subfolder.” Same script, different cwd, different file.',
  },
  {
    mode: 'tree',
    tree: [
      { label: 'shop-tests/', depth: 0 },
      { label: 'playwright-report/ ✨', depth: 1, isNew: true },
      { label: 'test-results/ ✨', depth: 1, isNew: true },
      { label: 'screenshots · videos · traces', depth: 2 },
    ],
    console: [],
    note: 'why testers care: every run WRITES — Playwright drops reports and artifacts with exactly these tools',
  },
  {
    mode: 'tree',
    tree: [
      { label: 'shop-tests/', depth: 0 },
      { label: 'playwright-report/', depth: 1, hot: true },
      { label: 'test-results/', depth: 1, hot: true },
      { label: '.gitignore  ← lists both', depth: 1 },
    ],
    console: [],
    note: 'output folders are regenerable → they join node_modules in .gitignore (8.2’s rule, generalized)',
    badge: 'never commit what a command can rebuild: installs, reports, screenshots — the repo holds sources, not products',
  },
]

function FolderTree({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'tree' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            the project folder, on the real disk
          </text>
          {(view.tree ?? []).map((node, i) => {
            const color = node.isNew ? 'var(--color-marker-teal)' : node.hot ? 'var(--color-marker-coral)' : 'var(--color-ink)'
            return (
              <motion.g key={node.label} initial={node.isNew ? { opacity: 0, x: -10 } : false} animate={{ opacity: 1, x: 0 }}>
                <text x={40 + node.depth * 26} y={56 + i * 24} fontFamily="var(--font-code)" fontSize={10.5} fontWeight={node.isNew || node.hot ? 700 : 400} fill={color}>
                  {node.depth > 0 ? '└ ' : ''}{node.label}
                </text>
              </motion.g>
            )
          })}
          {view.fileContent && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <RoughRect x={230} y={60} width={186} height={58} seed={2301} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 8%, transparent)" fillStyle="solid" />
              <text x={323} y={82} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">report.txt holds:</text>
              <text x={323} y={102} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">{view.fileContent}</text>
            </motion.g>
          )}
        </g>
      )}

      {view.mode === 'join' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            path.join — the OS-aware assembler
          </text>
          {['"reports"', '"day1"', '"report.txt"'].map((part, i) => (
            <g key={part}>
              <RoughRect x={36 + i * 128} y={48} width={112} height={38} seed={2310 + i} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
              <text x={92 + i * 128} y={72} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">{part}</text>
              {i < 2 && <text x={152 + i * 128} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fill="var(--color-ink-soft)">+</text>}
            </g>
          ))}
          <HandArrow from={{ x: 220, y: 92 }} to={{ x: 220, y: 118 }} curve={0} seed={2315} stroke="var(--color-marker-teal)" strokeWidth={2} />
          <RoughRect x={90} y={122} width={260} height={40} seed={2316} strokeWidth={2.2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
          <text x={220} y={147} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">reports/day1/report.txt</text>
          <text x={220} y={186} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">
            on Windows it would build reports\day1\report.txt — same call
          </text>
        </g>
      )}

      {view.mode === 'two-heres' && (
        <g>
          <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">
            two different “here”s
          </text>
          <RoughRect x={36} y={48} width={180} height={92} seed={2320} strokeWidth={2} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 6%, transparent)" fillStyle="solid" />
          <text x={126} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">process.cwd()</text>
          <text x={126} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">where the TERMINAL stood</text>
          <text x={126} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">/Users/lijas/shop-tests</text>
          <RoughRect x={224} y={48} width={180} height={92} seed={2321} strokeWidth={2} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 6%, transparent)" fillStyle="solid" />
          <text x={314} y={72} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill="var(--color-ink)">the file’s home</text>
          <text x={314} y={94} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fill="var(--color-ink-soft)">where the SCRIPT lives</text>
          <text x={314} y={112} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill="var(--color-ink)">…/shop-tests/tests/</text>
          <text x={220} y={168} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">
            relative paths resolve against the LEFT one
          </text>
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={2330} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={288} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={9} fill="var(--color-ink-soft)">
          console: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const FS_EXERCISE: CodeExerciseDef = {
  id: 'l95-fake-disk',
  title: 'the report writer (on a model disk)',
  task: 'The sandbox has no real disk, so model it: a joiner that assembles paths safely, and a disk object that files can be written to and read from.',
  steps: [
    <>
      Write <code>joinPath(...parts)</code> — rest parameters (3.10) gather any number of
      segments; return them joined with <code>"/"</code> (arrays know how). Print{' '}
      <code>joinPath("reports", "day1", "report.txt")</code>.
    </>,
    <>
      Model the disk: <code>const disk = {'{}'}</code>. Write{' '}
      <code>writeFile(disk, path, content)</code> storing the content under that path — the path
      arrives as a string variable, so choose the property syntax accordingly (4.4).
    </>,
    <>
      Write <code>readFile(disk, path)</code> returning what’s stored. Write the line{' '}
      <code>"suite: 12 passed, 1 failed"</code> to the joined path, read it back, print it.
    </>,
  ],
  starter: '',
  expectedOutput: ['reports/day1/report.txt', 'suite: 12 passed, 1 failed'],
  mustUse: [
    { test: /\(\s*\.\.\.\w+\s*\)/, label: 'joinPath gathers with rest parameters (...parts)' },
    { test: /\.join\s*\(\s*["']\/["']\s*\)/, label: 'segments are joined with .join("/")' },
    { test: /disk\s*\[\s*path\s*\]/, label: 'the disk is addressed with dynamic brackets: disk[path]' },
    { test: /function\s+writeFile\s*\(|const\s+writeFile\s*=/, label: 'a function named writeFile' },
    { test: /function\s+readFile\s*\(|const\s+readFile\s*=/, label: 'a function named readFile' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']suite: 12/, label: 'no hard-coded report line in the print — read it from the disk' },
  ],
  modelAnswer: `function joinPath(...parts) {
  return parts.join("/");
}

console.log(joinPath("reports", "day1", "report.txt"));

const disk = {};

function writeFile(disk, path, content) {
  disk[path] = content;
}

function readFile(disk, path) {
  return disk[path];
}

const reportPath = joinPath("reports", "day1", "report.txt");
writeFile(disk, reportPath, "suite: 12 passed, 1 failed");
console.log(readFile(disk, reportPath));`,
}

export const lesson95: LessonDef = {
  id: '9.5',
  hook: (
    <>
      <p>
        Here it is — the first thing Node does that a browser is FORBIDDEN to do:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          touch real files on the real disk
        </HighlightMark>
        . (Imagine any webpage you visit reading your documents — that’s why pages are sandboxed.
        Node is a program on YOUR computer; files are its birthright.)
      </p>
      <p>
        For a tester this is home turf: every run writes reports, screenshots, videos, traces.
        Today: write, read, build paths that survive Windows, and untangle the two meanings of
        “here.”
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'new-power',
      caption:
        'Why browsers can’t: any webpage running with disk access could read your documents and mail them home — so the browser sandbox forbids it entirely. Node has no such wall: it’s a program YOU chose to run, like any installed app. Files are fair game.',
      highlightLines: [1],
    },
    {
      id: 'write',
      caption:
        'writeFileSync("report.txt", line) — two arguments, path and content, and a REAL file materializes on your disk (silently overwriting if it already existed — there is no undo). Watch the tree: report.txt just appeared.',
      highlightLines: [4, 5],
    },
    {
      id: 'read',
      caption:
        'readFileSync("report.txt", "utf8") reads it back as a string. The second argument matters: "utf8" says “decode the bytes into text.” Forget it and you get a raw byte buffer — a mistake everyone makes exactly once.',
      highlightLines: [7, 8],
    },
    {
      id: 'sync-blocking',
      caption:
        'About that Sync suffix: it means BLOCKING — 6.1’s word, precisely. The thread stands and waits for the disk to finish. For a small script or test setup, perfectly fine. For a server juggling users, it’s the frozen page again — which is why promise flavors exist (fs/promises + await).',
      highlightLines: [5, 7],
    },
    {
      id: 'node-builtins',
      caption:
        'Look at line 1’s import: from "node:fs". fs isn’t from npm — it ships WITH Node, a BUILT-IN module. The node: prefix marks the standard library: fs, path, process, and friends. Zero installs; they were in the box.',
      highlightLines: [1, 2],
    },
    {
      id: 'path-join',
      caption:
        'Now paths. Never glue them with + and "/" — Windows separates with \\ while Mac and Linux use /. path.join("reports", "day1", "report.txt") assembles the right separator for whatever OS is running. 1.6’s string-gluing officially retires from path duty.',
      highlightLines: [10, 11],
    },
    {
      id: 'cwd',
      caption:
        'And the subtlest idea today: there are TWO different “here”s. process.cwd() — current working directory — is where the TERMINAL stood when it launched you (9.2’s pwd). It changes depending on where the runner was standing.',
      highlightLines: [13],
    },
    {
      id: 'cwd-bug',
      caption:
        'The other “here” is the script file’s own home folder — fixed, wherever the file lives. Relative paths like "report.txt" resolve against CWD, not the file’s home. Hence the classic bug: the script works when run from the repo root, and “can’t find the file” from anywhere else.',
      highlightLines: [13, 14],
    },
    {
      id: 'artifacts',
      caption:
        'Why this is tester home turf: every test run WRITES. Playwright drops an HTML report into playwright-report/, and screenshots, videos, and traces into test-results/ — created with exactly the tools you just used. When Phase 11 says “open the report,” you’ll know precisely what wrote it, and where.',
      highlightLines: [4, 5],
    },
    {
      id: 'gitignore',
      caption:
        'Last habit: those output folders are REGENERABLE — any run rebuilds them — so they join node_modules in .gitignore. 8.2’s rule, now a principle: the repo holds sources, never products. Commit the test that makes the screenshot, never the screenshot.',
      highlightLines: [5],
    },
  ],
  Viz: FolderTree,
  underTheHood: (
    <>
      <p>
        The promise flavor looks like this:{' '}
        <code>import {'{ readFile }'} from "node:fs/promises"</code> then{' '}
        <code>const text = await readFile("report.txt", "utf8")</code> — 6.6’s machinery verbatim,
        and the version servers use so the thread never stands in line. 9.6 shows what happens
        backstage while it waits.
      </p>
      <p>
        The classic cwd-proof pattern used <code>__dirname</code> — “this file’s folder” — glued
        with <code>path.join(__dirname, "data.json")</code>. In ESM files (9.3!){' '}
        <code>__dirname</code> doesn’t exist (it came from the CommonJS wrapper); the modern
        replacement is <code>import.meta.dirname</code>. Same idea: anchor to the FILE, not the
        terminal.
      </p>
      <p>
        More of the fs toolbox, for recognition: <code>mkdirSync(path, {'{ recursive: true }'})</code>{' '}
        builds folder chains, <code>existsSync</code> answers “is it there?”, <code>readdirSync</code>{' '}
        lists a folder (ls, programmatically), <code>rmSync</code> deletes. Test setup and teardown
        are made of these.
      </p>
      <p>
        Job note: “where did my screenshot go?” is a genuine daily question. The answer is always
        some path.join of an output folder, resolved against cwd — which is why CI configs run
        suites from the repo root, every time, on purpose.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'readFileSync("report.txt") without "utf8" as the second argument hands you not text but raw ___? (one word)',
      accept: ['bytes', 'a buffer', 'buffer', 'Buffer', 'raw bytes', 'binary'],
      placeholder: 'one word…',
      why: 'Raw bytes (a Buffer) — "utf8" tells fs to decode them into a string. A mistake everyone makes exactly once.',
    },
    {
      kind: 'type-output',
      question: 'Why path.join("a", "b") instead of "a" + "/" + "b" — which operating system uses a DIFFERENT path separator?',
      accept: ['Windows', 'windows', 'windows uses \\', 'Windows (backslash)'],
      placeholder: 'OS name…',
      why: 'Windows separates with \\ while Mac/Linux use /. path.join picks the right one for the running OS — glued strings break the moment CI runs on a different system.',
    },
    {
      kind: 'type-output',
      question: 'A script does readFileSync("data.json"). You run it from a different folder than the script lives in. Does "data.json" resolve against the terminal’s folder (cwd) or the script’s folder?',
      accept: ['cwd', 'the terminal', 'terminal', "the terminal's folder", 'cwd (the terminal’s folder)', 'the cwd'],
      placeholder: 'cwd / script’s folder…',
      why: 'Relative paths resolve against process.cwd() — where the terminal stood at launch. That’s the “works from repo root, breaks from a subfolder” bug in one sentence.',
    },
  ],
  PlayExtra: () => <CodeExercise def={FS_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend: why Node can touch files when browsers can’t, what the Sync suffix means, why path.join beats gluing strings, and the difference between cwd and the script’s own folder.',
    modelAnswer:
      'Browsers forbid file access because any webpage could otherwise read your disk and send it home — pages run sandboxed. Node is different: it’s a program you deliberately run on your own computer, so files are fair game. writeFileSync(path, content) creates or overwrites a real file; readFileSync(path, "utf8") reads one back, with "utf8" meaning “decode the bytes into text.” The Sync suffix means blocking — the thread stands and waits for the disk, which is fine in scripts and test setup, but servers use the promise flavor (fs/promises with await) so the thread stays free. Both fs and path are built-in modules that ship with Node — the node: prefix in the import marks the standard library. Paths are never glued with + because Windows separates with backslash while Mac and Linux use slash: path.join("reports", "day1", "file.txt") assembles the correct separator for the running OS. And there are two different “here”s: process.cwd() is where the terminal stood when it launched the program — relative paths resolve against THAT — while the script’s own folder is wherever the file lives. Confusing the two causes the classic “works from the repo root, breaks from a subfolder” bug. Testers live on all of this: Playwright writes its reports, screenshots, and traces with exactly these tools — into regenerable folders that belong in .gitignore.',
  },
  recap: [
    'Node touches the real disk (browsers are sandboxed away from it): writeFileSync(path, content) creates/overwrites; readFileSync(path, "utf8") reads text. Sync = BLOCKING; fs/promises + await is the non-blocking flavor.',
    'fs and path ship with Node ("node:" = built-in, no install). Never glue paths — path.join picks / or \\ per OS.',
    'Two “here”s: process.cwd() = the terminal’s folder (relative paths resolve HERE) vs the script’s own home. Test artifacts (playwright-report/, test-results/) are written with these tools — and belong in .gitignore.',
  ],
}
