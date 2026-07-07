# "🎤 In an interview" Section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `🎤 In an interview` section to curated interview-relevant lessons — a card (question → Say this → Show this on paper → If they dig deeper → Don't say) that gives the technically-precise spoken answer an interviewer wants, with a real code example.

**Architecture:** One-time engine work adds an optional `interview` field to `LessonDef`, a new `InterviewCard` component, a `LessonShell` render block (placed BEFORE On-the-job), and an `extractInterview` lint pass. Then content is authored lesson-by-lesson, phase by phase, against a strict copy contract.

**Tech Stack:** React + TypeScript + Vite. Content is JSX object literals in `src/lessons/phaseN/lessonNN.tsx`. Verification is `npm run build` + `node scripts/lint-uth.mjs` + browser spot-check (this project has no unit-test harness for lessons — build + lint + browser IS the test cycle).

## Progress (2026-07-07)

- ✅ **Task 1 (engine)** — DONE. `interview` field (incl. `example`), `InterviewCard`, `LessonShell` block (above On-the-job), `extractInterview` lint. In the working tree, uncommitted.
- ✅ **Task 2 (3.7 closures)** — DONE, user-approved as the calibration reference.
- ✅ **Task 3 (back-ports 1.4, 1.9)** — DONE.
- ✅ **Task 4 (Phase 3: 3.5, 3.6, 3.8, 3.9)** — DONE.
- ⬜ **Tasks 5–11 (Phases 4–11 content)** — NOT STARTED. Author per the blocks below.
- ⬜ **Task 12 (docs/blueprint/memory + final sweep)** — NOT STARTED.

**Two model revisions were made while building Tasks 1–4** (both already reflected in the spec and in the Task 5–11 blocks below):
1. `say` is the COMPLETE spoken answer (headline + volunteered substance, ~20–30s), not a one-liner. `deeper` is only the genuinely harder follow-up.
2. Every card carries a real `example` (a `makeCounter`-style toy is banned). Rendered under a "Show this on paper" band.

## Global Constraints

- **NO git commits or pushes.** Standing project rule: the user commits on their own explicit word. Every task ends with the change verified and left in the working tree. Never run `git commit`. Never add a `Co-Authored-By` trailer.
- **Verification, not TDD tests.** Each task's "test cycle" is: `npm run build` green + `node scripts/lint-uth.mjs` clean + (for content) a browser spot-check. There are no `*.test` files for lessons.
- **Placement:** the section renders **before 💼 On the job** (order: quiz → 🎤 In an interview → 💼 On the job → Teach-back). Already wired in `LessonShell` (Task 1).
- **Copy contract for every `interview` block** (full rationale in the spec, `docs/superpowers/specs/2026-07-07-in-an-interview-section-design.md`):
  1. Real technical terms, **unglossed**, in `say`/`deeper` — that precision is the point. (This is the ONE section exempt from the gloss-everything rule.)
  2. Technical but simple: short sentences (≤28 words), one idea each, no waffle.
  3. `say` = a full answer you could speak: the headline sentence plus the 1–2 sentences you volunteer right after. `deeper` = only the harder probe that comes after.
  4. Every term used must already be taught earlier; cite the lesson on heavy use, e.g. `the heap (4.6)`.
  5. **No em dashes** anywhere in an `interview` block (lint enforces this).
  6. `dontSay.wrong` = a real shallow answer; `dontSay.why` = one line on what it confuses (usually mechanism vs syntax, or "where it lives vs what it does").
- **`example` contract:**
  1. A real artifact, not a toy. Something a candidate would actually talk through.
  2. `code` is a JS string with `\n` line breaks, written **on one source line** so the lint extractor stays robust (do not use a multi-line template literal).
  3. Only vocabulary taught **at or before this lesson's position** may appear in the code (no forward-referencing later APIs — e.g. no `fetch`/`setTimeout` in a Phase 1–3 example).
  4. **Show the behavior at least twice when the point is persistence or difference** (e.g. call the closure twice with different args; print two queue outcomes). One call cannot show "still remembers."
  5. `note` is one optional caption line (≤28 words, no em dash) saying what to point at.
- **Curly apostrophes inside JS strings.** Use `’` (not `'`) for apostrophes inside `say`/`deeper`/`note`/`wrong`/`why` string literals — a straight `'` closes the string and breaks the build. (Double quotes `"` inside a single-quoted string are fine.)
- **Placement in each lesson file:** the `interview: { … },` object is inserted **immediately before the `  teachBack: {` line** of that file's `LessonDef`. Close the object with `\n  },` at two-space indent, and close the inner `example`/`dontSay` objects at four-space indent (`\n    },`) — the lint extractor depends on this.
- **Every `(N.N)` citation must be confirmed against the real lesson file during the task** — the concept must be taught at or before the cited lesson. Where this plan's citation is wrong, fix the citation, not the technical point.

---

