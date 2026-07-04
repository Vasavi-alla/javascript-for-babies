# Phase 5-7 Stepper Expansion — Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the "watch it happen" stepper in two pilot lessons — 5.4 ("this") and 6.2
(the event loop) — from their current 5-6 dense steps into 9-10 granular, one-fact-per-step
slides, per the design in `docs/superpowers/specs/2026-07-04-phase5-7-stepper-expansion-design.md`.
Also fix two drive-by bugs (an unexplained term in 5.4, a premature term in 7.1) and one text
corruption (6.3), found during the design survey.

**Architecture:** No engine/component changes. Each lesson's `Viz` component stays a pure
function of `stepIndex`; we're replacing the `steps` array (captions + highlightLines) and the
matching `VIEWS` array (visual state per step) inside `lesson54.tsx` and `lesson62.tsx`, with
one new `VIEWS` entry per new step, in order. Everything else in each lesson file (hook,
underTheHood, quiz, exercise, teachBack) stays as-is except two one-line tweaks called out
in Task 3.

**Tech Stack:** React + TypeScript + Vite, hand-authored SVG via `motion/react` + the project's
`rough-svg` primitives. No test framework exists for lesson content — verification is
`tsc`/`vite build` (catches type errors) plus a manual array-length/index check (the one thing
`tsc` can't catch, explained below) plus the user's own browser pass.

## Global Constraints

- **Never commit or push.** Leave all changes in the working tree. The user commits when
  they're ready (standing rule — do not add a "git commit" step to any task).
- **`VIEWS.length` must equal `steps.length`, exactly, index-for-index.** Every `Viz` component
  in this codebase reads `VIEWS[stepIndex] ?? VIEWS[0]`. If `steps` has more entries than
  `VIEWS`, the extra late steps silently redisplay `VIEWS[0]` (TypeScript does NOT catch this —
  `noUncheckedIndexedAccess` is off in `tsconfig.app.json`, so `VIEWS[stepIndex]` types as
  `View`, not `View | undefined`). This is the exact bug already present in the *current*
  `lesson54.tsx` (6 steps, 5 VIEWS) that this plan fixes as a side effect — do not reintroduce
  it in the new code.
- **Metaphor bridge-then-fade (5.4 only):** the compass/needle metaphor may appear in the
  first 1-2 steps as a bridge; every step after that must describe `this` in plain technical
  language (no more "needle" wording). 6.2 needs no metaphor change — it's already
  technical-primary.
- **Target step counts:** both 5.4 and 6.2 are flagship (🎬) lessons → 9-12 steps each.
- **underTheHood stays inside its existing budget** (3 short paragraphs, ~250 words) —
  neither pilot lesson's underTheHood needs a content change (verified during design: both
  already read correctly against the new step sequence).
- **Verification command:** `npm run build` (runs `tsc -b && vite build`) must exit 0 after
  every file edit in this plan.

---

### Task 1: Fix the two drive-by bugs + the text corruption

These are independent of the pilot lessons and unblock cleanly before the bigger rewrites.

**Files:**
- Modify: `src/lessons/phase7/lesson71.tsx` (the premature "listener" reference)
- Modify: `src/lessons/phase6/lesson63.tsx` (corrupted character in underTheHood)

**Interfaces:** None — text-only edits, no signature or type changes.

- [ ] **Step 1: Fix the premature "listener" reference in 7.1**

Event listeners aren't taught until lesson 7.4 (three lessons later); 7.1 shouldn't assume the
word is known yet.

In `src/lessons/phase7/lesson71.tsx`, find the `document` step's caption and remove the
premature word:

Old:
```tsx
      caption:
        'document is a global object every page’s JS receives — your handle on the tree’s root. Every lookup, every edit, every listener starts by walking or searching from here. (In the tree: document → body → branches.)',
```

New:
```tsx
      caption:
        'document is a global object every page’s JS receives — your handle on the tree’s root. Every lookup and every edit starts by walking or searching from here. (In the tree: document → body → branches.)',
```

- [ ] **Step 2: Fix the corrupted character in 6.3's underTheHood**

In `src/lessons/phase6/lesson63.tsx`, the second underTheHood paragraph has a stray non-ASCII
character where a word should be.

