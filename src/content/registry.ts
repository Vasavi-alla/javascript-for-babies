/**
 * The curriculum registry — mirrors docs/plan/01-CURRICULUM.md.
 * Phases 0–1 are listed lesson-by-lesson (built in M1); later phases show
 * planned counts only and get filled in as their milestones arrive.
 */

export interface PhaseMeta {
  number: number
  title: string
  question: string
  /** Lessons not yet registered, shown "in pencil" on the map. */
  plannedLessons: number
}

export interface LessonMeta {
  id: string
  slug: string
  title: string
  phase: number
  blurb: string
  status: 'available' | 'planned'
}

export const PHASES: PhaseMeta[] = [
  { number: 0, title: 'The Machine', question: 'What is a program, and how does JavaScript actually run?', plannedLessons: 5 },
  { number: 1, title: 'Values & Variables', question: 'What happens in memory when I create a variable?', plannedLessons: 11 },
  { number: 2, title: 'Making Decisions & Repeating', question: 'How does a program choose and loop?', plannedLessons: 8 },
  { number: 3, title: 'Functions', question: 'How do we package behavior — and what are scope and closures, really?', plannedLessons: 11 },
  { number: 4, title: 'Collections', question: 'How do arrays and objects live in memory (references!)?', plannedLessons: 11 },
  { number: 5, title: 'Under the Hood', question: 'Execution contexts, the call stack, hoisting, prototypes, this', plannedLessons: 9 },
  { number: 6, title: 'Time & Async', question: 'The event loop, callbacks, promises, async/await', plannedLessons: 9 },
  { number: 7, title: 'The Browser & DOM', question: 'The DOM tree, selectors, events — the automation tester’s hunting ground', plannedLessons: 9 },
  { number: 8, title: 'Modern JS & Tooling', question: 'Modules, npm, debugging, ES6+, a taste of TypeScript', plannedLessons: 6 },
  { number: 9, title: 'Node.js', question: 'JS without the browser: the terminal, process & env, files, Node’s event loop — where Playwright lives', plannedLessons: 8 },
  { number: 10, title: 'Testing Mindset', question: 'Why we test, assertions, the test pyramid, Vitest', plannedLessons: 7 },
  { number: 11, title: 'Playwright', question: 'Locators, auto-waiting, fixtures, POM, network, CI — job-ready', plannedLessons: 13 },
]