## Task 1: Engine — field, component, render block, lint pass ✅ DONE

Implemented in the working tree. For reference, the shipped shapes (do not redo unless a regression appears):

- `src/engine/lesson/types.ts` — `LessonDef.interview?: { question: string; say: ReactNode; example?: { code: string; note?: string }; deeper?: ReactNode; dontSay?: { wrong: string; why: string } }`.
- `src/design/InterviewCard.tsx` — bands: question bubble → **Say this** → **Show this on paper** (renders `example.code` in a `<pre>` + italic `note`) → **If they dig deeper** → **⚠ Don't say** (struck `wrong` + `why`).
- `src/engine/lesson/LessonShell.tsx` — `{def.interview && (…)}` section with coral tape `🎤 in an interview`, placed **before** the On-the-job block.
- `scripts/lint-uth.mjs` — `extractInterview(source)` matches `/\n  interview: \{([\s\S]*?)\n  \},/`, strips `code:`/`note:` quoted strings and the field keys, then runs the sentence-length + idiom + em-dash checks. The JARGON check is deliberately NOT applied.

Verify anytime with: `npm run build` (green) + `node scripts/lint-uth.mjs` (clean).

---

## Task 2: Calibration lesson — 3.7 closures ✅ DONE (user-approved)

Shipped block in `src/lessons/phase3/lesson37.tsx` (this is the reference for tone/shape all other cards follow):

```tsx
  interview: {
    question: 'What’s a closure?',
    say: 'A closure is a function that remembers the variables from where it was created, even after that outer function has returned. So the inner function can still read and update those variables later. That is how you get private state, or a helper that carries its own settings around.',
    example: {
      code: 'function makeDiscount(percent) {\n  return (price) => price - price * percent\n}\n\nconst half = makeDiscount(0.5)\n\nhalf(80)  // 40, still knows percent\nhalf(30)  // 15, still knows it',
      note: 'makeDiscount has already returned, but half still remembers percent on every later call.',
    },
    deeper:
      'If they ask where percent is kept: on the heap (4.6), not the stack (3.6), which is why it outlives the call. Every call to makeDiscount makes a fresh, private percent, so two discounts never share one.',
    dontSay: {
      wrong: 'A function inside a function.',
      why: 'That describes where it lives, not what it does. The point is the remembered variables.',
    },
  },
```

---

## Task 3: Back-ports — 1.4, 1.9 ✅ DONE

Shipped in `src/lessons/phase1/lesson14.tsx` and `lesson19.tsx`. (1.4 uses a block-scope leak example, not the `3 3 3` loop bug, because that bug needs closures + `setTimeout` — not taught at lesson 1.4.)

## Task 4: Phase 3 — 3.5, 3.6, 3.8, 3.9 ✅ DONE

Shipped in `src/lessons/phase3/lesson35.tsx`, `lesson36.tsx`, `lesson38.tsx`, `lesson39.tsx`.

---

## Task 5: Phase 4 — 4.5, 4.6, 4.7

**Files:** Modify `src/lessons/phase4/lesson45.tsx`, `lesson46.tsx`, `lesson47.tsx`

- [ ] **Step 1: 4.5 copying & equality** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Why does {} === {} return false?',
    say: 'Because each object literal creates a separate object in memory, and === on objects compares identity, not contents. Two different objects are never equal, even with identical fields. To compare contents you check field by field.',
    example: {
      code: 'const a = { id: 1 }\nconst b = { id: 1 }\n\na === b        // false, two different objects\na === a        // true, the same object\na.id === b.id  // true, same contents',
      note: 'a and b hold the same field but are two different objects, so === is false. Compare the fields to check contents.',
    },
    deeper:
      'An object variable holds a reference, an address (4.6). === compares the addresses. A deep compare walks the fields instead, which is what toEqual does (10.4).',
    dontSay: {
      wrong: 'They are equal because both are empty.',
      why: '=== on objects ignores contents. It asks if they are the same object, and these are two.',
    },
  },
```

- [ ] **Step 2: 4.6 value vs reference** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What’s the difference between passing by value and by reference?',
    say: 'Primitives like numbers are copied by value, so changing the copy never touches the original. Objects are passed by their reference, so two names can point at the same object. Mutating it through one name is visible through the other.',
    example: {
      code: 'let a = { n: 1 }\nlet b = a     // same object, not a copy\nb.n = 99\na.n           // 99, they share it\n\nlet x = 5\nlet y = x     // a real copy\ny = 99\nx             // 5, untouched',
      note: 'Objects are shared through a reference, so b changes a. Primitives are copied, so y never touches x.',
    },
    deeper:
      'The variable holds an address for objects (4.6). Reassigning the parameter only repoints the local name. Mutating the object through it changes the shared object the caller sees.',
    dontSay: {
      wrong: 'Objects are passed by reference, so reassigning the argument changes the caller’s variable.',
      why: 'Mutation is shared, but reassigning the parameter is not. JavaScript passes the reference by value.',
    },
  },
```