Old:
```tsx
        Be precise about what's broken and what isn't: ONE level of callback is fine and永 remains
        everywhere (every <code>addEventListener</code>, every <code>test('…', fn)</code> in your
        Phase 10 future is a callback). The failure mode is <em>sequencing chains</em> of dependent
```

New:
```tsx
        Be precise about what's broken and what isn't: ONE level of callback is completely fine
        and stays common everywhere (every <code>addEventListener</code>, every{' '}
        <code>test('…', fn)</code> in your Phase 10 future is a callback). The failure mode is{' '}
        <em>sequencing chains</em> of dependent
```

- [ ] **Step 3: Verify the build is clean**

Run: `npm run build`
Expected: exits 0, no TypeScript errors, no new warnings from these two files.

---

### Task 2: Rewrite 6.2's stepper (event loop) — step-splitting only

No metaphor change needed here (6.2 is already technical-primary per the design survey). This
task purely splits each bundled caption into one-fact-per-step, going from 6 steps to 10.

**Files:**
- Modify: `src/lessons/phase6/lesson62.tsx`

**Interfaces:**
- Consumes: existing `View` interface in this file (`stack`, `webApi`, `queue`, `armActive`,
  `console`, `note`) — unchanged, no new fields needed.
- Produces: a 10-entry `VIEWS` array and a 10-entry `steps` array, index-aligned.

- [ ] **Step 1: Replace the `VIEWS` array**

Old (the current 6-entry array):
```tsx
const VIEWS: View[] = [
  {
    stack: ['global'], webApi: null, queue: [], armActive: false, console: [],
    note: 'four parts: the stack (JS), the Web APIs (the environment), the queue, and the loop',
  },
  {
    stack: ['global', 'console.log("1")'], webApi: null, queue: [], armActive: false, console: ['1'],
    note: 'sync code runs on the stack, as always — push, run, pop',
  },
  {
    stack: ['global'], webApi: '⏲ 0ms timer + callback', queue: [], armActive: false, console: ['1'],
    note: 'setTimeout hands the timer AND the callback to the Web APIs — the stack is done with it',
  },
  {
    stack: ['global', 'console.log("2")'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1', '2'],
    note: 'the 0ms timer fired instantly — but the callback goes to the QUEUE, not the stack. It waits.',
  },
  {
    stack: ['(empty)'], webApi: null, queue: ['() => log("3")'], armActive: true, console: ['1', '2'],
    note: 'global finishes, the stack empties — NOW the loop’s one rule fires: stack empty? move one callback',
  },
  {
    stack: ['() => log("3")'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'the callback finally runs. setTimeout(fn, 0) = “queue it now” — never “run it now”',
  },
]
```

New (10-entry array):
```tsx
const VIEWS: View[] = [
  {
    stack: ['global'], webApi: null, queue: [], armActive: false, console: [],
    note: 'four parts: the stack (JS runs here), the Web APIs (the environment), the callback queue, and the loop connecting them',
  },
  {
    stack: ['global', 'console.log("1")'], webApi: null, queue: [], armActive: false, console: ['1'],
    note: 'plain synchronous work: pushed onto the stack, runs, prints, pops off — the right half of the machine is untouched',
  },
  {
    stack: ['global'], webApi: '⏲ 0ms timer + callback', queue: [], armActive: false, console: ['1'],
    note: 'setTimeout(callback, 0) registers — the timer AND the callback move to the Web APIs, off the stack. It returns INSTANTLY; nothing here has run yet',
  },
  {
    stack: ['global'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1'],
    note: 'the 0ms timer fires almost immediately — but firing only moves the callback into the QUEUE, a waiting line. Still not the stack',
  },
  {
    stack: ['global', 'console.log("2")'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1', '2'],
    note: 'meanwhile the stack, oblivious to all of that, already reached line 7 and printed "2"',
  },
  {
    stack: ['(empty)'], webApi: null, queue: ['() => log("3")'], armActive: false, console: ['1', '2'],
    note: 'line 7 is done — the global context finishes. The call stack is now, for the first time, completely EMPTY',
  },
  {
    stack: ['(empty)'], webApi: null, queue: ['() => log("3")'], armActive: true, console: ['1', '2'],
    note: 'THE one rule, checked forever: stack empty? → move the oldest callback from the queue onto it. That is the entire event loop',
  },
  {
    stack: ['() => log("3")'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'the callback is on the stack now — it runs, prints "3", pops off. Final order: 1, 2, 3',
  },
  {
    stack: ['(empty)'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'setTimeout(fn, 0) never means "run now" — it means "queue it now." It still waits behind every line of sync code',
  },
  {
    stack: ['(empty)'], webApi: null, queue: [], armActive: false, console: ['1', '2', '3'],
    note: 'and if the stack never emptied (6.1\'s frozen page) — the loop\'s one rule never gets to fire. Every timer and click piles up behind the hog, forever',
  },
]
```

