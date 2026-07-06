import { AnimatePresence, motion } from 'motion/react'
import { HandArrow, RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'

/**
 * 8.2 — npm & package.json
 * The registry (packages = versioned modules), package.json as the project's
 * ID card, npm install → node_modules + lockfile, semver and ^/~ ranges,
 * scripts, dependencies vs devDependencies. Career thread: @playwright/test
 * is exactly one of these installs.
 */

const CODE = `// in the terminal:
//   npm install @playwright/test

// package.json — the project's ID card
{
  "name": "shop-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.2"
  }
}`

const WALL = ['@playwright/test', 'vitest', 'react', 'lodash', 'chalk', 'express']

interface View {
  mode: 'wall' | 'semver'
  wallGlow?: boolean
  hotPackage?: string
  installedArrow?: boolean
  hotRow?: 'id' | 'scripts' | 'dev' | 'modules' | 'lock' | null
  semverFocus?: 'parts' | 'ranges'
  console: string[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    mode: 'wall', console: [],
    note: 'you need a test runner, a color tool, a date library… strangers already wrote each one',
  },
  {
    mode: 'wall', wallGlow: true, console: [],
    note: 'npm: a public registry of ~2 million PACKAGES — versioned modules (8.1), free to install',
  },
  {
    mode: 'wall', hotRow: 'id', console: [],
    note: 'package.json = your project’s ID card: its name, its version, and everything it stands on',
  },
  {
    mode: 'wall', hotPackage: '@playwright/test', installedArrow: true, console: ['npm install @playwright/test'],
    note: 'one command, three effects: download it, record it in package.json, pin it in the lockfile',
  },
  {
    mode: 'wall', hotRow: 'modules', installedArrow: true, console: ['npm install @playwright/test'],
    note: 'node_modules/ = the downloaded code itself — huge, regenerable, never edited by hand',
    badge: 'first sighting of git: the project’s version-control memory — it records every change and shares them with the team. “Commit” = record. You’ll drive it properly on the job.',
  },
  {
    mode: 'semver', semverFocus: 'parts', console: [],
    note: 'a version has three dials: MAJOR (breaking) . MINOR (new but safe) . PATCH (fixes only)',
  },
  {
    mode: 'semver', semverFocus: 'ranges', console: [],
    note: '^1.44.2 = stay on 1.x, minor+patch welcome · ~1.44.2 = patches only · bare = exactly this',
  },
  {
    mode: 'wall', hotRow: 'lock', console: ['package-lock.json written'],
    note: 'the LOCKFILE pins the exact version of everything (dependencies of dependencies too)',
    badge: 'same lockfile → teammates and CI install the IDENTICAL tree. CI = continuous integration: a robot teammate that re-runs your suite on every change (Phase 11 builds one). Reproducibility is tester gold.',
  },
  {
    mode: 'wall', hotRow: 'scripts', console: ['npm run test  →  playwright test'],
    note: 'scripts = named terminal commands the project ships with: npm run test',
  },
  {
    mode: 'wall', hotRow: 'dev', console: [],
    note: 'dependencies = needed to RUN the app · devDependencies = needed to BUILD and TEST it',
    badge: 'test tools live in devDependencies — the shipped app never needs Playwright, only you do',
  },
  {
    mode: 'wall', console: [],
    note: 'one small file answers: what is this project, how do I run it, what does it stand on?',
    badge: 'the 8.6 checkpoint hands you a real package.json to decode line by line — you’re nearly ready',
  },
]

function PackageWall({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      {view.mode === 'wall' && (
        <g>
          {/* your project card */}
          <RoughRect x={24} y={36} width={168} height={168} seed={1401} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
          <text x={108} y={58} textAnchor="middle" fontFamily="var(--font-code)" fontSize={11} fontWeight={700} fill="var(--color-ink)">shop-tests</text>
          {[
            { key: 'id', label: 'name · version 1.0.0' },
            { key: 'scripts', label: 'scripts: test' },
            { key: 'dev', label: 'devDeps: ^1.44.2' },
            { key: 'lock', label: 'package-lock.json' },
            { key: 'modules', label: 'node_modules/ 📦📦📦' },
          ].map((row, i) => {
            const hot = view.hotRow === row.key
            return (
              <g key={row.key}>
                <RoughRect x={36} y={68 + i * 26} width={144} height={22} seed={1405 + i} strokeWidth={hot ? 2.4 : 1.2} stroke={hot ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'transparent'} fillStyle="solid" />
                <text x={108} y={83 + i * 26} textAnchor="middle" fontFamily="var(--font-code)" fontSize={8.5} fill={hot ? 'var(--color-ink)' : 'var(--color-ink-soft)'}>{row.label}</text>
              </g>
            )
          })}

          {/* the community wall */}
          <text x={318} y={30} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fill={view.wallGlow ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'}>
            the npm registry
          </text>
          {WALL.map((name, i) => {
            const col = i % 2
            const row = Math.floor(i / 2)
            const hot = view.hotPackage === name
            return (
              <g key={name}>
                <RoughRect x={240 + col * 92} y={40 + row * 56} width={84} height={44} seed={1420 + i} strokeWidth={hot ? 2.6 : view.wallGlow ? 2 : 1.4} stroke={hot ? 'var(--color-marker-coral)' : view.wallGlow ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={hot ? 'color-mix(in srgb, var(--color-marker-coral) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
                <text x={282 + col * 92} y={66 + row * 56} textAnchor="middle" fontFamily="var(--font-code)" fontSize={7.5} fill="var(--color-ink)">{name}</text>
              </g>
            )
          })}
          <text x={330} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">…and ~2,000,000 more</text>

          <AnimatePresence>
            {view.installedArrow && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <HandArrow from={{ x: 238, y: 62 }} to={{ x: 196, y: 96 }} curve={0.25} seed={1430} stroke="var(--color-marker-coral)" strokeWidth={2.2} />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      )}

      {view.mode === 'semver' && (
        <g>
          <text x={220} y={46} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={14} fill="var(--color-ink-soft)">
            reading a version number
          </text>
          {[
            { part: '1', label: 'MAJOR', sub: 'breaking changes', color: 'var(--color-marker-coral)' },
            { part: '44', label: 'MINOR', sub: 'new, but safe', color: 'var(--color-marker-teal)' },
            { part: '2', label: 'PATCH', sub: 'bug fixes only', color: 'var(--color-pencil-blue)' },
          ].map((seg, i) => (
            <g key={seg.label}>
              <RoughRect x={64 + i * 112} y={64} width={92} height={64} seed={1440 + i} strokeWidth={2.2} stroke={seg.color} fill={`color-mix(in srgb, ${seg.color} 10%, transparent)`} fillStyle="solid" />
              <text x={110 + i * 112} y={96} textAnchor="middle" fontFamily="var(--font-code)" fontSize={20} fontWeight={700} fill="var(--color-ink)">{seg.part}</text>
              <text x={110 + i * 112} y={118} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={11} fontWeight={700} fill={seg.color}>{seg.label}</text>
              <text x={110 + i * 112} y={146} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10.5} fill="var(--color-ink-soft)">{seg.sub}</text>
              {i < 2 && <text x={158 + i * 112} y={100} textAnchor="middle" fontFamily="var(--font-code)" fontSize={18} fill="var(--color-ink-soft)">.</text>}
            </g>
          ))}
          {view.semverFocus === 'ranges' && (
            <g>
              {[
                { range: '^1.44.2', means: '1.44.2 → 1.99.99 ok · never 2.0.0' },
                { range: '~1.44.2', means: '1.44.2 → 1.44.99 ok · never 1.45' },
                { range: '1.44.2', means: 'exactly this, nothing else' },
              ].map((r, i) => (
                <g key={r.range}>
                  <text x={92} y={188 + i * 24} fontFamily="var(--font-code)" fontSize={11.5} fontWeight={700} fill="var(--color-ink)">{r.range}</text>
                  <text x={180} y={188 + i * 24} fontFamily="var(--font-hand)" fontSize={11.5} fill="var(--color-ink-soft)">{r.means}</text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={252} width={380} fontSize={9.5} seed={1450} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={290} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={312} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          terminal: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const PKG_EXERCISE: CodeExerciseDef = {
  id: 'l82-pkg-reader',
  title: 'read a package.json like a tool would',
  task: 'npm itself is just a program reading this file. Build a tiny reader: count the dev tools, then list the available script names.',
  steps: [
    <>
      Create <code>pkg</code>: an object with <code>name</code> set to <code>"shop-tests"</code>, a{' '}
      <code>scripts</code> object holding <code>test: "playwright test"</code> and{' '}
      <code>report: "playwright show-report"</code>, and a <code>devDependencies</code> object
      holding <code>"@playwright/test": "^1.44.2"</code> and <code>"vitest": "^1.6.0"</code>.
    </>,
    <>
      Print how many packages sit in <code>devDependencies</code> — count its keys (4.8 gave you
      the tool).
    </>,
    <>
      Then print each script NAME (not its command), one per line, in the order written — loop
      over the keys.
    </>,
  ],
  starter: '',
  expectedOutput: ['2', 'test', 'report'],
  mustUse: [
    { test: /Object\.keys\s*\(\s*pkg\.devDependencies\s*\)/, label: 'the count comes from Object.keys(pkg.devDependencies)' },
    { test: /Object\.keys\s*\(\s*pkg\.scripts\s*\)/, label: 'the script names come from Object.keys(pkg.scripts)' },
    { test: /for\s*\(\s*const\s+\w+\s+of\s+/, label: 'a for...of loop prints the names' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']test["']\s*\)/, label: 'no hard-coded "test" — read it from the object' },
    { test: /console\.log\s*\(\s*["']2["']?\s*\)|console\.log\s*\(\s*2\s*\)/, label: 'no hard-coded 2 — count the keys' },
  ],
  modelAnswer: `const pkg = {
  name: "shop-tests",
  scripts: {
    test: "playwright test",
    report: "playwright show-report",
  },
  devDependencies: {
    "@playwright/test": "^1.44.2",
    "vitest": "^1.6.0",
  },
};

console.log(Object.keys(pkg.devDependencies).length);

for (const name of Object.keys(pkg.scripts)) {
  console.log(name);
}`,
}

export const lesson82: LessonDef = {
  id: '8.2',
  hook: (
    <>
      <p>
        Yesterday your files shared code with each other. Today the walls come down further:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          npm lets your project import code written by strangers — about two million packages of
          it
        </HighlightMark>
        , including Playwright itself. One command installs a package; one small file,{' '}
        <code>package.json</code>, keeps the records.
      </p>
      <p>
        This file is the first thing you’ll open in every project at work. By the end of this
        lesson — and the 8.6 checkpoint — you’ll read one like a mechanic reads an engine plate.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'dont-rewrite',
      caption:
        'The problem first: your test project needs a runner, readable console colors, maybe date handling. Writing all of that yourself would take months — and strangers have already written, tested, and polished each piece.',
      highlightLines: [1, 2],
    },
    {
      id: 'npm-registry',
      caption:
        'npm is the public registry where that work lives: about two million PACKAGES. A package is just modules (8.1) zipped up, versioned, and published under a name — @playwright/test is one of them.',
      highlightLines: [2],
    },
    {
      id: 'package-json',
      caption:
        'Your side of the deal is package.json — the project’s ID card. It names the project, states its version, and lists everything the project stands on. It’s plain JSON: keys and values, no code.',
      highlightLines: [5, 6, 7],
    },
    {
      id: 'install',
      caption:
        'npm install @playwright/test does three things at once: downloads the package, records the dependency in package.json — that’s how line 12 got there — and pins the exact result in a lockfile. One command, three effects — watch the card plug in.',
      highlightLines: [2, 12],
    },
    {
      id: 'node-modules',
      caption:
        'The downloaded code itself lands in a folder called node_modules/ — often enormous, because packages bring their own dependencies. Three rules: never edit it, never commit it to git (the project’s version-control memory — see the note below), and never fear deleting it — npm install rebuilds it from the records.',
      highlightLines: [12],
    },
    {
      id: 'semver',
      caption:
        'Now the version number: 1.44.2 is three dials, MAJOR.MINOR.PATCH. MAJOR changes may BREAK your code. MINOR adds features without breaking anything. PATCH only fixes bugs. The scheme has a name: semantic versioning — “semver.”',
      highlightLines: [12],
    },
    {
      id: 'ranges',
      caption:
        'The ^ in "^1.44.2" is a RANGE: accept any 1.x.y from 1.44.2 up — minor and patch updates welcome, MAJOR jumps forbidden. A ~ would allow patches only, and a bare 1.44.2 means exactly that version, nothing else.',
      highlightLines: [12],
    },
    {
      id: 'lockfile',
      caption:
        'Ranges create a question: if ^1.44.2 allows many versions, which one did you ACTUALLY get? package-lock.json answers it — the exact version of every package installed, including dependencies of dependencies. Same lockfile in, identical node_modules out.',
      highlightLines: [12],
    },
    {
      id: 'scripts',
      caption:
        'The scripts field gives the project named commands: npm run test executes playwright test. Every README’s “npm install, npm run test” ritual is just these two ideas — restore the packages, run the named script.',
      highlightLines: [8, 9, 10],
    },
    {
      id: 'dev-dependencies',
      caption:
        'Last field: devDependencies versus dependencies. dependencies are what the app needs to RUN in production (production = the live site real users visit); devDependencies are what humans need while building and testing it. Playwright lives in dev — users of the shop never run your tests.',
      highlightLines: [11, 12, 13],
    },
    {
      id: 'roundup',
      caption:
        'Step back: one small file now answers what this project is, how to run it, and what it stands on. That’s why package.json is the first file professionals open in an unfamiliar repo — and the 8.6 checkpoint will hand you a real one to prove it.',
      highlightLines: [5, 6, 7, 8, 11],
    },
  ],
  Viz: PackageWall,
  underTheHood: (
    <>
      <p>
        Semver is a <strong>promise, not physics</strong>: package authors sometimes ship a
        breaking change in a “minor” by accident. The lockfile is your seatbelt — nothing changes
        until you deliberately update.
      </p>
      <p>
        On CI servers you’ll usually see <code>npm ci</code> instead of <code>npm install</code>:
        it installs <em>exactly</em> what the lockfile says and fails loudly if package.json and
        the lockfile disagree. Reproducible installs are the foundation reproducible test runs
        stand on.
      </p>
      <p>
        Your two devDependencies quietly pull in dozens of packages of their own — the dependency
        graph from 8.1 again, now stretching across the internet. That’s also the caution: anyone
        can publish to npm, so professionals install well-known names and watch for typos
        (<code>playwrite</code> is not <code>playwright</code>).
      </p>
      <p>
        Programmers joke that node_modules is “the heaviest object in the universe”. The joke
        exists because a modest project can easily download hundreds of megabytes of dependency
        code. Now you know exactly which folder to blame — and why it can be regenerated.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'package.json says "vitest": "^1.6.0". Can npm install give you vitest 2.0.0? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — ^ stays within the same MAJOR version. Minor and patch updates are allowed; the breaking 2.0.0 jump is not.',
    },
    {
      kind: 'type-output',
      question: 'Which file records the EXACT versions actually installed — package.json or package-lock.json?',
      accept: ['package-lock.json', 'package-lock', 'the lockfile', 'lockfile'],
      placeholder: 'file name…',
      why: 'package.json holds the ranges you asked for; package-lock.json pins the exact tree you got — so teammates and CI install identical code.',
    },
    {
      kind: 'type-output',
      question: 'The scripts field has "test": "playwright test". What do you type in the terminal to run it (starting with npm)?',
      accept: ['npm run test', 'npm test'],
      placeholder: 'npm …',
      why: 'npm run test — and because "test" is special, the shorthand npm test works too. Scripts are the project’s named commands.',
    },
  ],
  PlayExtra: () => <CodeExercise def={PKG_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend what happens when you run npm install @playwright/test — name the three effects — and then what ^1.44.2 permits and why the lockfile exists anyway.',
    modelAnswer:
      'npm is a public registry of about two million packages — modules zipped up, versioned, and published. Running npm install @playwright/test does three things: it downloads the package’s code into the node_modules folder, it records the dependency in package.json, and it pins the exact result in package-lock.json. The version it records is a range: ^1.44.2 means “any 1.x.y from 1.44.2 upward” — minor releases (new features, safe) and patches (bug fixes) are welcome, but a MAJOR jump to 2.0.0 is forbidden because major means breaking changes. Since a range permits many versions, the lockfile answers the question “which one did I actually get?” — it lists the exact version of everything installed, including dependencies of dependencies, so a teammate or a CI server running npm ci gets an identical node_modules. And the folder itself is disposable: never edit it, never commit it; the records can always rebuild it.',
  },
  recap: [
    'npm = the public registry of packages (versioned modules). npm install downloads to node_modules/, records in package.json, pins in package-lock.json — one command, three effects.',
    'Semver: MAJOR.MINOR.PATCH = breaking · new-but-safe · fixes-only. ^ allows minor+patch, ~ allows patch only, bare = exact. The lockfile pins what you actually got.',
    'scripts = the project’s named commands (npm run test). Test tools live in devDependencies — the shipped app doesn’t need them, you do.',
  ],
}