- [ ] **Step 3: 4.7 map/filter/reduce** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What’s the difference between map, filter, and reduce?',
    say: 'map turns each item into a new array of the same length. filter keeps only the items that pass a test. reduce folds the whole array into one value. All three take a function and leave the original array unchanged.',
    example: {
      code: 'const nums = [1, 2, 3, 4]\n\nnums.map(n => n * 2)               // [2, 4, 6, 8]\nnums.filter(n => n % 2 === 0)      // [2, 4]\nnums.reduce((sum, n) => sum + n, 0) // 10',
      note: 'map keeps the length, filter shrinks it, reduce collapses it to one value. nums itself is never changed.',
    },
    deeper:
      'reduce is the general one (4.7). You can build map and filter out of reduce. map differs from forEach because forEach returns nothing, so only map can be chained.',
    dontSay: {
      wrong: 'map and forEach are the same.',
      why: 'forEach returns nothing. map returns a new array, so only map can be chained.',
    },
  },
```

- [ ] **Step 4: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase4` (`clean`). Confirm `(4.6)`, `(4.7)`, `(10.4)` citations. Leave in working tree.

---

## Task 6: Phase 5 — 5.1, 5.4, 5.5, 5.6

**Files:** Modify `src/lessons/phase5/lesson51.tsx`, `lesson54.tsx`, `lesson55.tsx`, `lesson56.tsx`

- [ ] **Step 1: 5.1 hoisting & TDZ** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is hoisting?',
    say: 'Before running, JavaScript registers the declarations in each scope. Function declarations are ready right away. var starts as undefined. let and const are registered too but stay unusable until their line runs.',
    example: {
      code: 'console.log(a) // undefined, var is hoisted\nvar a = 1\n\nconsole.log(b) // ReferenceError\nlet b = 2      // b was in the temporal dead zone',
      note: 'var exists early as undefined. let exists too, but cannot be touched until its line, the temporal dead zone.',
    },
    deeper:
      'This is the two pass model (5.1). let and const sit in the temporal dead zone from the top of the block until their line runs. Touching them there throws.',
    dontSay: {
      wrong: 'let and const are not hoisted.',
      why: 'They are registered too. The difference is they stay in the temporal dead zone until declared (5.1).',
    },
  },
```

- [ ] **Step 2: 5.4 this** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'How does JavaScript decide what this is?',
    say: 'By how the function is called, not where it is defined. Called as obj.method(), this is obj. Called plain, this is undefined in strict mode. Arrow functions ignore the call and take this from the surrounding scope.',
    example: {
      code: 'const user = {\n  name: "Sam",\n  greet() { return this.name }\n}\n\nuser.greet()       // "Sam", this is user\nconst g = user.greet\ng()                // undefined, this is lost',
      note: 'Called as user.greet(), this is user. Pulled off and called plain, the same function loses its this.',
    },
    deeper:
      'The rules have an order (5.4): new, then call, apply, or bind, then the object before the dot, then default. Arrow functions ignore all of that and use lexical this.',
    dontSay: {
      wrong: 'this is the object the function is written in.',
      why: 'this depends on the call site, so the same function can have a different this each call (5.4).',
    },
  },
```

- [ ] **Step 3: 5.5 prototypes** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is the prototype chain?',
    say: 'Every object has a hidden link to another object, its prototype. When you read a property the object does not have, JavaScript follows that link upward until it finds it or reaches the end. That chain is how objects share methods.',
    example: {
      code: 'const arr = [1, 2, 3]\n\narr.hasOwnProperty("map") // false, arr has no map of its own\narr.map(n => n)           // works anyway\n// map was found up the chain on Array.prototype',
      note: 'arr does not own map. JavaScript follows the hidden link to Array.prototype and finds it there.',
    },
    deeper:
      'This is how inheritance works in JavaScript (5.5). Methods live once on the prototype, and every instance borrows them through the chain instead of copying them.',
    dontSay: {
      wrong: 'JavaScript classes work like Java classes.',
      why: 'class is syntax over prototypes (5.6). Under it there is still one prototype object the instances link to.',
    },
  },
```

- [ ] **Step 4: 5.6 classes** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Is a JavaScript class a real class?',
    say: 'It is syntax over prototypes (5.5). class is a cleaner way to write a constructor and put methods on its prototype. extends links one prototype to another. Under the hood it is the same prototype machinery, not a new kind of thing.',
    example: {
      code: 'class Animal { speak() { return "..." } }\nclass Dog extends Animal {}\n\nconst d = new Dog()\nd.speak()                          // "...", found up the chain\nd.speak === Animal.prototype.speak // true, one shared method',
      note: 'speak is not copied onto d. It lives once on the prototype, and extends links Dog to Animal.',
    },
    deeper:
      'Methods you write in a class go on the prototype, shared by all instances. extends links one prototype to another, which is how the chain forms (5.5).',
    dontSay: {
      wrong: 'Classes were added to replace prototypes.',
      why: 'They desugar to prototypes (5.6). The same model runs underneath, with nicer syntax.',
    },
  },
```

