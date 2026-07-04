import { AnimatePresence, motion } from 'motion/react'
import { RoughRect } from '../../design/rough-svg'
import { CodeExercise } from '../../engine/practice/CodeExercise'
import type { CodeExerciseDef } from '../../engine/practice/types'
import type { LessonDef } from '../../engine/lesson/types'

/**
 * 7.9 — Checkpoint: the todo app, inspected
 * No new machinery. One small, real app that quietly exercises every Phase
 * 7 lesson: tree (7.1), selectors (7.2), mutation (7.3), events (7.4),
 * delegation (7.5), forms (7.6), storage (7.7), rendering (7.8). Then the
 * automation-tester payoff: inspect what you built with your own selectors.
 */

const CODE = `// <input data-test="new-todo">
// <form> ... </form>
// <ul id="todos"></ul>

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const li = document.createElement("li");
  li.textContent = input.value;
  li.className = "todo";
  list.append(li);
  saveTodos();
});

list.addEventListener("click", (event) => {
  if (event.target.matches(".todo")) {
    event.target.classList.toggle("done");
    saveTodos();
  }
});

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(readTodos()));
}`

interface Line {
  text: string
  tone?: 'ok' | 'bad'
}
interface View {
  title: string
  lines: Line[]
  note: string
  badge?: string
}

const VIEWS: View[] = [
  {
    title: 'the checkpoint: a todo app',
    lines: [
      { text: '7.1 tree · 7.2 selectors · 7.3 mutation' },
      { text: '7.4 events · 7.5 delegation' },
      { text: '7.6 forms · 7.7 storage · 7.8 rendering' },
    ],
    note: 'every Phase 7 concept lands in one small, real thing',
  },
  {
    title: 'the structure',
    lines: [
      { text: '<input data-test="new-todo">' },
      { text: '<form> … </form>' },
      { text: '<ul id="todos"> (starts empty) </ul>' },
    ],
    note: 'the DOM tree (7.1) this whole app grows from',
  },
  {
    title: 'adding a todo',
    lines: [
      { text: 'submit → preventDefault (7.6)', tone: 'ok' },
      { text: 'createElement("li") (7.3)', tone: 'ok' },
      { text: 'append to ul#todos (7.3)', tone: 'ok' },
    ],
    note: 'in the DOM now — visible once layout and paint (7.8) catch up',
  },
  {
    title: 'one listener, every item',
    lines: [
      { text: 'list.addEventListener("click", …) — ONCE' },
      { text: 'event.target tells you WHICH li fired' },
    ],
    note: 'delegation (7.5) — covers items added AFTER the listener too, with zero extra wiring',
  },
  {
    title: 'surviving a reload',
    lines: [
      { text: 'every change → localStorage.setItem (7.7)' },
      { text: 'on load → JSON.parse and rebuild the list' },
    ],
    note: 'refresh the page — the todos are still there',
  },
  {
    title: 'now: inspect it',
    lines: [
      { text: '#todos li.done', tone: 'ok' },
      { text: '[data-test="new-todo"]', tone: 'ok' },
    ],
    note: 'the exact skill from 7.2 — pointed at something YOU built',
  },
  {
    title: 'the daily rhythm',
    lines: [
      { text: 'build → inspect → write selectors → repeat' },
    ],
    note: 'that loop, compressed into one lesson, is an automation tester’s actual job',
    badge: 'every selector you’ll ever write in Phase 11 starts with exactly this question: “how do I point at THIS element?”',
  },
  {
    title: 'Phase 7, complete',
    lines: [
      { text: 'tree → selectors → mutation' },
      { text: 'events → bubbling/delegation' },
      { text: 'forms → storage → rendering' },
    ],
    note: 'Phase 8 next: modern JS & tooling',
  },
]

