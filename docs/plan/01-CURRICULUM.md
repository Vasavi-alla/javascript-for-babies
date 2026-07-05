# 01 — Curriculum (Zero → Automation Hero)

Every lesson below follows the 6-part anatomy in `04-LESSON-BLUEPRINT.md` (Hook → Visualize → Under the Hood → Play → Teach-back → Recap). The "Viz" column names the reusable visualization component from the catalog in that file.

Legend: 🎬 = flagship animation worth extra polish.

---

## Phase 0 — The Machine (before any code)
*Goal: the learner knows what a program is and what happens when JS runs, so nothing later feels like magic.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 0.1 | What is a program? | A program is a recipe of tiny instructions executed in order, stupidly fast | InstructionTape — an animated tape of instructions being eaten one at a time |
| 0.2 | Where does JavaScript live? | Browser vs Node; JS engine (V8) inside the browser; source code → engine → behavior | 🎬 EngineDiagram — hand-drawn browser with an "engine room"; code flows in, actions come out |
| 0.3 | Your first conversation with the machine | The console; `console.log`; code runs top-to-bottom | ConsolePane — type-along, output appears on a sticky note |
| 0.4 | Memory: the wall of boxes | RAM as a huge wall of numbered slots; programs borrow slots to remember things | 🎬 MemoryWall — zoomable wall of slots lighting up |
| 0.5 | Errors are messages, not failures | Reading an error: name, message, line number; errors as the machine asking for help | ErrorAnatomy — a real error dissected with hand-drawn arrows labeling each part |

## Phase 1 — Values & Variables
*Goal: a precise mental model of values in memory, names pointing at them, and types.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 1.1 | What is a value? | Data the machine can hold: 25, "hello", true; every value has a type | ValueZoo — values as creatures sorted into typed pens |
| 1.2 | 🎬 What REALLY happens when you create a variable | `let age = 25`: allocate a slot, store 25, bind the *name* "age" to the slot. The name is a label, not a box containing the value | MemoryDiagram — step through declaration: slot appears → value drops in → label ties on |
| 1.3 | Reassignment | `age = 26`: the label stays, slot content is replaced; old value garbage-collected (teaser) | MemoryDiagram — value swap animation |
| 1.4 | `let` vs `const` vs `var` | `const` = label welded on; `var` = old, leaky (full story in Phase 5) | MemoryDiagram — const label drawn with a padlock; reassign attempt bounces off with the actual TypeError shown |
| 1.5 | Numbers | Integers & decimals are one type; arithmetic operators; `0.1 + 0.2` and why (floating point, honestly but gently) | NumberLine — operations animate as hops; the 0.1+0.2 zoom-in on binary approximation |
| 1.6 | Strings | Text as a sequence of indexed characters; quotes, template literals, concatenation vs interpolation | StringTrain — characters as train cars with index numbers; template literal slots fill in live |
| 1.7 | Booleans, `null`, `undefined` | true/false; `undefined` = "never set", `null` = "deliberately empty" | MemoryDiagram — an empty slot (undefined) vs a slot holding a hand-drawn "nothing" token (null) |
| 1.8 | `typeof` and dynamic typing | Variables don't have types, *values* do; the same label can point at different types over time | ValueZoo + MemoryDiagram — one label re-pointed across typed values |
| 1.9 | Type coercion & comparison | `==` vs `===`; how JS silently converts types; why `===` is the default | 🎬 CoercionMachine — a contraption that sucks in two values, converts one (showing the rule used), then compares |
| 1.10 | Operators roundup | Arithmetic, comparison, logical `&& || !`, precedence | ExpressionTree — an expression parsed into a tree, evaluated leaf-to-root with values bubbling up |
| ✅ | **Checkpoint project: "Mad Libs machine"** | Build a console story generator using variables, strings, template literals | Guided in-app exercise with the memory viz running alongside the learner's values |

