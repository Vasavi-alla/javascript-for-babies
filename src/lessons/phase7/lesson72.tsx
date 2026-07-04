import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.2 — Selecting elements (THE locator skill)
 * querySelector/querySelectorAll + the CSS selector language: tag, .class,
 * #id, [attr], combinations and descent. The single most transferable
 * syntax of the automation career — Playwright locators speak it natively.
 */

const CODE = `document.querySelector("li")
// first <li> in the tree

document.querySelectorAll("li.todo")
// ALL <li class="todo"> — a NodeList

document.querySelector("#items")
// the id — unique per page

document.querySelector("ul#items li.done")
// descent: a .done li INSIDE #items

document.querySelector("[data-test=submit]")
// by attribute — the tester's favorite`

interface Row {
  html: string
  match: boolean
}
interface View {
  selector: string
  anatomy: string
  rows: Row[]
  note: string
  /** a small appearing annotation for steps that add insight without changing the matches */
  badge?: string
}

const ROWS_BASE = [
  { html: '<h1>My List</h1>', match: false },
  { html: '<li class="todo">milk</li>', match: false },
  { html: '<li class="todo done">mom</li>', match: false },
  { html: '<button data-test="submit">', match: false },
]

const VIEWS: View[] = [
  {
    selector: 'li', anatomy: 'tag name — every <li>',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 1 || i === 2 })),
    note: 'the simplest selector: the tag itself — querySelector returns the FIRST match',
  },
  {
    selector: 'li', anatomy: 'tag name — every <li>',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 1 || i === 2 })),
    note: 'its sibling wants ALL of them',
    badge: 'querySelectorAll("li") returns every match as a NodeList — loopable with for...of, spreadable with [...list]',
  },
  {
    selector: '.todo', anatomy: 'dot = class — anything carrying class "todo"',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 1 || i === 2 })),
    note: 'classes are the everyday workhorse — many elements can share one',
  },
  {
    selector: '.todo.done', anatomy: 'two dots chained = BOTH classes on one element',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 2 })),
    note: 'li.todo.done narrows: tag AND class AND class — no spaces means same element',
  },
  {
    selector: '#items', anatomy: 'hash = id — unique per page (one match, ever)',
    rows: ROWS_BASE.map((r) => ({ ...r, match: false })),
    note: 'ids are singular by contract — querySelector’s natural partner',
  },
  {
    selector: '#items', anatomy: 'hash = id — unique per page (one match, ever)',
    rows: ROWS_BASE.map((r) => ({ ...r, match: false })),
    note: 'fast and precise — with a tradeoff',
    badge: 'brittle if developers change ids between releases — a pain later lessons solve with user-facing locators (the syntax stays)',
  },
  {
    selector: 'ul li.done', anatomy: 'SPACE = descent — a .done li ANYWHERE inside a ul',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 2 })),
    note: 'the space means “inside” — read selectors right-to-left: a li.done, within a ul',
  },
  {
    selector: '[data-test=submit]', anatomy: 'brackets = attribute — matches on any attribute value',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 3 })),
    note: 'data-test attributes exist FOR tests — styling never touches them, so they survive redesigns',
  },
  {
    selector: '[data-test=submit]', anatomy: 'brackets = attribute — matches on any attribute value',
    rows: ROWS_BASE.map((r, i) => ({ ...r, match: i === 3 })),
    note: 'the automation profession’s handshake with developers',
    badge: 'when you can request a data-test attribute at work, do — it’s the most stable selector there is',
  },
]