- [ ] **Step 5: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase5` (`clean`). Confirm `(5.1)`, `(5.4)`, `(5.5)`, `(5.6)` citations. Leave in working tree.

---

## Task 7: Phase 6 — 6.1, 6.2, 6.4, 6.5, 6.6

**Files:** Modify `src/lessons/phase6/lesson61.tsx`, `lesson62.tsx`, `lesson64.tsx`, `lesson65.tsx`, `lesson66.tsx`

- [ ] **Step 1: 6.1 blocking vs non-blocking** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What does blocking the main thread mean?',
    say: 'JavaScript runs on one thread. A long synchronous task holds that thread, so nothing else can run. Clicks, typing, and rendering all freeze until it finishes. That is why slow work should be handed off as asynchronous.',
    example: {
      code: 'const end = Date.now() + 3000\nwhile (Date.now() < end) {}\n// the page is frozen for 3 seconds:\n// clicks, typing, and animation all wait',
      note: 'This loop holds the one thread, so the whole page freezes until it finishes. Slow work must be async instead.',
    },
    deeper:
      'Async work is handed off and the thread stays free (6.1). The result comes back later through the event loop (6.2). The callback still runs on the one main thread, only the waiting is handed off.',
    dontSay: {
      wrong: 'async code runs on another thread.',
      why: 'The callback still runs on the one main thread. Only the waiting is handed off, not your JavaScript (6.2).',
    },
  },
```

- [ ] **Step 2: 6.2 event loop** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Explain the event loop.',
    say: 'JavaScript runs on one thread. Slow work is handed to the environment, and its callback waits in a queue when done. The event loop runs a queued callback only when the call stack is empty. It drains all microtasks before the next macrotask.',
    example: {
      code: 'console.log("A")\nsetTimeout(() => console.log("B"), 0)\nPromise.resolve().then(() => console.log("C"))\nconsole.log("D")\n\n// prints: A, D, C, B',
      note: 'A and D run first. Then the promise callback C, a microtask. Then the timer B, a macrotask, last.',
    },
    deeper:
      'There are two queues (6.5). The loop drains the whole microtask queue, the promise callbacks, before it takes one macrotask like a timer. That is why C prints before B.',
    dontSay: {
      wrong: 'The event loop runs things in parallel.',
      why: 'It runs one thing at a time. It just decides what runs next when the stack is empty (6.2).',
    },
  },
```

- [ ] **Step 3: 6.4 promises** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is a promise?',
    say: 'A promise is an object for a value that is not ready yet. It is pending, then either fulfilled with a value or rejected with an error. You attach then and catch to react when it settles, and a settled promise never changes again.',
    example: {
      code: 'const p = Promise.resolve(5)\n\np.then(n => console.log(n)) // 5, but later\nconsole.log("runs first")\n\n// prints: runs first, then 5',
      note: 'then always runs its callback later, after the current code finishes, even when the value is already ready.',
    },
    deeper:
      'then always runs its callback as a microtask (6.5), even on an already resolved promise. The promise is just the handle you read the result through, it does not run the work itself.',
    dontSay: {
      wrong: 'A promise runs the async work.',
      why: 'The work is already running. The promise is just the handle you use to read its result later (6.4).',
    },
  },
```

- [ ] **Step 4: 6.5 microtask/macrotask order** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Does a promise callback or setTimeout(fn, 0) run first?',
    say: 'The promise callback runs first. Promise callbacks are microtasks. Timers are macrotasks. After each macrotask the event loop empties the whole microtask queue before taking the next macrotask, so microtasks always jump ahead.',
    example: {
      code: 'setTimeout(() => console.log("timeout"), 0)\nPromise.resolve().then(() => console.log("promise"))\n\n// prints: promise, then timeout',
      note: 'Both are queued with no delay, but the promise is a microtask, so it runs before the setTimeout macrotask.',
    },
    deeper:
      'After each macrotask the loop drains every microtask, including ones added while draining (6.5). setTimeout(fn, 0) still waits for the stack to clear and the microtasks to finish.',
    dontSay: {
      wrong: 'setTimeout(fn, 0) runs immediately.',
      why: 'Zero is a minimum delay, not now. It waits for the stack and all microtasks first (6.5).',
    },
  },
