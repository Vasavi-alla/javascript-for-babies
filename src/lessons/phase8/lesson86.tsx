import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'
import { WrapTspans } from '../../design/WrapTspans'
import { SvgBadge } from '../../design/SvgBadge'
import { JobScene, Scene, Takeaway, Key, ChatBubble } from '../../design/JobScene'

/**
 * 8.6 — Checkpoint: dependency detective
 * A real Playwright project's package.json, decoded line by line with
 * everything from 8.1–8.5: modules switch, scripts, semver ranges, dev-only
 * deps, and the telling absence of "dependencies". Case board viz: each
 * finding becomes a pinned sticky.
 */

const CODE = `{
  "name": "shop-e2e",
  "version": "2.3.1",
  "type": "module",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "report": "playwright show-report",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "@playwright/test": "^1.44.2",
    "typescript": "~5.4.5"
  }
}`

interface Sticky {
  label: string
  color: string
}
interface View {
  stickies: Sticky[]
  verdict?: boolean
  console: string[]
  note: string
  badge?: string
}

const TEAL = 'var(--color-marker-teal)'
const CORAL = 'var(--color-marker-coral)'
const BLUE = 'var(--color-pencil-blue)'

const S_ID: Sticky = { label: 'shop-e2e v2.3.1 — the suite has semver too', color: TEAL }
const S_MODULE: Sticky = { label: '"type": "module" → import/export live here', color: BLUE }
const S_TEST: Sticky = { label: 'npm run test → playwright test', color: TEAL }
const S_HEADED: Sticky = { label: 'test:headed → same runner, browser visible', color: TEAL }
const S_TYPECHECK: Sticky = { label: 'typecheck → tsc --noEmit (check, output nothing)', color: BLUE }
const S_PW: Sticky = { label: '@playwright/test ^1.44.2 → any 1.x ≥ 1.44.2', color: TEAL }
const S_TS: Sticky = { label: 'typescript ~5.4.5 → patches only', color: BLUE }
const S_NODEPS: Sticky = { label: 'no "dependencies" AT ALL — ships nothing to production', color: CORAL }

const VIEWS: View[] = [
  {
    stickies: [], console: [],
    note: 'the case: an unfamiliar repo, one open file — brief the team using nothing else',
  },
  {
    stickies: [S_ID], console: [],
    note: 'name + version: this is the test suite “shop-e2e”, itself versioned 2.3.1 (8.2’s dials)',
  },
  {
    stickies: [S_ID, S_MODULE], console: [],
    note: '"type": "module" flips Node’s switch: these files speak import/export (8.1)',
    badge: 'without this line, Node defaults to its older require system — exactly the 9.3 story ahead',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST], console: ['npm run test'],
    note: 'scripts, clue one: the whole suite runs with npm run test → playwright test',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED], console: ['npm run test:headed'],
    note: 'test:headed passes a FLAG through: same runner, but the browser stays visible to watch',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED, S_TYPECHECK], console: ['npm run typecheck'],
    note: 'typecheck = 8.5 in one script: tsc reads every file, reports type errors, emits nothing',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED, S_TYPECHECK, S_PW], console: [],
    note: 'dev tool one: @playwright/test at ^1.44.2 — minor and patch updates welcome, 2.0.0 forbidden',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED, S_TYPECHECK, S_PW, S_TS], console: [],
    note: 'dev tool two: typescript at ~5.4.5 — the stricter tilde: PATCHES only',
    badge: 'deliberate caution: a new TS minor can flag new errors in old code, so teams upgrade it on purpose, not by accident',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED, S_TYPECHECK, S_PW, S_TS, S_NODEPS], console: [],
    note: 'the telling ABSENCE: no "dependencies" field. A pure test suite runs FOR the team, never IN production',
  },
  {
    stickies: [S_ID, S_MODULE, S_TEST, S_HEADED, S_TYPECHECK, S_PW, S_TS, S_NODEPS], verdict: true, console: [],
    note: 'case closed: project identified, commands known, toolchain decoded — from ONE file',
    badge: 'next phase: Node.js itself — the runtime every one of these commands stands on',
  },
]