- [ ] **Step 2: Replace the `steps` array**

Old (the current 6-entry array, inside `export const lesson62: LessonDef = { ... steps: [...] }`):
```tsx
  steps: [
    {
      id: 'the-machine',
      caption:
        'Meet the machine. Left: the call stack — the ONLY place JavaScript executes. Right top: the Web APIs, run by the environment on its own threads (this is where waiting is allowed!). Right middle: the callback queue. And the arm between them: the event loop, checking one condition forever.',
      highlightLines: [1],
    },
    {
      id: 'sync',
      caption:
        'console.log("1") — plain synchronous work: pushed on the stack, runs, pops. The machine’s right half isn’t involved at all. Most of your code lives and dies here.',
      highlightLines: [1],
    },
    {
      id: 'handoff',
      caption:
        'setTimeout(callback, 0): the browser’s timer machinery takes BOTH the delay and your callback into the waiting room, and setTimeout returns instantly. Note what did NOT happen: the callback did not run, and it is nowhere near the stack. The stack’s next line is line 7.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'queue',
      caption:
        'The 0ms timer fires immediately — but look where the callback lands: the QUEUE. Not the stack. NOTHING ever jumps onto the stack mid-flight; that’s the safety guarantee that makes single-threaded JS sane. Meanwhile the stack, oblivious, prints "2".',
      highlightLines: [7],
    },
    {
      id: 'the-rule',
      caption:
        'Line 7 done, global finishes — the stack is EMPTY. Now, and only now, the loop’s rule fires: take the oldest callback from the queue, push it onto the stack. This one rule, checked forever, is the entire event loop. Empty stack → one move. That’s it. That’s the famous machine.',
      highlightLines: [7],
    },
    {
      id: 'zero-explained',
      caption:
        'The callback runs: "3". And now say it with authority: setTimeout(fn, 0) does not mean “run now” — it means “put fn in the QUEUE now.” It still waits for every line of sync code to finish, because the loop only feeds an EMPTY stack. Corollary you already lived in 6.1: a blocking loop starves the queue — timers, clicks, everything piles up behind one hog. Every mysterious async ordering you’ll ever debug is this machine, running exactly as designed.',
      highlightLines: [3, 4, 5],
    },
  ],
```