```

- [ ] **Step 5: 6.6 async/await** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What does async/await actually do?',
    say: 'It is syntax over promises (6.4). async makes a function return a promise. await pauses inside that function until a promise settles, then gives you the value. It reads like straight line code but does not block the thread.',
    example: {
      code: 'async function load() {\n  try {\n    const user = await getUser() // returns a promise\n    return user.name\n  } catch (err) {\n    return "failed"\n  }\n}',
      note: 'await pauses inside load until getUser settles, then hands back the value. try and catch catches a rejection.',
    },
    deeper:
      'await does not block the thread (6.1). It hands control back to the event loop and resumes later as a microtask (6.5). Only that async function pauses, the thread stays free.',
    dontSay: {
      wrong: 'await stops everything until the promise finishes.',
      why: 'It only pauses that async function. The thread is free to run other work meanwhile (6.6).',
    },
  },
```

- [ ] **Step 6: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase6` (`clean`). Confirm `(6.1)`, `(6.2)`, `(6.4)`, `(6.5)`, `(6.6)` citations. Leave in working tree.

---

## Task 8: Phase 7 — 7.1, 7.2, 7.4, 7.8

**Files:** Modify `src/lessons/phase7/lesson71.tsx`, `lesson72.tsx`, `lesson74.tsx`, `lesson78.tsx`

- [ ] **Step 1: 7.1 DOM** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is the DOM?',
    say: 'The DOM is the live tree of objects the browser builds from your HTML. Your JavaScript reads and changes that tree, and the page updates to match. The DOM is the objects in memory, not the HTML text you started with.',
    example: {
      code: '// HTML: <button id="buy">Buy</button>\n\ndocument.querySelector("#buy").textContent = "Sold"\n// the page now shows Sold\n// the original HTML text never changed',
      note: 'The HTML was the starting text. Script changes the live object, and the page updates. That live tree is the DOM.',
    },
    deeper:
      'Each tag becomes a node with parents and children (7.1). Changing a node changes what is shown. Automation tools drive the page by finding and acting on these nodes.',
    dontSay: {
      wrong: 'The DOM is the HTML file.',
      why: 'The HTML is the starting text. The DOM is the live object tree, which script can change after load (7.1).',
    },
  },
```

- [ ] **Step 2: 7.2 selectors / locators** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'How do you find an element to test reliably?',
    say: 'With a selector that targets what the user sees, like a role, a visible label, or a test id. Avoid selectors tied to layout or deep structure, which break on any redesign. A Playwright locator also stays lazy and re-finds the element each time it acts.',
    example: {
      code: '// brittle: breaks on any layout change\npage.locator("div > div:nth-child(3) button")\n\n// robust: targets what the user sees\npage.getByRole("button", { name: "Buy" })',
      note: 'The role and visible name survive a redesign. A deep structural path breaks the moment the layout shifts.',
    },
    deeper:
      'A Playwright locator wraps a selector but stays lazy (7.2). It finds the element again each time it acts, so it survives the page changing between steps.',
    dontSay: {
      wrong: 'Use the element’s full CSS path.',
      why: 'A long structural path breaks on any layout change. Prefer role, text, or a test id (7.2).',
    },
  },
```

- [ ] **Step 3: 7.4 event delegation** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is event delegation?',
    say: 'You put one listener on a parent instead of many on each child. Events bubble up from the target, so the parent hears them and checks which child was clicked. It also handles children added later, which per child listeners would miss.',
    example: {
      code: '// one listener on the parent, not one per row\nlist.addEventListener("click", (e) => {\n  if (e.target.matches(".delete")) {\n    remove(e.target)\n  }\n})',
      note: 'Clicks on any row bubble up to list. The parent checks the target, so rows added later work too.',
    },
    deeper:
      'Events travel down, then bubble up through ancestors (7.4). Because the parent catches them, it also handles children added later, which a per child listener would miss.',
    dontSay: {
      wrong: 'Delegation means fewer clicks.',
      why: 'The user still clicks each thing. Delegation is fewer listeners, using bubbling to handle them in one place (7.4).',
    },
  },
```

- [ ] **Step 4: 7.8 why elements aren’t ready** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Why can an element be in the DOM but not ready to click?',
    say: 'Being in the tree is not the same as being visible and interactive. An element may be hidden, still loading, or covered by another. The pixels lag behind the markup, so a test must wait for it to be actionable, not just present.',
    example: {
      code: '// <div id="msg" style="display:none">Saved</div>\n\ndocument.querySelector("#msg") // found, it is in the DOM\n// but display:none means it is not rendered,\n// so a real click would fail',
      note: 'The element is in the tree but not rendered. In the DOM is not the same as visible and clickable.',
    },
    deeper:
      'The browser parses, builds the render tree, lays out, then paints (7.8). A display none element is in the DOM but not rendered. This gap is why tests must wait.',
    dontSay: {
      wrong: 'If it is in the DOM I can click it.',
      why: 'It may be hidden or not yet painted (7.8). You wait for it to be actionable, not just present.',
    },
  },
```

- [ ] **Step 5: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase7` (`clean`). Confirm `(7.1)`, `(7.2)`, `(7.4)`, `(7.8)` citations. Leave in working tree.

---

## Task 9: Phase 8 & 9 — 8.4, 9.3, 9.6