export const LESSONS: LessonMeta[] = [
  // Phase 0 — The Machine
  { id: '0.1', slug: 'what-is-a-program', title: 'What is a program?', phase: 0, blurb: 'A recipe of tiny instructions, executed stupidly fast.', status: 'available' },
  { id: '0.2', slug: 'where-does-javascript-live', title: 'Where does JavaScript live?', phase: 0, blurb: 'Browsers, engines, and what happens to your source code.', status: 'available' },
  { id: '0.3', slug: 'first-conversation', title: 'Your first conversation with the machine', phase: 0, blurb: 'console.log, and code running top to bottom.', status: 'available' },
  { id: '0.4', slug: 'memory-wall-of-boxes', title: 'Memory: the wall of boxes', phase: 0, blurb: 'RAM as a huge wall of numbered slots programs borrow.', status: 'available' },
  { id: '0.5', slug: 'errors-are-messages', title: 'Errors are messages, not failures', phase: 0, blurb: 'How to read an error like a note from the machine.', status: 'available' },
  // Phase 1 — Values & Variables
  { id: '1.1', slug: 'what-is-a-value', title: 'What is a value?', phase: 1, blurb: 'The stuff programs remember — and every value has a type.', status: 'available' },
  { id: '1.2', slug: 'creating-a-variable', title: 'What REALLY happens when you create a variable', phase: 1, blurb: 'A slot, a value, and a name tied on like a label.', status: 'available' },
  { id: '1.3', slug: 'reassignment', title: 'Reassignment', phase: 1, blurb: 'The label stays; the contents get swapped.', status: 'available' },
  { id: '1.4', slug: 'let-const-var', title: 'let vs const vs var', phase: 1, blurb: 'Welded labels, and one old leaky keyword.', status: 'available' },
  { id: '1.5', slug: 'numbers', title: 'Numbers', phase: 1, blurb: 'Arithmetic — and the honest truth about 0.1 + 0.2.', status: 'available' },
  { id: '1.6', slug: 'strings', title: 'Strings', phase: 1, blurb: 'Text as a train of indexed characters.', status: 'available' },
  { id: '1.7', slug: 'booleans-null-undefined', title: 'Booleans, null & undefined', phase: 1, blurb: '"Never set" vs "deliberately empty".', status: 'available' },
  { id: '1.8', slug: 'typeof-dynamic-typing', title: 'typeof & dynamic typing', phase: 1, blurb: 'Values have types. Variables just point.', status: 'available' },
  { id: '1.9', slug: 'coercion-and-comparison', title: 'Type coercion & comparison', phase: 1, blurb: 'The machine that silently converts — and why === is home.', status: 'available' },
  { id: '1.10', slug: 'operators-roundup', title: 'Operators roundup', phase: 1, blurb: 'Expressions as trees; values bubbling up.', status: 'available' },
  { id: '1.11', slug: 'checkpoint-mad-libs', title: 'Checkpoint: the Mad Libs machine', phase: 1, blurb: 'Build a story generator with everything so far.', status: 'available' },
  // Phase 2 — Making Decisions & Repeating
  { id: '2.1', slug: 'if-else', title: 'if / else', phase: 2, blurb: 'A fork in the road: one condition, one path taken.', status: 'available' },
  { id: '2.2', slug: 'truthy-falsy', title: 'Truthy & falsy', phase: 2, blurb: 'Six values mean “no” — everything else means “yes.”', status: 'available' },
  { id: '2.3', slug: 'else-if-switch', title: 'else-if chains & switch', phase: 2, blurb: 'Corridors of gates, ladders of cases, and the famous fall-through.', status: 'available' },
  { id: '2.4', slug: 'ternary-short-circuit', title: 'Ternary & short-circuit', phase: 2, blurb: 'Decisions that produce a value, and logic that skips work.', status: 'available' },
  { id: '2.5', slug: 'while-loops', title: 'while loops', phase: 2, blurb: 'Repeat while a condition holds — and why the tab freezes if it never stops.', status: 'available' },
  { id: '2.6', slug: 'for-loops', title: 'for loops', phase: 2, blurb: 'init / condition / update — the three moments of every lap.', status: 'available' },
  { id: '2.7', slug: 'break-continue-nested', title: 'break, continue & nested loops', phase: 2, blurb: 'Escape hatches, skipped laps, and loops inside loops.', status: 'available' },
  { id: '2.8', slug: 'checkpoint-fizzbuzz', title: 'Checkpoint: FizzBuzz, visualized', phase: 2, blurb: 'The classic interview question — with every decision animated.', status: 'available' },
  // Phase 3 — Functions
  { id: '3.1', slug: 'what-is-a-function', title: 'What is a function?', phase: 3, blurb: 'A reusable machine: inputs → work → output. Defining and calling are different moments.', status: 'available' },
  { id: '3.2', slug: 'parameters-vs-arguments', title: 'Parameters vs arguments', phase: 3, blurb: 'Slot names vs the values dropped in — and every call gets fresh slots.', status: 'available' },
  { id: '3.3', slug: 'return', title: 'return', phase: 3, blurb: 'The output chute: the value travels back and replaces the call. Not the same as console.log!', status: 'available' },
  { id: '3.4', slug: 'function-expressions-arrows', title: 'Function expressions & arrows', phase: 3, blurb: 'Functions are values — stored in variables like any number or string.', status: 'available' },
  { id: '3.5', slug: 'scope', title: 'Scope', phase: 3, blurb: 'Where a name can be seen from: nested bubbles and the outward lookup.', status: 'available' },
  { id: '3.6', slug: 'call-stack', title: 'The call stack (first look)', phase: 3, blurb: 'Every call gets its own frame; frames stack up and pop off.', status: 'available' },
  { id: '3.7', slug: 'closures', title: 'Closures', phase: 3, blurb: 'The inner function walks away wearing a backpack of outer variables.', status: 'available' },
  { id: '3.8', slug: 'higher-order-functions', title: 'Higher-order functions & callbacks', phase: 3, blurb: 'Functions that accept other functions — “call this back when it’s time.”', status: 'available' },
  { id: '3.9', slug: 'recursion', title: 'Recursion', phase: 3, blurb: 'A function calling itself — and the base case that stops the tower.', status: 'available' },
  { id: '3.10', slug: 'defaults-rest-pure', title: 'Default parameters & pure functions', phase: 3, blurb: 'Fallback values for silent slots — and sealed functions with no leaky pipes.', status: 'available' },
  { id: '3.11', slug: 'checkpoint-tip-calculator', title: 'Checkpoint: the tip calculator brain', phase: 3, blurb: 'Compose small pure functions into one working brain — your first testable unit.', status: 'available' },
]

export function lessonsForPhase(phase: number): LessonMeta[] {
  return LESSONS.filter((lesson) => lesson.phase === phase)
}

export function findLesson(id: string): LessonMeta | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