New (10-entry array):
```tsx
  steps: [
    {
      id: 'the-machine',
      caption:
        'Meet the machine, four parts. The call stack — the ONLY place JavaScript executes. The Web APIs — the environment’s own machinery, running on separate threads. The callback queue — a first-in-first-out waiting line. And the event loop — an arm that checks one thing, forever. Nothing is moving yet.',
      highlightLines: [1],
    },
    {
      id: 'sync',
      caption:
        'console.log("1") is plain synchronous work: pushed onto the stack, it runs, prints "1", and pops off. The right half of the machine — Web APIs, queue, loop — isn’t involved at all. Most of your code lives and dies right here.',
      highlightLines: [1],
    },
    {
      id: 'register-handoff',
      caption:
        'Line 3: setTimeout(callback, 0) is CALLED. Watch closely what this call does — it does NOT run the callback. It registers it: the browser’s timer machinery takes both the 0ms delay and your callback function into the Web APIs, off the JS stack entirely. setTimeout returns INSTANTLY — control passes straight to the next line.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'timer-to-queue',
      caption:
        'The 0ms timer fires almost immediately — but firing does not mean running. Look at where the callback actually goes: into the callback QUEUE, a waiting line. NOT the stack. Nothing is ever allowed to jump onto the stack mid-flight — that rule is what keeps single-threaded JavaScript sane.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'stack-unbothered',
      caption:
        'Meanwhile the stack has no idea any of that happened. It already moved past the setTimeout line, reached line 7, and printed "2". Two separate stories, running side by side: the stack finishing its sync work, the callback quietly waiting in its queue.',
      highlightLines: [7],
    },
    {
      id: 'stack-empties',
      caption:
        'Line 7 is done. The global context finishes running. For the first time since the program started, the call stack is completely EMPTY.',
      highlightLines: [7],
    },
    {
      id: 'the-rule',
      caption:
        'And here is the ENTIRE event loop — one rule, checked forever: "is the stack empty? Then move exactly one callback from the queue onto it." Not two. Not "whichever is ready." Exactly one, and only when the stack has nothing else to do.',
      highlightLines: [3],
    },
    {
      id: 'callback-runs',
      caption:
        'The callback moves onto the stack. It runs, prints "3", and pops off. Read the console in order: 1, 2, 3 — sync code always finishes first, no matter how small the delay looked.',
      highlightLines: [4],
    },
    {
      id: 'zero-explained',
      caption:
        'Say it with authority now: setTimeout(fn, 0) does not mean "run immediately." It means "put fn in the queue immediately" — and queued things always wait for every line of synchronous code to finish, because the loop only ever feeds an EMPTY stack.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'blocking-corollary',
      caption:
        'One corollary you already lived through in 6.1: if the stack never empties — a long blocking loop hogging it — the loop’s one rule never gets a chance to fire. Every timer, every click, every network reply piles up behind that one hog, forever. Every mysterious async ordering you’ll ever debug is this exact machine, running precisely as designed.',
      highlightLines: [1],
    },
  ],
```

- [ ] **Step 3: Verify the invariant by hand**

Count entries: `VIEWS` must have exactly 10 objects, `steps` must have exactly 10 objects, in
the same order (step N's caption must describe view N's picture). Read both arrays side by
side and confirm this — `tsc` cannot check it.

- [ ] **Step 4: Verify the build is clean**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 5: Flag for browser verification**

Do not mark this lesson done — it needs the user's in-browser pass (Task 4).

---

### Task 3: Rewrite 5.4's stepper ("this") — step-split + metaphor fade + fix the `apply` gap

**Files:**
- Modify: `src/lessons/phase5/lesson54.tsx`

**Interfaces:**
- Consumes: existing `View` interface in this file (`rule`, `callSite`, `pointsTo`, `bad?`,
  `console`, `note`) and the existing `BIND_CODE` constant — both unchanged.
- Produces: a 9-entry `VIEWS` array and a 9-entry `steps` array, index-aligned (this also
  fixes the pre-existing bug where the current file has 6 steps but only 5 `VIEWS` entries,
  causing the last step to silently fall back to `VIEWS[0]`).

- [ ] **Step 1: Replace the `VIEWS` array**

Old (the current 5-entry array):
```tsx
const VIEWS: View[] = [
  {
    rule: 'the question', callSite: '?', pointsTo: '…decided at each call', console: [],
    note: 'this is NOT “the object it’s written in” — it’s re-decided EVERY time, by the call',
  },
  {
    rule: 'implicit (the dot)', callSite: 'cat.speak()', pointsTo: 'cat', console: ['Biscuit'],
    note: 'called through a dot → this = the thing LEFT of the dot',
  },
  {
    rule: 'default (bare call)', callSite: 'loose()', pointsTo: 'nothing useful', bad: true, console: ['Biscuit', 'undefined'],
    note: 'same function, no dot → this is the global object (or undefined in strict mode) — the lost-this bug',
  },
  {
    rule: 'explicit (bind)', callSite: 'bound()', pointsTo: 'dog', console: ['I am Rex'],
    note: 'bind(dog) returns a copy whose needle is WELDED to dog — no call can change it',
  },
  {
    rule: 'arrows: no needle', callSite: 'peep()', pointsTo: 'hatch’s this = nest', console: ['I am Rex', 'Nest'],
    note: 'arrow functions have NO own this — they borrow it from where they’re WRITTEN (a 5.3 rope!)',
  },
]
```