**Files:** Modify `src/lessons/phase8/lesson84.tsx`, `src/lessons/phase9/lesson93.tsx`, `src/lessons/phase9/lesson96.tsx`

- [ ] **Step 1: 8.4 ?. and ??** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What do ?. and ?? do?',
    say: '?. reads a property and stops safely if the thing before it is null or undefined, returning undefined instead of throwing. ?? gives a fallback only when the value is null or undefined. That makes ?? the safe default operator.',
    example: {
      code: 'const city = user?.address?.city // undefined if any hop is missing\n\nconst port = config.port ?? 3000 // 3000 only if null or undefined\nconst bad = config.port || 3000  // wrong: also replaces 0',
      note: '?. stops safely on a missing hop. ?? falls back only on null or undefined, unlike || which also replaces 0.',
    },
    deeper:
      '?? differs from || because || also replaces 0 and empty string (8.4). ?? treats those as real values, so it is the safe choice for a default.',
    dontSay: {
      wrong: '?? is the same as ||.',
      why: '|| replaces any falsy value, including 0 and empty string. ?? only replaces null and undefined (8.4).',
    },
  },
```

- [ ] **Step 2: 9.3 CJS vs ESM** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What’s the difference between CommonJS and ES modules?',
    say: 'CommonJS uses require and module.exports and loads modules at run time. ES modules use import and export and are resolved statically before the code runs. ESM is the modern standard, and mixing the two causes errors.',
    example: {
      code: '// CommonJS, loads at run time\nconst fs = require("fs")\nmodule.exports = { run }\n\n// ES modules, resolved before running\nimport fs from "fs"\nexport { run }',
      note: 'require and module.exports are CommonJS. import and export are ES modules, and "type": "module" selects them.',
    },
    deeper:
      'require returns a value you can call conditionally (9.3). import is static, so tools can analyze it. "type": "module" or an .mjs file selects ESM.',
    dontSay: {
      wrong: 'They are interchangeable.',
      why: 'Mixing them causes errors like ERR_REQUIRE_ESM. import is static, require is dynamic (9.3).',
    },
  },
```

- [ ] **Step 3: 9.6 Node’s event loop / libuv** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'How does Node stay responsive with one thread?',
    say: 'Node hands slow input and output to libuv, which does the waiting off your thread. Your JavaScript keeps running, and when the work is done its callback is queued for the event loop. One thread can hold thousands of parked jobs this way.',
    example: {
      code: 'const fs = require("fs")\n\nfs.readFile("big.txt", () => console.log("done"))\nconsole.log("not blocked")\n\n// prints: not blocked, then done',
      note: 'readFile hands the waiting to libuv off thread. Your code keeps running, and the callback fires when the file is ready.',
    },
    deeper:
      'One thread can have thousands of parked jobs (9.6). This non blocking I/O is why Node handles many connections at once. A synchronous read would freeze all of them.',
    dontSay: {
      wrong: 'Node is multithreaded, so it is fast.',
      why: 'Your JavaScript is single threaded. libuv does the waiting off thread, but callbacks still run one at a time (9.6).',
    },
  },
```

- [ ] **Step 4: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase8 phase9` (`clean`). Confirm `(8.4)`, `(9.3)`, `(9.6)` citations. Leave in working tree.

---

## Task 10: Phase 10 — 10.2, 10.4, 10.6

**Files:** Modify `src/lessons/phase10/lesson102.tsx`, `lesson104.tsx`, `lesson106.tsx`

- [ ] **Step 1: 10.2 testing pyramid** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is the testing pyramid?',
    say: 'A shape for your test mix: many fast unit tests at the base, fewer integration tests, and few slow end to end tests on top. You ask each question at the cheapest layer that can answer it. The inverted mix, mostly end to end, is the anti pattern.',
    example: {
      code: '// 500 unit tests   ~ 5ms each   = 2.5s\n// 40 integration    ~ 200ms each = 8s\n// 5 end-to-end       ~ 8s each    = 40s\n// most questions answered at the cheap base',
      note: 'The same coverage moved up to end to end would take many minutes and flake often. Ask at the cheapest layer.',
    },
    deeper:
      'Cost and confidence pull opposite ways (10.2). End to end tests catch real breakage but are slow and flaky. The inverted cone, mostly end to end, is the anti pattern.',
    dontSay: {
      wrong: 'End to end tests are best, so write mostly those.',
      why: 'They are slow and flaky in bulk (10.2). Push logic checks down to fast unit tests.',
    },
  },