## Phase 2 — Making Decisions & Repeating
*Goal: control flow as a path through the program, seen as a living flowchart.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 2.1 | `if` / `else` | Program flow as a fork in the road; condition evaluates to a boolean first | 🎬 FlowRoad — code on the left, hand-drawn road on the right; a token travels the taken path, untaken path grays out |
| 2.2 | Truthy & falsy | The 6 falsy values; everything else is truthy; why this exists | CoercionMachine — values dropped into a "Boolean-izer" funnel, land in truthy/falsy bins |
| 2.3 | `else if` chains & `switch` | Multi-way decisions; switch strict comparison; `break` fall-through shown honestly | FlowRoad — multi-fork road; fall-through animated as the token skipping a gate |
| 2.4 | Ternary & short-circuit | `?:`, `&&`/`||` as value-returning expressions; `??` | ExpressionTree — short-circuit shown as branches never evaluated (drawn, then crossed out) |
| 2.5 | `while` loops | Repeat while condition holds; the check-body-check cycle; infinite loops (and why the tab freezes) | FlowRoad — circular road with a gate; lap counter; an "infinite" demo with a big red STOP |
| 2.6 | 🎬 `for` loops | init / condition / update as three separate moments; loop variable living in memory | LoopMachine — the three slots of the for-header light up in sequence each lap, `i`'s memory box counts up |
| 2.7 | `break`, `continue`, nested loops | Escape hatches; loops inside loops as grids | LoopMachine — nested loops draw a grid cell by cell (row/column counters side by side) |
| ✅ | **Checkpoint project: "FizzBuzz, visualized"** | Classic FizzBuzz, but the app animates every iteration's decisions | Learner writes it; FlowRoad replays their logic |

## Phase 3 — Functions (the heart of JavaScript)
*Goal: functions as reusable machines; scope and closures understood so well the learner can teach them.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 3.1 | What is a function? | A named, reusable machine: inputs → work → output; defining vs calling are different moments | 🎬 FunctionMachine — a hand-drawn machine with an input hopper, gears, and an output chute |
| 3.2 | Parameters vs arguments | Parameters are the machine's slot names; arguments are values dropped in per call; each call gets fresh slots | FunctionMachine + MemoryDiagram — arguments animate into parameter slots |
| 3.3 | `return` | Return = the output chute + machine stops; functions without return give `undefined`; return vs console.log (the classic confusion, tackled head-on) | FunctionMachine — returned value physically travels back to the call site and replaces the call expression |
| 3.4 | Function expressions & arrow functions | Functions are values! Stored in variables like any value; arrow syntax as shorthand | MemoryDiagram — a slot holding a tiny function machine; label points at it |
| 3.5 | 🎬 Scope | Where a name can be seen from; block scope; inner sees outer, never the reverse; shadowing | ScopeLens — nested translucent bubbles on paper; a "lookup ray" shoots outward from a name through bubbles until it finds a match |
| 3.6 | 🎬 The call stack (first look) | Each call = a new frame with its own variables; frames stack up and pop off | CallStackTower — frames as stacked paper cards, pushed/popped as calls happen |
| 3.7 | 🎬 Closures | An inner function keeps its outer scope alive after the outer returns — a backpack of variables | ClosureBackpack — the returned function walks away wearing a backpack containing the captured slots; counter example stepped through |
| 3.8 | Higher-order functions & callbacks | Passing function-values into functions; "call this when done" | FunctionMachine — a machine with a slot that accepts another (smaller) machine |
| 3.9 | Recursion | A function calling itself; base case as the escape hatch; visualized on the stack | CallStackTower — factorial/countdown builds a tower then unwinds, return values cascading down |
| 3.10 | Default, rest params & pure functions | `=` defaults, `...rest`; pure vs side-effecting (foundation for testing later!) | FunctionMachine — a "pure" machine in a sealed glass box vs one with a pipe leaking to the outside world |
| ✅ | **Checkpoint project: "Tip calculator brain"** | Compose small pure functions; the app visualizes each call on the stack | CallStackTower replays the learner's solution |