New (9-entry array):
```tsx
const VIEWS: View[] = [
  {
    rule: 'the question', callSite: '?', pointsTo: '…decided at each call', console: [],
    note: 'this is NOT “the object it’s written in” — it’s re-decided EVERY time, by the call. Picture a compass needle with no fixed direction, waiting to swing toward whatever the call points it at.',
  },
  {
    rule: 'implicit (the dot)', callSite: 'cat.speak()', pointsTo: 'cat', console: ['Biscuit'],
    note: 'called through a dot → the needle swings to the thing LEFT of the dot: this = cat',
  },
  {
    rule: 'default (bare call)', callSite: 'loose()', pointsTo: 'nothing useful', bad: true, console: ['Biscuit', 'undefined'],
    note: 'same function, no dot → this falls back to the global object (or undefined in strict mode)',
  },
  {
    rule: 'default (bare call)', callSite: 'loose()', pointsTo: 'nothing useful', bad: true, console: ['Biscuit', 'undefined'],
    note: 'the classic bug: hand a method off as a callback (setTimeout, an event handler, a stored reference) and the dot disappears — this rule silently takes over',
  },
  {
    rule: 'explicit (bind)', callSite: 'bound()', pointsTo: 'dog', console: ['I am Rex'],
    note: 'bind(dog) returns a NEW function whose this is permanently set to dog — no future call, dot or not, can change it',
  },
  {
    rule: 'explicit (bind)', callSite: 'bound()', pointsTo: 'dog', console: ['I am Rex'],
    note: 'cousins for ONE immediate call: intro.call(dog) runs it right now with this = dog. apply does the same job but takes the arguments as an array: call(dog, a, b) vs apply(dog, [a, b])',
  },
  {
    rule: 'arrows (no this)', callSite: 'peep()', pointsTo: 'hatch’s this = nest', console: ['I am Rex', 'Nest'],
    note: 'arrow functions have no this of their own to decide — they read it the way they read any outer variable: from where they’re WRITTEN',
  },
  {
    rule: 'arrows (no this)', callSite: 'peep()', pointsTo: 'hatch’s this = nest', console: ['I am Rex', 'Nest'],
    note: 'hatch was called as nest.hatch() (rule: dot → this = nest); peep just borrows that. Ideal INSIDE methods as callbacks — wrong AS methods themselves',
  },
  {
    rule: 'the priority order', callSite: 'any call', pointsTo: 'check top to bottom', console: ['I am Rex', 'Nest'],
    note: 'new beats explicit (bind/call/apply) beats implicit (dot) beats default (bare call). Arrows skip the whole list.',
  },
]
```

Note the metaphor fade: "needle" appears in views 0 and 1 only (the bridge), then every later
view describes `this` in plain technical language. Also note: the final view's `console` field
is intentionally the last 2 entries (not all 4 seen across the lesson) — the SVG console box
is ~360px wide at this font size, and joining all four prior outputs
(`'Biscuit   ·   undefined   ·   I am Rex   ·   Nest'`, ~68 characters) would overflow it.

- [ ] **Step 2: Replace the `steps` array**