```

- [ ] **Step 2: 10.4 toBe vs toEqual** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What’s the difference between toBe and toEqual?',
    say: 'toBe uses ===, so for objects it checks identity, the same object in memory. toEqual walks the structure and compares field by field. You use toBe for primitives like numbers and strings, and toEqual for objects and arrays.',
    example: {
      code: 'expect(2 + 2).toBe(4)         // pass, primitives\n\nconst a = { id: 1 }\nexpect(a).toBe({ id: 1 })     // FAIL, different objects\nexpect(a).toEqual({ id: 1 })  // pass, same contents',
      note: 'toBe uses ===, so two equal looking objects fail it. toEqual walks the fields. Primitives use toBe.',
    },
    deeper:
      'Two objects with equal contents fail toBe because they have different addresses (4.6). toEqual compares the trees (10.4), so it passes.',
    dontSay: {
      wrong: 'toBe and toEqual are interchangeable.',
      why: 'For objects, toBe checks identity and usually fails. toEqual checks contents (10.4).',
    },
  },
```

- [ ] **Step 3: 10.6 test doubles & TDD** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is a mock, and what is TDD?',
    say: 'A test double stands in for a real dependency so a test stays fast and predictable. A stub feeds fixed input, and a spy records how it was called. TDD is writing the failing test first, then the code, so the red step proves the test can fail.',
    example: {
      code: 'const getUser = () => ({ name: "Sam" }) // stub\nconst sent = []\nconst send = (msg) => sent.push(msg)    // spy\n\nnotify(getUser, send)\nsent.length // 1, we can assert it was called',
      note: 'The stub replaces a real dependency so the test is predictable. The spy records calls so you can check them.',
    },
    deeper:
      'Double at the boundary, not everything (10.6). Over mocking makes tests pass while the app breaks. The red step of TDD proves the test can actually fail.',
    dontSay: {
      wrong: 'Mock everything so tests are isolated.',
      why: 'Over mocking tests your mocks, not your code. Double only at real boundaries (10.6).',
    },
  },
```

- [ ] **Step 4: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase10` (`clean`). Confirm `(4.6)`, `(10.2)`, `(10.4)`, `(10.6)` citations. Leave in working tree.

---

## Task 11: Phase 11 — 11.6, 11.9, 11.10, 11.15

**Files:** Modify the phase11 files whose ids are `11.6`, `11.9`, `11.10`, `11.15`.

> Confirm filenames first: `grep -rl "id: '11\.\(6\|9\|10\|15\)'" src/lessons/phase11`. The likely names are `lesson116.tsx`, `lesson119.tsx`, `lesson1110.tsx`, `lesson1115.tsx`, but verify by id, not by guessing.

- [ ] **Step 1: 11.6 auto-waiting** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'How does Playwright handle waiting, and why not sleep?',
    say: 'Before each action Playwright waits for the element to be actionable: visible, attached, stable, and enabled. A fixed sleep either wastes time or is too short under load, which is what makes tests flaky. The waiting is built into every action.',
    example: {
      code: '// no sleep needed\nawait page.getByRole("button", { name: "Save" }).click()\n// Playwright waits until the button is visible,\n// attached, stable, and enabled before clicking',
      note: 'The wait is built into the action and polls until ready. A fixed sleep is either too slow or too short.',
    },
    deeper:
      'The waiting is built into the action and polls until the element is ready (11.6). This handles spinners and late content without you guessing a duration.',
    dontSay: {
      wrong: 'Add a sleep to fix the flaky test.',
      why: 'A sleep guesses the wait and still fails under load. Let the locator auto wait instead (11.6).',
    },
  },
```

- [ ] **Step 2: 11.9 Page Object Model** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What is the Page Object Model?',
    say: 'A pattern where each page’s locators and actions live in one class. Tests call methods like login instead of repeating selectors everywhere. When the page changes, you edit one file and every test that uses it heals at once.',
    example: {
      code: 'class LoginPage {\n  constructor(page) { this.page = page }\n  async login(user, pass) {\n    await this.page.fill("#user", user)\n    await this.page.click("#submit")\n  }\n}\n// tests call loginPage.login(...), not raw selectors',
      note: 'Selectors live in one class. When the page changes, you edit here once and every test using it heals.',
    },
    deeper:
      'It keeps selectors out of the tests (11.9). One redesign then means one edit, and every test that uses that page heals at once.',
    dontSay: {
      wrong: 'The Page Object Model makes tests run faster.',
      why: 'It is about maintenance, not speed. One page change becomes one edit, not many (11.9).',
    },
  },
```

- [ ] **Step 3: 11.10 network interception** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'Why intercept network requests in a test?',
    say: 'To control what the app receives without a real server. You match a request and fulfill it yourself, returning fixed data or forcing an error. That makes tests fast and deterministic, and lets you check how the UI handles a 500 or a timeout.',
    example: {
      code: 'await page.route("**/api/user", route =>\n  route.fulfill({ status: 500 })\n)\n// load the page and check it shows the error state,\n// with no real server needed',
      note: 'You force a 500 the real backend rarely gives. That lets you test the sad path fast and every time.',
    },
    deeper:
      'You match a request and fulfill it yourself (11.10). This makes tests fast and deterministic, and lets you check how the UI handles a 500 or a timeout.',
    dontSay: {
      wrong: 'Interception is only for speed.',
      why: 'Its bigger value is forcing errors and edge cases you cannot reliably cause with a live backend (11.10).',
    },
  },
