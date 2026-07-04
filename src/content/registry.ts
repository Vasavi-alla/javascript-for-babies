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
  { number: 4, title: 'Collections', question: 'How arrays and objects REALLY work: memory, O(1), hashing, references', plannedLessons: 14 },
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

  // Phase 4 — Collections
  { id: '4.1', slug: 'arrays', title: 'Arrays', phase: 4, blurb: 'One name, many values — elements in order, found by index.', status: 'available' },
  { id: '4.2', slug: 'inside-an-array', title: 'Inside an array: memory & O(1)', phase: 4, blurb: 'Contiguous slots, address = start + index × size — why lookup is one jump at any size.', status: 'available' },
  { id: '4.3', slug: 'grow-shrink', title: 'Growing & shrinking', phase: 4, blurb: 'push, pop, shift, unshift — and the O(n) bill for front-of-array work.', status: 'available' },
  { id: '4.4', slug: 'objects', title: 'Objects', phase: 4, blurb: 'Properties: key → value. Fetch by name, not position — dot vs brackets.', status: 'available' },
  { id: '4.5', slug: 'inside-an-object', title: 'Inside an object: the hash trick', phase: 4, blurb: 'How a WORD becomes an address: hash function → bucket → O(1) by name. Hello, hash maps.', status: 'available' },
  { id: '4.6', slug: 'primitives-vs-references', title: 'Primitives vs references', phase: 4, blurb: 'THE lesson: call by value vs call by sharing — what really copies when you write b = a.', status: 'available' },
  { id: '4.7', slug: 'copying-equality', title: 'Copying & equality', phase: 4, blurb: 'Shallow vs deep copies, spread — and why {} !== {}.', status: 'available' },
  { id: '4.8', slug: 'iterating-collections', title: 'Iterating collections', phase: 4, blurb: 'for...of, for...in, and Object.keys / values / entries.', status: 'available' },
  { id: '4.9', slug: 'map-filter-reduce', title: 'map / filter / reduce', phase: 4, blurb: 'The transform trio — every element’s journey down the belt.', status: 'available' },
  { id: '4.10', slug: 'sorting-finding', title: 'Sorting & finding', phase: 4, blurb: 'sort’s string-default gotcha, find, some, every, includes.', status: 'available' },
  { id: '4.11', slug: 'destructuring-spread-rest', title: 'Destructuring, spread & rest', phase: 4, blurb: 'Patterns that mirror shapes — and the options-object style every modern API uses.', status: 'available' },
  { id: '4.12', slug: 'map-set', title: 'Map & Set', phase: 4, blurb: 'The uniqueness door, and keys of any type — the hash map, offered as dedicated tools.', status: 'available' },
  { id: '4.13', slug: 'json', title: 'JSON', phase: 4, blurb: 'The wire format of every API — flatten an object to text, rebuild it back.', status: 'available' },
  { id: '4.14', slug: 'checkpoint-test-dashboard', title: 'Checkpoint: test-results dashboard', phase: 4, blurb: 'filter → map → reduce over real run data — your first QA dashboard.', status: 'available' },

  // Phase 5 — Under the Hood
  { id: '5.1', slug: 'execution-contexts', title: 'Execution contexts: the two passes', phase: 5, blurb: 'The engine reads your code twice — creation registers names, execution runs lines.', status: 'available' },
  { id: '5.2', slug: 'hoisting', title: 'Hoisting, demystified', phase: 5, blurb: 'var → undefined, let/const → the dead zone, declarations → complete. One table, every puzzle.', status: 'available' },
  { id: '5.3', slug: 'scope-chain', title: 'The scope chain, precisely', phase: 5, blurb: 'Every context carries one rope to where it was WRITTEN — lookup walks outward.', status: 'available' },
  { id: '5.4', slug: 'this', title: 'this: the compass', phase: 5, blurb: 'Decided at CALL time, four rules, one arrow exception — the interview classic.', status: 'available' },
  { id: '5.5', slug: 'prototypes', title: 'Prototypes', phase: 5, blurb: 'The hidden link on every object — lookup climbs the chain; methods shared once.', status: 'available' },
  { id: '5.6', slug: 'classes', title: 'Classes', phase: 5, blurb: 'Ergonomic handwriting over prototypes: new’s four steps, extends = a longer chain.', status: 'available' },
  { id: '5.7', slug: 'garbage-collection', title: 'Garbage collection', phase: 5, blurb: 'Reachability: kept if walkable from the roots — why closures live and leaks grow.', status: 'available' },
  { id: '5.8', slug: 'error-handling', title: 'Error handling', phase: 5, blurb: 'throw launches, the stack unwinds, catch snags, finally always — test runners run on this.', status: 'available' },
  { id: '5.9', slug: 'checkpoint-interview', title: 'Checkpoint: the explain-it-all interview', phase: 5, blurb: 'Hoisting, this, chains — answered by simulation. Plus a ten-line test runner.', status: 'available' },

  // Phase 6 — Time & Async
  { id: '6.1', slug: 'sync-vs-async', title: 'Sync vs async', phase: 6, blurb: 'One thread, one stack — blocking freezes everything. Async = schedule, never wait.', status: 'available' },
  { id: '6.2', slug: 'event-loop', title: 'The event loop', phase: 6, blurb: 'Stack, Web APIs, queue, and the one rule — setTimeout(fn, 0) explained forever.', status: 'available' },
  { id: '6.3', slug: 'callbacks-hell', title: 'Callbacks & callback hell', phase: 6, blurb: 'Results arrive inside callbacks — and dependent steps stack the pyramid of doom.', status: 'available' },
  { id: '6.4', slug: 'promises', title: 'Promises', phase: 6, blurb: 'A receipt with one flip: pending → fulfilled/rejected. Flat chains, one error drain.', status: 'available' },
  { id: '6.5', slug: 'micro-macro', title: 'Microtasks vs macrotasks', phase: 6, blurb: 'The express lane: promise reactions drain COMPLETELY before the next timer or click.', status: 'available' },
  { id: '6.6', slug: 'async-await', title: 'async/await', phase: 6, blurb: 'Pause one function, free the stack, resume via the express lane — try/catch returns.', status: 'available' },
  { id: '6.7', slug: 'fetch-apis', title: 'fetch & APIs', phase: 6, blurb: 'Request out, response back: two awaits, the ok-guard, and the status-code map.', status: 'available' },
  { id: '6.8', slug: 'parallel-racing', title: 'Parallel & racing', phase: 6, blurb: 'Start first, await together: all, allSettled, race, any — results in INPUT order.', status: 'available' },
  { id: '6.9', slug: 'checkpoint-pokedex', title: 'Checkpoint: the Pokédex fetcher', phase: 6, blurb: 'loading → data | error → done — the whole async machine in one resilient flow.', status: 'available' },

  // Phase 7 — The Browser & DOM
  { id: '7.1', slug: 'dom-tree', title: 'The DOM tree', phase: 7, blurb: 'HTML text parsed into a LIVE tree of node objects — your hunting ground.', status: 'available' },
  { id: '7.2', slug: 'selecting-elements', title: 'Selecting elements', phase: 7, blurb: 'querySelector + the CSS selector language — THE locator skill of the job.', status: 'available' },
  { id: '7.3', slug: 'reading-changing-dom', title: 'Reading & changing the DOM', phase: 7, blurb: 'textContent vs innerHTML (the XSS rule), classList verbs, create → append → remove.', status: 'available' },
  { id: '7.4', slug: 'events', title: 'Events', phase: 7, blurb: 'addEventListener, the event object, the big four — what Playwright actions dispatch.', status: 'available' },
  { id: '7.5', slug: 'bubbling-delegation', title: 'Bubbling, delegation & preventDefault', phase: 7, blurb: 'Events travel the tree — one parent listener handles a hundred children.', status: 'available' },
  { id: '7.6', slug: 'forms-input', title: 'Forms & user input', phase: 7, blurb: 'Values, checkboxes, validation, the submit flow — automation’s daily bread.', status: 'available' },
  { id: '7.7', slug: 'storage-timing', title: 'Storage & timing', phase: 7, blurb: 'localStorage/cookies (test sessions!) and DOMContentLoaded vs load.', status: 'available' },
  { id: '7.8', slug: 'browser-rendering', title: 'How the browser renders', phase: 7, blurb: 'Parse → render tree → layout → paint — why “not visible yet” happens.', status: 'available' },
  { id: '7.9', slug: 'checkpoint-todo-inspected', title: 'Checkpoint: todo app, inspected', phase: 7, blurb: 'Build it, then target it — your own app as the automation practice range.', status: 'available' },
]

export function lessonsForPhase(phase: number): LessonMeta[] {
  return LESSONS.filter((lesson) => lesson.phase === phase)
}

export function findLesson(id: string): LessonMeta | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