## Phase 4 — Collections (arrays, objects, references)
*Goal: reference semantics — the #1 source of real-world bugs — seen, not memorized.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 4.1 | Arrays | One name, many values; index = distance from start; `.length`; read/write by index; past-the-end undefined | ArrayShelf — indexed cells; ghost cell past the end |
| 4.2 | 🎬 Inside an array: memory & O(1) | Contiguous slots with REAL addresses; `address = start + index × slotSize` → one jump; big-O introduced (O(1) flat vs O(n) climbing); .length as stored bookkeeping; bounds checks | MemoryStrip — the 0.4 memory wall returns with addresses; the arithmetic card; a tiny hand-drawn cost graph |
| 4.3 | Growing & shrinking | push/pop (end, O(1)) vs shift/unshift (front, O(n) — everyone re-indexes); return values: element vs new length | ArrayShelf — shift physically slides every element left |
| 4.4 | Objects | Properties: key → value; fetch by NAME; dot vs bracket (brackets evaluate); nesting; missing key → undefined, assignment creates | ObjectLocker — labeled compartments, nested mini-locker, bracket paper-note |
| 4.5 | 🎬 Inside an object: the hash trick | How a WORD becomes an address: hash function (fast, deterministic) → bucket → value; collisions honestly; O(1) by name; "hash map" named | HashMachine — key enters the scrambler, number lights a bucket; collision pile |
| 4.6 | 🎬 Primitives vs references | THE lesson: slots hold primitives directly but only ARROWS to heap objects; aliasing; const locks the arrow; **call by value vs call by sharing** (what functions receive) — revisits 3.2 upgraded | HeapDiagram — stack vs heap, arrow copies, two-act codeOverride (number vs object into a function) |
| 4.7 | Copying & equality | === compares addresses ({} !== {}); spread = shallow (one layer; inner arrows shared); structuredClone = deep | SpreadDiagram — two-level heap; the shared inner arrow in coral |
| 4.8 | Iterating collections | `for...of` (elements), `for...in` (keys), Object.keys/values/entries — the object→array bridge | IterHop — token hops cells/keys; derived-array cards |
| 4.9 | 🎬 map / filter / reduce | The transform trio; callbacks pay off; non-mutating; reduce lap-by-lap with the accumulator | 🎬 PipelineBelt — stamping station, trapdoor gate, accumulator jar |
| 4.10 | Sorting & finding | sort's string-default gotcha + comparator sign; sort mutates; find/some/every/includes (short-circuiting; includes is === on addresses) | SortScan — the referee compares pairs; scanner ray with ✓/✗ |
| 4.11 | Destructuring, spread & rest | Unpacking shapes; holes; swap; param destructuring; rest gathers | ObjectLocker — drawers popping into fresh labeled slots |
| 4.12 | Map & Set | When objects aren't enough: Map = the 4.5 hash machinery as a dedicated tool (keys of any type); Set = uniqueness at O(1) | SetMapViz — the uniqueness door; keys keeping their real type |
| 4.13 | JSON | Objects live in the heap and can't cross a wire; JSON.stringify flattens to text (strict dialect), JSON.parse rebuilds a brand-new object — the wire format of every API | JsonBridge — object flattened to a text ribbon and re-inflated |
| ✅ | **Checkpoint project: "Test-results dashboard"** | Given an array of fake test-run objects, compute pass rates, group failures — foreshadows the QA job | PipelineBelt replays their map/filter/reduce chain |