```

- [ ] **Step 4: 11.15 flakiness** (insert before `  teachBack: {`):

```tsx
  interview: {
    question: 'What makes a test flaky, and how do you fix it?',
    say: 'A flaky test passes and fails on the same code. The common causes are fixed sleeps, shared state between tests, and depending on run order. You fix the cause, usually timing or shared state, rather than just adding a retry that hides it.',
    example: {
      code: '// flaky: guesses the wait, reuses data\nawait page.waitForTimeout(1000)\nconst name = "test-user"\n\n// fixed: auto-wait + unique data per run\nawait expect(toast).toBeVisible()\nconst name = "user-" + Date.now()',
      note: 'Replace the sleep with an auto waiting assertion, and give each run unique data. A retry only hides the cause.',
    },
    deeper:
      'Auto waiting removes timing flakes (11.6). Unique data per run and isolation remove shared state flakes (11.15). Retries hide flakes, they do not fix them.',
    dontSay: {
      wrong: 'Just add a retry to fix flaky tests.',
      why: 'Retries mask the cause and slow the suite. Find the real source, usually timing or shared state (11.15).',
    },
  },
```

- [ ] **Step 5: Verify.** `npm run build` (green), `node scripts/lint-uth.mjs phase11` (`clean`). Confirm `(11.6)`, `(11.9)`, `(11.10)`, `(11.15)` citations. Leave in working tree.

---

## Task 12: Docs, blueprint, memory, final sweep

**Files:** Modify `docs/plan/04-LESSON-BLUEPRINT.md`, `docs/plan/05-PROGRESS.md`; create `C:\Users\Admin\.claude\projects\D--Code-js-for-babies\memory\feedback-interview-section.md` + one line in `MEMORY.md`.

- [ ] **Step 1: Blueprint.** Add `🎤 In an interview` to the lesson-anatomy list (**before** 💼 On the job), and add a subsection **"The 🎤 In-an-interview section (2026-07-07)"** capturing the copy + example contract from this plan's Global Constraints: real terms unglossed (the one exception to gloss-everything), `say` is a full spoken answer, a real `example` (never a toy, show the behavior twice when the point is persistence/difference, only position-taught vocab), every term cited, no em dashes, curated interview-topic lessons only. Note the lint: `extractInterview` runs sentence-length + idiom + em-dash checks but NOT the jargon check.

- [ ] **Step 2: Progress.** Add a "Next up" entry: the `🎤 In an interview` section shipped in code (engine + ~34 curated lessons: 1.4, 1.9, and Phases 3–11), spec + plan paths, UNCOMMITTED per standing rule, section placed above On-the-job, `say`+`example` model.

- [ ] **Step 3: Memory.** Create `feedback-interview-section.md` (type: feedback): curated interview-topic lessons (Phase 3+ plus 1.4/1.9) carry a `🎤 In an interview` card — the one place real terminology is used unglossed, `say` is a full spoken answer, each has a real code example (no toys; show behavior twice for persistence/difference), no em dashes, placed above On-the-job. Add a one-line pointer to `MEMORY.md`. Link `[[feedback-uth-style-contract]]`.

- [ ] **Step 4: Full-course sweep.**
  - `npm run build` → green.
  - `node scripts/lint-uth.mjs` → `UTH lint: clean` across all phases.
  - `grep -rc "interview: {" src/lessons | grep -v ":0" | wc -l` → expect **34** files (1.4, 1.9 + the Phase 3–11 topics). Investigate any mismatch.
  - Leave everything in the working tree. **Report the work is ready and awaits the user's word to commit — do NOT commit.**

---

## Self-review notes

- **Spec coverage:** field + `example` + component (Task 1) · placement before On-the-job (Task 1, Global Constraints) · fuller `say` + real `example` model (Global Constraints, every content block) · content contract incl. unglossed-terms exception + lint exclusion (Task 1, Task 12 Step 1) · curated scope incl. 1.4/1.9 back-ports (Tasks 2–11) · blueprint/memory updates (Task 12). All spec sections map to a task.
- **No commits:** every task deliberately ends "leave in the working tree," overriding the writing-plans commit-step convention because the project's standing rule forbids commits without the user's word.
- **Citations flagged for verification** in each content task's final step. Genuinely uncertain spots were resolved during Tasks 2–4 (3.2 = params/fresh slots, 3.4 = functions are values, 3.8 = HOF/callbacks, all confirmed against registry.ts).
- **Example vocab check:** each `example` was written to avoid forward-referencing APIs (no `fetch`/`setTimeout` before Phase 6; 6.4 uses `Promise.resolve` not `fetch`; 6.6 awaits a generic `getUser()` not `fetch`). Confirm during authoring.