function CaseBoard({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 320" className="w-full">
      <text x={24} y={26} fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
        the detective’s case board
      </text>
      {view.stickies.length === 0 && (
        <text x={220} y={130} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          (no findings pinned yet — step through the file)
        </text>
      )}
      {view.stickies.map((sticky, i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        return (
          <motion.g key={sticky.label} initial={{ opacity: 0, y: -10, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: col === 0 ? -1.2 : 1.2 }} transition={{ type: 'spring', damping: 15 }}>
            <RoughRect x={26 + col * 200} y={38 + row * 52} width={188} height={44} seed={1801 + i} strokeWidth={1.8} stroke={sticky.color} fill={`color-mix(in srgb, ${sticky.color} 9%, transparent)`} fillStyle="solid" />
            <text x={120 + col * 200} y={54 + row * 52} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-ink)">
              <WrapTspans text={sticky.label} x={120 + col * 200} maxPx={176} fontSize={9.5} />
            </text>
          </motion.g>
        )
      })}

      {view.verdict && (
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 13 }}>
          <RoughRect x={130} y={246} width={180} height={30} seed={1820} strokeWidth={2.4} stroke={TEAL} fill={`color-mix(in srgb, ${TEAL} 12%, transparent)`} fillStyle="solid" />
          <text x={220} y={266} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill={TEAL}>
            CASE CLOSED ✓
          </text>
        </motion.g>
      )}

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <SvgBadge text={view.badge} cx={220} cy={244} width={392} fontSize={9.5} seed={1830} color="var(--color-pencil-blue)" />
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={292} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)"><WrapTspans text={view.note} x={220} maxPx={420} fontSize={12} /></motion.text>
      </AnimatePresence>

      {view.console.length > 0 && (
        <text x={220} y={314} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink-soft)">
          terminal: {view.console.join('  ·  ')}
        </text>
      )}
    </svg>
  )
}

