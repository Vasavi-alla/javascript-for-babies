import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.7 — Storage & timing
 * localStorage (persists) vs sessionStorage (dies with the tab) vs cookies
 * (the one sent to the server); everything stored is a STRING. Then the
 * page-load timeline: DOMContentLoaded (tree ready) vs load (everything
 * ready) — the timing gap behind a lot of test flakiness.
 */

const CODE = `localStorage.setItem("theme", "dark");
console.log(localStorage.getItem("theme"));

localStorage.setItem("user", JSON.stringify({ name: "Vasavi" }));
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name);

sessionStorage.setItem("draft", "hello");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");
});

window.addEventListener("load", () => {
  console.log("everything loaded");
});`

interface Entry {
  key: string
  value: string
}
interface View {
  localStore: Entry[]
  sessionStore: Entry[]
  timelineAt: 'none' | 'domcontentloaded' | 'load'
  console: string[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the storage/timeline */
  badge?: string
}

const VIEWS: View[] = [
  {
    localStore: [{ key: 'theme', value: '"dark"' }], sessionStore: [], timelineAt: 'none', console: ['dark'],
    note: 'localStorage.setItem / getItem — a key-value STRING store',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }], sessionStore: [], timelineAt: 'none', console: ['dark'],
    note: 'and it stays put',
    badge: 'it PERSISTS across reloads and browser restarts — scoped to this website only (its origin)',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [], timelineAt: 'none', console: ['dark', 'Vasavi'],
    note: 'everything stored is a STRING — objects need JSON.stringify going in, JSON.parse coming out (4.13)',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'none', console: ['dark', 'Vasavi'],
    note: 'sessionStorage: the SAME api, but cleared the moment the TAB closes — "this visit only" data',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'none', console: ['dark', 'Vasavi'],
    note: 'a third option, older and different',
    badge: 'cookies are sent to the SERVER with every request — exactly why login/session tests care about them, while storage stays client-only',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'domcontentloaded', console: ['dark', 'Vasavi', 'DOM ready'],
    note: 'DOMContentLoaded fires once the HTML is parsed and the tree exists — images and stylesheets may still be loading',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'load', console: ['dark', 'Vasavi', 'DOM ready', 'everything loaded'],
    note: 'the "load" event fires LATER — only once EVERYTHING (images, stylesheets, iframes) has actually finished',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'load', console: ['dark', 'Vasavi', 'DOM ready', 'everything loaded'],
    note: 'that gap is a real source of flakiness',
    badge: 'click too early — before layout settles — and a test can miss a moving target. Part of why auto-waiting (11.5) exists.',
  },
  {
    localStore: [{ key: 'theme', value: '"dark"' }, { key: 'user', value: '{"name":"Vasavi"}' }], sessionStore: [{ key: 'draft', value: '"hello"' }], timelineAt: 'load', console: ['dark', 'Vasavi', 'DOM ready', 'everything loaded'],
    note: 'and this is exactly what testers reuse',
    badge: 'Playwright’s storageState saves/restores localStorage + cookies between test runs — "log in once, reuse it everywhere" is exactly this mechanism',
  },
]

