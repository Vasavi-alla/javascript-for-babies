import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { HighlightMark } from '../../design/HighlightMark'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.3 — Reading & changing the DOM
 * textContent vs innerHTML (and the injection danger), classList's verbs,
 * attributes, creating/appending/removing nodes. Every mutation repaints.
 */

const CODE = `const title = document.querySelector("h1");

console.log(title.textContent);   // read
title.textContent = "Shopping";   // write (safe)

title.classList.add("big");
title.classList.toggle("dark");
title.setAttribute("data-test", "hdr");

const li = document.createElement("li");
li.textContent = "buy tea";
document.querySelector("ul").append(li);

li.remove();`

interface View {
  el: { tag: string; classes: string[]; attrs: string[]; text: string }
  extra?: string | null
  gone?: boolean
  note: string
  /** a small two-line appearing annotation for steps that add insight without changing the element */
  badgeLine1?: string
  badgeLine2?: string
}

const VIEWS: View[] = [
  { el: { tag: 'h1', classes: [], attrs: [], text: 'My List' }, note: 'reading: textContent hands you the words inside — just a string' },
  { el: { tag: 'h1', classes: [], attrs: [], text: 'Shopping' }, note: 'writing textContent swaps the text node — the page repaints instantly' },
  { el: { tag: 'h1', classes: ['big', 'dark'], attrs: [], text: 'Shopping' }, note: 'classList: add / remove / toggle / contains — never rebuild the class string by hand' },
  { el: { tag: 'h1', classes: ['big', 'dark'], attrs: ['data-test="hdr"'], text: 'Shopping' }, note: 'setAttribute writes any attribute — including the tester hooks from 7.2' },
  { el: { tag: 'h1', classes: ['big', 'dark'], attrs: ['data-test="hdr"'], text: 'Shopping' }, extra: '<li>buy tea</li> appended to the ul', note: 'create → fill → append: a node born in JS joins the tree — and appears on screen' },
  { el: { tag: 'h1', classes: ['big', 'dark'], attrs: ['data-test="hdr"'], text: 'Shopping' }, extra: null, gone: true, note: 'li.remove() unhooks it from the tree — unreachable soon after (5.7 sweeps it)' },
  {
    el: { tag: 'h1', classes: ['big', 'dark'], attrs: ['data-test="hdr"'], text: 'Shopping' }, extra: null, gone: true,
    note: 'now the landmine',
    badgeLine1: 'el.innerHTML = userInput PARSES the string as HTML',
    badgeLine2: 'user data goes through textContent, NEVER innerHTML',
  },
]