const DETECTIVE_EXERCISE: CodeExerciseDef = {
  id: 'l86-detective',
  title: 'the automated detective',
  task: 'You’ve read a package.json by eye — now write the program that briefs the team automatically, plus a range-reader that decodes semver prefixes.',
  steps: [
    <>
      Create <code>pkg</code>: <code>name</code> set to <code>"shop-e2e"</code>, a{' '}
      <code>scripts</code> object with <code>test: "playwright test"</code> and{' '}
      <code>report: "playwright show-report"</code>, and a <code>devDependencies</code> object
      with <code>"@playwright/test": "^1.44.2"</code> and <code>"typescript": "~5.4.5"</code>.
    </>,
    <>
      Write <code>brief(pkg)</code> returning the one-line summary{' '}
      <code>shop-e2e · 2 scripts · 2 dev tools</code> — built with a template literal (1.6) and
      key-counting (4.8), never hard-coded.
    </>,
    <>
      Write <code>allowsMinor(range)</code>: <code>true</code> exactly when the range string
      starts with <code>"^"</code> (strings are indexable — 1.6).
    </>,
    <>
      Print <code>brief(pkg)</code>, then <code>allowsMinor</code> of the Playwright range, then
      of the TypeScript range.
    </>,
  ],
  starter: '',
  expectedOutput: ['shop-e2e · 2 scripts · 2 dev tools', 'true', 'false'],
  mustUse: [
    { test: /Object\.keys/, label: 'counts come from Object.keys(...)' },
    { test: /`/, label: 'the briefing line is a template literal' },
    { test: /function\s+allowsMinor\s*\(|const\s+allowsMinor\s*=/, label: 'a function named allowsMinor' },
    { test: /startsWith\s*\(|\[\s*0\s*\]|charAt\s*\(\s*0\s*\)/, label: 'the range check inspects the FIRST character (startsWith, [0], or charAt(0))' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*["']shop-e2e · 2/, label: 'no hard-coded briefing — build it from the object' },
    { test: /console\.log\s*\(\s*(true|false)\s*\)/, label: 'no hard-coded true/false — allowsMinor must decide' },
  ],
  modelAnswer: `const pkg = {
  name: "shop-e2e",
  scripts: {
    test: "playwright test",
    report: "playwright show-report",
  },
  devDependencies: {
    "@playwright/test": "^1.44.2",
    "typescript": "~5.4.5",
  },
};

function brief(pkg) {
  const scripts = Object.keys(pkg.scripts).length;
  const tools = Object.keys(pkg.devDependencies).length;
  return \`\${pkg.name} · \${scripts} scripts · \${tools} dev tools\`;
}

function allowsMinor(range) {
  return range.startsWith("^");
}

console.log(brief(pkg));
console.log(allowsMinor(pkg.devDependencies["@playwright/test"]));
console.log(allowsMinor(pkg.devDependencies["typescript"]));`,
}

export const lesson86: LessonDef = {
  id: '8.6',
  hook: (
    <>
      <p>
        Checkpoint. No new concepts today — instead, the professional rite of passage:{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          open an unfamiliar project’s package.json and explain every single line
        </HighlightMark>
        . The file on the right is a realistic Playwright test project — the kind you’ll be handed
        in week one of the job.
      </p>
      <p>
        Everything you need is already yours: modules (8.1), npm and semver (8.2), tsc (8.5).
        Pin each finding to the case board.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'briefing',
      caption:
        'The case: you’ve just joined a team. Someone says “the e2e repo is yours now” and walks away. You open ONE file — this one — and by the end of it you can brief the team on what the project is, how to run it, and what it stands on. Let’s read like a detective: every line is evidence.',
      highlightLines: [1],
    },
    {
      id: 'name-version',
      caption:
        'Lines 2–3: the identity. This project is shop-e2e — by convention, “end-to-end tests for the shop.” And the suite itself is versioned: 2.3.1, the same MAJOR.MINOR.PATCH dials from 8.2. Test suites are software too; they release, they version, they change.',
      highlightLines: [2, 3],
    },
    {
      id: 'type-module',
      caption:
        'Line 4: "type": "module" — small line, big switch. It tells Node that every .js file in this project speaks import/export (8.1’s syntax) rather than Node’s older require system. Without this line, import would be a syntax error here. (The full two-systems story is 9.3 — soon.)',
      highlightLines: [4],
    },
    {
      id: 'script-test',
      caption:
        'The scripts block — the project’s control panel. Clue one: "test": "playwright test". So npm run test launches the Playwright runner on the whole suite. This single line tells you what KIND of project this is before you’ve seen any other file.',
      highlightLines: [5, 6],
    },
    {
      id: 'script-headed',
      caption:
        'Clue two: "test:headed": "playwright test --headed" — the same runner with a flag passed through. Headless (no visible browser) is the default for speed; --headed opens a real window so a human can WATCH the test drive the page. Debugging gold.',
      highlightLines: [7],
    },
    {
      id: 'script-typecheck',
      caption:
        'Clues three and four: "report" replays the last run’s results page, and "typecheck": "tsc --noEmit" is 8.5 in one line — run the TypeScript checker across every file, report errors, emit nothing. Teams run this in CI so type mistakes can’t even merge.',
      highlightLines: [8, 9],
    },
    {
      id: 'dep-playwright',
      caption:
        'devDependencies, tool one: "@playwright/test": "^1.44.2". You can decode this cold now: the caret accepts any 1.x.y from 1.44.2 upward — new features and fixes welcome, the breaking 2.0.0 jump forbidden. The lockfile (unseen, but implied) pins what’s actually installed.',
      highlightLines: [11, 12],
    },
    {
      id: 'dep-typescript',
      caption:
        'Tool two: "typescript": "~5.4.5" — the STRICTER tilde: patch releases only, no new minors. A deliberate choice: a new TypeScript minor can start flagging errors in previously-clean code, so teams upgrade it on purpose, not by surprise. Range choices carry intent.',
      highlightLines: [13],
    },
    {
      id: 'the-absence',
      caption:
        'Now the detective’s favorite evidence — what ISN’T there. No "dependencies" field at all. Recall 8.2: dependencies are what ships to production; devDependencies are the workshop tools. A pure test suite ships NOTHING — it runs for the team, never inside the product. The absence tells you the project’s whole nature.',
      highlightLines: [11],
    },
    {
      id: 'case-closed',
      caption:
        'Case closed. From one file you extracted: what the project is (shop’s e2e suite, v2.3.1), the module system it speaks, four runnable commands, its complete toolchain with exact update policies, and the fact it ships nothing. That’s the brief — and that’s the skill. Now automate it below.',
      highlightLines: [1, 15],
    },
  ],
  Viz: CaseBoard,
  underTheHood: (
    <>
      <p>
        Real package.json files carry more optional fields.{' '}
        <code>"private": true</code> means never publish this to the registry — standard on test
        suites. <code>engines</code> lists which Node versions are supported.{' '}
        <code>packageManager</code> pins npm itself. Same reading skill, more lines of evidence.
      </p>
      <p>
        The <code>test:headed</code> pattern generalizes: script names with a colon are just a
        naming convention (<code>test:api</code>, <code>test:smoke</code>) — npm treats them as
        ordinary names. And scripts can call each other, building small pipelines.
      </p>
      <p>
        Why trust the file at all? Because <code>npm ci</code> (8.2) enforces it: CI installs
        exactly what package.json + lockfile declare, or fails loudly. The file isn’t
        documentation that might lie — it’s configuration that’s executed. That’s why reading it
        first is reading the truth.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'This project has devDependencies but NO dependencies field. Does a pure test suite ship code to production? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — tests run FOR the team, never inside the shipped product. That’s why every tool here is a devDependency, and the absence of "dependencies" is itself evidence.',
    },
    {
      kind: 'type-output',
      question: '"typescript": "~5.4.5" — can npm install give this project TypeScript 5.5.0? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — tilde allows PATCHES only (5.4.x). A new minor like 5.5.0 could flag new type errors, so the team chose to adopt minors deliberately.',
    },
    {
      kind: 'type-output',
      question: 'Which line makes import/export legal in this project’s files — type the field name.',
      accept: ['type', '"type"', 'type: module', '"type": "module"', 'type module'],
      placeholder: 'field name…',
      why: '"type": "module" switches Node to the modern module system from 8.1. Without it, require is the default — the two-system story 9.3 tells in full.',
    },
  ],
  onTheJob: (
    <JobScene>
      <Scene>One day, an interviewer will ask you this exact question:</Scene>
      <ChatBubble who="interviewer" face="🙂">Walk me through this package.json.</ChatBubble>
      <ChatBubble who="you, after this lesson" face="😊" accent indent>
        dependencies ship to production. devDependencies are for testing and tooling only. The
        caret in a version number allows minor updates, never major ones.
      </ChatBubble>
      <Takeaway>
        <Key>This tests your semver literacy and dev-vs-prod judgment.</Key> A real screening
        question for QA-automation roles.
      </Takeaway>
    </JobScene>
  ),
  PlayExtra: () => <CodeExercise def={DETECTIVE_EXERCISE} />,
  teachBack: {
    prompt:
      'The full detective brief: explain this package.json to a new teammate — identity, the module switch, what each script does, both version ranges (and why they differ), and what the missing dependencies field proves.',
    modelAnswer:
      'This is shop-e2e, the shop’s end-to-end test suite, itself versioned 2.3.1. "type": "module" switches Node to the modern import/export module system, so every file here uses 8.1’s syntax. The scripts block is the control panel: npm run test launches the Playwright runner headless; test:headed is the same runner with the --headed flag so you can watch the browser; report reopens the last run’s results; and typecheck runs tsc --noEmit — the TypeScript checker across all files, reporting errors without producing output, usually enforced in CI. Two dev tools: @playwright/test at ^1.44.2, where the caret accepts any 1.x from 1.44.2 up but forbids the breaking 2.0.0; and typescript at ~5.4.5, where the stricter tilde allows only patches — deliberate, because a new TS minor can flag new errors in old code, so the team adopts minors on purpose. The lockfile pins whatever versions were actually installed so CI gets an identical tree. And the loudest clue is an absence: there is no dependencies field at all, which proves this project ships nothing to production — it’s a pure test suite, tools-only, run for the team.',
  },
  recap: [
    'Reading order for any package.json: name/version → "type" (module system) → scripts (the control panel) → dependencies vs devDependencies (ship vs workshop) → ranges (^ minor+patch, ~ patch-only).',
    'Absences are evidence: no "dependencies" = ships nothing = pure test suite. Range choices carry intent (~ on typescript = adopt minors deliberately).',
    'Phase 8 complete: modules, npm, the debugger, ?./??, TypeScript — the professional’s toolbox. Next: Node.js, the runtime it all stands on.',
  ],
}