function TodoCheckpoint({ stepIndex }: { stepIndex: number }) {
  const view = VIEWS[stepIndex] ?? VIEWS[0]
  return (
    <svg viewBox="0 0 440 300" className="w-full">
      <RoughRect x={40} y={30} width={360} height={190} seed={1231} strokeWidth={2.2} fill="var(--color-paper-raised, #fff)" fillStyle="solid" />
      <AnimatePresence mode="wait">
        <motion.g key={view.title} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <text x={220} y={58} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={15} fontWeight={700} fill="var(--color-ink)">
            {view.title}
          </text>
          {view.lines.map((l, i) => (
            <text
              key={l.text}
              x={220}
              y={92 + i * 26}
              textAnchor="middle"
              fontFamily="var(--font-code)"
              fontSize={11.5}
              fontWeight={600}
              fill={l.tone === 'bad' ? 'var(--color-marker-coral)' : l.tone === 'ok' ? 'var(--color-marker-teal)' : 'var(--color-ink)'}
            >
              {l.text}
            </text>
          ))}
        </motion.g>
      </AnimatePresence>

      {/* badge — a small appearing annotation for elaboration steps */}
      <AnimatePresence mode="wait">
        {view.badge && (
          <motion.g key={view.badge} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <text x={220} y={202} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={9.5} fontWeight={700} fill="var(--color-pencil-blue)">
              {view.badge}
            </text>
          </motion.g>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.text key={view.note} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} x={220} y={250} textAnchor="middle" fontFamily="var(--font-hand)" fontSize={13} fontWeight={700} fill="var(--color-marker-teal)">
          {view.note}
        </motion.text>
      </AnimatePresence>
    </svg>
  )
}

const CORE_EXERCISE: CodeExerciseDef = {
  id: 'l79-core',
  title: 'part 1 — the todo core, without mutation',
  task: 'Build the app’s core logic in miniature: add and toggle, both as pure functions that return a NEW array — the same shape a delegated listener would call.',
  steps: [
    <>
      An array <code>todos</code>, starting empty.
    </>,
    <>
      <code>addTodo(todos, text)</code>: return a NEW array with{' '}
      <code>{'{ text, done: false }'}</code> appended (spread, 4.9 — never push onto the
      original).
    </>,
    <>
      <code>toggleTodo(todos, index)</code>: return a NEW array where ONLY the item at{' '}
      <code>index</code> has its <code>done</code> flipped (map, 4.9).
    </>,
    <>
      Add <code>"milk"</code>, then add <code>"eggs"</code>, then toggle index <code>0</code>.
      Print each todo as <code>"text (done)"</code> or <code>"text (not done)"</code>, joined by{' '}
      <code>", "</code>.
    </>,
  ],
  starter: '',
  expectedOutput: ['milk (done), eggs (not done)'],
  mustUse: [
    { test: /function\s+addTodo\s*\(\s*todos\s*,\s*text\s*\)/, label: 'addTodo(todos, text) returns a new array' },
    { test: /function\s+toggleTodo\s*\(\s*todos\s*,\s*index\s*\)/, label: 'toggleTodo(todos, index) returns a new array' },
    { test: /\.map\s*\(/, label: 'toggling uses map — a new array, not an in-place flip' },
  ],
  mustNotUse: [
    { test: /\.push\s*\(/, label: 'no push — addTodo must not mutate the original array' },
  ],
  modelAnswer: `function addTodo(todos, text) {
  return [...todos, { text, done: false }];
}

function toggleTodo(todos, index) {
  return todos.map((todo, i) => (i === index ? { ...todo, done: !todo.done } : todo));
}

let todos = [];
todos = addTodo(todos, "milk");
todos = addTodo(todos, "eggs");
todos = toggleTodo(todos, 0);

console.log(
  todos.map((t) => t.text + " (" + (t.done ? "done" : "not done") + ")").join(", ")
);`,
}

const RELOAD_EXERCISE: CodeExerciseDef = {
  id: 'l79-reload',
  title: 'part 2 — surviving a reload',
  task: 'Model what runs on every page load: parse a saved JSON string back into real todo objects and summarize them.',
  steps: [
    <>
      A string <code>saved</code> ={' '}
      <code>{'\'[{"text":"milk","done":true},{"text":"eggs","done":false}]\''}</code> — as if it
      just came from <code>localStorage.getItem("todos")</code>.
    </>,
    <>
      Parse it into a real array with <code>JSON.parse</code> (7.7).
    </>,
    <>
      Print the TOTAL number of todos, then how many are <code>done</code> (filter’s length,
      4.9).
    </>,
  ],
  starter: '',
  expectedOutput: ['2', '1'],
  mustUse: [
    { test: /JSON\.parse\s*\(\s*saved\s*\)/, label: 'the saved string is parsed with JSON.parse' },
    { test: /\.filter\s*\(/, label: 'counting the done ones uses filter' },
  ],
  mustNotUse: [
    { test: /console\.log\s*\(\s*2\s*\)|console\.log\s*\(\s*1\s*\)/, label: 'no hand-typed counts — the parse and filter must produce them' },
  ],
  modelAnswer: `const saved = '[{"text":"milk","done":true},{"text":"eggs","done":false}]';

const todos = JSON.parse(saved);

console.log(todos.length);
console.log(todos.filter((t) => t.done).length);`,
}

export const lesson79: LessonDef = {
  id: '7.9',
  hook: (
    <>
      <p>
        Eight lessons, one small app. A todo list is deliberately simple — and secretly uses
        every single piece of Phase 7 machinery you now own, end to end. Walk through building
        it here, then put the tester hat back on: it's about to become your own personal
        practice range.
      </p>
      <p>
        No new concepts today. Just proof that you can read, write, listen for, validate, save,
        and inspect a real interactive page — the whole job, in miniature.
      </p>
    </>
  ),
  code: CODE,
  steps: [
    {
      id: 'the-app',
      caption:
        'The checkpoint project: a todo app. Every concept from this phase — tree, selectors, mutation, events, delegation, forms, storage, rendering — lands somewhere in these twenty lines.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'structure',
      caption:
        'The structure is pure 7.1: a text input, a form wrapping it, and an empty ul#todos waiting to grow. This tree is the target for everything that follows.',
      highlightLines: [1, 2, 3],
    },
    {
      id: 'add-flow',
      caption:
        'Submitting the form calls preventDefault (7.6) first — no reload. Then create → fill → append (7.3): a brand-new li joins ul#todos, and — once layout and paint (7.8) catch up — it is visible on screen.',
      highlightLines: [5, 6, 7, 8, 9],
    },
    {
      id: 'delegate-clicks',
      caption:
        'Exactly ONE listener sits on the list itself (7.5), not one per item. event.target tells the handler which specific li was clicked — and this listener already covers todos that don’t exist yet.',
      highlightLines: [12, 13, 14, 15],
    },
    {
      id: 'persist',
      caption:
        'Every add and every toggle also calls saveTodos() — reading the current list and writing it to localStorage as a JSON string (7.7). Refresh the page, and read it back the same way: nothing is lost.',
      highlightLines: [9, 15, 18, 19],
    },
    {
      id: 'inspect-selectors',
      caption:
        'Now the hat switches. This sandbox models the app as pseudocode, not a live page — but the moment you build this for real (or open any todo app’s DevTools), the exact 7.2 skill applies: #todos li.done finds every completed item; [data-test="new-todo"] finds the input by its test hook. Same skill, now aimed at something you understand end-to-end.',
      highlightLines: [1],
    },
    {
      id: 'inspect-payoff',
      caption:
        'That loop — build a feature, then inspect it, then write the selectors that will drive it — compressed into one lesson, is the actual daily rhythm of an automation tester’s job.',
      highlightLines: [1],
    },
    {
      id: 'graduate',
      caption:
        'Phase 7, complete: the tree (7.1) you search with selectors (7.2) and mutate (7.3); events (7.4) that bubble and delegate (7.5); forms (7.6) you read and validate; storage (7.7) that survives a reload; and the rendering pipeline (7.8) explaining why "exists" and "visible" are different claims. Phase 8 teaches the modern tooling real apps like this one are built with.',
      highlightLines: [1],
    },
  ],
  Viz: TodoCheckpoint,
  underTheHood: (
    <>
      <p>
        Why a todo app specifically: it's small enough to hold entirely in your head, yet it
        genuinely exercises reading (7.2), writing (7.3), listening (7.4/7.5), forms (7.6),
        persistence (7.7), and timing (7.8) — a "real" production app adds more of the same
        shapes, not new DOM concepts.
      </p>
      <p>
        This is also, literally, real QA work in miniature: most of an automation tester's career
        is spent writing selectors against apps someone else built, using exactly the
        querySelector skills from 7.2, and reasoning about what a click actually triggers using
        exactly the delegation and event patterns from 7.4/7.5.
      </p>
      <p>
        Where the curriculum goes next: Phase 8 teaches the modern tooling (modules, npm, a taste
        of TypeScript) that real todo apps — React, Vue, and friends — are actually built with.
        Phase 9 is Node.js — JS with the browser walls removed. Phase 10 teaches the testing
        MINDSET. Phase 11 is Playwright itself, automating exactly this kind of app for real.
      </p>
    </>
  ),
  quiz: [
    {
      kind: 'type-output',
      question: 'A todo’s delete button is clicked. Per 7.5, does the app need a listener wired to that SPECIFIC button? Type yes or no.',
      accept: ['no', 'No', 'NO'],
      placeholder: 'yes / no…',
      why: 'No — delegation means ONE listener on the list handles every item, present or future, by reading event.target inside the handler.',
    },
    {
      kind: 'type-output',
      question: 'The submit handler calls event.preventDefault() first. Per 7.6, what would happen WITHOUT that line? Type it in a few words.',
      accept: ['page reload', 'the page reloads', 'reload', 'page would reload'],
      placeholder: 'what happens…',
      why: 'The browser would reload the page — a form’s default submit behavior — wiping out the in-progress list before any of your JS could even run.',
    },
    {
      kind: 'type-output',
      question: 'Todos are saved with JSON.stringify. Type the function (7.7) used to read them back into real objects:',
      accept: ['JSON.parse', 'json.parse', 'parse'],
      placeholder: 'JSON.…',
      why: 'JSON.parse — the exact inverse of stringify. Every localStorage round-trip for structured data is this pair, together.',
    },
  ],
  PlayExtra: () => (
    <>
      <CodeExercise def={CORE_EXERCISE} />
      <CodeExercise def={RELOAD_EXERCISE} />
    </>
  ),
  teachBack: {
    prompt:
      'Walk a friend through everything that happens from typing a todo and pressing Enter, to it surviving a page reload — naming every Phase 7 concept it rides on.',
    modelAnswer:
      'Typing into the input and pressing Enter fires the form’s submit event; the handler calls preventDefault (7.6) first, so the browser does not reload the page. It then creates a new li, fills its text, and appends it into ul#todos (7.3) — the DOM tree (7.1) now has one more node, which becomes visible once the render pipeline’s layout and paint stages catch up (7.8). Clicking that new item to mark it done or delete it is handled by a single listener wired to the list itself, not to each item — delegation (7.5) means bubbling (also 7.5) carries the click up to that one listener, which reads event.target to know exactly which item fired, and this coverage already includes items that did not exist when the listener was first wired. Every add and toggle also saves the current list to localStorage as a JSON string (7.7); reloading the page reads that string back with JSON.parse and rebuilds the list, so nothing is lost. And at any point, DevTools selectors (7.2) — like #todos li.done — can find and inspect any of this, which is exactly the skill an automation test would use to drive the same app.',
  },
  recap: [
    'One small todo app exercises all of Phase 7: tree (7.1) → selectors (7.2) → mutation (7.3) → events (7.4) → bubbling/delegation (7.5) → forms (7.6) → storage (7.7) → rendering (7.8).',
    'Build it, then inspect it: writing selectors against your own app IS the daily rhythm of automation testing, just compressed into one lesson.',
    'Phase 7 complete. Next: Phase 8’s modern tooling — the modules, npm, and TypeScript taste that real apps like this one are actually built with.',
  ],
}