## Phase 5 — Under the Hood
*Goal: the accurate model of how JS executes — the learner can now explain hoisting, `this`, and prototypes in an interview.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 5.1 | 🎬 Execution contexts — two passes | Creation phase (names registered) then execution phase (lines run); the global context | TwoPassScanner — a scanner sweep registers declarations (pass 1), then a cursor executes (pass 2) |
| 5.2 | Hoisting, demystified | Why `var` reads as undefined, `let/const` throw (TDZ), functions are fully hoisted — all consequences of pass 1 | TwoPassScanner — the three declaration kinds registered differently in pass 1 |
| 5.3 | Scope chain, precisely | Each context links to its outer context; the lookup walk formalized | ScopeLens + CallStackTower combined — frames with outer-links drawn as ropes |
| 5.4 | 🎬 `this` | `this` is decided at CALL time, not write time; the 4 binding rules (default/implicit/explicit/new); arrow functions inherit | ThisCompass — a compass needle on the function swings to point at its `this` depending on how the call is made |
| 5.5 | 🎬 Prototypes | Objects link to a prototype; property lookup walks the chain; `__proto__` vs `prototype` | PrototypeChain — lockers connected by ropes; a lookup ray climbs the chain until the property is found |
| 5.6 | Classes | `class` as ergonomic syntax over prototypes; constructor, methods, `extends`, `super` — shown desugared | PrototypeChain — class syntax on the left literally redraws into the prototype diagram on the right |
| 5.7 | Garbage collection | Reachability; why closures keep memory alive; memory leaks in one picture | MemoryDiagram — unreachable islands fade and get swept by a little broom |
| 5.8 | Error handling | throw/try/catch/finally; errors unwinding the stack; custom errors | CallStackTower — a thrown error as a red spark falling down the tower until a catch net snags it |
| ✅ | **Checkpoint: "Explain-it-all interview"** | Quiz-mode: predict outputs of tricky snippets (hoisting, this, references); each answer replayable in the visualizer | Mixed viz replay |

## Phase 6 — Time & Async
*Goal: the event loop and promises seen as machinery; async/await stops being magic.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 6.1 | Sync vs async | JS is single-threaded; blocking demo (frozen UI, for real); why we need async | CallStackTower — a long task blocks; a clickable button in the demo literally stops responding |
| 6.2 | 🎬 The event loop | Call stack + Web APIs + callback queue + the loop; setTimeout(fn, 0) explained forever | 🎬 EventLoopMachine — the flagship viz: stack tower, Web-API waiting room, queue conveyor, and a hand-drawn loop arm that only feeds the stack when empty |
| 6.3 | Callbacks & callback hell | Async via callbacks; the pyramid of doom as a real readability problem | Code that visually slides rightward into a pyramid; nested FunctionMachines |
| 6.4 | 🎬 Promises | A promise as a receipt/IOU with 3 states; then/catch/finally; chaining flattens the pyramid | PromiseTimeline — a receipt card flips pending→fulfilled/rejected on a timeline; chains as linked receipts |
| 6.5 | Microtasks vs macrotasks | Why promise callbacks beat setTimeout; the microtask queue's priority lane | EventLoopMachine — a second, express conveyor that always empties first |
| 6.6 | async/await | Syntax over promises; await = pause THIS function, free the stack; try/catch with await | CallStackTower + PromiseTimeline — the async frame is set aside on a "paused" shelf, stack continues, frame resumes on resolve |
| 6.7 | fetch & APIs | HTTP request/response round-trip; status codes; JSON parsing; a real public API called live | 🎬 NetworkRoundTrip — request envelope travels to a server doodle and returns; headers/body unpacked (foundation for API testing) |
| 6.8 | Parallel & racing | Promise.all / allSettled / race / any; sequential-vs-parallel timing | PromiseTimeline — lanes racing; all's "one failure rejects everything" animated |
| ✅ | **Checkpoint project: "Pokédex fetcher"** | Fetch from a public API, handle loading/error states, render results | NetworkRoundTrip + PromiseTimeline running against their real requests |

