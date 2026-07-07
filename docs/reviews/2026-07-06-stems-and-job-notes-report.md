# Quiz-Stem Clarity + "On the job" Section — Before/After Report

Tracks every quiz-stem reword (Quiz-Stem Contract) and every 💼 job-note migration (Note
Migration Procedure) from `docs/superpowers/plans/2026-07-06-quiz-stems-and-on-the-job-section.md`.

| lesson | surface | before | after |
|---|---|---|---|
| 2.1 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> test code is <em>full</em> of forks: "if the element is visible, click it; else fail with a screenshot." More importantly, <strong>every bug report you will ever write is a story about a branch</strong>. You expected the true road; the program took the false one. Pointing at the exact fork — and the exact boolean that misfired — separates "it's broken" from a bug report developers love.` | New `onTheJob` section: `ChatBubble` bug report ("The login button does nothing on iPad. I expected the success flow (the happy path, where everything works)…") + developer reply + `Takeaway`: "Every bug report you will ever write is **a story about a branch**. Name the fork. Name the boolean." |
| 2.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> truthy/falsy bugs are <em>silent</em>. A form that checks if (quantity) treats a legitimate quantity of 0 as "missing"...` | New `onTheJob` section: `AppMoment` (quantity field = 0, wrong "please enter a quantity" warning) + `ReviewCard` (`if (quantity) { addToCart(); }` annotated "0 is falsy") + `Takeaway`: "No error. No crash… **That is the falsy list. You own it now.**" |
| 2.3 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> chains of else-if handling <em>ranges</em> (like our grades) appear constantly in test logic. "Status 2xx → pass, 4xx → client error, 5xx → server error" is a textbook chain...` | New `onTheJob` section: `ReviewCard` (grades.js, dead gate annotated) + reviewer `ChatBubble` ("Every score above 40 stops at gate one…") + `Takeaway`: "Reviewers catch dead gates fast. **Phase 10 makes reviewing part of your job.**" |
| 2.3 | quiz Q1 stem | `For how many values of n can bigPrize() ever run? Type the number.` | `n can be any number. How many of them make bigPrize() run? Type the count — 0 if none.` (placeholder `a number…` → `how many…`) |
| 2.3 | quiz Q2 stem | `x is "a" — and notice the first case has NO break. How many numbers print? Type it.` | `x is "a". How many numbers print? Type the count.` |
| 2.6 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> for loops drive data-driven tests: "for each of these 50 usernames, run the login test". One body, fifty laps. And the counter tells you exactly which lap failed.` | New `onTheJob` section: `TestRunCard` (50 usernames, ✗ at user 24) + caption "the counter names the failing lap: i = 24" + `Takeaway`: "One body, fifty laps. **The counter tells you exactly which lap failed.** Phase 11 gives this pattern its real name: data-driven testing." |
| 2.4 | onTheJob (was UTH job-flavored aside, unbadged) | `In test code you'll constantly read patterns like config.timeout ?? 30000 ("use the configured timeout, defaulting to 30 seconds") and element && element.click() — and now they read like sentences.` | New `onTheJob` section: `ReviewCard` (`login.spec.js`, two lines: `config.timeout ?? 30000` and `element && element.click()`) + `Takeaway`: "Real test code reads like **short sentences once you know ?? and &&**." |
| 3.1 | onTheJob (was UTH job-flavored closing sentence, unbadged, split from a mechanism paragraph) | Full paragraph: `Inside there's no real belt, of course. What actually happens: the engine saves the body's lines in memory... A call makes the engine jump to the saved lines, run them top to bottom, and jump back to where the call was. That's the entire trick — and every Playwright line you'll write someday, page.click(), expect(), is pressing GO on a machine someone else built.` | UTH keeps the mechanism sentences (engine saves body in memory, jump/run/jump back) — genuine Under-the-Hood depth, not job content. New `onTheJob` section takes only the closing sentence: `ReviewCard` (`login.spec.js`, `page.click()` / `expect()` calls annotated "a call: press GO on saved code") + `Takeaway`: "You did not write page.click() or expect(). You called them. Every line like this is **pressing GO on a machine someone else built**." |
| 3.3 | onTheJob (was UTH job-flavored paragraph, unbadged) | `This idea is the heart of your future job. A test line like expect(getTotal()).toBe(42) means "run getTotal, take what it hands back, check it's 42" — which only works if getTotal returns its answer. A function that only prints its answer can't be tested this way: the text went to the screen, and no program can read the screen.` | New `onTheJob` section: `ReviewCard` (`cart.spec.js`, `expect(getTotal()).toBe(42);`) + `Takeaway`: "This works only if **getTotal returns its answer**. A function that only prints its answer cannot be tested this way. The text went to the screen. No program can read the screen." |