Old (the current 6-entry array, inside `export const lesson54: LessonDef = { ... steps: [...] }`):
```tsx
  steps: [
    {
      id: 'the-question',
      caption:
        'Look at speak’s body: this.name. Which object is this? WRONG QUESTION at this location — the body can’t tell you. this has no value until the function is CALLED, and it can differ between two calls of the very same function. The only place with the answer is the CALL SITE. Train the reflex now: see this in a body → immediately look for the calls.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'implicit',
      caption:
        'Call site 1: cat.speak() — a call THROUGH A DOT. Rule one, the IMPLICIT rule: this = the object left of the dot. The needle points at cat, this.name is "Biscuit". This covers most everyday method calls, and matches the intuition you built in 4.4’s objects.',
      highlightLines: [8],
    },
    {
      id: 'default',
      caption:
        'Call site 2 is the trap. Line 10 copies the function (functions are values — 3.4) and line 11 calls it BARE: loose(). No dot. Rule two, the DEFAULT rule: this falls back to the global object (or undefined in strict mode) — either way, this.name is undefined. SAME function, different call, different this. This “lost this” is the classic bug: it strikes whenever a method is passed as a callback — setTimeout(cat.speak, …) loses the cat exactly like this.',
      highlightLines: [10, 11],
    },
    {
      id: 'explicit',
      caption:
        'New code — the cure. Rule three, the EXPLICIT rule: intro.bind(dog) returns a COPY of intro whose needle is welded to dog, permanently. Call bound() bare — doesn’t matter; welded. (Cousins: intro.call(dog) welds for ONE immediate call. When you must hand a method to someone else’s code, bind first.)',
      codeOverride: BIND_CODE,
      highlightLines: [1, 2, 3, 5, 6, 7],
    },
    {
      id: 'arrows',
      caption:
        'And the modern cure: arrow functions have NO this of their own — no needle to swing. An arrow reads this the way it reads any outer variable: through the 5.3 rope, from where it’s WRITTEN. peep is written inside hatch, so peep’s this IS hatch’s this — and hatch was called as nest.hatch(), so both see nest. This is why arrows are beloved for callbacks-inside-methods… and forbidden AS methods (an arrow method’s this would rope right past the object to global).',
      highlightLines: [9, 10, 11, 12, 13, 14, 15],
    },
    {
      id: 'checklist',
      caption:
        'The complete decision list, priority order — run it at any call site: (1) called with NEW? this = the freshly made object (next two lessons live here). (2) bind/call/apply? this = what you passed. (3) a dot? this = left of the dot. (4) bare call? global/undefined — probably a bug. Arrows: skip the list entirely; they borrow from their birthplace. Four rules and an exception — that is ALL of this.',
      highlightLines: [1, 2, 3],
    },
  ],
```

New (9-entry array):
```tsx
  steps: [
    {
      id: 'the-question',
      caption:
        'Look at speak’s body: this.name. Which object is this? WRONG QUESTION at this location — the body can’t tell you. this has no value until the function is CALLED, and it can differ between two calls of the very same function. Picture it like a compass needle with no fixed direction, waiting to swing toward whatever the call decides. The only place with the answer is the CALL SITE.',
      highlightLines: [3, 4, 5],
    },
    {
      id: 'implicit',
      caption:
        'Call site 1: cat.speak() — a call THROUGH A DOT. Rule one, the IMPLICIT rule: this = the object left of the dot. The needle swings to cat, this.name is "Biscuit". This covers most everyday method calls — and matches the intuition you built in 4.4’s objects.',
      highlightLines: [8],
    },
    {
      id: 'default',
      caption:
        'Call site 2: line 10 copies the function (functions are values — 3.4) and line 11 calls it BARE: loose(). No dot anywhere. Rule two, the DEFAULT rule: this falls back to the global object (or undefined in strict mode) — either way, this.name is undefined. SAME function, different call, different this.',
      highlightLines: [10, 11],
    },
    {
      id: 'default-bug',
      caption:
        'Name this precisely, because you will meet it constantly: this is the "lost this" bug. It strikes whenever a method is handed off as a plain reference — passed to setTimeout, used as an event handler, stored in a variable — the dot disappears, and the default rule quietly takes over. It is the single most common this-bug in real code.',
      highlightLines: [10, 11],
    },
    {
      id: 'explicit-bind',
      caption:
        'New code — the cure. Rule three, the EXPLICIT rule: intro.bind(dog) returns a brand-new function whose this is permanently welded to dog. Call bound() bare — doesn’t matter; the binding survives however it’s called.',
      codeOverride: BIND_CODE,
      highlightLines: [1, 2, 3, 5, 6, 7],
    },
    {
      id: 'explicit-call-apply',
      caption:
        'bind has two cousins for when you want to set this for just ONE immediate call: intro.call(dog) runs intro right now with this = dog — no new function created. apply does the exact same job, with one difference: it takes the arguments as an array — call(dog, a, b) versus apply(dog, [a, b]).',
      codeOverride: BIND_CODE,
      highlightLines: [6, 7],
    },
    {
      id: 'arrows',
      caption:
        'And the modern cure: arrow functions have NO this of their own — nothing to swing at all. An arrow reads this the way it reads any outer variable: through the 5.3 rope, from where it’s WRITTEN.',
      codeOverride: BIND_CODE,
      highlightLines: [9, 10, 11, 12, 13, 14, 15],
    },
    {
      id: 'arrows-payoff',
      caption:
        'Trace it: peep is written inside hatch, so peep’s this IS hatch’s this. hatch itself was called as nest.hatch() — the implicit rule — so hatch’s this is nest, and peep borrows that. This is why arrows are beloved for callbacks written INSIDE a method… and forbidden AS a method (an arrow method’s this would rope right past the object to global).',
      highlightLines: [11, 16],
    },
    {
      id: 'checklist',
      caption:
        'The complete decision list, priority order — run it at any call site: (1) called with NEW? this = the freshly made object (next two lessons live here). (2) bind/call/apply? this = what you passed. (3) a dot? this = left of the dot. (4) bare call? global/undefined — probably a bug. Arrows: skip the list entirely; they borrow from their birthplace. Four rules and an exception — that is ALL of this.',
      highlightLines: [1, 2, 3],
    },
  ],
```