## Phase 7 — The Browser & DOM (the automation tester's hunting ground)
*Goal: the DOM as a live tree; events as bubbling signals — exactly the model Playwright automates.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 7.1 | 🎬 The DOM tree | HTML parsed into a live tree of nodes; DevTools Elements = that tree | DOMTree — split view: rendered mini-page ⇄ hand-drawn tree; hover either side, both highlight |
| 7.2 | Selecting elements | querySelector & CSS selector syntax (tag/class/id/attribute/descendant) — this IS locator skill | 🎬 SelectorLab — type a selector, matching nodes glow in both the tree and the page; selector anatomy labeled |
| 7.3 | Reading & changing the DOM | textContent/innerHTML, classList, attributes, style; creating/removing nodes | DOMTree — mutations animate in the tree AND repaint the mini-page simultaneously |
| 7.4 | 🎬 Events | addEventListener; the event object; click/input/submit/keydown | EventBubbles — an event as a ripple: capture down, target, bubble up through the tree |
| 7.5 | Bubbling, delegation & preventDefault | Why one listener on a parent handles 100 children; stopping propagation; form default behavior | EventBubbles — delegation shown as a net at the parent catching bubbles from any child |
| 7.6 | Forms & user input | Reading values, validation, submit flow — the #1 thing automation scripts touch | DOMTree + a real form; each field's value slot watched live |
| 7.7 | Storage & timing | localStorage/sessionStorage/cookies (session handling for tests!); DOMContentLoaded vs load | ObjectLocker for storage; a page-load timeline ribbon |
| 7.8 | How the browser renders | Parse → render tree → layout → paint (gently); why "element not visible yet" happens — the reason auto-waiting exists | RenderPipeline ribbon — foreshadows flaky-test causes |
| ✅ | **Checkpoint project: "Todo app, inspected"** | Build a todo app in-app; then *inspect your own app* with SelectorLab — write selectors targeting your own elements | The app you built becomes the automation practice target |

## Phase 8 — Modern JS & Tooling
*Goal: comfort with the ecosystem a professional automation tester lives in.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 8.1 | Modules | import/export; one file = one module; dependency graphs | ModuleGraph — files as paper cards with arrows; an import animates a value traveling between cards |
| 8.2 | npm & package.json | Installing packages, scripts, node_modules, semver (^ ~), lockfiles | ModuleGraph — your card plugging into a wall of community cards |
| 8.3 | Debugging like a pro | Breakpoints, step over/into, watch, call stack panel in DevTools — mapped 1:1 to our CallStackTower | Side-by-side: real DevTools screenshot annotated ⇄ our visualizations |
| 8.4 | ES6+ grab bag | Optional chaining `?.`, nullish `??`, template niceties, Symbol/iterators (light) | ExpressionTree — `?.` short-circuit ray stopping at null |
| 8.5 | A taste of TypeScript | Types as labels the machine checks *before* running; interfaces; why Playwright projects use TS | ValueZoo — the pens get locked gates; a wrong-type value bounces off at compile time |
| ✅ | **Checkpoint: dependency detective** | Open a real project's package.json and explain every line — scripts, deps, semver ranges, the lockfile | Annotated package.json walkthrough |