function SelectorLab({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 326" className="w-full">
      <RoughRect x={60} y={30} width={320} height={38} seed={1121} strokeWidth={2.2} fill="var(--color-marker-yellow)" fillStyle="solid" />
      <text x={220} y={54} textAnchor="middle" fontFamily="var(--font-code)" fontSize={14} fontWeight={700} fill="var(--color-ink)">
        {view.selector}
      </text>
      <AnimatePresence mode="wait">
        <motion.text key={view.anatomy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={88} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
          {view.anatomy}
        </motion.text>
      </AnimatePresence>

      {view.rows.map((r, i) => (
        <motion.g key={r.html} animate={{ opacity: 1 }}>
          <RoughRect x={60} y={104 + i * 36} width={264} height={28} seed={1125 + i} strokeWidth={r.match ? 2.4 : 1.4} stroke={r.match ? 'var(--color-marker-teal)' : 'var(--color-ink-soft)'} fill={r.match ? 'color-mix(in srgb, var(--color-marker-teal) 12%, transparent)' : 'var(--color-paper-raised, #fff)'} fillStyle="solid" />
          <text x={72} y={122 + i * 36} fontFamily="var(--font-code)" fontSize={10} fill="var(--color-ink)">{r.html}</text>
          <AnimatePresence>
            {r.match && (
              <motion.text key={`m-${view.selector}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} x={344} y={124 + i * 36} fontSize={15} fontWeight={700} fill="var(--color-marker-teal)">
                ✓
              </motion.text>
            )}
          </AnimatePresence>
        </motion.g>
      ))}

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={276} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={292} width={380} height={28} seed={1131} strokeWidth={1.6} stroke="var(--color-pencil-blue)" fill="color-mix(in srgb, var(--color-pencil-blue) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={310} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const MATCHER_EXERCISE: CodeExerciseDef = {
  id: 'l72-matcher',
  title: 'build a tiny selector engine',
  task: 'Nothing demystifies selectors like implementing one. Given nodes as plain objects, write match(node, selector) for the three core forms — the same logic every browser runs a million times a day.',
  steps: [
    <>
      Nodes look like <code>{'{ tag: "li", id: "top", classes: ["todo", "done"] }'}</code>. Build
      an array <code>nodes</code> with: an <code>h1</code> (id <code>"title"</code>, no classes),
      a <code>li</code> with classes <code>["todo"]</code>, and a <code>li</code> with classes{' '}
      <code>["todo", "done"]</code>.
    </>,
    <>
      Write <code>match(node, sel)</code>: if <code>sel</code> starts with <code>#</code> compare
      the id; if it starts with <code>.</code> check <code>classes.includes</code>; otherwise
      compare the tag.
    </>,
    <>
      Print how many nodes match <code>".todo"</code>, then how many match <code>"li"</code>,
      then the id of the first <code>"#title"</code> match (use 4.10's find).
    </>,
  ],
  starter: '',
  expectedOutput: ['2', '2', 'title'],
  mustUse: [
    { test: /startsWith\s*\(\s*["']#["']\s*\)|sel\s*\[\s*0\s*\]\s*===\s*["']#["']/, label: 'the # form is detected and compared against id' },
    { test: /classes\.includes\s*\(/, label: 'the . form checks the classes array with includes' },
    { test: /\.filter\s*\(/, label: 'counting matches uses filter' },
    { test: /\.find\s*\(/, label: 'the single #title match comes from find' },
  ],
  mustNotUse: [
    { test: /querySelector/, label: 'no browser here — YOU are the selector engine today' },
  ],
  modelAnswer: `const nodes = [
  { tag: "h1", id: "title", classes: [] },
  { tag: "li", id: "a", classes: ["todo"] },
  { tag: "li", id: "b", classes: ["todo", "done"] },
];

function match(node, sel) {
  if (sel.startsWith("#")) {
    return node.id === sel.slice(1);
  }
  if (sel.startsWith(".")) {
    return node.classes.includes(sel.slice(1));
  }
  return node.tag === sel;
}

console.log(nodes.filter((n) => match(n, ".todo")).length);
console.log(nodes.filter((n) => match(n, "li")).length);
console.log(nodes.find((n) => match(n, "#title")).id);`,
}

export const lesson72: LessonDef = {
  id: '7.2',
  hook: (
    <>
      <p>
        If this curriculum could teach you only one syntax for your future job, it would be this
        one. Automation testing is, hour by hour, the craft of <em>pointing at elements</em> —
        "click <strong>that</strong> button, assert <strong>that</strong> message" — and the
        pointing language is{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          CSS selectors
        </HighlightMark>
        , spoken through <code>querySelector</code>.
      </p>
      <p>
        Five forms cover the working day: <code>tag</code>, <code>.class</code>, <code>#id</code>,{' '}
        <code>[attribute]</code>, and combinations with descent. Playwright's locators accept this
        exact language — lesson 11.3's <code>SelectorLab v2</code> is this lesson wearing a work
        badge. Learn it here where it's calm.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'tag',
      caption:
        'Form 1 — the bare tag: querySelector("li") walks the tree and returns the FIRST matching element (a live reference, 7.1).',
      highlightLines: [1, 2],
    },
    {
      id: 'queryselectorall',
      caption:
        'Its sibling querySelectorAll("li") returns ALL matches as a NodeList — array-like, loopable with for...of (4.8), spreadable into a real array with [...list] (4.11).',
      highlightLines: [4, 5],
    },
    {
      id: 'class',
      caption:
        'Form 2 — the dot means class: ".todo" matches anything carrying that class. Classes are the page’s everyday labels; expect to select by them constantly.',
      highlightLines: [4, 5],
    },
    {
      id: 'chained-class',
      caption:
        'Chain dots with NO space — "li.todo.done" — and every part must sit on the SAME element: an li, with todo, with done.',
      highlightLines: [4, 5],
    },
    {
      id: 'id',
      caption:
        'Form 3 — the hash means id: "#items". Ids are unique per page by contract, so this is the one-element selector — querySelector’s natural partner.',
      highlightLines: [7, 8],
    },
    {
      id: 'id-tradeoff',
      caption:
        'Fast, precise… and brittle if developers change ids between releases (a redesign pain 11.3 will solve with user-facing locators — but the syntax stays).',
      highlightLines: [7, 8],
    },
    {
      id: 'descent',
      caption:
        'Combining — the SPACE means descent: "ul#items li.done" reads right to left as “an li with class done, anywhere INSIDE the ul with id items.” The space crosses generations (children, grandchildren, all the way down). This is how you disambiguate: not “a delete button” but “the delete button inside the cart panel.”',
      highlightLines: [10, 11],
    },
    {
      id: 'attribute',
      caption:
        'Form 5 — brackets match attributes: "[data-test=submit]" finds elements by ANY attribute’s value. The data-test (or data-testid) convention is the automation profession’s handshake with developers: an attribute that exists ONLY for tests, that no redesign touches.',
      highlightLines: [13, 14],
    },
    {
      id: 'attribute-testid',
      caption:
        'When you can request one at work, do — it’s the most stable selector there is.',
      highlightLines: [13, 14],
    },
  ],
  Viz: SelectorLab,
  underTheHood: (
    <>
      <p>
        Why does JavaScript speak CSS here? Because stylesheets needed a "which elements does this
        rule hit" language first, and it was too good not to reuse — one grammar for styling,
        querying, and (in your future) locating. Engines match selectors <em>right to left</em>:
        for "ul li.done" they find li.done candidates first, then verify a ul ancestor — exactly
        how you should read them too.
      </p>
      <p>
        More grammar when you need it: <code>ul &gt; li</code> (child only, no grandchildren),{' '}
        <code>li:first-child</code> / <code>:nth-child(3)</code> (position),{' '}
        <code>[href^="https"]</code> (attribute prefix). Don't memorize the long tail — recognize
        it, and keep MDN's selector page bookmarked like every professional does.
      </p>
      <p>
        And the career footnote: DevTools Console understands <code>$('sel')</code> and{' '}
        <code>$$('sel')</code> as shorthand for querySelector/All — the fastest way to TEST a
        selector against a live page before it goes in a script. You'll do this daily; start
        today, F12 on any site.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'Write the selector that finds elements carrying BOTH classes "card" and "active" on the same element:',
      accept: ['.card.active', '.active.card'],
      placeholder: 'a selector…',
      why: 'Chained dots, no space: .card.active — every chained part must hold on ONE element. (A space between them would mean “.active somewhere inside .card” — a completely different question.)',
    },
    {
      kind: 'type-output',
      question: 'Write the selector for a <button> with attribute data-test="save":',
      accept: ['button[data-test=save]', 'button[data-test="save"]', "button[data-test='save']", '[data-test=save]', '[data-test="save"]'],
      placeholder: 'a selector…',
      why: 'Brackets match attributes: button[data-test="save"]. Test-only attributes are the most redesign-proof hooks a tester can have — ask your developers for them.',
    },
    {
      kind: 'type-output',
      question: 'In "nav a.external" — what does the SPACE mean? Type one word: inside or sibling.',
      accept: ['inside', 'Inside', 'descendant', 'descent', 'within'],
      placeholder: 'one word…',
      why: 'Inside (descent): an a.external anywhere within a nav — children, grandchildren, any depth. Read it right to left: the thing you want, then where it must live.',
    },
  ],
  PlayExtra: () => <CodeExercise def={MATCHER_EXERCISE} />,
  teachBack: {
    prompt:
      'Teach a friend the five selector forms with one example each — and explain why data-test attributes are the gold standard for automation, and what the space in a selector means.',
    modelAnswer:
      'Five forms: a bare tag ("li") matches by tag name; a dot (".todo") matches by class, and chained dots with no space (".todo.done") require both classes on the SAME element; a hash ("#items") matches the unique id — one element per page by contract; brackets ("[data-test=submit]") match by attribute value; and a SPACE means descent — "ul li.done" is an li.done anywhere INSIDE a ul, read right to left. querySelector returns the first live match, querySelectorAll returns all of them. data-test attributes are the tester’s gold standard because they exist purely for tests: no styling depends on them, so redesigns — new classes, moved ids, restyled tags — never break them. It’s the same selector language Playwright locators speak, which makes this the most transferable syntax of the job.',
  },
  recap: [
    'Five forms: tag · .class (chained = same element) · #id (unique) · [attr=value] · SPACE = descent (read right-to-left).',
    'querySelector → first live match; querySelectorAll → NodeList of all (loop with for...of, spread with [...]).',
    'data-test attributes = redesign-proof hooks made FOR tests. Try selectors live in DevTools with $() / $$() before scripting them.',
  ],
}