- [ ] **Step 3: Small recap tweak (mention `apply` for consistency)**

The recap already implies `apply` is taught (via `teachBack`'s existing model answer, which
already says "bind/call/apply"); this one-line edit brings the recap bullet in line with the
now-fully-taught term.

Old:
```tsx
  recap: [
    'this = decided at CALL time by the call’s shape. The body can’t know; the call site can. (Opposite of 5.3’s write-time ropes.)',
    'Priority: new → bind/call (explicit) → dot (implicit) → bare (default: global/undefined — the lost-this bug; fix with bind).',
    'Arrows have NO this — they borrow lexically from their birthplace: ideal inside methods as callbacks, wrong AS methods.',
  ],
```

New:
```tsx
  recap: [
    'this = decided at CALL time by the call’s shape. The body can’t know; the call site can. (Opposite of 5.3’s write-time ropes.)',
    'Priority: new → bind/call/apply (explicit) → dot (implicit) → bare (default: global/undefined — the lost-this bug; fix with bind).',
    'Arrows have NO this — they borrow lexically from their birthplace: ideal inside methods as callbacks, wrong AS methods.',
  ],
```

- [ ] **Step 4: Verify the invariant by hand**

Count entries: `VIEWS` must have exactly 9 objects, `steps` must have exactly 9 objects, same
order. This also confirms the pre-existing 6-steps/5-views mismatch is gone.

- [ ] **Step 5: Verify the build is clean**

Run: `npm run build`
Expected: exits 0, no TypeScript errors.

- [ ] **Step 6: Flag for browser verification**

Do not mark this lesson done — it needs the user's in-browser pass (Task 4).

---

### Task 4: Browser verification + progress log update

**Files:**
- Modify: `docs/plan/05-PROGRESS.md`

**Interfaces:** None.

- [ ] **Step 1: User verifies both lessons in the browser**

Run: `npm run dev`
The user opens lesson 5.4 and lesson 6.2, steps through every slide in order (and scrubs
backward at least once each, since `Viz` must stay correct both directions), and confirms:
- Each step's picture matches its caption.
- No step feels like it's cramming more than one new fact.
- The compass/needle wording in 5.4 appears only in the first two steps, not later ones.

This is a manual gate — do not proceed to a full rollout across the other 20 lessons until the
user confirms these two read well.

- [ ] **Step 2: Update `docs/plan/05-PROGRESS.md`**

Add a session log entry (top of the table stays newest-first per existing convention) noting:
the pacing audit across all 22 built Phase 5-7 lessons, the two pilot rewrites (5.4, 6.2) with
their new step counts, the three drive-by fixes (7.1 premature "listener," 6.3 encoding
artifact, 5.4's undefined `apply`), and that the remaining 20 lessons' rollout is gated on the
user's browser verification of this pilot. Update the "Next up" list's top item to point at
the rollout as the next unit of work once approved.

- [ ] **Step 3: Do not commit**

Leave all changes (Tasks 1-4) in the working tree, uncommitted, per the standing rule — the
user commits when ready.