## Phase 9 — Node.js
*Goal: JS with the browser walls removed — deep comfort in the runtime Vitest and Playwright run on.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 9.1 | What is Node, really? | Same V8 engine, no browser around it: no DOM, no window — new powers instead; the REPL; running `node script.js` | EngineDiagram from 0.2 revisited — the browser shell lifts off, a terminal shell drops on |
| 9.2 | The terminal, properly | cd/ls, running scripts, reading errors and stack traces in a terminal; exit codes — how CI knows pass from fail | Simulated terminal pane — a failing script's stack trace annotated line by line |
| 9.3 | Modules in Node: CJS vs ESM | `require` vs `import`, `"type": "module"`, default vs named in each; why Playwright configs look the way they do | ModuleGraph drawn twice — CJS arrows vs ESM arrows; one package.json switch flips the style |
| 9.4 | process: argv, env & exit | `process.argv` (scripts that take input), `process.env` (where BASE_URL and secrets live in real suites), exit codes | Terminal viz — the same script fed different env vars produces different runs |
| 9.5 | The file system | fs read/write (sync & promise flavors), path.join, __dirname vs cwd; where test reports and screenshots actually go | A script writes a real "test-report.txt" into a hand-drawn folder tree |
| 9.6 | Node's event loop & non-blocking I/O | The 6.2 event loop, backstage edition: libuv instead of Web APIs; timers in Node; how one thread serves many files | EventLoopMachine reskinned — the Web-API waiting room becomes the libuv workshop |
| 9.7 | fetch without a browser | Calling a real API from a plain script; JSON in, JSON out — the seed of API testing | NetworkRoundTrip — the envelope leaves a terminal instead of a browser |
| ✅ | **Checkpoint: environment setup** | Install Node for real; `npm init` a project outside the app; write a script that reads process.env and writes a file; run it from the terminal | Guided checklist with screenshots |

## Phase 10 — Testing Mindset
*Goal: think like a tester before touching a test tool.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 10.1 | Why software breaks | Regression; the cost-of-bug curve; what testing actually buys | A hand-drawn "bug escapes to production" comic with real cost data |
| 10.2 | The testing pyramid | Unit / integration / E2E — tradeoffs of speed, cost, confidence; where Playwright sits | 🎬 TestPyramid — interactive: drag the slider, watch suite runtime vs confidence change |
| 10.3 | Anatomy of a test | Arrange–Act–Assert; one behavior per test; naming tests as sentences | FunctionMachine reframed: given input (arrange), run (act), check output (assert) |
| 10.4 | Assertions | expect().toBe vs toEqual (references return!), matchers, failure messages you can read | AssertionScale — a balance scale weighing expected vs actual; toEqual unpacks structure |
| 10.5 | Vitest hands-on | describe/it, running a suite, reading red/green output, watch mode | Simulated test-runner pane with authentic output |
| 10.6 | Test doubles & TDD taste | Mocks/stubs/spies conceptually; red-green-refactor once | FunctionMachine — a real dependency machine swapped for a cardboard fake |
| ✅ | **Checkpoint project: test the tip calculator** | Write Vitest tests for the Phase 3 project; break the code, watch tests catch it | The red/green loop experienced firsthand |

## Phase 11 — Playwright (job-ready)
*Goal: write, structure, debug, and CI-run real Playwright suites.*