function MutationView({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 316" className="w-full">
      <text x={24} y={30} fontFamily="var(--font-hand)" fontSize={13.5} fill="var(--color-ink-soft)">
        the element, live — every edit repaints the page
      </text>
      <RoughRect x={70} y={46} width={300} height={120} seed={1141} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <text x={84} y={74} fontFamily="var(--font-code)" fontSize={12} fill="var(--color-ink)">
        &lt;{view.el.tag}
        {view.el.classes.length > 0 ? ` class="${view.el.classes.join(' ')}"` : ''}
      </text>
      {view.el.attrs.map((a, i) => (
        <motion.text key={a} initial={{ opacity: 0 }} animate={{ opacity: 1 }} x={110} y={94 + i * 18} fontFamily="var(--font-code)" fontSize={11.5} fill="var(--color-marker-teal)">
          {a}
        </motion.text>
      ))}
      <AnimatePresence mode="popLayout">
        <motion.text key={view.el.text} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} x={220} y={view.el.attrs.length ? 134 : 116} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={19} fontWeight={700} fill="var(--color-ink)">
          {view.el.text}
        </motion.text>
      </AnimatePresence>

      <AnimatePresence>
        {view.extra && (
          <motion.g key="extra" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }}>
            <RoughRect x={110} y={180} width={220} height={30} seed={1145} strokeWidth={1.8} stroke="var(--color-marker-teal)" fill="color-mix(in srgb, var(--color-marker-teal) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={200} textAnchor="middle" fontFamily="var(--font-code)" fontSize={10.5} fill="var(--color-ink)">{view.extra}</text>
          </motion.g>
        )}
        {view.gone && (
          <motion.text key="gone" initial={{ opacity: 1 }} animate={{ opacity: 0.5 }} x={220} y={200} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fill="var(--color-ink-soft)">
            (removed — the broom is coming, 5.7)
          </motion.text>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={230} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={12.5} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>

      {/* badge — a small two-line appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badgeLine1 && (
          <motion.g key={view.badgeLine1} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <RoughRect x={30} y={246} width={380} height={54} seed={1146} strokeWidth={1.6} stroke="var(--color-marker-coral)" fill="color-mix(in srgb, var(--color-marker-coral) 10%, transparent)" fillStyle="solid" />
            <text x={220} y={266} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-marker-coral)">
              {view.badgeLine1}
            </text>
            <text x={220} y={284} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-marker-coral)">
              {view.badgeLine2}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

const CLASSLIST_EXERCISE: CodeExerciseDef = {
  id: 'l73-classlist',
  title: 'implement classList.toggle',
  task: 'The best way to trust a tool is to build its core once. Model an element’s classes as an array and implement the toggle verb — the exact logic behind every dark-mode switch on the web.',
  steps: [
    <>
      An object <code>el</code> with <code>classes</code> = <code>["todo"]</code>.
    </>,
    <>
      A function <code>toggle(el, name)</code>: if <code>name</code> is present in{' '}
      <code>el.classes</code>, REMOVE it (4.9's filter builds the new array); if absent, ADD it
      (push). Return nothing — mutate the object (4.6, knowingly!).
    </>,
    <>
      Toggle <code>"done"</code> (→ added), print the classes joined by a space; toggle{' '}
      <code>"done"</code> again (→ removed), print again.
    </>,
  ],
  starter: '',
  expectedOutput: ['todo done', 'todo'],
  mustUse: [
    { test: /\.includes\s*\(/, label: 'presence is checked with includes' },
    { test: /\.filter\s*\(/, label: 'removal filters the class out' },
    { test: /\.push\s*\(/, label: 'addition pushes the class in' },
    { test: /\.join\s*\(\s*["'] ["']\s*\)/, label: 'printing joins with a space — the class string, rebuilt' },
  ],
  mustNotUse: [
    { test: /classList/, label: 'no real classList in the sandbox — you ARE classList today' },
  ],
  modelAnswer: `const el = { classes: ["todo"] };

function toggle(el, name) {
  if (el.classes.includes(name)) {
    el.classes = el.classes.filter((c) => c !== name);
  } else {
    el.classes.push(name);
  }
}

toggle(el, "done");
console.log(el.classes.join(" "));

toggle(el, "done");
console.log(el.classes.join(" "));`,
}

export const lesson73: LessonDef = {
  id: '7.3',
  hook: (
    <>
      <p>
        You can find any element (7.2). Now you get to <em>touch</em> them — and this is the
        moment JavaScript stops being a console language: every mutation you make to the tree{' '}
        <HighlightMark type="highlight" color="color-mix(in srgb, var(--color-marker-yellow) 45%, transparent)">
          appears on screen, instantly
        </HighlightMark>
        . Change a text node — the page changes. Add a class — the styling flips. Append a node —
        content EXISTS where there was none.
      </p>
      <p>
        Four verbs run the show: read/write text, juggle classes, set attributes, create/remove
        nodes. Plus one security landmine (<code>innerHTML</code>) that every beginner must meet{' '}
        <em>before</em> production meets them.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'read-text',
      caption:
        'title.textContent reads the words inside the element — a plain string.',
      highlightLines: [1],
    },
    {
      id: 'write-text',
      caption:
        'ASSIGN to it and the element’s text node is swapped: the page now says "Shopping". textContent treats everything as literal text, which is exactly what makes it safe — remember that word for a few steps from now.',
      highlightLines: [3, 4],
    },
    {
      id: 'classlist',
      caption:
        'Element classes drive styling, so they change constantly — and classList is their proper toolkit: add("big"), remove("big"), toggle("dark") (add-if-absent, remove-if-present — every dark-mode button ever), contains("done") for checks. Never mangle the raw class string by hand; the verbs exist so you don’t have to.',
      highlightLines: [6, 7],
    },
    {
      id: 'attributes',
      caption:
        'setAttribute(name, value) writes any attribute — including data-test="hdr", 7.2’s tester hook, being born right here. getAttribute reads them. (Common ones also live as direct properties: el.id, el.href, input.value — 7.6 leans on that last one hard.)',
      highlightLines: [8],
    },
    {
      id: 'create-append',
      caption:
        'Making NEW content is a three-beat: document.createElement("li") births a node (existing in JS only — an object, not yet on any page), fill it (textContent), then append it into a parent already in the tree. The instant it joins the tree, it renders. This create→fill→append rhythm is how every feed, list, and chat message enters every page you’ve ever scrolled.',
      highlightLines: [10, 11, 12],
    },
    {
      id: 'remove',
      caption:
        'li.remove() unhooks the node — off the tree, off the screen, and (once your references drop) swept by 5.7’s collector.',
      highlightLines: [14],
    },
    {
      id: 'innerhtml-danger',
      caption:
        'Now the landmine: el.innerHTML = "<b>hi</b>" PARSES its string as HTML — powerful, and dangerous the moment user input touches it: a username like <img onerror="stealCookies()"> would EXECUTE. The rule that keeps you employed: user data goes through textContent, never innerHTML. (The attack has a name — XSS — and testers get paid to catch it.)',
      highlightLines: [14],
    },
  ],
  Viz: MutationView,
  underTheHood: (
    <>
      <p>
        Precision on the pair everyone confuses: <code>textContent</code> gets/sets the raw text
        (fast, safe, no parsing); <code>innerHTML</code> gets/sets <em>markup</em> — reading it
        serializes the subtree to a string, writing it runs the parser and REPLACES all children.
        The security rule is one sentence: <strong>if a user typed it, it goes in textContent.</strong>{' '}
        XSS — script smuggled through markup — is one of the top web vulnerabilities, and test
        suites (yours, someday) include cases that try exactly that smuggle.
      </p>
      <p>
        Every mutation also nudges the rendering pipeline — the tree changed, so layout and paint
        re-run (lesson 7.8 walks that machinery). Batches of small edits are why real apps repaint
        smoothly and also why "the element exists but isn't PAINTED yet" moments happen — the root
        of flaky-test folklore, and of Playwright's auto-waiting cure (11.5).
      </p>
      <p>
        And a live reference reminder (7.1 + 4.6): hold <code>const el = querySelector(…)</code>{' '}
        once and mutate it all day — every change lands on the real tree through the same arrow.
        Playwright's locators behave like these references with retry logic bolted on.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A username typed by a user must be shown on the page. Which property do you assign — textContent or innerHTML?',
      accept: ['textContent', 'textcontent', 'text content'],
      placeholder: 'type it…',
      why: 'textContent — it treats the value as literal text, no parsing, no execution. innerHTML would parse it as markup, letting a malicious "username" smuggle running code (XSS).',
    },
    {
      kind: 'type-output',
      question: 'el has class "dark". After el.classList.toggle("dark") — is "dark" present? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — toggle removes what’s present, adds what’s absent. A second toggle would bring it back. One verb, both directions: the dark-mode special.',
    },
    {
      kind: 'type-output',
      question: 'createElement("li") makes a node. Is it visible on the page before you append it? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — it exists only as a JS object until it joins the tree. create → fill → append; rendering starts at the append. (Symmetrically, remove() unhooks and the pixels vanish.)',
    },
  ],
  PlayExtra: () => <CodeExercise def={CLASSLIST_EXERCISE} />,
  teachBack: {
    prompt:
      'Explain to a friend the four DOM mutation verbs (text, classes, attributes, create/remove) — and give them the one-sentence security rule about textContent vs innerHTML, with the reason behind it.',
    modelAnswer:
      'Reading and writing text: textContent gets or sets the words inside an element as a plain string — assign to it and the page updates instantly. Classes: classList carries the verbs — add, remove, toggle (add-if-absent/remove-if-present), contains — so styling states flip without hand-editing the class string. Attributes: setAttribute/getAttribute handle any attribute, including data-test hooks for automation. Structure: document.createElement births a node that exists only in JS; fill it, then append it into the tree — it renders the moment it joins; remove() unhooks it and the garbage collector eventually sweeps it. The security rule: if a user typed it, it goes in textContent, never innerHTML — because innerHTML PARSES its string as HTML, so hostile input can smuggle executable markup (XSS), while textContent shows the same characters as harmless literal text.',
  },
  recap: [
    'textContent = safe literal text (read/write). innerHTML = parsed MARKUP — never feed it user input (XSS).',
    'classList.add/remove/toggle/contains for styling states; setAttribute/getAttribute for attributes (incl. data-test hooks).',
    'create → fill → append to add content (renders on join); remove() to unhook (5.7 sweeps). Every mutation repaints — 7.8 shows how.',
  ],
}