function StorageTimeline({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 336" className="w-full">
      <text x={24} y={22} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">localStorage</text>
      <RoughRect x={20} y={28} width={200} height={64} seed={1191} strokeWidth={1.8} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      {view.localStore.map((e, i) => (
        <motion.text key={e.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={30} y={48 + i * 20} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
          {e.key}: {e.value}
        </motion.text>
      ))}

      <text x={232} y={22} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">sessionStorage</text>
      <RoughRect x={228} y={28} width={190} height={64} seed={1192} strokeWidth={1.8} stroke="var(--color-pencil-blue)" fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      {view.sessionStore.map((e, i) => (
        <motion.text key={e.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={238} y={48 + i * 20} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-pencil-blue)">
          {e.key}: {e.value}
        </motion.text>
      ))}

      <text x={24} y={116} fontFamily="var(--font-hand)" fontSize={12.5} fill="var(--color-ink-soft)">page-load timeline</text>
      <RoughRect x={20} y={122} width={400} height={4} seed={1193} strokeWidth={1} fill="var(--color-ink-soft)" fillStyle="solid" />
      <circle cx={150} cy={124} r={8} fill={view.timelineAt === 'domcontentloaded' || view.timelineAt === 'load' ? 'var(--color-marker-teal)' : 'var(--color-paper-raised, #fff)'} stroke="var(--color-ink)" strokeWidth={1.6} />
      <text x={150} y={148} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">DOMContentLoaded</text>
      <circle cx={350} cy={124} r={8} fill={view.timelineAt === 'load' ? 'var(--color-marker-teal)' : 'var(--color-paper-raised, #fff)'} stroke="var(--color-ink)" strokeWidth={1.6} />
      <text x={350} y={148} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={10} fill="var(--color-ink-soft)">load</text>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={168} width={380} height={34} seed={1194} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={188} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={222} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      <RoughRect x={20} y={238} width={400} height={50} seed={1195} strokeWidth={1.5} />
      <text x={32} y={234} fontFamily="var(--font-hand)" fontSize={11} fill="var(--color-ink-soft)">console</text>
      <text x={32} y={256} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
        {view.console.slice(0, 2).join('  ·  ')}
      </text>
      <text x={32} y={274} fontFamily="var(--font-code)" fontSize={9.5} fill="var(--color-ink)">
        {view.console.slice(2).join('  ·  ')}
      </text>
    </svg>
  )
}

const STORAGE_MODEL_EXERCISE: CodeExerciseDef = {
  id: 'l77-storagemodel',
  title: 'build the localStorage shape',
  task: 'The sandbox has no real localStorage — so build a tiny working model of it: the exact three-verb shape the real API has.',
  steps: [
    <>
      An object <code>store</code>, starting empty (<code>{'{}'}</code>) — the raw key-value
      data.
    </>,
    <>
      Three functions: <code>setItem(key, value)</code> (writes <code>String(value)</code> into{' '}
      <code>store</code>), <code>getItem(key)</code> (returns the value, or <code>null</code> if
      the key is missing), <code>removeItem(key)</code> (deletes the key).
    </>,
    <>
      <code>setItem("theme", "dark")</code>, print <code>getItem("theme")</code>. Then{' '}
      <code>removeItem("theme")</code>, print <code>getItem("theme")</code> again — must now be{' '}
      <code>null</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['dark', 'null'],
  mustUse: [
    { test: /function\s+setItem\s*\(\s*key\s*,\s*value\s*\)/, label: 'setItem(key, value) writes into the store' },
    { test: /function\s+getItem\s*\(\s*key\s*\)/, label: 'getItem(key) reads from the store' },
    { test: /function\s+removeItem\s*\(\s*key\s*\)/, label: 'removeItem(key) deletes the key' },
    { test: /delete\s+store\s*\[\s*key\s*\]/, label: 'removeItem actually deletes the property' },
  ],
  mustNotUse: [
    { test: /localStorage/, label: 'no real localStorage here — you ARE localStorage today' },
  ],
  modelAnswer: `const store = {};

function setItem(key, value) {
  store[key] = String(value);
}

function getItem(key) {
  return key in store ? store[key] : null;
}

function removeItem(key) {
  delete store[key];
}

setItem("theme", "dark");
console.log(getItem("theme"));

removeItem("theme");
console.log(getItem("theme"));`,
}

export const lesson77: LessonDef = {
  id: '7.7',
  hook: (
    <>
      <p>
        Every mutation you've made (7.3) forgets everything the instant the page reloads —
        except when it doesn't. Today: the browser's built-in memory that survives a refresh (or
        deliberately doesn't), and{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          the two moments a page actually finishes loading
        </HighlightMark>
        .
      </p>
      <p>
        Both halves of this lesson matter for the exact same reason: they're about state and
        timing that a script — yours, or a testing tool's — needs to get right, or it quietly
        breaks.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'set-get',
      caption:
        'localStorage.setItem(key, value) writes; localStorage.getItem(key) reads. A plain key-value store, always dealing in strings.',
      highlightLines: [1, 2],
    },
    {
      id: 'persists',
      caption:
        'And it stays put: unlike a JS variable (gone the instant the page reloads), localStorage PERSISTS across reloads and even browser restarts — scoped to this website only (its origin).',
      highlightLines: [1, 2],
    },
    {
      id: 'objects-need-json',
      caption:
        'Everything stored is a STRING, no exceptions. Storing an object means JSON.stringify going in — and JSON.parse coming back out to use it as an object again (4.13’s wire format, doing double duty).',
      highlightLines: [4, 5, 6],
    },
    {
      id: 'sessionstorage-diff',
      caption:
        'sessionStorage offers the exact same three methods — but its data is cleared the moment the TAB closes. Good for "just this visit" state that shouldn’t outlive the tab.',
      highlightLines: [8],
    },
    {
      id: 'cookies-tie-in',
      caption:
        'A third option, older and structurally different: cookies. Unlike storage, cookies are sent to the SERVER with every single request — which is exactly why login and session tests care about them specifically.',
      highlightLines: [8],
    },
    {
      id: 'domcontentloaded',
      caption:
        'Now the timing half: DOMContentLoaded fires once the browser has parsed the HTML and the tree (7.1) fully exists — but images and stylesheets may still be loading in the background.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'load-event',
      caption:
        'The "load" event fires LATER — only once EVERYTHING on the page (every image, every stylesheet, every iframe) has actually finished. Two separate finish lines, not one.',
      highlightLines: [14, 15, 16],
    },
    {
      id: 'timing-payoff',
      caption:
        'That gap between the two is a real source of flaky tests: click a button whose position depends on an image that hasn’t loaded yet, and you can miss a target that’s still moving. Part of why Playwright’s auto-waiting exists at all.',
      highlightLines: [10, 14],
    },
    {
      id: 'storagestate-tie-in',
      caption:
        'And storage comes back for the job payoff: Playwright’s storageState feature saves localStorage and cookies to a file and restores them before a test run — "log in once, reuse it everywhere" is exactly the mechanism you just learned.',
      highlightLines: [1, 4],
    },
  ],
  Viz: StorageTimeline,
  underTheHood: (
    <>
      <p>
        Storage limits and precision: localStorage/sessionStorage are typically capped around{' '}
        5–10MB per origin (fine for settings and drafts, not for real datasets).
      </p>
      <p>
        And every read/write is SYNCHRONOUS — it blocks the thread briefly, unlike the async
        IndexedDB you might meet for larger data.
      </p>
      <p>
        Cookies carry two protections storage doesn't: <code>HttpOnly</code> (invisible to
        JavaScript entirely — a security measure against script-based theft) and{' '}
        <code>Secure</code> (sent only over HTTPS).
      </p>
      <p>
        That's exactly why your test's own JS often <em>can't</em> read a login cookie directly —
        Playwright manages cookies through its own API instead, sidestepping the restriction
        properly.
      </p>
      <p>
        Job note: <code>browserContext.storageState()</code> captures localStorage and cookies to
        a file in one call; loading that file before a test skips a slow login flow entirely —
        one of the biggest, cheapest speed wins in a real test suite, built entirely on today's
        two topics.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'localStorage.setItem("count", 5) stores a number. Type the TYPE that getItem("count") returns:',
      accept: ['string', 'a string', 'String'],
      placeholder: 'one word…',
      why: 'A string — "5", not 5. Everything in localStorage/sessionStorage is a string; numbers get silently converted going in.',
    },
    {
      kind: 'type-output',
      question: 'Does sessionStorage survive closing and reopening the browser tab? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — sessionStorage is cleared the moment its tab closes. localStorage is the one that survives; that’s the entire difference between them.',
    },
    {
      kind: 'type-output',
      question: 'Which fires FIRST — DOMContentLoaded or load? Type it.',
      accept: ['DOMContentLoaded', 'domcontentloaded', 'DOM ready'],
      placeholder: 'the event name…',
      why: 'DOMContentLoaded — the tree just needs to be parsed. load waits for every image, stylesheet, and iframe to finish, which always takes at least as long, often longer.',
    },
  ],
  PlayExtra: () => <CodeExercise def={STORAGE_MODEL_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend the difference between localStorage, sessionStorage, and cookies — and why DOMContentLoaded and load are two separate events instead of one.',
    modelAnswer:
      'localStorage and sessionStorage share the same three-method API (setItem, getItem, removeItem) and both only ever store strings — objects need JSON.stringify going in and JSON.parse coming out. The difference is lifetime: localStorage persists across reloads and even browser restarts, scoped to the website’s origin; sessionStorage is wiped the moment its tab closes. Cookies are the odd one out structurally: unlike storage, which never leaves the browser, cookies are sent to the server with every request, which is exactly why login and session state often rides on them specifically. Separately, a page’s loading has two real finish lines: DOMContentLoaded fires as soon as the HTML is parsed and the DOM tree exists, while images, stylesheets, and iframes may still be loading; load fires later, once every one of those has actually finished. That gap matters for testing — clicking something whose layout depends on a still-loading image can hit a moving target, which is part of why tools like Playwright build in automatic waiting instead of assuming a page is “ready” the instant the tree exists.',
  },
  recap: [
    'localStorage persists across restarts; sessionStorage dies with its tab. Both are string-only, origin-scoped. Cookies are the odd one out — sent to the SERVER with every request.',
    'Everything you store is a string: JSON.stringify going in, JSON.parse coming out — 4.13’s wire-format discipline, reused.',
    'DOMContentLoaded = tree ready; load = everything (images, styles, iframes) actually finished. The gap between them is a real source of "clicked too early" test flakiness.',
  ],
}