## Scope note: unbadged job-flavored asides

2.4's UTH held a job-flavored aside that was never marked with the `💼` badge, so the plan's
grep-built inventory (exactly 59 badged paragraphs) never counted it. User decision
(2026-07-07): migrate it now, and treat the plan's "59" as a floor rather than an exact
count — during Tasks 6–11, watch each phase's UTH for similar unbadged job-style prose (not
just the badged notes) and migrate any found, logging them here. Task 12's final "59" grep
check will need to report the actual total instead of asserting exactly 59.

3.1 added a variant of this pattern: a single UTH paragraph mixing genuine mechanism
explanation (how a function call actually works in memory) with a job-flavored closing
sentence. Rather than moving the whole paragraph, only the job-flavored sentence migrated;
the mechanism sentences stay in Under the Hood untouched, since they are depth content, not
job content. Watch for more mixed paragraphs like this in later batches — split, don't
relocate whole paragraphs when only part is job-flavored.

## Verification (Task 5)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)

## Task 6 — Phases 0–2 stem audit + Phase 0–1 note migrations

### Stem audit (phases 0, 1, 2)

Every quiz question in phases 0–2 (~52 questions beyond 2.3's already-fixed two) was checked
against the Quiz-Stem Contract, cross-referencing each stem's accompanying `code` field (not
just the question text, since many typed checks lean on a visible concrete-value code block
for their situation). Result: **zero new failures.** All other stems in phases 0–2 use
concrete literal values in their code (unlike 2.3's parametric `n`), so "type what X
prints/evaluates to" phrasing is already self-contained, and none contain a trick-pointer
("notice…", "hint:"). No rewords needed in this batch.

### Note migrations (0.5, 1.6, 1.7, 1.8, 1.9, 1.10)

| lesson | surface | before | after |
|---|---|---|---|
| 0.5 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> your work includes making software fail on purpose and reading what it says. A tester who reads error messages calmly and precisely is rare and valuable.` (preceded by "keep this framing forever: errors are evidence, not verdicts.", same paragraph) | New `onTheJob` section: `AppMoment` showing `ReferenceError: userName is not defined.` (the lesson's own example) + `Takeaway`: "Your job includes making software fail on purpose, then reading what it says. Do it calmly and precisely: that skill is rare and valuable. **Errors are evidence, not verdicts.**" |
| 1.6 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> for an automation tester this is everyday work: `Expected ${expected} but got ${actual}` is the shape of every good failure message.`` | New `onTheJob` section: `TestRunCard` (a failed login test printing `Expected "Welcome" but got "Error"`) + `Takeaway`: "Template strings build that exact sentence: `` `Expected ${expected} but got ${actual}` ``. **That is the shape of every good failure message.**" |
| 1.7 | onTheJob (was UTH 💼 note, **vocabulary rebuild**) | `<strong>💼 On the job —</strong> API responses are full of nulls. "middleName": null means the field exists and is deliberately empty. undefined usually means the field is missing entirely. "Empty on purpose" and "forgot to include it" are different bugs, with different fixes. Your future assertions will distinguish the two constantly.` | New `onTheJob` section, rebuilt without "API" (untaught until 4.13/6.7) and "assertions" (untaught until Phase 10): `AppMoment` showing `middleName = null` / `nickname = undefined` (plain "saved profile data", no JSON syntax) + `Takeaway`: "null means the person left middleName empty on purpose. undefined means nickname was never even created. **"Empty on purpose" and "forgot to include it" are different bugs.** Your future checks will tell them apart constantly." (checks replaces assertions) |
| 1.8 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> why should a tester care about dynamic typing? Because it is a bug factory. Nothing stops a variable that held a number from silently becoming a string... Entire categories of production bugs boil down to "this value was not the type everyone assumed." Many of your future test cases target exactly that.` | New `onTheJob` section (dropped "production", kept the fact plainly): `ReviewCard` (`cart.js`, `let total = "10"; console.log(total + 1);` annotated "prints \"101\", not 11") + `Takeaway`: "Nothing stops a variable that held a number from silently becoming a string. **Many of your future test cases exist to catch exactly this.**" |
| 1.9 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> this one will bite you as an automation tester: everything typed into a form arrives as a string. So age + 1, where age came from an input field, is "25" + 1 → "251" — a birthday bug, silently.`` | New `onTheJob` section: `AppMoment` (age field holding `"25"`, annotated `age + 1 → "251", not 26`) + `Takeaway`: "Everything typed into a form arrives as a string. **"25" + 1 glues into "251" instead of adding to 26.** A birthday bug, silently." |
| 1.10 | onTheJob (was UTH 💼 note, **vocabulary rebuild**) | `<strong>💼 On the job —</strong> a test assertion IS a boolean expression... "Status is 200 AND the reply includes the id AND it took under 2 seconds" — that is three comparisons and two &&s. Today's grammar is the daily language of test automation.` | New `onTheJob` section, rebuilt without "assertion" and the status-code/API example (both untaught at this lesson's position): `ReviewCard` (`signup.spec.js`, `age >= 18 && hasConsent && !isBlocked` — built entirely from Phase-1 vocabulary) + `Takeaway`: "A test check is just a boolean expression. **Three comparisons and two &&s, evaluating to one true or false.** That is the grammar you just learned." (status-code example relocated — see Relocations log) |

### Verification (Task 6)

- `node scripts/lint-uth.mjs` → one finding (`0.5 (on the job): job: long sentence (29w)` — the
  Scene's trailing colon let the sentence-splitter merge it with the AppMoment text and the
  first Takeaway sentence). Fixed by ending the AppMoment error text with a period so sentence
  boundaries are unambiguous. Re-ran → `UTH lint: clean`.
- `npm run build` → `✓ built in …` (green)

## Task 7 — Phases 3–4 stem audit + notes 3.7, 3.11, 4.11

### Stem audit (phases 3, 4)

All quiz `code` fields in phases 3–4 checked directly (~65 questions). Every one uses concrete
literal values (function calls with fixed arguments, arrays/objects with fixed contents) — no
2.3-style hidden parametric facts, no trick-pointer phrasing ("notice…"/"hint:"). "Careful —"
appears twice (4.3 Q2, 4.9 Q3) as an existing app-wide idiom (a mild attention flag, not a
reveal of the answer or mechanism), left unchanged. **Zero new failures.**

### Note migrations (3.7, 3.11, 4.11)

| lesson | surface | before | after |
|---|---|---|---|
| 3.7 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> this is why a Playwright helper like `makeLogin(page)` can hand back a function that still knows its page, wherever the call happens. Backpacks everywhere.`` | New `onTheJob` section: `ReviewCard` (`login-helper.js`, a `makeLogin(page)` closure returning a function that still calls `page.click(...)`) + `Takeaway`: "The returned function still knows page, wherever it gets called. **Closures are why a Playwright helper can carry its page around in its backpack.**" |
| 3.11 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> your career quietly begins here: pure, composed functions are exactly what unit tests are written against. expect(tipAmount(1200, 10)).toBe(120) — one line, no setup, no browser, no server. In Phase 10 you write exactly that with Vitest. The functions you wrote today would pass unchanged. You didn't just finish functions; you built your first testable unit.`` | New `onTheJob` section: `ReviewCard` (`tip.test.js`, `expect(tipAmount(1200, 10)).toBe(120);` annotated "no setup, no browser, no server") + `Takeaway`: "Pure, composed functions are exactly what unit tests are written against. The functions you wrote today would pass this test unchanged. **You just built your first testable unit.** Phase 10 teaches this with Vitest." |
| 4.11 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> the options-object pattern is the one to internalize: it's why page.goto(url, { waitUntil: "load" }) and test.use({ viewport: … }) look the way they do. Named fields survive redesigns — adding a new option never breaks old callers, because extra and missing fields are handled gracefully.`` | New `onTheJob` section: `ReviewCard` (`checkout.spec.js`, `page.goto(url, { waitUntil: "load" });` + `test.use({ viewport: { width: 1280, height: 720 } });`) + `Takeaway`: "Both calls destructure an options object. **Named fields survive redesigns: a new option never breaks old callers.** Missing fields are handled gracefully too." |

### Verification (Task 7)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase3 src/lessons/phase4` → no matches

## Task 8 — Phases 5–6 stem audit + notes 5.2, 5.4, 5.9, 6.2, 6.8 (+ relocation into 6.7)

### Stem audit (phases 5, 6)

All quiz `code`/situation fields checked directly (~48 questions). One fix:

| lesson | surface | before | after |
|---|---|---|---|
| 6.9 Q3 | quiz stem | `Test suites fake network responses instead of calling real APIs mainly for ___ — type the word (hint: the opposite of flaky).` | `Real network calls are unpredictable: sometimes slow, sometimes down. Test suites fake the response instead, so every run gives the same result. Type the one word for that quality.` (removed the explicit `hint:` trick-pointer per rule 3; widened `accept` to add `consistency`, `Consistency`, `repeatability` since the reworded stem now more directly evokes those synonyms) |

All other stems self-contained via concrete code/situations. No other `hint:`/`notice…` pointers
found in quiz stems (three "Notice…" hits found by grep are all in step `caption`s or exercise
task text, out of the audit's scope — quiz array only).

### Note migrations (5.2, 5.4, 5.9, 6.2, 6.8) + one relocation (6.7)

| lesson | surface | before | after |
|---|---|---|---|
| 5.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> interviewers phrase this a dozen ways — "is let hoisted?" is the trap. The precise answer: yes, all declarations are registered in pass 1 — but let/const are registered uninitialized, so unlike var they throw instead of reading undefined. That sentence separates memorizers from understanders.` | New `onTheJob` section: interview exchange, two `ChatBubble`s ("Is let hoisted?" / "Yes. All declarations are registered in pass one. But let and const are registered uninitialized, so they throw instead of reading undefined.") + `Takeaway`: "**That one sentence separates memorizers from understanders.**" |
| 5.4 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> Playwright test code uses arrows almost everywhere precisely to avoid this entire topic. But Page Object classes (11.9) use this.page constantly, via the implicit and new rules. You'll use all four rules weekly; you'll debug rule 2 (lost this) at least once in your career.` | New `onTheJob` section: `ReviewCard` (two lines contrasting an arrow-based test with a Page Object class method using `this.page`) + `Takeaway`: "Test code hides behind arrows to avoid this entirely. **Page Object classes use this constantly, and you will debug a lost this at least once.**" |
| 5.9 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> why interviewers ask these: not to see if you memorized outcomes, but to hear which model you reason with. "undefined because hoisting" is a memorizer's answer. "Pass one registered the name with undefined; the assignment is pass-two work" is an understander's answer. Same output, different career.` | New `onTheJob` section: interview exchange, `ChatBubble` "a memorizer" ("undefined, because hoisting.") vs `ChatBubble` "you, after this lesson" ("Pass one registered the name with undefined. The assignment is pass-two work.") + `Takeaway`: "Same output, **different career**. Interviewers listen for which model you reason with, not just the right word." |
| 6.2 | onTheJob (was UTH 💼 note) | `<strong>💼 On the job —</strong> the event loop is not part of the JavaScript engine. V8 has the stack and heap; the loop, timers and queue live in the environment — the browser here; Node's version arrives in 9.6.` | New `onTheJob` section: interview exchange ("Is the event loop part of the JavaScript engine?" / "No. The engine only has the stack and the heap. The loop, timers, and queue live in the browser. Node has its own version, coming in lesson 9.6.") + `Takeaway`: "**The event loop is not part of the JavaScript engine.** It lives in the environment around it." |
| 6.8 | onTheJob (was UTH 💼 note) | ``<strong>💼 On the job —</strong> Playwright code awaits sequentially when steps depend (click → then assert). Promise.all is for genuinely simultaneous things. The classic: await Promise.all([page.waitForNavigation(), page.click("a")]) — start listening BEFORE the click that triggers it.`` | New `onTheJob` section: `ReviewCard` (`nav.spec.js`, `await Promise.all([page.waitForNavigation(), page.click("a")]);` annotated "start listening before the click") + `Takeaway`: "Steps that depend on each other await one at a time. **Promise.all is for genuinely simultaneous things, started before they are triggered.** That order is a professional reflex." |
| 6.7 | onTheJob (**new — relocated from 1.10**) | (6.7 had no badged 💼 note) | New `onTheJob` section carrying 1.10's displaced example, rebuilt with 6.7's now-taught status-code vocabulary and this lesson's own Pokémon example: `ReviewCard` (`pokemon.spec.js`, `res.status === 200 && data.id === 25 && ms < 2000`) + `Takeaway`: "Three comparisons and two &&s, evaluating to one true or false. **Remember 1.10's boolean grammar? This is the same tree, now with real status codes and data.**" (explicit callback to 1.10, as the plan's Task 10 note anticipated) |

### Verification (Task 8)

- `node scripts/lint-uth.mjs` → `UTH lint: clean`
- `npm run build` → `✓ built in …` (green)
- `grep -rn "💼" src/lessons/phase5 src/lessons/phase6` → no matches

## Relocations log

- **2.3's status-code example** ("Status 2xx → pass, 4xx → client error, 5xx → server error")
  from the old 💼 note is not carried into the new Task-5 onTheJob section (that content is
  fixed verbatim by the plan). Per the plan's Task 10 note, this status-code chain is to land
  as a callback in a Phase 9/10 lesson (9.7 or similar) — pending, tracked here so it isn't
  lost. All other facts from the four migrated Phase-2 notes (dead-code silence, falsy edge
  values, data-driven test counters) are fully re-expressed in their new sections above.
- **1.10's status-code assertion example** ("Status is 200 AND the reply includes the id AND
  it took under 2 seconds") — **RESOLVED in Task 8.** Landed in lesson 6.7 "fetch & APIs" as a
  new `onTheJob` section (6.7 had no badged note), rebuilt with 6.7's now-taught status-code
  vocabulary and an explicit callback line ("Remember 1.10's boolean grammar?").