| # | Lesson | What's understood afterward | Viz |
|---|---|---|---|
| 11.1 | What Playwright is & why teams pick it | Why the tool exists (manual-testing pain → robot hands); architecture: your script ⇄ Playwright server ⇄ real browsers; headless vs headed; what it fixed vs older tools (auto-waiting, one API for three browser engines) | 🎬 PlaywrightBridge — script sends commands across a bridge to a puppet browser |
| 11.2 | Setup: what `npm init playwright` scaffolds | Installing for real (into 9.8's workspace): the init command's questions, browser-binaries download (why it's big), the scaffolded folder tour (tests/, playwright.config.ts, .github/), first `npx playwright test`, `--headed` to watch | FolderTree reprise — the scaffold materializes file by file; a terminal pane runs the first suite |
| 11.3 | The config, decoded | 8.6's detective format on `playwright.config.ts`: testDir, timeout vs expect.timeout, fullyParallel, retries, workers, reporter, the whole `use{}` block (baseURL, trace, screenshot, video); env vars into config (dotenv + 9.4's process.env) — every line explained, nothing mysterious | CaseBoard reprise — each config line becomes a pinned sticky with its runtime effect |
| 11.4 | 🎬 Locators | getByRole/getByText/getByLabel > CSS; why user-facing locators survive redesigns; chaining & filtering | SelectorLab v2 — same lab, Playwright locator syntax; a "redesign" button restyles the page and shows which locators survive |
| 11.5 | Actions | click/fill/press/selectOption/hover/drag; actionability checks before every action | DOMTree — before each action, Playwright's checklist (visible? stable? enabled?) ticks off item by item |
| 11.6 | 🎬 Auto-waiting & web-first assertions | THE flaky-test killer: expect(locator) retries until timeout; handling DYNAMIC content (spinners, late-loading lists, toasts) the right way; connects back to lesson 7.8 | Timeline — assertion polling as repeated gentle checks vs the old sleep(5000) sledgehammer, side by side |
| 11.7 | Fixtures & hooks | test/expect imports, beforeEach, page fixture, custom fixtures; test isolation | CallStackTower reframed — each test gets a fresh browser context card |
| 11.8 | Test data & parameterized tests | Data-driven testing: one test body, many data rows (for...of over cases generating tests); unique data per run; test data from env/files; when data-driven beats copy-paste | PipelineBelt reprise — a belt of data rows stamping out test runs from one mold |
| 11.9 | Page Object Model | Structuring suites: page classes, locators as properties, actions as methods; DRY test code | ModuleGraph — spec files pointing at page-object cards pointing at the app |
| 11.10 | Network interception & API testing | route/fulfill mocking; request fixture for pure API tests; the JSON skills from 4.13 pay off | NetworkRoundTrip — Playwright intercepts the envelope mid-flight and swaps its contents |
| 11.11 | Auth, storage state & sessions | Log in once, reuse storageState; the cookies/localStorage knowledge from 7.7 pays off | ObjectLocker — a saved session card stamped and reused across tests |
| 11.12 | Cross-browser projects & devices | The projects array: chromium/firefox/webkit from ONE suite; mobile emulation (viewport, touch); webServer (start the app before tests); when cross-browser matters vs when it's waste | Three browser lanes running the same test in parallel; a phone frame joins the grid |
| 11.13 | Tags, selective runs & suite hygiene | @smoke/@regression tags, --grep, test.only/skip/fixme (and the .only-left-in disaster), test.step for readable reports, soft assertions | The suite as a card wall; tag chips filter it live (4.9's filter, on tests) |
| 11.14 | Debugging failing tests | UI mode, trace viewer, screenshots/videos/traces — where artifacts land (9.5) and how to read a failure like a detective | Annotated trace-viewer walkthrough |
| 11.15 | Parallelism, retries & flakiness | Workers, sharding, retries (and why retries hide real bugs); the flakiness clinic: top causes (race conditions, shared state, time) and their fixes | Worker-lanes timeline; a flaky test caught red-handed |
| 11.16 | CI: the pipeline, decoded | 8.6's detective format on `.github/workflows/playwright.yml`: triggers (push/PR), the runner machine, npm ci, secrets & env vars in CI (9.4 completed), artifact upload, publishing the HTML report — "deploying" the suite so it guards every change | Annotated YAML walkthrough + a pipeline ribbon from push → green check |
| 11.17 | Visual & a11y testing (bonus) | toHaveScreenshot; axe integration | Diff overlay demo |
| ✅ | **Capstone: full test suite** | A real Playwright suite (in a real repo, outside the app) against the Phase 7 todo app + a public demo site: POM, fixtures, tagged smoke/regression sets, data-driven cases, API mocking, cross-browser projects, CI config with report publishing | Graduation. You are an automation tester. |

---

## Cross-cutting features (not lessons)
- **Curriculum map** — the home screen: a hand-drawn skill-tree/journey map; phases as regions, lessons as stops; progress inked in.
- **Recall deck** — spaced-repetition cards auto-generated from completed lessons ("Draw the event loop from memory").
- **Teach-back journal** — every teach-back answer saved; reviewable; this becomes the learner's own teaching material.
- **Prediction score** — tracks predict-before-reveal accuracy per topic to flag weak spots.
- **Sandbox** (from M4) — "Try your own code" button on supported lessons opens the live visualizer seeded with that lesson's example.
